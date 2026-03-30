from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    applicant = "applicant"
    recruiter = "recruiter"
    admin     = "admin"

class ApplicantRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    contact: str
    degree: str
    year: str
    roll: str
    skills: List[str] = []

class RecruiterRegister(BaseModel):
    company_name: str
    recruiter_name: str
    email: EmailStr
    password: str
    contact: str
    roles_hiring: List[str] = []
    min_cgpa: float = 0.0
    required_skills: List[str] = []

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    role: Role
    name: str
    approved: bool = True