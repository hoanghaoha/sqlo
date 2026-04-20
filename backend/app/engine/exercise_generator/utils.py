import json
import re
import sqlite3
import anthropic
from app.config import settings


TOPIC_PROMPT = """
You are a SQL instructor creating practice exercises for a SQL learning platform.

Given a database schema and parameters, generate a single SQL exercise that can be automatically graded by running the student's query and comparing its rows to a reference solution.

Respond with valid JSON only. No explanation, no markdown, no code blocks.

Output format:
{
  "name": "short, descriptive name (3-8 words)",
  "description": "detailed problem statement written in Markdown (see structure below)"
}

The description MUST be written in Markdown using these sections, in this order. Each section heading uses `###`. Omit conditional sections that don't apply.

### Context
1-2 sentences framing the business problem.

### Task
What the student must compute.

### Output columns
A bullet list of the EXACT columns the query must return, in the EXACT order, using the EXACT names. Wrap column names in backticks. For computed columns, specify the alias (e.g., "`total_revenue` — aliased from `SUM(amount)`"). Do not allow alternate names.

### Filters
(Conditional) A bullet list of every WHERE condition, with exact literal values, thresholds, and date ranges. Omit this section if no filters are needed.

### Grouping
(Conditional) The aggregation functions and grouping keys. Omit if the query does not group.

### Ordering
REQUIRED. The sort column(s) and direction (ASC/DESC). Ensures grading is deterministic — two correct solutions must produce identical row sequences.

### Limit
(Conditional) e.g., "Return only the top 5 rows." Omit if no limit.

### Tie-breaking
(Conditional) If the primary sort column has possible ties, specify a secondary sort key to keep the result unique.

Rules:
- Use valid Markdown: `###` headers, `-` bullet lists, backticks for identifiers, **bold** for emphasis when useful.
- Do NOT include the solution SQL.
- Use the exact table and column names from the schema.
- The description must be precise enough that any correct solution produces identical rows in identical order.
- Match the difficulty level exactly.
- Focus only on the requested topics.
- Avoid ambiguity: no "approximately", "around", or "some". Use specific values.
"""


SOLUTION_PROMPT = """
You are a SQL expert solving a SQL exercise.

Given:
- A database schema
- An exercise name and description

Generate the correct SQLite SQL query that answers the exercise.

Respond with valid JSON only. No explanation, no markdown, no code blocks.

Output format:
{
  "solution": "the correct SQLite SQL query"
}

Rules:
- The query must be valid SQLite SQL and run without error on real SQLite.
- Use only the tables and columns from the schema.
- Follow the description exactly.
- Return ONLY the columns the description specifies, in the EXACT order and with the EXACT names/aliases given.
- Apply filtering, grouping, and aggregation as specified.
- Include an ORDER BY clause matching the description's ordering. If the description specifies tie-breaking, include the secondary sort key. Result must be deterministic.
- Do not use Postgres, MySQL, or T-SQL-specific syntax.
"""


REVIEW_PROMPT = """
You are a SQL expert fixing a failed SQLite query.

A previous solution was run on real SQLite and failed. Produce a corrected query.

Respond with valid JSON only. No explanation, no markdown, no code blocks.

Output format:
{
  "solution": "the corrected SQLite SQL query"
}

Rules:
- The corrected query must run on real SQLite without error
- Keep the original intent described in the exercise
- Use only the tables and columns from the schema
- Do not use Postgres, MySQL, or T-SQL-specific syntax
"""


def build_user_exercise_prompt(
    industry: str,
    schema: dict,
    topics: str,
    level: str,
    additional_input: str | None,
) -> str:
    schema_text = json.dumps(schema, indent=2)
    extra = f"\nAdditional instructions: {additional_input}" if additional_input else ""
    return f"""Industry: {industry}
Level: {level}
Topics: {topics}{extra}

Schema:
{schema_text}
"""


def build_user_solution_prompt(
    schema: dict,
    name: str,
    description: str,
) -> str:
    schema_text = json.dumps(schema, indent=2)
    return f"""Exercise name: {name}
Exercise description: {description}

Schema:
{schema_text}
"""


def build_review_prompt(
    schema: dict,
    name: str,
    description: str,
    bad_sql: str,
    error: str,
) -> str:
    schema_text = json.dumps(schema, indent=2)
    return f"""Exercise name: {name}
Exercise description: {description}

Schema:
{schema_text}

Previous SQL that failed on SQLite:
{bad_sql}

SQLite error:
{error}
"""


client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw.strip())


def _apply_schema(conn: sqlite3.Connection, schema: dict) -> None:
    cur = conn.cursor()
    for table in schema["tables"]:
        col_defs = []
        for col in table["columns"]:
            col_def = f"{col['name']} {col['type']}"
            if col.get("primary_key"):
                col_def += " PRIMARY KEY AUTOINCREMENT"
            if not col.get("nullable", True) and not col.get("primary_key"):
                col_def += " NOT NULL"
            if col.get("unique"):
                col_def += " UNIQUE"
            col_defs.append(col_def)
        cur.execute(
            f"CREATE TABLE IF NOT EXISTS {table['name']} ({', '.join(col_defs)})"
        )


def _validate_on_sqlite(schema: dict, sql: str) -> str | None:
    """Run the query on an in-memory SQLite DB built from the schema.
    Returns None on success, or the SQLite error message on failure.
    """
    conn = sqlite3.connect(":memory:")
    try:
        _apply_schema(conn, schema)
        cur = conn.cursor()
        cur.execute(sql)
        cur.fetchall()
        return None
    except Exception as e:
        return str(e)
    finally:
        conn.close()


async def generate_exercise_topic(
    industry: str,
    schema: dict,
    topics: str,
    level: str,
    additional_input: str | None,
) -> dict:
    message = await client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=2048,
        system=TOPIC_PROMPT,
        messages=[
            {
                "role": "user",
                "content": build_user_exercise_prompt(
                    industry, schema, topics, level, additional_input
                ),
            }
        ],
    )
    data = _parse_json(message.content[0].text)  # type: ignore
    return {"name": data["name"], "description": data["description"]}


async def generate_exercise_solution(
    schema: dict,
    name: str,
    description: str,
    max_retries: int = 2,
) -> dict:
    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SOLUTION_PROMPT,
        messages=[
            {
                "role": "user",
                "content": build_user_solution_prompt(schema, name, description),
            }
        ],
    )
    sql = _parse_json(message.content[0].text)["solution"]  # type: ignore

    error = _validate_on_sqlite(schema, sql)
    if error is None:
        return {"solution": sql}

    for _ in range(max_retries):
        message = await client.messages.create(
            model="claude-opus-4-7",
            max_tokens=2048,
            system=REVIEW_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": build_review_prompt(
                        schema, name, description, sql, error
                    ),
                }
            ],
        )
        sql = _parse_json(message.content[0].text)["solution"]  # type: ignore
        error = _validate_on_sqlite(schema, sql)
        if error is None:
            return {"solution": sql}

    raise RuntimeError(f"Failed to generate a valid SQLite solution: {error}")


async def generate_exercise(
    industry: str,
    schema: dict,
    topics: str,
    level: str,
    additional_input: str | None,
) -> dict:
    topic = await generate_exercise_topic(
        industry, schema, topics, level, additional_input
    )
    solution = await generate_exercise_solution(
        schema, topic["name"], topic["description"]
    )
    return {**topic, **solution}
