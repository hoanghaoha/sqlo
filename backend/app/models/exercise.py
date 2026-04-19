from enum import Enum
from pydantic import BaseModel


class LevelEnum(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    SUPER_HARD = "super_hard"


class CreateExerciseRequest(BaseModel):
    dataset_id: str
    topics: list[str]
    level: LevelEnum
    additional_input: str | None = None
