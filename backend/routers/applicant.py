from fastapi import APIRouter, Depends
from bson import ObjectId
from ..database import users_col, jobs_col
from ..services.auth_service import require_role

router = APIRouter(prefix="/applicant", tags=["Applicant"])


@router.get("/profile")
async def get_profile(current_user: dict = Depends(require_role("applicant"))):
    user_id = current_user.get("id") or str(current_user.get("_id"))
    user = await users_col.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if user:
        user["id"] = str(user.pop("_id"))
    return user


@router.get("/jobs")
async def matched_jobs(current_user: dict = Depends(require_role("applicant"))):
    """Return jobs sorted by how well they match this user's skills + score."""
    user_id = current_user.get("id") or str(current_user.get("_id"))
    user = await users_col.find_one({"_id": ObjectId(user_id)})

    user_skills = set(user.get("extracted_skills", []) + user.get("skills", []))
    user_score = user.get("resume_score", 0) or 0

    jobs = await jobs_col.find({"status": "active"}).to_list(100)

    # Score each job by skill overlap + min score eligibility
    matched = []
    for j in jobs:
        req_skills = set(j.get("required_skills", []))
        overlap = len(user_skills & req_skills)
        total_req = max(len(req_skills), 1)
        skill_pct = int((overlap / total_req) * 100)

        eligible = user_score >= j.get("min_resume_score", 0)
        match_score = skill_pct if eligible else max(0, skill_pct - 30)

        j["id"] = str(j.pop("_id"))
        j["match_score"] = match_score
        j["skill_overlap"] = overlap
        j["eligible"] = eligible
        matched.append(j)

    matched.sort(key=lambda x: x["match_score"], reverse=True)
    return matched