from uuid import UUID

from fastapi import APIRouter, status
from fastapi.responses import FileResponse
from pathlib import Path
from PIL import Image

router = APIRouter()

from app.config import config


@router.get(
    "/images/{image_id}/thumb",
    status_code=status.HTTP_200_OK,
)
async def get_thumbnail(image_id: str):
    image_path = Path(config.images_dir, image_id + ".jpg")
    thumbnail_path = Path(config.images_dir, "thumb", image_id + ".jpg")
    thumbnail_path.parent.mkdir(parents=True, exist_ok=True)

    if not thumbnail_path.exists():
        with Image.open(image_path) as img:
            img.thumbnail((100, 100))
            img.save(thumbnail_path)

    return FileResponse(thumbnail_path)
