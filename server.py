import hashlib
import json
import os
import random
import re
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from chatsimulator import simulate_interest
from matcher import match_candidates
from gemini_client import parse_jd_with_gemini, generate_engagement_message, generate_candidate_analysis

SKILLS_DB = [
    "python",
    "java",
    "c++",
    "javascript",
    "flask",
    "django",
    "react",
    "node",
    "aws",
    "docker",
    "kubernetes",
    "sql",
    "mongodb",
    "redis",
]

ROLES = {
    "backend": "Backend Developer",
    "frontend": "Frontend Developer",
    "full stack": "Full Stack Developer",
    "data scientist": "Data Scientist",
    "ml": "Machine Learning Engineer",
    "machine learning": "Machine Learning Engineer",
}

CANDIDATE_PROFILES = [
    {
        "id": "alex-rivera",
        "name": "Alex Rivera",
        "role": "Senior UX Designer",
        "current_role": "Lead Product Designer at Northstar",
        "experience": 8,
        "location": "Austin, TX",
        "salary": "$162k/yr",
        "status": "Open to Work",
        "domain": "Design",
        "skills": ["User Research", "Figma", "Design Ops", "Product Strategy", "Accessibility", "Journey Mapping"],
        "bio": "Design leader focused on research-backed product systems and cross-functional collaboration for growth-stage product teams.",
        "timeline": [
            {
                "years": "2021 - Present",
                "title": "Lead Product Designer",
                "company": "Northstar Labs",
                "summary": "Built a unified design system that supported six product teams and improved design delivery speed by 33%.",
            },
            {
                "years": "2018 - 2021",
                "title": "Senior UX Designer",
                "company": "Vista Commerce",
                "summary": "Led end-to-end research and redesign of the checkout funnel, improving conversion by 18%.",
            },
        ],
    },
    {
        "id": "marcus-chen",
        "name": "Marcus Chen",
        "role": "UX Strategy Lead",
        "current_role": "Design Director at Elevate Studio",
        "experience": 12,
        "location": "Seattle, WA",
        "salary": "$188k/yr",
        "status": "Employed",
        "domain": "Design",
        "skills": ["Product Strategy", "Prototyping", "Design Leadership", "Stakeholder Alignment", "Workshop Facilitation"],
        "bio": "Experienced design strategy leader with a strong track record in enterprise transformation and service design.",
        "timeline": [
            {
                "years": "2020 - Present",
                "title": "Design Director",
                "company": "Elevate Studio",
                "summary": "Guided enterprise product vision for clients in healthcare and fintech with globally distributed teams.",
            },
            {
                "years": "2014 - 2020",
                "title": "Principal UX Strategist",
                "company": "BrightLayer",
                "summary": "Owned concept development and prototyping for multi-product initiatives spanning web and mobile.",
            },
        ],
    },
    {
    "id": "ananya-sharma",
    "name": "Ananya Sharma",
    "role": "Machine Learning Engineer",
    "current_role": "Senior ML Engineer at DataForge",
    "experience": 6,
    "location": "Bengaluru, India",
    "salary": "₹28L/yr",
    "status": "Employed",
    "domain": "AI/ML",
    "skills": ["Python", "TensorFlow", "PyTorch", "NLP", "Model Deployment", "FastAPI"],
    "bio": "ML engineer specializing in NLP and scalable model deployment for real-world applications.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Senior ML Engineer",
            "company": "DataForge",
            "summary": "Built NLP pipelines and deployed LLM-powered APIs for enterprise clients."
        },
        {
            "years": "2019 - 2022",
            "title": "ML Engineer",
            "company": "QuantLabs",
            "summary": "Worked on recommendation systems and predictive analytics models."
        }
    ]
},
{
    "id": "rohit-verma",
    "name": "Rohit Verma",
    "role": "Backend Engineer",
    "current_role": "Backend Developer at FinEdge",
    "experience": 4,
    "location": "Gurgaon, India",
    "salary": "₹18L/yr",
    "status": "Open to Work",
    "domain": "Backend",
    "skills": ["Node.js", "Express", "MongoDB", "REST APIs", "Docker"],
    "bio": "Backend engineer focused on building scalable APIs and microservices in fintech.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "Backend Developer",
            "company": "FinEdge",
            "summary": "Developed microservices for payment processing systems."
        },
        {
            "years": "2020 - 2021",
            "title": "Junior Developer",
            "company": "CodeBase",
            "summary": "Built REST APIs and handled database operations."
        }
    ]
},
{
    "id": "arjun-mehta",
    "name": "Arjun Mehta",
    "role": "DevOps Engineer",
    "current_role": "Cloud DevOps Engineer at SkyNet Systems",
    "experience": 7,
    "location": "Hyderabad, India",
    "salary": "₹32L/yr",
    "status": "Employed",
    "domain": "DevOps",
    "skills": ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    "bio": "DevOps engineer with strong expertise in cloud infrastructure and automation.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "Cloud DevOps Engineer",
            "company": "SkyNet Systems",
            "summary": "Managed cloud infrastructure and CI/CD pipelines for SaaS products."
        },
        {
            "years": "2018 - 2021",
            "title": "DevOps Engineer",
            "company": "InfraTech",
            "summary": "Implemented automation and monitoring systems."
        }
    ]
},
{
    "id": "neha-kapoor",
    "name": "Neha Kapoor",
    "role": "Data Scientist",
    "current_role": "Senior Data Scientist at InsightAI",
    "experience": 6,
    "location": "Mumbai, India",
    "salary": "₹30L/yr",
    "status": "Employed",
    "domain": "Data Science",
    "skills": ["Python", "Pandas", "Scikit-learn", "SQL", "Data Visualization"],
    "bio": "Data scientist with experience in predictive modeling and business analytics.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Senior Data Scientist",
            "company": "InsightAI",
            "summary": "Built predictive models for customer behavior analysis."
        },
        {
            "years": "2019 - 2022",
            "title": "Data Scientist",
            "company": "DataBridge",
            "summary": "Worked on data pipelines and analytics dashboards."
        }
    ]
},
{
    "id": "daniel-kim",
    "name": "Daniel Kim",
    "role": "Full Stack Developer",
    "current_role": "Full Stack Engineer at NovaTech",
    "experience": 5,
    "location": "San Francisco, CA",
    "salary": "$135k/yr",
    "status": "Open to Work",
    "domain": "Full Stack",
    "skills": ["React", "Node.js", "PostgreSQL", "GraphQL", "Docker"],
    "bio": "Full stack engineer with a focus on building scalable SaaS platforms.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "Full Stack Engineer",
            "company": "NovaTech",
            "summary": "Developed end-to-end SaaS solutions and APIs."
        },
        {
            "years": "2019 - 2021",
            "title": "Software Engineer",
            "company": "AppFlow",
            "summary": "Worked on frontend and backend integrations."
        }
    ]
},
{
    "id": "kavya-reddy",
    "name": "Kavya Reddy",
    "role": "UI/UX Designer",
    "current_role": "Product Designer at DesignHub",
    "experience": 4,
    "location": "Bengaluru, India",
    "salary": "₹16L/yr",
    "status": "Employed",
    "domain": "Design",
    "skills": ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    "bio": "Product designer focused on creating intuitive and user-centered digital experiences.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Product Designer",
            "company": "DesignHub",
            "summary": "Designed user-centric interfaces for web and mobile apps."
        },
        {
            "years": "2020 - 2022",
            "title": "UI Designer",
            "company": "Creative Labs",
            "summary": "Worked on UI design and prototyping."
        }
    ]
},
{
    "id": "rahul-singh",
    "name": "Rahul Singh",
    "role": "Cybersecurity Analyst",
    "current_role": "Security Analyst at SecureNet",
    "experience": 5,
    "location": "Noida, India",
    "salary": "₹20L/yr",
    "status": "Employed",
    "domain": "Cybersecurity",
    "skills": ["Network Security", "SIEM", "Penetration Testing", "Incident Response"],
    "bio": "Cybersecurity analyst experienced in threat detection and incident response.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "Security Analyst",
            "company": "SecureNet",
            "summary": "Monitored and responded to security incidents."
        },
        {
            "years": "2019 - 2021",
            "title": "Junior Security Analyst",
            "company": "CyberSafe",
            "summary": "Performed vulnerability assessments."
        }
    ]
},
{
    "id": "emma-wilson",
    "name": "Emma Wilson",
    "role": "Product Manager",
    "current_role": "Senior Product Manager at BuildX",
    "experience": 8,
    "location": "London, UK",
    "salary": "£95k/yr",
    "status": "Employed",
    "domain": "Product",
    "skills": ["Product Strategy", "Agile", "Roadmapping", "Stakeholder Management"],
    "bio": "Product manager with a strong track record of delivering scalable digital products.",
    "timeline": [
        {
            "years": "2020 - Present",
            "title": "Senior Product Manager",
            "company": "BuildX",
            "summary": "Led product strategy and roadmap execution."
        },
        {
            "years": "2017 - 2020",
            "title": "Product Manager",
            "company": "TechWave",
            "summary": "Managed product lifecycle and feature delivery."
        }
    ]
},
{
    "id": "yash-patel",
    "name": "Yash Patel",
    "role": "Data Engineer",
    "current_role": "Data Engineer at Cloudlytics",
    "experience": 5,
    "location": "Ahmedabad, India",
    "salary": "₹22L/yr",
    "status": "Open to Work",
    "domain": "Data Engineering",
    "skills": ["Python", "Spark", "Kafka", "ETL", "AWS"],
    "bio": "Data engineer specializing in building scalable data pipelines and real-time systems.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Data Engineer",
            "company": "Cloudlytics",
            "summary": "Built ETL pipelines and streaming data systems."
        },
        {
            "years": "2020 - 2022",
            "title": "Junior Data Engineer",
            "company": "DataStack",
            "summary": "Worked on data ingestion and processing pipelines."
        }
    ]
},
{
    "id": "vivek-agarwal",
    "name": "Vivek Agarwal",
    "role": "Software Engineer",
    "current_role": "SDE II at TechNova",
    "experience": 5,
    "location": "Bengaluru, India",
    "salary": "₹24L/yr",
    "status": "Employed",
    "domain": "Backend",
    "skills": ["Java", "Spring Boot", "Microservices", "MySQL", "Kafka"],
    "bio": "Backend engineer experienced in building scalable microservices and distributed systems.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "SDE II",
            "company": "TechNova",
            "summary": "Designed microservices architecture for high-traffic applications."
        },
        {
            "years": "2020 - 2022",
            "title": "Software Engineer",
            "company": "CodeCraft",
            "summary": "Built backend APIs and worked on database optimization."
        }
    ]
},
{
    "id": "ishita-gupta",
    "name": "Ishita Gupta",
    "role": "Frontend Developer",
    "current_role": "Frontend Engineer at UIWorks",
    "experience": 3,
    "location": "Delhi, India",
    "salary": "₹12L/yr",
    "status": "Open to Work",
    "domain": "Frontend",
    "skills": ["React", "JavaScript", "CSS", "Tailwind", "Redux"],
    "bio": "Frontend developer focused on building responsive and interactive user interfaces.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Frontend Engineer",
            "company": "UIWorks",
            "summary": "Developed reusable UI components and improved performance."
        },
        {
            "years": "2021 - 2022",
            "title": "Junior Developer",
            "company": "WebNest",
            "summary": "Worked on frontend features and bug fixes."
        }
    ]
},
{
    "id": "michael-lee",
    "name": "Michael Lee",
    "role": "Cloud Engineer",
    "current_role": "Cloud Engineer at CloudSphere",
    "experience": 6,
    "location": "Singapore",
    "salary": "$120k/yr",
    "status": "Employed",
    "domain": "Cloud",
    "skills": ["AWS", "Terraform", "Kubernetes", "CI/CD", "Linux"],
    "bio": "Cloud engineer with strong expertise in infrastructure automation and container orchestration.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "Cloud Engineer",
            "company": "CloudSphere",
            "summary": "Managed cloud infrastructure and deployment pipelines."
        },
        {
            "years": "2019 - 2021",
            "title": "DevOps Engineer",
            "company": "InfraCloud",
            "summary": "Automated CI/CD and infrastructure provisioning."
        }
    ]
},
{
    "id": "pooja-nair",
    "name": "Pooja Nair",
    "role": "QA Engineer",
    "current_role": "QA Automation Engineer at Testify",
    "experience": 4,
    "location": "Kochi, India",
    "salary": "₹14L/yr",
    "status": "Employed",
    "domain": "QA",
    "skills": ["Selenium", "Cypress", "API Testing", "Automation", "JUnit"],
    "bio": "QA engineer specializing in automation testing and quality assurance processes.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "QA Automation Engineer",
            "company": "Testify",
            "summary": "Built automation frameworks and improved testing efficiency."
        },
        {
            "years": "2020 - 2022",
            "title": "QA Engineer",
            "company": "BugTrack",
            "summary": "Performed manual and API testing."
        }
    ]
},
{
    "id": "alex-rodriguez",
    "name": "Alex Rodriguez",
    "role": "Full Stack Developer",
    "current_role": "Senior Full Stack Engineer at CodeFusion",
    "experience": 7,
    "location": "Austin, TX",
    "salary": "$145k/yr",
    "status": "Employed",
    "domain": "Full Stack",
    "skills": ["React", "Node.js", "GraphQL", "PostgreSQL", "Docker"],
    "bio": "Full stack engineer experienced in building scalable SaaS platforms.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "Senior Full Stack Engineer",
            "company": "CodeFusion",
            "summary": "Led development of SaaS applications and APIs."
        },
        {
            "years": "2018 - 2021",
            "title": "Full Stack Developer",
            "company": "DevStack",
            "summary": "Worked on frontend-backend integrations."
        }
    ]
},
{
    "id": "simran-kaur",
    "name": "Simran Kaur",
    "role": "Data Analyst",
    "current_role": "Data Analyst at InsightCorp",
    "experience": 3,
    "location": "Chandigarh, India",
    "salary": "₹10L/yr",
    "status": "Open to Work",
    "domain": "Data",
    "skills": ["SQL", "Excel", "Power BI", "Python", "Data Visualization"],
    "bio": "Data analyst with strong skills in business intelligence and reporting.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Data Analyst",
            "company": "InsightCorp",
            "summary": "Created dashboards and analyzed business data."
        },
        {
            "years": "2021 - 2022",
            "title": "Junior Analyst",
            "company": "DataVision",
            "summary": "Worked on data cleaning and reporting."
        }
    ]
},
{
    "id": "karan-malhotra",
    "name": "Karan Malhotra",
    "role": "Mobile Developer",
    "current_role": "Android Developer at Appify",
    "experience": 4,
    "location": "Noida, India",
    "salary": "₹15L/yr",
    "status": "Employed",
    "domain": "Mobile",
    "skills": ["Kotlin", "Android", "REST APIs", "Jetpack", "Firebase"],
    "bio": "Android developer focused on building high-performance mobile apps.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Android Developer",
            "company": "Appify",
            "summary": "Developed scalable Android apps with modern architecture."
        },
        {
            "years": "2020 - 2022",
            "title": "Junior Developer",
            "company": "MobileWorks",
            "summary": "Worked on app features and bug fixes."
        }
    ]
},
{
    "id": "lisa-wang",
    "name": "Lisa Wang",
    "role": "AI Research Scientist",
    "current_role": "Research Scientist at DeepVision",
    "experience": 8,
    "location": "Toronto, Canada",
    "salary": "$155k/yr",
    "status": "Employed",
    "domain": "AI Research",
    "skills": ["Deep Learning", "PyTorch", "Computer Vision", "Research", "Model Optimization"],
    "bio": "AI researcher specializing in deep learning and computer vision.",
    "timeline": [
        {
            "years": "2020 - Present",
            "title": "Research Scientist",
            "company": "DeepVision",
            "summary": "Worked on advanced CV models and research projects."
        },
        {
            "years": "2016 - 2020",
            "title": "ML Engineer",
            "company": "VisionAI",
            "summary": "Built ML models for image recognition."
        }
    ]
},
{
    "id": "farhan-ali",
    "name": "Farhan Ali",
    "role": "Site Reliability Engineer",
    "current_role": "SRE at ScaleOps",
    "experience": 6,
    "location": "Hyderabad, India",
    "salary": "₹27L/yr",
    "status": "Employed",
    "domain": "SRE",
    "skills": ["Kubernetes", "Monitoring", "Linux", "CI/CD", "Automation"],
    "bio": "SRE focused on reliability, scalability, and system performance.",
    "timeline": [
        {
            "years": "2021 - Present",
            "title": "SRE",
            "company": "ScaleOps",
            "summary": "Ensured uptime and reliability of distributed systems."
        },
        {
            "years": "2019 - 2021",
            "title": "DevOps Engineer",
            "company": "InfraScale",
            "summary": "Worked on deployment and monitoring systems."
        }
    ]
},
{
    "id": "meera-joshi",
    "name": "Meera Joshi",
    "role": "Product Designer",
    "current_role": "Senior Product Designer at UXCraft",
    "experience": 6,
    "location": "Pune, India",
    "salary": "₹20L/yr",
    "status": "Employed",
    "domain": "Design",
    "skills": ["Figma", "UX Research", "Prototyping", "Design Systems", "User Testing"],
    "bio": "Product designer focused on user-centered design and scalable design systems.",
    "timeline": [
        {
            "years": "2022 - Present",
            "title": "Senior Product Designer",
            "company": "UXCraft",
            "summary": "Led design initiatives and built scalable design systems."
        },
        {
            "years": "2020 - 2022",
            "title": "Product Designer",
            "company": "DesignLab",
            "summary": "Worked on UX research and prototyping."
        }
    ]
},
    {
        "id": "elena-rodriguez",
        "name": "Elena Rodriguez",
        "role": "Senior Frontend Engineer",
        "current_role": "Lead UI Architect at TechFlow Solutions",
        "experience": 8,
        "location": "Remote",
        "salary": "$145k/yr",
        "status": "Open to Work",
        "domain": "Frontend",
        "skills": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node", "GraphQL", "Figma"],
        "bio": "Passionate developer with 8+ years of experience building scalable design systems and high-performance React applications. Currently focusing on accessible UI and AI-driven user experiences.",
        "timeline": [
            {
                "years": "2021 - Present",
                "title": "Lead UI Architect",
                "company": "TechFlow Solutions",
                "summary": "Leading a team of 12 developers to rebuild the core design system used by 50+ internal products.",
            },
            {
                "years": "2018 - 2021",
                "title": "Senior Frontend Developer",
                "company": "Innovate Global",
                "summary": "Developed real-time analytics dashboards using React and D3.js, improving load times by 40%.",
            },
        ],
    },
]


def extract_skills(text):
    """Extract skills from job description text."""
    text_lower = text.lower()
    found_skills = set()
    
    for skill in SKILLS_DB:
        if skill.lower() in text_lower:
            found_skills.add(skill)
    
    # Also look for common skill patterns not in SKILLS_DB
    skill_patterns = [
        r"(?:proficient in|experience with|strong knowledge of)\s+([^,.\n]+)",
        r"(?:must have|required|expertise in)\s+([^,.\n]+)",
    ]
    
    for pattern in skill_patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            # Clean up and add skills from the match
            skills_in_match = [s.strip() for s in match.split(" and ")]
            for s in skills_in_match:
                if len(s) > 2:  # Filter out very short matches
                    found_skills.add(s)
    
    return sorted(list(found_skills))


def extract_experience(text):
    """Extract years of experience from job description."""
    text_lower = text.lower()
    
    # Look for patterns like "5+ years", "5 years", "5+ yrs"
    patterns = [
        r"(\d+)\+?\s*(?:years|yrs|years?)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            try:
                return int(match.group(1))
            except (ValueError, IndexError):
                continue
    
    return 0


def extract_role(text):
    """Extract job role/title from description."""
    text_lower = text.lower()
    
    # First try to match known roles
    for key, value in ROLES.items():
        if key in text_lower:
            return value
    
    # Look for job title patterns
    patterns = [
        r"(?:position|role|title):\s*([^,\n]+)",
        r"(?:we\s+are\s+looking\s+for|we\s+seek)\s+(?:a\s+)?([^,.\n]+)",
        r"^([a-zA-Z\s]+)(?:\s+(?:role|position|job))",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            role = match.group(1).strip().title()
            if len(role) > 3:  # Ensure it's not too short
                return role
    
    return "Software Developer"


def infer_domain(role, skills):
    """Infer domain from role and skills."""
    role_lower = role.lower()
    skills_lower = {skill.lower() for skill in skills} if skills else set()

    if "frontend" in role_lower or {"react", "javascript", "vue", "angular", "tailwind", "css"} & skills_lower:
        return "Frontend"
    if "backend" in role_lower or {"django", "flask", "sql", "docker", "node.js", "express", "spring"} & skills_lower:
        return "Backend"
    if "full stack" in role_lower:
        return "Full Stack"
    if "data scientist" in role_lower or "ml" in role_lower or "machine learning" in role_lower or {"tensorflow", "pytorch", "scikit", "pandas"} & skills_lower:
        return "AI/ML"
    if "devops" in role_lower or "cloud" in role_lower or {"kubernetes", "terraform", "ci/cd"} & skills_lower:
        return "DevOps"
    if "design" in role_lower or "ux" in role_lower or "ui" in role_lower or {"figma", "sketch", "prototyping"} & skills_lower:
        return "Design"
    if "machine learning" in role_lower:
        return "AI/ML"
    return "General"


def parse_jd(jd_text):
    """Parse JD with Gemini first, fallback to regex-based parsing."""
    if not jd_text or not jd_text.strip():
        return {
            "skills": [],
            "experience": 0,
            "role": "Software Developer",
            "domain": "General",
            "summary": "No job description provided",
        }
    
    # Try Gemini first for better parsing
    gemini_result = parse_jd_with_gemini(jd_text)
    if gemini_result:
        return {
            "skills": gemini_result.get("skills_required", []),
            "experience": int(gemini_result.get("experience", 0)),
            "role": gemini_result.get("role", "Software Developer"),
            "domain": gemini_result.get("domain", "General"),
            "summary": gemini_result.get("summary", ""),
        }
    
    # Fallback to regex-based parsing
    print("Falling back to regex-based JD parsing")
    skills = extract_skills(jd_text)
    role = extract_role(jd_text)
    experience = extract_experience(jd_text)
    domain = infer_domain(role, skills)
    
    return {
        "skills": skills,
        "experience": experience,
        "role": role,
        "domain": domain,
        "summary": f"Parsed JD for {role} position requiring {experience}+ years of experience",
    }


def build_matcher_jd(parsed_jd):
    return {
        "skills_required": parsed_jd.get("skills", []),
        "experience": parsed_jd.get("experience", 0),
        "domain": parsed_jd.get("domain", ""),
        "role": parsed_jd.get("role", "Software Developer"),
    }


def stable_interest(candidate, matcher_jd):
    seed_source = f"{candidate.get('name','')}|{matcher_jd.get('role','')}|{matcher_jd.get('experience',0)}|{'-'.join(matcher_jd.get('skills_required', []))}"
    seed_value = int(hashlib.sha256(seed_source.encode("utf-8")).hexdigest()[:8], 16)
    state = random.getstate()
    random.seed(seed_value)
    try:
        return simulate_interest(candidate, matcher_jd)
    finally:
        random.setstate(state)


def build_match_messages(candidate, parsed_jd, interest_reason):
    matched_skills = candidate.get("matchedSkills", [])
    top_skills = ", ".join(skill.title() for skill in matched_skills[:3]) or "your profile"
    role = parsed_jd.get("role", "this role")

    recruiter_open = (
        f"Hi {candidate['name'].split()[0]}! I reviewed your background for our {role} opening. "
        f"Your experience with {top_skills} looks especially relevant. Would you be open to hearing more?"
    )

    if candidate["interestScore"] >= 85:
        candidate_reply = "Yes, definitely. The role sounds relevant to what I want next. Can you share the team setup and current priorities?"
        recruiter_follow_up = (
            f"Absolutely. You currently score {candidate['matchScore']}% on fit, and your strongest overlap is {top_skills}. "
            "The team is moving quickly and values hands-on ownership."
        )
    elif candidate["interestScore"] >= 65:
        candidate_reply = "Possibly. I am interested, but I would want to understand the scope, stack, and growth path first."
        recruiter_follow_up = (
            f"That makes sense. Your match score is {candidate['matchScore']}%, with good overlap in {top_skills}. "
            "I can walk you through the expectations and growth path."
        )
    else:
        candidate_reply = "I am open to a quick look, though I am not actively searching right now."
        recruiter_follow_up = (
            f"Understood. Even as a passive candidate, your profile still shows a {candidate['matchScore']}% fit based on {top_skills}. "
            "I can keep this concise and focused on the most relevant details."
        )

    return [
        {"sender": "ai", "time": "10:24 AM", "text": recruiter_open},
        {"sender": "candidate", "time": "10:26 AM", "text": candidate_reply},
        {"sender": "ai", "time": "10:27 AM", "text": recruiter_follow_up},
        {
            "sender": "candidate",
            "time": "10:30 AM",
            "text": f"Helpful context. Based on that, my interest looks like: {interest_reason.lower() or 'still evaluating'}.",
        },
    ]


def enrich_candidate(profile, parsed_jd, matched_result):
    enriched = {
        "id": profile["id"],
        "name": profile["name"],
        "role": profile["role"],
        "currentRole": profile["current_role"],
        "yearsExperience": profile["experience"],
        "location": profile["location"],
        "salary": profile["salary"],
        "status": profile["status"],
        "skills": profile["skills"],
        "highlightedSkills": profile["skills"][:3],
        "bio": profile["bio"],
        "timeline": profile["timeline"],
        "domain": profile["domain"],
        "matchScore": matched_result["match_score"],
        "matchedSkills": matched_result["matched_skills"],
        "missingSkills": matched_result["missing_skills"],
        "matchExplanation": matched_result["explanation"],
    }

    interest = stable_interest(
        {
            "name": profile["name"],
            "status": profile["status"],
            "match_score": matched_result["match_score"],
            "matched_skills": matched_result["matched_skills"],
        },
        build_matcher_jd(parsed_jd),
    )

    enriched["interestScore"] = interest["interest_score"]
    enriched["interestReason"] = interest["reason"]
    enriched["finalScore"] = round((enriched["matchScore"] * 0.6) + (enriched["interestScore"] * 0.4))
    enriched["insight"] = (
        f"{interest['reason'] or 'Candidate sentiment captured'}. "
        f"Matched skills: {', '.join(skill.title() for skill in matched_result['matched_skills']) or 'none yet'}."
    )
    enriched["messages"] = build_match_messages(enriched, parsed_jd, interest["reason"])
    return enriched


def build_pipeline(jd_text):
    parsed_jd = parse_jd(jd_text)
    matcher_jd = build_matcher_jd(parsed_jd)

    raw_candidates = [
        {
            "name": profile["name"],
            "skills": profile["skills"],
            "experience": profile["experience"],
            "domain": profile["domain"],
        }
        for profile in CANDIDATE_PROFILES
    ]

    matched_results = match_candidates(matcher_jd, raw_candidates)
    merged = []

    for profile in CANDIDATE_PROFILES:
        matched = next((item for item in matched_results if item["name"] == profile["name"]), None)
        if matched:
            merged.append(enrich_candidate(profile, parsed_jd, matched))

    merged.sort(key=lambda candidate: candidate["finalScore"], reverse=True)
    return {"parsed_jd": parsed_jd, "candidates": merged}


def parse_request_body(handler):
    content_length = int(handler.headers.get("Content-Length", 0))
    body = handler.rfile.read(content_length).decode("utf-8")
    try:
        return json.loads(body or "{}")
    except json.JSONDecodeError:
        return None


class JDParserHandler(BaseHTTPRequestHandler):
    def _send_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _send_json(self, payload, status_code=200):
        self._send_headers(status_code)
        if status_code != 204:
            self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_OPTIONS(self):
        self._send_json({}, 204)

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query = parse_qs(parsed_url.query)

        if path == "/health":
            self._send_json({"ok": True, "service": "jd-parser"})
            return

        if path == "/pipeline":
            jd_text = query.get("jd_text", [""])[0]
            if not jd_text.strip():
                self._send_json({"ok": False, "error": "jd_text query parameter is required"}, 400)
                return
            self._send_json({"ok": True, **build_pipeline(jd_text)})
            return

        if path.startswith("/candidate/"):
            candidate_id = path.split("/candidate/", 1)[1]
            jd_text = query.get("jd_text", [""])[0]

            if not candidate_id:
                self._send_json({"ok": False, "error": "candidate id is required"}, 400)
                return
            if not jd_text.strip():
                self._send_json({"ok": False, "error": "jd_text query parameter is required"}, 400)
                return

            pipeline = build_pipeline(jd_text)
            candidate = next((item for item in pipeline["candidates"] if item["id"] == candidate_id), None)
            if not candidate:
                self._send_json({"ok": False, "error": "Candidate not found"}, 404)
                return

            self._send_json({"ok": True, "parsed_jd": pipeline["parsed_jd"], "candidate": candidate})
            return

        self._send_json({"ok": False, "error": "Not found"}, 404)

    def do_POST(self):
        if self.path not in {"/parse-jd", "/pipeline"}:
            self._send_json({"ok": False, "error": "Not found"}, 404)
            return

        payload = parse_request_body(self)
        if payload is None:
            self._send_json({"ok": False, "error": "Invalid JSON payload"}, 400)
            return

        jd_text = payload.get("jd_text", "")
        if not isinstance(jd_text, str) or not jd_text.strip():
            self._send_json({"ok": False, "error": "jd_text is required"}, 400)
            return

        if self.path == "/parse-jd":
            self._send_json({"ok": True, "parsed": parse_jd(jd_text)})
            return

        self._send_json({"ok": True, **build_pipeline(jd_text)})


def run():
    host = os.environ.get("JD_PARSER_HOST", "127.0.0.1")
    port = int(os.environ.get("JD_PARSER_PORT", "8000"))
    server = HTTPServer((host, port), JDParserHandler)
    print(f"JD parser server running on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()
