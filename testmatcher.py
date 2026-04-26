from matcher import match_candidates


test_cases = [
    {
        "label": "Backend SaaS hiring",
        "jd": {
            "skills_required": ["Python", "AWS", "Docker", "SQL"],
            "experience": "3",
            "domain": "SaaS",
        },
        "candidates": [
            {
                "name": "Aarav",
                "skills": ["Python", "AWS", "Docker", "SQL", "FastAPI"],
                "experience": 4,
                "domain": "SaaS",
            },
            {
                "name": "Meera",
                "skills": ["Python", "SQL", "Django"],
                "experience": 3,
                "domain": "SaaS",
            },
            {
                "name": "Rohan",
                "skills": ["Python", "AWS", "Docker"],
                "experience": 2,
                "domain": "FinTech",
            },
            {
                "name": "Nina",
                "skills": ["Java", "Spring", "MySQL"],
                "experience": 5,
                "domain": "SaaS",
            },
        ],
    },
    {
        "label": "Data analyst hiring",
        "jd": {
            "skills_required": ["SQL", "Excel", "Power BI"],
            "experience": "2",
            "domain": "Analytics",
        },
        "candidates": [
            {
                "name": "Ishaan",
                "skills": ["SQL", "Excel", "Power BI"],
                "experience": 2,
                "domain": "Analytics",
            },
            {
                "name": "Kavya",
                "skills": ["SQL", "Excel", "Tableau"],
                "experience": 1,
                "domain": "Analytics",
            },
            {
                "name": "Dev",
                "skills": ["Excel"],
                "experience": 4,
                "domain": "Retail",
            },
        ],
    },
    {
        "label": "Edge case with empty required skills",
        "jd": {
            "skills_required": [],
            "experience": "1",
            "domain": "Support",
        },
        "candidates": [
            {
                "name": "Sara",
                "skills": ["Communication", "CRM"],
                "experience": 1,
                "domain": "Support",
            },
            {
                "name": "Leo",
                "skills": [],
                "experience": 0,
                "domain": "Support",
            },
        ],
    },
]

for case in test_cases:
    print(f"\n=== {case['label']} ===")
    results = match_candidates(case["jd"], case["candidates"])

    for result in results:
        print(result)
