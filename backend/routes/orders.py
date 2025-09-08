from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import cast, or_, and_, String
from zoneinfo import ZoneInfo
import stripe

from utils.user_auth import get_current_user
from utils.database import get_db
from utils.admin_auth import get_current_admin, Admin
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


@router.get("/admin/orders/all", response_model=Dict[str, Any])
def admin_list_orders(
    q: Optional[str] = Query(None, description="Search id/email/user_id/stripe ids"),
    status: Optional[OrderStatus] = Query(None),
    payment_status: Optional[PaymentStatus] = Query(None),
    user_id: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None, description="ISO or YYYY-MM-DD"),
    date_to: Optional[str] = Query(None, description="ISO or YYYY-MM-DD"),
    min_total: Optional[float] = Query(None, ge=0),
    max_total: Optional[float] = Query(None, ge=0),
    sort_by: str = Query("created_at", pattern="^(created_at|total_amount|status|payment_status)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    query = (
        db.query(Order)
        .options(
            joinedload(Order.items)
        )
    )

    conditions = []

    if q:
        like = f"%{q.strip()}%"
        conditions.append(or_(
            cast(Order.id, String).ilike(like),
            Order.email.ilike(like),
            Order.user_id.ilike(like),
            Order.stripe_checkout_session_id.ilike(like),
            Order.stripe_payment_intent_id.ilike(like),
        ))

    if status is not None:
        conditions.append(Order.status == status)

    if payment_status is not None:
        conditions.append(Order.payment_status == payment_status)

    if user_id:
        conditions.append(Order.user_id == user_id)

    if email:
        conditions.append(Order.email.ilike(f"%{email.strip()}%"))

    df = _parse_dt(date_from)
    dt = _parse_dt(date_to)
    if df and dt:
        conditions.append(and_(Order.created_at >= df, Order.created_at <= dt))
    elif df:
        conditions.append(Order.created_at >= df)
    elif dt:
        conditions.append(Order.created_at <= dt)

    if min_total is not None:
        conditions.append(Order.total_amount >= float(min_total))
    if max_total is not None:
        conditions.append(Order.total_amount <= float(max_total))

    if conditions:
        query = query.filter(and_(*conditions))

    total = query.count()

    sort_map = {
        "created_at": Order.created_at,
        "total_amount": Order.total_amount,
        "status": Order.status,
        "payment_status": Order.payment_status,
    }
    sort_col = sort_map.get(sort_by, Order.created_at)
    sort_col = sort_col.desc() if sort_dir == "desc" else sort_col.asc()
    query = query.order_by(sort_col)

    offset = (page - 1) * limit
    rows: List[Order] = query.offset(offset).limit(limit).all()

    items: List[OrderOut] = [OrderOut.model_validate(o, from_attributes=True) for o in rows]

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "has_next": (offset + len(items)) < total,
    }


@router.get("/orders/confirm", tags=["orders"])
def confirm_order(
    session_id: str = Query(...),
    db: Session = Depends(get_db),
):
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")
    
    try:
        checkout_session = stripe.checkout.Session.retrieve(
            session_id,
            expand=["payment_intent", "customer_details"]
        )
    except stripe.error.StripeError:
        raise HTTPException(status_code=400, detail="Checkout session not found")
    
    status = checkout_session.get("payment_status")
    pi = checkout_session.get("payment_intent") or {}
    amount_total = checkout_session.get("amount_total")
    currency = checkout_session.get("currency")
    email = (checkout_session.get("customer_details") or {}).get("email")

    order = db.query(Order).filter(Order.stripe_checkout_session_id == session_id).first()

    return {
        "payment_status": status,
        "amount_total": (amount_total or 0) / 100.0 if amount_total is not None else None,
        "currency": currency,
        "email": email,
        "payment_intent_status": (pi or {}).get("status"),
        "order_id": getattr(order, "id", None) if order else None
    }

@router.get("/customer/orders", response_model=List[OrderOut], tags=["Orders"])
def get_customer_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == current_user["user_id"])
        .all()
    )

    return orders

@router.get("/customer/order/{order_id}", response_model=OrderOut, tags=["Orders"])
def get_customer_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(
            Order.id == order_id,
            Order.user_id == current_user["user_id"]
        )
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order
