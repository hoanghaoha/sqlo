import uuid
from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import get_current_user
from app.engine.hint_generator.utils import generate_hint
from app.models.exercise import CreateExerciseRequest, HintRequest, SubmitRequest
from app.db import supabase
from app.services.exercise import create_exercise
from app.services.plan import check_exercise_limit
from app.services.dataset import query_dataset
from app.services.score import (
    record_failed_submit,
    record_hint,
    record_solution_viewed,
    record_solved,
)

router = APIRouter()


def _attach_solved(exercises: list[dict], user_id: str) -> list[dict]:
    if not exercises:
        return exercises
    ids = [e["id"] for e in exercises]
    scores = (
        supabase.table("scores")
        .select("exercise_id")
        .eq("user_id", user_id)
        .eq("solved", True)
        .in_("exercise_id", ids)
        .execute()
    )
    solved_ids = {s["exercise_id"] for s in (scores.data or [])}
    for e in exercises:
        e["is_solved"] = e["id"] in solved_ids
    return exercises


def _require_exercise_access(exercise_id: str, user_id: str) -> dict:
    result = (
        supabase.table("exercises")
        .select("*")
        .eq("id", exercise_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Exercise not found")
    ex = result.data
    if ex["user_id"] != user_id and not ex.get("visibility"):
        raise HTTPException(status_code=403, detail="Access denied")
    return ex


@router.get("/")
async def get_user_exercises_endpoint(user_id: str = Depends(get_current_user)):
    result = (
        supabase.table("exercises")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return _attach_solved(result.data or [], user_id)


@router.get("/community")
async def get_community_exercises_endpoint(
    level: str | None = None,
    industry: str | None = None,
    limit: int = 50,
    offset: int = 0,
    user_id: str = Depends(get_current_user),
):
    query = (
        supabase.table("exercises")
        .select("*,datasets(industry)")
        .eq("visibility", True)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
    )
    if level:
        query = query.eq("level", level)

    result = query.execute()
    exercises = result.data or []

    if industry:
        exercises = [
            e for e in exercises
            if (e.get("datasets") or {}).get("industry") == industry
        ]

    user_ids = list({e["user_id"] for e in exercises})
    author_map: dict[str, dict] = {}
    if user_ids:
        authors = (
            supabase.table("leaderboard")
            .select("user_id,display_name,avatar_url")
            .in_("user_id", user_ids)
            .execute()
        )
        author_map = {a["user_id"]: a for a in (authors.data or [])}

    for ex in exercises:
        author = author_map.get(ex["user_id"], {})
        ex["author_name"] = author.get("display_name") or "Anonymous"
        ex["author_avatar"] = author.get("avatar_url")
        ex["industry"] = (ex.get("datasets") or {}).get("industry")
        ex["is_owner"] = ex["user_id"] == user_id
        ex.pop("datasets", None)

    return _attach_solved(exercises, user_id)


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
    return _require_exercise_access(exercises_id, user_id)


@router.post("/")
async def create_exercise_endpoint(
    body: CreateExerciseRequest, user_id: str = Depends(get_current_user)
):
    check_exercise_limit(user_id)
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
    ex = _require_exercise_access(exercise_id, user_id)

    dataset = (
        supabase.table("datasets")
        .select("db_path")
        .eq("id", ex["dataset_id"])
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

    solution_result = query_dataset(db_path, ex["solution"])

    solved = user_result["columns"] == solution_result["columns"] and sorted(
        map(tuple, user_result["rows"])
    ) == sorted(map(tuple, solution_result["rows"]))

    try:
        if solved:
            record_solved(user_id, exercise_id)
        else:
            record_failed_submit(user_id, exercise_id)
    except Exception as e:
        print(f"[score] record error: {e}")

    return {
        "solved": solved,
        "user_result": user_result,
        "solution_result": solution_result,
    }


@router.post("/hint")
async def create_hint_endpoint(
    body: HintRequest, user_id: str = Depends(get_current_user)
):
    _require_exercise_access(body.exercise_id, user_id)

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
    ex = _require_exercise_access(exercise_id, user_id)

    record_solution_viewed(user_id, exercise_id)

    return {"solution": ex["solution"]}


@router.put("/exercise/{exercise_id}/visibility")
async def update_visibility_endpoint(
    exercise_id: str,
    user_id: str = Depends(get_current_user),
):
    exercise = (
        supabase.table("exercises")
        .select("visibility")
        .eq("id", exercise_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not exercise.data:
        raise HTTPException(status_code=404, detail="Exercise not found")

    new_visibility = not exercise.data["visibility"]
    supabase.table("exercises").update({"visibility": new_visibility}).eq(
        "id", exercise_id
    ).execute()

    return {"visibility": "public" if new_visibility else "private"}


@router.delete("/exercise/{exercise_id}")
async def delete_exercise_endpoint(
    exercise_id: str, user_id: str = Depends(get_current_user)
):
    try:
        supabase.table("exercises").delete().eq("id", exercise_id).eq(
            "user_id", user_id
        ).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"delete": True}


@router.post("/exercise/{exercise_id}/save")
async def save_exercise_endpoint(
    exercise_id: str, user_id: str = Depends(get_current_user)
):
    ex = _require_exercise_access(exercise_id, user_id)
    check_exercise_limit(user_id)

    new_id = str(uuid.uuid4())
    supabase.table("exercises").insert({
        "id": new_id,
        "user_id": user_id,
        "dataset_id": ex["dataset_id"],
        "name": ex["name"],
        "description": ex["description"],
        "topics": ex["topics"],
        "level": ex["level"],
        "solution": ex["solution"],
        "visibility": False,
    }).execute()

    return {"id": new_id}
