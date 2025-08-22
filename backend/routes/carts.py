from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Response, status, Cookie
from sqlalchemy.orm import Session
from typing import Optional, List

from db.models.product import Product
from db.models.cart import Cart
from db.models.cart_item import CartItem
from db.schemas.product import ProductSummary
from db.schemas.cart import CartSummary
from db.schemas.cart_item import CartItemOut, CartItemProduct
from utils.database import get_db
from utils.user_auth import get_current_user_optional, get_or_create_guest_session

router = APIRouter()

@router.post("/cart/{product_id}", response_model=ProductSummary, tags=["Cart"])
def add_to_cart(
    product_id: UUID,
    response: Response,
    db: Session = Depends(get_db),
    auth: Optional[dict] = Depends(get_current_user_optional),
    guest_session_id: Optional[str] = Cookie(None),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    if auth:
        cart = db.query(Cart).filter(Cart.user_id == auth["user_id"]).first()
        if not cart:
            cart = Cart(user_id=auth["user_id"])
            db.add(cart)
            db.commit()
            db.refresh(cart)
    else:
        session_id = get_or_create_guest_session(guest_session_id, response)
        cart = db.query(Cart).filter(Cart.guest_session_id == session_id).first()
        if not cart:
            cart = Cart(guest_session_id=session_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()

    if not cart_item:
        cart_item = CartItem(cart_id = cart.id, product_id = product_id)
        db.add(cart_item)
        db.commit()

    return product

@router.delete("/cart/{product_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Cart"])
def remove_from_cart(
    product_id: UUID,
    response: Response,
    db: Session = Depends(get_db),
    auth: Optional[dict] = Depends(get_current_user_optional),
    guest_session_id: Optional[str] = Cookie(None),
):
    cart = None

    if auth:
        user_id = auth["user_id"]
        cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    else:
        session_id = get_or_create_guest_session(guest_session_id, response)
        cart = db.query(Cart).filter(Cart.guest_session_id == session_id).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(cart_item)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/cart", response_model=CartSummary)
def get_cart(
    db: Session = Depends(get_db),
    auth: Optional[dict] = Depends(get_current_user_optional),
    guest_session_id: Optional[str] = Cookie(None),
):
    if auth:
        cart = db.query(Cart).filter(Cart.user_id == auth["user_id"]).first()
    else:
        session_id = guest_session_id
        if not session_id:
            return CartSummary(items=[], total_items=0, subtotal=0.0)
        cart = db.query(Cart).filter(Cart.guest_session_id == session_id).first()

    if not cart:
        return CartSummary(items=[], total_items=0, subtotal=0.0)

    rows = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )

    items: List[CartItemOut] = []
    total_items = 0
    subtotal = 0.0

    for ci, p in rows:
        line_total = float(p.price or 0)
        items.append(
            CartItemOut(
                product=CartItemProduct(
                    id=p.id,
                    name=p.name,
                    price=p.price,
                    image_url=p.image_url,
                ),
                line_total=line_total,
            )
        )
        total_items += 1
        subtotal += line_total

    return CartSummary(items=items, total_items=total_items, subtotal=subtotal)


@router.post("/merge/cart", status_code=status.HTTP_204_NO_CONTENT)
async def merge_guest_cart_into_user(
    response: Response,
    db: Session = Depends(get_db),
    auth: Optional[dict] = Depends(get_current_user_optional),
    guest_session_id: Optional[str] = Cookie(None),
    request=None
):
    import sys
    print("[DEBUG] /merge/cart endpoint called", file=sys.stderr)
    if request:
        try:
            body = await request.json()
            print(f"[DEBUG] Request body: {body}", file=sys.stderr)
        except Exception as e:
            print(f"[DEBUG] Could not parse request body: {e}", file=sys.stderr)
    if not auth or "user_id" not in auth:
        raise HTTPException(status_code=401, detail="Login required to merge cart")

    user_id = auth["user_id"]

    if not guest_session_id:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    guest_cart = db.query(Cart).filter(Cart.guest_session_id == guest_session_id).first()
    if not guest_cart:
        response.delete_cookie("guest_session_id")
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    user_cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not user_cart:
        user_cart = Cart(user_id=user_id)
        db.add(user_cart)
        db.flush()

    existing_pids = {
        ci.product_id for ci in db.query(CartItem).filter(CartItem.cart_id == user_cart.id).all()
    }
    guest_items = db.query(CartItem).filter(CartItem.cart_id == guest_cart.id).all()

    added = 0
    for gi in guest_items:
        if gi.product_id in existing_pids:
            continue
        db.add(CartItem(cart_id=user_cart.id, product_id=gi.product_id))
        existing_pids.add(gi.product_id)
        added += 1

    db.query(CartItem).filter(CartItem.cart_id == guest_cart.id).delete()
    db.delete(guest_cart)
    db.commit()

    response.delete_cookie("guest_session_id")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
