from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import get_current_user
from app.db import supabase
from app.services.score import get_summary

router = APIRouter()


@router.get("/")
async def list_my_scores_endpoint(user_id: str = Depends(get_current_user)):
    result = (
        supabase.table("scores")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/summary")
async def my_summary_endpoint(user_id: str = Depends(get_current_user)):
    return get_summary(user_id)


@router.get("/exercise/{exercise_id}")
async def get_exercise_score_endpoint(
    exercise_id: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("scores")
        .select("*")
        .eq("user_id", user_id)
        .eq("exercise_id", exercise_id)
        .maybe_single()
        .execute()
    )
    if not result or not result.data:
        raise HTTPException(status_code=404, detail="No score yet")
    return result.data
