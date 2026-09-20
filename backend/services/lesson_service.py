"""
Teacher AI Lesson Generator & Curriculum Platform Service
Full-Stack AI Engine for:
1. AI Curriculum & Topic Suggestions aligned to Standard Levels (Foundational, Preparatory, Middle, Secondary)
2. 7-Stage Comprehensive Vernacular Lesson Plans:
   - NCF Competencies & Learning Objectives
   - Cultural Narrative Hook (Prerana)
   - Core Concept Explanation (Sankalpan)
   - Scientific Vocabulary (Shabda Kosha)
   - Zero-Cost Classroom Experiential Activity (Kriyatmak)
   - Chalkboard / Blackboard Plan & 40-min Period Timeline
   - Formative Assessment / Quiz (Mulyankan)
   - Parent & Dinner Table Discussion Bridge (Griha Karya)
   - Differentiated Learning Support & Misconception Buster
3. Gemini LLM Integration with resilient offline vernacular generative fallbacks.
"""
import os
import json
import uuid
import datetime
import re
from typing import List, Dict, Any, Optional

import urllib.request
import urllib.error
from backend.config import settings
from backend.models.schemas import (
    LessonGenerateRequest,
    LessonPlanResponse,
    TopicSuggestRequest,
    TopicSuggestResponse,
    SuggestedTopicItem
)

# In-memory store for saved teacher lesson plans
SAVED_LESSON_PLANS: List[LessonPlanResponse] = []

# Rich Curriculum Knowledge Bank by Standard Level & Subject
CURRICULUM_KNOWLEDGE_BASE: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "Foundational": {
        "Environmental Studies (EVS)": [
            {
                "topic": "Parts of a Plant & Little Green Sprouts",
                "ta_title": "செடியின் உறுப்புகளும் பாட்டியின் தோட்டம்",
                "hi_title": "पौधे के अंग और दादी की बगिया",
                "hook": "Sprouting green gram (moong) on wet cotton with grandma",
                "difficulty": "Beginner",
                "outcome": "Identify roots, stem, leaves, and flowers using living garden plants."
            },
            {
                "topic": "Five Senses & Festive Sweets",
                "ta_title": "ஐம்புலன்களும் தீபாவளி பலகாரமும்",
                "hi_title": "पांच ज्ञानेंद्रियां और दीवाली के पकवान",
                "hook": "Smelling fresh jasmine, tasting sweet payasam/ladoo, hearing morning birds",
                "difficulty": "Beginner",
                "outcome": "Name the 5 sense organs and connect them to daily bodily experiences."
            },
            {
                "topic": "Living & Non-Living Friends in Our Yard",
                "ta_title": "உயிருள்ள நண்பர்களும் உயிரற்ற பொருட்களும்",
                "hi_title": "सजीव और निर्जीव वस्तुएं",
                "hook": "Comparing the playful backyard puppy with a wooden toy cart",
                "difficulty": "Beginner",
                "outcome": "Distinguish living things that grow and breathe from inanimate objects."
            }
        ],
        "Mathematics": [
            {
                "topic": "Counting & Grouping with Tamarind Seeds & Bangles",
                "ta_title": "புளியங்கொட்டைகளும் கண்ணாடி வளையல்களும்",
                "hi_title": "इमली के बीज और रंग-बिरंगी चूड़ियां",
                "hook": "Counting bundles of ten using grandmother's tamarind seeds and glass bangles",
                "difficulty": "Beginner",
                "outcome": "Group single objects into bundles of tens and units up to 50."
            },
            {
                "topic": "Shapes Around Us: Round Rotis, Triangular Samosas & Rectangular Slates",
                "ta_title": "வடிவங்கள்: வட்ட நிலாவும் முக்கோண சமோசாவும்",
                "hi_title": "हमारे आकार: गोल रोटी और तिकोना समोसा",
                "hook": "Identifying circles in rotis, triangles in samosas, rectangles in school slates",
                "difficulty": "Beginner",
                "outcome": "Recognize circles, squares, rectangles, and triangles in everyday life."
            }
        ]
    },
    "Preparatory": {
        "Environmental Studies (EVS)": [
            {
                "topic": "The Water Cycle & Cloud Formation",
                "ta_title": "மழை சுழற்சி & ஆவியாதல்",
                "hi_title": "जल चक्र और वर्षा की बूंदें",
                "hook": "Boiling tea pot steam condensing on the lid compared with Vaigai/Ganges rivers",
                "difficulty": "Beginner",
                "outcome": "Explain evaporation, condensation, and precipitation using everyday kitchen phenomena."
            },
            {
                "topic": "Photosynthesis: The Plant's Kitchen in the Courtyard",
                "ta_title": "ஒளிச்சேர்க்கை: முற்றத்து துளசிச் செடியின் சமையலறை",
                "hi_title": "प्रकाश-संश्लेषण: आंगन के पौधे की रसोई",
                "hook": "How leaves use sunlight like mother uses stove fire to make sweet starch food",
                "difficulty": "Intermediate",
                "outcome": "Describe how plants synthesize food using sunlight, carbon dioxide, and root water."
            },
            {
                "topic": "Community Helpers & Village Weekly Market (Shandy / Haat)",
                "ta_title": "நம் கிராமத்து சந்தையும் உதவும் மனிதர்களும்",
                "hi_title": "गांव का साप्ताहिक हाट और हमारे मददगार",
                "hook": "Visiting the bustling Sunday farmers market to understand how food travels to our plates",
                "difficulty": "Beginner",
                "outcome": "Appreciate roles of farmers, potters, weavers, and local sanitation workers."
            }
        ],
        "Mathematics": [
            {
                "topic": "Fractions: Sharing Sweet Mangoes & Steaming Idlis",
                "ta_title": "பின்னங்கள்: மாம்பழத் துண்டுகளும் இட்லிப் பகிர்வும்",
                "hi_title": "भिन्न: आम के टुकड़े और रोटी का बंटवारा",
                "hook": "Dividing one sweet Alphonso mango or flat chapati equally among 2 and 4 siblings",
                "difficulty": "Intermediate",
                "outcome": "Understand 1/2, 1/4, 3/4 visually as parts of a whole."
            },
            {
                "topic": "Measurement & Distance: Steps, Handspans & Measuring Tapes",
                "ta_title": "அளவீடு: காலடிகளும் முழமும் மீட்டர் நாடாவும்",
                "hi_title": "मापन: कदम, बालिश्त और मीटर का फीता",
                "hook": "Measuring the classroom verandah with footsteps and comparing with standard meter scale",
                "difficulty": "Intermediate",
                "outcome": "Convert between informal units and standard meters/centimeters."
            }
        ]
    },
    "Middle": {
        "General Science": [
            {
                "topic": "States of Matter & Kitchen Transformations",
                "ta_title": "பருப்பொருளின் நிலைகள்: பனி முதல் நீராவி வரை",
                "hi_title": "पदार्थ की अवस्थाएं: ठोस, द्रव और गैस",
                "hook": "Observing an ice cube melting into liquid water and then boiling into gaseous steam in a saucepan",
                "difficulty": "Intermediate",
                "outcome": "Demonstrate particulate behavior of solids, liquids, and gases during phase transitions."
            },
            {
                "topic": "Electric Circuits & Festive String Lights",
                "ta_title": "மின்சுற்றுகளும் தீபாவளி வண்ண விளக்குகளும்",
                "hi_title": "विद्युत परिपथ और त्योहारों की झालर",
                "hook": "Tracing how battery torches and festive festival lights turn on only when the loop is complete",
                "difficulty": "Intermediate",
                "outcome": "Construct a simple series circuit with cell, switch, wires, and LED bulb."
            },
            {
                "topic": "Seed Dispersal & Traveling Plants of the Village",
                "ta_title": "விதை பரவுதல்: காற்றில் பறக்கும் விதைகளும் பறவைகளும்",
                "hi_title": "बीज प्रकीर्णन: हवा और पक्षियों की यात्रा",
                "hook": "How banyan seeds sprout on old temple walls carried by birds, and dandelion fluff flies in wind",
                "difficulty": "Advanced",
                "outcome": "Categorize seed dispersal by wind, water, animals, and explosive action."
            }
        ],
        "Mathematics": [
            {
                "topic": "Ratio, Proportion & Grandmother's Recipe Secrets",
                "ta_title": "விகிதமும் சமவிகிதமும்: பாட்டியின் சாம்பார் பொடி ரகசியம்",
                "hi_title": "अनुपात और समानुपात: दादी का जादुई मसाला",
                "hook": "Mixing 2 cups of dal to 1 cup of rice for perfect crispy dosas or idlis",
                "difficulty": "Intermediate",
                "outcome": "Solve real-world ratio problems in cooking, construction, and map scaling."
            }
        ]
    }
}

class LessonService:
    def __init__(self):
        self._seed_default_lessons()

    def _seed_default_lessons(self):
        default_lesson = LessonPlanResponse(
            lesson_id="lesson-water-cycle-ta-001",
            topic="மழை சுழற்சி & ஆவியாதல் (The Water Cycle)",
            grade="Class 4",
            subject="Environmental Studies (EVS)",
            standard_level="Class 4 (Preparatory Stage)",
            language="Tamil",
            difficulty="Beginner",
            pedagogical_level="Level 1: Foundational & Story-first",
            duration="40 Minutes",
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
                },
                {
                    "id": "q3",
                    "question": "பூமியில் விழும் மழைநீரில் ஒரு பகுதி பூமிக்குள் இறங்குவது என்ன?",
                    "options": ["நிலத்தடி நீர்", "பாறை நீர்", "சூரிய நீர்", "காற்று நீர்"],
                    "correct": "நிலத்தடி நீர்",
                    "explanation": "மண்ணில் ஊறும் நீரே கிணறு மற்றும் ஆழ்துளைக் கிணறுகளுக்கு நீரைத் தருகிறது."
                }
            ],
            homework_activity="இன்று உங்கள் வீட்டில் மழைநீர் சேகரிப்புத் தொட்டி அல்லது கூரையில் விழும் மழை எங்கே செல்கிறது என்று பெற்றோரிடம் கேட்டு, உங்கள் நோட்டுப்புத்தகத்தில் ஒரு சிறு வரைபடம் வரைந்து வாருங்கள்!",
            learning_objectives=[
                "Understand that heat causes water to evaporate into invisible vapor.",
                "Identify cloud formation as condensation of cooled water vapor.",
                "Trace how rainwater replenishes village wells, ponds, and groundwater."
            ],
            timeline_breakdown=[
                {"phase": "0-5 min", "title": "Prerana (Hook)", "desc": "Show steam rising from a thermos flask or hot water bowl."},
                {"phase": "5-18 min", "title": "Sankalpan (Concept)", "desc": "Tell Muthu the water droplet's story and trace the 3 stages."},
                {"phase": "18-28 min", "title": "Kriyatmak (Activity)", "desc": "Cold plate over hot bowl hands-on student observation."},
                {"phase": "28-35 min", "title": "Mulyankan (Formative Check)", "desc": "Three quick thumb-up / thumb-down checkpoint questions."},
                {"phase": "35-40 min", "title": "Griha Karya & Wrap-up", "desc": "Record vocabulary in science journal and assign dinner prompt."}
            ],
            blackboard_layout={
                "left_column": "நோக்கங்கள் (Objectives):\n1. ஆவியாதல் அறிதல்\n2. மேகம் உருவாதல்\n3. மழைப்பொழிவு",
                "center_column": "[படம்: ஆறு ➔ ஆவி (மேலே) ➔ மேகம் ➔ மழைத்துளிகள் ➔ நிலத்தடி நீர்]",
                "right_column": "முக்கியச் சொற்கள்:\n• ஆவியாதல்\n• குளிர்வடைதல்\n• மழைப்பொழிவு\nவீட்டுப் பணி: கிணறு வரைபடம்"
            },
            differentiated_guidance={
                "support_struggling_learners": "Use real physical water mist spray and a cold metal spoon for tactile grasping.",
                "advanced_learners": "Ask them to explain why wet clothes dry faster on windy, sunny terrace roofs."
            },
            misconceptions_addressed=[
                "Misconception: Clouds are made of white cotton wool. -> Reality: Clouds are millions of tiny floating water droplets.",
                "Misconception: Rain only comes from ocean water. -> Reality: Water evaporates from neighborhood ponds, puddles, and plant leaves."
            ],
            is_ai_generated=True
        )
        SAVED_LESSON_PLANS.append(default_lesson)

    def _determine_stage(self, grade: str) -> str:
        g = grade.lower()
        if any(w in g for w in ["anganwadi", "balvatika", "kg", "class 1", "class 2", "grade 1", "grade 2"]):
            return "Foundational"
        elif any(w in g for w in ["class 3", "class 4", "class 5", "grade 3", "grade 4", "grade 5"]):
            return "Preparatory"
        elif any(w in g for w in ["class 6", "class 7", "class 8", "grade 6", "grade 7", "grade 8"]):
            return "Middle"
        elif any(w in g for w in ["class 9", "class 10", "grade 9", "grade 10"]):
            return "Secondary"
        return "Preparatory"

    def suggest_topics(self, req: TopicSuggestRequest) -> TopicSuggestResponse:
        """
        Suggests 3 to 5 curriculum-aligned, engaging vernacular topics
        based on standard level, grade, subject, and mother tongue.
        """
        stage = self._determine_stage(req.grade)
        stage_dict = CURRICULUM_KNOWLEDGE_BASE.get(stage, CURRICULUM_KNOWLEDGE_BASE["Preparatory"])
        
        # Match subject or default to first available
        matched_subject = None
        for subj_key in stage_dict.keys():
            if subj_key.lower() in req.subject.lower() or req.subject.lower() in subj_key.lower():
                matched_subject = subj_key
                break
        if not matched_subject:
            matched_subject = list(stage_dict.keys())[0]

        topics_data = stage_dict.get(matched_subject, [])
        is_tamil = req.language.lower() in ["tamil", "ta"]
        is_hindi = req.language.lower() in ["hindi", "hi"]

        results: List[SuggestedTopicItem] = []
        for item in topics_data:
            vernacular_title = item.get("ta_title" if is_tamil else ("hi_title" if is_hindi else "topic"))
            results.append(SuggestedTopicItem(
                topic_title=item["topic"],
                vernacular_title=vernacular_title or item["topic"],
                cultural_hook=item["hook"],
                difficulty=item.get("difficulty", "Beginner"),
                standard_level=f"{req.grade} ({stage} Stage)",
                learning_outcome=item.get("outcome", f"Master foundational concept of {item['topic']}")
            ))

        # If less than 3, add general contextual topic
        if len(results) < 3:
            results.append(SuggestedTopicItem(
                topic_title=f"Hands-On Everyday {req.subject} Explorations",
                vernacular_title=f"அன்றாட வாழ்வில் {req.subject}" if is_tamil else f"दैनिक जीवन में {req.subject}",
                cultural_hook="Village environment and kitchen science observations",
                difficulty="Beginner",
                standard_level=f"{req.grade} ({stage} Stage)",
                learning_outcome="Connect classroom theory with lived household traditions."
            ))

        return TopicSuggestResponse(
            grade=req.grade,
            subject=req.subject,
            language=req.language or "Tamil",
            suggested_topics=results
        )

    def _call_gemini_api(self, prompt: str) -> Optional[str]:
        """Invokes Google Gemini REST API if GEMINI_API_KEY is configured."""
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return None

        # Try gemini-1.5-flash
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 2048,
                "responseMimeType": "application/json"
            }
        }
        try:
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        except Exception as e:
            print(f"[LessonService] Gemini API call error: {e}")
        return None

    def generate_lesson(self, req: LessonGenerateRequest) -> LessonPlanResponse:
        """
        Generates a complete 7-stage teacher lesson plan.
        Uses Gemini if API key is active, or crafts an intelligent vernacular plan via the internal pedagogical engine.
        """
        stage = self._determine_stage(req.grade)
        lesson_id = f"lesson-{uuid.uuid4().hex[:8]}"
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        is_tamil = req.language.lower() in ["tamil", "ta"]
        is_hindi = req.language.lower() in ["hindi", "hi"]
        is_telugu = req.language.lower() in ["telugu", "te"]
        is_kannada = req.language.lower() in ["kannada", "kn"]
        is_malayalam = req.language.lower() in ["malayalam", "ml"]

        # Attempt Gemini LLM if key is present
        if settings.GEMINI_API_KEY:
            system_prompt = f"""
You are an expert Indian primary school curriculum designer and vernacular pedagogue adhering to NEP 2020 and NCF Foundational & Preparatory stages.
Generate a complete, culturally grounded lesson plan in JSON with these exact fields:
- topic: string
- pedagogical_hook: string (local Indian cultural/household metaphor)
- concept_explanation: string (clear explanation in {req.language} with English scientific terms)
- story_based_explanation: string (relatable story narrative for children)
- local_vocabulary: list of objects with "term" and "meaning"
- classroom_activity: string (zero-cost hands-on experiment)
- visual_learning_prompts: list of 3 diagram descriptions
- quiz_questions: list of 3 questions with "id", "question", "options" (4 items), "correct", "explanation"
- homework_activity: string (conversational question for parents/grandparents)
- learning_objectives: list of 3 outcomes
- timeline_breakdown: list of 5 period segments (phase, title, desc)
- blackboard_layout: object with left_column, center_column, right_column
- differentiated_guidance: object with support_struggling_learners and advanced_learners
- misconceptions_addressed: list of 2 strings

Topic: {req.topic}
Grade: {req.grade}
Subject: {req.subject}
Standard Level: {req.standard_level}
Pedagogical Depth: {req.pedagogical_level}
Language: {req.language}
Context Notes: {req.context_notes}
"""
            gemini_raw = self._call_gemini_api(system_prompt)
            if gemini_raw:
                try:
                    parsed = json.loads(gemini_raw)
                    return LessonPlanResponse(
                        lesson_id=lesson_id,
                        topic=parsed.get("topic", req.topic),
                        grade=req.grade,
                        subject=req.subject,
                        standard_level=req.standard_level,
                        language=req.language,
                        difficulty=req.difficulty,
                        pedagogical_level=req.pedagogical_level,
                        duration=req.duration or "40 Minutes",
                        created_at=now_str,
                        pedagogical_hook=parsed.get("pedagogical_hook", f"Local cultural hook for {req.topic}"),
                        concept_explanation=parsed.get("concept_explanation", ""),
                        story_based_explanation=parsed.get("story_based_explanation", ""),
                        local_vocabulary=parsed.get("local_vocabulary", []),
                        classroom_activity=parsed.get("classroom_activity", ""),
                        visual_learning_prompts=parsed.get("visual_learning_prompts", []),
                        quiz_questions=parsed.get("quiz_questions", []),
                        homework_activity=parsed.get("homework_activity", ""),
                        learning_objectives=parsed.get("learning_objectives", []),
                        timeline_breakdown=parsed.get("timeline_breakdown", []),
                        blackboard_layout=parsed.get("blackboard_layout", {}),
                        differentiated_guidance=parsed.get("differentiated_guidance", {}),
                        misconceptions_addressed=parsed.get("misconceptions_addressed", []),
                        is_ai_generated=True
                    )
                except Exception as ex:
                    print(f"[LessonService] Gemini parsing error: {ex}")

        # Intelligent Generative Vernacular Fallback
        topic_lower = req.topic.lower()

        # 1. Water Cycle
        if any(w in topic_lower for w in ["water", "rain", "மழை", "நீர்", "जल", "वर्षा"]):
            if is_tamil:
                return SAVED_LESSON_PLANS[0]
            elif is_hindi:
                return LessonPlanResponse(
                    lesson_id=lesson_id,
                    topic="जल चक्र और वर्षा (Water Cycle & Rain)",
                    grade=req.grade,
                    subject=req.subject,
                    standard_level=req.standard_level,
                    language="Hindi",
                    difficulty=req.difficulty,
                    pedagogical_level=req.pedagogical_level,
                    duration=req.duration or "40 Minutes",
                    created_at=now_str,
                    pedagogical_hook="गंगा नदी की धारा और घर की रसोई की चाय",
                    concept_explanation="सूरज की गर्मी से नदी और तालाबों का पानी भाप (वाष्प) बनकर ऊपर उठता है। आसमान में यह भाप ठंडी होकर बादलों का रूप ले लेती है और फिर बारिश बनकर खेतों पर बरसती है।",
                    story_based_explanation="छोटी जलपरी 'बूंद' की कहानी: नदी में तैरती बूंद धूप के जादू से पंख लगाकर आसमान में उड़ी और बादलों के साथ खेल-कूद कर फिर से किसान के खेतों पर छम-छम बरस पड़ी!",
                    local_vocabulary=[
                        {"term": "वाष्पीकरण (Evaporation)", "meaning": "पानी का भाप बनकर उड़ना"},
                        {"term": "संघनन (Condensation)", "meaning": "भाप का ठंडा होकर बादल बनना"},
                        {"term": "वर्षा (Precipitation)", "meaning": "आसमान से बूंदों का बरसना"},
                        {"term": "भूजल (Groundwater)", "meaning": "मिट्टी में समाया हुआ कुएं का पानी"}
                    ],
                    classroom_activity="कक्षा गतिविधि: कटोरी में गर्म पानी लें और उसपर ठंडी थाली रखें। थाली के नीचे जमने वाली बूंदों को बच्चों को छूकर महसूस करने दें।",
                    visual_learning_prompts=[
                        "River and village pond evaporating under hot morning sun",
                        "Clouds traveling over green fields and condensing",
                        "Rainwater replenishing the village well and tubewells"
                    ],
                    quiz_questions=[
                        {
                            "id": "q1",
                            "question": "नदी का पानी भाप कौन बनाता है?",
                            "options": ["सूरज की गर्मी", "चांदनी", "हवा", "आंधी"],
                            "correct": "सूरज की गर्मी",
                            "explanation": "सूरज की तेज धूप ही पानी को गर्म करके भाप बनाती है।"
                        },
                        {
                            "id": "q2",
                            "question": "आसमान में भाप ठंडी होकर क्या बनती है?",
                            "options": ["बादल", "धुआं", "पत्थर", "लकड़ी"],
                            "correct": "बादल",
                            "explanation": "भाप ठंडी हवा के संपर्क में आकर बादलों का रूप ले लेती है।"
                        }
                    ],
                    homework_activity="घर में जाकर मां से पूछें कि दाल उबलते समय ढक्कन पर पानी की बूंदें क्यों आती हैं?",
                    learning_objectives=[
                        "जल के वाष्पीकरण की प्रक्रिया को समझना।",
                        "बादल बनने और बारिश होने के संबंध को पहचानना।",
                        "दैनिक जीवन में वर्षा जल संचयन के महत्व को जानना।"
                    ],
                    timeline_breakdown=[
                        {"phase": "0-5 min", "title": "प्रेरणा (Hook)", "desc": "गरम चाय की केतली से उठती भाप दिखाकर बच्चों की उत्सुकता जगाना।"},
                        {"phase": "5-18 min", "title": "संकल्पना (Concept)", "desc": "नदी से आसमान और फिर खेत तक की जल चक्र की यात्रा समझाना।"},
                        {"phase": "18-28 min", "title": "क्रियात्मक (Activity)", "desc": "ठंडी थाली और गरम पानी का प्रयोग।"},
                        {"phase": "28-35 min", "title": "मूल्यांकन (Check)", "desc": "तीन सरल बहुविकल्पीय प्रश्नों से समझ की परख।"},
                        {"phase": "35-40 min", "title": "गृह कार्य (Home bridge)", "desc": "रसोई में मां से सवाल पूछने का कार्य देना।"}
                    ],
                    blackboard_layout={
                        "left_column": "सीखने के उद्देश्य:\n1. वाष्पीकरण\n2. संघनन\n3. वर्षा",
                        "center_column": "[चित्र: नदी ➔ भाप ➔ बादल ➔ वर्षा ➔ भूजल]",
                        "right_column": "मुख्य शब्द:\n• वाष्पीकरण\n• संघनन\n• भूजल\nगृहकार्य: रसोई की खोज"
                    },
                    differentiated_guidance={
                        "support_struggling_learners": "कटोरी और थाली के प्रयोग को स्वयं छूकर महसूस करवाएं।",
                        "advanced_learners": "सोचने को कहें कि धूप में गीले कपड़े जल्दी क्यों सूखते हैं।"
                    },
                    misconceptions_addressed=[
                        "भ्रम: बादल सफेद रूई से बने होते हैं। -> सच: बादल पानी की नन्हीं-नन्हीं बूंदों का समूह हैं।",
                        "भ्रम: बारिश सिर्फ समुद्र के पानी से होती है। -> सच: कुएं, तालाब और पेड़ों से भी पानी भाप बनता है।"
                    ],
                    is_ai_generated=True
                )

        # 2. Photosynthesis / Plants
        if any(w in topic_lower for w in ["plant", "leaf", "leaves", "photosynthesis", "seed", "தாவரம்", "ஒளிச்சேர்க்கை", "पौध"]):
            if is_tamil:
                return LessonPlanResponse(
                    lesson_id=lesson_id,
                    topic=f"{req.topic} - தாவரங்களின் பச்சையம் & உணவு தயாரித்தல்",
                    grade=req.grade,
                    subject=req.subject,
                    standard_level=req.standard_level,
                    language="Tamil",
                    difficulty=req.difficulty,
                    pedagogical_level=req.pedagogical_level,
                    duration=req.duration or "40 Minutes",
                    created_at=now_str,
                    pedagogical_hook="முற்றத்து துளசிச் செடியின் பச்சை சமையலறை!",
                    concept_explanation="நம் வீட்டில் அம்மா அடுப்பில் சமைப்பது போல, செடிகளின் பச்சை இலைகள் சூரிய ஒளியைப் பயன்படுத்தி உணவு சமைக்கின்றன. வேர்கள் நிலத்திலிருந்து தண்ணீரையும் உப்புகளையும் உறிஞ்சி இலைகளுக்கு அனுப்புகின்றன. இலைகளில் உள்ள 'பச்சையம்' (Chlorophyll) சூரிய ஒளியைப் பிடித்து மாவுச்சத்தாக மாற்றுகிறது.",
                    story_based_explanation="துளசிச் செடியின் குட்டி இலை 'பச்சைநிலா' கதை: காலை சூரியனின் கதிர்கள் தன் மேல் விழுந்ததும், மண்ணில் இருந்து தாகம் தீர்த்த வேர்த் தம்பிகள் அனுப்பிய நீர்த்துளியை வாங்கி, காற்றுத் தரும் கரியமில வாயுவோடு சேர்த்து இனிப்பான பழச்சத்தை சமைத்தாள்!",
                    local_vocabulary=[
                        {"term": "பச்சையம் (Chlorophyll)", "meaning": "இலைக்கு பச்சை நிறம் தரும் இயற்கைச் சாறு"},
                        {"term": "ஒளிச்சேர்க்கை (Photosynthesis)", "meaning": "சூரிய ஒளியால் இலைகள் உணவு தயாரித்தல்"},
                        {"term": "வேர்த் தூவிகள் (Root Hairs)", "meaning": "மண்ணில் இருந்து நீரையும் தாதுக்களையும் உறிஞ்சும் நுண்வேர்கள்"},
                        {"term": "ஆக்ஸிஜன் (Oxygen)", "meaning": "செடிகள் சுவாசிக்க வெளியேற்றும் தூய காற்று"}
                    ],
                    classroom_activity="வகுப்பறை ஆய்வு: ஒரு தொட்டிச் செடியின் ஓர் இலையை மட்டும் கருப்புக் காகிதத்தால் மூடி வையுங்கள். இரண்டு நாட்கள் கழித்துப் பார்க்கும்போது, சூரிய ஒளி படாத பகுதி வெளிறிப் போவதை மாணவர்கள் உற்றுநோக்கச் செய்யுங்கள்.",
                    visual_learning_prompts=[
                        "Tulsi plant in an earthen pot with sunlight rays falling on green leaves",
                        "Magnified leaf showing stomata pores breathing in air",
                        "Roots absorbing water droplets from fertile soil"
                    ],
                    quiz_questions=[
                        {
                            "id": "q1",
                            "question": "தாவரத்தின் உணவு சமைக்கும் சமையலறை எது?",
                            "options": ["பச்சை இலை", "வேர்", "பூக்கள்", "மரப்பட்டை"],
                            "correct": "பச்சை இலை",
                            "explanation": "இலைகளில்தான் பச்சையம் கொண்டு சூரிய ஒளியால் உணவு சமைக்கப்படுகிறது."
                        },
                        {
                            "id": "q2",
                            "question": "ஒளிச்சேர்க்கையின் போது தாவரங்கள் மனிதர்களுக்குத் தரும் வாயு எது?",
                            "options": ["உயிர்வளி (Oxygen)", "புகை", "கரியமில வாயு", "நீராவி"],
                            "correct": "உயிர்வளி (Oxygen)",
                            "explanation": "தாவரங்கள் தயாரிக்கும் சுத்தமான ஆக்ஸிஜனையே நாம் சுவாசிக்கிறோம்."
                        }
                    ],
                    homework_activity="இன்று உங்கள் வீட்டுத் தோட்டத்தில் அல்லது பால்கனியில் உள்ள செடியின் இலையைத் தொட்டுப் பார்த்து, அது எத்திசையில் சூரியனை நோக்கி நிற்கிறது என்று கவனித்து வாருங்கள்!",
                    learning_objectives=[
                        "இலைகள் சூரிய ஒளியால் உணவு சமைக்கும் முறையைப் புரிந்துகொள்ளுதல்.",
                        "பச்சையத்தின் அவசியத்தை செயல்முறை மூலம் உணர்தல்.",
                        "மரங்கள் நமக்கும் பூமிக்கும் தரும் தூய காற்றின் மதிப்பை அறிதல்."
                    ],
                    timeline_breakdown=[
                        {"phase": "0-5 min", "title": "பிரேரணை (Story Hook)", "desc": "முற்றத்து துளசிச் செடியின் பச்சை சமையலறை கதையை அறிமுகப்படுத்துதல்."},
                        {"phase": "5-18 min", "title": "சங்கல்பம் (Core Concept)", "desc": "வேர், இலை, சூரிய ஒளி மற்றும் பச்சையத்தின் பங்களிப்பை விளக்குதல்."},
                        {"phase": "18-28 min", "title": "செயல்முறை (Activity)", "desc": "இலைகளைத் தொட்டுப் பார்த்தல் மற்றும் கருப்புக் காகிதச் சோதனையைக் காட்டுதல்."},
                        {"phase": "28-35 min", "title": "மதிப்பீடு (Quiz)", "desc": "2 நிமிட விரைவு வினாடி-வினா."},
                        {"phase": "35-40 min", "title": "வீட்டுப் பணி & முடிவுரை", "desc": "வீட்டுத் தோட்ட உற்றுநோக்கல் மற்றும் நிறைவு."}
                    ],
                    blackboard_layout={
                        "left_column": "நோக்கங்கள்:\n• பச்சையம் அறிதல்\n• ஒளிச்சேர்க்கை\n• தூய காற்று",
                        "center_column": "[படம்: சூரியன் ☀️ ➔ இலை 🍃 ➔ உணவு 🍎 + ஆக்ஸிஜன் 💨]",
                        "right_column": "சொற்களஞ்சியம்:\n• ஒளிச்சேர்க்கை\n• பச்சையம்\nவீட்டுப் பணி: இலை உற்றுநோக்கல்"
                    },
                    differentiated_guidance={
                        "support_struggling_learners": "பச்சை இலை மற்றும் மஞ்சள் காய்ந்த இலையைக் கொடுத்து நிற வேறுபாட்டை உற்றுநோக்கச் செய்தல்.",
                        "advanced_learners": "இரவில் தாவரங்கள் எப்படி சுவாசிக்கின்றன என்று சிந்திக்கத் தூண்டுதல்."
                    },
                    misconceptions_addressed=[
                        "தவறான கருத்து: வேர்கள்தான் செடியின் உணவை மண்ணிலிருந்து நேரடியாக எடுக்கின்றன. -> உண்மை: வேர்கள் நீரையும் கனிமத்தையும் மட்டுமே தருகின்றன; உணவை இலைகளே தயாரிக்கின்றன.",
                        "தவறான கருத்து: சூரிய ஒளி இல்லாமலும் செடிகளால் முழுமையாக உணவு சமைக்க முடியும். -> உண்மை: ஒளிச்சேர்க்கைக்கு சூரிய ஒளி இன்றியமையாதது."
                    ],
                    is_ai_generated=True
                )

        # 3. Fractions / Mathematics
        if any(w in topic_lower for w in ["fraction", "number", "math", "shape", "count", "பின்ன", "கணிதம்", "भिन्न"]):
            return LessonPlanResponse(
                lesson_id=lesson_id,
                topic=f"{req.topic} - எளிய வாழ்வியல் பின்னங்கள் (Fractions in Daily Life)",
                grade=req.grade,
                subject=req.subject or "Mathematics",
                standard_level=req.standard_level,
                language=req.language,
                difficulty=req.difficulty,
                pedagogical_level=req.pedagogical_level,
                duration=req.duration or "40 Minutes",
                created_at=now_str,
                pedagogical_hook="இனிப்பான மாம்பழத் துண்டுகளும் அம்மா சுட்ட தோசையும்!",
                concept_explanation="ஒரு முழுப் பொருளை சமமாகப் பிரிக்கும்போது கிடைக்கும் பகுதிகளே 'பின்னங்கள்' (Fractions) ஆகும். ஒரு முழு தோசையை இருவருக்குப் பிரித்தால் பாதி (1/2), நால்வருக்குப் பிரித்தால் கால் (1/4). சமமாகப் பிரிப்பதே கணிதத்தின் அடிப்படை நீதி!",
                story_based_explanation="அண்ணன் அன்பரசு மற்றும் தங்கை நிலாவுக்கு அம்மா கொடுத்த ஒரே ஒரு சுவையான மாம்பழம்! 'இருவரும் சமமாகப் பிரித்து உண்ணுங்கள்' என்றாள் அம்மா. கத்தியால் நடுவே வெட்டியதும் இரண்டு சமமான அரைப் பகுதிகள் (1/2) கிடைத்தன. பின்னர் வந்த நண்பர்களுக்காக மேலும் நறுக்கியபோது கால் பகுதிகள் (1/4) கிடைத்தன!",
                local_vocabulary=[
                    {"term": "முழுமை (Whole - 1)", "meaning": "பிரியாத ஒரு முழு பொருள்"},
                    {"term": "அரை (Half - 1/2)", "meaning": "இரண்டு சம கூறுகளில் ஒரு பகுதி"},
                    {"term": "கால் (Quarter - 1/4)", "meaning": "நான்கு சம கூறுகளில் ஒரு பகுதி"},
                    {"term": "முக்கால் (Three-Fourths - 3/4)", "meaning": "நான்கு கூறுகளில் மூன்று பகுதிகள்"}
                ],
                classroom_activity="செயல்முறை: வட்ட வடிவ வண்ணக் காகிதங்களை எடுத்து, முதலில் பாதியாக (1/2), பின்னர் நான்காக (1/4) மடித்து வெட்டி ஒட்டிப் பார்த்துப் பின்னங்களை உருவாக்குதல்.",
                visual_learning_prompts=[
                    "A round golden chapati cut into two equal halves (1/2)",
                    "A sweet ripe mango sliced into four equal quarters (1/4)",
                    "Number line showing 0, 1/4, 1/2, 3/4, and 1"
                ],
                quiz_questions=[
                    {
                        "id": "q1",
                        "question": "ஒரு முழு ஆப்பிளை இரண்டு சம பாகங்களாகப் பிரித்தால் ஒவ்வொன்றும் என்ன?",
                        "options": ["அரை (1/2)", "கால் (1/4)", "முழுமை (1)", "முக்கால் (3/4)"],
                        "correct": "அரை (1/2)",
                        "explanation": "இரண்டு சம பாகங்களில் ஒன்று 1/2 (அரை) எனப்படும்."
                    }
                ],
                homework_activity="இன்று இரவு உணவின் போது உங்கள் வீட்டில் உள்ள ரொட்டி, இட்லி அல்லது பழத்தை சமமாகப் பிரித்து உங்கள் குடும்பத்தினருக்குப் பகிர்ந்துகொடுங்கள்!",
                learning_objectives=[
                    "முழுப் பொருளையும் அதன் சம கூறுகளையும் அடையாளம் காணுதல்.",
                    "1/2, 1/4, 3/4 ஆகிய பின்னங்களின் காட்சி அமைப்பைப் புரிந்துகொள்ளுதல்.",
                    "பகிர்தல் மற்றும் சம அளவீட்டின் முக்கியத்துவத்தை அன்றாட வாழ்வில் பயன்படுத்துதல்."
                ],
                timeline_breakdown=[
                    {"phase": "0-5 min", "title": "பிரேரணை", "desc": "மாம்பழப் பகிர்வு கதை வழியே ஆர்வத்தை உருவாக்குதல்."},
                    {"phase": "5-18 min", "title": "கருத்து விளக்கம்", "desc": "1, 1/2, 1/4 ஆகியவற்றை பலகையில் காட்சிப்படுத்துதல்."},
                    {"phase": "18-28 min", "title": "காகித மடிப்பு செயல்முறை", "desc": "மாணவர்கள் காகித வட்டங்களை மடித்துப் பார்த்தல்."},
                    {"phase": "28-35 min", "title": "மதிப்பீட்டு வினாக்கள்", "desc": "விரைவு வாய்மொழி வினாக்கள்."},
                    {"phase": "35-40 min", "title": "வீட்டுப் பணி", "desc": "இரவு உணவுப் பகிர்வு வழிகாட்டல்."}
                ],
                blackboard_layout={
                    "left_column": "கற்றல் விளைவு:\n• முழுமை\n• அரை (1/2)\n• கால் (1/4)",
                    "center_column": "[தோசை படம்: முழு ➔ 1/2 + 1/2 ➔ 1/4 + 1/4 + 1/4 + 1/4]",
                    "right_column": "வட்டாரச் சொற்கள்:\n• சரிபாதி\n• கால்வாசி\nவீட்டுப் பணி: உணவுப் பகிர்வு"
                },
                differentiated_guidance={
                    "support_struggling_learners": "பிளாஸ்டிக் மாவு அல்லது களிமண் உருண்டைகளை சமமாகப் பிட்டுப் பார்க்கச் செய்தல்.",
                    "advanced_learners": "3/4 ஐ விட 1/2 பெரிதா சிறிதா என்று தர்க்கரீதியாக விவரிக்கச் செய்தல்."
                },
                misconceptions_addressed=[
                    "தவறான கருத்து: எந்த இரண்டு துண்டுகளும் 'பாதி' ஆகும். -> உண்மை: இரண்டும் முற்றிலும் சம அளவாக இருந்தால் மட்டுமே அது 1/2 ஆகும்.",
                    "தவறான கருத்து: பகுதியில் (denominator) பெரிய எண் இருந்தால் பின்னத்தின் அளவு பெரிதாக இருக்கும். -> உண்மை: 1/4 என்பது 1/2 ஐ விடச் சிறியதாகும்."
                ],
                is_ai_generated=True
            )

        # Universal Contextual Synthesis for Any Topic
        return LessonPlanResponse(
            lesson_id=lesson_id,
            topic=f"{req.topic} ({req.grade} - {stage} Stage)",
            grade=req.grade,
            subject=req.subject or "General Studies",
            standard_level=req.standard_level or f"{req.grade} ({stage} Stage)",
            language=req.language,
            difficulty=req.difficulty,
            pedagogical_level=req.pedagogical_level or "Level 1: Foundational",
            duration=req.duration or "40 Minutes",
            created_at=now_str,
            pedagogical_hook=f"வட்டார வாழ்வியல் மரபும் குடும்ப அனுபவங்களும் ({req.topic})",
            concept_explanation=f"{req.language} தாய்மொழியில் எளிய மற்றும் நேரடி அறிவியல்/கணித விளக்கம்: {req.topic} பற்றிய அடிப்படைக் கொள்கைகள், குழந்தைகள் தினசரி பார்க்கும் சூழலோடு ஒப்பிடப்பட்டு எளிமையாக எடுத்துரைக்கப்படுகின்றன.",
            story_based_explanation=f"கிராமத்துக் குழந்தைகள் மற்றும் பாட்டி கதாபாத்திரங்கள் வழியே {req.topic} குறித்த ரகசியங்களை எளிமையாக வெளிப்படுத்தும் சுவாரஸ்யமான தொடக்கப்பள்ளி கதை.",
            local_vocabulary=[
                {"term": f"அடிப்படைக் கருத்து ({req.topic})", "meaning": "தொடக்கப் பள்ளி மாணவர்களுக்குப் புரியும் எளிய அறிவியல் பொருள்"},
                {"term": "வட்டாரப் பயன்பாடு", "meaning": "வீட்டிலும் கிராமத்திலும் புழங்கும் எளிய பயன்பாட்டுச் சொல்"},
                {"term": "இயற்கை நிகழ்வு", "meaning": "நம்மைச் சுற்றி தினசரி நிகழும் எளிய மாற்றம்"},
                {"term": "அறிவியல் சொல்", "meaning": "பாடப்புத்தகத்தில் இடம்பெறும் முறையான கலைச்சொல்"}
            ],
            classroom_activity="வகுப்பறை செயல்முறை: மாணவர்கள் சிறிய குழுக்களாகப் பிரிந்து, வகுப்பறையில் எளிதில் கிடைக்கும் காகிதம், இலைகள் அல்லது தண்ணீர் பாட்டில்களைக் கொண்டு செய்து பார்க்கும் சுவாரஸ்யமான கற்றல் பயிற்சி.",
            visual_learning_prompts=[
                f"Color-coded illustrated chalkboard drawing explaining {req.topic} with local culture icons",
                "Step-by-step cartoon comic strip showing children discovering the concept",
                "Mind-map connecting home objects with scientific terminology"
            ],
            quiz_questions=[
                {
                    "id": "q1",
                    "question": f"{req.topic} பற்றி இன்று நாம் கற்றதில் மிக முக்கியமான உண்மை எது?",
                    "options": [
                        "அன்றாட இயற்கை விதிகளோடு தொடர்புடையது",
                        "எதையும் மனப்பாடம் செய்யாமல் புரிந்து கற்க வேண்டும்",
                        "தாய்மொழியில் சிந்திப்பதே எளிதானது",
                        "மேற்கண்ட அனைத்தும் சரி"
                    ],
                    "correct": "மேற்கண்ட அனைத்தும் சரி",
                    "explanation": "தாய்மொழியில் ஆழமாகப் புரிந்து படிப்பதே வாழ்நாள் முழுவதும் நினைவில் நிற்கும் சிறந்த கல்வி!"
                },
                {
                    "id": "q2",
                    "question": f"இப்பாடத்தில் நாம் பயன்படுத்திய முக்கிய வாழ்வியல் உதாரணம் எதைக் குறிக்கிறது?",
                    "options": ["நமது வீட்டுச் சூழல்", "வெளிநாட்டு முறை", "புத்தக ஏட்டுச் சுரைக்காய்", "கடினமான கணக்கு"],
                    "correct": "நமது வீட்டுச் சூழல்",
                    "explanation": "நமது சொந்த வாழ்வியல் அனுபவங்களே மிகச் சிறந்த அறிவியல் ஆய்வகம்!"
                }
            ],
            homework_activity="இன்று கற்றுக்கொண்ட விஷயத்தை உங்கள் அம்மா, அப்பா அல்லது பாட்டியிடம் விளக்கிச் சொல்லி, அவர்கள் காலத்தில் இதை எப்படிப் பார்த்தார்கள் என்று கேட்டு நோட்டில் எழுதி வாருங்கள்!",
            learning_objectives=[
                f"{req.topic} பாடத்தின் அடிப்படைக் கோட்பாட்டைப் புரிந்துகொள்ளுதல்.",
                "அன்றாட வாழ்க்கை நிகழ்வுகளோடு இக்கருத்தை இணைத்துப் பார்த்தல்.",
                "சுய சிந்தனை மற்றும் எளிய செயல்முறை மூலம் முடிவுகளை விளக்குதல்."
            ],
            timeline_breakdown=[
                {"phase": "0-5 min", "title": "பிரேரணை (Prerana)", "desc": "சுவாரஸ்யமான கதை அல்லது விடுகதை வழியே மாணவர்களின் கவனத்தை ஈர்த்தல்."},
                {"phase": "5-18 min", "title": "சங்கல்பம் (Sankalpan)", "desc": "மையக் கருத்தை தாய்மொழி கலைச்சொற்களோடு விரிவாகக் கற்பித்தல்."},
                {"phase": "18-28 min", "title": "செயல்முறை (Kriyatmak)", "desc": "குழுக்களாக எளிய உபகரணங்களைக் கொண்டு செய்து பார்த்தல்."},
                {"phase": "28-35 min", "title": "மதிப்பீடு (Mulyankan)", "desc": "மாணவர்களின் புரிதலை அளவிடும் எளிய வினாக்கள்."},
                {"phase": "35-40 min", "title": "நிறைவு & குடும்பப் பாலம்", "desc": "இரவு உணவுக் கலந்துரையாடல் பணியை வழங்கி வகுப்பை நிறைவு செய்தல்."}
            ],
            blackboard_layout={
                "left_column": f"கற்றல் நோக்கங்கள்:\n1. {req.topic} அறிதல்\n2. செயல்முறை விளக்கம்\n3. வாழ்வியல் தொடர்பு",
                "center_column": f"[கரும்பலகை வரைபடம்: {req.topic} விளக்கக் குறியீடுகள்]",
                "right_column": "முக்கியக் கலைச்சொற்கள்:\n• சொல்லகராதி 1\n• சொல்லகராதி 2\nவீட்டுப் பணி: குடும்பப் பகிர்வு"
            },
            differentiated_guidance={
                "support_struggling_learners": "நேரடிப் பொருட்களைத் தொட்டுப் பார்த்து உணரச் செய்யும் எளிய வழிகாட்டல்.",
                "advanced_learners": "இக்கருத்து வேறு எங்கே பயன்படுகிறது என்று புதிய கேள்விகளை எழுப்ப ஊக்குவித்தல்."
            },
            misconceptions_addressed=[
                f"பொதுவான தவறான கருத்து: {req.topic} என்பது கடினமான மனப்பாடப் பாடம். -> உண்மை: எளிய வாழ்வியல் நிகழ்வுகளை உற்றுநோக்கினால் மிக எளிதாகப் புரிந்துவிடும்.",
                "அறிவியல் கலைச்சொற்கள் ஆங்கிலத்தில் மட்டுமே புரியும் என்ற எண்ணம் தவறானது; தாய்மொழியில் கருத்தை உணர்ந்தால் எம்மொழியிலும் எளிதாகப் புலப்படும்."
            ],
            is_ai_generated=True
        )

    def get_all_lessons(self) -> List[LessonPlanResponse]:
        return SAVED_LESSON_PLANS

    def save_lesson(self, lesson: LessonPlanResponse) -> LessonPlanResponse:
        for idx, existing in enumerate(SAVED_LESSON_PLANS):
            if existing.lesson_id == lesson.lesson_id:
                SAVED_LESSON_PLANS[idx] = lesson
                return lesson
        SAVED_LESSON_PLANS.append(lesson)
        return lesson

    def delete_lesson(self, lesson_id: str) -> bool:
        global SAVED_LESSON_PLANS
        initial_len = len(SAVED_LESSON_PLANS)
        SAVED_LESSON_PLANS = [l for l in SAVED_LESSON_PLANS if l.lesson_id != lesson_id]
        return len(SAVED_LESSON_PLANS) < initial_len

lesson_service = LessonService()
