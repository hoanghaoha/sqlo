import uuid

from app.db import supabase
from app.engine.exercise_generator.generator import ExerciseGenerator


async def create_exercise(
    user_id: str,
    dataset_id: str,
    industry: str,
    schema: dict,
    topics: list[str],
    level: str,
    additional_input: str | None,
) -> dict:
    generator = ExerciseGenerator(
        dataset_id=dataset_id,
        industry=industry,
        schema=schema,
        topics=topics,
        level=level,
        additional_input=additional_input,
    )
    exercise = await generator.generate()

    exercise = {"id": str(uuid.uuid4()), "user_id": user_id, **exercise}
    supabase.table("exercises").insert(exercise).execute()

    return exercise
