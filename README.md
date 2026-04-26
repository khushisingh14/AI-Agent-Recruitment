# AI-Agent-Recruitment
AI Recruitment Agent

An AI-powered recruitment system that automates candidate screening using job description parsing, candidate matching, and conversational evaluation.

The platform uses Gemini AI to simulate interactions, assess candidate interest, and generate a ranked shortlist based on both skill fit and engagement.

---

Features

- Job description parsing into structured data
- Candidate matching based on skills and experience
- Chat simulation using Gemini AI
- Interest scoring from conversations
- Ranked shortlist with match and interest scores

---

Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: Python (Flask)
- AI: Gemini API (Google AI)

---

How It Works

1. Input job description
2. Extract role, skills, and requirements
3. Match relevant candidates
4. Simulate conversation using AI
5. Evaluate interest and compute scores
6. Generate ranked candidate list

---

Setup

Backend

pip install -r requirements.txt
python app.py

Frontend

npm install
npm run dev

---

Environment Variables

Create a ".env" file:

GEMINI_API_KEY=your_api_key_here

---

Output Example

[
  {
    "name": "Candidate Name",
    "match_score": 85,
    "interest_score": 90,
    "final_score": 87.5,
    "reason": "Strong skill match and high interest"
  }
]

---

Video : 

https://github.com/user-attachments/assets/7c140c04-82d0-4cab-9f04-446cb1199631



Author

Khushi Singh
