from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .routers import auth, applicant, recruiter, admin, resume

app = FastAPI(title="PREPLACE API", version="1.0.0")

# CORS — allow your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads folder (optional: serve PDFs to admin)
Path("uploads").mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Register all routers
app.include_router(auth.router)
app.include_router(applicant.router)
app.include_router(recruiter.router)
app.include_router(admin.router)
app.include_router(resume.router)

@app.get("/")
def root():
    return {"status": "PREPLACE API running", "version": "1.0.0"}