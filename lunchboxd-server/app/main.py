# app/main.py
import re
from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

# --- ROUTER IMPORTS (Restored) ---
from app.routers import favorites, reviews, admin_messages, admin_requests

# --- INTERNAL IMPORTS ---
from .database import db, fix_id
from .models import (
    UserCreate, UserPublic, LoginRequest, Restaurant, 
    Favorite, Review, RestaurantRequest, ContactMessage, AdminStats
)
from .security import (
    get_password_hash, verify_password, create_access_token, 
    decode_access_token, oauth2_scheme
)

app = FastAPI()

# --- CORS SETUP ---
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://0.0.0.0:4173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUDE ROUTERS (Restored) ---
app.include_router(favorites.router) 
app.include_router(reviews.router, prefix="/api", tags=["reviews"])
app.include_router(admin_messages.router, prefix="/api/admin", tags=["admin-messages"])
app.include_router(admin_requests.router, prefix="/api/admin", tags=["admin-requests"])

# --- AUTH HELPER ---
async def get_current_user(token: str = Depends(oauth2_scheme)):
    return decode_access_token(token)

# ==================================================================
# 1. CORE ENDPOINTS (Restaurants & Directory)
# ==================================================================

@app.get("/api/restaurants", response_model=List[Restaurant])
async def get_restaurants(
    search: Optional[str] = None,
    category: Optional[str] = None,
    budgets: Optional[str] = None,
    sides: Optional[str] = None
):
    query: Dict[str, Any] = {}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"cuisine": {"$regex": search, "$options": "i"}}
        ]
    
    if category and category != "All":
        query["cuisine"] = category
        
    if budgets:
        budget_list = budgets.split(",")
        query["$or"] = [
            {"budgetRange": {"$in": budget_list}},
            {"priceRange": {"$in": budget_list}}
        ]
        
    if sides:
        sides_list = sides.split(",")
        query["sides"] = {"$regex": "|".join(sides_list), "$options": "i"}

    restaurants = await db.restaurants.find(query).to_list(100)
    
    cleaned = []
    for r in restaurants:
        r = fix_id(r)
        if "budgetRange" not in r and "priceRange" in r:
            r["budgetRange"] = r["priceRange"]
        cleaned.append(r)
        
    return cleaned

@app.get("/api/restaurants/{id}", response_model=Restaurant)
async def get_restaurant(id: str):
    try:
        res = await db.restaurants.find_one({"$or": [
            {"_id": ObjectId(id) if len(id) == 24 else None},
            {"_id": id},
            {"id": id}
        ]})
    except:
        res = await db.restaurants.find_one({"id": id})
        
    if not res:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    res = fix_id(res)
    if "budgetRange" not in res and "priceRange" in res:
        res["budgetRange"] = res["priceRange"]
    if "profileImage" not in res and "image" in res:
        res["profileImage"] = res["image"]
        
    # --- GOOGLE SEARCH REDIRECT FOR MAP URL (Temporary Fix) ---
    res["instagramUrl"] = res.get("instagramUrl", "https://instagram.com")
    res["facebookUrl"] = res.get("facebookUrl", "https://facebook.com")
    
    # Points to a Google Search of the restaurant name + its location
    search_query = f"{res.get('name', '')} {res.get('location', '')}".replace(" ", "+")
    res["mapUrl"] = res.get("mapUrl", f"https://www.google.com/search?q={search_query}")
        
    return res

@app.get("/api/filters")
async def get_filters():
    categories = await db.restaurants.distinct("cuisine")
    return {
        "categories": ["All"] + sorted(categories),
        "budgets": ["₱", "₱₱", "₱₱₱"],
        "sides": ["Main Gate", "Gate Six", "Inside the School", "North Gate", "Hospital Gate"]
    }

# ==================================================================
# 2. USER & AUTH (Universal Login & Profile)
# ==================================================================

@app.post("/api/users", response_model=UserPublic)
async def register(user: UserCreate):
    is_email = re.match(r"[^@]+@[^@]+\.[^@]+", user.email)
    is_mobile = re.match(r"^(09|\+639)\d{9}$", user.email)

    if not (is_email or is_mobile):
        raise HTTPException(status_code=400, detail="Use a valid Email or PH Mobile Number")

    existing = await db.users.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="Username or Contact info taken")
    
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["createdAt"] = datetime.now().isoformat()
    user_dict["role"] = "user"
    
    new_user = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": new_user.inserted_id})
    return fix_id(created_user)

@app.post("/api/login")
async def login(creds: LoginRequest):
    # Searches both Username and Email/Mobile field
    user = await db.users.find_one({"$or": [
        {"username": creds.username}, 
        {"email": creds.username}
    ]})
    
    if not user or not verify_password(creds.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username/contact or password")
    
    token = create_access_token({"sub": str(user["_id"]), "username": user["username"], "role": user.get("role", "user")})
    user_public = fix_id(user)
    user_public.pop("password", None)
    return {"token": token, "user": user_public}

@app.get("/api/users/{id}", response_model=UserPublic)
async def get_user(id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(id)})
    except:
        user = await db.users.find_one({"id": id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return fix_id(user)

@app.patch("/api/users/{id}", response_model=UserPublic)
async def update_profile(id: str, updates: dict):
    try:
        oid = ObjectId(id)
    except:
        oid = id
    updates.pop("password", None)
    updates.pop("role", None)
    updates.pop("id", None)
    updates.pop("_id", None)
    await db.users.update_one({"_id": oid}, {"$set": updates})
    updated_user = await db.users.find_one({"_id": oid})
    return fix_id(updated_user)

# ==================================================================
# 3. REVIEWS & FAVORITES LIST
# ==================================================================

# Match exactly what the frontend calls to fix 404
@app.get("/api/reviews/restaurant/{id}", response_model=List[Review])
async def get_restaurant_reviews_by_path(id: str):
    reviews = await db.reviews.find({"restaurantId": id}).sort("createdAt", -1).to_list(100)
    return [fix_id(r) for r in reviews]

@app.post("/api/reviews", response_model=Review)
async def add_review(review: Review):
    review_dict = review.dict()
    review_dict["createdAt"] = datetime.now().isoformat()
    try:
        user = await db.users.find_one({"_id": ObjectId(review.userId)})
        if user:
            review_dict["userFirstName"] = user.get("firstName", "")
            review_dict["userAvatar"] = user.get("avatar", "")
    except: pass
    new_review = await db.reviews.insert_one(review_dict)
    
    # Update average rating
    all_reviews = await db.reviews.find({"restaurantId": review.restaurantId}).to_list(1000)
    if all_reviews:
        avg = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        await db.restaurants.update_one({"_id": ObjectId(review.restaurantId)}, {"$set": {"rating": round(avg, 1)}})
    created = await db.reviews.find_one({"_id": new_review.inserted_id})
    return fix_id(created)

@app.get("/api/restaurants/{id}/reviews", response_model=List[Review])
async def get_restaurant_reviews(id: str):
    reviews = await db.reviews.find({"restaurantId": id}).sort("createdAt", -1).to_list(100)
    return [fix_id(r) for r in reviews]

@app.get("/api/users/{userId}/favorites_list", response_model=List[Restaurant])
async def get_user_favorites_full(userId: str):
    favs = await db.favorites.find({"userId": userId}).to_list(100)
    ids = [f["restaurantId"] for f in favs]
    restaurants = await db.restaurants.find({"$or": [{"_id": {"$in": [ObjectId(r) for r in ids if len(r)==24]}}, {"id": {"$in": ids}}]}).to_list(100)
    return [fix_id(r) for r in restaurants]

# ==================================================================
# 4. ADMIN & REQUESTS MODULES
# ==================================================================

@app.get("/api/admin/stats", response_model=AdminStats)
async def get_dashboard_stats():
    return {
        "totalUsers": await db.users.count_documents({}),
        "totalRestaurants": await db.restaurants.count_documents({}),
        "totalReviews": await db.reviews.count_documents({}),
        "pendingRequests": await db.restaurant_requests.count_documents({"status": "pending"}),
        "unreadMessages": await db.contact_messages.count_documents({"status": "unread"})
    }

@app.post("/api/restaurants/request", response_model=RestaurantRequest)
async def create_restaurant_request(req: RestaurantRequest):
    req_dict = req.dict()
    req_dict["submittedAt"] = datetime.now().isoformat()
    req_dict["status"] = "pending"
    new_req = await db.restaurant_requests.insert_one(req_dict)
    created = await db.restaurant_requests.find_one({"_id": new_req.inserted_id})
    return fix_id(created)

@app.get("/api/admin/requests", response_model=List[RestaurantRequest])
async def get_restaurant_requests(status: Optional[str] = None):
    query = {"status": status} if status else {}
    requests = await db.restaurant_requests.find(query).sort("submittedAt", -1).to_list(100)
    return [fix_id(r) for r in requests]

@app.patch("/api/admin/requests/{id}")
async def update_request_status(id: str, payload: dict):
    new_status = payload.get("status")
    oid = ObjectId(id) if len(id) == 24 else id
    req = await db.restaurant_requests.find_one({"_id": oid})
    if not req: raise HTTPException(status_code=404, detail="Request not found")
    await db.restaurant_requests.update_one({"_id": oid}, {"$set": {"status": new_status}})
    
    if new_status == "approved":
        new_restaurant = {
            "name": req["restaurantName"], "cuisine": req["cuisine"], "rating": 0,
            "location": req["location"], "budgetRange": req["budgetRange"],
            "sides": req["sides"], "profileImage": req.get("profileImage")
        }
        await db.restaurants.insert_one(new_restaurant)
    return {"success": True}

@app.get("/api/admin/inbox", response_model=List[ContactMessage])
async def get_inbox_messages(status: Optional[str] = None):
    query = {"status": status} if status else {}
    msgs = await db.contact_messages.find(query).sort("submittedAt", -1).to_list(100)
    return [fix_id(m) for m in msgs]

@app.delete("/api/admin/restaurants/{id}")
async def delete_restaurant(id: str):
    await db.restaurants.delete_one({"_id": ObjectId(id) if len(id)==24 else id})
    return {"success": True}

@app.delete("/api/reviews/{id}")
async def delete_review(id: str):
    await db.reviews.delete_one({"_id": ObjectId(id) if len(id) == 24 else id})
    return {"success": True}