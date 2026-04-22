from enum import Enum
from pydantic import BaseModel


class LevelEnum(str, Enum):
    BEGINNER = "beginner"
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    HELL = "hell"


class CreateExerciseRequest(BaseModel):
    dataset_id: str
    topics: list[str]
    level: LevelEnum
    additional_input: str | None = None


class SubmitRequest(BaseModel):
    sql: str


class HintRequest(BaseModel):
    exercise_id: str
    sql: str
    dataset_schema: str
    exercise_name: str
    exercise_description: str
    solution: str
