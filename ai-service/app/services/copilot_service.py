from app.models import CopilotRequest, CopilotResponse
from app.services.llm_provider import get_llm_provider
from app.security.guardrails import mask_pii, check_prompt_injection, append_transparency_notice

COPILOT_SYSTEM_INSTRUCTION = """You are CareerSetu AI Copilot, an expert advisor for Indian college students and young professionals. Provide actionable, supportive, structured career and skill guidance.

# ANTI-TEMPLATING RULE
Never reuse a fixed structure (e.g. "Core Competencies / Data & Caching / Microservices & System Design / AI/ML Integration") across unrelated questions.
Your response must be derived from the CURRENT user message, not a stock roadmap you default to when uncertain. If the user's question is narrow (e.g. "what internships match my profile"), answer that narrow question — do not pad it out with a generic skills roadmap unless they asked for one.
Before responding, silently check: "Does this answer actually address what THIS specific message asked, using THIS user's real profile/tool data — or am I reciting a stock template?" If the latter, rewrite it.
Every reply that cites the user's profile (target role, verified skills, academic standing) must use the values actually present in the CURRENT USER CONTEXT block — never a plausible-sounding default. If that context is missing, say you don't have their profile loaded rather than inventing role-appropriate content."""

async def handle_copilot_chat(request: CopilotRequest) -> CopilotResponse:
    last_user_message = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
    
    # Prompt injection check
    is_safe, reason = check_prompt_injection(last_user_message)
    if not is_safe:
        return CopilotResponse(
            response=f"I cannot process this request because it violates safety guidelines: {reason}.",
            suggested_actions=["Ask about career roadmaps", "Ask for interview preparation tips", "Analyze a target job profile"],
            recommended_skills=[]
        )
    
    # Mask PII for privacy
    sanitized_prompt = mask_pii(last_user_message)
    
    # Context enrichment
    context_prefix = ""
    if request.student_context:
        ctx = request.student_context
        context_prefix = f"[Candidate Profile: Target Role={ctx.target_role or 'Not specified'}, Skills={', '.join(ctx.skills) if ctx.skills else 'None listed'}, Education={ctx.education_level}]\n"
        
    full_prompt = f"{context_prefix}User Query: {sanitized_prompt}"
    
    provider = get_llm_provider()
    raw_response = await provider.generate_response(
        prompt=full_prompt,
        system_instruction=COPILOT_SYSTEM_INSTRUCTION,
        user_query=sanitized_prompt
    )
    
    # Enrich with actionable follow-ups dynamically based on actual query
    lower = last_user_message.lower()
    if any(k in lower for k in ["pm", "product manager", "product management", "apm"]):
        suggested_actions = ["Scan Resume for PM Roles", "View Product Teardowns", "Explore PM Internships"]
        recommended_skills = ["Product Analytics", "A/B Testing", "PRD Writing", "User Research", "SQL"]
    elif any(k in lower for k in ["internship", "job", "opportunity", "match", "openings"]):
        suggested_actions = ["Explore Opportunity Marketplace", "Check Application Tracker", "Verify Skills for Matching"]
        recommended_skills = ["Profile Verification", "Resume ATS Alignment", "Interview Readiness"]
    elif any(k in lower for k in ["resume", "ats", "cv"]):
        suggested_actions = ["Run ATS Resume Scanner", "Benchmark Skills with Target JD", "Export ATS-Optimized Summary"]
        recommended_skills = ["Quantifiable Impact (STAR)", "Keyword Optimization", "Technical Formatting"]
    elif "backend" in lower or "java" in lower or "spring" in lower:
        suggested_actions = ["Take Spring Boot Assessment", "Build Distributed Cache Project", "View Cloud Internships"]
        recommended_skills = ["Spring Boot", "PostgreSQL", "Docker", "Redis", "Kafka"]
    elif "frontend" in lower or "react" in lower or "web" in lower:
        suggested_actions = ["Take React Assessment", "Build Accessible Web App", "Explore Frontend Internships"]
        recommended_skills = ["React 19", "TypeScript", "Tailwind CSS", "Next.js"]
    elif "ai" in lower or "data" in lower or "ml" in lower:
        suggested_actions = ["Take Python/ML Assessment", "Build RAG Application", "View AI/ML Internships"]
        recommended_skills = ["Python", "PyTorch", "LangChain", "Vector DBs", "SQL"]
    else:
        suggested_actions = [
            "Take a verified skill assessment",
            "View matching internships on marketplace",
            "Schedule mentorship session"
        ]
        recommended_skills = ["Problem Solving", "System Architecture", "Git/GitHub"]

    return CopilotResponse(
        response=append_transparency_notice(raw_response),
        suggested_actions=suggested_actions,
        recommended_skills=recommended_skills
    )
