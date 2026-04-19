from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import get_current_user
from app.models.exercise import CreateExerciseRequest
from app.db import supabase
from app.services.exercise import create_exercise

router = APIRouter()


@router.get("/")
async def get_user_exercises_endpoint(user_id: str = Depends(get_current_user)):
    result = (
        supabase.table("exercises")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


@router.get("/{dataset_id}")
async def get_dataset_exercises_endpoint(
    dataset_id: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("exercises")
        .select("*")
        .eq("dataset_id", dataset_id)
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


@router.get("/exercise/{exercises_id}")
async def get_exercise_endpoint(
    exercises_id: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("exercises")
        .select("*")
        .eq("user_id", user_id)
        .eq("id", exercises_id)
        .single()
        .execute()
    )

    return result.data


@router.post("/")
async def create_exercise_endpoint(
    body: CreateExerciseRequest, user_id: str = Depends(get_current_user)
):
    dataset = (
        supabase.table("datasets")
        .select("industry,schema")
        .eq("id", body.dataset_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not dataset.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        return await create_exercise(
            user_id=user_id,
            dataset_id=body.dataset_id,
            industry=dataset.data["industry"],  # type: ignore
            schema=dataset.data["schema"],  # type : ignore
            topics=body.topics,
            level=body.level,
            additional_input=body.additional_input,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
