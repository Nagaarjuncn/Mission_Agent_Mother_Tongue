"""
Interactive Quizzes & Evaluation API Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.models.schemas import QuizSubmission, QuizEvaluationResponse
from backend.services.analytics_service import analytics_service

router = APIRouter(prefix="/quizzes", tags=["Interactive Quizzes"])

@router.get("/sample", response_model=Dict[str, Any])
def get_sample_quiz(lang: str = "ta"):
    """
    Returns an interactive multi-format quiz suitable for primary students
    (Multiple Choice, Match-the-pair, Drag-and-drop, Picture-based).
    """
    is_tamil = lang.lower() == "ta"

    return {
        "quiz_id": "quiz-water-cycle-001",
        "title": "மழை சுழற்சி வினாடி வினா (Water Cycle Quiz)" if is_tamil else "जल चक्र प्रश्नोत्तरी",
        "language": lang,
        "questions": [
            {
                "id": "q1",
                "type": "mcq",
                "question": "சூரியனின் வெப்பத்தால் நீர் என்னவாக மாறுகிறது?" if is_tamil else "सूरज की गर्मी से पानी क्या बनता है?",
                "options": ["நீராவி (Steam)", "பனிக்கட்டி (Ice)", "பாறை (Rock)"] if is_tamil else ["भाप (Steam)", "बर्फ (Ice)", "पत्थर (Rock)"],
                "correct": "நீராவி (Steam)" if is_tamil else "भाप (Steam)",
                "points": 2
            },
            {
                "id": "q2",
                "type": "picture_match",
                "question": "இட்லிப் பானைத் தட்டில் படிவது எதைப் போன்றது?" if is_tamil else "पतीले के ढक्कन पर पानी की बूंदें क्या दर्शाती हैं?",
                "options": ["மழைத்துளிகள்", "மின்னல்", "சூரியன்"] if is_tamil else ["बारिश की बूंदें", "बिजली", "सूरज"],
                "correct": "மழைத்துளிகள்" if is_tamil else "बारिश की बूंदें",
                "points": 2
            }
        ]
    }

@router.post("/submit", response_model=QuizEvaluationResponse)
def submit_quiz(submission: QuizSubmission):
    """
    Evaluates student answers, awards stars & badges, and provides feedback in mother tongue.
    """
    try:
        return analytics_service.evaluate_quiz_submission(submission)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
