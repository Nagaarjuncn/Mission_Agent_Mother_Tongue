"""
AI Vernacular Tutor ("Mitra") API Endpoints
"""
from fastapi import APIRouter, HTTPException
from backend.models.schemas import TutorChatRequest, TutorChatResponse, TutorHintRequest, TutorHintResponse
from backend.services.tutor_service import tutor_service

router = APIRouter(prefix="/tutor", tags=["AI Vernacular Tutor"])

@router.post("/chat", response_model=TutorChatResponse)
def chat_with_tutor(req: TutorChatRequest):
    """
    Conversational turn with Mitra, the colorful friendly AI tutor.
    Answers in mother tongue, diagnoses misconceptions, gives hints, and awards stars.
    """
    try:
        return tutor_service.handle_chat_turn(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/hint", response_model=TutorHintResponse)
def get_tutor_hint(req: TutorHintRequest):
    """
    Returns progressive scaffolding hints (Level 1: Nudge, Level 2: Local clue, Level 3: Near-answer)
    so children never get frustrated.
    """
    try:
        return tutor_service.generate_hint(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
