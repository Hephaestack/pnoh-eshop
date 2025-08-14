from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from db.database import SessionLocal
from db.models.product import Product, Category, SubCategory
from db.schemas.product import ProductSummary, ProductImageOut
from utils.database import get_db

router = APIRouter()

@router.get("/products/all", response_model=list[ProductSummary])
def get_all_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 12
):
    products = db.query(Product).offset(skip).limit(limit).all()
    
    response_data = jsonable_encoder(products)
    response = JSONResponse(content = response_data)
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response

@router.get("/products/{product_id}", response_model=ProductSummary)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    response_data = jsonable_encoder(product)
    response = JSONResponse(content = response_data)
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response

@router.get("/products/category/{category}", response_model=list[ProductSummary])
def get_products_by_category(
    category: Category,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 12
):
    products = db.query(Product).filter(Product.category == category).offset(skip).limit(limit).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this category.")
    
    response_data = jsonable_encoder(products)
    response = JSONResponse(content = response_data)
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response

@router.get("/products/subcategory/{sub_category}", response_model=list[ProductSummary])
def get_products_by_subcategory(
    sub_category: SubCategory,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 12
):
    products = db.query(Product).filter(Product.sub_category == sub_category).offset(skip).limit(limit).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this subcategory.")
    
    response_data = jsonable_encoder(products)
    response = JSONResponse(content = response_data)
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response

@router.get("/products/category/{category}/subcategory/{sub_category}", response_model=list[ProductSummary])
def get_products_by_category_and_subcategory(
    category: Category,
    sub_category: SubCategory,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 12
):
    products = db.query(Product).filter(
        Product.category == category,
        Product.sub_category == sub_category
    ).offset(skip).limit(limit).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found.")
    
    response_data = jsonable_encoder(products)
    response = JSONResponse(content = response_data)
    response.headers['Cache-Control'] = 'public, max-age=3600'    
    return response

@router.get("/categories", response_model=list[str])
def get_categories():
    return [category.value for category in Category]

@router.get("/subcategories", response_model=list[str])
def get_subcategories():
    return [sub_category.value for sub_category in SubCategory]

@router.get("/products/image/{product_id}", response_model=list[ProductImageOut])
def get_product_image(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    return JSONResponse(content={"zoomed_image_url": product.big_image_url})
