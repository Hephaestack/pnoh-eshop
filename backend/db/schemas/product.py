from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from db.models.product import Category, SubCategory

class ProductSummary(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    price: float
    category: Optional[Category]
    sub_category: Optional[SubCategory]
    image_url: List[str]

    class Config:
        orm_mode = True
