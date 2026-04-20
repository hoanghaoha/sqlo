from enum import Enum
from pydantic import BaseModel


class SizeEnum(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"


class CreateDatasetRequest(BaseModel):
    name: str
    industry: str
    description: str
    size: SizeEnum = SizeEnum.medium


class UpdateDatasetRequest(BaseModel):
    name: str | None = None
    description: str | None = None


class GetDatasetTableRequest(BaseModel):
    db_path: str
    table_name: str


class QueryDatasetRequest(BaseModel):
    query: str
