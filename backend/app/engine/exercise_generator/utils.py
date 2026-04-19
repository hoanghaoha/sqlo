import json
import re
import anthropic
from app.config import settings


SYSTEM_PROMPT = """
You are a SQL instructor creating practice exercises for a SQL learning platform.
Given a database schema and parameters, generate a single SQL exercise.
Respond with valid JSON only. No explanation, no markdown, no code blocks.

Output format:
{
  "name": "short, descriptive name (3-8 words) for the exercise",
  "description": "clear problem statement — what the student must query, including the expected output columns and any ordering/filtering requirements",
  "solution": "the correct SQLite SQL query that solves the problem"
}

Rules:
- The solution must be valid SQLite SQL that runs on the given schema
- Match the difficulty level exactly
- Focus only on the requested topics
- Use the exact table and column names from the schema
- The description must be self-contained and explicitly state the expected output
"""


def build_user_prompt(
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


client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


async def generate_exercise(
    industry: str,
    schema: dict,
    topics: str,
    level: str,
    additional_input: str | None,
) -> dict:
    message = await client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": build_user_prompt(
                    industry, schema, topics, level, additional_input
                ),
            }
        ],
    )

    raw = message.content[0].text.strip()  # type: ignore
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

    return json.loads(raw.strip())
