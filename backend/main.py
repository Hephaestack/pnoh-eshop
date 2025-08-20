from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from routes import product_router, admin_router, cart_router, checkout_router, user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    GZipMiddleware,
    minimum_size=1000,
)

@app.get("/", tags=["Healtch Check"])
def root():
    return {"message": "PNOH API is running!"}

app.include_router(product_router)
app.include_router(admin_router)
app.include_router(cart_router)
app.include_router(checkout_router)
app.include_router(user_router)
