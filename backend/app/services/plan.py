from fastapi import HTTPException
from app.db import supabase

PLAN_LIMITS = {
    "free": {
        "datasets": 2,
        "exercises": 5,
        "dataset_sizes": ["small"],
    },
    "pro": {
        "datasets": None,
        "exercises": None,
        "dataset_sizes": ["small", "medium", "large"],
    },
}


def get_user_plan(user_id: str) -> str:
    result = supabase.table("users").select("plan").eq("id", user_id).single().execute()
    return (result.data or {}).get("plan", "free")


def check_dataset_limit(user_id: str, size: str) -> None:
    plan = get_user_plan(user_id)
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

    if size not in limits["dataset_sizes"]:
        raise HTTPException(status_code=403, detail="plan_limit_dataset_size")

    if limits["datasets"] is not None:
        count = (
            supabase.table("datasets")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .execute()
        )
        if (count.count or 0) >= limits["datasets"]:
            raise HTTPException(status_code=403, detail="plan_limit_datasets")


def check_exercise_limit(user_id: str) -> None:
    plan = get_user_plan(user_id)
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

    if limits["exercises"] is not None:
        count = (
            supabase.table("exercises")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .execute()
        )
        if (count.count or 0) >= limits["exercises"]:
            raise HTTPException(status_code=403, detail="plan_limit_exercises")
