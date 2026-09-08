from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# ─── Copilot Models ──────────────────────────────────────────

class CopilotMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str

class StudentContext(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    education_level: Optional[str] = "Undergraduate"
    preferred_location: Optional[str] = None

class CopilotRequest(BaseModel):
    messages: List[CopilotMessage]
    student_context: Optional[StudentContext] = None
    stream: bool = False

class CopilotResponse(BaseModel):
    response: str
    suggested_actions: List[str] = Field(default_factory=list)
    recommended_skills: List[str] = Field(default_factory=list)
    disclaimer: str = "CareerSetu AI provides guidance and recommendations. All career choices and assessment submissions should be verified independently."

# ─── Skill Gap Models ────────────────────────────────────────

class SkillGapRequest(BaseModel):
    student_skills: List[str]
    target_role: str
    required_skills: Optional[List[str]] = None

class SkillRecommendation(BaseModel):
    skill: str
    importance: str  # CRITICAL, HIGH, MEDIUM
    learning_resources: List[str]
    estimated_hours: int

class SkillGapResponse(BaseModel):
    target_role: str
    match_percentage: int
    matching_skills: List[str]
    missing_skills: List[str]
    recommendations: List[SkillRecommendation]
    action_plan_summary: str

# ─── Resume Analyzer Models ──────────────────────────────────

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Engineer Intern"
    target_industry: Optional[str] = "Technology"

class ResumeAnalyzeResponse(BaseModel):
    overall_score: int
    ats_compatibility_score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_keywords: List[str]
    actionable_improvements: List[str]
    summary: str

class ResumeUploadResponse(BaseModel):
    extracted_text: str
    file_name: str
    char_count: int
    analysis: ResumeAnalyzeResponse

# ─── Opportunity Matching Models ─────────────────────────────

class MatchRequest(BaseModel):
    candidate_skills: List[str]
    candidate_experience_months: int = 0
    candidate_cgpa: Optional[float] = None
    opportunity_title: str
    opportunity_required_skills: List[str]
    opportunity_min_cgpa: Optional[float] = None
    opportunity_location: Optional[str] = None
    candidate_location: Optional[str] = None

class MatchResponse(BaseModel):
    match_score: int
    skill_alignment_score: int
    eligibility_met: bool
    reasons_for_match: List[str]
    gaps: List[str]
    hiring_recommendation: str

# ─── Career Digital Twin Models ──────────────────────────────

class SkillEntry(BaseModel):
    name: str
    level: int = 0  # 0-100
    verified: bool = False
    source: str = "SELF_DECLARED"  # ASSESSED, PROJECT_VERIFIED, SELF_DECLARED

class BadgeEntry(BaseModel):
    skill_name: str
    score: int
    level: str  # BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

class DigitalTwinRequest(BaseModel):
    student_name: Optional[str] = None
    target_role: Optional[str] = "Full Stack Developer"
    skills: List[SkillEntry] = Field(default_factory=list)
    badges: List[BadgeEntry] = Field(default_factory=list)
    cgpa: Optional[float] = None
    current_year: int = 1
    graduation_year: int = 2026
    projects_count: int = 0
    internships_count: int = 0
    events_attended: int = 0
    mentors_connected: int = 0

class CRIDimension(BaseModel):
    name: str
    score: int  # 0-100
    weight: float
    details: str

class CareerDNACluster(BaseModel):
    cluster_name: str
    skills: List[str]
    strength: int  # 0-100
    color: str  # hex color for visualization

class TrajectoryPrediction(BaseModel):
    role: str
    probability: int  # 0-100
    timeline: str  # e.g. "6-12 months"
    required_skills: List[str]
    current_readiness: int  # 0-100

class SkillPassportEntry(BaseModel):
    skill_name: str
    level: int  # 0-100
    label: str  # BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    verified: bool
    source: str
    market_demand: str  # HIGH, MEDIUM, LOW, EMERGING
    gap_delta: int  # positive = above market, negative = below

class ActionItem(BaseModel):
    title: str
    category: str  # SKILL, PROJECT, NETWORKING, LEARNING
    estimated_hours: int
    impact_score: int  # 1-10
    link_to: str  # frontend route to navigate to
    description: str

class PeerBenchmark(BaseModel):
    dimension: str
    your_score: int
    peer_avg: int
    percentile: int

class DigitalTwinResponse(BaseModel):
    career_readiness_index: int  # 0-100
    cri_grade: str  # A+, A, B+, B, C+, C
    growth_velocity: float  # skills per month rate
    growth_trend: str  # ACCELERATING, STEADY, NEEDS_PUSH
    dimensions: List[CRIDimension]
    career_dna: List[CareerDNACluster]
    trajectories: List[TrajectoryPrediction]
    skill_passport: List[SkillPassportEntry]
    action_items: List[ActionItem]
    peer_benchmarks: List[PeerBenchmark]
    twin_summary: str  # AI-generated narrative summary

# ─── AI Assistant Models ─────────────────────────────────────

class AssistantMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str

class AssistantRequest(BaseModel):
    messages: List[AssistantMessage]
    user_role: Optional[str] = "STUDENT"
    current_route: Optional[str] = None
    current_page_name: Optional[str] = None

class AssistantResponseBlock(BaseModel):
    type: str  # TEXT, NAVIGATE, STEP_LIST, FEATURE_CARD, TIP, WARNING, SUGGESTED_PROMPTS
    content: Optional[str] = None
    route: Optional[str] = None
    label: Optional[str] = None
    steps: Optional[List[str]] = None
    items: Optional[List[Dict[str, Any]]] = None

class AssistantResponse(BaseModel):
    blocks: List[AssistantResponseBlock]
    suggested_prompts: List[str] = Field(default_factory=list)
