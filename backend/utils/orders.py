# utils/orders.py
from typing import Optional, Tuple, Mapping, Any
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy.orm import Session

from db.models.order import Order, OrderStatus, PaymentStatus
from db.models.order_item import OrderItem
from db.models.cart import Cart
from db.models.cart_item import CartItem
from db.models.product import Product

Money = Decimal

def _as_money(x: Any) -> Money:
    d = x if isinstance(x, Decimal) else Decimal(str(x))
    return d.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def _get_email_from_session(sess: Mapping[str, Any]) -> Optional[str]:
    cd = sess.get("customer_details") or {}
    return cd.get("email")

def _addr_to_fields(addr: Optional[Mapping[str, Any]]) -> dict:
    if not addr:
        return {}
    a = addr.get("address") or {}
    return {
        "name": addr.get("name"),
        "phone": addr.get("phone"),
        "address_line1": a.get("line1"),
        "address_line2": a.get("line2"),
        "city":          a.get("city"),
        "state":         a.get("state"),
        "postal_code":   a.get("postal_code"),
        "country":       a.get("country"),
    }

def _pi_id(sess: Mapping[str, Any]) -> Optional[str]:
    pi = sess.get("payment_intent")
    if isinstance(pi, str):
        return pi
    if isinstance(pi, Mapping):
        return pi.get("id")
    # StripeObject also supports .get("id")
    try:
        return pi.get("id")  # type: ignore[attr-defined]
    except Exception:
        return None

def create_order_from_checkout_session(
    db: Session,
    checkout_session: Mapping[str, Any]
) -> Tuple[Order, bool]:
    """
    Accepts a StripeObject (or dict) 'checkout_session' directly.
    Creates Order + OrderItems repricing from DB cart.
    Returns (order, created_bool). Idempotent on stripe_checkout_session_id.
    """
    session_id = checkout_session["id"]

    existing = (
        db.query(Order)
          .filter(Order.stripe_checkout_session_id == session_id)
          .first()
    )
    if existing:
        return existing, False

    meta = checkout_session.get("metadata") or {}
    cart_id = meta.get("cart_id")
    user_id = meta.get("user_id") or None
    guest_session_id = meta.get("guest_session_id") or None

    # If no cart (edge case), create minimal order from Stripe totals
    cart: Optional[Cart] = db.query(Cart).filter(Cart.id == cart_id).first() if cart_id else None
    if not cart:
        order = Order(
            user_id=user_id,
            guest_session_id=guest_session_id,
            email=_get_email_from_session(checkout_session),
            currency=(checkout_session.get("currency") or "eur"),
            subtotal_amount=_as_money(0),
            discount_amount=_as_money(0),
            shipping_amount=_as_money((checkout_session.get("shipping_cost") or {}).get("amount_total", 0) / 100),
            tax_amount=_as_money(0),
            total_amount=_as_money((checkout_session.get("amount_total") or 0) / 100),
            status=OrderStatus.paid if checkout_session.get("payment_status") == "paid" else OrderStatus.pending,
            payment_status=PaymentStatus.succeeded if checkout_session.get("payment_status") == "paid" else PaymentStatus.pending,
            stripe_payment_intent_id=_pi_id(checkout_session),
            stripe_checkout_session_id=session_id,
            # Store flattened JSON-safe copies (avoid raw StripeObject)
            customer_details_json={
                "email": _get_email_from_session(checkout_session),
                **_addr_to_fields(checkout_session.get("customer_details"))
            },
            shipping_details_json=_addr_to_fields(checkout_session.get("shipping_details")),
            extra_metadata=meta,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order, True

    # Cart exists → authoritative repricing from DB
    rows = (
        db.query(CartItem, Product)
          .join(Product, CartItem.product_id == Product.id)
          .filter(CartItem.cart_id == cart.id)
          .all()
    )

    subtotal: Money = _as_money(0)
    items: list[OrderItem] = []

    for ci, p in rows:
        qty = getattr(ci, "quantity", 1) or 1
        unit = _as_money(p.price or 0)
        line = _as_money(unit * qty)
        subtotal = _as_money(subtotal + line)
        items.append(OrderItem(
            product_id=p.id,
            product_name=p.name or f"Product {p.id}",
            product_sku=None,
            product_image=(p.big_image_url or p.image_url or [None])[0],
            unit_amount=unit,
            quantity=qty,
            line_total=line,
        ))

    currency = checkout_session.get("currency") or "eur"
    ship_total = _as_money((checkout_session.get("shipping_cost") or {}).get("amount_total", 0) / 100)
    tax_total  = _as_money(0)
    discount   = _as_money(0)
    total      = _as_money(subtotal + ship_total + tax_total - discount)

    status  = OrderStatus.paid if checkout_session.get("payment_status") == "paid" else OrderStatus.pending
    pstatus = PaymentStatus.succeeded if checkout_session.get("payment_status") == "paid" else PaymentStatus.pending

    ship = _addr_to_fields(checkout_session.get("shipping_details"))
    bill = _addr_to_fields(checkout_session.get("customer_details"))

    order = Order(
        user_id=user_id,
        guest_session_id=guest_session_id,
        email=_get_email_from_session(checkout_session),
        currency=currency,
        subtotal_amount=subtotal,
        discount_amount=discount,
        shipping_amount=ship_total,
        tax_amount=tax_total,
        total_amount=total,
        status=status,
        payment_status=pstatus,
        stripe_payment_intent_id=_pi_id(checkout_session),
        stripe_checkout_session_id=session_id,
        shipping_name=ship.get("name"),
        shipping_phone=ship.get("phone"),
        shipping_address_line1=ship.get("address_line1"),
        shipping_address_line2=ship.get("address_line2"),
        shipping_city=ship.get("city"),
        shipping_state=ship.get("state"),
        shipping_postal_code=ship.get("postal_code"),
        shipping_country=ship.get("country"),
        billing_name=bill.get("name"),
        billing_address_line1=bill.get("address_line1"),
        billing_address_line2=bill.get("address_line2"),
        billing_city=bill.get("city"),
        billing_state=bill.get("state"),
        billing_postal_code=bill.get("postal_code"),
        billing_country=bill.get("country"),
        # JSON-safe copies:
        customer_details_json={
            "email": _get_email_from_session(checkout_session),
            **bill
        },
        shipping_details_json=ship,
        extra_metadata=meta,
    )
    db.add(order)
    db.flush()

    for it in items:
        it.order_id = order.id
        db.add(it)

    db.commit()
    db.refresh(order)
    return order, True
