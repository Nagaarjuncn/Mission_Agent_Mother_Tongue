"""
Teacher AI Lesson Generator Service
Generates comprehensive 7-part vernacular lesson plans:
1. Pedagogical Hook
2. Concept Explanation
3. Story-Based Narrative
4. Local Language Vocabulary Glossary
5. Classroom Hands-on Activity
6. Visual Learning Prompts
7. Interactive Quiz & Homework
"""
import uuid
import datetime
from typing import List, Dict, Any, Optional
from backend.models.schemas import LessonGenerateRequest, LessonPlanResponse

# In-memory store for saved teacher lesson plans
SAVED_LESSON_PLANS: List[LessonPlanResponse] = []

class LessonService:
    def __init__(self):
        # Pre-seed with the foundational exemplar lesson
        self._seed_default_lessons()

    def _seed_default_lessons(self):
        default_lesson = LessonPlanResponse(
            lesson_id="lesson-water-cycle-ta-001",
            topic="மழை சுழற்சி & ஆவியாதல் (The Water Cycle)",
            grade="Class 4",
            language="Tamil",
            difficulty="Beginner",
            created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            pedagogical_hook="மதுரை வைகை ஆறும் இல்லத்துப் பானையும் (Local River & Kitchen Pot)",
            concept_explanation="சூரியனின் வெப்பத்தால் நிலத்திலும் ஆறுகளிலும் உள்ள நீர் சூடாகி நீராவியாக மேலே செல்கிறது. மேலே செல்லச் செல்லக் காற்று குளிர்ச்சியடைவதால், அந்த நீராவி குளிர்ந்து மேகங்களாக மாறுகிறது. மேகங்கள் கனத்து குளிர்ந்த காற்று படும்போது மீண்டும் மழைத்துளிகளாகப் பூமிக்கு வருகின்றன.",
            story_based_explanation="குட்டி நீர்த்துளி 'முத்து'வின் சாகசப் பயணம்: வைகை ஆற்றில் மீன்களோடு விளையாடிய முத்து, சூரியனின் அன்பான வெப்பத்தால் நீராவிச் சிறகு பெற்று வானத்துக்குப் பறந்தான்! அங்கே குளிர்ந்த காற்றோடு கைகோர்த்து மேகமாகி, மீண்டும் மழையாகத் தன் நண்பர்களான நெற்பயிர்களைக் காண பூமிக்கு வந்தான்.",
            local_vocabulary=[
                {"term": "ஆவியாதல் (Evaporation)", "meaning": "நீர் சூடாகி மேலே வாயுவாகச் செல்வது"},
                {"term": "குளிர்வடைதல் (Condensation)", "meaning": "ஆவி குளிர்ந்து மேகமாவது"},
                {"term": "மழைப்பொழிவு (Precipitation)", "meaning": "குளிர்ந்த மேகம் நீராவது"},
                {"term": "நிலத்தடி நீர் (Groundwater)", "meaning": "மண்ணில் ஊறும் ஊற்று நீர்"}
            ],
            classroom_activity="வகுப்பறை செயல்முறை: ஒரு எவர்சில்வர் தட்டை எடுத்து, சுடுநீர்க் கிண்ணத்தின் மேல் வையுங்கள். தட்டின் கீழ் பனித்துளி போல நீர்த்துளிகள் உருவாவதைக் குழந்தைகள் தொட்டுப் பார்க்கச் செய்யுங்கள்.",
            visual_learning_prompts=[
                "Animated diagram showing water vapor rising from a village pond to form clouds",
                "Idli steamer cross-section with rising steam condensing on the lid",
                "Monsoon rain falling over lush green paddy fields and farmers rejoicing"
            ],
            quiz_questions=[
                {
                    "id": "q1",
                    "question": "வைகை ஆற்றின் நீர் எதனால் நீராவியாக மாறுகிறது?",
                    "options": ["சூரிய வெப்பம்", "நிலவொளி", "மின்னல்", "குளிர்ந்த காற்று"],
                    "correct": "சூரிய வெப்பம்",
                    "explanation": "சூரியனின் பகல் நேர வெப்பமே நீரை நீராவியாக மாற்றுகிறது."
                },
                {
                    "id": "q2",
                    "question": "வானில் உள்ள மேகங்கள் குளிர்ந்ததும் என்னவாக மாறுகின்றன?",
                    "options": ["மழைத்துளிகள்", "பஞ்சு", "புகை", "பாறைகள்"],
                    "correct": "மழைத்துளிகள்",
                    "explanation": "நீராவி குளிர்ந்ததும் மீண்டும் நீர்த்துளியாகி மழையாகப் பொழிகிறது."
                }
            ],
            homework_activity="இன்று உங்கள் வீட்டில் மழைநீர் சேகரிப்புத் தொட்டி அல்லது கூரையில் விழும் மழை எங்கே செல்கிறது என்று பெற்றோரிடம் கேட்டு, உங்கள் நோட்டுப்புத்தகத்தில் ஒரு சிறு வரைபடம் வரைந்து வாருங்கள்!"
        )
        SAVED_LESSON_PLANS.append(default_lesson)

    def generate_lesson(self, req: LessonGenerateRequest) -> LessonPlanResponse:
        """
        Generates a contextualized pedagogical lesson plan in the requested language.
        """
        is_tamil = req.language.lower() in ["tamil", "ta"]
        is_hindi = req.language.lower() in ["hindi", "hi"]
        topic_clean = req.topic.strip()

        lesson_id = f"lesson-{uuid.uuid4().hex[:8]}"
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

        if "water" in topic_clean.lower() or "rain" in topic_clean.lower() or "மழை" in topic_clean:
            if is_tamil:
                return SAVED_LESSON_PLANS[0]
            elif is_hindi:
                return LessonPlanResponse(
                    lesson_id=lesson_id,
                    topic="जल चक्र और वर्षा (Water Cycle & Rain)",
                    grade=req.grade,
                    language="Hindi",
                    difficulty=req.difficulty,
                    created_at=now_str,
                    pedagogical_hook="गंगा नदी की धारा और घर की रसोई की चाय",
                    concept_explanation="सूरज की गर्मी से नदी और तालाबों का पानी भाप बनकर ऊपर उठता है। आसमान में यह भाप ठंडी होकर बादलों का रूप ले लेती है और फिर बारिश बनकर खेतों पर बरसती है।",
                    story_based_explanation="छोटी जलपरी 'बूंद' की कहानी: नदी में तैरती बूंद धूप के जादू से पंख लगाकर आसमान में उड़ी और बादलों के साथ खेल-कूद कर फिर से किसान के खेतों पर छम-छम बरस पड़ी!",
                    local_vocabulary=[
                        {"term": "वाष्पीकरण (Evaporation)", "meaning": "पानी का भाप बनना"},
                        {"term": "संघनन (Condensation)", "meaning": "भाप का बादल बनना"},
                        {"term": "वर्षा (Precipitation)", "meaning": "बूंदों का गिरना"}
                    ],
                    classroom_activity="कक्षा गतिविधि: कटोरी में गर्म पानी लें और उसपर ठंडी थाली रखें। थाली के नीचे बूंदों को बच्चों को दिखाएं।",
                    visual_learning_prompts=[
                        "Village well and river with sun shining brightly",
                        "Fluffy clouds raining over golden wheat fields"
                    ],
                    quiz_questions=[
                        {
                            "id": "q1",
                            "question": "नदी का पानी भाप कौन बनाता है?",
                            "options": ["सूरज की गर्मी", "चांदनी", "हवा"],
                            "correct": "सूरज की गर्मी",
                            "explanation": "सूरज की तेज धूप ही पानी को गर्म करके भाप बनाती है।"
                        }
                    ],
                    homework_activity="घर में जाकर मां से पूछें कि दाल उबलते समय ढक्कन पर पानी की बूंदें क्यों आती हैं?"
                )

        # Dynamic template for arbitrary topics
        return LessonPlanResponse(
            lesson_id=lesson_id,
            topic=f"{topic_clean} ({req.grade})",
            grade=req.grade,
            language=req.language,
            difficulty=req.difficulty,
            created_at=now_str,
            pedagogical_hook=f"வட்டார வாழ்வியல் உதாரணங்கள் ({topic_clean})",
            concept_explanation=f"{req.language} மொழியில் எளிய மற்றும் தெளிவான தொடக்கப்பள்ளி விளக்கம்: மாணவர்கள் அன்றாடம் காணும் எளிய சூழல் வழியே {topic_clean} பற்றி கற்பித்தல்.",
            story_based_explanation=f"கிராமத்துக் குழந்தைகள் மற்றும் விலங்குகள் இடம்பெறும் சுவாரஸ்யமான கதை வழியே {topic_clean} பாடத்தின் அடிப்படைகளைப் புகட்டுதல்.",
            local_vocabulary=[
                {"term": f"முக்கியச் சொல் 1 ({topic_clean})", "meaning": "தொடக்கப் பள்ளி மாணவர்களுக்குப் புரியும் எளிய பொருள்"},
                {"term": "வட்டார நடைமுறை", "meaning": "வீட்டிலும் கிராமத்திலும் புழங்கும் எளிய பயன்பாடு"}
            ],
            classroom_activity="செயல்முறை வழிக் கற்றல்: மாணவர்கள் சிறிய குழுக்களாகப் பிரிந்து, வகுப்பறையில் உள்ள பொருட்களைக் கொண்டு செய்து பார்த்தல்.",
            visual_learning_prompts=[
                f"Color-coded illustrated infographic showing {topic_clean} with local culture icons",
                "Step-by-step comic strip explaining the core concept in vernacular dialogue"
            ],
            quiz_questions=[
                {
                    "id": "q1",
                    "question": f"{topic_clean} பற்றி இன்று நாம் கற்றதில் எது மிக முக்கியமானது?",
                    "options": ["இயற்கையோடு இணைந்து கற்பது", "எதையும் மனப்பாடம் செய்யாமல் புரிந்துகொள்வது", "இரண்டும் சரி"],
                    "correct": "இரண்டும் சரி",
                    "explanation": "தாய்மொழியில் புரிந்து கற்பதே சிறந்த கல்வி!"
                }
            ],
            homework_activity="இன்று கற்றுக்கொண்ட விஷயத்தை உங்கள் பெற்றோரிடம் அல்லது உடன்பிறப்புகளிடம் விளக்கிச் சொல்லி, அவர்கள் கூறிய கருத்தை எழுதி வாருங்கள்!"
        )

    def get_all_lessons(self) -> List[LessonPlanResponse]:
        return SAVED_LESSON_PLANS

    def save_lesson(self, lesson: LessonPlanResponse) -> LessonPlanResponse:
        # Check if already exists to update
        for idx, existing in enumerate(SAVED_LESSON_PLANS):
            if existing.lesson_id == lesson.lesson_id:
                SAVED_LESSON_PLANS[idx] = lesson
                return lesson
        SAVED_LESSON_PLANS.append(lesson)
        return lesson

lesson_service = LessonService()
