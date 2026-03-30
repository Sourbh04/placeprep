import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pathlib import Path
from ..services.ai_service import analyze_resume
from ..services.auth_service import get_current_user, require_role
from ..database import users_col
from bson import ObjectId

router = APIRouter(prefix="/resume", tags=["Resume"])
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_role("applicant"))
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Max 10 MB
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 10 MB")

    # Save file
    user_id = current_user.get("id") or str(current_user.get("_id"))
    filename = f"{user_id}_{uuid.uuid4().hex[:8]}.pdf"
    file_path = UPLOAD_DIR / filename
    with open(file_path, "wb") as f:
        f.write(contents)

    # Run AI analysis
    try:
        result = await analyze_resume(user_id, str(file_path))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    # Store result in MongoDB
    await users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "resume_path": str(file_path),
            "resume_score": result["score"],
            "analysis_result": result,
            "extracted_skills": result.get("extracted_skills", []),
        }}
    )

    return {
        "success": True,
        "score": result["score"],
        "grade": result["grade"],
        "summary": result["summary"],
        "suggested_roles": result["suggested_roles"],
        "strengths": result["strengths"],
        "weaknesses": result["weaknesses"],
        "suggestions": result["suggestions"],
        "skills": result.get("extracted_skills", []),
    }


@router.get("/result")
async def get_result(current_user: dict = Depends(require_role("applicant"))):
    user_id = current_user.get("id") or str(current_user.get("_id"))
    user = await users_col.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("analysis_result"):
        return {"has_result": False}
    return {"has_result": True, **user["analysis_result"]}