# Mission Agent Mother-Tongue — Full-Stack Vernacular AI Education Platform 🇮🇳📚

> **“Learn in the Language You Think In.”**  
> An AI-powered educational web platform bringing personalized primary education (ages 5–12) into 11+ Indian mother tongues with culturally rooted pedagogical analogies.

---

## 🌟 Full-Stack Architecture

Mission Agent Mother-Tongue combines a high-performance **Python FastAPI** AI backend with a rich, responsive **Vanilla ES6+** frontend with zero build-step complexity:

```
Mission Agent Mother-Tongue/
├── backend/
│   ├── main.py                   # Master FastAPI server (CORS, REST API, Static Web App Mount)
│   ├── config.py                 # Configuration & 12 Indian language definitions
│   ├── test_backend.py           # Automated test suite (11 passing tests)
│   ├── models/schemas.py         # Strongly typed Pydantic contracts
│   ├── routes/                   # REST API routes (/api/translate, /api/pedagogy, etc.)
│   └── services/                 # Pedagogy Engine, Mitra AI Tutor, Lesson Generator, Speech, Analytics
├── frontend/
│   ├── index.html                # Unified web application entry point
│   ├── js/
│   │   ├── apiClient.js          # Resilient HTTP API client with offline fallback
│   │   ├── app.js                # Full-stack UI coordinator
│   │   ├── tutorChat.js          # Mitra chatbot with Socratic hints
│   │   ├── interactiveQuiz.js    # Interactive quizzes & celebration confetti
│   │   ├── pedagogyEngine.js     # Cultural metaphor generation
│   │   ├── speechEngine.js       # Voice synthesis & speech recognition
│   │   ├── hackathonDemo.js      # 1-click 3-minute golden demo walkthrough
│   │   └── mockData.js           # Vernacular database & offline fallback
│   └── styles/
│       ├── main.css              # Typography, layout, glassmorphism design tokens
│       ├── components.css        # Cards, mascot emotions, backend status pill
│       └── responsive.css        # Mobile, tablet, and desktop layouts
├── requirements.txt              # Unified dependencies
├── start_fullstack.ps1           # 1-Click PowerShell launcher
└── run.bat                       # 1-Click Windows CMD batch file
```

---

## 🚀 Quickstart — Running the Full Stack Website

### Option 1: One-Click PowerShell (Recommended)
Right-click `start_fullstack.ps1` and select **Run with PowerShell**, or from your terminal:
```powershell
.\start_fullstack.ps1
```

### Option 2: Windows Batch
Double-click `run.bat` in File Explorer.

### Option 3: Direct Command Line
```powershell
$env:PYTHONPATH='.'
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Once running:
- **Web Application**: [http://localhost:8000/](http://localhost:8000/)
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 💡 Key Full-Stack Features

1. **⚡ Live Full-Stack Status Pill**:
   - The global navigation bar displays a live pulsating badge (`⚡ AI Backend Online`).
   - If the backend is running, all student and teacher queries leverage live AI engines; if offline, the app seamlessly falls back to client-side simulations.

2. **🌐 Multilingual AI Translation & Pedagogy**:
   - 11 Indian Languages + English: Tamil (தமிழ்), Telugu (తెలుగు), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), and English.
   - Contrasts dry word-for-word translation with culturally familiar analogies (e.g. kitchen rasam steam for the water cycle).

3. **🦉 Mitra — AI Vernacular Socratic Tutor**:
   - Dialogue tailored for children with emotion recognition.
   - Detects misconceptions with gentle corrections.
   - Multi-tiered progressive scaffolding hints (Nudge ➔ Metaphor Clue ➔ Guided Solution).

4. **👩‍🏫 Teacher AI 7-Stage Lesson Plan Generator**:
   - Generates comprehensive lesson plans (Story Hook, Mother Tongue Glossary, Zero-Cost Experiment, Formative Quiz, and Dinner Homework).
   - One-click print / PDF export.

5. **🎒 Multi-Role Dashboards**:
   - Student Learning Hub with streaks, stars, and subject progress.
   - Teacher Hub with classroom language distribution and misunderstanding heatmaps.
   - Parent View with dinner conversation prompts and child voice notes.

6. **✨ 3-Minute Live Hackathon Demo**:
   - Click the **3-Min Demo** button in the navbar for an automated end-to-end presentation tour.

---

## 🧪 Testing the Backend

Run all 11 automated test cases:
```powershell
$env:PYTHONPATH='.'
pytest backend/test_backend.py -v
```
All 11 tests pass with 100% success rate.
