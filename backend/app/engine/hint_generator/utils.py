import anthropic
from app.config import settings


SYSTEM_PROMPT = """
You are a SQL tutor helping a student solve a SQL exercise.
Given the exercise description, the dataset schema, the correct solution, and the student's current SQL attempt, provide a short, targeted hint.

Rules:
- Do NOT reveal the full solution or write the correct query verbatim
- Compare the student's query to the solution to identify the specific gap
- Point out what concept, clause, or column is missing or wrong
- Return 1-3 lines, one idea per line, no blank lines between them
- Each line must be a plain sentence — no markdown, no backticks, no bold, no bullet points
- If the student's SQL is empty or trivial, hint at what tables/columns to start from
- Reference specific table/column names from the schema when helpful
"""


def build_user_prompt(
    sql: str,
    dataset_schema: str,
    exercise_name: str,
    exercise_description: str,
    solution: str,
) -> str:
    return f"""Exercise: {exercise_name}
Description: {exercise_description}

Schema:
{dataset_schema}

Correct solution (do not reveal):
{solution}

Student's current query:
{sql if sql.strip() else "(empty)"}
"""


client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)


async def generate_hint(
    sql: str,
    dataset_schema: str,
    exercise_name: str,
    exercise_description: str,
    solution: str,
) -> str:
    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=256,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": build_user_prompt(
                    sql, dataset_schema, exercise_name, exercise_description, solution
                ),
            }
        ],
    )

    return message.content[0].text.strip()  # type: ignore
