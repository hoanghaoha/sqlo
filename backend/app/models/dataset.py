from enum import Enum
from pydantic import BaseModel


class SizeEnum(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"


class IndustryEnum(str, Enum):
    ecommerce = "e-commerce"
    healthcare = "healthcare"
    finance = "finance"
    education = "education"
    logistics = "logistics"
    hr = "hr"
    social = "social-media"
    restaurant = "restaurant"
    mr = "market-research"


class CreateDatasetRequest(BaseModel):
    name: str
    industry: IndustryEnum
    description: str
    size: SizeEnum = SizeEnum.medium


class GetDatasetTableRequest(BaseModel):
    db_path: str
    table_name: str
