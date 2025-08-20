import os
import uuid
import requests
from typing import Optional, Dict, Any
from fastapi import Cookie, HTTPException, Header, Response
from dotenv import load_dotenv

load_dotenv(override=True)

CLERK_API_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_VERIFY_URL = os.getenv("CLERK_VERIFY_URL")


def get_token(
    authorization: Optional[str] = Header(None),
    session_cookie: Optional[str] = Cookie(None, alias="__session")
) -> Optional[str]:
    """
    Extract Bearer token from header or Clerk session cookie (__session).
    """
    if authorization and authorization.lower().startswith("bearer "):
        return authorization.split(" ", 1)[1].strip()
    if session_cookie:
        return session_cookie
    return None


def _extract_bearer(authorization: Optional[str]) -> Optional[str]:
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    token = parts[1].strip()
    
    return token if token and token.lower() != "null" else None


def _verify_token(session_token: str) -> Dict[str, Any]:
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


def get_current_user(
        authorization: Optional[str] = Header(None),
        session_cookie: Optional[str] = Cookie(None, alias="__session")
) -> Dict[str, Any]:
    token = _extract_bearer(authorization) or session_cookie
    if not token:
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization")
    
    return _verify_token(token)


def get_current_user_optional(
        authorization: Optional[str] = Header(None),
        session_cookie: Optional[str] = Cookie(None, alias="__session")
) -> Optional[Dict[str, Any]]:
    token = _extract_bearer(authorization) or session_cookie
    if not token:
        return None
    try:
        return _verify_token(token)
    except HTTPException:
        return None


def get_or_create_guest_session(guest_session_id: Optional[str], response: Response) -> str:
    if guest_session_id:
        return guest_session_id
    
    new_session = str(uuid.uuid4())
    
    response.set_cookie(
        key="guest_session_id",
        value=new_session,
        httponly=True,
        samesite="lax",
        max_age=60*60*24*7,
        secure=False, 
    )
    
    return new_session
