from fastapi import APIRouter, status
from ...database.comment import Comment
from pydantic import BaseModel

router = APIRouter()


class Item(BaseModel):
    text: str
    x: float
    y: float


@router.post(
    "/images/{image_id}/comments",
    status_code=status.HTTP_200_OK,
)
async def create_comment(image_id, item: Item):
    comment_id = await Comment.insert(image_id, item.text, item.x, item.y)
    return {"id": comment_id}
