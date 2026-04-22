from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth.jwt import get_current_user
from app.db import supabase

router = APIRouter()


class FeedbackRequest(BaseModel):
    type: str
    message: str


@router.post("/")
async def create_feedback_endpoint(
    body: FeedbackRequest, user_id: str = Depends(get_current_user)
):
    supabase.table("feedbacks").insert(
        {"user_id": user_id, "type": body.type, "message": body.message}
    ).execute()
    return {"created": True}
