# app/database.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Get the URI from your .env file
MONGODB_URL = os.getenv("MONGODB_URL")

# Create the client
client = AsyncIOMotorClient(MONGODB_URL)

# Select your database name (Lunchboxd)
db = client.Lunchboxd 

# Helper function to convert MongoDB's _id to a string 'id' for the frontend
def fix_id(obj):
    if obj and "_id" in obj:
        obj["id"] = str(obj["_id"])
    return obj