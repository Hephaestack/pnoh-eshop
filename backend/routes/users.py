import os, requests
from fastapi import APIRouter, Depends, HTTPException, Header, Cookie
from db.schemas.users import UpdateNamesBody
from utils.user_auth import get_current_user, get_token, verify_token
from typing import Optional, Dict, Any

router = APIRouter()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_BASE_URL = os.getenv("CLERK_BASE_URL")

@router.get("/auth/me")
def auth_me(
    authorization: Optional[str] = Header(None),
    session_cookie: Optional[str] = Cookie(None, alias="__session"),
) -> Dict[str, Any]:
    """
    Validate Clerk session token server-side and return the current user.
    Frontend calls this instead of any Clerk server helpers.
    """
    token = get_token(authorization=authorization, session_cookie=session_cookie)
    if not token:
        raise HTTPException(status_code=401, detail="Missing session token")

    try:
        verified = verify_token(token)
    except HTTPException as e:
        raise e

    user_id = verified.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Session verified but user_id missing")

    if not CLERK_SECRET_KEY:
        return {
            "user_id": user_id,
            "session_id": verified.get("session_id"),
        }

    try:
        res_user = requests.get(
            f"{CLERK_BASE_URL}/v1/users/{user_id}",
            headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
            timeout=5,
        )
    except requests.RequestException:
        return {
            "user_id": user_id,
            "session_id": verified.get("session_id"),
        }

    if res_user.status_code != 200:
        return {
            "user_id": user_id,
            "session_id": verified.get("session_id"),
        }

    user = res_user.json()
    primary_email = None
    emails = user.get("email_addresses") or []
    if emails and isinstance(emails, list):
        primary_email = next(
            (e.get("email_address") for e in emails if e.get("id") == user.get("primary_email_address_id")),
            emails[0].get("email_address"),
        )

    return {
        "user_id": user.get("id"),
        "session_id": verified.get("session_id"),
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "email": primary_email,
        "image_url": user.get("image_url"),
    }


@router.post("/users/update-names")
def update_names(
    body: UpdateNamesBody,
    auth: Dict[str, Any] = Depends(get_current_user),
):
    if not CLERK_SECRET_KEY:
        raise HTTPException(500, "Server misconfigured: missing CLERK_SECRET_KEY")

    user_id = auth["user_id"]
    payload = {
        "first_name": (body.first_name or "").strip(),
        "last_name": (body.last_name or "").strip(),
    }

    try:
        res = requests.patch(
            f"{CLERK_BASE_URL}/v1/users/{user_id}",
            headers={
                "Authorization": f"Bearer {CLERK_SECRET_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=5,
        )
    except requests.RequestException:
        raise HTTPException(503, "Clerk service unavailable")

    if res.status_code >= 400:
        detail = (
            res.json().get("message")
            if res.headers.get("content-type", "").startswith("application/json")
            else res.text
        )
        raise HTTPException(res.status_code, f"Clerk update failed: {detail}")

    data = res.json()
    return {
        "user_id": data.get("id"),
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
    }
