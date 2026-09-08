import io
import re
from typing import List
from pypdf import PdfReader
from app.models import ResumeAnalyzeRequest, ResumeAnalyzeResponse, ResumeUploadResponse

ACTION_VERBS = {
    "architected", "developed", "implemented", "optimized", "engineered",
    "deployed", "designed", "reduced", "increased", "orchestrated", "automated"
}

TECH_KEYWORDS = {
    "java", "spring", "docker", "kubernetes", "sql", "postgresql", "redis",
    "react", "typescript", "python", "git", "ci/cd", "rest api", "graphql", "aws", "linux"
}

def analyze_resume(request: ResumeAnalyzeRequest) -> ResumeAnalyzeResponse:
    text = request.resume_text.lower()
    
    # 1. Action verbs detection
    found_verbs = [v for v in ACTION_VERBS if v in text]
    
    # 2. Tech keywords detection
    found_keywords = [k for k in TECH_KEYWORDS if k in text]
    missing_keywords = [k.title() for k in TECH_KEYWORDS if k not in text][:5]
    
    # 3. Metrics detection (numbers, percentages)
    has_metrics = bool(re.search(r'\b\d+%\b|\b\d+x\b|\b\d+\s*(?:ms|seconds|users|requests|percent)\b', text))
    
    # Calculate score
    score = 50
    if len(found_verbs) >= 4:
        score += 15
    elif len(found_verbs) >= 2:
        score += 8
        
    if len(found_keywords) >= 6:
        score += 20
    elif len(found_keywords) >= 3:
        score += 10
        
    if has_metrics:
        score += 15
        
    score = min(score, 96)
    ats_score = int(score * 0.95)
    
    strengths = []
    weaknesses = []
    actionable_improvements = []
    
    if len(found_verbs) >= 3:
        strengths.append(f"Strong use of impact verbs ({', '.join(found_verbs[:3])}).")
    else:
        weaknesses.append("Too few strong action verbs; descriptions appear passive.")
        actionable_improvements.append("Begin project bullet points with action verbs (e.g. 'Engineered', 'Optimized', 'Architected').")
        
    if has_metrics:
        strengths.append("Contains quantified impact metrics (percentages, performance figures).")
    else:
        weaknesses.append("Lack of measurable business or technical outcomes in project descriptions.")
        actionable_improvements.append("Add quantifiable results to each project (e.g., 'Reduced API response latency by 35%').")
        
    if len(found_keywords) >= 4:
        strengths.append(f"Relevant technical keywords detected ({', '.join(found_keywords[:4])}).")
    else:
        weaknesses.append("Low density of core tech stack keywords for this role.")
        actionable_improvements.append(f"Integrate key missing keywords: {', '.join(missing_keywords[:3])}.")

    summary = (
        f"Resume scored {score}/100 with an ATS compatibility index of {ats_score}/100 for {request.target_role}. "
        "Implementing quantified achievements and adding missing target keywords will elevate your application to top percentile candidate tiers."
    )

    return ResumeAnalyzeResponse(
        overall_score=score,
        ats_compatibility_score=ats_score,
        strengths=strengths,
        weaknesses=weaknesses,
        missing_keywords=missing_keywords,
        actionable_improvements=actionable_improvements,
        summary=summary
    )


def extract_text_from_file_bytes(content: bytes, filename: str) -> str:
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(content))
            pages_text = []
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    pages_text.append(t)
            extracted = "\n".join(pages_text).strip()
            if extracted:
                return extracted
        except Exception:
            pass
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        return content.decode("latin-1", errors="ignore")


def process_uploaded_resume(
    content: bytes,
    filename: str,
    target_role: str = "Software Engineer Intern",
    target_industry: str = "Technology"
) -> ResumeUploadResponse:
    text = extract_text_from_file_bytes(content, filename)
    req = ResumeAnalyzeRequest(
        resume_text=text,
        target_role=target_role,
        target_industry=target_industry
    )
    analysis = analyze_resume(req)
    return ResumeUploadResponse(
        extracted_text=text,
        file_name=filename,
        char_count=len(text),
        analysis=analysis
    )
