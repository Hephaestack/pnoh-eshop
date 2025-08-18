import os
import uuid
from fastapi import HTTPException, Header, Response
from typing import Optional, Dict, Any
import requests
from dotenv import load_dotenv

load_dotenv(override=True)

CLERK_API_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_VERIFY_URL = os.getenv("CLERK_VERIFY_URL")

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    session_token = authorization.split(" ", 1)[1].strip()
    try:
        res = requests.get(
            CLERK_VERIFY_URL,
            headers={"Authorization": f"Bearer {CLERK_API_KEY}"},
            params={"session_token": session_token},
            timeout=5,
        )
    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Auth service unavailable")

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    data = res.json()
    user_id = data.get("user_id") or data.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token verified but user_id missing")

    return {"user_id": user_id, "session_id": data.get("id"), "raw": data}

def get_or_create_guest_session(guest_session_id: str | None, response: Response) -> str:
    if guest_session_id:
        return guest_session_id
    new_session = str(uuid.uuid4())
    response.set_cookie(key="guest_session_id", value=new_session, httponly=True, max_age=60*60*24*7)
    return new_session
