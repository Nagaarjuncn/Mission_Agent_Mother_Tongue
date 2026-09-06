"""
Dashboards API Endpoints (Student, Teacher, Parent)
"""
from fastapi import APIRouter, HTTPException
from backend.models.schemas import StudentProfile, TeacherAnalyticsResponse, ParentInsightsResponse
from backend.services.analytics_service import analytics_service

router = APIRouter(tags=["Dashboards & Analytics"])

@router.get("/student/{student_id}/dashboard", response_model=StudentProfile)
@router.get("/student/dashboard", response_model=StudentProfile)
def get_student_dashboard(student_id: str = "student_001"):
    """
    Returns personalized student dashboard data:
    Current grade, mother tongue, learning streaks, stars, subject progress bars,
    completed lessons, and recommended vernacular lessons.
    """
    try:
        return analytics_service.get_student_dashboard(student_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/teacher/analytics", response_model=TeacherAnalyticsResponse)
@router.get("/teacher/cohort-summary", response_model=TeacherAnalyticsResponse)
def get_teacher_analytics():
    """
    Returns class cohort analytics:
    Total student count, language distribution, average quiz scores,
    frequently misunderstood concepts, and student roster.
    """
    try:
        return analytics_service.get_teacher_analytics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/parent/{student_id}/insights", response_model=ParentInsightsResponse)
@router.get("/parent/summary", response_model=ParentInsightsResponse)
def get_parent_insights(student_id: str = "student_001"):
    """
    Returns simple, parent-friendly progress report:
    Screen time, subjects practiced, strengths, weak areas, and actionable home activities.
    """
    try:
        return analytics_service.get_parent_insights(student_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
