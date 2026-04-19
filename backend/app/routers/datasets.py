from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import get_current_user
from app.db import supabase
from app.models.dataset import (
    CreateDatasetRequest,
    QueryDatasetRequest,
    UpdateDatasetRequest,
)
from app.services.dataset import create_dataset, query_dataset

router = APIRouter()


@router.post("/")
async def create_dataset_endpoint(
    body: CreateDatasetRequest, user_id: str = Depends(get_current_user)
):
    try:
        result = await create_dataset(
            user_id, body.name, body.industry, body.description, body.size
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_datasets_endpoint(user_id: str = Depends(get_current_user)):
    result = (
        supabase.table("datasets")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data


@router.get("/{dataset_id}")
async def get_dataset_endpoint(
    dataset_id: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("datasets")
        .select("*")
        .eq("id", dataset_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    return result.data


@router.patch("/{dataset_id}")
async def update_dataset_endpoint(
    dataset_id: str,
    body: UpdateDatasetRequest,
    user_id: str = Depends(get_current_user),
):
    existing = (
        supabase.table("datasets")
        .select("id")
        .eq("id", dataset_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not existing.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("datasets")
        .update(updates)
        .eq("id", dataset_id)
        .eq("user_id", user_id)
        .execute()
    )

    return result.data[0]


@router.delete("/{dataset_id}")
async def delete_dataset_endpoint(
    dataset_id: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("datasets")
        .select("db_path")
        .eq("id", dataset_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    supabase.table("datasets").delete().eq("id", dataset_id).eq(
        "user_id", user_id
    ).execute()

    supabase.storage.from_("datasets").remove([result.data["db_path"]])  # type: ignore

    return {"deleted": True}


@router.get("/{dataset_id}/{table_name}")
async def get_dataset_table_endpoint(
    dataset_id: str, table_name: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("datasets")
        .select("db_path")
        .eq("id", dataset_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    table = query_dataset(result.data["db_path"], f"SELECT * FROM {table_name}")  # type: ignore
    return table


@router.post("/{dataset_id}")
async def query_dataset_endpoint(
    body: QueryDatasetRequest, dataset_id: str, user_id: str = Depends(get_current_user)
):
    result = (
        supabase.table("datasets")
        .select("db_path")
        .eq("id", dataset_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        table = query_dataset(result.data["db_path"], body.query)  # type: ignore
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return table
