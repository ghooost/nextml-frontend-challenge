from uuid import UUID

from fastapi import APIRouter, status
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()

from app.config import config


@router.get(
    "/images/{image_id}",
    status_code=status.HTTP_200_OK,
)
async def get_image(image_id: str):
    image_path = Path(config.images_dir, image_id + ".jpg")
    return FileResponse(image_path)
