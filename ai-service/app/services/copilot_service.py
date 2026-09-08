from app.models import CopilotRequest, CopilotResponse
from app.services.llm_provider import get_llm_provider
from app.security.guardrails import mask_pii, check_prompt_injection, append_transparency_notice

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
        system_instruction="You are CareerSetu AI Copilot, an expert advisor for Indian college students and young professionals. Provide actionable, supportive, structured career and skill guidance."
    )
    
    # Enrich with actionable follow-ups based on query
    lower = last_user_message.lower()
    suggested_actions = [
        "Take a verified skill assessment",
        "View matching internships on marketplace",
        "Schedule mentorship session"
    ]
    recommended_skills = []
    if "backend" in lower or "java" in lower or "api" in lower:
        recommended_skills = ["Spring Boot", "PostgreSQL", "Docker", "Redis", "Kafka"]
    elif "frontend" in lower or "react" in lower or "web" in lower:
        recommended_skills = ["React 19", "TypeScript", "Tailwind CSS", "Next.js"]
    elif "ai" in lower or "data" in lower:
        recommended_skills = ["Python", "PyTorch", "LangChain", "Vector DBs", "SQL"]
    else:
        recommended_skills = ["Data Structures & Algorithms", "System Design", "Git/GitHub"]

    return CopilotResponse(
        response=append_transparency_notice(raw_response),
        suggested_actions=suggested_actions,
        recommended_skills=recommended_skills
    )
