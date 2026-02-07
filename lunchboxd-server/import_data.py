import json
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def import_data():
    print("🔌 Connecting to MongoDB...")
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DB_NAME")]

    # --- 1. IMPORT USERS ---
    if os.path.exists("users.json"):
        print("👤 Found users.json. Processing...")
        # Use utf-8-sig to handle Byte Order Mark (BOM)
        with open("users.json", "r", encoding="utf-8-sig") as f:
            users_data = json.load(f)
            
        await db.users.delete_many({})
        
        cleaned_users = []
        for user in users_data:
            if "password" in user:
                user["password"] = pwd_context.hash(user["password"])
            if "id" in user:
                user["_id"] = user.pop("id")
            cleaned_users.append(user)
                
        if cleaned_users:
            await db.users.insert_many(cleaned_users)
            print(f"✅ Imported {len(cleaned_users)} users.")

    # --- 2. IMPORT RESTAURANTS ---
    if os.path.exists("data.json"):
        print("🍔 Found data.json. Processing...")
        # Use utf-8-sig to handle Byte Order Mark (BOM)
        with open("data.json", "r", encoding="utf-8-sig") as f:
            file_content = json.load(f)
            restaurants_data = file_content.get("restaurants", [])

        await db.restaurants.delete_many({})
        
        cleaned_restaurants = []
        for r in restaurants_data:
            if "budgetRange" in r:
                r["priceRange"] = r.pop("budgetRange")
            if "profileImage" in r:
                r["image"] = r.pop("profileImage")
            if "id" in r:
                r["_id"] = r.pop("id")
            cleaned_restaurants.append(r)

        if cleaned_restaurants:
            await db.restaurants.insert_many(cleaned_restaurants)
            print(f"✅ Imported {len(cleaned_restaurants)} restaurants.")

    # --- 3. IMPORT REVIEWS ---
    if os.path.exists("data.json"):
        reviews_data = file_content.get("reviews", [])
        if reviews_data:
            print(f"⭐ Found {len(reviews_data)} reviews. Importing...")
            await db.reviews.delete_many({})
            for review in reviews_data:
                if "id" in review:
                    review["_id"] = review.pop("id")
            await db.reviews.insert_many(reviews_data)
            print("✅ Reviews imported.")

    client.close()
    print("\n🎉 MIGRATION COMPLETE!")

if __name__ == "__main__":
    asyncio.run(import_data())