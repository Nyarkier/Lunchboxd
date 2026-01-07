from fastapi import FastAPI

app = FastAPI(title="Lunchboxd API")

@app.get("/")
def root():
    return {"message": "Lunchboxd backend running"}


asd  