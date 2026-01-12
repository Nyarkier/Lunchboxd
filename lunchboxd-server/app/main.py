from fastapi import FastAPI
from app.database import db

app = FastAPI()

@app.get("/test-insert")
def test_insert():
    db.test.insert_one({"message": "Hello MongoDB"})
    return {"status": "inserted"}
