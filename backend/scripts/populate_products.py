# backend/scripts/populate_products.py
import uuid
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models.product import Product, Category, SubCategory
from datetime import datetime
from zoneinfo import ZoneInfo

def seed_products():
    db: Session = SessionLocal()

    products = [
        Product(
            id=uuid.uuid4(),
            name="Gold Ethnic Ring",
            description="Handmade ethnic style gold ring with intricate patterns.",
            price=59.99,
            stock_quantity=10,
            category=Category.rings.value,
            sub_category=SubCategory.ethnic.value,
            image_url=[
                "https://www.dropbox.com/scl/fi/0jwjfkcvxcyfefkam7nmc/jewel_1.jpg?rlkey=47q5bnkotxg4fq6ivjgsm0m1q&st=t3oqscu4&dl=0",
                "https://www.dropbox.com/scl/fi/dgew3cr9szfeebmgwal0n/jewel_6.jpg?rlkey=fqb8lj88w5ovud1ms9c0hztzi&st=swx2fcdi&dl=0"
            ],
            created_at=datetime.now(ZoneInfo("Europe/Athens")),
            updated_at=datetime.now(ZoneInfo("Europe/Athens"))
        ),
        Product(
            id=uuid.uuid4(),
            name="Minimal Silver Necklace",
            description="Elegant minimal silver necklace for everyday wear.",
            price=39.99,
            stock_quantity=15,
            category=Category.necklaces.value,
            sub_category=SubCategory.minimal.value,
            image_url=[
                "https://www.dropbox.com/scl/fi/vppldg8w8rkxbatakz5p7/jewel_2.jpg?rlkey=4gm0r74tnmmdaw767dbrqh44u&st=auha86rx&dl=0"
            ],
            created_at=datetime.now(ZoneInfo("Europe/Athens")),
            updated_at=datetime.now(ZoneInfo("Europe/Athens"))
        ),
        Product(
            id=uuid.uuid4(),
            name="Luxury Diamond Bracelet",
            description="Premium diamond bracelet crafted with precision.",
            price=499.99,
            stock_quantity=5,
            category=Category.bracelets.value,
            sub_category=SubCategory.luxury.value,
            image_url=[
                "https://www.dropbox.com/scl/fi/oykeh24gl1je14d0k656x/jewel_3.jpg?rlkey=en63k87vqosahf1e5zd4kzyfz&st=z2y6cs8z&dl=0",
                "https://www.dropbox.com/scl/fi/tpkja0oxkinclmfab0qir/jewel_5.jpg?rlkey=m7p3rl3nx1tynpcnqgzkyfz4n&st=xxpeyfut&dl=0"
            ],
            created_at=datetime.now(ZoneInfo("Europe/Athens")),
            updated_at=datetime.now(ZoneInfo("Europe/Athens"))
        ),
        Product(
            id=uuid.uuid4(),
            name="Random Earrings",
            description="Premium best quality silver earrings you will ever see",
            price=599.99,
            stock_quantity=1,
            category=Category.earrings.value,
            sub_category=SubCategory.one_of_a_kind.value,
            image_url=[
                "https://www.dropbox.com/scl/fi/p8hi286qswuyuo5czj8ku/jewel_4.jpg?rlkey=wggupnghyxvfw7wczu6penhfs&st=naeyugs4&dl=0",
                "https://www.dropbox.com/scl/fi/drm5raq7z9y3qfx4ymjok/jewel_8.jpg?rlkey=5efx9h0i979y1nvqf33vz7cm4&st=s171g4nu&dl=0"
            ],
            created_at=datetime.now(ZoneInfo("Europe/Athens")),
            updated_at=datetime.now(ZoneInfo("Europe/Athens"))
        )
    ]

    try:
        db.add_all(products)
        db.commit()
        print(f"Inserted {len(products)} products successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error inserting products: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_products()
