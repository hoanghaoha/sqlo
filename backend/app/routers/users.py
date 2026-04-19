from fastapi import APIRouter, Depends
from app.auth.jwt import get_current_user
from app.db import supabase
from app.models.user import UserUpdate

router = APIRouter()


@router.post("/onboard")
async def onboard_user(user_id: str = Depends(get_current_user)):
    existing = supabase.table("users").select("id").eq("id", user_id).execute()

    if existing.data:
        return {"created": False}

    supabase.table("users").insert({"id": user_id, "plan": "free"}).execute()
    return {"created": True}


@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)):
    result = supabase.table("users").select("*").eq("id", user_id).single().execute()
    return result.data


@router.put("/me")
async def update_me(body: UserUpdate, user_id: str = Depends(get_current_user)):
    supabase.table("users").update(body.model_dump(exclude_none=True)).eq(
        "id", user_id
    ).execute()
    return {"updated": True}
