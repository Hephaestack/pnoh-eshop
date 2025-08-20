from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_
from zoneinfo import ZoneInfo

from utils.database import get_db
from utils.admin_auth import get_current_admin, Admin  # προσαρμόσ’ το στο project σου
from db.models.order import Order, OrderStatus, PaymentStatus
from db.schemas.order import OrderOut

router = APIRouter()

def _parse_dt(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value)
    except ValueError:
        try:
            dt = datetime.strptime(value, "%Y-%m-%d")
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid date: {value}")
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("Europe/Athens"))
    return dt

