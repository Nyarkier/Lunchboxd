import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Data to insert
restaurants = [
    {
        "name": "JAP-IT Food Hauz",
        "cuisine": "Rice Meal",
        "rating": 4.5,
        "location": "108 Nori, Mabini Extension",
        "priceRange": "₱10-50",
        "sides": "Main Gate",
        "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Ate Rica's Bacsilog",
        "cuisine": "Silog",
        "rating": 4.8,
        "location": "Agno Food Court",
        "priceRange": "₱50-100",
        "sides": "Gate Six",
        "image": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Dimsum Treats",
        "cuisine": "Chinese",
        "rating": 4.2,
        "location": "Dagonoy Street",
        "priceRange": "₱10-50",
        "sides": "North Gate",
        "image": "https://images.unsplash.com/photo-1541696432-82c6da8ce6d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Topside Diner",
        "cuisine": "American",
        "rating": 4.6,
        "location": "Leon Guinto St.",
        "priceRange": "₱100+",
        "sides": "Hospital Gate",
        "image": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Healthy Options Cafe",
        "cuisine": "Healthy",
        "rating": 4.0,
        "location": "School Canteen",
        "priceRange": "₱50-100",
        "sides": "Inside the School",
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        "name": "Mang Tootz",
        "cuisine": "Filipino",
        "rating": 4.7,
        "location": "Padre Noval",
        "priceRange": "₱50-100",
        "sides": "Main Gate",
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
]

async def seed_data():
    print("Connecting to database...")
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DB_NAME")]
    
    print("Clearing old data...")
    await db.restaurants.delete_many({})
    
    print(f"Inserting {len(restaurants)} restaurants...")
    result = await db.restaurants.insert_many(restaurants)
    
    print(f"Success! Inserted IDs: {result.inserted_ids}")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())