from pydantic import BaseModel


class SaveScoreRequest(BaseModel):
    level: str
    industry: str
    n_hints: int
    n_failed_submits: int
    used_solution: bool
