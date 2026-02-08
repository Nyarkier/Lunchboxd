from fastapi import APIRouter, HTTPException
from app.models import Review
from uuid import uuid4
from datetime import datetime

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

reviews_db: list[Review] = []


@router.post("")
def add_review(review: Review):
    review.id = str(uuid4())
    review.createdAt = datetime.utcnow().isoformat()
    reviews_db.append(review)
    return review


@router.get("/restaurant/{restaurantId}")
def get_restaurant_reviews(restaurantId: str):
    return [r for r in reviews_db if r.restaurantId == restaurantId]


@router.get("/user/{userId}")
def get_user_reviews(userId: str):
    return [r for r in reviews_db if r.userId == userId]


@router.put("/{reviewId}")
def update_review(reviewId: str, updated: Review):
    for r in reviews_db:
        if r.id == reviewId:
            r.rating = updated.rating
            r.comment = updated.comment
            return r
    raise HTTPException(status_code=404, detail="Review not found")


@router.delete("/{reviewId}")
def delete_review(reviewId: str):
    global reviews_db
    reviews_db = [r for r in reviews_db if r.id != reviewId]
    return {"success": True}
