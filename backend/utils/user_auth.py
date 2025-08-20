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
    session_cookie: Optional[str] = Cookie(None, alias="__session"),
) -> Optional[str]:
    if authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1].strip()
            if token and token.lower() != "null":
                return token
    if session_cookie:
        return session_cookie
    return None


def _verify_token(session_token: str) -> Dict[str, Any]:
    if not CLERK_API_KEY:
        raise HTTPException(status_code=500, detail="Server misconfigured: missing CLERK_SECRET_KEY")
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
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    data = res.json()
    user_id = data.get("user_id") or data.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Session verified but user_id missing")

    return {
        "user_id": user_id,
        "session_id": data.get("id"),
        "expires_at": data.get("expire_at"),
        "email": (data.get("user") or {}).get("email_address") if isinstance(data.get("user"), dict) else None,
        "raw": data,
    }


def get_current_user(
    authorization: Optional[str] = Header(None),
    session_cookie: Optional[str] = Cookie(None, alias="__session"),
) -> Dict[str, Any]:
    token = get_token(authorization=authorization, session_cookie=session_cookie)
    if not token:
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization")
    
    return _verify_token(token)


def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    session_cookie: Optional[str] = Cookie(None, alias="__session"),
) -> Optional[Dict[str, Any]]:
    token = get_token(authorization=authorization, session_cookie=session_cookie)
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
        max_age=60 * 60 * 24 * 7,
        secure=False,
    )
    return new_session
