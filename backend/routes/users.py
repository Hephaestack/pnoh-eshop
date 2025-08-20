import os, requests
from fastapi import APIRouter, Depends, HTTPException
from db.schemas.users import UpdateNamesBody
from utils.user_auth import get_current_user

router = APIRouter()

CLERK_API_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_BASE_URL = os.getenv("CLERK_BASE_URL")

@router.post("/users/update-names")
def update_names(
    body: UpdateNamesBody,
    auth = Depends(get_current_user),
):
    if not CLERK_API_KEY:
        raise HTTPException(500, "Server misconfigured: missing CLERK_SECRET_KEY")

    user_id = auth["user_id"]
    payload = {
        "first_name": body.first_name.strip(),
        "last_name": body.last_name.strip(),
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
        detail = res.json().get("message") if res.headers.get("content-type","").startswith("application/json") else res.text
        raise HTTPException(res.status_code, f"Clerk update failed: {detail}")

    data = res.json()
    return {
        "user_id": data.get("id"),
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
    }
