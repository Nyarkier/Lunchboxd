from fastapi import APIRouter

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

# Temporary fake data
restaurants = [
    {"id": 1, "name": "Jollibee"},
    {"id": 2, "name": "McDonald's"},
]

@router.get("/")
def get_restaurants():
    return restaurants

@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: int):
    for r in restaurants:
        if r["id"] == restaurant_id:
            return r
    return {"error": "Restaurant not found"}
