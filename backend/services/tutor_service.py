"""
Mitra AI Vernacular Tutor Service
Personalized primary-school child tutor designed for ages 5-12.
Provides interactive mother-tongue explanations, misconception diagnosis,
progressive hints, difficulty adaptation, and positive reinforcement.
Automatically converts questions from ANY language into the selected mother tongue.
"""
from typing import Dict, Any, List, Optional
from backend.config import settings
from backend.models.schemas import TutorChatRequest, TutorChatResponse, TutorHintRequest, TutorHintResponse
from backend.services.translation_service import translation_service

# Vernacular encouraging phrases for Indian primary students
ENCOURAGEMENT_BY_LANG = {
    "ta": [
        "அருமை! நீங்கள் மிகச் சரியாக யோசிக்கிறீர்கள்! 🌟",
        "சபாஷ் குட்டித் தோழா! தொடர்ந்து முயற்சியுங்கள்! 👏",
        "அற்புதம்! உங்கள் அறிவுக் கூர்மை எனக்கு மிகவும் பிடித்திருக்கிறது! 🚀"
    ],
    "hi": [
        "बहुत बढ़िया! आप बिल्कुल सही दिशा में सोच रहे हैं! 🌟",
        "शाबाश प्यारे दोस्त! आपकी यह बात बहुत अच्छी लगी! 👏",
        "लाजवाब! आपकी कोशिश देखकर दिल खुश हो गया! 🚀"
    ],
    "te": [
        "చాలా బాగుంది! మీరు సరిగ్గా ఆలోచిస్తున్నారు! 🌟",
        "శభాష్ చిట్టి మిత్రమా! చక్కగా సమాధానం ఇచ్చావు! 👏"
    ],
    "sat": [
        "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱟᱢ ᱟᱹᱰᱤ ᱵᱮᱥ ᱮᱢ ᱩᱭᱦᱟᱹᱨᱮᱫᱼᱟ! 🌟",
        "ᱥᱟᱵᱟᱥ ᱠᱟᱹᱴᱤᱡ ᱜᱟᱛᱮ! ᱱᱚᱝᱠᱟ ᱜᱮ ᱪᱮᱫᱚᱜ ᱢᱮ! 👏",
        "ᱟᱹᱰᱤ ᱪᱚᱨᱚᱠ! ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭᱟ! 🚀"
    ],
    "khr": [
        "बहुत बढ़िया! तोहे एकदम सही सोच रहल ह! 🌟",
        "शाबाश नन्हा संगी! अइसने मन लगाय के पढ़! 👏",
        "लाजवाब! तोहर सवाल बहुत सुंदर लागल! 🚀"
    ],
    "en": [
        "Superstar! You are thinking in the right direction! 🌟",
        "Wonderful curiosity! Let's discover this together! 👏"
    ]
}

# Misconception diagnosis rules for primary science & math
MISCONCEPTION_RULES = [
    {
        "trigger_words": ["சூரியன் இரவில் தூங்குகிறது", "sun sleeps at night", "சூரியன் மறைகிறது", "सूरज सोता है", "ᱥᱤᱸᱜᱤ ᱵᱮᱲᱟ ᱡᱟᱹᱯᱤᱫ", "सुरुज सुते"],
        "misconception": "Sun disappears or goes away to sleep",
        "ta_feedback": "சூரியன் எங்கும் தூங்கச் செல்லவில்லை! பூமி பந்து போல சுழல்வதால், ஒரு பக்கம் பகலாகவும் மறுபக்கம் இரவாகவும் மாறுகிறது. நீங்கள் ஒரு பந்தை சுழற்றிப் பார்த்திருக்கிறீர்களா?",
        "hi_feedback": "सूरज कहीं सोने नहीं जाता! हमारी पृथ्वी लट्टू की तरह घूमती है, जिससे एक तरफ दिन और दूसरी तरफ रात होती है।",
        "te_feedback": "సూర్యుడు ఎక్కడికీ నిద్రపోడు! భూమి బొంగరంలా తిరగడం వల్ల ఒకవైపు పగలు, మరోవైపు రాత్రి ఏర్పడుతుంది.",
        "sat_feedback": "ᱥᱤᱸᱜᱤ ᱵᱮᱲᱟ ᱫᱚ ᱚᱠᱟ ᱦᱚᱸ ᱡᱟᱹᱯᱤᱫ ᱵᱟᱭ ᱪᱟᱞᱟᱜᱼᱟ! ᱟᱵᱚᱣᱟᱜ ᱫᱷᱟᱹᱨᱛᱤ ᱜᱩᱸᱰᱩ ᱞᱮᱠᱟ ᱟᱹᱪᱩᱨᱚᱜ ᱠᱟᱱᱟ, ᱚᱱᱟᱛᱮ ᱢᱤᱫ ᱯᱟᱦᱴᱟ ᱫᱚ ᱢᱟᱦᱟᱸ ᱟᱨ ᱢᱤᱫ ᱯᱟᱦᱴᱟ ᱫᱚ ᱧᱤᱫᱟᱹ ᱦᱩᱭᱩᱜᱼᱟ᱾",
        "khr_feedback": "सुरुज भगवान कतहुं सुते नय जा हथ! हमनी के धरती भौंरा नियर घूमो है, जेकरा से एका दने दिन आउर दोसरा दने रात होवो है।",
        "en_feedback": "The Sun does not go to sleep! The Earth spins like a top, creating day on one side and night on the other."
    },
    {
        "trigger_words": ["மழை மேகங்களில் இருந்து கொட்டுகிறது", "clouds have water tanks", "தொட்டி", "बादल में टंकी", "ᱫᱟᱜ ᱴᱟᱝᱠᱤ", "पानी के टंकी"],
        "misconception": "Clouds are solid containers of water",
        "ta_feedback": "மேகங்கள் தண்ணீர் தொட்டி அல்ல! அவை பனித்துளிகள் போல காற்றில் மிதக்கும் குட்டி நீர்த்துளிகளின் கூட்டம். ஒன்று சேர்ந்ததும் கனமாகி மழையாக விழுகின்றன.",
        "hi_feedback": "बादल कोई पानी की टंकी नहीं हैं! वे तो हवा में तैरती नन्ही भाप की बूंदों का झुंड हैं, जो भारी होकर बरसते हैं।",
        "te_feedback": "మేఘాలు నీటి తొట్టెలు కావు! అవి గాలిలో తేలే చిన్న నీటి బిందువులు, చల్లబడినప్పుడు వర్షంగా కురుస్తాయి.",
        "sat_feedback": "ᱨᱤᱢᱤᱞ ᱫᱚ ᱫᱟᱜ ᱴᱟᱝᱠᱤ ᱵᱟᱝ ᱠᱟᱱᱟ! ᱱᱚᱣᱟ ᱫᱚ ᱦᱚᱭ ᱨᱮ ᱟᱹᱛᱩᱜ ᱠᱟᱱ ᱠᱟᱹᱴᱤᱡ ᱠᱟᱹᱴᱤᱡ ᱫᱟᱜ ᱴᱷᱤᱯᱤᱨ ᱨᱮᱱᱟᱜ ᱜᱟᱫᱮᱞ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱦᱟᱢᱟᱞ ᱞᱮᱱᱠᱷᱟᱱ ᱡᱟᱹᱲᱤᱜᱼᱟ᱾",
        "khr_feedback": "बदरी कोनो पानी के टंकी नय हके! ई हवा में तैरते नन्हा भाप के बूंद के झुंड हके, जे भारी भेला पर पानी बरसे है।",
        "en_feedback": "Clouds are not water tanks! They are clusters of tiny floating water droplets that fall as rain when they become heavy."
    }
]

class TutorService:
    def __init__(self):
        self.encouragements = ENCOURAGEMENT_BY_LANG

    def handle_chat_turn(self, req: TutorChatRequest) -> TutorChatResponse:
        """
        Process a conversational turn between the child student and Mitra AI.
        Converts any language input (English, Hindi, French, Spanish, etc.) into the selected mother tongue,
        adapts tone, checks for misunderstandings, provides hints, and awards stars.
        """
        target_lang = (req.target_lang or "ta").lower().strip()
        is_tamil = target_lang == "ta"
        is_hindi = target_lang == "hi"
        is_santhali = target_lang == "sat"
        is_khortha = target_lang == "khr"

        # 1. Automatic Conversion of any-language input into child's selected mother tongue
        conv_info = translation_service.translate_any_to_mother_tongue(req.message, target_lang)
        translated_input = conv_info.get("translated_text") or req.message
        detected_src_code = conv_info.get("detected_source_lang", "auto")
        source_name = conv_info.get("source_lang_name", "Original")
        input_was_converted = conv_info.get("input_was_converted", False)

        # The question to display and refer to in the mother tongue
        displayed_question = translated_input if input_was_converted else req.message

        # Unified text string for matching topics and misconceptions
        user_msg = f"{req.message} {translated_input}".strip().lower()

        # Target language speech code
        target_meta = translation_service.languages.get(target_lang, {"speechCode": "ta-IN", "nativeName": "தமிழ்"})
        target_speech = target_meta.get("speechCode", "ta-IN" if is_tamil else "hi-IN")

        # Helper to construct TutorChatResponse with conversion metadata
        def make_response(**kwargs):
            return TutorChatResponse(
                detected_source_lang=detected_src_code,
                source_lang_name=source_name,
                translated_input_text=translated_input,
                input_was_converted=input_was_converted,
                original_input_text=req.message,
                **kwargs
            )

        # 2. Check for common misconceptions
        for rule in MISCONCEPTION_RULES:
            if any(w.lower() in user_msg for w in rule["trigger_words"]):
                feedback = rule.get(f"{target_lang}_feedback") or rule.get("ta_feedback")
                
                if is_santhali:
                    iq = "ᱱᱤᱛᱚᱜ ᱞᱟᱹᱭ ᱢᱮ, ᱫᱷᱟᱹᱨᱛᱤ ᱟᱹᱪᱩᱨ ᱞᱮᱱᱠᱷᱟᱱ ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ᱪᱮᱫ ᱦᱩᱭᱩᱜᱼᱟ?"
                    ht = "ᱢᱤᱫᱴᱟᱝ ᱵᱚᱞ ᱪᱮᱛᱟᱱ ᱴᱚᱨᱪ ᱢᱟᱨᱥᱟᱞ ᱠᱟᱛᱮ ᱧᱮᱞ ᱢᱮ!"
                    qr = ["ᱢᱟᱦᱟᱸ ᱟᱨ ᱧᱤᱫᱟᱹ ᱵᱚᱫᱚᱞᱚᱜᱼᱟ", "ᱥᱤᱸᱜᱤ ᱵᱮᱲᱟ ᱟᱹᱪᱩᱨᱚᱜᱼᱟ"]
                elif is_khortha:
                    iq = "अब बतावा संगी, जब धरती घूमो है त तोहर गांव में की होवो है?"
                    ht = "गेन्द पर टॉर्च बार के देखा!"
                    qr = ["दिन आउर रात बनो है", "सुरुज घूमो है"]
                elif is_tamil:
                    iq = "இப்போது சொல்லுங்கள், பூமி சுழலும் போது உங்கள் ஊரில் என்ன நடக்கும்?"
                    ht = "ஒரு பந்தின் மேல் டார்ச் அடித்துப் பாருங்கள்!"
                    qr = ["பகல் மற்றும் இரவு மாறும்", "சூரியன் சுழல்கிறது", "மழை பெய்கிறது"]
                else:
                    iq = "अब बताइए, जब पृथ्वी घूमती है तो आपके शहर में क्या होता है?"
                    ht = "गेंद पर टॉर्च जलाकर देखें!"
                    qr = ["दिन और रात बनते हैं", "सूरज घूमता है"]

                return make_response(
                    reply_text=feedback,
                    reply_speech_code=target_speech,
                    emotion="guiding",
                    interactive_question=iq,
                    hint_available=True,
                    hint_text=ht,
                    suggested_quick_replies=qr,
                    stars_awarded=1,
                    detected_misconception=rule["misconception"]
                )

        # 3. Topic-aware interactive dialogue (Water Cycle / Rain)
        if any(w in user_msg for w in ["rain", "மழை", "நீர்", "வானம்", "water", "cloud", "बादल", "बारिश", "వర్షం", "మేఘ", "ᱫᱟᱜ", "ᱨᱤᱢᱤᱞ", "ᱥᱮᱨᱢᱟ", "पानी", "बदरी"]):
            if is_santhali:
                return make_response(
                    reply_text=f"ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱠᱩᱠᱞᱤ! 🌧️ ᱟᱢ ᱠᱩᱞᱤ ᱟᱠᱟᱫᱟ: '{displayed_question}'\n\nᱟᱵᱚᱣᱟᱜ ᱚᱲᱟᱜ ᱨᱮ ᱟᱭᱳ ᱪᱩᱞᱦᱟᱹ ᱨᱮ ᱫᱟᱠᱟ ᱩᱛᱩ ᱡᱚᱠᱷᱚᱱ ᱪᱮᱛᱟᱱ ᱛᱮ ᱵᱷᱟᱯ ᱨᱟᱠᱟᱵ ᱧᱮᱞ ᱟᱠᱟᱫᱟᱢ? ᱴᱷᱤᱠ ᱚᱱᱠᱟ ᱜᱮ ᱜᱟᱰᱟ ᱟᱨ ᱯᱩᱠᱷᱨᱤ ᱫᱟᱜ ᱥᱤᱸᱜᱤ ᱵᱮᱲᱟ ᱛᱟᱨᱟᱥ ᱛᱮ ᱞᱚᱞᱚ ᱠᱟᱛᱮ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵᱼᱟ ᱟᱨ ᱨᱤᱢᱤᱞ ᱵᱮᱱᱟᱣᱜᱼᱟ᱾ ᱨᱤᱢᱤᱞ ᱦᱟᱢᱟᱞ ᱞᱮᱱᱠᱷᱟᱱ ᱫᱟᱜ ᱡᱟᱹᱲᱤ ᱦᱩᱭᱩᱜᱼᱟ!",
                    reply_speech_code="sat-IN",
                    phonetic_guide="Chulha daka bhap leka gada da' serma rimil benawg-a.",
                    emotion="happy",
                    interactive_question="ᱫᱟᱠᱟ ᱴᱩᱠᱩᱡ ᱪᱮᱛᱟᱱ ᱛᱷᱟᱹᱨᱤ ᱯᱚᱴᱚᱢ ᱞᱮᱠᱷᱟᱱ ᱚᱱᱟ ᱨᱮ ᱪᱮᱫ ᱡᱟᱣᱨᱟᱜᱼᱟ?",
                    hint_available=True,
                    hint_text="ᱫᱟᱜ ᱴᱷᱤᱯᱤᱨ ᱨᱮᱱᱟᱜ ᱠᱟᱛᱷᱟ ᱩᱭᱦᱟᱹᱨ ᱢᱮ!",
                    suggested_quick_replies=["ᱫᱟᱜ ᱴᱷᱤᱯᱤᱨ", "ᱥᱤᱸᱜᱤ ᱢᱟᱨᱥᱟᱞ", "ᱦᱚᱭ"],
                    stars_awarded=2
                )
            elif is_khortha:
                return make_response(
                    reply_text=f"अरे वाह! बहुत सुंदर सवाल संगी! 🌧️ तोहर सवाल: '{displayed_question}'\n\nजब घरे माय भात या चाय पकावो हथ, त डेगची से भाप ऊपर उड़ो है ना? ओकर ऊपर जब ढक्कन राख देबी, त भाप ठंडा होके पानी के नन्हा-नन्हा बूंद बन जाहो है! अइसने नदी-पोखरा के पानी घाम से भाप बन के बदरी बनो है आउर झम-झम पानि बरसे है!",
                    reply_speech_code="khr-IN",
                    phonetic_guide="Degchi ke bhaap badri ban ke jham-jham barse hai.",
                    emotion="happy",
                    interactive_question="बतावा संगी, नदी के पानी भाप बन के अकास में की बनो है?",
                    hint_available=True,
                    hint_text="अकास में रुई नियर की तैरो है?",
                    suggested_quick_replies=["बदरी (Badal)", "सुरुज", "तारा"],
                    stars_awarded=2
                )
            elif is_tamil:
                return make_response(
                    reply_text=f"அருமையான கேள்வி! 🌧️ நீங்கள் கேட்டது: '{displayed_question}'\n\nநம் வீட்டில் அம்மா இட்லி சமைக்கும் போது பானையில் இருந்து வெள்ளை ஆவி மேலே போவதைப் பார்த்திருக்கிறீர்களா? அதே போல, வெயிலில் ஆறு மற்றும் குளத்து நீர் ஆவியாகி மேலே பறந்து, குளிர்ந்த காற்றில் ஒன்றுசேர்ந்து மேகமாகிறது. மேகம் கனத்தவுடன் முத்து முத்தாக மழை பெய்கிறது!",
                    reply_speech_code="ta-IN",
                    phonetic_guide="Idli paanai aavi pola neer aaviyaki mazhaiyaaga peigiradhu.",
                    emotion="happy",
                    interactive_question="சரி குட்டித் தோழா! இட்லிப் பானை மூடியைத் திறக்கும்போது உள்ளே சொட்டும் நீர்த்துளிகள் எதைப் போன்றது?",
                    hint_available=True,
                    hint_text="மழைத்துளிகளை நினைத்துப் பாருங்கள்!",
                    suggested_quick_replies=["மழைத்துளிகள்", "சூரிய ஒளி", "காற்று"],
                    stars_awarded=2
                )
            elif is_hindi:
                return make_response(
                    reply_text=f"अरे वाह! बहुत प्यारा सवाल! 🌧️ आपका सवाल: '{displayed_question}'\n\nजब घर में चाय उबलती है तो ढक्कन पर भाप की नन्ही बूंदें जम जाती हैं ना? ठीक वैसे ही नदी और तालाब का पानी धूप से भाप बनकर आसमान में उड़ता है और ठंडी हवा लगने पर बादल बनकर खेतों पर छम-छम बरसता है!",
                    reply_speech_code="hi-IN",
                    phonetic_guide="Chai ki keetali ki bhaap aasmaan mein baadal banti hai.",
                    emotion="happy",
                    interactive_question="अब बताइए, नदी का पानी भाप बनकर आसमान में क्या बनाता है?",
                    hint_available=True,
                    hint_text="आसमान में रुई जैसे क्या तैरते हैं?",
                    suggested_quick_replies=["बादल", "सूरज", "तारे"],
                    stars_awarded=2
                )

        # 4. Topic-aware interactive dialogue (Photosynthesis / Plants)
        if any(w in user_msg for w in ["உணவு", "plant", "தாவரம்", "சூரிய", "धूप", "खाना", "पौधा", "మొక్క", "చెట్టు", "ᱡᱚᱢᱟᱜ", "ᱫᱟᱨᱮ", "ᱥᱟᱠᱟᱢ", "गाछ", "पतई"]):
            if is_santhali:
                return make_response(
                    reply_text=f"ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱠᱩᱠᱞᱤ! 🌿 ᱟᱢ ᱠᱩᱞᱤ ᱟᱠᱟᱫᱟ: '{displayed_question}'\n\nᱟᱵᱚᱣᱟᱜ ᱚᱲᱟᱜ ᱨᱟᱪᱟ ᱨᱮᱱᱟᱜ ᱫᱟᱨᱮ ᱪᱮᱠᱟᱛᱮ ᱡᱚᱢᱟᱜ ᱮ ᱵᱮᱱᱟᱣᱟ? ᱨᱮᱦᱮᱴ ᱛᱮ ᱫᱟᱜ ᱧᱩ ᱠᱟᱛᱮ ᱟᱨ ᱥᱟᱠᱟᱢ ᱨᱮ ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱧᱟᱢ ᱠᱟᱛᱮ ᱡᱚᱢᱟᱜ ᱮ ᱛᱮᱭᱟᱨᱟ! ᱱᱚᱣᱟ ᱜᱮ 'ᱯᱷᱳᱴᱳᱥᱤᱱᱛᱷᱮᱥᱤᱥ' (Photosynthesis) ᱵᱚᱱ ᱢᱮᱛᱟᱜᱼᱟ᱾",
                    reply_speech_code="sat-IN",
                    phonetic_guide="Dare sakam sińgi taras te jomag teyara.",
                    emotion="happy",
                    interactive_question="ᱫᱟᱨᱮ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱤᱸᱜᱤ ᱛᱟᱨᱟᱥ ᱥᱟᱶᱛᱮ ᱟᱨ ᱪᱮᱫ ᱞᱟᱹᱠᱛᱤᱭᱟ?",
                    hint_available=True,
                    hint_text="ᱡᱟᱦᱟᱸ ᱫᱚ ᱟᱢ ᱫᱤᱱᱟᱹᱢ ᱦᱤᱞᱚᱜ ᱫᱟᱨᱮ ᱨᱮᱦᱮᱴ ᱨᱮᱢ ᱫᱩᱞᱟ!",
                    suggested_quick_replies=["ᱫᱟᱜ (Water)", "ᱦᱚᱭ (Air)", "ᱵᱟᱱᱟᱨ ᱜᱮ!"],
                    stars_awarded=2
                )
            elif is_khortha:
                return make_response(
                    reply_text=f"अरे वाह! बहुत सुंदर सवाल संगी! 🌿 तोहर सवाल: '{displayed_question}'\n\nजैसे तोहर माय घरे रंधन करे हथ, वइसने गाछ-बिरिछ सुरुज के घाम आउर पानि से आपन हरियर पतई में खाना बनाव हथ। एकरा 'प्रकाश-संश्लेषण' (Photosynthesis) कहल जाहो है!",
                    reply_speech_code="khr-IN",
                    phonetic_guide="Hariyar patai ghaam aur paani se khana banavo hai.",
                    emotion="happy",
                    interactive_question="बतावा संगी, घाम के अलावा गाछ के खाना पकावे ले की चाही?",
                    hint_available=True,
                    hint_text="जे तोहे रोज़ गाछ के जड़ में डालो ह!",
                    suggested_quick_replies=["पानी (Water)", "हवा (Air)", "दोनों चाही!"],
                    stars_awarded=2
                )
            elif is_tamil:
                return make_response(
                    reply_text=f"அருமையான கேள்வி அருண்! 🌿 நீங்கள் கேட்டது: '{displayed_question}'\n\nநம் வீட்டு முற்றத்துத் துளசிச் செடி எப்படி உணவு செய்கிறது தெரியுமா? வேர்கள் வழியே நீரை உறிஞ்சி, இலைகளில் சூரிய ஒளியைப் பாய்ச்சி சமைக்கிறது! இதை 'ஒளிச்சேர்க்கை' (Photosynthesis) என்போம்.",
                    reply_speech_code="ta-IN",
                    phonetic_guide="Thulaasi chedi sooriya oliyaal unavu thayarikkiradhu.",
                    emotion="happy",
                    interactive_question="சரி குட்டித் தோழா! செடிகள் உணவு தயாரிக்க சூரிய ஒளியைத் தவிர வேறு என்ன முக்கியமாகத் தேவைப்படுகிறது?",
                    hint_available=True,
                    hint_text="நீங்கள் செடிக்கு தினமும் ஊற்றுவது என்ன?",
                    suggested_quick_replies=["தண்ணீர் (Water)", "காற்று (Air)", "இரண்டும் தேவை!"],
                    stars_awarded=2
                )
            elif is_hindi:
                return make_response(
                    reply_text=f"अरे वाह! बहुत प्यारा सवाल! 🌿 आपका सवाल: '{displayed_question}'\n\nजैसे आपकी मम्मी रसोई में खाना बनाती हैं, वैसे ही तुलसी का पौधा सूरज की धूप और पानी से अपनी पत्तियों में खाना बनाता है। इसे 'प्रकाश-संश्लेषण' कहते हैं!",
                    reply_speech_code="hi-IN",
                    phonetic_guide="Tulsi ka paudha sooraj ki dhoop se khana banata hai.",
                    emotion="happy",
                    interactive_question="अब आप बताइए, धूप के अलावा पौधे को खाना पकाने के लिए सबसे जरूरी क्या चाहिए?",
                    hint_available=True,
                    hint_text="जो आप रोज़ पौधे की जड़ में डालते हैं!",
                    suggested_quick_replies=["पानी (Water)", "हवा (Air)", "दोनों!"],
                    stars_awarded=2
                )

        # 5. Default encouraging exploratory response localized across 12 languages
        responses_by_lang = {
            "ta": {
                "text": f"மித்ரா இங்கே இருக்கிறேன்! நீங்கள் கேட்ட '{displayed_question}' மிக அருமையான சிந்தனை! நாம் இருவரும் சேர்ந்து இதை எளிதாகக் கற்றுக்கொள்ளலாம்!",
                "speech": "ta-IN",
                "question": "இந்தக் கருத்தைப் பற்றி உங்கள் வீட்டில் நீங்கள் எப்போதாவது கவனித்திருக்கிறீர்களா?",
                "hint": "உங்கள் ஆசிரியரோ அல்லது பாட்டியோ சொன்ன கதைகளை நினைவுபடுத்துங்கள்.",
                "replies": ["ஆம், பார்த்திருக்கிறேன்!", "இல்லை, விளக்குங்கள்", "ஒரு கதை சொல்லுங்கள்!"]
            },
            "hi": {
                "text": f"नमस्ते! मित्र यहाँ है! आपका सवाल '{displayed_question}' बहुत ही प्यारा और बढ़िया है। आइए इसे अपनी मातृभाषा में आसानी से समझें!",
                "speech": "hi-IN",
                "question": "क्या आपने अपनी रसोई या आसपास ऐसी कोई चीज़ देखी है?",
                "hint": "अपने आसपास की चीज़ों को ध्यान से देखिए!",
                "replies": ["हाँ देखा है!", "मुझे और समझाइए", "एक कहानी सुनाइए!"]
            },
            "te": {
                "text": f"నమస్కారం! మిత్ర ఇక్కడే ఉన్నాడు! మీరు అడిగిన '{displayed_question}' ప్రశ్న చాలా చక్కగా ఉంది. దీనిని మన మాతృభాషలో సులభంగా నేర్చుకుందాం!",
                "speech": "te-IN",
                "question": "ఈ విషయాన్ని మీ ఇంట్లో ఎప్పుడైనా గమనించారా?",
                "hint": "మీ అమ్మమ్మ లేదా ఉపాధ్యాయులు చెప్పిన కథలను గుర్తుచేసుకోండి.",
                "replies": ["అవును, చూశాను!", "నాకు వివరించండి", "కథ చెప్పండి!"]
            },
            "kn": {
                "text": f"ನಮಸ್ಕಾರ! ಮಿತ್ರ ಇಲ್ಲಿದ್ದಾನೆ! ನೀವು ಕೇಳಿದ '{displayed_question}' ಪ್ರಶ್ನೆ ತುಂಬಾ ಉತ್ತಮವಾಗಿದೆ. ಇದನ್ನು ನಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಸುಲಭವಾಗಿ ಕಲಿಯೋಣ!",
                "speech": "kn-IN",
                "question": "ಇದನ್ನು ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ಅಥವಾ ಊರಿನಲ್ಲಿ ಗಮನಿಸಿದ್ದೀರಾ?",
                "hint": "ನಿಮ್ಮ ಅಜ್ಜ-ಅಜ್ಜಿ ಹೇಳಿದ ಕಥೆಗಳನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ.",
                "replies": ["ಹೌದು, ನೋಡಿದ್ದೇನೆ!", "ನನಗೆ ವಿವರಿಸಿ", "ಒಂದು ಕಥೆ ಹೇಳಿ!"]
            },
            "ml": {
                "text": f"നമസ്കാരം! മിത്ര ഇവിടെയുണ്ട്! നിങ്ങൾ ചോദിച്ച '{displayed_question}' വളരെ നല്ലൊരു ചോദ്യമാണ്. നമുക്ക് ഇത് മാതൃഭാഷയിൽ രസകരമായി പഠിക്കാം!",
                "speech": "ml-IN",
                "question": "ഇതിനെക്കുറിച്ച് നിങ്ങളുടെ വീട്ടിൽ കണ്ടിട്ടുണ്ടോ?",
                "hint": "മുത്തശ്ശി പറഞ്ഞ കഥകൾ ഓർത്തുനോക്കൂ.",
                "replies": ["അതെ, കണ്ടിട്ടുണ്ട്!", "വിശദീകരിച്ചു തരൂ", "ഒരു കഥ പറയൂ!"]
            },
            "bn": {
                "text": f"নমস্কার! মিত্র এখানে আছে! তোমার প্রশ্ন '{displayed_question}' খুবই সুন্দর। এসো আমাদের মাতৃভাষায় এটা সহজে শিখে নিই!",
                "speech": "bn-IN",
                "question": "তুমি কি তোমার ঘরে বা আশেপাশে এমন কিছু দেখেছ?",
                "hint": "ঠাকুমার বলা গল্পের কথা মনে করো।",
                "replies": ["হ্যাঁ, দেখেছি!", "আমায় বুঝিয়ে দাও", "একটা গল্প বলো!"]
            },
            "mr": {
                "text": f"नमस्कार! मित्र इथे आहे! तुमचा प्रश्न '{displayed_question}' खूप छान आहे. चला आपल्या मातृभाषेतून हे सोप्या भाषेत शिकूया!",
                "speech": "mr-IN",
                "question": "तुम्ही तुमच्या घरात किंवा परिसरात असे काही पाहिले आहे का?",
                "hint": "आजीने सांगितलेली गोष्ट आठवा.",
                "replies": ["हो, पाहिले आहे!", "मला समजावून सांगा", "एक गोष्ट सांगा!"]
            },
            "gu": {
                "text": f"નમસ્તે! મિત્ર અહીં છે! તમારો પ્રશ્ન '{displayed_question}' ખૂબ સારો છે. ચાલો આપણી માતૃભાષામાં સરળતાથી સમજીએ!",
                "speech": "gu-IN",
                "question": "શું તમે તમારા ઘરમાં આવું ક્યારેય જોયું છે?",
                "hint": "દાદીમાની વાર્તા યાદ કરો.",
                "replies": ["હા, જોયું છે!", "મને સમજાવો", "એક વાર્તા કહો!"]
            },
            "pa": {
                "text": f"ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮਿੱਤਰ ਇੱਥੇ ਹੈ! ਤੁਹਾਡਾ ਸਵਾਲ '{displayed_question}' ਬਹੁਤ ਵਧੀਆ ਹੈ। ਆਓ ਆਪਣੀ ਮਾਤ-ਭਾਸ਼ਾ ਵਿੱਚ ਇਸਨੂੰ ਸਮਝੀਏ!",
                "speech": "pa-IN",
                "question": "ਕੀ ਤੁਸੀਂ ਆਪਣੇ ਘਰ ਜਾਂ ਆਸਪਾਸ ਅਜਿਹਾ ਕੁਝ ਦੇਖਿਆ ਹੈ?",
                "hint": "ਦਾਦੀ ਜੀ ਦੀ ਸੁਣਾਈ ਕਹਾਣੀ ਯਾਦ ਕਰੋ।",
                "replies": ["ਹਾਂ, ਦੇਖਿਆ ਹੈ!", "ਮੈਨੂੰ ਸਮਝਾਓ", "ਇੱਕ ਕਹਾਣੀ ਸੁਣਾਓ!"]
            },
            "or": {
                "text": f"ନମସ୍କାର! ମିତ୍ର ଏଠାରେ ଅଛି! ତୁମର ପ୍ରଶ୍ନ '{displayed_question}' ବହୁତ ବଢ଼ିଆ। ଆସ ଆମ ମାତୃଭାଷାରେ ଏହାକୁ ସହଜରେ ଶିଖିବା!",
                "speech": "or-IN",
                "question": "ତୁମେ ନିଜ ଘରେ କେବେ ଏହା ଦେଖିଛ କି?",
                "hint": "ଜେଜେମା କହିଥିବା କଥା ମନେ ପକାଅ।",
                "replies": ["ହଁ, ଦେଖିଛି!", "ମୋତେ ବୁଝାନ୍ତୁ", "ଗୋଟିଏ ଗପ କୁହନ୍ତୁ!"]
            },
            "as": {
                "text": f"নমস্কাৰ! মিত্ৰ ইয়াত আছে! তোমাৰ প্ৰশ্ন '{displayed_question}' বৰ ধুনীয়া। আহা আমাৰ মাতৃভাষাত ইয়াক সহজকৈ বুজি লওঁ!",
                "speech": "as-IN",
                "question": "তোমাৰ ঘৰত বা ওচৰ-পাঁজৰত কেতিয়াবা এনেকুৱা দেখিছানে?",
                "hint": "আইতাই কোৱা সাধুকথা মনত পেলোৱা।",
                "replies": ["হয়, দেখিছো!", "মোক বুজাই দিয়া", "এটা সাধু কোৱা!"]
            },
            "sat": {
                "text": f"ᱡᱚᱦᱟᱨ! ᱢᱤᱛᱨᱟ ᱱᱚᱰᱮ ᱢᱮᱱᱟᱹᱧᱟ! ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ '{displayed_question}' ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭᱟ᱾ ᱫᱮᱞᱟ ᱟᱵᱚᱣᱟᱜ ᱟᱭᱳ ᱟᱲᱟᱝ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱱᱚᱣᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜᱼᱟ!",
                "speech": "sat-IN",
                "question": "ᱱᱚᱣᱟ ᱵᱟᱵᱚᱛ ᱟᱢ ᱚᱲᱟᱜ ᱨᱮ ᱥᱮ ᱟᱹᱛᱩ ᱨᱮ ᱧᱮᱞ ᱟᱠᱟᱫᱟᱢ?",
                "hint": "ᱟᱢ ᱜᱚᱲᱚᱢ ᱦᱟᱲᱟᱢ ᱥᱮ ᱜᱚᱲᱚᱢ ᱵᱩᱰᱷᱤ ᱞᱟᱹᱭ ᱟᱠᱟᱫ ᱠᱟᱹᱦᱱᱤ ᱩᱭᱦᱟᱹᱨ ᱢᱮ᱾",
                "replies": ["ᱦᱮᱸ, ᱧᱮᱞ ᱟᱠᱟᱫᱟᱹᱧ!", "ᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱟᱹᱧ ᱢᱮ", "ᱢᱤᱫᱴᱟᱝ ᱠᱟᱹᱦᱱᱤ ᱞᱟᱹᱭ ᱢᱮ!"]
            },
            "khr": {
                "text": f"गोड़ लागो ही! संगी मित्रा हियां हाजिर है! तोहर सवाल '{displayed_question}' बहुत सुंदर हके। आवा आपन मातृभाषा खोरठा में एकरा सोझ से सीखब!",
                "speech": "khr-IN",
                "question": "की तोहे आपन घरे या आसपास अइसन देखले ह?",
                "hint": "आजी-दादी के कहल कहानी याद करा।",
                "replies": ["हँ देखले हियै!", "हमरा समझावा", "एगो कहनी सुनावा!"]
            },
            "en": {
                "text": f"Hello little friend! Mitra is here! Your question '{displayed_question}' is wonderful. Let us discover the answer together!",
                "speech": "en-US",
                "question": "Have you ever observed something like this in your daily life?",
                "hint": "Think about what happens in the kitchen or outside.",
                "replies": ["Yes, I have!", "Explain more!", "Tell me a story!"]
            }
        }

        chosen = responses_by_lang.get(target_lang, responses_by_lang["ta"])
        return make_response(
            reply_text=chosen["text"],
            reply_speech_code=chosen["speech"],
            emotion="curious",
            interactive_question=chosen["question"],
            hint_available=True,
            hint_text=chosen["hint"],
            suggested_quick_replies=chosen["replies"],
            stars_awarded=1
        )

    def generate_hint(self, req: TutorHintRequest) -> TutorHintResponse:
        """
        Provides progressive graduated scaffolding (Level 1 Nudge -> Level 2 Metaphor -> Level 3 Direct Guidance)
        so children never get stuck or discouraged.
        """
        is_tamil = req.target_lang.lower() == "ta"
        is_santhali = req.target_lang.lower() == "sat"
        is_khortha = req.target_lang.lower() == "khr"

        if req.hint_level == 1:
            if is_santhali:
                hint_text = "ᱩᱭᱦᱟᱹᱨ ᱢᱮ: ᱟᱢᱟᱜ ᱚᱲᱟᱜ ᱨᱮ ᱟᱭᱳ ᱫᱤᱱᱟᱹᱢ ᱪᱩᱞᱦᱟᱹ ᱨᱮ ᱫᱟᱠᱟ ᱩᱛᱩ ᱡᱚᱠᱷᱚᱱ ᱪᱮᱫ ᱦᱩᱭᱩᱜᱼᱟ?"
                clue = "ᱚᱲᱟᱜ ᱪᱩᱞᱦᱟᱹ"
                encouragement = "ᱟᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟᱢ! ᱢᱤᱫ ᱫᱷᱟᱣ ᱪᱮᱥᱴᱟᱭ ᱢᱮ! 🌟"
            elif is_khortha:
                hint_text = "सोचा: जब घरे माय रंधन करे हथ त की होवो है?"
                clue = "घरे के भान्साघर"
                encouragement = "तोहे कर सक ह! एक बेर कोशिश करा! 🌟"
            elif is_tamil:
                hint_text = "யோசித்துப் பாருங்கள்: உங்கள் வீட்டில் அம்மா தினமும் சமைக்கும் போது என்ன நடக்கும்?"
                clue = "வீட்டு சமையலறை"
                encouragement = "உங்களால் முடியும்! ஒரு சிறு முயற்சி செய்து பாருங்கள்! 🌟"
            else:
                hint_text = "सोचिए: जब मम्मी घर में खाना बनाती हैं तो क्या होता है?"
                clue = "रसोईघर"
                encouragement = "आप कर सकते हैं! एक बार कोशिश कीजिए! 🌟"
        elif req.hint_level == 2:
            if is_santhali:
                hint_text = "ᱫᱟᱠᱟ ᱴᱩᱠᱩᱡ ᱪᱮᱛᱟᱱ ᱛᱷᱟᱹᱨᱤ ᱨᱮ ᱫᱟᱜ ᱴᱷᱤᱯᱤᱨ ᱡᱟᱣᱨᱟᱜ ᱧᱮᱞ ᱟᱠᱟᱫᱟᱢ? ᱚᱱᱟ ᱫᱚ ᱵᱷᱟᱯ ᱨᱮᱭᱟᱲ ᱠᱟᱛᱮ ᱦᱩᱭᱩᱜᱼᱟ!"
                clue = "ᱵᱷᱟᱯ ᱨᱮᱭᱟᱲ (Condensation)"
                encouragement = "ᱟᱹᱰᱤ ᱥᱩᱨ ᱮᱢ ᱥᱮᱴᱮᱨ ᱮᱱᱟ! ᱥᱟᱵᱟᱥ! 🚀"
            elif is_khortha:
                hint_text = "डेगची के ढक्कन पर भाप के बूंद के याद करा, ई भाप के ठंडा भेला से होवो है!"
                clue = "भाप के ठंडा होवेक (Condensation)"
                encouragement = "बहुत नजदीक पहुँच गेल ह! शाबाश! 🚀"
            elif is_tamil:
                hint_text = "இட்லிப் பானைத் தட்டின் கீழ் பனித்துளிகள் போல நீர் சேர்வதை கவனித்திருக்கிறீர்களா? அது நீராவியால் நடக்கிறது!"
                clue = "நீராவி குளிர்வடைதல் (Condensation)"
                encouragement = "மிக நெருங்கி வந்துவிட்டீர்கள்! சபாஷ்! 🚀"
            else:
                hint_text = "पतीले के ढक्कन पर भाप की बूंदों को याद कीजिए, यह भाप के ठंडे होने से होता है!"
                clue = "भाप का संघनन (Condensation)"
                encouragement = "बहुत करीब हैं आप! शाबाश! 🚀"
        else:
            if is_santhali:
                hint_text = "ᱥᱟᱹᱨᱤ ᱛᱮᱞᱟ ᱫᱚ ᱱᱚᱣᱟ ᱠᱟᱱᱟ: ᱥᱤᱸᱜᱤ ᱵᱮᱲᱟ ᱞᱚᱞᱚ ᱛᱮ ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱨᱟᱠᱟᱵᱼᱟ ᱟᱨ ᱨᱮᱭᱟᱲ ᱠᱟᱛᱮ ᱫᱟᱜ ᱡᱟᱹᱲᱤ ᱦᱩᱭᱩᱜᱼᱟ!"
                clue = "ᱫᱟᱜ ᱪᱚᱠᱨᱚ (Water Cycle)"
                encouragement = "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱱᱤᱛᱚᱜ ᱱᱚᱣᱟ ᱠᱟᱛᱷᱟ ᱟᱢᱟᱜ ᱟᱲᱟᱝ ᱛᱮ ᱨᱚᱲ ᱢᱮ! 👏"
            elif is_khortha:
                hint_text = "सही उत्तर: सुरुज के घाम से पानी भाप बन के ऊपर जाहो है आउर ठंडा होके पानि बरसे है!"
                clue = "जल चक्र (Water Cycle)"
                encouragement = "शानदार! अब एकरा आपन बोली में बोल के देखा! 👏"
            elif is_tamil:
                hint_text = "சரியான விடை இதோ: சூரிய வெப்பத்தால் நீர் மேலே சென்று, குளிர்ந்து மழையாக மாறுகிறது!"
                clue = "மழை சுழற்சி (Water Cycle)"
                encouragement = "அற்புதம்! இப்போது இந்தக் கருத்தை உங்கள் சொந்த வார்த்தைகளில் சொல்லிப் பாருங்கள்! 👏"
            else:
                hint_text = "सही उत्तर: सूरज की गर्मी से पानी भाप बनकर ऊपर जाता है और ठंडा होकर बारिश बनता है!"
                clue = "जल चक्र (Water Cycle)"
                encouragement = "शानदार! अब इसे अपने शब्दों में बोलकर देखिए! 👏"

        return TutorHintResponse(
            hint_level=req.hint_level,
            hint_text=hint_text,
            local_clue=clue,
            encouragement=encouragement
        )

tutor_service = TutorService()
