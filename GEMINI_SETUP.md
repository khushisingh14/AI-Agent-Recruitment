# Gemini API Integration Guide

## Setup Steps

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new project or select existing one
4. Copy your API key

### 2. Configure Environment Variables

#### For Backend:
Create `backend/.env` file:
```
GEMINI_API_KEY=your-api-key-here
```

#### For Frontend (Optional, if using client-side):
Add to `talent-ai/.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-here
```

### 3. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# For frontend (if needed)
cd talent-ai
npm install
```

### 4. Start the Backend

```bash
# Make sure you're in the root directory
python backend/server.py
```

The server will now:
- Use Gemini API for **JD parsing** (extracts skills, roles, experience requirements)
- Generate **personalized engagement messages**
- Provide **candidate analysis** using AI

## Features Added

### JD Parsing
- Gemini analyzes job descriptions and extracts:
  - Job title/role
  - Required experience (years)
  - Required skills
  - Domain/category
  - Job summary

### Engagement Messages
- Generates personalized AI messages for candidate outreach

### Candidate Analysis
- AI-powered fit assessment comparing candidate profile to job requirements

## How It Works

1. **Fallback System**: If Gemini API key is not set or API call fails, the system automatically falls back to regex-based parsing
2. **Cost-Efficient**: Uses `gemini-1.5-flash` model for fast, affordable processing
3. **Structured Responses**: All API responses are validated and have fallback behavior

## Testing

Once running, test the integration:

```bash
curl -X POST http://127.0.0.1:8000/parse-jd \
  -H "Content-Type: application/json" \
  -d '{"jd_text": "Looking for a Senior Backend Developer with 5+ years of Python and AWS experience"}'
```

You should see parsed JD with extracted skills, role, and domain.
