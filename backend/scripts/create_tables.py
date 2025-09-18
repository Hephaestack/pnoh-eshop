import sys
import os

from db.database import Base, engine
from db.models.product import Product

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

print("Creating tables:", Base.metadata.tables.keys())
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
