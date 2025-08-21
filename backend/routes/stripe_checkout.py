from typing import Dict, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request, Response, Cookie
from sqlalchemy.orm import Session
import os
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

    success_url = f"{FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{FRONTEND_URL}/checkout/cancel"

    # idempotency_key = f"checkout_{cart.id}"

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        success_url=success_url,
        cancel_url=cancel_url,
        billing_address_collection="auto",
        shipping_address_collection={"allowed_countries": ["GR", "DE", "FR", "IT", "ES", "GB"]},
        allow_promotion_codes=True,
        metadata={
            "cart_id": str(cart.id),
            "user_id": (auth or {}).get("user_id") or "",
            "guest_session_id": guest_session_id or "",
        },
        # payment_intent_data={"metadata": {...}}  # optional duplicate metadata at PI level
        # customer_creation="if_required",  # creates a Customer if needed
    )

    return {"url": session.url}


@router.post("/stripe/webhook", tags=["Stripe"])
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    if not WEBHOOK_SECRET:
        payload = await request.body()
        event = stripe.Event.construct_from(request.json(), stripe.api_key)
    else:
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        try:
            event = stripe.Webhook.construct_event(
                payload=payload, sig_header=sig_header, secret=WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session: dict = event["data"]["object"]
        # Retrieve line items if you need details:
        # line_items = stripe.checkout.Session.list_line_items(session["id"], limit=100)
        cart_id = session.get("metadata", {}).get("cart_id")
        user_id = session.get("metadata", {}).get("user_id") or None
        guest_session_id = session.get("metadata", {}).get("guest_session_id") or None

        # TODO: Create Order & OrderItems from the cart (server-side authoritative prices)
        # Example:
        # order = Order(..., total_amount=session["amount_total"]/100, currency=session["currency"], user_id=user_id, email=session["customer_details"]["email"], status="paid")
        # db.add(order); db.commit()
        # for each cart item -> create OrderItem
        # Clear the cart after successful payment:
        if cart_id:
            cart = db.query(Cart).filter(Cart.id == cart_id).first()
            if cart:
                # delete all cart items
                db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
                db.commit()

    elif event["type"] in (
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "charge.refunded",
        # add more events you care about
    ):
        pass  # handle if you need

    return {"received": True}
