from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.models.product import Product
from db.models.cart import Cart
from db.models.cart_item import CartItem
from db.schemas.product import ProductSummary
from db.schemas.cart import AddToCartBody
from utils.database import get_db
from utils.user_auth import get_current_user

router = APIRouter()

@router.post("/cart/{product_id}", response_model=ProductSummary)
def add_to_cart(
    product_id: UUID,
    body: AddToCartBody,
    db: Session = Depends(get_db),
    auth = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    user_id = auth["user_id"]

    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
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
