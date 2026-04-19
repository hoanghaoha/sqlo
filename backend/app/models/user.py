from pydantic import BaseModel
from typing import Optional
from enum import Enum


class LevelEnum(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class PurposeEnum(str, Enum):
    learning = "learning"
    interview = "interview"
    work = "work"


class Plan(str, Enum):
    free = "free"
    pro = "pro"
    premium = "premium"


class UserUpdate(BaseModel):
    industry: Optional[str] = None
    level: Optional[LevelEnum] = None
    purpose: Optional[PurposeEnum] = None
    plan: Optional[Plan] = None
