from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.database import SessionLocal
from db.models.product import Product, Category, SubCategory
from db.schemas.product import ProductSummary
from utils.database import get_db

router = APIRouter()

@router.get("/products/all", response_model=list[ProductSummary])
def get_all_products(
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()
    return products

@router.get("/products/{product_id}", response_model=ProductSummary)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    return product

@router.get("/products/category/{category}", response_model=list[ProductSummary])
def get_products_by_category(
    category: Category,
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.category == category).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this category.")
    
    return products

@router.get("/products/subcategory/{sub_category}", response_model=list[ProductSummary])
def get_products_by_subcategory(
    sub_category: SubCategory,
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.sub_category == sub_category).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this subcategory.")
    
    return products

@router.get("/products/category/{category}/subcategory/{sub_category}", response_model=list[ProductSummary])
def get_products_by_category_and_subcategory(
    category: Category,
    sub_category: SubCategory,
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(
        Product.category == category,
        Product.sub_category == sub_category
    ).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found.")
    
    return products

@router.get("/categories", response_model=list[str])
def get_categories():
    return [category.value for category in Category]

@router.get("/subcategories", response_model=list[str])
def get_subcategories():
    return [sub_category.value for sub_category in SubCategory]
