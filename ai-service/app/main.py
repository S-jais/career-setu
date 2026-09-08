from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
import time
import logging

from app.config import settings
from app.models import (
    CopilotRequest, CopilotResponse,
    SkillGapRequest, SkillGapResponse,
    ResumeAnalyzeRequest, ResumeAnalyzeResponse,
    ResumeUploadResponse,
    MatchRequest, MatchResponse,
    DigitalTwinRequest, DigitalTwinResponse,
    AssistantRequest, AssistantResponse
)
from app.services.copilot_service import handle_copilot_chat
from app.services.skill_gap_service import analyze_skill_gap
from app.services.resume_service import analyze_resume, process_uploaded_resume
from app.services.matching_service import calculate_opportunity_match
from app.services.digital_twin_service import compute_digital_twin
from app.services.assistant_service import handle_assistant_chat

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("careersetu-ai")

app = FastAPI(
    title="CareerSetu AI Intelligence Service",
    version="1.0.0",
    description="India-First AI Career & Academia-Industry Collaboration OS — AI Service"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/health")
async def health():
    return {
        "status": "UP",
        "service": "careersetu-ai-service",
        "version": "1.0.0",
        "default_provider": settings.DEFAULT_PROVIDER
    }

@app.post("/api/v1/ai/copilot", response_model=CopilotResponse)
async def copilot_endpoint(request: CopilotRequest):
    try:
        return await handle_copilot_chat(request)
    except Exception as e:
        logger.error(f"Error in copilot endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error generating copilot advice")

@app.post("/api/v1/ai/skill-gap", response_model=SkillGapResponse)
async def skill_gap_endpoint(request: SkillGapRequest):
    try:
        return analyze_skill_gap(request)
    except Exception as e:
        logger.error(f"Error in skill-gap endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error analyzing skill gap")

@app.post("/api/v1/ai/resume-analyzer", response_model=ResumeAnalyzeResponse)
async def resume_analyzer_endpoint(request: ResumeAnalyzeRequest):
    try:
        return analyze_resume(request)
    except Exception as e:
        logger.error(f"Error in resume-analyzer endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error analyzing resume")

@app.post("/api/v1/ai/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume_endpoint(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form("Software Engineer Intern"),
    target_industry: Optional[str] = Form("Technology")
):
    try:
        content = await file.read()
        return process_uploaded_resume(
            content=content,
            filename=file.filename or "resume.txt",
            target_role=target_role or "Software Engineer Intern",
            target_industry=target_industry or "Technology"
        )
    except Exception as e:
        logger.error(f"Error in upload-resume endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error processing uploaded resume")

@app.post("/api/v1/ai/match", response_model=MatchResponse)
async def match_endpoint(request: MatchRequest):
    try:
        return calculate_opportunity_match(request)
    except Exception as e:
        logger.error(f"Error in match endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error calculating match score")

@app.post("/api/v1/ai/digital-twin", response_model=DigitalTwinResponse)
async def digital_twin_endpoint(request: DigitalTwinRequest):
    try:
        return compute_digital_twin(request)
    except Exception as e:
        logger.error(f"Error in digital-twin endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error computing digital twin")

@app.post("/api/v1/ai/assistant", response_model=AssistantResponse)
async def assistant_endpoint(request: AssistantRequest):
    try:
        return await handle_assistant_chat(request)
    except Exception as e:
        logger.error(f"Error in assistant endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error generating assistant response")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
