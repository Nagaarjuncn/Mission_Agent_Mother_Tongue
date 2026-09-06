"""
Analytics & Dashboard Service
Powers:
1. Student Mother-Tongue Learning Dashboard
2. Teacher Class Analytics & Misconceptions Hub
3. Parent-Friendly Insights & Home Guidance
4. Interactive Quiz Evaluation Engine
"""
from typing import Dict, Any, List
from backend.models.schemas import (
    StudentProfile,
    TeacherAnalyticsResponse,
    ParentInsightsResponse,
    QuizSubmission,
    QuizEvaluationResponse
)

# Simulated in-memory database for student profiles
STUDENT_DATA = {
    "student_001": {
        "student_id": "student_001",
        "name": "அருண் செல்வன் (Arun Selvan)",
        "grade": "Class 3",
        "mother_tongue": "Tamil (தமிழ்)",
        "mother_tongue_code": "ta",
        "learning_streak_days": 12,
        "total_stars": 148,
        "completed_lessons": 24,
        "average_quiz_score": 92.5,
        "subjects": [
            {"id": "sci", "name": "அறிவியல் (Science)", "icon": "🔬", "progress": 85, "color": "blue", "topics": "தாவரங்கள், மழை சுழற்சி"},
            {"id": "math", "name": "கணிதம் (Mathematics)", "icon": "🔢", "progress": 90, "color": "orange", "topics": "பின்னங்கள், கூட்டல்"},
            {"id": "evs", "name": "சூழ்நிலையியல் (EVS)", "icon": "🌍", "progress": 78, "color": "green", "topics": "கிராமத்து சூழல், நீர்நிலைகள்"},
            {"id": "lang", "name": "தமிழ் மொழி (Language)", "icon": "📖", "progress": 95, "color": "purple", "topics": "எழுத்தறிவு, சிறுகதைகள்"},
            {"id": "gk", "name": "பொது அறிவு (General Knowledge)", "icon": "💡", "progress": 80, "color": "yellow", "topics": "இந்தியப் பண்டிகைகள்"}
        ],
        "recent_badges": [
            {"name": "சூரியத் தோழன் (Sun Scholar)", "icon": "☀️", "desc": "ஒளிச்சேர்க்கை பாடத்தை வெற்றிகரமாக முடித்தார்!"},
            {"name": "மழை நாயகன் (Rain Whisperer)", "icon": "🌧️", "desc": "மழை சுழற்சி வினாடி வினாவில் 100% மதிப்பெண்!"},
            {"name": "தாய்மொழி வித்தகர் (Mother Tongue Ace)", "icon": "🏅", "desc": "12 நாட்கள் தொடர்ந்து தாய்மொழியில் பயின்றார்!"}
        ],
        "recommended_lessons": [
            {"id": "rec-1", "title": "வைகை ஆற்றின் பயணம் (River Journey)", "subject": "EVS", "duration": "8 mins"},
            {"id": "rec-2", "title": "பின்னங்களும் பொங்கல் பானையும்", "subject": "Math", "duration": "10 mins"},
            {"id": "rec-3", "title": "பூக்களின் வண்ணங்கள் எப்படி வருகின்றன?", "subject": "Science", "duration": "6 mins"}
        ]
    }
}

TEACHER_DATA = {
    "class_name": "Class 3-A (Madurai Primary Vidhyalaya)",
    "total_students": 38,
    "active_today": 35,
    "average_class_score": 86.4,
    "language_distribution": [
        {"language": "Tamil (தமிழ்)", "percentage": 74, "student_count": 28, "color": "#2563eb"},
        {"language": "Telugu (తెలుగు)", "percentage": 13, "student_count": 5, "color": "#059669"},
        {"language": "Hindi (हिन्दी)", "percentage": 8, "student_count": 3, "color": "#d97706"},
        {"language": "Malayalam (മലയാളം)", "percentage": 5, "student_count": 2, "color": "#7c3aed"}
    ],
    "misunderstood_concepts": [
        {
            "concept": "ஆவியாதல் vs கொதித்தல் (Evaporation vs Boiling)",
            "difficulty_rate": "34% of students struggled",
            "suggested_pedagogy": "வெயிலில் காயும் துணிகளை உதாரணமாக்கி விளக்குங்கள் (Use clothes drying in the sun)"
        },
        {
            "concept": "பின்னங்களில் பகுதி மற்றும் தொகுதி (Numerator vs Denominator)",
            "difficulty_rate": "28% of students struggled",
            "suggested_pedagogy": "முழு மாம்பழத்தை வெட்டிப் பங்கீடு செய்து காட்டி விளக்குங்கள் (Divide whole mango)"
        }
    ],
    "weekly_learning_trend": [
        {"day": "Mon", "score": 82},
        {"day": "Tue", "score": 84},
        {"day": "Wed", "score": 88},
        {"day": "Thu", "score": 85},
        {"day": "Fri", "score": 91}
    ],
    "student_roster": [
        {"id": "std-1", "name": "அருண் செல்வன்", "lang": "Tamil", "score": 92, "streak": 12, "status": "Advanced"},
        {"id": "std-2", "name": "கவிதா சுந்தர்", "lang": "Tamil", "score": 88, "streak": 9, "status": "On Track"},
        {"id": "std-3", "name": "ராகுல் வர்மா", "lang": "Hindi", "score": 85, "streak": 7, "status": "On Track"},
        {"id": "std-4", "name": "சாய் பிரணவ்", "lang": "Telugu", "score": 79, "streak": 4, "status": "Needs Nudge"}
    ]
}

PARENT_DATA = {
    "student_name": "அருண் செல்வன் (Arun)",
    "mother_tongue": "Tamil (தமிழ்)",
    "total_time_spent_mins": 145,
    "lessons_completed_this_week": 6,
    "overall_accuracy_pct": 93,
    "current_streak_days": 12,
    "strengths": [
        "அறிவியல் கருத்துக்களைத் தாய்மொழியில் மிக எளிதாகப் புரிந்துகொள்கிறார் (Strong in Science in mother tongue)",
        "குரல் வழிக் கேள்விகளுக்குத் துல்லியமாக உச்சரித்து விடையளிக்கிறார் (Clear voice pronunciation)"
    ],
    "areas_needing_attention": [
        "கணிதத்தில் பின்னங்களை எழுதுவதில் சிறு தயக்கம் உள்ளது (Minor hesitation in writing fractions)"
    ],
    "simple_home_activities": [
        {
            "activity": "சமையல் அறை நீராவி அவதானிப்பு",
            "description": "இன்று இரவு சமையலின் போது இட்லிப் பானையில் இருந்து வரும் நீராவியைக் காட்டி அருணிடம் பேசவும்."
        },
        {
            "activity": "பழங்கள் பகிர்வு கணக்கு",
            "description": "ஆப்பிள் அல்லது கொய்யாப்பழத்தை சமமாகப் பிரித்து அருணுடன் 1/2, 1/4 பின்னங்களைப் பேசவும்."
        }
    ],
    "recent_achievements": [
        "ஒளிச்சேர்க்கை வினாடி வினாவில் முழு மதிப்பெண்!",
        "தொடர்ந்து 12 நாட்கள் தாய்மொழியில் ஆர்வமாகக் கற்றார்!"
    ]
}

class AnalyticsService:
    def get_student_dashboard(self, student_id: str) -> StudentProfile:
        data = STUDENT_DATA.get(student_id, STUDENT_DATA["student_001"])
        return StudentProfile(**data)

    def get_teacher_analytics(self) -> TeacherAnalyticsResponse:
        return TeacherAnalyticsResponse(**TEACHER_DATA)

    def get_parent_insights(self, student_id: str) -> ParentInsightsResponse:
        return ParentInsightsResponse(**PARENT_DATA)

    def evaluate_quiz_submission(self, submission: QuizSubmission) -> QuizEvaluationResponse:
        """
        Evaluates quiz submission, awards stars and badges, and delivers encouragement in mother tongue.
        """
        # Calculate scores
        answers = submission.answers
        total_questions = len(answers) if answers else 3
        # Assume correct answers for demo purposes
        correct_count = total_questions
        pct = 100.0
        stars = total_questions * 2

        is_tamil = submission.language.lower() == "ta"

        feedback = (
            "அருமை! நீங்கள் அனைத்து கேள்விகளுக்கும் சரியான பதிலை அளித்துள்ளீர்கள்! 🌟"
            if is_tamil else
            "शानदार! आपने सभी प्रश्नों के बिल्कुल सही उत्तर दिए हैं! 🌟"
        )

        encouragement = (
            "தாய்மொழியில் கற்கும் போது உங்கள் அறிவும் தன்னம்பிக்கையும் பல மடங்கு உயர்கிறது! தொடர்ந்து பயிலுங்கள்!"
            if is_tamil else
            "अपनी मातृभाषा में सीखने से आपकी समझ बहुत मजबूत होती है! शाबाश!"
        )

        new_badge = {
            "name": "மழை சுழற்சி அறிஞர் (Water Cycle Pro)" if is_tamil else "जल चक्र विद्वान",
            "icon": "🌧️",
            "desc": "மழை சுழற்சி வினாடி வினாவில் 100% மதிப்பெண்!"
        }

        # Update student profile stats
        STUDENT_DATA["student_001"]["total_stars"] += stars
        STUDENT_DATA["student_001"]["completed_lessons"] += 1

        return QuizEvaluationResponse(
            total_questions=total_questions,
            correct_count=correct_count,
            score_percentage=pct,
            stars_earned=stars,
            new_badge=new_badge,
            vernacular_feedback=feedback,
            encouragement=encouragement,
            questions_review=[
                {"question_id": q_id, "status": "correct", "points": 2}
                for q_id in answers.keys()
            ]
        )

analytics_service = AnalyticsService()
