# utils/stripe_client.py
import os, stripe
from dotenv import load_dotenv

load_dotenv(override=True)

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
if not STRIPE_SECRET_KEY:
    raise RuntimeError("Missing STRIPE_SECRET_KEY")

stripe.api_key = STRIPE_SECRET_KEY
