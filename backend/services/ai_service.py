import fitz  # PyMuPDF
import json
import re
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.schema import HumanMessage, SystemMessage
from pinecone import Pinecone
from ..config import settings

# ── Init Gemini LLM ──
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=settings.gemini_api_key,
    temperature=0.3,
)

# ── Init Embeddings (Gemini) ──
embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=settings.gemini_api_key,
)

# ── Init Pinecone ──
pc = Pinecone(api_key=settings.pinecone_api_key)
index = pc.Index(settings.pinecone_index)


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file using PyMuPDF."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


async def embed_and_store(user_id: str, resume_text: str) -> list:
    """Generate embeddings and upsert to Pinecone."""
    # Chunk the resume text (Pinecone limit: ~8000 tokens per vector)
    chunks = [resume_text[i:i+1500] for i in range(0, len(resume_text), 1500)]
    vectors = []

    for idx, chunk in enumerate(chunks[:5]):  # max 5 chunks
        embedding = embeddings_model.embed_query(chunk)
        vector_id = f"{user_id}_chunk_{idx}"
        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {"user_id": user_id, "chunk": idx, "text": chunk[:500]}
        })

    if vectors:
        index.upsert(vectors=vectors, namespace="resumes")

    # Return the first embedding for matching later
    return embeddings_model.embed_query(resume_text[:2000])


ANALYSIS_PROMPT = """
You are an expert career counselor and ATS (Applicant Tracking System) evaluating a resume.

Analyze the following resume and respond ONLY with a valid JSON object (no markdown, no extra text).

Resume:
{resume_text}

Return this exact JSON structure:
{{
  "score": <integer 0-100 based on completeness, skills, experience, formatting>,
  "grade": "<Excellent|Good|Average|Needs Improvement>",
  "summary": "<2-sentence summary of the candidate's profile>",
  "suggested_roles": ["<role1>", "<role2>", "<role3>"],
  "strengths": ["<point1>", "<point2>", "<point3>"],
  "weaknesses": ["<point1>", "<point2>", "<point3>"],
  "suggestions": ["<actionable tip1>", "<actionable tip2>", "<actionable tip3>"],
  "extracted_skills": ["<skill1>", "<skill2>"],
  "experience_years": <number or 0 for freshers>,
  "education_level": "<B.Tech|M.Tech|MBA|PhD|Other>"
}}

Scoring rubric:
- Contact info present: +5
- Professional summary: +10
- Quantified achievements: +15
- Relevant skills (10+): +15
- Projects with links: +15
- Education section: +10
- Experience/internships: +15
- Certifications: +5
- Clean formatting: +10
"""


async def analyze_resume(user_id: str, pdf_path: str) -> dict:
    """Full pipeline: extract → embed → LLM analyze → return structured result."""

    # Step 1: Extract text
    resume_text = extract_text_from_pdf(pdf_path)
    if not resume_text or len(resume_text) < 50:
        raise ValueError("Could not extract meaningful text from the PDF.")

    # Step 2: Embed + store in Pinecone
    embedding = await embed_and_store(user_id, resume_text)

    # Step 3: LLM analysis via Gemini
    prompt = ANALYSIS_PROMPT.format(resume_text=resume_text[:4000])  # stay within token limit
    messages = [
        SystemMessage(content="You are a professional resume evaluator. Always respond with valid JSON only."),
        HumanMessage(content=prompt)
    ]
    response = llm.invoke(messages)
    raw = response.content.strip()

    # Strip markdown code fences if Gemini wraps in ```json
    raw = re.sub(r"^```(?:json)?\n?", "", raw)
    raw = re.sub(r"\n?```$", "", raw)

    result = json.loads(raw)

    # Step 4: Add embedding reference
    result["resume_text_preview"] = resume_text[:300]
    result["pinecone_stored"] = True

    return result


async def match_jobs_for_user(user_embedding: list, user_skills: list, resume_score: int, limit: int = 10) -> list:
    """Query Pinecone for similar job embeddings + filter by skills/score."""
    try:
        results = index.query(
            vector=user_embedding,
            top_k=limit,
            namespace="jobs",
            include_metadata=True
        )
        return results.get("matches", [])
    except Exception:
        return []