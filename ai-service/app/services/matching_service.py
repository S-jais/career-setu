from app.models import MatchRequest, MatchResponse

def calculate_opportunity_match(request: MatchRequest) -> MatchResponse:
    cand_skills = {s.lower().strip() for s in request.candidate_skills}
    req_skills = {s.lower().strip() for s in request.opportunity_required_skills}
    
    matching_skills = cand_skills.intersection(req_skills)
    missing_skills = req_skills - cand_skills
    
    if req_skills:
        skill_ratio = len(matching_skills) / len(req_skills)
    else:
        skill_ratio = 1.0
        
    skill_alignment_score = int(skill_ratio * 100)
    
    # Check eligibility (e.g. CGPA requirement)
    eligibility_met = True
    reasons = []
    gaps = []
    
    if request.opportunity_min_cgpa and request.candidate_cgpa:
        if request.candidate_cgpa < request.opportunity_min_cgpa:
            eligibility_met = False
            gaps.append(f"Candidate CGPA ({request.candidate_cgpa}) is below required minimum ({request.opportunity_min_cgpa})")
        else:
            reasons.append(f"Meets academic cutoff ({request.candidate_cgpa} >= {request.opportunity_min_cgpa})")
            
    if matching_skills:
        reasons.append(f"Candidate possesses {len(matching_skills)} of {len(req_skills)} required core skills: {', '.join([s.title() for s in matching_skills])}")
        
    for missing in missing_skills:
        gaps.append(f"Lacks verified proficiency in: {missing.title()}")
        
    # Location match
    if request.opportunity_location and request.candidate_location:
        if request.opportunity_location.lower() == request.candidate_location.lower() or "remote" in request.opportunity_location.lower():
            reasons.append(f"Location preference matches: {request.opportunity_location}")
            
    final_score = int((skill_alignment_score * 0.75) + (25 if eligibility_met else 0))
    final_score = min(final_score, 98)
    
    if final_score >= 80:
        recommendation = "HIGHLY_RECOMMENDED"
    elif final_score >= 60:
        recommendation = "GOOD_FIT"
    else:
        recommendation = "REQUIRES_UPSKILLING"
        
    return MatchResponse(
        match_score=final_score,
        skill_alignment_score=skill_alignment_score,
        eligibility_met=eligibility_met,
        reasons_for_match=reasons,
        gaps=gaps,
        hiring_recommendation=recommendation
    )
