import random

from chatsimulator import simulate_interest
from matcher import match_candidates


job_description = {
    "skills_required": ["Python", "AWS", "Docker", "SQL"],
    "experience": "3",
    "domain": "SaaS",
}


raw_candidates = [
    {
        "name": "Aarav",
        "skills": ["Python", "AWS", "Docker", "SQL", "FastAPI"],
        "experience": 4,
        "domain": "SaaS",
        "status": "Open to Work",
    },
    {
        "name": "Meera",
        "skills": ["Python", "SQL", "Django"],
        "experience": 3,
        "domain": "SaaS",
        "status": "Open to Work",
    },
    {
        "name": "Rohan",
        "skills": ["Python", "AWS", "Docker"],
        "experience": 2,
        "domain": "FinTech",
        "status": "Employed",
    },
    {
        "name": "Nina",
        "skills": ["Java", "Spring", "MySQL"],
        "experience": 5,
        "domain": "SaaS",
        "status": "Employed",
    },
]


matched_candidates = match_candidates(job_description, raw_candidates)
status_by_name = {candidate["name"]: candidate["status"] for candidate in raw_candidates}

random.seed(42)

print("=== Chat Interest Simulation ===")
for candidate in matched_candidates:
    candidate_with_status = {
        **candidate,
        "status": status_by_name.get(candidate["name"], "Unknown"),
    }
    result = simulate_interest(candidate_with_status, job_description)

    print(
        {
            "name": candidate_with_status["name"],
            "status": candidate_with_status["status"],
            "match_score": candidate_with_status["match_score"],
            "matched_skills": candidate_with_status["matched_skills"],
            "interest_score": result["interest_score"],
            "reason": result["reason"],
        }
    )
