from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId
from ..database import users_col
from ..models.user import ApplicantRegister, RecruiterRegister, LoginRequest
from ..services.auth_service import hash_password, verify_password, create_token
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register/applicant")
async def register_applicant(data: ApplicantRegister):
    existing = await users_col.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "contact": data.contact,
        "degree": data.degree,
        "year": data.year,
        "roll": data.roll,
        "skills": data.skills,
        "role": "applicant",
        "approved": True,
        "resume_score": None,
        "resume_path": None,
        "analysis_result": None,
        "created_at": datetime.utcnow(),
    }
    result = await users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_token({"sub": user_id, "role": "applicant", "email": data.email, "name": data.name})
    return {"token": token, "role": "applicant", "name": data.name, "user_id": user_id}


@router.post("/register/recruiter")
async def register_recruiter(data: RecruiterRegister):
    existing = await users_col.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "name": data.recruiter_name,
        "company_name": data.company_name,
        "email": data.email,
        "password": hash_password(data.password),
        "contact": data.contact,
        "roles_hiring": data.roles_hiring,
        "min_cgpa": data.min_cgpa,
        "required_skills": data.required_skills,
        "role": "recruiter",
        "approved": False,  # Needs admin approval
        "created_at": datetime.utcnow(),
    }
    result = await users_col.insert_one(user_doc)
    return {"message": "Registration submitted. Awaiting admin approval.", "user_id": str(result.inserted_id)}


@router.post("/login")
async def login(data: LoginRequest):
    # Admin special case
    if data.email == settings.admin_email and data.password == settings.admin_password:
        token = create_token({"sub": "admin_root", "role": "admin", "email": data.email, "name": "Admin"})
        return {"token": token, "role": "admin", "name": "Platform Admin"}

    user = await users_col.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.get("approved") and user["role"] == "recruiter":
        raise HTTPException(status_code=403, detail="Your account is pending admin approval")

    user_id = str(user["_id"])
    token = create_token({
        "sub": user_id,
        "role": user["role"],
        "email": user["email"],
        "name": user.get("name", ""),
    })
    return {
        "token": token,
        "role": user["role"],
        "name": user.get("name"),
        "user_id": user_id,
        "approved": user.get("approved", True),
    }