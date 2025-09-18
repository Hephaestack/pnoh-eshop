from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional

class CartItemProduct(BaseModel):
    id: UUID
    name: str
    price: float
    image_url: Optional[List[str]] = None

    class Config:
        from_attributes = True

class CartItemOut(BaseModel):
    product: CartItemProduct
    line_total: float
