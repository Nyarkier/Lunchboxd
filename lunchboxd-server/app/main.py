# app/main.py
import re
from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.routers import favorites, reviews, admin_messages, admin_requests
# Import our own files
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
    "http://localhost:4173",
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
        # Check by ObjectId, String ID, or custom 'id' field
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
# 2. USER & AUTH ENDPOINTS (Updated for Mobile/Email Flexibility)
# ==================================================================

@app.post("/api/users", response_model=UserPublic)
async def register(user: UserCreate):
    # Validation: Check if it's a valid email or PH mobile format
    is_email = re.match(r"[^@]+@[^@]+\.[^@]+", user.email)
    is_mobile = re.match(r"^(09|\+639)\d{9}$", user.email)

    if not (is_email or is_mobile):
        raise HTTPException(
            status_code=400, 
            detail="Please enter a valid Email or Philippine Mobile Number (e.g., 09171234567)"
        )

    existing = await db.users.find_one({
        "$or": [
            {"username": user.username},
            {"email": user.email}
        ]
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Username or Contact info already taken")
    
    hashed_pw = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_pw
    user_dict["createdAt"] = datetime.now().isoformat()
    user_dict["role"] = "user"
    
    new_user = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": new_user.inserted_id})
    return fix_id(created_user)

@app.post("/api/login")
async def login(creds: LoginRequest):
    # SMART LOGIN: Search by Username OR the Email/Mobile field
    user = await db.users.find_one({
        "$or": [
            {"username": creds.username},
            {"email": creds.username} 
        ]
    })
    
    if not user or not verify_password(creds.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username/contact or password")
    
    token = create_access_token({
        "sub": str(user["_id"]), 
        "username": user["username"],
        "role": user.get("role", "user")
    })
    
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
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return fix_id(updated_user)

# ==================================================================
# 3. REVIEWS
# ==================================================================

@app.post("/api/reviews", response_model=Review)
async def add_review(review: Review):
    review_dict = review.dict()
    review_dict["createdAt"] = datetime.now().isoformat()
    
    try:
        if len(review.userId) > 10: 
             user = await db.users.find_one({"_id": ObjectId(review.userId)})
             if user:
                 review_dict["userFirstName"] = user.get("firstName", "")
                 review_dict["userAvatar"] = user.get("avatar", "")
    except:
        pass

    new_review = await db.reviews.insert_one(review_dict)
    
    # Update Restaurant Average Rating
    all_reviews = await db.reviews.find({"restaurantId": review.restaurantId}).to_list(1000)
    if all_reviews:
        avg = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        try:
            rid = ObjectId(review.restaurantId)
            await db.restaurants.update_one({"_id": rid}, {"$set": {"rating": round(avg, 1)}})
        except:
            pass 

    created = await db.reviews.find_one({"_id": new_review.inserted_id})
    return fix_id(created)

@app.get("/api/restaurants/{id}/reviews", response_model=List[Review])
async def get_restaurant_reviews(id: str):
    reviews = await db.reviews.find({"restaurantId": id}).sort("createdAt", -1).to_list(100)
    return [fix_id(r) for r in reviews]

# ==================================================================
# 4. ADMIN MODULES
# ==================================================================

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
    try:
        oid = ObjectId(id)
    except:
        oid = id
    
    req = await db.restaurant_requests.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    await db.restaurant_requests.update_one({"_id": oid}, {"$set": {"status": new_status}})
    
    if new_status == "approved" and req["status"] != "approved":
        new_restaurant = {
            "name": req["restaurantName"],
            "cuisine": req["cuisine"],
            "rating": 0,
            "location": req["location"],
            "budgetRange": req["budgetRange"],
            "type": req["type"],
            "paymentMode": req["paymentMode"],
            "sides": req["sides"],
            "profileImage": req.get("profileImage"),
            "menuImages": req.get("menuImages", [])
        }
        await db.restaurants.insert_one(new_restaurant)
    return {"success": True}

@app.post("/api/contact", response_model=ContactMessage)
async def send_contact_message(msg: ContactMessage):
    msg_dict = msg.dict()
    msg_dict["submittedAt"] = datetime.now().isoformat()
    msg_dict["status"] = "unread"
    new_msg = await db.contact_messages.insert_one(msg_dict)
    created = await db.contact_messages.find_one({"_id": new_msg.inserted_id})
    return fix_id(created)

@app.get("/api/admin/inbox", response_model=List[ContactMessage])
async def get_inbox_messages(status: Optional[str] = None):
    query = {"status": status} if status else {}
    msgs = await db.contact_messages.find(query).sort("submittedAt", -1).to_list(100)
    return [fix_id(m) for m in msgs]

@app.get("/api/admin/stats", response_model=AdminStats)
async def get_dashboard_stats():
    return {
        "totalUsers": await db.users.count_documents({}),
        "totalRestaurants": await db.restaurants.count_documents({}),
        "totalReviews": await db.reviews.count_documents({}),
        "pendingRequests": await db.restaurant_requests.count_documents({"status": "pending"}),
        "unreadMessages": await db.contact_messages.count_documents({"status": "unread"})
    }