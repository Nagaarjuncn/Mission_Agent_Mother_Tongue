"""
Pydantic Schemas for VernacLearn API
Strongly typed models for translation, pedagogy, tutor conversations,
lesson generation, quizzes, and analytics dashboards.
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field, model_validator

# ==========================================
# 1. Translation Schemas
# ==========================================
class TranslationRequest(BaseModel):
    text: str = Field(default="", description="Sentence or passage to translate", json_schema_extra={"example": "Plants need sunlight to grow."})
    source_lang: str = Field(default="en", description="Source language code (e.g. en, ta, hi)")
    target_lang: str = Field(default="ta", description="Target language code (e.g. ta, te, hi, bn)")
    generate_explanation: bool = Field(default=True, description="Whether to include child-friendly explanation")
    student_grade: Optional[str] = Field(default="Class 3", description="Target grade for vocabulary calibration")

    @model_validator(mode="before")
    @classmethod
    def normalize_translation_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            text = data.get("text") or data.get("query") or data.get("input") or ""
            target = data.get("target_lang") or data.get("targetLang") or data.get("language") or data.get("lang") or "ta"
            source = data.get("source_lang") or data.get("sourceLang") or "en"
            data["text"] = text
            data["target_lang"] = target
            data["source_lang"] = source
        return data

class TranslationResponse(BaseModel):
    source_text: str
    source_lang: str
    target_lang: str
    target_lang_name: str
    target_lang_native: str
    translated_text: str
    child_explanation: str
    phonetic_pronunciation: Optional[str] = None
    speech_code: str
    confidence_score: float = 0.98
    source: str = "vernaclearn-ai-engine"
    auto_speak_lady_voice: bool = True
    voice_profile: Optional[Dict[str, Any]] = None

# ==========================================
# 2. Localized Pedagogy Engine Schemas
# ==========================================
class PedagogyExplainRequest(BaseModel):
    concept_or_question: Optional[str] = Field(default=None, json_schema_extra={"example": "Why does rain fall from the sky?"})
    concept: Optional[str] = None
    query: Optional[str] = None
    target_lang: Optional[str] = Field(default="ta", json_schema_extra={"example": "ta"})
    language: Optional[str] = None
    lang: Optional[str] = None
    grade: str = Field(default="Class 4", json_schema_extra={"example": "Class 4"})
    cultural_region: Optional[str] = Field(default="South India", json_schema_extra={"example": "South India / Tamil Nadu"})

    @model_validator(mode="before")
    @classmethod
    def normalize_pedagogy_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            q = data.get("concept_or_question") or data.get("concept") or data.get("query") or data.get("text") or "Why does rain fall from the sky?"
            l = data.get("target_lang") or data.get("language") or data.get("lang") or "ta"
            data["concept_or_question"] = q
            data["target_lang"] = l
        return data

class PedagogyExplainResponse(BaseModel):
    concept_id: str
    topic: str
    category: str
    grade: str
    target_lang: str
    target_lang_name: str
    speech_code: str
    literal_translation: str
    phonetic_pronunciation: str
    pedagogy_title: str
    vernacular_explanation: str
    local_metaphor: str
    cultural_context_hook: str
    cultural_keywords: List[Dict[str, str]]
    familiar_objects_used: List[str]
    quick_quiz: Dict[str, Any]
    auto_speak_lady_voice: bool = True
    voice_profile: Optional[Dict[str, Any]] = None

# ==========================================
# 3. AI Vernacular Tutor ("Mitra") Schemas
# ==========================================
class TutorChatMessage(BaseModel):
    role: str = Field(..., json_schema_extra={"example": "user"}) # "user" | "assistant" | "system"
    content: str = Field(..., json_schema_extra={"example": "சூரியன் ஏன் காலையில் உதிக்கிறது?"})

class TutorChatRequest(BaseModel):
    student_id: Optional[str] = "student_001"
    student_name: Optional[str] = "Arun"
    grade: Optional[str] = "Class 3"
    target_lang: str = Field(default="ta", json_schema_extra={"example": "ta"})
    message: str = Field(default="Hello Mitra", json_schema_extra={"example": "தாவரங்கள் எப்படி உணவு தயாரிக்கின்றன?"})
    history: Optional[List[TutorChatMessage]] = []
    current_topic: Optional[str] = "Science - Photosynthesis"
    difficulty_level: Optional[str] = "Beginner" # Beginner, Intermediate, Advanced

    @model_validator(mode="before")
    @classmethod
    def normalize_tutor_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            msg = data.get("message") or data.get("text") or data.get("query") or "Hello Mitra"
            lang = data.get("target_lang") or data.get("language") or data.get("lang") or "ta"
            data["message"] = msg
            data["target_lang"] = lang
        return data

class TutorChatResponse(BaseModel):
    reply_text: str
    reply_speech_code: str
    phonetic_guide: Optional[str] = None
    emotion: str = "encouraging" # happy, encouraging, curious, celebrating, guiding
    interactive_question: Optional[str] = None
    hint_available: bool = True
    hint_text: Optional[str] = None
    suggested_quick_replies: List[str] = []
    stars_awarded: int = 0
    detected_misconception: Optional[str] = None
    detected_source_lang: Optional[str] = None
    source_lang_name: Optional[str] = None
    translated_input_text: Optional[str] = None
    input_was_converted: bool = False
    original_input_text: Optional[str] = None


class TutorHintRequest(BaseModel):
    topic: str
    question: str
    student_attempt: Optional[str] = None
    target_lang: str = "ta"
    hint_level: int = 1 # 1: gentle nudge, 2: local metaphor clue, 3: near-answer guidance

class TutorHintResponse(BaseModel):
    hint_level: int
    hint_text: str
    local_clue: str
    encouragement: str

# ==========================================
# 4. Teacher AI Lesson Generator Schemas
# ==========================================
class LessonGenerateRequest(BaseModel):
    topic: str = Field(..., json_schema_extra={"example": "The Water Cycle"})
    grade: str = Field(default="Class 4", json_schema_extra={"example": "Class 4"})
    language: str = Field(default="Tamil", json_schema_extra={"example": "Tamil"})
    difficulty: str = Field(default="Beginner", json_schema_extra={"example": "Beginner"})
    context_notes: Optional[str] = Field(default="", json_schema_extra={"example": "Emphasize local river and monsoon"})

class LessonPlanResponse(BaseModel):
    lesson_id: str
    topic: str
    grade: str
    language: str
    difficulty: str
    created_at: str
    pedagogical_hook: str
    concept_explanation: str
    story_based_explanation: str
    local_vocabulary: List[Dict[str, str]]
    classroom_activity: str
    visual_learning_prompts: List[str]
    quiz_questions: List[Dict[str, Any]]
    homework_activity: str

class LessonSaveRequest(BaseModel):
    lesson: LessonPlanResponse

# ==========================================
# 5. Voice & Speech Schemas
# ==========================================
class SpeechSynthesisRequest(BaseModel):
    text: str = Field(..., json_schema_extra={"example": "தாவரங்கள் வளர சூரிய ஒளி தேவை."})
    lang_code: str = Field(default="ta", json_schema_extra={"example": "ta"})
    speed: float = 0.9 # Slightly slower for primary kids
    pitch: float = 1.1 # Friendly pitch

class SpeechSynthesisResponse(BaseModel):
    text: str
    lang_code: str
    speech_code: str
    phonetic_text: str
    audio_type: str = "browser_speech_synthesis_spec"
    voice_accent_profile: Dict[str, Any]

class SpeechTranscribeRequest(BaseModel):
    audio_base64: Optional[str] = None
    text_transcript: Optional[str] = None
    expected_lang: str = "ta"

class SpeechTranscribeResponse(BaseModel):
    transcript: str
    detected_lang: str
    confidence: float
    pronunciation_score: Optional[int] = 95
    encouraging_feedback: str

class LanguageDetectRequest(BaseModel):
    text: str = Field(..., json_schema_extra={"example": "Plants need sunlight to grow."})

class LanguageDetectResponse(BaseModel):
    detected_lang: str
    language_name: str
    native_name: str
    flag: str
    confidence: float
    speech_code: str
    detected_script: str

# ==========================================
# 6. Interactive Quizzes & Activities
# ==========================================
class QuizQuestion(BaseModel):
    id: str
    type: str = "mcq" # mcq, drag_drop, picture_match, voice_answer
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: str
    badge_reward: str

class QuizSubmission(BaseModel):
    quiz_id: str
    student_id: str = "student_001"
    answers: Dict[str, Any]
    language: str = "ta"

class QuizEvaluationResponse(BaseModel):
    total_questions: int
    correct_count: int
    score_percentage: float
    stars_earned: int
    new_badge: Optional[Dict[str, str]] = None
    vernacular_feedback: str
    encouragement: str
    questions_review: List[Dict[str, Any]]

# ==========================================
# 7. Student, Teacher & Parent Dashboards
# ==========================================
class StudentProfile(BaseModel):
    student_id: str
    name: str
    grade: str
    mother_tongue: str
    mother_tongue_code: str
    learning_streak_days: int
    total_stars: int
    completed_lessons: int
    average_quiz_score: float
    subjects: List[Dict[str, Any]]
    recent_badges: List[Dict[str, str]]
    recommended_lessons: List[Dict[str, Any]]

class TeacherAnalyticsResponse(BaseModel):
    class_name: str
    total_students: int
    active_today: int
    average_class_score: float
    language_distribution: List[Dict[str, Any]]
    misunderstood_concepts: List[Dict[str, Any]]
    weekly_learning_trend: List[Dict[str, Any]]
    student_roster: List[Dict[str, Any]]

class ParentInsightsResponse(BaseModel):
    student_name: str
    mother_tongue: str
    total_time_spent_mins: int
    lessons_completed_this_week: int
    overall_accuracy_pct: int
    current_streak_days: int
    strengths: List[str]
    areas_needing_attention: List[str]
    simple_home_activities: List[Dict[str, str]]
    recent_achievements: List[str]

# ==========================================
# 8. Hackathon Live Demo Orchestrator
# ==========================================
class DemoFlowRequest(BaseModel):
    language: str = "ta"
    question: str = "Why does rain fall from the sky?"
    student_name: str = "Kavitha"
    grade: str = "Class 4"

class DemoFlowResponse(BaseModel):
    step_1_voice_input: Dict[str, Any]
    step_2_ai_translation: Dict[str, Any]
    step_3_vernacular_pedagogy: Dict[str, Any]
    step_4_interactive_mini_quiz: Dict[str, Any]
    step_5_evaluation_and_rewards: Dict[str, Any]
    step_6_dashboard_state_update: Dict[str, Any]
    core_mission_statement: str = "Language should never be a barrier to understanding."
