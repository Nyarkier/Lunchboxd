from fastapi import APIRouter, HTTPException
from app.models import ContactMessage

router = APIRouter(prefix="/api/admin/messages", tags=["admin"])

messages_db: list[ContactMessage] = []


@router.get("")
def get_messages():
    return messages_db


@router.put("/{messageId}/read")
def mark_as_read(messageId: str):
    for msg in messages_db:
        if msg.id == messageId:
            msg.status = "read"
            return msg
    raise HTTPException(status_code=404, detail="Message not found")


@router.delete("/{messageId}")
def delete_message(messageId: str):
    global messages_db
    messages_db = [m for m in messages_db if m.id != messageId]
    return {"success": True}
