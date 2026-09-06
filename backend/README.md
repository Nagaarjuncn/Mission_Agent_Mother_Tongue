# VernacLearn AI Backend 🇮🇳📚

> **“Learn in the Language You Think In.”**  
> AI-powered vernacular education platform that brings personalized learning into every primary-school child's mother tongue.

---

## 🌟 Core Backend Features

1. **AI Real-Time Translation Service**
   - Supports 11 Indian Mother Tongues + English (Tamil, Telugu, Malayalam, Kannada, Hindi, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, English).
   - Generates literal translation, age-appropriate child explanations, and phonetic guides.

2. **AI-Powered Vernacular Pedagogy Engine**
   - Replaces abstract concepts with Indian culturally rooted metaphors (kitchen idli steamer steam for water cycle; sweet mango division for fractions; courtyard tulsi plants for photosynthesis).

3. **AI Vernacular Tutor ("Mitra")**
   - Persona-tailored dialogue for children aged 5–12.
   - Detects misconceptions (e.g., "sun goes to sleep at night").
   - Multi-tiered scaffolding hints (Level 1: Gentle Nudge -> Level 2: Local Metaphor Clue -> Level 3: Guided Solution).

4. **Teacher AI Lesson Generator**
   - Generates 7-part pedagogical lesson plans: Hook, Concept, Story, Local Vocabulary, Classroom Activity, Visual Prompts, Quiz, Homework.
   - Saves, edits, and manages custom lesson plans.

5. **Voice & Speech Service**
   - Audio synthesis specs calibrated with child-friendly pitch and pacing for Indian vernacular accents.
   - Pronunciation feedback with positive reinforcement.

6. **Dashboards & Gamification Analytics**
   - **Student Dashboard**: Streaks, stars, subject progress bars, recommended vernacular lessons.
   - **Teacher Dashboard**: Cohort analytics, language distribution, difficult concepts list, student roster.
   - **Parent Insights**: Screen time, strengths, weak areas, low-stress home activities.

7. **Hackathon Presentation Live Demo Flow**
   - Single-endpoint orchestration (`POST /api/demo/hackathon-flow`) delivering the 3-5 minute live demo path.

---

## 🚀 Quickstart

### Prerequisites
- Python 3.12+ (Installed and verified)

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Running the Server
Using PowerShell:
```powershell
.\backend\start_backend.ps1
```
Or using Batch / CMD:
```cmd
backend\run.bat
```
Or direct Python command:
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The server runs at:
- **Interactive OpenAPI/Swagger UI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Frontend Web App (Mounted)**: [http://localhost:8000/](http://localhost:8000/)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Running Automated Tests

Run the full pytest test suite (covers all 11 core endpoints and features):
```bash
python backend/test_backend.py
```

---

## 📡 REST API Reference

### 1. Translation Endpoints
- **`GET /api/languages`**  
  Returns 12 supported languages with flags and speech codes.

- **`POST /api/translate`**
  ```json
  {
    "text": "Plants need sunlight to grow.",
    "source_lang": "en",
    "target_lang": "ta",
    "generate_explanation": true,
    "student_grade": "Class 3"
  }
  ```

### 2. Vernacular Pedagogy Engine
- **`POST /api/pedagogy/explain`**
  ```json
  {
    "concept_or_question": "Why does rain fall from the sky?",
    "target_lang": "ta",
    "grade": "Class 4",
    "cultural_region": "Tamil Nadu"
  }
  ```

- **`GET /api/pedagogy/metaphors`**  
  Returns curated Indian cultural metaphors.

### 3. AI Tutor ("Mitra")
- **`POST /api/tutor/chat`**
  ```json
  {
    "message": "சூரியன் இரவில் தூங்குகிறது",
    "target_lang": "ta",
    "grade": "Class 3"
  }
  ```

- **`POST /api/tutor/hint`**
  ```json
  {
    "topic": "Water Cycle",
    "question": "நீர் எப்படி மேலே போகிறது?",
    "target_lang": "ta",
    "hint_level": 1
  }
  ```

### 4. Teacher AI Lesson Generator
- **`POST /api/lessons/generate`**
  ```json
  {
    "topic": "The Water Cycle",
    "grade": "Class 4",
    "language": "Tamil",
    "difficulty": "Beginner"
  }
  ```

- **`GET /api/lessons`**  
  List all saved lesson plans.

- **`POST /api/lessons/save`**  
  Persist edited lesson plan.

### 5. Interactive Quizzes & Activities
- **`GET /api/quizzes/sample?lang=ta`**  
  Sample interactive multi-format quiz.

- **`POST /api/quizzes/submit`**
  ```json
  {
    "quiz_id": "quiz-water-cycle-001",
    "student_id": "student_001",
    "answers": { "q1": "நீராவி (Steam)", "q2": "மழைத்துளிகள்" },
    "language": "ta"
  }
  ```

### 6. Dashboards
- **`GET /api/student/{student_id}/dashboard`**
- **`GET /api/teacher/analytics`**
- **`GET /api/parent/{student_id}/insights`**

### 7. Hackathon Golden Demo
- **`POST /api/demo/hackathon-flow`**
  ```json
  {
    "language": "ta",
    "question": "Why does rain fall from the sky?",
    "student_name": "Arun",
    "grade": "Class 4"
  }
  ```

---

## 🏆 Hackathon 3–5 Minute Presentation Path

1. **Select Tamil**: User selects Tamil from the global language bar.
2. **Voice Question**: Click large microphone button -> asks "Why does rain fall from the sky?".
3. **AI Translation**: Live translation to Tamil + phonetic reading text.
4. **Vernacular Pedagogy**: Culturally rooted explanation using the kitchen idli steamer and Vaigai river metaphor.
5. **Mitra AI Tutor Chat**: Student asks "Does sun sleep at night?" -> Mitra corrects the misconception with ball/torch analogy.
6. **Scaffolding Hint**: Student clicks "Give me a hint" -> Stepwise hints without giving away the answer.
7. **Teacher Hub**: Generate instant 7-part lesson plan in Tamil for Class 4.
8. **Interactive Mini Quiz**: Student answers -> Receives stars and "Rain Master" badge.
9. **Dashboard Sync**: Student streak and mastery bar update in real-time.
