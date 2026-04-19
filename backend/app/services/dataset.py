import os
import uuid
import sqlite3

from app.db import supabase
from app.config import settings
from app.engine.data_generator.generator import DataGenerator
from app.engine.data_generator.utils import generate_schema


async def create_dataset(
    user_id: str, name: str, industry: str, description: str, size: str
) -> dict:
    dataset_id = str(uuid.uuid4())
    db_path = f"{settings.sqlite_base_path}/{dataset_id}.db"
    storage_path = f"{user_id}/{dataset_id}.db"

    try:
        schema = await generate_schema(industry, description, size)

        os.makedirs(settings.sqlite_base_path, exist_ok=True)
        generator = DataGenerator(schema, db_path)
        total_rows = generator.generate()

        _upload_to_storage(db_path, storage_path)

        supabase.table("datasets").insert(
            {
                "id": dataset_id,
                "user_id": user_id,
                "name": name,
                "industry": industry,
                "description": description,
                "size": size,
                "row_count": total_rows,
                "schema": schema,
                "db_path": storage_path,
            }
        ).execute()

        return {
            "id": dataset_id,
            "name": name,
            "schema": schema,
            "row_count": total_rows,
        }

    finally:
        if os.path.exists(db_path):
            os.remove(db_path)


def _upload_to_storage(local_path: str, storage_path: str):
    try:
        with open(local_path, "rb") as f:
            supabase.storage.from_("datasets").upload(
                path=storage_path,
                file=f,
                file_options={"content-type": "application/octet-stream"},
            )

    except Exception as e:
        print("ERROR UPLOAD TO STORAGE")
        print(storage_path)
        print(local_path)
        print(e)
        raise e


def get_dataset_table(db_path: str, table_name):
    res = supabase.storage.from_("datasets").download(db_path)
    local_db_path = f"{settings.sqlite_base_path}/{db_path}"

    os.makedirs(os.path.dirname(local_db_path), exist_ok=True)
    with open(local_db_path, "wb") as f:
        f.write(res)

    conn = sqlite3.connect(local_db_path)

    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    columns = [col[0] for col in cursor.description]

    conn.close()

    return {"columns": columns, "rows": rows}
