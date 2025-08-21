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

class ProductBase(BaseModel):
    name: str
    description: Optional[str]
    price: float
    category: Optional[Category] = None
    sub_category: Optional[SubCategory] = None
    image_url: Optional[List[str]] = None
    big_image_url: Optional[List[str]] = None

class ProductCreate(ProductBase):
    pass

class ProductImageOut(BaseModel):
    id: UUID
    big_image_url: Optional[List[str]]

    class Config:
        from_attributes = True

class ProductUpdateRequest(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    category: Optional[Category]
    sub_category: Optional[SubCategory]
    image_url: Optional[List[str]]

class ProductOut(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
