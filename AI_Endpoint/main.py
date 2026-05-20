from fastapi import FastAPI, UploadFile, Form
import shutil
import uuid
import os

from analyze_logic import analyze_candidate

app = FastAPI(title="Candidate Analysis Service")

# Temporary directory for uploaded PDFs
TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)


@app.post("/analyze")
async def analyze(
    resume: UploadFile,
    linkedin: UploadFile,
    github_url: str = Form(...),
    target_role: str = Form(...)
):
    resume_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_resume.pdf")
    linkedin_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_linkedin.pdf")

    try:
        # Save uploaded files
        with open(resume_path, "wb") as f:
            shutil.copyfileobj(resume.file, f)

        with open(linkedin_path, "wb") as f:
            shutil.copyfileobj(linkedin.file, f)

        # Call ML logic
        result = analyze_candidate(
            resume_path,
            linkedin_path,
            github_url,
            target_role
        )

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

    finally:
        # Cleanup temp files
        if os.path.exists(resume_path):
            os.remove(resume_path)
        if os.path.exists(linkedin_path):
            os.remove(linkedin_path)