# app/models.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from enum import Enum
from datetime import datetime

# --- EXISTING MODELS (Updated to match data.json) ---

class UserBase(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    mobile: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: str
    role: str = "user"
    createdAt: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class Review(BaseModel):
    id: Optional[str] = None
    restaurantId: str
    userId: str
    rating: int
    comment: str
    createdAt: Optional[str] = None
    # Optional fields for easier frontend display
    userFirstName: Optional[str] = None 
    userAvatar: Optional[str] = None

class Restaurant(BaseModel):
    id: Optional[str] = None
    name: str
    cuisine: str
    rating: float = 0
    location: str
    budgetRange: str     # Matches data.json
    type: str = "Food"
    paymentMode: List[str] = []
    sides: str
    profileImage: Optional[str] = None # Matches data.json
    menuImages: List[str] = []         # Matches data.json

class Favorite(BaseModel):
    userId: str
    restaurantId: str

# --- NEW MODELS (For Admin Features) ---

class RestaurantRequest(BaseModel):
    id: Optional[str] = None
    restaurantName: str
    cuisine: str
    location: str
    budgetRange: str
    type: Literal["Food", "Drink", "Other"] = "Food"
    paymentMode: List[str] = []
    sides: str
    description: Optional[str] = None
    submittedBy: Optional[str] = None
    submittedAt: Optional[str] = None
    status: Literal["pending", "approved", "rejected"] = "pending"
    contact: Optional[str] = None
    profileImage: Optional[str] = None
    menuImages: List[str] = []

class ContactMessage(BaseModel):
    id: Optional[str] = None
    senderName: str
    senderEmail: EmailStr
    subject: str
    message: str
    submittedAt: Optional[str] = None
    status: Literal["unread", "read"] = "unread"

class AdminStats(BaseModel):
    totalUsers: int
    totalRestaurants: int
    totalReviews: int
    pendingRequests: int
    unreadMessages: int