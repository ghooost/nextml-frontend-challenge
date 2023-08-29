from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Text, Float, String, insert, select, update
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import SQLBase, async_session


class Comment(SQLBase):
    __tablename__ = "comments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created_at: Mapped[DateTime] = mapped_column(DateTime(), default=datetime.utcnow)
    text: Mapped[str] = mapped_column(Text(), primary_key=True)
    image_id: Mapped[str] = mapped_column(String(), primary_key=True)
    x: Mapped[float] = mapped_column(Float())
    y: Mapped[float] = mapped_column(Float())

    @staticmethod
    async def insert(image_id, text, x, y):
        async with async_session() as session:
            result = await session.execute(
                insert(Comment)
                .values(
                    text=text,
                    x=x,
                    y=y,
                    image_id=image_id,
                )
                .returning(Comment.id)
            )
            inserted_id = result.fetchone()[0]
            await session.commit()

            return inserted_id

    @staticmethod
    async def update(comment_id, new_text, x, y):
        async with async_session() as session:
            await session.execute(
                update(Comment)
                .where(Comment.id == comment_id)
                .values(text=new_text, x=x, y=y)
            )
            await session.commit()

    @staticmethod
    async def list(image_id):
        async with async_session() as session:
            return [
                comment
                for comment in (
                    await session.execute(
                        select(Comment)
                        .where(Comment.image_id == image_id)
                        .order_by(Comment.created_at.desc())
                    )
                ).scalars()
            ]
