from PIL import Image, ImageOps
import os
import uuid
import mimetypes
from io import BytesIO
from typing import Tuple, Optional
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv(override=True)

B2_KEY_ID = os.getenv("B2_KEY_ID")
B2_APPLICATION_KEY = os.getenv("B2_APPLICATION_KEY")
B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME")
B2_ENDPOINT = os.getenv("B2_ENDPOINT")

if not all([B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME, B2_ENDPOINT]):
    raise RuntimeError("Missing B2_* environment variables")

s3 = boto3.client(
    "s3",
    endpoint_url = B2_ENDPOINT,
    aws_access_key_id = B2_KEY_ID,
    aws_secret_access_key = B2_APPLICATION_KEY,
)

def _public_url(key: str) -> str:
    # S3-style public URL for B2 S3-compatible endpoint
    return f"{B2_ENDPOINT}/{B2_BUCKET_NAME}/{key}"

def upload_image_bytes(
    content: bytes,
    filename: str,
    folder: str = "products",
    content_type: Optional[str] = None,
) -> dict[str, str]:
    """
    Upload raw image bytes to B2. Returns {'url': ..., 'key': ...}
    """
    ct = content_type or mimetypes.guess_type(filename)[0] or "application/octet-stream"
    key = f"{folder}/{uuid.uuid4()}-{filename}"

    try:
        s3.put_object(
            Bucket = B2_BUCKET_NAME,
            Key = key,
            Body = content,
            ContentType = ct,
            ACL = "public-read",
            CacheControl = "public, max-age=31536000, immutable",
        )
    except ClientError as e:
        raise RuntimeError(f"B2 upload failed: {e}")

    return {"url": _public_url(key), "key": key, "content_type": ct}

def create_and_upload_thumbnail(
    image_bytes: bytes,
    size: Tuple[int, int] = (400, 400),
    folder: str = "products/thumbnails",
    quality: int = 85,
) -> dict[str, str]:
    """
    Create a thumbnail (max width/height = size) and upload it.
    Returns {'url': ..., 'key': ...}
    """
    # Open image from bytes
    with Image.open(BytesIO(image_bytes)) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")
        img.thumbnail(size, resample=Image.Resampling.LANCZOS)

        # Save as WEBP file and write to buffer
        buf = BytesIO()
        img.save(buf, format = "WEBP", quality = quality, method = 6)
        buf.seek(0)

        # Choose filename & content-type
        thumb_filename = f"thumbnail_{uuid.uuid4()}.webp"

        # upload
        return upload_image_bytes(
            content = buf.getvalue(),
            filename = thumb_filename,
            folder = folder,
            content_type = "image/webp",
        )
