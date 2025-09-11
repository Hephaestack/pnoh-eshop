from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, Query, Form, UploadFile, File, Body
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import or_
import json
from pydantic import ValidationError

from db.models.order import OrderStatus
from db.schemas.order_admin import OrderStatusUpdate
from utils.b2_images import create_and_upload_thumbnail, upload_image_bytes
from utils.database import get_db
from db.models.product import Product, Category, SubCategory
from db.models import Admin, Product, Order
from db.schemas.product import ProductCreate, ProductOut, ProductUpdateRequest, ProductSummary
from db.schemas.admin import AdminLogin
from utils.admin_auth import create_access_token, verify_password, get_current_admin

router = APIRouter()

@router.get("/admin/products/all", response_model=List[ProductSummary], tags=["Admin Products"])
def admin_get_products(
    db: Session = Depends(get_db),
    category: Optional[Category] = Query(None),
    subcategory: Optional[SubCategory] = Query(None),
    q: Optional[str] = Query(None, description="search in name/description"),
    skip: int = Query(0, ge=0),
    limit: int = Query(12, ge=1, le=100),
):
    query = db.query(Product)

    if category is not None:
        query = query.filter(Product.category == category)
    if subcategory is not None:
        query = query.filter(Product.sub_category == subcategory)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Product.name.ilike(like), Product.description.ilike(like)))

    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/admin/dev-token", tags=["Admin Login"])
def dev_token(
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).first()
    if not admin:
        raise HTTPException(status_code=404, detail="No admin found")
    return {"access_token": create_access_token(admin)}

@router.post("/admin/login", tags=["Admin Login"])
def login_admin(
    login_data: AdminLogin,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(Admin.username == login_data.username).first()
    if not admin or not verify_password(login_data.password, admin.password):
        raise HTTPException(status_code=401, detail="Μη έγκυρα στοιχεία σύνδεσης.")
    
    access_token = create_access_token(admin)

    response = JSONResponse(
        content={"message": "Επιτυχής σύνδεση"}
    )

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=True,         
        samesite="none",
        max_age=60 * 60 * 24,     
        path="/"
    )

    return response

@router.post("/admin/products/", response_model=ProductOut, tags=["Admin Products"])
async def create_product(
    payload: Optional[str] = Form(None),
    images: Optional[List[UploadFile]] = File(None),
    image: Optional[UploadFile] = File(None), 
    payload_json: Optional[ProductCreate] = Body(None),
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    if payload_json is not None:
        product_data = payload_json
        incoming_files: List[UploadFile] = []

        if image: incoming_files.append(image)
        if images: incoming_files.extend(images or [])
    elif payload is not None:    
        try:
            product_data = ProductCreate.model_validate_json(payload)
        except ValidationError as e:
            raise HTTPException(status_code=422, detail=f"Invalid payload JSON: {e}")
        incoming_files = []
        
        if image: incoming_files.append(image)
        if images: incoming_files.extend(images or [])
    else:
        raise HTTPException(status_code=422, detail="Provide either JSON body or multipart 'payload'")

    original_urls: List[str] = []
    thumb_urls: List[str] = []

    for f in incoming_files:
        if not f.content_type or not f.content_type.startswith("image/"):
            raise HTTPException(status_code=422, detail=f"Invalid file type: {f.filename}")

        raw = await f.read()
        up = upload_image_bytes(content=raw, filename=f.filename or "upload", folder="products", content_type=f.content_type)
        original_urls.append(up["url"])
        th = create_and_upload_thumbnail(image_bytes=raw, size=(400, 400), folder="products/thumbnails", quality=85)
        thumb_urls.append(th["url"])

    new_product = Product(
        id=uuid4(),
        **product_data.model_dump()
    )
    if thumb_urls: new_product.image_url = thumb_urls
    if original_urls: new_product.big_image_url = original_urls

    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return new_product

@router.put("/admin/products/{product_id}", response_model=ProductOut, tags=["Admin Products"])
def update_product(
    product_id: UUID,
    product_data: ProductUpdateRequest,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    update_data = product_data.model_dump(exclude_unset = True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product

@router.delete("/admin/products/{product_id}", tags=["Admin Products"])
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return {"detail": "Product deleted successfully"}

NAME_MAP = {
    "pending":   OrderStatus.pending,
    "sent":      OrderStatus.sent,
    "fulfilled": OrderStatus.fulfilled,
    "cancelled": OrderStatus.cancelled,
    "paid":      OrderStatus.paid,
}

@router.post("/admin/orders/{order_id}/status", tags=["Admin Orders"])
def update_order_status(
    order_id: UUID,
    body: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    raw = (body.status or "").strip()

    try:
        new_status = OrderStatus(raw)
    except ValueError:
        new_status = NAME_MAP.get(raw.lower())
        if new_status is None:
            raise HTTPException(status_code=400, detail="Invalid status value")
    
    order.status = new_status
    
    db.commit()
    db.refresh(order)
    return order
