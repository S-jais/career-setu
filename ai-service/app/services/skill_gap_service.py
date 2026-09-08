from typing import List, Dict
from app.models import SkillGapRequest, SkillGapResponse, SkillRecommendation

# Benchmark skill maps for popular roles in India
ROLE_BENCHMARKS: Dict[str, Dict[str, any]] = {
    "backend developer": {
        "skills": ["java", "spring boot", "postgresql", "docker", "rest api", "git", "redis"],
        "critical": ["java", "spring boot", "postgresql"],
        "resources": {
            "docker": ["Docker Official Getting Started", "Containerizing Spring Boot apps"],
            "redis": ["Redis University RU101", "Caching Strategies in Microservices"],
            "postgresql": ["Use The Index, Luke!", "PostgreSQL Query Optimization Guide"]
        }
    },
    "frontend developer": {
        "skills": ["javascript", "typescript", "react", "html5", "css3", "tailwind css", "git"],
        "critical": ["typescript", "react", "javascript"],
        "resources": {
            "typescript": ["TypeScript Handbook", "Total TypeScript Tutorials"],
            "tailwind css": ["Tailwind CSS Documentation & UI components"],
            "react": ["React 19 Documentation", "React Patterns Guide"]
        }
    },
    "full stack developer": {
        "skills": ["react", "typescript", "node.js", "postgresql", "docker", "git", "rest api"],
        "critical": ["react", "typescript", "postgresql"],
        "resources": {
            "docker": ["Docker Fundamentals for Full Stack", "Docker Compose Masterclass"],
            "postgresql": ["Database Design for Web Developers", "Prisma/TypeORM with Postgres"]
        }
    },
    "data engineer": {
        "skills": ["python", "sql", "apache spark", "kafka", "postgresql", "docker", "aws"],
        "critical": ["python", "sql", "apache spark"],
        "resources": {
            "apache spark": ["Spark: The Definitive Guide", "Databricks Community Edition"],
            "kafka": ["Confluent Kafka Tutorials", "Event-Driven Architecture Fundamentals"]
        }
    }
}

def analyze_skill_gap(request: SkillGapRequest) -> SkillGapResponse:
    target_role_lower = request.target_role.lower().strip()
    
    benchmark = None
    for role_key, role_data in ROLE_BENCHMARKS.items():
        if role_key in target_role_lower or target_role_lower in role_key:
            benchmark = role_data
            break
            
    if not benchmark:
        # Default benchmark
        benchmark = {
            "skills": [s.lower().strip() for s in (request.required_skills or ["python", "sql", "git", "docker"])],
            "critical": [s.lower().strip() for s in (request.required_skills or ["python", "sql"])[:2]],
            "resources": {}
        }
    
    student_skills_set = {s.lower().strip() for s in request.student_skills}
    required_skills_set = set(benchmark["skills"])
    critical_set = set(benchmark["critical"])
    
    matching_skills = [s.title() for s in student_skills_set if s in required_skills_set]
    missing_skills = [s.title() for s in required_skills_set if s not in student_skills_set]
    
    if len(required_skills_set) > 0:
        match_percentage = int((len(matching_skills) / len(required_skills_set)) * 100)
    else:
        match_percentage = 75
        
    recommendations: List[SkillRecommendation] = []
    for skill_name in missing_skills:
        s_lower = skill_name.lower()
        importance = "CRITICAL" if s_lower in critical_set else "HIGH"
        resources = benchmark.get("resources", {}).get(s_lower, [
            f"Official {skill_name} Documentation",
            f"Hands-on {skill_name} Projects & Tutorials"
        ])
        est_hours = 25 if importance == "CRITICAL" else 15
        
        recommendations.append(SkillRecommendation(
            skill=skill_name,
            importance=importance,
            learning_resources=resources,
            estimated_hours=est_hours
        ))
        
    summary = (
        f"You match {match_percentage}% of the core requirements for {request.target_role}. "
        f"Prioritizing the {len([r for r in recommendations if r.importance == 'CRITICAL'])} critical "
        f"skill gap(s) will increase your interview shortlist rate significantly."
    )
    
    return SkillGapResponse(
        target_role=request.target_role,
        match_percentage=match_percentage,
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        recommendations=recommendations,
        action_plan_summary=summary
    )
