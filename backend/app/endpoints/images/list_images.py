from pathlib import Path

from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter()

from app.config import config


class Image(BaseModel):
    image_id: str


@router.get(
    "/images",
    status_code=status.HTTP_200_OK,
)
async def list_images():
    return [
        Image(image_id=image_path.stem)
        for image_path in Path(config.images_dir).glob("*.jpg")
    ]
