"""
Teacher AI Lesson Generator API Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import List
from backend.models.schemas import (
    LessonGenerateRequest,
    LessonPlanResponse,
    LessonSaveRequest,
    TopicSuggestRequest,
    TopicSuggestResponse
)
from backend.services.lesson_service import lesson_service

router = APIRouter(prefix="/lessons", tags=["AI Lesson Generator"])

@router.post("/generate", response_model=LessonPlanResponse)
def generate_lesson_plan(req: LessonGenerateRequest):
    """
    Generates a complete 7-stage teacher lesson plan:
    Pedagogical Hook, Concept Explanation, Story Hook, Local Vocabulary,
    Classroom Activity, Visual Prompts, Quiz Questions, Timeline, Blackboard, and Homework.
    """
    try:
        return lesson_service.generate_lesson(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-topics", response_model=TopicSuggestResponse)
def suggest_topics(req: TopicSuggestRequest):
    """
    AI Ideator: Suggests engaging curriculum topics based on Grade, Standard Level,
    Subject, and Mother Tongue.
    """
    try:
        return lesson_service.suggest_topics(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[LessonPlanResponse])
def list_saved_lessons():
    """Returns all saved teacher lesson plans."""
    return lesson_service.get_all_lessons()

@router.post("/save", response_model=LessonPlanResponse)
def save_lesson_plan(req: LessonSaveRequest):
    """Saves or updates an edited teacher lesson plan."""
    return lesson_service.save_lesson(req.lesson)

@router.delete("/{lesson_id}")
def delete_lesson_plan(lesson_id: str):
    """Deletes a saved teacher lesson plan."""
    success = lesson_service.delete_lesson(lesson_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"status": "deleted", "lesson_id": lesson_id}
