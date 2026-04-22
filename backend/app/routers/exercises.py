from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import get_current_user
from app.engine.hint_generator.utils import generate_hint
from app.models.exercise import CreateExerciseRequest, HintRequest, SubmitRequest
from app.db import supabase
from app.services.exercise import create_exercise
from app.services.dataset import query_dataset
from app.services.score import (
    record_failed_submit,
    record_hint,
    record_solution_viewed,
    record_solved,
)

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
            schema=dataset.data["schema"],  # type: ignore
            topics=body.topics,
            level=body.level,
            additional_input=body.additional_input,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/exercise/{exercise_id}/submit")
async def submit_exercise_endpoint(
    exercise_id: str, body: SubmitRequest, user_id: str = Depends(get_current_user)
):
    exercise = (
        supabase.table("exercises")
        .select("solution,dataset_id")
        .eq("id", exercise_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not exercise.data:
        raise HTTPException(status_code=404, detail="Exercise not found")

    dataset = (
        supabase.table("datasets")
        .select("db_path")
        .eq("id", exercise.data["dataset_id"])  # type: ignore
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not dataset.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    db_path: str = dataset.data["db_path"]  # type: ignore

    try:
        user_result = query_dataset(db_path, body.sql)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    solution_result = query_dataset(db_path, exercise.data["solution"])  # type: ignore

    solved = user_result["columns"] == solution_result["columns"] and sorted(
        map(tuple, user_result["rows"])
    ) == sorted(map(tuple, solution_result["rows"]))

    if solved:
        record_solved(user_id, exercise_id)
    else:
        record_failed_submit(user_id, exercise_id)

    return {
        "solved": solved,
        "user_result": user_result,
        "solution_result": solution_result,
    }


@router.post("/hint")
async def create_hint_endpoint(
    body: HintRequest, user_id: str = Depends(get_current_user)
):
    if not user_id:
        raise HTTPException(status_code=400, detail="User not found")
    hint = await generate_hint(
        sql=body.sql,
        dataset_schema=body.dataset_schema,
        exercise_name=body.exercise_name,
        exercise_description=body.exercise_description,
        solution=body.solution,
    )

    record_hint(user_id, body.exercise_id)

    return {"hint": hint}


@router.post("/exercise/{exercise_id}/solution")
async def view_solution_endpoint(
    exercise_id: str, user_id: str = Depends(get_current_user)
):
    exercise = (
        supabase.table("exercises")
        .select("solution")
        .eq("id", exercise_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not exercise.data:
        raise HTTPException(status_code=404, detail="Exercise not found")

    record_solution_viewed(user_id, exercise_id)

    return {"solution": exercise.data["solution"]}  # type: ignore


@router.delete("/exercise/{exercise_id}")
async def delete_exercise_endpoint(
    exercise_id: str, user_id: str = Depends(get_current_user)
):
    supabase.table("exercises").delete().eq("id", exercise_id).eq(
        "user_id", user_id
    ).execute()

    return {"delete": True}
