from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from ..database import users_col, jobs_col
from ..services.auth_service import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/recruiters/pending")
async def pending_recruiters(current_user: dict = Depends(require_role("admin"))):
    recruiters = await users_col.find({"role": "recruiter", "approved": False}, {"password": 0}).to_list(100)
    for r in recruiters:
        r["id"] = str(r.pop("_id"))
    return recruiters


@router.post("/recruiters/{recruiter_id}/approve")
async def approve_recruiter(recruiter_id: str, current_user: dict = Depends(require_role("admin"))):
    await users_col.update_one({"_id": ObjectId(recruiter_id)}, {"$set": {"approved": True}})
    return {"success": True, "message": "Recruiter approved"}


@router.delete("/recruiters/{recruiter_id}")
async def remove_recruiter(recruiter_id: str, current_user: dict = Depends(require_role("admin"))):
    await users_col.delete_one({"_id": ObjectId(recruiter_id)})
    return {"success": True}


@router.get("/applicants")
async def all_applicants(current_user: dict = Depends(require_role("admin"))):
    applicants = await users_col.find({"role": "applicant"}, {"password": 0}).sort("resume_score", -1).to_list(500)
    for a in applicants:
        a["id"] = str(a.pop("_id"))
    return applicants


@router.get("/jobs")
async def all_jobs(current_user: dict = Depends(require_role("admin"))):
    jobs = await jobs_col.find({}).to_list(200)
    for j in jobs:
        j["id"] = str(j.pop("_id"))
    return jobs


@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, current_user: dict = Depends(require_role("admin"))):
    await jobs_col.delete_one({"_id": ObjectId(job_id)})
    return {"success": True}