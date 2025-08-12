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
    image_url: Optional[List[str]]

    class Config:
        from_attributes = True

class ProductImageOut(BaseModel):
    id: UUID
    big_image_url: Optional[str]

    class Config:
        from_attributes = True
