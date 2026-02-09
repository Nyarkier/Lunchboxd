from fastapi import APIRouter, HTTPException
from app.models import Favorite
from app.database import db

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

@router.post("")
async def toggle_favorite(fav: Favorite):
    # Check if already exists to "toggle" it off
    existing = await db.favorites.find_one({"userId": fav.userId, "restaurantId": fav.restaurantId})
    
    if existing:
        await db.favorites.delete_one({"_id": existing["_id"]})
        return {"status": "removed", "isFavorite": False}
    
    await db.favorites.insert_one(fav.dict())
    return {"status": "added", "isFavorite": True}

@router.get("/{userId}")
async def get_user_favorites(userId: str):
    fav_links = await db.favorites.find({"userId": userId}).to_list(100)
    return fav_links

@router.get("/{userId}/{restaurantId}")
async def check_favorite(userId: str, restaurantId: str):
    existing = await db.favorites.find_one({"userId": userId, "restaurantId": restaurantId})
    return {"isFavorite": bool(existing)}

@router.delete("/{userId}/{restaurantId}")
async def remove_favorite(userId: str, restaurantId: str):
    await db.favorites.delete_one({"userId": userId, "restaurantId": restaurantId})
    return {"success": True, "message": "Favorite removed"}