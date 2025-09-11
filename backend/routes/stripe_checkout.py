import json
from typing import Dict, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request, Response, Cookie
from sqlalchemy.orm import Session
import os
from decimal import Decimal

from utils.orders import create_order_from_checkout_session
from utils.database import get_db
from utils.user_auth import get_current_user_optional, get_or_create_guest_session
from utils.stripe_client import stripe
from utils.dropbox_image import normalize_dropbox
from db.models.cart import Cart
from db.models.cart_item import CartItem
from db.models.product import Product

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
CURRENCY = "eur"
FREE_THRESHOLD_EUR = Decimal("150.00")

def _cart_subtotal_eur(db: Session, cart_id: UUID) -> Decimal:
    rows = (
        db.query(CartItem, Product)
          .join(Product, CartItem.product_id == Product.id)
          .filter(CartItem.cart_id == cart_id)
          .all()
    )
    total = Decimal("0.00")
    for ci, p in rows:
        qty = getattr(ci, "quantity", 1) or 1
        total += Decimal(str(p.price or 0)) * qty
    return total

def _shipping_options_for_subtotal(subtotal_eur: Decimal) -> list[dict]:
    free = subtotal_eur >= FREE_THRESHOLD_EUR
    genikh_cents = 0 if free else 1000
    boxnow_cents = 0 if free else 300

    return [
        {
            "shipping_rate_data": {
                "display_name": "Γενική Ταχυδρομική",
                "type": "fixed_amount",
                "fixed_amount": {"amount": genikh_cents, "currency": CURRENCY},
                "metadata": {"carrier": "genikh", "free_threshold_eur": str(FREE_THRESHOLD_EUR)},
            }
        },
        {
            "shipping_rate_data": {
                "display_name": "BoxNow",
                "type": "fixed_amount",
                "fixed_amount": {"amount": boxnow_cents, "currency": CURRENCY},
                "metadata": {"carrier": "boxnow", "free_threshold_eur": str(FREE_THRESHOLD_EUR)},
            }
        },
    ]

def _get_cart(
    *,
    auth: Optional[dict],
    guest_session_id: Optional[str],
    response: Response,
    db: Session
) -> Optional[Cart]:
    if auth:
        return db.query(Cart).filter(Cart.user_id == auth["user_id"]).first()
    
    if not guest_session_id:
        session_id = get_or_create_guest_session(None, response)
        return db.query(Cart).filter(Cart.guest_session_id == session_id).first()
    
    return db.query(Cart).filter(Cart.guest_session_id == guest_session_id).first()

def _build_line_items(db: Session, cart_id: UUID) -> List[Dict]:
    rows = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.cart_id == cart_id)
        .all()
    )
    if not rows:
        return []

    line_items: List[Dict] = []
    for ci, p in rows:
        if p.price is None or float(p.price) < 0:
            raise HTTPException(status_code=400, detail=f"Invalid price for product {p.id}")
        unit_amount = int(round(float(p.price) * 100))
        if unit_amount < 1:
            raise HTTPException(status_code=400, detail=f"Price too low for product {p.id}")

        name = (p.name or f"Product {p.id}")[:127]

        img_url = None
        if isinstance(p.big_image_url, list) and p.big_image_url:
            img_url = normalize_dropbox(p.big_image_url[0])
        if not img_url and isinstance(p.image_url, list) and p.image_url:
            img_url = normalize_dropbox(p.image_url[0])

        product_data: Dict = {
            "name": name,
            "metadata": {"product_id": str(p.id)},
        }
        if img_url:
            product_data["images"] = [img_url]

        line_items.append({
            "price_data": {
                "currency": CURRENCY,
                "product_data": product_data,
                "unit_amount": unit_amount,
            },
            "quantity": 1,
        })

    return line_items

@router.post("/stripe/create-checkout-session", tags=["Stripe"])
def create_checkout_session(
    response: Response,
    db: Session = Depends(get_db),
    auth: Optional[dict] = Depends(get_current_user_optional),
    guest_session_id: Optional[str] = Cookie(None),
):
    cart = _get_cart(auth=auth, guest_session_id=guest_session_id, response=response, db=db)
    if not cart:
        raise HTTPException(status_code=400, detail="Cart not found or empty")

    line_items = _build_line_items(db, cart.id)
    if not line_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = _cart_subtotal_eur(db, cart.id)
    shipping_options = _shipping_options_for_subtotal(subtotal)

    success_url = f"{FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{FRONTEND_URL}/checkout/cancel"

    if not FRONTEND_URL.startswith(("http://", "https://")):
        raise HTTPException(status_code=500, detail="Invalid FRONTEND_URL configuration")

    metadata = {
        "cart_id": str(cart.id),
        "user_id": (auth or {}).get("user_id") or "",
        "guest_session_id": guest_session_id or "",
        "subtotal_eur": str(subtotal),
        "free_shipping_threshold_eur": str(FREE_THRESHOLD_EUR),
    }

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        success_url=success_url,
        cancel_url=cancel_url,
        billing_address_collection="auto",
        phone_number_collection={"enabled": True},
        shipping_address_collection={"allowed_countries": ["GR", "DE", "FR", "IT", "ES", "GB"]},
        allow_promotion_codes=True,
        shipping_options=shipping_options,
        metadata=metadata,
        payment_intent_data={"metadata": metadata},
    )

    return {"url": session.url}

@router.post("/stripe/webhook", tags=["Stripe"])
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        if WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload=payload, sig_header=sig_header, secret=WEBHOOK_SECRET
            )
        else:
            event = json.loads(payload.decode("utf-8"))
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid payload or signature")

    event_type = event["type"] if isinstance(event, dict) else event["type"]
    obj = event["data"]["object"]

    if event_type == "checkout.session.completed":
        session_id = obj["id"]

        # 2) Re-fetch with expands so your helper gets consistent shapes
        session = stripe.checkout.Session.retrieve(
            session_id,
            expand=[
                "payment_intent",
                "payment_intent.charges.data",
                "shipping_cost.shipping_rate",
                "customer_details",        # already present on Session but keep it consistent
                "line_items"               # optional; you currently reprice from Cart
            ],
        )

        # 3) Create (or fetch existing) Order from your authoritative cart/DB prices
        try:
            print(f"Calling create_order_from_checkout_session for session: {session_id}")
            order, created = create_order_from_checkout_session(db, session)
            print(f"Order created successfully: {order.id}, created: {created}")
        except Exception as e:
            print(f"ERROR in create_order_from_checkout_session: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e

        # 4) Clear cart only if the session is paid
        # Stripe sends 'payment_status' on the Checkout Session
        if session.get("payment_status") == "paid":
            md = session.get("metadata") or {}
            cart_id = md.get("cart_id")
            if cart_id:
                db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
                db.query(Cart).filter(Cart.id == cart_id).delete()
                db.commit()

        # It’s OK if this webhook fires multiple times; your helper is idempotent
        return {"received": True, "order_id": str(order.id), "created": created}

    # (Optional) Handle other lifecycle events if you need them later
    elif event_type == "payment_intent.succeeded":
        # You can upsert a payment log or reconcile if needed
        return {"received": True}
    elif event_type in ("payment_intent.payment_failed", "charge.refunded", "charge.refund.updated"):
        return {"received": True}

    # Unhandled events
    return {"received": True}
