from app.engine.exercise_generator.utils import generate_exercise


class ExerciseGenerator:
    """
    Generate a SQL practice exercise from a dataset schema.

    Wraps the LLM call and returns a structured exercise payload ready
    to persist to the exercises table.
    """

    def __init__(
        self,
        dataset_id: str,
        industry: str,
        schema: dict,
        topics: list[str],
        level: str,
        additional_input: str | None = None,
    ):
        self.dataset_id = dataset_id
        self.industry = industry
        self.schema = schema
        self.topics = topics
        self.level = level
        self.additional_input = additional_input

    async def generate(self) -> dict:
        result = await generate_exercise(
            self.industry,
            self.schema,
            ",".join(self.topics),
            self.level,
            self.additional_input,
        )
        return {
            "dataset_id": self.dataset_id,
            "name": result["name"],
            "description": result["description"],
            "topics": self.topics,
            "level": self.level,
            "solution": result["solution"],
        }
