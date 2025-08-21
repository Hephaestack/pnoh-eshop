from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse
from typing import List, Dict
from fastapi import HTTPException

def normalize_dropbox(url: str) -> str | None:
    if not url or not isinstance(url, str):
        return None

    p = urlparse(url.strip())
    if p.scheme not in ("http", "https") or not p.netloc:
        return None

    if "dropbox.com" in p.netloc:
        qs = dict(parse_qsl(p.query, keep_blank_values=True))
        if qs.get("dl") == "0":
            qs.pop("dl", None)
            qs["raw"] = "1"
            p = p._replace(query=urlencode(qs))

    return urlunparse(p)
