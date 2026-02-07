# app/main.py
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime

# Import our own files
from .database import db, fix_id
from .models import (UserCreate, UserPublic, LoginRequest, Restaurant, 
                     Favorite, Review, SideEnum)
from .security import (get_password_hash, verify_password, create_access_token, 
                       decode_access_token, oauth2_scheme)

app = FastAPI()

# Enable CORS so your frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPER: Get Current User ---
async def get_current_user(token: str = Depends(oauth2_scheme)):
    return decode_access_token(token)

# --- AUTH ROUTES ---
@app.post("/api/auth/register", status_code=201)
async def register(user: UserCreate):
    # Check for existing user
    existing = await db.users.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Hash password and save
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    new_user = await db.users.insert_one(user_dict)
    
    # Generate token
    user_id = str(new_user.inserted_id)
    token = create_access_token({"sub": user_id})
    
    return {"user": {**user.dict(), "id": user_id}, "token": token}

@app.post("/api/auth/login")
async def login(creds: LoginRequest):
    user = await db.users.find_one({"username": creds.username})
    if not user or not verify_password(creds.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id})
    
    # Return user info without password
    user["id"] = user_id
    del user["_id"]
    del user["password"]
    
    return {"user": user, "token": token}

# --- RESTAURANT ROUTES ---
@app.get("/api/restaurants")
async def get_restaurants(
    search: Optional[str] = None,
    category: Optional[str] = None,
    budgets: Optional[str] = None,
    sides: Optional[str] = None
):
    query = {}
    
    # Build Filters
    if category and category != "All":
        query["cuisine"] = category
    if sides:
        query["sides"] = {"$in": sides.split(",")}
    if budgets:
        query["priceRange"] = {"$in": budgets.split(",")}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    restaurants = await db.restaurants.find(query).to_list(100)
    return {"restaurants": [fix_id(r) for r in restaurants]}

# Helper to create a restaurant (for testing)
@app.post("/api/restaurants", status_code=201)
async def create_restaurant(restaurant: Restaurant):
    res = await db.restaurants.insert_one(restaurant.dict())
    return {"id": str(res.inserted_id), "message": "Restaurant created"}

# --- FAVORITES ROUTES ---
@app.post("/api/favorites")
async def add_favorite(fav: Favorite, user_id: str = Depends(get_current_user)):
    # Verify user owns the action
    if fav.userId != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    existing = await db.favorites.find_one({"userId": fav.userId, "restaurantId": fav.restaurantId})
    if existing:
        return {"success": False, "message": "Already in favorites"}
        
    await db.favorites.insert_one(fav.dict())
    return {"success": True, "message": "Added to favorites"}

@app.get("/api/favorites/{user_id}")
async def get_favorites(user_id: str, current_user: str = Depends(get_current_user)):
    # 1. Get Favorite Links
    favs = await db.favorites.find({"userId": user_id}).to_list(100)
    restaurant_ids = [f["restaurantId"] for f in favs]
    
    # 2. Get Actual Restaurants
    # Note: If you stored IDs as ObjectIds, use ObjectId(r_id)
    # Assuming string IDs for simplicity based on previous steps
    restaurants = await db.restaurants.find({"_id": {"$in": [ObjectId(rid) for rid in restaurant_ids]}}).to_list(100)
    
    # If the above fails due to ObjectId issues, we can try matching by string ID if you stored them that way
    if not restaurants and restaurant_ids:
         restaurants = await db.restaurants.find({"id": {"$in": restaurant_ids}}).to_list(100)

    return {"favorites": [fix_id(r) for r in restaurants]}