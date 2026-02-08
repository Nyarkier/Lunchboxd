from fastapi import APIRouter, HTTPException
from app.models import Favorite

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

# Mock storage (replace with DB later)
favorites_db: list[Favorite] = []


@router.post("")
def add_favorite(favorite: Favorite):
    if any(
        f.userId == favorite.userId and f.restaurantId == favorite.restaurantId
        for f in favorites_db
    ):
        raise HTTPException(status_code=400, detail="Already favorited")

    favorites_db.append(favorite)
    return {"success": True, "message": "Restaurant added to favorites"}


@router.delete("/{userId}/{restaurantId}")
def remove_favorite(userId: str, restaurantId: str):
    global favorites_db
    favorites_db = [
        f for f in favorites_db
        if not (f.userId == userId and f.restaurantId == restaurantId)
    ]
    return {"success": True, "message": "Favorite removed"}


@router.get("/{userId}")
def get_user_favorites(userId: str):
    return [f for f in favorites_db if f.userId == userId]


@router.get("/{userId}/{restaurantId}")
def check_favorite(userId: str, restaurantId: str):
    is_favorite = any(
        f.userId == userId and f.restaurantId == restaurantId
        for f in favorites_db
    )
    return {"isFavorite": is_favorite}
