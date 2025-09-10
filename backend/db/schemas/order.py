from typing import List, Optional
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, computed_field

from .order_item import OrderItemOut

class OrderBase(BaseModel):
    id: UUID
    status: str
    payment_status: str
    currency: str
    subtotal_amount: Decimal
    shipping_amount: Decimal
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime
    shipping_name: Optional[str] = None
    shipping_phone: Optional[str] = None
    billing_name: Optional[str] = None
    customer_details: Optional[dict] = None
    shipping_details: Optional[dict] = None

    class Config:
        from_attributes = True

class OrderOut(OrderBase):
    items: List[OrderItemOut]
    email: Optional[str] = None
    user_id: Optional[str] = None
    guest_session_id: Optional[str] = None

    @computed_field  # type: ignore[misc]
    @property
    def customer(self) -> Optional[str]:
        return self.shipping_name or self.billing_name

    @computed_field  # type: ignore[misc]
    @property
    def phone(self) -> Optional[str]:
        sd = self.shipping_details or {}
        cd = self.customer_details or {}
        return self.shipping_phone or sd.get("phone") or cd.get("phone")

    @computed_field  # type: ignore[misc]
    @property
    def shipping_address(self) -> str | None:
        parts = [
            self.shipping_address_line1,
            self.shipping_address_line2,
            self.shipping_city,
            self.shipping_state,
            self.shipping_postal_code,
            self.shipping_country,
        ]
        joined = ", ".join([p for p in parts if p])
        return joined or None
