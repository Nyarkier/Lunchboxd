# app/models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime

# --- Enums ---
class SideEnum(str, Enum):
    main_gate = "Main Gate"
    gate_six = "Gate Six"
    inside = "Inside the School"
    north_gate = "North Gate"
    hospital_gate = "Hospital Gate"

# --- USER MODELS ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    firstName: str
    lastName: str
    mobile: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str
    password: str # Hashed

class UserPublic(UserBase):
    id: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- RESTAURANT MODELS ---
class Restaurant(BaseModel):
    id: Optional[str] = None
    name: str
    cuisine: str
    rating: float
    location: str
    priceRange: str
    sides: str
    image: Optional[str] = None

# --- FAVORITE & REVIEW MODELS ---
class Favorite(BaseModel):
    userId: str
    restaurantId: str

class Review(BaseModel):
    id: Optional[str] = None
    restaurantId: str
    userId: str
    rating: int = Field(..., ge=1, le=5)
    comment: str
    createdAt: Optional[datetime] = None