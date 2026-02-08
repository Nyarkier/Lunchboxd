from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/admin/requests", tags=["admin"])

requests_db = []  # Replace with DB later


@router.post("/{requestId}/approve")
def approve_request(requestId: str):
    for r in requests_db:
        if r["id"] == requestId:
            r["status"] = "approved"
            return {"success": True, "request": r}
    raise HTTPException(status_code=404, detail="Request not found")


@router.post("/{requestId}/reject")
def reject_request(requestId: str):
    for r in requests_db:
        if r["id"] == requestId:
            r["status"] = "rejected"
            return {"success": True, "request": r}
    raise HTTPException(status_code=404, detail="Request not found")
