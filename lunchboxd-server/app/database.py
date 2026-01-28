# app/database.py
import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Connect to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client[os.getenv("DB_NAME")]

# --- THE MISSING PART ---
def fix_id(doc):
    """
    Helper to convert MongoDB's '_id' (ObjectId) to 'id' (String).
    """
    if doc:
        # Convert _id to string and save it as 'id'
        doc["id"] = str(doc.pop("_id"))
    return doc