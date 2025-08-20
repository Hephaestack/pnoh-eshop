import os, requests
from fastapi import APIRouter, Depends, HTTPException
from db.schemas.users import UpdateNamesBody
from utils.user_auth import get_current_user, get_token
from typing import Optional, Dict, Any

router = APIRouter()

CLERK_API_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_BASE_URL = os.getenv("CLERK_BASE_URL")

@router.get("/auth/me")
def get_user(token: Optional[str] = Depends(get_token)) -> Dict[str, Any]:
    if not token:
        raise HTTPException(status_code=401, detail="Missing session token")

    try:
        res = requests.get(
            f"{CLERK_BASE_URL}/sessions/{token}",
            headers={"Authorization": f"Bearer {CLERK_API_KEY}"},
            timeout=5,
        )
    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Auth service unavailable")

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    session = res.json()
    user_id = session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Session valid but missing user_id")

    # Now fetch user details
    res_user = requests.get(
        f"{CLERK_BASE_URL}/users/{user_id}",
        headers={"Authorization": f"Bearer {CLERK_API_KEY}"},
        timeout=5,
    )
    if res_user.status_code != 200:
        raise HTTPException(status_code=503, detail="Failed to fetch user details")

    user = res_user.json()
    return {
        "id": user.get("id"),
        "email": user.get("email_addresses", [{}])[0].get("email_address"),
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "phone": user.get("phone_numbers", [{}])[0].get("phone_number"),
        "session_id": session.get("id"),
    }

@router.post("/users/update-names")
def update_names(
    body: UpdateNamesBody,
    auth: Dict[str, Any] = Depends(get_current_user),
):
    if not CLERK_API_KEY:
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
                "Authorization": f"Bearer {CLERK_API_KEY}",
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
