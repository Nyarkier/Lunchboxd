import json
import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def import_data():
    print("🔌 Connecting to MongoDB...")
    # Get environment variables
    mongo_url = os.getenv("MONGODB_URL")
    db_name = os.getenv("DB_NAME")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    # --- 1. IMPORT USERS ---
    if os.path.exists("users.json"):
        print("👤 Found users.json. Processing...")
        with open("users.json", "r", encoding="utf-8-sig") as f:
            users_data = json.load(f)
            
        await db.users.delete_many({})
        
        cleaned_users = []
        for user in users_data:
            # FIX: Use direct bcrypt hashing to avoid passlib version errors
            if "password" in user:
                password_bytes = user["password"].encode('utf-8')
                salt = bcrypt.gensalt()
                hashed = bcrypt.hashpw(password_bytes, salt)
                user["password"] = hashed.decode('utf-8')
            
            # Standardize ID
            if "id" in user:
                user["_id"] = user.pop("id")
            cleaned_users.append(user)
                
        if cleaned_users:
            await db.users.insert_many(cleaned_users)
            print(f"✅ Imported {len(cleaned_users)} users.")

    # --- 2. IMPORT RESTAURANTS ---
    if os.path.exists("data.json"):
        print("🍔 Found data.json. Processing...")
        with open("data.json", "r", encoding="utf-8-sig") as f:
            file_content = json.load(f)
            restaurants_data = file_content.get("restaurants", [])

        await db.restaurants.delete_many({})
        
        cleaned_restaurants = []
        for r in restaurants_data:
            # 1. Standardize ID
            if "id" in r:
                r["_id"] = r.pop("id")
            
            # 2. Map field names to match your new models/frontend
            if "priceRange" in r:
                r["budgetRange"] = r.pop("priceRange")
            if "image" in r:
                r["profileImage"] = r.pop("image")
                
            cleaned_restaurants.append(r)

        if cleaned_restaurants:
            await db.restaurants.insert_many(cleaned_restaurants)
            print(f"✅ Imported {len(cleaned_restaurants)} restaurants.")

        # --- 3. IMPORT REVIEWS ---
        reviews_data = file_content.get("reviews", [])
        if reviews_data:
            print(f"⭐ Found {len(reviews_data)} reviews. Importing...")
            await db.reviews.delete_many({})
            for review in reviews_data:
                if "id" in review:
                    review["_id"] = review.pop("id")
            await db.reviews.insert_many(reviews_data)
            print(f"✅ Imported {len(reviews_data)} reviews.")

    client.close()
    print("\n🎉 MIGRATION COMPLETE!")

if __name__ == "__main__":
    asyncio.run(import_data())