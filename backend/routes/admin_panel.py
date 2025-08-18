from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import or_

from utils.database import get_db
from db.models.product import Product, Category, SubCategory
from db.models import Admin, Product
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
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    new_product = Product(
        id = uuid4(),
        **product_data.model_dump()
    )

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
