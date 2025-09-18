from typing import Optional
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel
from .product import ProductOut

class OrderItemBase(BaseModel):
    id: UUID
    product_id: Optional[UUID] = None
    product_name: str
    product_sku: Optional[str] = None
    product_image: Optional[str] = None
    unit_amount: Decimal
    quantity: int
    line_total: Decimal

    class Config:
        from_attributes = True

class OrderItemOut(OrderItemBase):
    product: Optional[ProductOut] = None