"""
Career Digital Twin — CRI Computation Engine
Computes the Career Readiness Index (CRI) and generates the full Digital Twin profile.
"""

from typing import List, Dict, Set
from app.models import (
    DigitalTwinRequest, DigitalTwinResponse,
    CRIDimension, CareerDNACluster, TrajectoryPrediction,
    SkillPassportEntry, ActionItem, PeerBenchmark
)

# ── Industry demand benchmarks by role ────────────────────────
ROLE_SKILL_MAP: Dict[str, Dict[str, str]] = {
    "full stack developer": {
        "react": "HIGH", "typescript": "HIGH", "node.js": "HIGH", "python": "HIGH",
        "postgresql": "HIGH", "docker": "HIGH", "git": "HIGH", "rest api": "HIGH",
        "aws": "MEDIUM", "redis": "MEDIUM", "graphql": "EMERGING", "kubernetes": "EMERGING"
    },
    "backend developer": {
        "java": "HIGH", "spring boot": "HIGH", "postgresql": "HIGH", "docker": "HIGH",
        "rest api": "HIGH", "git": "HIGH", "redis": "MEDIUM", "kafka": "EMERGING",
        "kubernetes": "EMERGING", "python": "MEDIUM", "microservices": "HIGH"
    },
    "frontend developer": {
        "react": "HIGH", "typescript": "HIGH", "javascript": "HIGH", "html5": "HIGH",
        "css3": "HIGH", "tailwind css": "MEDIUM", "git": "HIGH", "next.js": "EMERGING",
        "figma": "MEDIUM", "testing": "MEDIUM"
    },
    "data engineer": {
        "python": "HIGH", "sql": "HIGH", "apache spark": "HIGH", "kafka": "HIGH",
        "postgresql": "HIGH", "docker": "HIGH", "aws": "HIGH", "airflow": "EMERGING",
        "dbt": "EMERGING", "snowflake": "MEDIUM"
    },
    "ml engineer": {
        "python": "HIGH", "tensorflow": "HIGH", "pytorch": "HIGH", "sql": "HIGH",
        "docker": "HIGH", "mlops": "EMERGING", "aws": "MEDIUM", "git": "HIGH",
        "numpy": "MEDIUM", "pandas": "MEDIUM"
    },
    "devops engineer": {
        "docker": "HIGH", "kubernetes": "HIGH", "aws": "HIGH", "terraform": "HIGH",
        "linux": "HIGH", "git": "HIGH", "python": "MEDIUM", "ci/cd": "HIGH",
        "prometheus": "MEDIUM", "grafana": "MEDIUM"
    }
}

# ── Skill cluster definitions ────────────────────────────────
SKILL_CLUSTERS: Dict[str, Dict] = {
    "Backend Systems": {
        "skills": {"java", "spring boot", "node.js", "django", "flask", "rest api", "graphql", "microservices"},
        "color": "#4F46E5"
    },
    "Frontend & UI": {
        "skills": {"react", "vue", "angular", "typescript", "javascript", "html5", "css3", "tailwind css", "next.js"},
        "color": "#0EA5E9"
    },
    "Data & AI/ML": {
        "skills": {"python", "sql", "tensorflow", "pytorch", "numpy", "pandas", "apache spark", "r", "jupyter"},
        "color": "#8B5CF6"
    },
    "Cloud & DevOps": {
        "skills": {"docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ci/cd", "linux", "nginx"},
        "color": "#F59E0B"
    },
    "Databases": {
        "skills": {"postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "sqlite"},
        "color": "#10B981"
    },
    "Tools & Practices": {
        "skills": {"git", "github", "testing", "agile", "jira", "figma", "postman", "vscode"},
        "color": "#EC4899"
    }
}


def _compute_skills_score(request: DigitalTwinRequest) -> tuple[int, str]:
    """Skills dimension: verified vs self-declared, coverage, depth (30% weight)."""
    if not request.skills:
        return 20, "No skills declared yet. Start adding skills to build your profile."

    total = len(request.skills)
    verified = sum(1 for s in request.skills if s.verified)
    assessed = sum(1 for s in request.skills if s.source == "ASSESSED")
    avg_level = sum(s.level for s in request.skills) / total if total > 0 else 0

    # Coverage bonus: more skills = better (diminishing returns)
    coverage_score = min(100, total * 8)
    # Depth bonus: average proficiency
    depth_score = avg_level
    # Verification bonus: verified skills weighted higher
    verification_ratio = (verified / total) * 100 if total > 0 else 0
    # Badge bonus
    badge_bonus = min(30, len(request.badges) * 10)

    raw = (coverage_score * 0.25) + (depth_score * 0.35) + (verification_ratio * 0.25) + (badge_bonus * 0.15)
    score = min(100, max(0, int(raw)))

    details = f"{total} skills ({verified} verified, {assessed} assessed). Avg proficiency: {int(avg_level)}%."
    return score, details


def _compute_academic_score(request: DigitalTwinRequest) -> tuple[int, str]:
    """Academic dimension: CGPA, year progression (20% weight)."""
    cgpa = request.cgpa or 0
    cgpa_score = min(100, int((cgpa / 10.0) * 100)) if cgpa > 0 else 40

    # Year progression bonus
    year_bonus = min(25, request.current_year * 6)

    raw = (cgpa_score * 0.7) + (year_bonus * 0.3) + 10
    score = min(100, max(0, int(raw)))

    details = f"CGPA: {cgpa:.2f}/10. Year {request.current_year}, graduating {request.graduation_year}."
    return score, details


def _compute_experience_score(request: DigitalTwinRequest) -> tuple[int, str]:
    """Experience dimension: projects, internships, badges (20% weight)."""
    project_score = min(40, request.projects_count * 10)
    internship_score = min(40, request.internships_count * 20)
    badge_score = min(30, len(request.badges) * 10)

    raw = project_score + internship_score + badge_score
    score = min(100, max(0, int(raw)))

    details = f"{request.projects_count} projects, {request.internships_count} internships, {len(request.badges)} badges."
    return score, details


def _compute_network_score(request: DigitalTwinRequest) -> tuple[int, str]:
    """Network dimension: mentors, events, industry connections (15% weight)."""
    mentor_score = min(40, request.mentors_connected * 15)
    event_score = min(40, request.events_attended * 10)
    base = 20  # Base social score

    raw = base + mentor_score + event_score
    score = min(100, max(0, int(raw)))

    details = f"{request.mentors_connected} mentors, {request.events_attended} events attended."
    return score, details


def _compute_market_alignment(request: DigitalTwinRequest) -> tuple[int, str]:
    """Market alignment: how well skills match current industry demand (15% weight)."""
    target = (request.target_role or "full stack developer").lower().strip()

    # Find matching role benchmark
    benchmark = None
    for role_key, skills_map in ROLE_SKILL_MAP.items():
        if role_key in target or target in role_key:
            benchmark = skills_map
            break

    if not benchmark:
        benchmark = ROLE_SKILL_MAP.get("full stack developer", {})

    student_skills_lower = {s.name.lower().strip() for s in request.skills}
    required = set(benchmark.keys())
    high_demand = {k for k, v in benchmark.items() if v == "HIGH"}

    matched = student_skills_lower & required
    matched_high = student_skills_lower & high_demand

    if len(required) > 0:
        overall_match = int((len(matched) / len(required)) * 100)
    else:
        overall_match = 50

    if len(high_demand) > 0:
        high_match = int((len(matched_high) / len(high_demand)) * 100)
    else:
        high_match = 50

    score = min(100, max(0, int(overall_match * 0.4 + high_match * 0.6)))
    details = f"{len(matched)}/{len(required)} role skills matched. {len(matched_high)}/{len(high_demand)} high-demand skills covered."
    return score, details


def _build_career_dna(request: DigitalTwinRequest) -> List[CareerDNACluster]:
    """Build career DNA clusters from student skills."""
    student_skills_lower = {s.name.lower().strip() for s in request.skills}
    clusters = []

    for cluster_name, config in SKILL_CLUSTERS.items():
        matching = student_skills_lower & config["skills"]
        if matching:
            # Strength = weighted by number of matching skills and their levels
            matching_entries = [s for s in request.skills if s.name.lower().strip() in matching]
            avg_level = sum(s.level for s in matching_entries) / len(matching_entries) if matching_entries else 0
            coverage = (len(matching) / len(config["skills"])) * 100

            strength = min(100, int(avg_level * 0.6 + coverage * 0.4))

            clusters.append(CareerDNACluster(
                cluster_name=cluster_name,
                skills=[s.name for s in matching_entries],
                strength=strength,
                color=config["color"]
            ))

    # Sort by strength descending
    clusters.sort(key=lambda c: c.strength, reverse=True)
    return clusters[:6]  # Top 6 clusters


def _build_trajectories(request: DigitalTwinRequest, market_score: int) -> List[TrajectoryPrediction]:
    """Predict 3 likely career trajectories."""
    student_skills_lower = {s.name.lower().strip() for s in request.skills}
    trajectories = []

    role_scores = {}
    for role_key, skills_map in ROLE_SKILL_MAP.items():
        required = set(skills_map.keys())
        matched = student_skills_lower & required
        match_pct = int((len(matched) / len(required)) * 100) if required else 0
        role_scores[role_key] = match_pct

    # Sort by match score
    sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)

    # Assign probabilities (top gets highest)
    probs = [55, 30, 15]
    timelines = ["3-6 months", "6-12 months", "12-18 months"]

    for i, (role, readiness) in enumerate(sorted_roles[:3]):
        required_skills = list(ROLE_SKILL_MAP[role].keys())
        missing = [s.title() for s in required_skills if s not in student_skills_lower]

        trajectories.append(TrajectoryPrediction(
            role=role.title(),
            probability=probs[i],
            timeline=timelines[i],
            required_skills=missing[:5],  # Top 5 missing skills
            current_readiness=readiness
        ))

    return trajectories


def _build_skill_passport(request: DigitalTwinRequest) -> List[SkillPassportEntry]:
    """Build skill passport entries with market demand and gap analysis."""
    target = (request.target_role or "full stack developer").lower().strip()

    benchmark = None
    for role_key, skills_map in ROLE_SKILL_MAP.items():
        if role_key in target or target in role_key:
            benchmark = skills_map
            break
    if not benchmark:
        benchmark = ROLE_SKILL_MAP.get("full stack developer", {})

    entries = []
    for skill in request.skills:
        skill_lower = skill.name.lower().strip()
        market_demand = benchmark.get(skill_lower, "MEDIUM")

        # Gap delta: how far above/below the "needed" threshold (60)
        threshold = 70 if market_demand == "HIGH" else 50
        gap_delta = skill.level - threshold

        label = "EXPERT" if skill.level >= 85 else "ADVANCED" if skill.level >= 65 else "INTERMEDIATE" if skill.level >= 40 else "BEGINNER"

        entries.append(SkillPassportEntry(
            skill_name=skill.name,
            level=skill.level,
            label=label,
            verified=skill.verified,
            source=skill.source,
            market_demand=market_demand,
            gap_delta=gap_delta
        ))

    # Sort: verified first, then by level descending
    entries.sort(key=lambda e: (e.verified, e.level), reverse=True)
    return entries


def _build_action_items(request: DigitalTwinRequest, dimensions: List[CRIDimension], trajectories: List[TrajectoryPrediction]) -> List[ActionItem]:
    """Generate personalized AI action items."""
    items: List[ActionItem] = []

    # Find weakest dimension
    weakest = min(dimensions, key=lambda d: d.score)

    if weakest.name == "Skills":
        items.append(ActionItem(
            title="Complete a Skill Assessment",
            category="SKILL",
            estimated_hours=2,
            impact_score=9,
            link_to="/student/assessment",
            description="Take a proctored code assessment to earn verified badges and boost your skill score significantly."
        ))
    elif weakest.name == "Experience":
        items.append(ActionItem(
            title="Build a Portfolio Project",
            category="PROJECT",
            estimated_hours=20,
            impact_score=8,
            link_to="/student/learning",
            description="Create a hands-on project to demonstrate practical skills. Focus on your target role's tech stack."
        ))
    elif weakest.name == "Network":
        items.append(ActionItem(
            title="Connect with Industry Mentors",
            category="NETWORKING",
            estimated_hours=1,
            impact_score=7,
            link_to="/student/mentors",
            description="Schedule sessions with mentors to gain industry insights and expand your professional network."
        ))

    # Top trajectory missing skills
    if trajectories:
        top_traj = trajectories[0]
        if top_traj.required_skills:
            skill_name = top_traj.required_skills[0]
            items.append(ActionItem(
                title=f"Learn {skill_name} for {top_traj.role}",
                category="LEARNING",
                estimated_hours=15,
                impact_score=8,
                link_to="/student/learning",
                description=f"This is a critical skill for your most likely career path: {top_traj.role}. Start with official documentation."
            ))

    # Unverified skills
    unverified = [s for s in request.skills if not s.verified and s.level >= 50]
    if unverified:
        items.append(ActionItem(
            title=f"Verify Your {unverified[0].name} Skills",
            category="SKILL",
            estimated_hours=2,
            impact_score=7,
            link_to="/student/assessment",
            description=f"You've declared {unverified[0].name} at {unverified[0].level}% but it's unverified. Take an assessment to earn a badge."
        ))

    # Events
    if request.events_attended < 2:
        items.append(ActionItem(
            title="Attend a Hackathon or Tech Event",
            category="NETWORKING",
            estimated_hours=8,
            impact_score=6,
            link_to="/student/events",
            description="Hackathons and tech events build rapid skills, create portfolio pieces, and expand your network."
        ))

    # Apply for opportunity
    items.append(ActionItem(
        title="Apply for Matching Opportunities",
        category="PROJECT",
        estimated_hours=3,
        impact_score=9,
        link_to="/student/opportunities",
        description="Browse opportunities matched to your profile and apply using your Career Passport."
    ))

    # Sort by impact
    items.sort(key=lambda i: i.impact_score, reverse=True)
    return items[:6]


def _build_peer_benchmarks(dimensions: List[CRIDimension]) -> List[PeerBenchmark]:
    """Generate peer benchmarks (simulated cohort data for demo)."""
    # Simulated peer averages for Indian engineering students
    peer_avgs = {
        "Skills": 52,
        "Academics": 68,
        "Experience": 35,
        "Network": 28,
        "Market Alignment": 42
    }

    benchmarks = []
    for dim in dimensions:
        peer_avg = peer_avgs.get(dim.name, 45)
        # Percentile estimation
        diff = dim.score - peer_avg
        percentile = min(99, max(1, 50 + int(diff * 1.2)))

        benchmarks.append(PeerBenchmark(
            dimension=dim.name,
            your_score=dim.score,
            peer_avg=peer_avg,
            percentile=percentile
        ))

    return benchmarks


def _compute_cri_grade(cri: int) -> str:
    """Map CRI score to grade."""
    if cri >= 90: return "A+"
    if cri >= 80: return "A"
    if cri >= 70: return "B+"
    if cri >= 60: return "B"
    if cri >= 50: return "C+"
    return "C"


def _compute_growth_velocity(request: DigitalTwinRequest) -> tuple[float, str]:
    """Estimate skill acquisition velocity."""
    verified_count = sum(1 for s in request.skills if s.verified)
    badge_count = len(request.badges)
    years_active = max(1, request.current_year)

    velocity = round((verified_count + badge_count * 1.5) / (years_active * 12), 1)

    if velocity >= 1.5:
        trend = "ACCELERATING"
    elif velocity >= 0.5:
        trend = "STEADY"
    else:
        trend = "NEEDS_PUSH"

    return velocity, trend


def compute_digital_twin(request: DigitalTwinRequest) -> DigitalTwinResponse:
    """Main Digital Twin computation engine."""

    # 1. Compute 5 CRI dimensions
    skills_score, skills_detail = _compute_skills_score(request)
    academic_score, academic_detail = _compute_academic_score(request)
    experience_score, experience_detail = _compute_experience_score(request)
    network_score, network_detail = _compute_network_score(request)
    market_score, market_detail = _compute_market_alignment(request)

    dimensions = [
        CRIDimension(name="Skills", score=skills_score, weight=0.30, details=skills_detail),
        CRIDimension(name="Academics", score=academic_score, weight=0.20, details=academic_detail),
        CRIDimension(name="Experience", score=experience_score, weight=0.20, details=experience_detail),
        CRIDimension(name="Network", score=network_score, weight=0.15, details=network_detail),
        CRIDimension(name="Market Alignment", score=market_score, weight=0.15, details=market_detail),
    ]

    # 2. Weighted CRI
    cri = int(sum(d.score * d.weight for d in dimensions))
    cri = min(100, max(0, cri))
    grade = _compute_cri_grade(cri)

    # 3. Growth velocity
    velocity, trend = _compute_growth_velocity(request)

    # 4. Career DNA
    career_dna = _build_career_dna(request)

    # 5. Trajectory predictions
    trajectories = _build_trajectories(request, market_score)

    # 6. Skill passport
    skill_passport = _build_skill_passport(request)

    # 7. Action items
    action_items = _build_action_items(request, dimensions, trajectories)

    # 8. Peer benchmarks
    peer_benchmarks = _build_peer_benchmarks(dimensions)

    # 9. Summary narrative
    top_cluster = career_dna[0].cluster_name if career_dna else "Technology"
    top_trajectory = trajectories[0].role if trajectories else request.target_role
    twin_summary = (
        f"Your Career Readiness Index is {cri}/100 (Grade: {grade}). "
        f"You show strongest affinity in {top_cluster} with a growth velocity of "
        f"{velocity} skills/month ({trend.replace('_', ' ').lower()}). "
        f"Your most probable career trajectory is {top_trajectory} "
        f"({trajectories[0].probability}% probability). "
        f"Focus on the top action items to accelerate your career readiness."
    )

    return DigitalTwinResponse(
        career_readiness_index=cri,
        cri_grade=grade,
        growth_velocity=velocity,
        growth_trend=trend,
        dimensions=dimensions,
        career_dna=career_dna,
        trajectories=trajectories,
        skill_passport=skill_passport,
        action_items=action_items,
        peer_benchmarks=peer_benchmarks,
        twin_summary=twin_summary
    )
