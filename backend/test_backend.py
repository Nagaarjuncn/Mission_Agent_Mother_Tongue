"""
Automated Test Suite for VernacLearn Backend
Verifies all 7 core features, API endpoints, error handling, and demo flow.
"""
import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["supported_languages_count"] == 12

def test_supported_languages():
    response = client.get("/api/languages")
    assert response.status_code == 200
    langs = response.json()
    assert len(langs) == 12
    codes = [l["code"] for l in langs]
    assert "ta" in codes  # Tamil
    assert "te" in codes  # Telugu
    assert "hi" in codes  # Hindi
    assert "bn" in codes  # Bengali
    assert "kn" in codes  # Kannada
    assert "ml" in codes  # Malayalam

def test_multilingual_translation():
    payload = {
        "text": "Plants need sunlight to grow.",
        "source_lang": "en",
        "target_lang": "ta",
        "generate_explanation": True,
        "student_grade": "Class 3"
    }
    response = client.post("/api/translate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "தாவரங்கள்" in data["translated_text"] or "சூரிய" in data["translated_text"]
    assert "ஒளிச்சேர்க்கை" in data["child_explanation"] or "உணவு" in data["child_explanation"]
    assert data["target_lang"] == "ta"
    assert data["speech_code"] == "ta-IN"

def test_pedagogy_engine_culturally_rooted():
    payload = {
        "concept_or_question": "Why does rain fall from the sky?",
        "target_lang": "ta",
        "grade": "Class 4",
        "cultural_region": "Tamil Nadu"
    }
    response = client.post("/api/pedagogy/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "இட்லி" in data["pedagogy_title"] or "பானை" in data["vernacular_explanation"]
    assert len(data["cultural_keywords"]) > 0
    assert "quick_quiz" in data

def test_mitra_tutor_dialogue_and_misconception():
    # Misconception check: "sun sleeps at night"
    payload = {
        "message": "சூரியன் இரவில் தூங்குகிறது",
        "target_lang": "ta",
        "grade": "Class 3"
    }
    response = client.post("/api/tutor/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["detected_misconception"] is not None
    assert "பூமி" in data["reply_text"] or "சுழல்" in data["reply_text"]
    assert data["stars_awarded"] >= 1

def test_tutor_scaffolding_hints():
    payload = {
        "topic": "Water Cycle",
        "question": "நீர் எப்படி மேலே போகிறது?",
        "target_lang": "ta",
        "hint_level": 1
    }
    response = client.post("/api/tutor/hint", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["hint_level"] == 1
    assert len(data["hint_text"]) > 0

def test_teacher_lesson_generator():
    payload = {
        "topic": "The Water Cycle",
        "grade": "Class 4",
        "language": "Tamil",
        "difficulty": "Beginner"
    }
    response = client.post("/api/lessons/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "வைகை" in data["pedagogical_hook"] or "மழை" in data["topic"]
    assert len(data["local_vocabulary"]) >= 3
    assert len(data["quiz_questions"]) >= 1
    assert len(data["classroom_activity"]) > 0

def test_speech_synthesis_metadata():
    payload = {
        "text": "வணக்கம் குட்டித் தோழா!",
        "lang_code": "ta",
        "speed": 0.88,
        "pitch": 1.1
    }
    response = client.post("/api/speech/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["speech_code"] == "ta-IN"
    assert data["voice_accent_profile"]["pitch"] == 1.1

def test_interactive_quiz_evaluation():
    payload = {
        "quiz_id": "quiz-water-cycle-001",
        "student_id": "student_001",
        "answers": {
            "q1": "நீராவி (Steam)",
            "q2": "மழைத்துளிகள்"
        },
        "language": "ta"
    }
    response = client.post("/api/quizzes/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score_percentage"] == 100.0
    assert data["stars_earned"] > 0
    assert "new_badge" in data

def test_dashboards():
    # Student
    res_student = client.get("/api/student/student_001/dashboard")
    assert res_student.status_code == 200
    assert res_student.json()["mother_tongue_code"] == "ta"
    assert len(res_student.json()["subjects"]) == 5

    # Teacher
    res_teacher = client.get("/api/teacher/analytics")
    assert res_teacher.status_code == 200
    assert res_teacher.json()["total_students"] > 0
    assert len(res_teacher.json()["misunderstood_concepts"]) > 0

    # Parent
    res_parent = client.get("/api/parent/student_001/insights")
    assert res_parent.status_code == 200
    assert len(res_parent.json()["simple_home_activities"]) > 0

def test_hackathon_demo_flow():
    payload = {
        "language": "ta",
        "question": "Why does rain fall from the sky?",
        "student_name": "Arun",
        "grade": "Class 4"
    }
    response = client.post("/api/demo/hackathon-flow", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "step_1_voice_input" in data
    assert "step_2_ai_translation" in data
    assert "step_3_vernacular_pedagogy" in data
    assert "step_4_interactive_mini_quiz" in data
    assert "step_5_evaluation_and_rewards" in data
    assert "step_6_dashboard_state_update" in data
    assert data["core_mission_statement"] == "Language should never be a barrier to understanding."

def test_language_detection_indic_and_english():
    # 1. Detect English speech
    res_en = client.post("/api/speech/detect-language", json={"text": "Why does rain fall from the sky?"})
    assert res_en.status_code == 200
    assert res_en.json()["detected_lang"] == "en"

    # 2. Detect Tamil speech
    res_ta = client.post("/api/speech/detect-language", json={"text": "தாவரங்கள் வளர சூரிய ஒளி தேவை"})
    assert res_ta.status_code == 200
    assert res_ta.json()["detected_lang"] == "ta"

    # 3. Detect Hindi speech
    res_hi = client.post("/api/speech/detect-language", json={"text": "पौधों को धूप की आवश्यकता होती है"})
    assert res_hi.status_code == 200
    assert res_hi.json()["detected_lang"] == "hi"

    # 4. Auto-detect translation
    res_auto = client.post("/api/translate", json={
        "text": "Why does rain fall from the sky?",
        "source_lang": "auto",
        "target_lang": "ta"
    })
    assert res_auto.status_code == 200
    assert res_auto.json()["target_lang"] == "ta"

    # 5. Spoken language name detection (e.g. "My mother tongue is Telugu" or "Kannada")
    res_spoken = client.post("/api/speech/detect-language", json={"text": "My mother tongue is Telugu"})
    assert res_spoken.status_code == 200
    assert res_spoken.json()["detected_lang"] == "te"

def test_lady_voice_auto_speak_profile():
    # Verify translation returns auto_speak_lady_voice and lady voice profile
    res = client.post("/api/translate", json={
        "text": "Why does rain fall from the sky?",
        "source_lang": "en",
        "target_lang": "ta"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["auto_speak_lady_voice"] is True
    assert data["voice_profile"] is not None
    assert data["voice_profile"]["gender"] == "female"
    assert data["voice_profile"]["voice_persona"] == "child_friendly_lady_voice"
    assert 1.15 <= data["voice_profile"]["pitch"] <= 1.35
    assert 0.80 <= data["voice_profile"]["rate"] <= 0.95
    assert len(data["voice_profile"]["preferred_voices"]) > 0

    # Verify pedagogy returns lady voice profile
    ped_res = client.post("/api/pedagogy/explain", json={
        "concept_or_question": "Why does rain fall from the sky?",
        "target_lang": "hi",
        "grade": "Class 4"
    })
    assert ped_res.status_code == 200
    ped_data = ped_res.json()
    assert ped_data["auto_speak_lady_voice"] is True
    assert ped_data["voice_profile"]["gender"] == "female"
    assert ped_data["voice_profile"]["speech_code"] == "hi-IN"

def test_host_info_endpoint():
    res = client.get("/api/host-info")
    assert res.status_code == 200
    data = res.json()
    assert "host_url" in data
    assert "protocol" in data
    assert data["service"] == "Mission Agent Mother-Tongue"
    assert data["microphone_ready"] is True

def test_tutor_any_language_converts_to_mother_tongue():
    # Test 1: English question converted to Tamil in AI Tutor
    payload_en = {
        "message": "Why does rain fall from the sky?",
        "target_lang": "ta",
        "grade": "Class 3"
    }
    res_en = client.post("/api/tutor/chat", json=payload_en)
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert data_en["input_was_converted"] is True
    assert data_en["detected_source_lang"] == "en"
    assert "மழை" in data_en["translated_input_text"] or "வான" in data_en["translated_input_text"]
    assert "இட்லி" in data_en["reply_text"] or "ஆவி" in data_en["reply_text"] or "மழை" in data_en["reply_text"]

    # Test 2: French question converted to Telugu in AI Tutor
    payload_fr = {
        "message": "Comment volent les oiseaux?",
        "target_lang": "te",
        "grade": "Class 3"
    }
    res_fr = client.post("/api/tutor/chat", json=payload_fr)
    assert res_fr.status_code == 200
    data_fr = res_fr.json()
    assert data_fr["input_was_converted"] is True
    assert data_fr["reply_speech_code"] == "te-IN"
    assert data_fr["translated_input_text"] is not None

def test_speech_tts_audio_streaming():
    # Verify regional TTS synthesis returns valid audio/mpeg bytes
    res = client.get("/api/speech/tts?text=தாவரங்கள்&lang=ta")
    assert res.status_code == 200
    assert "audio/mpeg" in res.headers.get("content-type", "")
    assert len(res.content) > 500

if __name__ == "__main__":
    import pytest
    sys.exit(pytest.main(["-v", __file__]))


