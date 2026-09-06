"""
Vernacular Pedagogy Engine: Culturally Rooted Conceptual Learning
Replaces abstract concepts with Indian indigenous metaphors (kitchen idli pots,
Vaigai & Kaveri rivers, village banyan trees, festive clay lamps, local weekly markets).
"""
import uuid
from typing import Dict, Any, List
from backend.config import settings
from backend.models.schemas import PedagogyExplainRequest, PedagogyExplainResponse
from backend.services.speech_service import speech_service

# Rich Indian Cultural Conceptual Metaphor Knowledge Base
PEDAGOGY_CONCEPTS_DB = [
    {
        "id": "concept-water-cycle",
        "keywords": ["rain", "water cycle", "clouds", "sky", "evaporation", "precipitation", "மழை", "நீர்"],
        "topic": "The Water Cycle (மழை சுழற்சி / जल चक्र)",
        "category": "Science - Earth & Environment",
        "grade": "Class 4",
        "local_metaphors": {
            "ta": {
                "pedagogy_title": "அம்மா சமைக்கும் இட்லிப் பானையும், வானத்துப் பஞ்சு மேகங்களும்!",
                "vernacular_explanation": "நம் வீட்டில் அம்மா இட்லி சமைக்கும் போது பானையில் இருந்து வெள்ளை ஆவி மேலே போவதைப் பார்த்திருக்கிறீர்களா? அதே போல, வெயிலில் ஆறு மற்றும் குளத்து நீர் ஆவியாகி மேலே பறந்து, குளிர்ந்த காற்றில் ஒன்றுசேர்ந்து கருமேகமாகிறது. மேகம் கனத்தவுடன் முத்து முத்தாக மழை பெய்கிறது!",
                "local_metaphor": "இட்லிப் பானைத் தட்டில் படியும் நீர்த்துளிகள் போல, வானத்து மேகங்களில் இருந்து குளிர்ந்த காற்று பட்டு விழும் மழை.",
                "context_hook": "மதுரை வைகை ஆறும், கிராமத்துக் குளத்து மீன்களும்",
                "cultural_keywords": [
                    {"term": "ஆவியாதல்", "meaning": "வெப்பத்தில் நீர் நீராவியாக மேலே செல்வது (Evaporation)"},
                    {"term": "குளிர்வடைதல்", "meaning": "ஆவி குளிர்ந்து மேகமாவது (Condensation)"},
                    {"term": "மழைப்பொழிவு", "meaning": "மண்ணைச் செழிக்க வைக்கும் மழை (Precipitation)"}
                ],
                "familiar_objects": ["இட்லிப் பானை (Idli Steamer)", "சுடுநீர் பாத்திரம் (Hot Water Vessel)", "வைகை ஆறு (River)", "நெற்பயிர் (Paddy field)"],
                "literal": "வானத்திலிருந்து மழை ஏன் பெய்கிறது?",
                "phonetic": "Vaanathilirundhu mazhai yen peigiradhu?",
                "quiz": {
                    "question": "இட்லிப் பானை மூடியைத் திறக்கும்போது உள்ளே சொட்டும் நீர்த்துளிகள் எதைப் போன்றது?",
                    "options": ["மழைத்துளிகள்", "சூரிய ஒளி", "நிலா", "காற்று"],
                    "correct": "மழைத்துளிகள்",
                    "explanation": "சூடான ஆவி குளிர்ந்த தட்டில் படும்போது மழையைப் போலவே நீர்த்துளியாக மாறுகிறது!"
                }
            },
            "hi": {
                "pedagogy_title": "रसोई की गर्म चाय की केतली और आसमान के रुई जैसे बादल!",
                "vernacular_explanation": "जब घर में चाय उबलती है तो ढक्कन पर भाप की नन्ही बूंदें जम जाती हैं ना? ठीक वैसे ही, गंगा नदी और तालाब का पानी धूप से भाप बनकर आसमान में उड़ता है और ठंडी हवा लगने पर बादल बनकर खेतों पर छम-छम बरसता है!",
                "local_metaphor": "उबलती दाल और पतीले की भाप जो आसमान में जाकर सावन की फुहार बनती है।",
                "context_hook": "गांव की गंगा नदी, हरियाली और सावन का झूला",
                "cultural_keywords": [
                    {"term": "वाष्पीकरण", "meaning": "धूप से पानी का भाप बनना (Evaporation)"},
                    {"term": "संघनन", "meaning": "भाप का बादल बनना (Condensation)"},
                    {"term": "वर्षा", "meaning": "आसमान से बूंदों का बरसना (Rainfall)"}
                ],
                "familiar_objects": ["चाय की केतली", "पतीले का ढक्कन", "गंगा नदी", "किसान के खेत"],
                "literal": "आसमान से बारिश क्यों होती है?",
                "phonetic": "Aasman se baarish kyon hoti hai?",
                "quiz": {
                    "question": "नदी का पानी भाप बनकर आसमान में क्या बनाता है?",
                    "options": ["बादल", "सूरज", "सितारे", "हवा"],
                    "correct": "बादल",
                    "explanation": "पानी की भाप ऊपर जाकर ठंडी होती है और बादल का रूप लेती है!"
                }
            },
            "te": {
                "pedagogy_title": "అమ్మ వంటగది ఆవిరి మరియు గోదావరి నది చినుకులు!",
                "vernacular_explanation": "వేడి అన్నం వండేటప్పుడు మూత తీస్తే నీటి బిందువులు కనిపిస్తాయి కదా? అదేవిధంగా గోదావరి నది నీరు ఎండ వేడికి ఆవిరై మేఘాలుగా మారి చివరకు వర్షంగా కురుస్తుంది.",
                "local_metaphor": "వంట పాత్ర మూతపై చేరే నీటి బిందువుల వంటిదే వర్షం.",
                "context_hook": "గోదావరి తీరం, పచ్చని పొలాలు",
                "cultural_keywords": [
                    {"term": "భాష్పీభవనం", "meaning": "నీరు ఆవిరి కావడం (Evaporation)"},
                    {"term": "సాంద్రీకరణం", "meaning": "మేఘం చల్లబడడం (Condensation)"},
                    {"term": "వర్షపాతం", "meaning": "వాన కురవడం (Precipitation)"}
                ],
                "familiar_objects": ["అన్నం పాత్ర మూత", "గోదావరి నది", "వరి చేను"],
                "literal": "ఆకాశం నుండి వర్షం ఎందుకు కురుస్తుంది?",
                "phonetic": "Aakaasham nundi varsham enduku kurusthundi?",
                "quiz": {
                    "question": "ఎండ వేడిమి వల్ల నది నీరు ఏమవుతుంది?",
                    "options": ["ఆవిరవుతుంది", "గడ్డకడుతుంది", "మాయమవుతుంది"],
                    "correct": "ఆవిరవుతుంది",
                    "explanation": "సూర్యరశ్మికి నీరు ఆవిరై ఆకాశంలో మేఘాలుగా మారుతుంది!"
                }
            },
            "kn": {
                "pedagogy_title": "ಮನೆ ಅಡುಗೆಯ ಬಿಸಿ ಸಾರಿನ ಹಬೆ ಮತ್ತು ಕಾವೇರಿ ನದಿಯ ಮಳೆ ಮೋಡಗಳು!",
                "vernacular_explanation": "ಅಮ್ಮ ಅಡುಗೆಮನೆಯಲ್ಲಿ ಬಿಸಿ ಸಾರು ಕುದಿಸುವಾಗ ಹಬೆ ಮೇಲೆ ಹೋಗಿ ಮುಚ್ಚಳದ ಮೇಲೆ ನೀರಿನ ಹನಿಗಳಾಗುವುದನ್ನು ನೋಡಿದ್ದೀರಾ? ಹಾಗೆಯೇ, ಕಾವೇರಿ ನದಿಯ ನೀರು ಸೂರ್ಯನ ಬಿಸಿಲಿಗೆ ಆವಿಯಾಗಿ ಮೇಲೆ ಹೋಗಿ ತಣ್ಣನೆಯ ಗಾಳಿಯಿಂದ ಮೋಡವಾಗುತ್ತದೆ. ನಂತರ ತಂಪಾದ ಮಳೆಯಾಗಿ ಸುರಿಯುತ್ತದೆ!",
                "local_metaphor": "ಅಡುಗೆಯ ಬಿಸಿ ಪಾತ್ರೆಯ ಮುಚ್ಚಳದ ಮೇಲಿನ ನೀರಿನ ಹನಿಗಳಂತೆ ಆಕಾಶದಿಂದ ಸುರಿಯುವ ಮಳೆ.",
                "context_hook": "ಕಾವೇರಿ ನದಿ ತೀರ, ಹಚ್ಚಹಸಿರಿನ ಗದ್ದೆಗಳು",
                "cultural_keywords": [
                    {"term": "ಆವೀಕರಣ (Evaporation)", "meaning": "ಬಿಸಿಲಿಗೆ ನೀರು ಆವಿಯಾಗುವುದು"},
                    {"term": "ಸಾಂದ್ರೀಕರಣ (Condensation)", "meaning": "ಆವಿ ತಣ್ಣಗಾಗಿ ಮೋಡವಾಗುವುದು"},
                    {"term": "ಮಳೆಹನಿ (Precipitation)", "meaning": "ಮೋಡದಿಂದ ಮಳೆಯಾಗಿ ಬೀಳುವುದು"}
                ],
                "familiar_objects": ["ಸಾರಿನ ಪಾತ್ರೆ", "ಕಾವೇರಿ ನದಿ", "ಭತ್ತದ ಗದ್ದೆ"],
                "literal": "ಆಕಾಶದಿಂದ ಮಳೆ ಏಕೆ ಬೀಳುತ್ತದೆ?",
                "phonetic": "Aakashadinda male eke beeluttade?",
                "quiz": {
                    "question": "ನದಿಯ ನೀರು ಸೂರ್ಯನ ಬಿಸಿಲಿಗೆ ಏನಾಗುತ್ತದೆ?",
                    "options": ["ಆವಿಯಾಗುತ್ತದೆ", "ಕಲ್ಲಿನಂತಾಗುತ್ತದೆ", "ಕಣ್ಮರೆಯಾಗುತ್ತದೆ"],
                    "correct": "ಆವಿಯಾಗುತ್ತದೆ",
                    "explanation": "ಸೂರ್ಯನ ಶಾಖದಿಂದ ನೀರು ಆವಿಯಾಗಿ ಆಕಾಶಕ್ಕೆ ಏರುತ್ತದೆ!"
                }
            },
            "ml": {
                "pedagogy_title": "അടുക്കളയിലെ തിളച്ച ചായയുടെ ആവിയും പെരിയാറിലെ മഴമേഘങ്ങളും!",
                "vernacular_explanation": "അമ്മ അടുക്കളയിൽ ചായ തിളപ്പിക്കുമ്പോൾ ആവി മുകളിലേക്ക് പോയി തളികയിൽ തണുത്തു വെള്ളത്തുള്ളികളാകുന്നത് കണ്ടിട്ടുണ്ടോ? അതുപോലെ പെരിയാർ നദിയിലെ വെള്ളം വെയിൽ കൊണ്ട് ആവിയായി ആകാശത്തു പോയി മഴമേഘങ്ങളായി മാറുന്നു. പിന്നീട് തണുത്തു മനോഹരമായ മഴയായി പെയ്യുന്നു!",
                "local_metaphor": "ചായപാത്രത്തിന്റെ തട്ടിൽ വീഴുന്ന നീർത്തുള്ളികൾ പോലെയാണ് മഴ പെയ്യുന്നത്.",
                "context_hook": "പെരിയാർ നദിയും പച്ചപ്പാർന്ന തെങ്ങിൻ തോപ്പുകളും",
                "cultural_keywords": [
                    {"term": "ബാഷ്പീകരണം (Evaporation)", "meaning": "ചൂടിൽ വെള്ളം ആവിയാകുന്നത്"},
                    {"term": "സാന്ദ്രീകരണം (Condensation)", "meaning": "ആവി തണുത്തു മേഘമാകുന്നത്"}
                ],
                "familiar_objects": ["ചായപ്പാത്രം", "പെരിയാർ നദി", "കായൽ"],
                "literal": "ആകാശത്തുനിന്ന് മഴ പെയ്യുന്നത് എന്തുകൊണ്ട്?",
                "phonetic": "Aakasathuninnum mazha peyyunnathu enthukondu?",
                "quiz": {
                    "question": "സൂര്യന്റെ ചൂടുകൊണ്ട് പുഴയിലെ വെള്ളം എന്തായി മാറുന്നു?",
                    "options": ["ആവിയായി മാറുന്നു", "ഐസായി മാറുന്നു", "മണ്ണായി മാറുന്നു"],
                    "correct": "ആവിയായി മാറുന്നു",
                    "explanation": "സൂര്യന്റെ ചൂടിൽ ജലം നീരാവിയായി ഉയരുന്നു!"
                }
            },
            "bn": {
                "pedagogy_title": "রান্নাঘরের গরম ভাতের বাষ্প আর বর্ষার কালো মেঘ!",
                "vernacular_explanation": "মা যখন রান্নাঘরে গরম ভাত ফোটান, তখন ঢাকনার নিচে কেমন জলের ফোঁটা জমে দেখেছ? ঠিক তেমনই গঙ্গা নদী ও পুকুরের জল রোদের তাপে বাষ্প হয়ে আকাশে উঠে মেঘ হয়, আর ঠান্ডা বাতাস লাগতেই ঝমঝম করে বৃষ্টি ঝরে পড়ে!",
                "local_metaphor": "ভাতের হাঁড়ির ঢাকনার জলের বিন্দুর মতোই আকাশ থেকে বৃষ্টি পড়ে।",
                "context_hook": "গ্রামের গঙ্গা নদী আর সবুজে ভরা ধানের ক্ষেত",
                "cultural_keywords": [
                    {"term": "বাষ্পীভবন (Evaporation)", "meaning": "জল বাষ্প হয়ে ওপরে ওঠা"},
                    {"term": "ঘনীভবন (Condensation)", "meaning": "বাষ্প ঠান্ডা হয়ে মেঘ হওয়া"}
                ],
                "familiar_objects": ["ভাতের হাঁড়ির ঢাকনা", "গঙ্গা নদী", "পুকুর"],
                "literal": "আকাশ থেকে বৃষ্টি কেন পড়ে?",
                "phonetic": "Aakash theke brishti keno pore?",
                "quiz": {
                    "question": "নদীর জল সূর্যের তাপে কী হয়?",
                    "options": ["বাষ্প হয়ে আকাশে ওড়ে", "বরফ হয়", "গাছে চলে যায়"],
                    "correct": "বাষ্প হয়ে আকাশে ওড়ে",
                    "explanation": "সূর্যের তাপে জল বাষ্প হয়ে মেঘের সৃষ্টি করে!"
                }
            },
            "mr": {
                "pedagogy_title": "घरातील गरम चहाची वाफ आणि पावसाचे काळे ढग!",
                "vernacular_explanation": "आईने घरात चहा उकळायला ठेवल्यावर झाकणावर पाण्याचे थेंब जमतात ना? तसेच नदी आणि तलावाचे पाणी उन्हामुळे वाफ होऊन आकाशात जाते व थंड हवेने ढग बनून शेतात पाऊस पाडते!",
                "local_metaphor": "चहाच्या किटलीच्या वाफेसारखे आकाशात जाणारे पाणी आणि पाऊस.",
                "context_hook": "गोदावरी नदी आणि हिरवीगार शेतं",
                "cultural_keywords": [
                    {"term": "बाष्पीभवन (Evaporation)", "meaning": "पाण्याची वाफ होणे"},
                    {"term": "संघनन (Condensation)", "meaning": "वाफेचे ढग होणे"}
                ],
                "familiar_objects": ["चहाची किटली", "गोदावरी नदी", "शेत"],
                "literal": "आकाशातून पाऊस का पडतो?",
                "phonetic": "Aakashatun paus ka padto?",
                "quiz": {
                    "question": "नदीचे पाणी उन्हाने काय बनते?",
                    "options": ["वाफ बनते", "दगड बनते", "माती बनते"],
                    "correct": "वाफ बनते",
                    "explanation": "उन्हाच्या उष्णतेने पाणी वाफ होऊन आकाशात जाते!"
                }
            },
            "gu": {
                "pedagogy_title": "રસોડાની ચાની કીટલીની વરાળ અને આકાશના વાદળો!",
                "vernacular_explanation": "રસોડામાં ગરમ ચા ઉકળે ત્યારે ઢાંકણ પર વરાળના ટીપાં બાઝી જાય છે ને? તેવી જ રીતે નર્મદા નદીનું પાણી સૂર્યના તાપથી વરાળ બની આકાશમાં વાદળ બને છે અને ઠંડી હવા મળતા વરસાદ બનીને વરસે છે!",
                "local_metaphor": "તપેલીના ઢાંકણ પરના પાણીના ટીપાં જેવો જ આકાશનો વરસાદ.",
                "context_hook": "નર્મદા નદી અને ખેતરોની હરિયાળી",
                "cultural_keywords": [
                    {"term": "બાષ્પીભવન (Evaporation)", "meaning": "પાણીનું વરાળ બનવું"},
                    {"term": "ઘનીભવન (Condensation)", "meaning": "વરાળ ઠંડી થઈ વાદળ બનવું"}
                ],
                "familiar_objects": ["ચાની કીટલી", "નર્મદા નદી", "ખેતર"],
                "literal": "આકાશમાંથી વરસાદ કેમ પડે છે?",
                "phonetic": "Aakashmathi varsad kem pade chhe?",
                "quiz": {
                    "question": "સૂર્યની ગરમીથી નદીનું પાણી શું બને છે?",
                    "options": ["વરાળ બને છે", "બરફ બને છે", "માટી બને છે"],
                    "correct": "વરાળ બને છે",
                    "explanation": "સૂર્યના તાપથી પાણી વરાળ બનીને આકાશમાં ઊડે છે!"
                }
            },
            "pa": {
                "pedagogy_title": "ਰਸੋਈ ਵਿੱਚ ਚਾਹ ਦੀ ਭਾਫ਼ ਅਤੇ ਸਾਵਣ ਦੇ ਕਾਲੇ ਬੱਦਲ!",
                "vernacular_explanation": "ਜਦੋਂ ਘਰ ਵਿੱਚ ਚਾਹ ਉਬਲਦੀ ਹੈ ਤਾਂ ਢੱਕਣ ਉੱਤੇ ਪਾਣੀ ਦੀਆਂ ਨਿੱਕੀਆਂ ਬੂੰਦਾਂ ਜੰਮ ਜਾਂਦੀਆਂ ਹਨ। ਇਸੇ ਤਰ੍ਹਾਂ ਸਤਲੁਜ ਦਰਿਆ ਦਾ ਪਾਣੀ ਧੁੱਪ ਨਾਲ ਭਾਫ਼ ਬਣ ਕੇ ਅਸਮਾਨ ਵਿੱਚ ਬੱਦਲ ਬਣਦਾ ਹੈ ਅਤੇ ਠੰਢੀ ਹਵਾ ਲੱਗਣ ਤੇ ਛਮ-ਛਮ ਮੀਂਹ ਬਣ ਕੇ ਵਰ੍ਹਦਾ ਹੈ!",
                "local_metaphor": "ਉਬਲਦੀ ਚਾਹ ਦੀ ਭਾਫ਼ ਵਾਂਗ ਹੀ ਅਸਮਾਨ ਵਿੱਚ ਬੱਦਲ ਬਣਦੇ ਹਨ।",
                "context_hook": "ਪੰਜਾਬ ਦੇ ਦਰਿਆ ਅਤੇ ਹਰੇ-ਭਰੇ ਖੇਤ",
                "cultural_keywords": [
                    {"term": "ਵਾਸ਼ਪੀਕਰਨ (Evaporation)", "meaning": "ਪਾਣੀ ਦਾ ਭਾਫ਼ ਬਣਨਾ"},
                    {"term": "ਸੰਘਣਨ (Condensation)", "meaning": "ਭਾਫ਼ ਦਾ ਬੱਦਲ ਬਣਨਾ"}
                ],
                "familiar_objects": ["ਚਾਹ ਦੀ ਪਤੀਲੀ", "ਦਰਿਆ", "ਖੇਤ"],
                "literal": "ਅਸਮਾਨ ਤੋਂ ਮੀਂਹ ਕਿਉਂ ਪੈਂਦਾ ਹੈ?",
                "phonetic": "Aasmaan ton meenh kyon painda hai?",
                "quiz": {
                    "question": "ਧੁੱਪ ਦੀ ਗਰਮੀ ਨਾਲ ਦਰਿਆ ਦਾ ਪਾਣੀ ਕੀ ਬਣਦਾ ਹੈ?",
                    "options": ["ਭਾਫ਼ ਬਣਦਾ ਹੈ", "ਬਰਫ਼ ਬਣਦਾ ਹੈ", "ਪੱਥਰ ਬਣਦਾ ਹੈ"],
                    "correct": "ਭਾਫ਼ ਬਣਦਾ ਹੈ",
                    "explanation": "ਸੂਰਜ ਦੀ ਗਰਮੀ ਨਾਲ ਪਾਣੀ ਭਾਫ਼ ਬਣ ਕੇ ਉੱਪਰ ਉੱਡਦਾ ਹੈ!"
                }
            },
            "or": {
                "pedagogy_title": "ରୋଷେଇ ଘରର ଚାହା ଭାମ୍ପ ଏବଂ ମହାନଦୀର ବର୍ଷା ବାଦଲ!",
                "vernacular_explanation": "ରୋଷେଇ ଘରେ ଚାହା ଫୁଟିଲା ବେଳେ ଢାଙ୍କୁଣୀ ଉପରେ ପାଣି ଟୋପା ଜମିବା ଦେଖିଛ କି? ସେହିପରି ମହାନଦୀର ଜଳ ଖରାରେ ବାଷ୍ପ ହୋଇ ଆକାଶକୁ ଯାଇ ବାଦଲ ହୁଏ ଏବଂ ଥଣ୍ଡା ପବନ ବାଜିଲେ ବର୍ଷା ହୋଇ ଝରେ!",
                "local_metaphor": "ଚାହା ଢାଙ୍କୁଣୀର ଜଳବିନ୍ଦୁ ପରି ଆକାଶରୁ ବର୍ଷା ଝରେ।",
                "context_hook": "ମହାନଦୀ କୂଳ ଓ ସବୁଜ ଧାନ କ୍ଷେତ",
                "cultural_keywords": [
                    {"term": "ବାଷ୍ପୀଭବନ (Evaporation)", "meaning": "ପାଣି ବାଷ୍ପ ହେବା"},
                    {"term": "ଘନୀଭବନ (Condensation)", "meaning": "ବାଷ୍ପ ଥଣ୍ଡା ହୋଇ ବାଦଲ ହେବା"}
                ],
                "familiar_objects": ["ଚାହା ଡେକ୍ଚି", "ମହାନଦୀ", "ଧାନ କ୍ଷେତ"],
                "literal": "ଆକାଶରୁ ବର୍ଷା କାହିଁକି ହୁଏ?",
                "phonetic": "Aakasharu barsha kahinki hue?",
                "quiz": {
                    "question": "ଖରାରେ ନଦୀର ପାଣି କଣ ହୁଏ?",
                    "options": ["ବାଷ୍ପ ହୋଇ ଉଡେ", "ବରଫ ହୁଏ", "ମାଟି ହୁଏ"],
                    "correct": "ବାଷ୍ପ ହୋଇ ଉଡେ",
                    "explanation": "ଖରାର ଉତ୍ତାପରେ ପାଣି ବାଷ୍ପ ହୋଇ ଆକାଶକୁ ଯାଏ!"
                }
            },
            "as": {
                "pedagogy_title": "ৰান্ধনিশালৰ গৰম চাহৰ ধোঁৱা আৰু ব্ৰহ্মপুত্ৰৰ বৰষুণৰ ডাৱৰ!",
                "vernacular_explanation": "মায়ে যেতিয়া চাহ বা ভাত ৰান্ধে, ঢাকনিখনত পানীৰ টোপাল জমা হোৱা দেখিছানে? ঠিক তেনেকৈয়ে ব্ৰহ্মপুত্ৰৰ পানী ৰ’দত ভাপ হৈ আকাশলৈ গৈ ডাৱৰ হয় আৰু বতাহ লাগিলে বৰষুণ হৈ পৰে!",
                "local_metaphor": "চাহৰ ঢাকনিৰ পানী টোপালৰ দৰেই আকাশৰ পৰা বৰষুণ আহে।",
                "context_hook": "ব্ৰহ্মপুত্ৰ নদী আৰু সেউজীয়া ধাননি পথাৰ",
                "cultural_keywords": [
                    {"term": "বাষ্পীভৱন (Evaporation)", "meaning": "পানী ভাপ হোৱা"},
                    {"term": "ঘনীভৱন (Condensation)", "meaning": "ভাপ ডাৱৰ হোৱা"}
                ],
                "familiar_objects": ["চাহৰ ঢাকনি", "ব্ৰহ্মপুত্ৰ", "পথাৰ"],
                "literal": "আকাশৰ পৰা বৰষুণ কিয় পৰে?",
                "phonetic": "Aakashor pora boroxun kiyo pore?",
                "quiz": {
                    "question": "ৰ’দৰ উত্তাপত নদীৰ পানী কি হয়?",
                    "options": ["ভাপ হৈ ওপৰলৈ যায়", "বৰফ হয়", "শিল হয়"],
                    "correct": "ভাপ হৈ ওপৰলৈ যায়",
                    "explanation": "ৰ’দৰ উত্তাপত পানী ভাপ হৈ ডাৱৰ সৃষ্টি কৰে!"
                }
            },
            "en": {
                "pedagogy_title": "Kitchen Kettle Steam and Floating Rain Clouds!",
                "vernacular_explanation": "Have you seen steam rise when tea or soup boils in the kitchen? If you place a cool lid over it, the steam turns right back into tiny water droplets! The hot sun warms the river water into invisible vapor, which floats up, cools down into fluffy clouds, and falls down as refreshing rain!",
                "local_metaphor": "Water drops on a pot lid, just like rain falling from cooling clouds.",
                "context_hook": "Neighborhood rivers, green fields, and monsoon rain",
                "cultural_keywords": [
                    {"term": "Evaporation", "meaning": "Water turning into warm vapor"},
                    {"term": "Condensation", "meaning": "Vapor cooling into clouds"},
                    {"term": "Precipitation", "meaning": "Clouds releasing rain"}
                ],
                "familiar_objects": ["Kettle Lid", "River Water", "Raincoat"],
                "literal": "Why does rain fall from the sky?",
                "phonetic": "Why does rain fall from the sky?",
                "quiz": {
                    "question": "What happens to river water under the hot sun?",
                    "options": ["It turns into vapor", "It turns into stone", "It freezes into ice"],
                    "correct": "It turns into vapor",
                    "explanation": "Sunlight warms water into rising vapor that forms clouds!"
                }
            }
        }
    },
    {
        "id": "concept-photosynthesis",
        "keywords": ["sunlight", "plants", "leaves", "food", "photosynthesis", "தாவரங்கள்", "சூரிய ஒளி", "प्रकाश-संश्लेषण"],
        "topic": "Photosynthesis (ஒளிச்சேர்க்கை / प्रकाश-संश्लेषण)",
        "category": "Science - Botany",
        "grade": "Class 3",
        "local_metaphors": {
            "ta": {
                "pedagogy_title": "முற்றத்துத் துளசிச் செடியின் பச்சை சமையலறை!",
                "vernacular_explanation": "நம் வீட்டு முற்றத்தில் இருக்கும் துளசிச் செடியின் பச்சை இலைகள் ஒரு குட்டி சமையலறை போன்றவை! வேர்கள் தரும் தண்ணீரையும், காற்று தரும் கரியமில வாயுவையும் சேர்த்து, சூரியனின் ஒளி அடுப்பில் ருசியான மாவுச்சத்தை இலைகள் சமைக்கின்றன!",
                "local_metaphor": "அடுப்பின் வெப்பத்திற்குப் பதிலாக சூரிய ஒளியைப் பயன்படுத்தும் இயற்கையின் சமையல் கூடம்.",
                "context_hook": "வீட்டு முற்றத்துப் பூந்தொட்டியும், மாமரத்து இலைகளும்",
                "cultural_keywords": [
                    {"term": "பச்சையம்", "meaning": "இலைக்கு பச்சை நிறம் தரும் சாறு (Chlorophyll)"},
                    {"term": "ஒளிச்சேர்க்கை", "meaning": "சூரிய ஒளியால் உணவு தயாரித்தல் (Photosynthesis)"}
                ],
                "familiar_objects": ["துளசி மாடம்", "மாமரத்து இலை", "வீட்டு சமையலறை", "மண்பானைத் தண்ணீர்"],
                "literal": "தாவரங்கள் வளர சூரிய ஒளி தேவை.",
                "phonetic": "Thavarangal valara sooriya oli thevai.",
                "quiz": {
                    "question": "தாவரத்தின் சமையலறை என்று எதை அழைக்கிறோம்?",
                    "options": ["பச்சை இலை", "வேர்", "தண்டு", "மலர்"],
                    "correct": "பச்சை இலை",
                    "explanation": "பச்சை இலைகளில்தான் சூரிய ஒளியால் உணவு சமைக்கப்படுகிறது!"
                }
            },
            "hi": {
                "pedagogy_title": "आंगन के तुलसी के पौधे की जादुई हरी रसोई!",
                "vernacular_explanation": "जैसे मम्मी रसोई में चूल्हा जलाकर स्वादिष्ट रोटी बनाती हैं, वैसे ही तुलसी के पौधे की हरी पत्तियां सूरज की धूप को चूल्हा बनाकर अपना भोजन तैयार करती हैं!",
                "local_metaphor": "सूरज की रोशनी की आंच पर पकने वाला पौधे का जादुई भोजन।",
                "context_hook": "आंगन का तुलसी चौरा और नीम का पेड़",
                "cultural_keywords": [
                    {"term": "क्लोरोफिल (हरितलवक)", "meaning": "पत्तियों का हरा रंग"},
                    {"term": "प्रकाश-संश्लेषण", "meaning": "धूप से भोजन पकाना"}
                ],
                "familiar_objects": ["तुलसी का पौधा", "नीम की पत्ती", "रसोई का चूल्हा"],
                "literal": "पौधों को बढ़ने के लिए धूप की आवश्यकता होती है।",
                "phonetic": "Paudhon ko badhne ke liye dhoop ki aavashyakta hoti hai.",
                "quiz": {
                    "question": "पौधे का रसोईघर किसे कहा जाता है?",
                    "options": ["हरी पत्ती", "जड़", "तना"],
                    "correct": "हरी पत्ती",
                    "explanation": "हरी पत्तियां ही धूप से भोजन तैयार करती हैं!"
                }
            }
,
            "te": {
                "pedagogy_title": "ఆకుపచ్చ ఆకుల సహజ వంటగది!",
                "vernacular_explanation": "మనం ఇంట్లో పొయ్యి వెలిగించి వంట చేసినట్లే, మొక్కలు కూడా ఆకులలో వంట చేస్తాయి! సూర్యరశ్మి వాటి పొయ్యి, వేర్ల నుండి వచ్చే నీరు వాటి వంట పదార్థాలు. ఆకులోని పచ్చదనం ఎండను ఉపయోగించి ఆహారం తయారుచేస్తుంది.",
                "local_metaphor": "ఆకులే మొక్కల వంటగది, సూర్యకాంతే పొయ్యి.",
                "context_hook": "ఇంటి పెరటి మొక్కలు",
                "cultural_keywords": [{"term": "కిరణజన్య సంయోగక్రియ", "meaning": "కాంతి ద్వారా ఆహార తయారీ"}],
                "familiar_objects": ["తులసి మొక్క", "వేప ఆకు"],
                "literal": "మొక్కలు పెరగడానికి సూర్యరశ్మి అవసరం.",
                "phonetic": "Mokkalu peragadaniki sooryarashmi avasaram."
            },
            "kn": {
                "pedagogy_title": "ಹಸಿರು ಎಲೆಗಳ ಪ್ರಕೃತಿಯ ಅಡುಗೆಮನೆ!",
                "vernacular_explanation": "ನಾವು ಅಡುಗೆಮನೆಯಲ್ಲಿ ಅಡುಗೆ ಮಾಡುವಂತೆ, ಸಸ್ಯಗಳು ತಮ್ಮ ಹಸಿರು ಎಲೆಗಳಲ್ಲಿ ಅಡುಗೆ ಮಾಡುತ್ತವೆ! ಸೂರ್ಯನ ಬಿಸಿಲೇ ಅವುಗಳ ಒಲೆ, ಬೇರುಗಳಿಂದ ಹೀರುವ ನೀರು ಸಾಮಗ್ರಿ. ಎಲೆಯ ಹಸಿರು ಬಣ್ಣ ಬಿಸಿಲನ್ನು ಬಳಸಿ ಆಹಾರ ತಯಾರಿಸುತ್ತದೆ.",
                "local_metaphor": "ಎಲೆಯೇ ಸಸ್ಯದ ಅಡುಗೆಮನೆ, ಬಿಸಿಲೇ ಒಲೆ.",
                "context_hook": "ಮನೆಯ ತೋಟದ ಗಿಡಗಳು",
                "cultural_keywords": [{"term": "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ", "meaning": "ಬೆಳಕಿನಿಂದ ಆಹಾರ ತಯಾರಿಕೆ"}],
                "familiar_objects": ["ತುಳಸಿ ಗಿಡ", "ಬೇವಿನ ಎಲೆ"],
                "literal": "ಗಿಡಗಳು ಬೆಳೆಯಲು ಸೂರ್ಯನ ಬೆಳಕು ಬೇಕು.",
                "phonetic": "Gidagalu beleyalu sooryana belaku beku."
            },
            "ml": {
                "pedagogy_title": "പച്ചിലകളുടെ പ്രകൃതിദത്ത അടുക്കള!",
                "vernacular_explanation": "നമ്മുടെ വീട്ടിലെ അടുക്കളയിൽ ഭക്ഷണം പാകം ചെയ്യുന്നതുപോലെ സസ്യങ്ങൾ തങ്ങളുടെ പച്ചിലകളിൽ ഭക്ഷണം പാകം ചെയ്യുന്നു! സൂര്യപ്രകാശമാണ് അവയുടെ അടുപ്പ്. ഇലകളിലെ പച്ചനിറം സൂര്യപ്രകാശം ഉപയോഗിച്ച് ഭക്ഷണം ഉണ്ടാക്കുന്നു.",
                "local_metaphor": "ഇലകളാണ് സസ്യത്തിന്റെ അടുക്കള, സൂര്യപ്രകാശമാണ് അടുപ്പ്.",
                "context_hook": "മുറ്റത്തെ ചെടികൾ",
                "cultural_keywords": [{"term": "പ്രകാശസംശ്ലേഷണം", "meaning": "വെളിച്ചത്താൽ ഭക്ഷണം നിർമ്മിക്കൽ"}],
                "familiar_objects": ["തുളസിത്തറ", "വേപ്പില"],
                "literal": "ചെടികൾ വളരാൻ സൂര്യപ്രകാശം വേണം.",
                "phonetic": "Chedikal valaran sooryaprakaasham venam."
            },
            "bn": {
                "pedagogy_title": "সবুজ পাতার প্রাকৃতিক রান্নাঘর!",
                "vernacular_explanation": "যেমন মা রান্নাঘরে উনুন জ্বালিয়ে রান্না করেন, তেমনই গাছপালা নিজেদের সবুজ পাতার মধ্যে খাবার তৈরি করে! সূর্যের রোদ হলো তাদের উনুন। পাতার সবুজ রং সূর্যের আলো শুষে নিয়ে মিষ্টি খাবার বানায়।",
                "local_metaphor": "সবুজ পাতাই গাছের রান্নাঘর, সূর্যের রোদ উনুন।",
                "context_hook": "উঠোনের তুলসী মঞ্চ",
                "cultural_keywords": [{"term": "সালোকসংশ্লেষ", "meaning": "আলোর সাহায্যে খাদ্য তৈরি"}],
                "familiar_objects": ["তুলসী গাছ", "নিম পাতা"],
                "literal": "গাছের বৃদ্ধির জন্য সূর্যালোক প্রয়োজন।",
                "phonetic": "Gacher briddhir jonno soorjalok proyojon."
            },
            "mr": {
                "pedagogy_title": "हिरव्या पानांचे नैसर्गिक स्वयंपाकघर!",
                "vernacular_explanation": "आई स्वयंपाकघरात चूल पेटवून जेवण बनवते, तसेच वनस्पती आपल्या हिरव्या पानांमध्ये स्वतःचे अन्न तयार करतात! सूर्यप्रकाश ही त्यांची चूल आहे. पानांमधील हिरवा रंग सूर्यप्रकाशाच्या मदतीने अन्न शिजवतो.",
                "local_metaphor": "पान म्हणजे वनस्पतींचे स्वयंपाकघर आणि ऊन म्हणजे चूल.",
                "context_hook": "घरातील अंगण आणि झाडे",
                "cultural_keywords": [{"term": "प्रकाशसंश्लेषण", "meaning": "प्रकाशाने अन्न तयार करणे"}],
                "familiar_objects": ["तुळशीचे रोप", "कडुनिंबाचे पान"],
                "literal": "झाडे वाढण्यासाठी सूर्यप्रकाशाची गरज असते.",
                "phonetic": "Zhade vaadhnyasathi sooryaprakashachi garaj aste."
            },
            "gu": {
                "pedagogy_title": "લીલાં પાંદડાંનું કુદરતી રસોડું!",
                "vernacular_explanation": "જેમ મમ્મી રસોડામાં ગેસ પર રસોઈ બનાવે છે, તેમ છોડ પોતાના લીલાં પાંદડાંમાં ખોરાક બનાવે છે! સૂર્યનો તડકો એમનો ચૂલો છે અને પાંદડાંનો લીલો રંગ સૂર્યપ્રકાશથી ખોરાક રાંધે છે.",
                "local_metaphor": "પાંદડું છોડનું રસોડું અને તડકો ચૂલો.",
                "context_hook": "આંગણાનો તુલસી ક્યારો",
                "cultural_keywords": [{"term": "પ્રકાશસંશ્લેષણ", "meaning": "પ્રકાશથી ખોરાક બનાવવો"}],
                "familiar_objects": ["તુલસીનો છોડ", "લીમડાનું પાન"],
                "literal": "છોડને વધવા માટે સૂર્યપ્રકાશની જરૂર છે.",
                "phonetic": "Chhodne vadhva maate sooryaprakashni jaroor chhe."
            },
            "pa": {
                "pedagogy_title": "ਹਰੇ ਪੱਤਿਆਂ ਦੀ ਕੁਦਰਤੀ ਰਸੋਈ!",
                "vernacular_explanation": "ਜਿਵੇਂ ਮਾਂ ਰਸੋਈ ਵਿੱਚ ਚੁੱਲ੍ਹੇ 'ਤੇ ਖਾਣਾ ਬਣਾਉਂਦੀ ਹੈ, ਉਵੇਂ ਹੀ ਪੌਦੇ ਆਪਣੇ ਹਰੇ ਪੱਤਿਆਂ ਵਿੱਚ ਖਾਣਾ ਤਿਆਰ ਕਰਦੇ ਹਨ! ਸੂਰਜ ਦੀ ਧੁੱਪ ਉਹਨਾਂ ਦਾ ਚੁੱਲ੍ਹਾ ਹੈ ਅਤੇ ਪੱਤੇ ਆਪਣੇ ਹਰੇ ਰੰਗ ਨਾਲ ਭੋਜਨ ਬਣਾਉਂਦੇ ਹਨ।",
                "local_metaphor": "ਪੱਤਾ ਹੀ ਪੌਦੇ ਦੀ ਰਸੋਈ ਅਤੇ ਧੁੱਪ ਚੁੱਲ੍ਹਾ ਹੈ।",
                "context_hook": "ਪਿੰਡ ਦੇ ਖੇਤ ਅਤੇ ਰੁੱਖ",
                "cultural_keywords": [{"term": "ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ", "meaning": "ਧੁੱਪ ਨਾਲ ਭੋਜਨ ਬਣਾਉਣਾ"}],
                "familiar_objects": ["ਤੁਲਸੀ ਦਾ ਬੂਟਾ", "ਨਿੰਮ ਦਾ ਪੱਤਾ"],
                "literal": "ਪੌਦਿਆਂ ਨੂੰ ਵਧਣ ਲਈ ਧੁੱਪ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ.",
                "phonetic": "Paudiyan nu vadhan layi dhupp di lod hundi hai."
            },
            "or": {
                "pedagogy_title": "ସବୁଜ ପତ୍ରର ପ୍ରାକୃତିକ ରୋଷେଇ ଘର!",
                "vernacular_explanation": "ଯେପରି ମାଆ ରୋଷେଇ ଘରେ ଚୁଲିରେ ରୋଷେଇ କରନ୍ତି, ସେହିପରି ଗଛମାନେ ନିଜ ସବୁଜ ପତ୍ରରେ ଖାଦ୍ୟ ତିଆରି କରନ୍ତି! ସୂର୍ଯ୍ୟଙ୍କ ଖରା ସେମାନଙ୍କ ଚୁଲି। ପତ୍ରର ସବୁଜ ରଙ୍ଗ ସାହାଯ୍ୟରେ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତ କରନ୍ତି।",
                "local_metaphor": "ପତ୍ର ହିଁ ଗଛର ରୋଷେଇ ଘର ଓ ଖରା ହେଉଛି ଚୁଲି।",
                "context_hook": "ବାଡ଼ି ବଗିଚାର ଗଛ",
                "cultural_keywords": [{"term": "ଆଲୋକଶ୍ଳେଷଣ", "meaning": "ଆଲୋକରେ ଖାଦ୍ୟ ତିଆରି"}],
                "familiar_objects": ["ତୁଳସୀ ଗଛ", "ନିମ୍ବ ପତ୍ର"],
                "literal": "ଗଛ ବଢ଼ିବା ପାଇଁ ସୂର୍ଯ୍ୟାଲୋକ ଦରକାର।",
                "phonetic": "Gachha badhiba pain sooryaloka darakar."
            },
            "as": {
                "pedagogy_title": "সেউজীয়া পাতৰ প্ৰাকৃতিক পাকঘৰ!",
                "vernacular_explanation": "যিদৰে মাকে পাকঘৰত ৰন্ধা-বঢ়া কৰে, ঠিক তেনেদৰে গছ-গছনিয়ে নিজৰ সেউজীয়া পাতত আহাৰ প্ৰস্তুত কৰে! সূৰ্যৰ ৰ'দ তেওঁলোকৰ চৌকা, আৰু পাতৰ সেউজীয়া ৰঙে আহাৰ তৈয়াৰ কৰে।",
                "local_metaphor": "পাতেই গছৰ পাকঘৰ আৰু ৰ'দেই চৌকা।",
                "context_hook": "বাৰীৰ গছ-গছনি",
                "cultural_keywords": [{"term": "সালোকসংশ্লেষণ", "meaning": "পোহৰৰ দ্বাৰা খাদ্য প্ৰস্তুত"}],
                "familiar_objects": ["তুলসী গছ", "নিম পাত"],
                "literal": "গছ বাঢ়িবলৈ সূৰ্যৰ পোহৰ লাগে।",
                "phonetic": "Gos barhiboloi soorjor pohor lage."
            },
            "en": {
                "pedagogy_title": "The Solar-Powered Green Kitchen!",
                "vernacular_explanation": "Plants do not go to the market — they bake their own food right inside their leaves! Sunshine acts as the cooking heat, water is the broth, and the green pigment traps solar warmth to make sweet sugars.",
                "local_metaphor": "Leaves acting as natural solar stoves.",
                "context_hook": "Balcony garden & morning sunlight",
                "cultural_keywords": [{"term": "Photosynthesis", "meaning": "Baking food with light"}, {"term": "Chlorophyll", "meaning": "Green solar trapper"}],
                "familiar_objects": ["Green leaf", "Sunlight beam"],
                "literal": "Plants need sunlight to grow.",
                "phonetic": "Plants need sunlight to grow."
            }
        }
    },
    {
        "id": "concept-fractions-market",
        "keywords": ["fraction", "half", "quarter", "math", "பின்னங்கள்", "भिन्न"],
        "topic": "Fractions & Division (பின்னங்கள் / भिन्न)",
        "category": "Mathematics",
        "grade": "Class 3",
        "local_metaphors": {
            "ta": {
                "pedagogy_title": "கிராமத்துச் சந்தையில் வாங்கிய சுவையான அல்வாவும் மாம்பழமும்!",
                "vernacular_explanation": "ஒரு முழு திருநெல்வேலி அல்வாத் துண்டை நீங்களும் உங்கள் அன்புத் தங்கையும் சமமாகப் பிரித்தால், ஆளுக்கு அரை (1/2) பங்கு கிடைக்கும். நான்கு நண்பர்கள் சேர்ந்தால் கால் (1/4) பங்கு! இதுவே பின்னங்களின் சுவையான கணக்கு!",
                "local_metaphor": "திருவிழாவில் வாங்கும் வட்ட வடிவ முறுக்கையோ அல்லது மாம்பழத்தையோ உடன்பிறப்புகளோடு பகிர்ந்து உண்பது.",
                "context_hook": "ஊர்ச் சந்தையும், தித்திக்கும் மாம்பழப் பங்கும்",
                "cultural_keywords": [
                    {"term": "அரை (1/2)", "meaning": "இரண்டில் ஒரு சம பங்கு"},
                    {"term": "கால் (1/4)", "meaning": "நான்கில் ஒரு சம பங்கு"}
                ],
                "familiar_objects": ["மாம்பழம் (Mango)", "அல்வா (Halwa)", "தோசை (Dosa)", "வாழைப்பழம் (Banana)"],
                "literal": "பின்னங்கள்: ஒன்றை சமமாகப் பிரிப்பது.",
                "phonetic": "Pinnangal: Ondrai samamaaga pirippadhu.",
                "quiz": {
                    "question": "ஒரு தோசையை சமமாக இருவருக்குப் பிரித்தால் ஒவ்வொருவருக்கும் எவ்வளவு கிடைக்கும்?",
                    "options": ["1/2 (அரை)", "1/4 (கால்)", "முழு தோசை"],
                    "correct": "1/2 (அரை)",
                    "explanation": "முழுமையான ஒன்றை இரண்டாகப் பிரித்தால் 1/2 கிடைக்கும்!"
                }
            }
,
            "hi": {
                "pedagogy_title": "मां की गोल चपाती और दो दोस्तों का बंटवारा!",
                "vernacular_explanation": "मां गरम गोल चपाती बनाती हैं और तुम दोनों भाई-बहन भूखे हो, तो मां बीच से काटकर 2 बराबर हिस्से (1/2) करती हैं। चार दोस्त हों तो चौथाई (1/4)। किसी पूरी चीज़ को बराबर हिस्सों में बांटना ही भिन्न है!",
                "local_metaphor": "गोल रोटी को दो बराबर हिस्सों में बांटना।",
                "context_hook": "रसोईघर और गरमा-गरम रोटी",
                "cultural_keywords": [{"term": "आधा (1/2)", "meaning": "दो बराबर हिस्सों में से एक"}, {"term": "चौथाई (1/4)", "meaning": "चार बराबर हिस्सों में से एक"}],
                "familiar_objects": ["गोल रोटी", "तरबूज"],
                "literal": "भिन्न: किसी वस्तु को बराबर हिस्सों में बांटना।",
                "phonetic": "Bhinn: Kisi vastu ko barabar hisson mein baantna."
            },
            "te": {
                "pedagogy_title": "తీపి మామిడి పండు మరియు సమాన పంపకం!",
                "vernacular_explanation": "నాన్న తెచ్చిన మామిడి పండును నువ్వు, నీ చెల్లి సమానంగా తినాలంటే 2 సమాన భాగాలు (1/2) చేస్తారు. 4 భాగాలు చేస్తే పావు (1/4). సమానంగా పంచడమే భిన్నం!",
                "local_metaphor": "మామిడి పండును సమంగా పంచుకోవడం.",
                "context_hook": "ఇంటి పండ్ల బుట్ట",
                "cultural_keywords": [{"term": "సగం (1/2)", "meaning": "రెండు సమాన భాగాల్లో ఒకటి"}],
                "familiar_objects": ["మామిడి పండు", "దోశ"],
                "literal": "భిన్నం అంటే ఏమిటి?",
                "phonetic": "Bhinnam ante emiti?"
            },
            "kn": {
                "pedagogy_title": "ಸಿಹಿ ಮಾವಿನ ಹಣ್ಣು ಮತ್ತು ಸಮಪಾಲು ಹಂಚಿಕೆ!",
                "vernacular_explanation": "ಮಾವಿನ ಹಣ್ಣನ್ನು ಇಬ್ಬರು ಸಮನಾಗಿ ಹಂಚಿಕೊಂಡರೆ ಒಬ್ಬರಿಗೆ ಸಿಗುವುದು ಅರ್ಧ (1/2). 4 ಭಾಗ ಮಾಡಿದರೆ ಕಾಲು (1/4). ಪೂರ್ಣ ವಸ್ತುವನ್ನು ಸಮವಾಗಿ ಹಂಚುವುದೇ ಭಿನ್ನರಾಶಿ!",
                "local_metaphor": "ಮಾವಿನ ಹಣ್ಣನ್ನು ಸಮನಾಗಿ ಹಂಚುವುದು.",
                "context_hook": "ಮನೆಯ ಹಣ್ಣಿನ ಬುಟ್ಟಿ",
                "cultural_keywords": [{"term": "ಅರ್ಧ (1/2)", "meaning": "ಎರಡು ಸಮಭಾಗಗಳಲ್ಲಿ ಒಂದು"}],
                "familiar_objects": ["ಮಾವಿನ ಹಣ್ಣು", "ದೋಸೆ"],
                "literal": "ಭಿನ್ನರಾಶಿ ಎಂದರೇನು?",
                "phonetic": "Bhinnaraashi endarenu?"
            },
            "ml": {
                "pedagogy_title": "മധുരമുള്ള മാമ്പഴവും തുല്യമായി പങ്കിടലും!",
                "vernacular_explanation": "ഒരു മാമ്പഴം രണ്ടുപേർ തുല്യമായി കഴിക്കാൻ മുറിച്ചാൽ കിട്ടുന്നത് പകുതി (1/2). നാലാക്കിയാൽ കാൽ (1/4). ഒരു മുഴുവൻ വസ്തുവിനെ തുല്യമായി പങ്കിടുന്നതാണ് ഭിന്നസംഖ്യ!",
                "local_metaphor": "മാമ്പഴം തുല്യമായി മുറിച്ചു പങ്കിടൽ.",
                "context_hook": "നാട്ടിൻപുറത്തെ ചന്തയും മാമ്പഴവും",
                "cultural_keywords": [{"term": "പകുതി (1/2)", "meaning": "രണ്ടിൽ ഒരു ഭാഗം"}],
                "familiar_objects": ["മാമ്പഴം", "ദോശ"],
                "literal": "ഭിന്നസംഖ്യ എന്നാൽ എന്താണ്?",
                "phonetic": "Bhinnasankhya ennal enthannu?"
            },
            "bn": {
                "pedagogy_title": "মিষ্টি পাকা আম আর সমান ভাগে ভাগ করা!",
                "vernacular_explanation": "একটা মিষ্টি আম দুজন সমান ভাগে খেতে চাইলে মাঝখান দিয়ে কেটে ২ টুকরো অর্ধেক (1/2) করা হয়। ৪ টুকরো করলে সিকি (1/4)। কোনো গোটা জিনিস সমান ভাগে ভাগ করাই ভগ্নাংশ!",
                "local_metaphor": "পাকা আম সমান ভাগে ভাগ করে নেওয়া।",
                "context_hook": "বাজারের মিষ্টি আম",
                "cultural_keywords": [{"term": "অর্ধেক (1/2)", "meaning": "দুই ভাগের এক ভাগ"}],
                "familiar_objects": ["পাকা আম", "রুটি"],
                "literal": "ভগ্নাংশ কাকে বলে?",
                "phonetic": "Bhognangsho kake bole?"
            },
            "mr": {
                "pedagogy_title": "आईची गोल पोळी आणि मित्रांसोबत वाटणी!",
                "vernacular_explanation": "आईने केलेल्या पोळीचे २ समान तुकडे म्हणजे अर्धा (1/2). ४ मित्रांमध्ये वाटले तर पाव (1/4). कोणत्याही पूर्ण वस्तूचे समान भाग करणे म्हणजे अपूर्णांक!",
                "local_metaphor": "गोल पोळीचे समान तुकडे करणे.",
                "context_hook": "स्वयंपाकघर आणि गरम पोळी",
                "cultural_keywords": [{"term": "अर्धा (1/2)", "meaning": "दोन समान भागांपैकी एक"}],
                "familiar_objects": ["पोळी", "टरबूज"],
                "literal": "अपूर्णांक म्हणजे काय?",
                "phonetic": "Apoornank mhanje kay?"
            },
            "gu": {
                "pedagogy_title": "મીઠી કેરીની ચીરીઓની સરખી વહેંચણી!",
                "vernacular_explanation": "મીઠી કેરી બે જણા સરખે ભાગે વહેંચો તો અડધો (1/2) ભાગ મળે. 4 સરખા ભાગ કરો તો પા (1/4) ભાગ મળે. સરખા ભાગ કરવા તેને અપૂર્ણાંક કહેવાય!",
                "local_metaphor": "કેરી કે રોટલીની સરખી વહેંચણી.",
                "context_hook": "ઘરની ફળોની ટોપલી",
                "cultural_keywords": [{"term": "અડધો (1/2)", "meaning": "બે સરખા ભાગમાંથી એક"}],
                "familiar_objects": ["કેરી", "રોટલી"],
                "literal": "અપૂર્ણાંક એટલે શું?",
                "phonetic": "Apoornaank etle shu?"
            },
            "pa": {
                "pedagogy_title": "ਮਾਂ ਦੀ ਗੋਲ ਰੋਟੀ ਅਤੇ ਦੋ ਦੋਸਤਾਂ ਦੀ ਵੰਡ!",
                "vernacular_explanation": "ਗਰਮ ਰੋਟੀ ਨੂੰ ਦੋਵੇਂ ਜਣੇ ਬਰਾਬਰ ਵੰਡੋਗੇ ਤਾਂ ਅੱਧੀ-ਅੱਧੀ (1/2) ਮਿਲੇਗੀ। ਚਾਰ ਹਿੱਸੇ ਕਰੋਗੇ ਤਾਂ ਚੌਥਾਈ (1/4)। ਕਿਸੇ ਪੂਰੀ ਚੀਜ਼ ਨੂੰ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਣਾ ਹੀ ਭਿੰਨ ਹੈ!",
                "local_metaphor": "ਗੋਲ ਰੋਟੀ ਨੂੰ ਬਰਾਬਰ ਵੰਡਣਾ.",
                "context_hook": "ਰਸੋਈ ਅਤੇ ਤਾਜ਼ੀ ਰੋਟੀ",
                "cultural_keywords": [{"term": "ਅੱਧਾ (1/2)", "meaning": "ਦੋ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚੋਂ ਇੱਕ"}],
                "familiar_objects": ["ਰੋਟੀ", "ਤਰਬੂਜ਼"],
                "literal": "ਭਿੰਨ (Fraction) ਕੀ ਹੁੰਦੀ ਹੈ?",
                "phonetic": "Bhinn ki hundi hai?"
            },
            "or": {
                "pedagogy_title": "ମିଠା ଆମ୍ବ ଏବଂ ସମାନ ଭାଗ ବଣ୍ଟନ!",
                "vernacular_explanation": "ଆମ୍ବକୁ ୨ ଭାଗ କଲେ ଗୋଟିଏ ଭାଗ ହେଲା ଅଧା (1/2)। ୪ ଭାଗ କଲେ ଚାରି ଭାଗରୁ ଏକ ଭାଗ (1/4)। ଗୋଟିଏ ପୂର୍ଣ୍ଣ ଜିନିଷକୁ ସମାନ ଭାଗରେ ବାଣ୍ଟିବା ହିଁ ଭଗ୍ନାଂଶ!",
                "local_metaphor": "ଆମ୍ବକୁ ସମାନ ଭାବେ ବାଣ୍ଟିବା।",
                "context_hook": "ଘରର ଫଳ ଡାଲା",
                "cultural_keywords": [{"term": "ଅଧା (1/2)", "meaning": "ଦୁଇ ଭାଗରୁ ଏକ ଭାଗ"}],
                "familiar_objects": ["ଆମ୍ବ", "ରୁଟି"],
                "literal": "ଭଗ୍ନାଂଶ କଣ?",
                "phonetic": "Bhagnangsha kana?"
            },
            "as": {
                "pedagogy_title": "মিঠা আম আৰু সমান ভাগ কৰা!",
                "vernacular_explanation": "আম এটা ২ ভাগ কৰিলে এজনে পাব আধা (1/2)। ৪ ভাগ কৰিলে এক-চতুৰ্থাংশ (1/4)। কোনো এটা বস্তু সমান ভাগত ভগোৱাই হ'ল ভগ্নাংশ!",
                "local_metaphor": "আম সমান ভাগত ভগোৱা।",
                "context_hook": "ঘৰৰ ফলৰ খৰাহী",
                "cultural_keywords": [{"term": "আধা (1/2)", "meaning": "দুভাগৰ এভাগ"}],
                "familiar_objects": ["আম", "ৰুটি"],
                "literal": "ভগ্নাংশ কি?",
                "phonetic": "Bhognangxo ki?"
            },
            "en": {
                "pedagogy_title": "Sharing Warm Chapatis & Mango Slices!",
                "vernacular_explanation": "When you and your friend share a mango or chapati equally, you divide it into 2 equal parts: each is one half (1/2). If 4 share, each gets one quarter (1/4). Fractions mean sharing a whole equally!",
                "local_metaphor": "Sharing delicious food equally.",
                "context_hook": "Kitchen plate & dinner table",
                "cultural_keywords": [{"term": "Half (1/2)", "meaning": "One of two equal parts"}, {"term": "Quarter (1/4)", "meaning": "One of four equal parts"}],
                "familiar_objects": ["Mango", "Dosa", "Bread"],
                "literal": "What is a fraction?",
                "phonetic": "What is a fraction?"
            }
        }
    }
]

class PedagogyEngine:
    def __init__(self):
        self.concepts_db = PEDAGOGY_CONCEPTS_DB
        self.languages = {l["code"]: l for l in settings.SUPPORTED_LANGUAGES}

    def explain_concept(self, req: PedagogyExplainRequest) -> PedagogyExplainResponse:
        """
        Translates raw pedagogical questions into culturally rooted learning explanations.
        """
        query_clean = req.concept_or_question.lower()
        target_lang = req.target_lang.lower()
        lang_meta = self.languages.get(target_lang, self.languages["ta"])

        # Match concept by keywords
        matched_concept = None
        for concept in self.concepts_db:
            if any(kw in query_clean for kw in concept["keywords"]):
                matched_concept = concept
                break

        if not matched_concept:
            # Fallback to water cycle as default primary science demonstrator
            matched_concept = self.concepts_db[0]

        # Get localized language variant or fallback to Tamil / Hindi
        lang_variants = matched_concept["local_metaphors"]
        variant = lang_variants.get(target_lang) or lang_variants.get("ta") or list(lang_variants.values())[0]

        return PedagogyExplainResponse(
            concept_id=matched_concept["id"],
            topic=matched_concept["topic"],
            category=matched_concept["category"],
            grade=req.grade or matched_concept["grade"],
            target_lang=target_lang,
            target_lang_name=lang_meta["name"],
            speech_code=lang_meta["speechCode"],
            literal_translation=variant.get("literal", req.concept_or_question),
            phonetic_pronunciation=variant.get("phonetic", ""),
            pedagogy_title=variant.get("pedagogy_title", f"{matched_concept['topic']} - Vernacular Explanation"),
            vernacular_explanation=variant.get("vernacular_explanation", ""),
            local_metaphor=variant.get("local_metaphor", ""),
            cultural_context_hook=variant.get("context_hook", "Local village environment"),
            cultural_keywords=variant.get("cultural_keywords", []),
            familiar_objects_used=variant.get("familiar_objects", []),
            quick_quiz=variant.get("quiz", {
                "question": "Did you understand this concept?",
                "options": ["Yes, very well!", "Let us explore more!"],
                "correct": "Yes, very well!",
                "explanation": "Great job learning in your mother tongue!"
            }),
            auto_speak_lady_voice=True,
            voice_profile=speech_service.get_lady_voice_profile(target_lang)
        )

    def get_curated_metaphors(self) -> List[Dict[str, Any]]:
        return [
            {
                "subject": c["category"],
                "topic": c["topic"],
                "grade": c["grade"],
                "id": c["id"]
            }
            for c in self.concepts_db
        ]

pedagogy_engine = PedagogyEngine()
