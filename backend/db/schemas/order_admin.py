# db/schemas/order_admin.py
from pydantic import BaseModel
from typing import Literal

class OrderStatusUpdate(BaseModel):
    status: str
