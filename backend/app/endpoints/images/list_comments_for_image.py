from fastapi import APIRouter, status
from ...database.comment import Comment

router = APIRouter()


@router.get(
    "/images/{image_id}/comments",
    status_code=status.HTTP_200_OK,
)
async def list_comments_for_image(image_id: str):
    return await Comment.list(image_id)
