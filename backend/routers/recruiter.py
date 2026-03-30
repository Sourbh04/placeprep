from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from ..database import users_col, jobs_col
from ..models.job import JobPost
from ..services.auth_service import require_role

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


@router.post("/jobs")
async def post_job(job: JobPost, current_user: dict = Depends(require_role("recruiter"))):
    recruiter_id = current_user.get("id") or str(current_user.get("_id"))
    doc = {
        **job.model_dump(),
        "recruiter_id": recruiter_id,
        "company_name": current_user.get("company_name", ""),
        "status": "active",
        "applicants_count": 0,
        "created_at": datetime.utcnow(),
    }
    result = await jobs_col.insert_one(doc)
    return {"success": True, "job_id": str(result.inserted_id)}


@router.get("/jobs")
async def my_jobs(current_user: dict = Depends(require_role("recruiter"))):
    recruiter_id = current_user.get("id") or str(current_user.get("_id"))
    jobs = await jobs_col.find({"recruiter_id": recruiter_id}).to_list(100)
    for j in jobs:
        j["id"] = str(j.pop("_id"))
    return jobs


@router.get("/applicants")
async def get_applicants(
    role: str = None,
    min_score: int = 0,
    current_user: dict = Depends(require_role("recruiter"))
):
    """Get all applicants, sorted by resume score, filtered by role/score."""
    query = {"role": "applicant", "resume_score": {"$gte": min_score}}
    if role:
        query["extracted_skills"] = {"$in": [role]}

    applicants = await users_col.find(
        query,
        {"password": 0}  # Never return passwords
    ).sort("resume_score", -1).to_list(200)

    for a in applicants:
        a["id"] = str(a.pop("_id"))
    return applicants


@router.patch("/jobs/{job_id}/status")
async def toggle_job_status(
    job_id: str,
    status: str,
    current_user: dict = Depends(require_role("recruiter"))
):
    await jobs_col.update_one({"_id": ObjectId(job_id)}, {"$set": {"status": status}})
    return {"success": True}