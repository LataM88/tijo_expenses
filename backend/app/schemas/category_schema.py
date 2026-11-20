from pydantic import BaseModel, ConfigDict, Field


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: str = Field(..., min_length=4, max_length=7, pattern=r"^#[0-9A-Fa-f]{3,6}$")


class CategoryOut(BaseModel):
    id: int
    name: str
    color: str

    model_config = ConfigDict(from_attributes=True)
