import os
import uuid
import requests
import base64
import json
from typing import Optional, Dict, Any
from fastapi import Cookie, HTTPException, Header, Response
from dotenv import load_dotenv

load_dotenv(override=True)

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_VERIFY_URL = os.getenv("CLERK_VERIFY_URL")
CLERK_BASE_URL = os.getenv("CLERK_BASE_URL")


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


def verify_token(session_token: str) -> Dict[str, Any]:
    if not CLERK_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Server misconfigured: missing CLERK_SECRET_KEY")
    
    # Check if this is a JWT token (starts with eyJ)
    if session_token.startswith('eyJ'):
        print(f"DEBUG: Detected JWT token, extracting session ID...")
        try:
            # Decode JWT payload (second part after first dot)
            parts = session_token.split('.')
            if len(parts) < 2:
                raise ValueError("Invalid JWT format")
            
            # Add padding if needed for base64 decoding
            payload = parts[1]
            payload += '=' * (4 - len(payload) % 4)
            
            # Decode the payload
            decoded_payload = base64.b64decode(payload)
            jwt_data = json.loads(decoded_payload)
            
            session_id = jwt_data.get('sid')
            if not session_id:
                raise ValueError("No session ID found in JWT")
            
            print(f"DEBUG: Extracted session_id: {session_id}")
            
            # Use the sessions endpoint with the extracted session ID
            verify_url = f"{CLERK_BASE_URL}/v1/sessions/{session_id}"
            
        except Exception as e:
            print(f"DEBUG: Failed to decode JWT: {e}")
            raise HTTPException(status_code=401, detail="Invalid JWT token format")
    else:
        print(f"DEBUG: Using session token directly")
        # If it's already a session ID, use the verify endpoint
        verify_url = f"{CLERK_VERIFY_URL}?session_token={session_token}"
    
    print(f"DEBUG: Using URL: {verify_url}")
    
    try:
        # Use GET request for both JWT and session token verification
        res = requests.get(
            verify_url,
            headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
            timeout=5,
        )
        
        print(f"DEBUG: Clerk API response status: {res.status_code}")
        if res.status_code != 200:
            print(f"DEBUG: Clerk API error response: {res.text}")
        else:
            print(f"DEBUG: Clerk API success!")
            
    except requests.RequestException as e:
        print(f"DEBUG: Request exception: {e}")
        raise HTTPException(status_code=503, detail="Auth service unavailable")
    
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    data = res.json()
    user_id = data.get("user_id") or data.get("sub")
    if not user_id:
        print(f"DEBUG: No user_id found in response: {data}")
        raise HTTPException(status_code=401, detail="Session verified but user_id missing")

    print(f"DEBUG: Success! user_id={user_id}")
    return {
        "user_id": user_id,
        "session_id": data.get("id"),
        "expire_at": data.get("expire_at"),
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
    
    return verify_token(token)


def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    session_cookie: Optional[str] = Cookie(None, alias="__session"),
) -> Optional[Dict[str, Any]]:
    token = get_token(authorization=authorization, session_cookie=session_cookie)
    if not token:
        return None
    try:
        return verify_token(token)
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
        samesite="none",
        max_age=60 * 60 * 24 * 7,
        secure=True,
    )
    return new_session
