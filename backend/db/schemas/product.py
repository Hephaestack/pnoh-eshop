from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from datetime import datetime

class ProductSummary(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    price: float
    stock_quantity: int
    category: Optional[str]
    sub_category: Optional[str]
    image_url: List[str]
    created_at: datetime
    updated_at: datetime
    wishlist: "WishlistSummary"

    class Config:
        orm_mode = True

from db.schemas.wishlist import WishlistSummary
ProductSummary.model_rebuild()