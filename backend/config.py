"""
VernacLearn Backend Configuration
Handles environment settings, AI API integrations (Gemini, Sarvam, Bhashini),
language constants, and fallback options.
"""
import os
from typing import Dict, List, Any
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Mission Agent Mother-Tongue"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "*"
    ]

    # AI Service API Keys (Optional - offline fallback activates when empty)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
    BHASHINI_USER_ID: str = os.getenv("BHASHINI_USER_ID", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Static frontend directory mount (detects frontend/, Frontend/, or root directory)
    @staticmethod
    def _find_frontend_dir() -> str:
        base_parent = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        candidates = [
            os.path.join(base_parent, "frontend"),
            os.path.join(base_parent, "Frontend"),
            base_parent,
            os.path.join(os.getcwd(), "frontend"),
            os.path.join(os.getcwd(), "Frontend"),
            os.getcwd()
        ]
        for candidate in candidates:
            if os.path.isfile(os.path.join(candidate, "index.html")):
                return candidate
        return base_parent

    @property
    def FRONTEND_DIR(self) -> str:
        return self._find_frontend_dir()

    # 12 Supported Languages (11 Indian Mother Tongues + English)
    SUPPORTED_LANGUAGES: List[Dict[str, Any]] = [
        {"code": "ta", "name": "Tamil", "nativeName": "தமிழ்", "flag": "🇮🇳", "speechCode": "ta-IN"},
        {"code": "te", "name": "Telugu", "nativeName": "తెలుగు", "flag": "🇮🇳", "speechCode": "te-IN"},
        {"code": "ml", "name": "Malayalam", "nativeName": "മലയാളം", "flag": "🇮🇳", "speechCode": "ml-IN"},
        {"code": "kn", "name": "Kannada", "nativeName": "ಕನ್ನಡ", "flag": "🇮🇳", "speechCode": "kn-IN"},
        {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "flag": "🇮🇳", "speechCode": "hi-IN"},
        {"code": "bn", "name": "Bengali", "nativeName": "বাংলা", "flag": "🇮🇳", "speechCode": "bn-IN"},
        {"code": "mr", "name": "Marathi", "nativeName": "मराठी", "flag": "🇮🇳", "speechCode": "mr-IN"},
        {"code": "gu", "name": "Gujarati", "nativeName": "ગુજરાતી", "flag": "🇮🇳", "speechCode": "gu-IN"},
        {"code": "pa", "name": "Punjabi", "nativeName": "ਪੰਜਾਬੀ", "flag": "🇮🇳", "speechCode": "pa-IN"},
        {"code": "or", "name": "Odia", "nativeName": "ଓଡ଼ିଆ", "flag": "🇮🇳", "speechCode": "or-IN"},
        {"code": "as", "name": "Assamese", "nativeName": "অসমীয়া", "flag": "🇮🇳", "speechCode": "as-IN"},
        {"code": "en", "name": "English", "nativeName": "English", "flag": "🌐", "speechCode": "en-US"}
    ]

settings = Settings()
