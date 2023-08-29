from fastapi import APIRouter, status
from ...database.comment import Comment
from pydantic import BaseModel

router = APIRouter()


class Item(BaseModel):
    id: str
    text: str
    x: float
    y: float


@router.put(
    "/images/{image_id}/comments",
    status_code=status.HTTP_200_OK,
)
async def update_comment(item: Item):
    await Comment.update(item.id, item.text, item.x, item.y)
    return {"id": item.id}
