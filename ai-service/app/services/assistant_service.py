"""
Career Setu AI Assistant — Context-Aware Navigation & Guidance Service
Returns structured response blocks (TEXT, NAVIGATE, STEP_LIST, etc.) for rich UI rendering.
Strictly validates routes and role authorizations to eliminate hallucinations.
"""

import re
from typing import List, Dict, Optional, Tuple, Any
from app.models import (
    AssistantRequest, AssistantResponse, AssistantResponseBlock
)
from app.services.llm_provider import get_llm_provider
from app.security.guardrails import mask_pii, check_prompt_injection

# ── Career Setu Knowledge Base ────────────────────────────────
# Maps every official feature to its canonical route, description, and permitted roles.

CAREER_SETU_FEATURES: List[Dict[str, Any]] = [
    # Student features
    {
        "name": "Student Dashboard",
        "route": "/student/overview",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Your command center. See your Career Readiness Index, skill progress, upcoming events, recent applications, and AI-powered recommendations at a glance."
    },
    {
        "name": "Career Passport",
        "route": "/student/passport",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Your verified digital career profile. Showcases your education, skills (verified and self-declared), projects, certifications, and work experience with tamper-evident credentials."
    },
    {
        "name": "Career Digital Twin",
        "route": "/student/digital-twin",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "An AI-powered, continuously evolving digital representation of your career readiness. Computes your Career Readiness Index (CRI) across 5 dimensions, maps Career DNA skill clusters, predicts career trajectories, and benchmarks you against peers."
    },
    {
        "name": "Skill Intelligence",
        "route": "/student/skills",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Analyze your skill gaps against industry demand. See which skills are HIGH/MEDIUM/EMERGING demand, get AI-powered learning recommendations, and track your skill growth over time."
    },
    {
        "name": "Opportunity Marketplace",
        "route": "/student/opportunities",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Browse and apply to internships, full-time jobs, and project opportunities posted by verified employers. Each listing shows an AI match score based on your skills and profile."
    },
    {
        "name": "Application Tracker",
        "route": "/student/applications",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Track all your job and internship applications in one place. See statuses (Applied, Under Review, Shortlisted, Offered, Rejected), interview schedules, and employer feedback."
    },
    {
        "name": "Skill Assessment",
        "route": "/student/assessment",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Take proctored skill assessments to verify your competencies. Earn verified badges that appear on your Career Passport and boost your credibility with employers."
    },
    {
        "name": "AI Copilot & Resume Studio",
        "route": "/student/copilot",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Your AI career advisor. Get personalized career guidance, have your resume analyzed against ATS algorithms, and receive optimization suggestions. Includes a full Resume Studio with drag-and-drop upload."
    },
    {
        "name": "Learning Roadmap",
        "route": "/student/learning",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "AI-curated learning paths and course recommendations tailored to your skill gaps and target role. Includes estimated completion times and progress tracking."
    },
    {
        "name": "Mentorship Hub",
        "route": "/student/mentors",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Connect with industry mentors for 1:1 guidance. Browse mentor profiles by expertise, book sessions, and get career advice from experienced professionals."
    },
    {
        "name": "Campus Events",
        "route": "/student/events",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Discover and register for placement drives, hackathons, workshops, career fairs, and campus recruitment events."
    },
    {
        "name": "Message Center",
        "route": "/student/messages",
        "roles": ["STUDENT", "ALUMNI"],
        "description": "Communicate with employers, mentors, and the TPO office. Receive interview invitations, offer letters, and career guidance messages."
    },

    # Employer features
    {
        "name": "Employer Dashboard",
        "route": "/employer/overview",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Overview of your recruitment pipeline — active job postings, applicant statistics, interview schedules, and hiring analytics."
    },
    {
        "name": "Job Management",
        "route": "/employer/jobs",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Create, edit, and manage job and internship postings. Define required skills, eligibility criteria, and let AI match candidates automatically."
    },
    {
        "name": "Applicant ATS",
        "route": "/employer/applicants",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Applicant Tracking System. Review applications, see AI match scores, move candidates through pipeline stages (Shortlisted, Interview, Offered), and provide feedback."
    },
    {
        "name": "Candidate Search",
        "route": "/employer/candidates",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Search and filter verified student talent pool by skills, CRI score, and graduation year."
    },
    {
        "name": "Interview Scheduler",
        "route": "/employer/interviews",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Schedule and manage interviews with candidates. Set time slots, send invitations, and track interview outcomes."
    },
    {
        "name": "Employer Analytics",
        "route": "/employer/analytics",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Hiring performance analytics — application funnel metrics, time-to-hire, skill distribution of applicants, and diversity insights."
    },
    {
        "name": "Company Profile",
        "route": "/employer/profile",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Manage your company's public profile on Career Setu — brand, description, culture, benefits, and verification status."
    },
    {
        "name": "Employer Messages",
        "route": "/employer/messages",
        "roles": ["EMPLOYER", "RECRUITER"],
        "description": "Communicate with candidates, send interview invites, and coordinate with the TPO office."
    },

    # Institution features
    {
        "name": "Institution Dashboard",
        "route": "/institution/overview",
        "roles": ["TPO", "INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"],
        "description": "Placement office command center — student placement statistics, skill analytics, active placement drives, and employer engagement metrics."
    },
    {
        "name": "Student Roster",
        "route": "/institution/students",
        "roles": ["TPO", "INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"],
        "description": "View and manage all students in your institution. See their Career Readiness scores, skill profiles, placement status, and engagement metrics."
    },
    {
        "name": "Placement Drives",
        "route": "/institution/drives",
        "roles": ["TPO", "INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"],
        "description": "Create and manage placement drives. Invite employers, set eligibility criteria, track registrations, and monitor drive outcomes."
    },
    {
        "name": "Institution Analytics & NIRF",
        "route": "/institution/analytics",
        "roles": ["TPO", "INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"],
        "description": "NIRF ranking metrics, placement trends, department performance, and accreditation readiness reports."
    },
]

# Canonical route aliases mapping to standard platform routes
ROUTE_ALIASES: Dict[str, str] = {
    "/student/skill-passport": "/student/passport",
    "/student/twin": "/student/digital-twin",
    "/student/jobs": "/student/opportunities",
    "/student/internships": "/student/opportunities",
    "/employer/talent": "/employer/candidates",
    "/employer/candidate-search": "/employer/candidates",
    "/institution/nirf": "/institution/analytics",
    "/institution/reports": "/institution/analytics",
}

# Page context descriptions
PAGE_CONTEXT_MAP: Dict[str, str] = {}
for feat in CAREER_SETU_FEATURES:
    PAGE_CONTEXT_MAP[feat["route"]] = f"The user is currently viewing the **{feat['name']}** page. {feat['description']}"

# Direct action regex (identifying requests to execute actions on behalf of user)
DIRECT_ACTION_PATTERN = re.compile(
    r'\b(apply (to|for) (this|the|a|all)?\s*(job|opportunity|internship)|submit (my|an)?\s*application|complete (the|my)?\s*assessment for me|take (the|my)?\s*(test|quiz) for me|hire (a|the)?\s*candidate for me)\b',
    re.IGNORECASE
)

# Deterministic Career Twin & Skill Passport Data
DETERMINISTIC_TWIN_DATA = {
    "career_readiness_index": 82,
    "cri_grade": "A",
    "percentile": 88,
    "growth_velocity": 4.2,
    "growth_trend": "ACCELERATING",
    "top_skills": ["React.js (90%)", "Python (85%)", "REST APIs (82%)"],
    "critical_gap": "System Design & Distributed Systems (45%)",
    "target_role": "Full Stack Developer",
    "trajectory": "8-12 weeks to 92% readiness for Senior Full Stack Intern",
}

DETERMINISTIC_PASSPORT_DATA = {
    "verified_credentials_count": 4,
    "badges": [
        {"name": "React.js Advanced", "score": 92, "level": "ADVANCED"},
        {"name": "Python Core", "score": 88, "level": "ADVANCED"},
        {"name": "REST API Architecture", "score": 85, "level": "INTERMEDIATE"},
        {"name": "Cloud Fundamentals", "score": 80, "level": "INTERMEDIATE"}
    ],
    "verification_notice": "Cryptographically signed & tamper-evident with QR credential verification"
}


def _is_route_authorized(route: str, user_role: str) -> Tuple[bool, Optional[Dict[str, Any]]]:
    """
    Validate if a given route is canonical and authorized for the specified user role.
    Returns (is_authorized, feature_dict).
    """
    normalized_route = ROUTE_ALIASES.get(route.strip(), route.strip())
    role_upper = (user_role or "STUDENT").upper().strip()

    feature = next((f for f in CAREER_SETU_FEATURES if f["route"] == normalized_route), None)
    if not feature:
        return False, None

    # Check role permission
    is_authorized = any(r in role_upper for r in feature["roles"]) or any(role_upper in r for r in feature["roles"])
    if not is_authorized:
        return False, None

    return True, feature


def _get_features_for_role(role: str) -> List[Dict[str, Any]]:
    """Filter features available for a given user role."""
    role_upper = (role or "STUDENT").upper().strip()
    return [
        f for f in CAREER_SETU_FEATURES
        if any(r in role_upper for r in f["roles"]) or any(role_upper in r for r in f["roles"])
    ]


def _build_deterministic_context(query: str, user_role: str) -> str:
    """Inject deterministic ground truth for Career Twin and Skill Passport queries."""
    lower = query.lower()
    injections = []

    if any(k in lower for k in ["digital twin", "twin", "cri", "readiness score", "career readiness", "career dna", "trajectory"]):
        injections.append(
            "DETERMINISTIC GROUND TRUTH (CAREER DIGITAL TWIN):\n"
            f"- Career Readiness Index (CRI): {DETERMINISTIC_TWIN_DATA['career_readiness_index']}/100 (Grade: {DETERMINISTIC_TWIN_DATA['cri_grade']}, {DETERMINISTIC_TWIN_DATA['percentile']}th percentile)\n"
            f"- Growth Velocity: +{DETERMINISTIC_TWIN_DATA['growth_velocity']} skills/month ({DETERMINISTIC_TWIN_DATA['growth_trend']})\n"
            f"- Top Skills: {', '.join(DETERMINISTIC_TWIN_DATA['top_skills'])}\n"
            f"- Critical Gap: {DETERMINISTIC_TWIN_DATA['critical_gap']}\n"
            f"- Target Trajectory: {DETERMINISTIC_TWIN_DATA['target_role']} ({DETERMINISTIC_TWIN_DATA['trajectory']})\n"
            "Instruct the user to inspect their live simulation at [NAV:/student/digital-twin|Open Career Digital Twin]."
        )

    if any(k in lower for k in ["passport", "badge", "credential", "verified skill", "skill passport", "blockchain"]):
        badge_list = ", ".join(f"{b['name']} ({b['score']}/100)" for b in DETERMINISTIC_PASSPORT_DATA["badges"])
        injections.append(
            "DETERMINISTIC GROUND TRUTH (SKILL PASSPORT):\n"
            f"- Verified Credentials: {DETERMINISTIC_PASSPORT_DATA['verified_credentials_count']} verified proctored badges\n"
            f"- Badges: {badge_list}\n"
            f"- Security & Authenticity: {DETERMINISTIC_PASSPORT_DATA['verification_notice']}\n"
            "Instruct the user to inspect and share their passport at [NAV:/student/passport|Open Career Passport]."
        )

    return "\n\n".join(injections)


def _build_system_prompt(user_role: str, current_route: Optional[str], current_page: Optional[str], query: str) -> str:
    """Build the system instruction with verified Career Setu context."""
    available_features = _get_features_for_role(user_role)
    features_text = "\n".join(
        f"- **{f['name']}** ({f['route']}): {f['description']}"
        for f in available_features
    )

    page_context = ""
    if current_route and current_route in PAGE_CONTEXT_MAP:
        page_context = f"\n\nCURRENT PAGE CONTEXT:\n{PAGE_CONTEXT_MAP[current_route]}"
    elif current_page:
        page_context = f"\n\nCURRENT PAGE: {current_page}"

    deterministic_truth = _build_deterministic_context(query, user_role)
    deterministic_section = f"\n\n{deterministic_truth}" if deterministic_truth else ""

    return f"""You are Career Setu AI, the intelligent assistant built into Career Setu — India's AI-powered Academia–Industry collaboration platform for SIH 2026.

Your role is to:
1. Answer questions about Career Setu features and capabilities
2. Explain what each feature does and how to use it
3. Guide users to the correct page/feature with navigation actions
4. Provide contextual help based on the current page
5. Help users understand their career journey on Career Setu

USER ROLE: {user_role}

AVAILABLE FEATURES FOR THIS USER:
{features_text}
{page_context}
{deterministic_section}

STRICT ROLE & ROUTE RULES:
- Only recommend routes from the AVAILABLE FEATURES list above.
- NEVER suggest administrative or employer routes to students.
- NEVER fabricate non-existent routes. Any route not in AVAILABLE FEATURES will be rejected.
- You are an advisory copilot. If a user asks you to directly execute irreversible actions (like submitting applications, accepting offers, or taking exams for them), explain that you provide guidance and navigation rather than executing transactions directly.
- When deterministic ground truth is provided above (e.g. CRI score 82/100, 4 verified badges), use those EXACT figures.

NAVIGATION FORMAT:
When you want to suggest navigation to a page, include the route in this exact format:
[NAV:/route/path|Button Label]
Example: [NAV:/student/opportunities|Browse Opportunities]

End your response with 2-3 follow-up question suggestions in this format:
[SUGGEST:Question text here]
"""


def _extract_navigation_blocks(text: str, user_role: str = "STUDENT") -> Tuple[str, List[AssistantResponseBlock]]:
    """
    Extract [NAV:...] patterns from text.
    Validates route existence and role permissions.
    Invalid or unauthorized routes are automatically dropped.
    """
    nav_blocks: List[AssistantResponseBlock] = []
    nav_pattern = r'\[NAV:([^|\]]+)(?:\|([^\]]+))?\]'

    for match in re.finditer(nav_pattern, text):
        raw_route = match.group(1).strip()
        label = (match.group(2) or "").strip()

        is_authorized, feature = _is_route_authorized(raw_route, user_role)
        if is_authorized and feature:
            canon_route = feature["route"]
            final_label = label if label else feature["name"]

            # Deduplicate by route
            if not any(b.route == canon_route for b in nav_blocks):
                nav_blocks.append(AssistantResponseBlock(
                    type="NAVIGATE",
                    route=canon_route,
                    label=final_label
                ))

    # Strip all [NAV:...] syntax from clean display text
    clean_text = re.sub(r'\[NAV:[^\]]+\]', '', text).strip()
    return clean_text, nav_blocks


def _extract_suggested_prompts(text: str) -> Tuple[str, List[str]]:
    """Extract [SUGGEST:...] patterns from text."""
    prompts: List[str] = []
    suggest_pattern = r'\[SUGGEST:([^\]]+)\]'

    for match in re.finditer(suggest_pattern, text):
        prompts.append(match.group(1).strip())

    clean_text = re.sub(suggest_pattern, '', text).strip()
    return clean_text, prompts


def _parse_response_to_blocks(raw_text: str, user_role: str = "STUDENT") -> Tuple[List[AssistantResponseBlock], List[str]]:
    """Parse raw LLM response into structured, strictly validated blocks."""
    # Extract & validate navigation actions against role allowlist
    text_after_nav, nav_blocks = _extract_navigation_blocks(raw_text, user_role=user_role)

    # Extract suggested prompts
    text_after_suggest, suggested_prompts = _extract_suggested_prompts(text_after_nav)

    blocks: List[AssistantResponseBlock] = []

    clean_text = text_after_suggest.strip()
    if clean_text:
        clean_text = re.sub(r'\n\s*\n\s*\n', '\n\n', clean_text)
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=clean_text
        ))

    # Add validated navigation blocks
    blocks.extend(nav_blocks)

    return blocks, suggested_prompts


# ── Fallback response engine ─────────────────────────────────

def _generate_fallback_response(query: str, user_role: str, current_route: Optional[str]) -> AssistantResponse:
    """Generate an intelligent deterministic local response when LLM is offline or not configured."""
    lower = query.lower()
    blocks: List[AssistantResponseBlock] = []
    prompts: List[str] = []
    role_upper = (user_role or "STUDENT").upper().strip()
    available = _get_features_for_role(role_upper)

    # 1. Direct action execution check ("apply to this job for me")
    if DIRECT_ACTION_PATTERN.search(lower):
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=(
                "I am your Career Setu AI guide. For security, compliance, and academic integrity, "
                "I cannot submit applications or take tests directly on your behalf.\n\n"
                "However, I can navigate you directly to the **Opportunity Marketplace** where you can "
                "review your AI match score and submit your verified Career Passport in one click!"
            )
        ))
        if "STUDENT" in role_upper or "ALUMNI" in role_upper:
            blocks.append(AssistantResponseBlock(
                type="NAVIGATE",
                route="/student/opportunities",
                label="Browse Opportunities"
            ))
        prompts = ["How do I improve my match score?", "Track my applications", "View my Career Passport"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 2. Context-aware "what is this / explain this page" query
    if current_route and any(kw in lower for kw in ["what is this", "what's this", "explain this", "how do i use this", "what does this score mean", "help me"]):
        feat = next((f for f in CAREER_SETU_FEATURES if f["route"] == current_route), None)
        if feat:
            if current_route == "/student/digital-twin":
                blocks.append(AssistantResponseBlock(
                    type="TEXT",
                    content=(
                        f"You're on the **Career Digital Twin** page.\n\n"
                        f"Your **Career Readiness Index (CRI)** is currently **{DETERMINISTIC_TWIN_DATA['career_readiness_index']}/100** (Grade: {DETERMINISTIC_TWIN_DATA['cri_grade']}, {DETERMINISTIC_TWIN_DATA['percentile']}th percentile).\n\n"
                        f"This composite score synthesizes 5 key dimensions: Technical Skills, Academic Foundation, Project Experience, Market Alignment, and Soft Skills. "
                        f"Your current growth rate is **+{DETERMINISTIC_TWIN_DATA['growth_velocity']} skills/month**, placing your trajectory on track for a Full Stack Developer role."
                    )
                ))
            else:
                blocks.append(AssistantResponseBlock(
                    type="TEXT",
                    content=f"You're on the **{feat['name']}** page.\n\n{feat['description']}\n\nI can help you understand any specific section or next steps on this page — just ask!"
                ))
            prompts = [
                f"How do I get the most out of {feat['name']}?",
                "What should I do next?",
                "Show me other features"
            ]
            return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 3. Role-based unauthorized requests (e.g. Student asking for Employer candidate list or posting jobs)
    if ("STUDENT" in role_upper or "ALUMNI" in role_upper) and any(kw in lower for kw in ["post a job", "post job", "candidate search", "view applicants", "review applicants"]):
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=(
                "Job posting and applicant management are restricted to verified employer accounts. "
                "As a student, you can explore openings and submit your verified credentials through the **Opportunity Marketplace**."
            )
        ))
        blocks.append(AssistantResponseBlock(
            type="NAVIGATE",
            route="/student/opportunities",
            label="Browse Opportunities"
        ))
        prompts = ["How do I verify my skills?", "Show my Career Digital Twin", "View my applications"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 4. Employer specific queries
    if any(r in role_upper for r in ["EMPLOYER", "RECRUITER"]):
        if any(kw in lower for kw in ["candidate", "talent", "student", "search", "who can i hire"]):
            blocks.append(AssistantResponseBlock(
                type="TEXT",
                content=(
                    "You can search and filter verified students across institutions in the **Candidate Search** directory.\n\n"
                    "Filter candidates by verified skills, Career Readiness Index (CRI), and graduation year."
                )
            ))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/employer/candidates", label="Candidate Search"))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/employer/applicants", label="View Applicants"))
        elif any(kw in lower for kw in ["create", "post", "new job", "hiring"]):
            blocks.append(AssistantResponseBlock(
                type="TEXT",
                content="To create a new job or internship posting:\n\n1. Go to **Job Management**\n2. Click 'Create New Opportunity'\n3. Specify required skills and eligibility criteria\n4. Publish — AI will automatically match verified candidates"
            ))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/employer/jobs", label="Manage Jobs"))
        else:
            blocks.append(AssistantResponseBlock(
                type="TEXT",
                content="As an employer on Career Setu, you have access to verified candidate pipelines, AI candidate matching, and automated ATS screening."
            ))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/employer/overview", label="Employer Dashboard"))
        prompts = ["How do I post a job?", "Search candidates", "View applicant analytics"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 5. Institution / TPO specific queries
    if any(r in role_upper for r in ["TPO", "INSTITUTION_ADMIN", "DEPARTMENT_ADMIN"]):
        if any(kw in lower for kw in ["nirf", "analytics", "ranking", "accreditation", "report", "stats"]):
            blocks.append(AssistantResponseBlock(
                type="TEXT",
                content=(
                    "In **Institution Analytics & NIRF**, you can monitor placement percentage, average salary packages, "
                    "department-wise skill alignment, and NIRF accreditation readiness metrics in real-time."
                )
            ))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/institution/analytics", label="Institution Analytics & NIRF"))
        elif any(kw in lower for kw in ["drive", "placement drive", "company"]):
            blocks.append(AssistantResponseBlock(
                type="TEXT",
                content="Manage campus recruitment and invite employers to campus via **Placement Drives**."
            ))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/institution/drives", label="Placement Drives"))
        else:
            blocks.append(AssistantResponseBlock(
                type="TEXT",
                content="As a placement officer, you can monitor batch career readiness, organize placement drives, and generate NIRF accreditation reports."
            ))
            blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/institution/overview", label="Institution Dashboard"))
        prompts = ["View student roster", "Create a placement drive", "View NIRF metrics"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 6. Career Digital Twin queries
    if any(kw in lower for kw in ["digital twin", "twin", "cri", "readiness score", "career readiness", "career dna"]):
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=(
                f"Your **Career Digital Twin** is your evolving AI career readiness simulation:\n\n"
                f"• **Career Readiness Index**: {DETERMINISTIC_TWIN_DATA['career_readiness_index']}/100 (Grade {DETERMINISTIC_TWIN_DATA['cri_grade']}, {DETERMINISTIC_TWIN_DATA['percentile']}th percentile)\n"
                f"• **Growth Velocity**: +{DETERMINISTIC_TWIN_DATA['growth_velocity']} skills/month ({DETERMINISTIC_TWIN_DATA['growth_trend']})\n"
                f"• **Top Skills**: {', '.join(DETERMINISTIC_TWIN_DATA['top_skills'])}\n"
                f"• **Identified Gap**: {DETERMINISTIC_TWIN_DATA['critical_gap']}\n"
                f"• **Predicted Trajectory**: {DETERMINISTIC_TWIN_DATA['trajectory']}"
            )
        ))
        blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/student/digital-twin", label="Open Career Digital Twin"))
        prompts = ["How do I improve my CRI score?", "Take a skill assessment", "Browse matched opportunities"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 7. Career Passport / Badges queries
    if any(kw in lower for kw in ["passport", "badge", "credential", "verified"]):
        badges_formatted = "\n".join(f"• **{b['name']}** — Score {b['score']}/100 ({b['level']})" for b in DETERMINISTIC_PASSPORT_DATA["badges"])
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=(
                f"Your **Career Passport** contains your cryptographic, verified credentials:\n\n"
                f"• **Verified Credentials**: {DETERMINISTIC_PASSPORT_DATA['verified_credentials_count']} proctored badges\n"
                f"{badges_formatted}\n\n"
                f"**Security**: {DETERMINISTIC_PASSPORT_DATA['verification_notice']}."
            )
        ))
        blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/student/passport", label="Open Career Passport"))
        prompts = ["Take a skill assessment", "View my Career Digital Twin", "Find internships"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 8. Opportunities / Internships / Jobs
    if any(kw in lower for kw in ["opportunity", "internship", "job", "apply", "find work", "placement"]):
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=(
                "You can find internships and job opportunities in the **Opportunity Marketplace**.\n\n"
                "• Browse verified listings with real-time AI skill match percentages\n"
                "• Apply instantly using your verified Career Passport\n"
                "• See transparent match score breakdowns and skill gaps"
            )
        ))
        blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/student/opportunities", label="Browse Opportunities"))
        prompts = ["How do I improve my match score?", "Track my applications", "Check my skill gaps"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 9. Skill Assessment
    if any(kw in lower for kw in ["assessment", "test", "quiz", "evaluate"]):
        blocks.append(AssistantResponseBlock(
            type="TEXT",
            content=(
                "**Skill Assessments** let you prove your competencies through proctored evaluations.\n\n"
                "Passing assessments mints verified badges directly to your Career Passport, boosting your AI match scores."
            )
        ))
        blocks.append(AssistantResponseBlock(type="NAVIGATE", route="/student/assessment", label="Take Skill Assessment"))
        prompts = ["Which skills should I assess first?", "Open Career Passport", "View skill gaps"]
        return AssistantResponse(blocks=blocks, suggested_prompts=prompts)

    # 10. General Career Setu overview
    blocks.append(AssistantResponseBlock(
        type="TEXT",
        content=(
            "**Career Setu** is India's premier AI-powered Academia–Industry collaboration platform for SIH 2026.\n\n"
            "Here are the key features available for your role:"
        )
    ))
    for feat in available[:5]:
        blocks.append(AssistantResponseBlock(
            type="NAVIGATE",
            route=feat["route"],
            label=feat["name"]
        ))
    prompts = ["What is Career Digital Twin?", "How do I find internships?", "How do I build my Career Passport?"]

    return AssistantResponse(blocks=blocks, suggested_prompts=prompts)


async def handle_assistant_chat(request: AssistantRequest) -> AssistantResponse:
    """Handle AI assistant chat — returns structured response blocks with strict route and role validation."""
    user_role = (request.user_role or "STUDENT").upper().strip()

    last_user_message = next(
        (m.content for m in reversed(request.messages) if m.role == "user"), ""
    )

    if not last_user_message.strip():
        return AssistantResponse(
            blocks=[AssistantResponseBlock(
                type="TEXT",
                content="Hi! I'm your Career Setu AI guide. How can I help you navigate your career journey today?"
            )],
            suggested_prompts=["What can I do on Career Setu?", "How do I find internships?", "Explain Career Digital Twin"]
        )

    # 1. Prompt Injection Security Check
    is_safe, reason = check_prompt_injection(last_user_message)
    if not is_safe:
        return AssistantResponse(
            blocks=[AssistantResponseBlock(
                type="WARNING",
                content=f"I cannot process this request: {reason}. Please ask me about Career Setu features, skills, or career guidance."
            )],
            suggested_prompts=["What can I do on Career Setu?", "How do I find internships?", "Take a skill assessment"]
        )

    # 2. PII Masking
    sanitized_message = mask_pii(last_user_message)

    # 3. Direct Action Deterrence (Safe Guidance Mode)
    if DIRECT_ACTION_PATTERN.search(last_user_message):
        return _generate_fallback_response(
            query=last_user_message,
            user_role=user_role,
            current_route=request.current_route
        )

    # 4. LLM Generation with strict fallback
    try:
        provider = get_llm_provider()
        system_prompt = _build_system_prompt(
            user_role=user_role,
            current_route=request.current_route,
            current_page=request.current_page_name,
            query=last_user_message
        )

        conversation = ""
        for msg in request.messages[-6:]:
            role_label = "User" if msg.role == "user" else "Assistant"
            sanitized_content = mask_pii(msg.content)
            conversation += f"{role_label}: {sanitized_content}\n\n"

        full_prompt = f"{conversation}User: {sanitized_message}"

        raw_response = await provider.generate_response(
            prompt=full_prompt,
            system_instruction=system_prompt
        )

        # Parse and strictly validate navigation blocks
        blocks, suggested_prompts = _parse_response_to_blocks(raw_response, user_role=user_role)

        if not blocks:
            return _generate_fallback_response(
                query=last_user_message,
                user_role=user_role,
                current_route=request.current_route
            )

        if not suggested_prompts:
            suggested_prompts = ["What should I do next?", "Browse opportunities", "Check my Career Digital Twin"]

        return AssistantResponse(blocks=blocks, suggested_prompts=suggested_prompts)

    except Exception:
        # Fall back gracefully to deterministic local response
        return _generate_fallback_response(
            query=last_user_message,
            user_role=user_role,
            current_route=request.current_route
        )
