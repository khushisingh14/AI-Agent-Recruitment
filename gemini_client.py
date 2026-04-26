import os
import json
import google.generativeai as genai

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def parse_jd_with_gemini(jd_text):
    """
    Parse job description using Gemini to extract structured data.
    Includes robust JSON validation and fallback handling.
    """
    if not GEMINI_API_KEY:
        return None  # Fallback to non-AI parsing
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""Extract job requirements from this JD. Return ONLY valid JSON with no other text.

Job Description:
{jd_text}

Return this JSON structure exactly:
{{
  "role": "job title or position name",
  "experience": integer representing years required,
  "domain": "Backend or Frontend or Full Stack or Data Science or AI/ML or DevOps or Design or General",
  "skills_required": ["skill1", "skill2", "skill3"],
  "summary": "1-2 sentence summary"
}}

Requirements:
- All fields must be present
- experience must be a number
- skills_required must be an array
- domain must be one of: Backend, Frontend, Full Stack, Data Science, AI/ML, DevOps, Design, General
- Return ONLY JSON, no markdown, no code blocks, no extra text"""
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            # Find lines between ``` markers
            start_idx = -1
            end_idx = -1
            for i, line in enumerate(lines):
                if line.strip().startswith("```"):
                    if start_idx == -1:
                        start_idx = i
                    else:
                        end_idx = i
                        break
            
            if start_idx >= 0 and end_idx > start_idx:
                response_text = "\n".join(lines[start_idx + 1:end_idx])
            elif start_idx >= 0:
                response_text = "\n".join(lines[start_idx + 1:])
        
        # Remove 'json' language identifier if present
        response_text = response_text.strip()
        if response_text.startswith("json"):
            response_text = response_text[4:].strip()
        
        # Validate and parse JSON
        parsed = json.loads(response_text)
        
        # Validate required fields
        required_fields = {"role", "experience", "domain", "skills_required", "summary"}
        if not all(field in parsed for field in required_fields):
            missing = required_fields - set(parsed.keys())
            print(f"Gemini parsing warning: missing fields {missing}")
            return None
        
        # Validate field types
        if not isinstance(parsed.get("experience"), (int, float)):
            try:
                parsed["experience"] = int(parsed["experience"])
            except (ValueError, TypeError):
                print(f"Gemini parsing warning: invalid experience value")
                return None
        
        if not isinstance(parsed.get("skills_required"), list):
            print(f"Gemini parsing warning: skills_required is not a list")
            return None
        
        # Validate domain value
        valid_domains = {"Backend", "Frontend", "Full Stack", "Data Science", "AI/ML", "DevOps", "Design", "General"}
        if parsed.get("domain") not in valid_domains:
            print(f"Gemini parsing warning: invalid domain '{parsed.get('domain')}'")
            return None
        
        return parsed
    
    except json.JSONDecodeError as e:
        print(f"Gemini JSON parsing error: {e}")
        print(f"Response was: {response_text[:200]}")
        return None
    except Exception as e:
        print(f"Gemini parsing error: {e}")
        return None



def generate_engagement_message(candidate_name, role, matched_skills):
    """
    Generate personalized AI engagement message using Gemini.
    Returns None gracefully if API call fails.
    """
    if not GEMINI_API_KEY:
        return None
    
    if not candidate_name or not role:
        return None
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        skills_str = ", ".join(matched_skills[:3]) if matched_skills else "your profile"
        
        prompt = f"""Generate a brief, professional recruiting message (1 sentence max).

Candidate: {candidate_name}
Job Role: {role}
Matched Skills: {skills_str}

Requirements:
- Be friendly but professional
- Do NOT include salutation (no "Hi" or greeting)
- Maximum 1 sentence
- Focus on matched skills
- Under 100 characters"""
        
        response = model.generate_content(prompt)
        message = response.text.strip()
        
        # Validate response
        if message and len(message) < 500:  # Sanity check for length
            return message
        else:
            print(f"Generated message too long or empty")
            return None
    
    except Exception as e:
        print(f"Gemini message generation error: {e}")
        return None


def generate_candidate_analysis(candidate_profile, jd_parsed):
    """
    Generate detailed candidate analysis using Gemini.
    Returns None gracefully if API call fails.
    """
    if not GEMINI_API_KEY:
        return None
    
    if not candidate_profile or not jd_parsed:
        return None
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        candidate_skills = ", ".join(candidate_profile.get("skills", [])[:5])
        required_skills = ", ".join(jd_parsed.get("skills_required", [])[:5])
        
        prompt = f"""Analyze candidate fit for role (2 sentences max, be concise).

Candidate:
- Name: {candidate_profile.get('name', 'Unknown')}
- Role: {candidate_profile.get('role', 'Unknown')}
- Experience: {candidate_profile.get('experience', 0)} years
- Skills: {candidate_skills}
- Status: {candidate_profile.get('status', 'Unknown')}

Job Requirements:
- Role: {jd_parsed.get('role', 'Unknown')}
- Experience: {jd_parsed.get('experience', 0)} years
- Domain: {jd_parsed.get('domain', 'Unknown')}
- Skills: {required_skills}

Provide honest 2-sentence assessment. Focus on fit alignment."""
        
        response = model.generate_content(prompt)
        analysis = response.text.strip()
        
        # Validate response
        if analysis and len(analysis) < 500:  # Sanity check
            return analysis
        else:
            print(f"Generated analysis too long or empty")
            return None
    
    except Exception as e:
        print(f"Gemini analysis error: {e}")
        return None
