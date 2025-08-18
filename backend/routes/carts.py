from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Response, status, Cookie
from sqlalchemy.orm import Session

from db.models.product import Product
from db.models.cart import Cart
from db.models.cart_item import CartItem
from db.schemas.product import ProductSummary
from db.schemas.cart import AddToCartBody
from utils.database import get_db
from utils.user_auth import get_current_user, get_or_create_guest_session

router = APIRouter()

@router.post("/cart/{product_id}", response_model=ProductSummary, tags=["Cart"])
def add_to_cart(
    product_id: UUID,
    body: AddToCartBody,
    db: Session = Depends(get_db),
    auth = Depends(get_current_user),
    guest_session_id: str | None = Cookie(None),
    response: Response = None,
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

    if cart_item:
        cart_item.quantity += body.quantity
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=body.quantity)
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return product

@router.delete("/cart/{product_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Cart"])
def remove_from_cart(
    product_id: UUID,
    db: Session = Depends(get_db),
    auth = Depends(get_current_user),
    guest_session_id: str | None = Cookie(None),
    response: Response = None
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
