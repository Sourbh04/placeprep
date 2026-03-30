from pydantic import BaseModel
from typing import List, Optional

class JobPost(BaseModel):
    title: str
    department: str
    job_type: str
    location: str
    ctc: str
    description: str
    required_skills: List[str] = []
    min_cgpa: float = 0.0
    min_resume_score: int = 0
    experience: str = "Fresher"

class JobOut(JobPost):
    id: str
    recruiter_id: str
    company_name: str
    status: str = "active"
    applicants_count: int = 0