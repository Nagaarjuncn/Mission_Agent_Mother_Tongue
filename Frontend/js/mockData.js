// VernacLearn Comprehensive Multilingual & Pedagogy Mock Database
export const SUPPORTED_LANGUAGES = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechCode: 'as-IN', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN', flag: '🌐' }
];

export const TUTOR_PROFILES = {
  ta: { name: 'நண்பன் மித்ரா (Nanban Mitra)', greeting: 'வணக்கம் குட்டி நண்பா! இன்று என்ன புதிய விஷயம் கற்றுக்கொள்ளலாம்?' },
  hi: { name: 'मित्र (Mitra)', greeting: 'नमस्ते प्यारे दोस्त! आज हम क्या नया और मज़ेदार सीखेंगे?' },
  te: { name: 'స్నేహితుడు మిత్ర (Mithra)', greeting: 'నమస్కారం నేస్తమా! ఈరోజు మనం ఏ కొత్త విషయాన్ని నేర్చుకుందాం?' },
  kn: { name: 'ಸ್ನೇಹಿತ ಮಿತ್ರ (Mitra)', greeting: 'ನಮಸ್ಕಾರ ಗೆಳೆಯ! ಇವತ್ತು ನಾವು ಯಾವ ಹೊಸ ವಿಷಯ ಕಲಿಯೋಣ?' },
  ml: { name: 'കൂട്ടുകാരൻ മിത്ര (Kootukaran Mitra)', greeting: 'നമസ്കാരം കൂട്ടുകാരാ! ഇന്ന് നമുക്ക് എന്ത് പുതിയ കാര്യമാണ് പഠിക്കേണ്ടത്?' },
  bn: { name: 'বন্ধু মিত্র (Bondhu Mitra)', greeting: 'নমস্কার ছোট্ট বন্ধু! আজ আমরা কী নতুন বিষয় শিখব?' },
  mr: { name: 'मित्र (Mitra)', greeting: 'नमस्कार मित्रा! आज आपण कोणती नवीन गंमत शिकणार आहोत?' },
  gu: { name: 'મિત્ર (Mitra)', greeting: 'નમસ્તે મિત્ર! આજે આપણે શું નવું શીખીશું?' },
  pa: { name: 'ਮਿੱਤਰ (Mitra)', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਪਿਆਰੇ ਦੋਸਤ! ਅੱਜ ਅਸੀਂ ਕੀ ਨਵਾਂ ਸਿੱਖਾਂਗੇ?' },
  or: { name: 'ମିତ୍ର (Mitra)', greeting: 'ନମସ୍କାର ସାଙ୍ଗ! ଆଜି ଆମେ କେଉଁ ନୂଆ କଥା ଶିଖିବା?' },
  as: { name: 'মিত্ৰ (Mitra)', greeting: 'নমস্কাৰ মৰমৰ বন্ধু! আজি আমি কি নতুন কথা শিকিম?' },
  en: { name: 'Mitra (AI Buddy)', greeting: 'Hello little friend! What exciting thing would you like to explore today?' }
};

// Pedagogy Knowledge Base (Literal Translation vs. Cultural Pedagogy)
export const PEDAGOGY_KNOWLEDGE_BASE = [
  {
    id: 'rain-water-cycle',
    category: 'Science',
    title: 'Why does rain fall from the sky?',
    grade: 'Class 3–4',
    sourceText: 'Why does rain fall from the sky?',
    keywords: ['Water cycle', 'Evaporation', 'Clouds', 'Condensation', 'Precipitation', 'rain', 'water'],
    translations: {
      ta: {
        literal: 'வானத்திலிருந்து மழை ஏன் பெய்கிறது?',
        phonetic: 'Vaanathilirundhu mazhai yaen peigiradhu?',
        pedagogyTitle: 'அம்மா வைக்கும் சுடச்சுட ரசமும் மழை மேகங்களும்! 🍲☁️',
        vernacularExplanation: 'வீட்டில் அம்மா சுடச்சுட ரசமோ தேநீரோ கொதிக்க வைக்கும்போது மேலே ஆவி பறப்பதைப் பார்த்திருக்கிறாயா? அந்த பாத்திரத்தின் மீது ஒரு தட்டை மூடினால், அந்த ஆவி குளிர்ந்து தட்டின் அடியில் சிறு சிறு தண்ணீர் துளிகளாக மாறும்!\n\nநமது சூரியனும் பூமியில் உள்ள ஏரி, குளம், ஆற்று நீரை அப்படிச் சூடாக்குகிறது. அந்த நீராவி மேலே சென்று குளிர்ந்து மேகங்களாக மாறுகிறது. மேகங்கள் பாரமாகும் போது ஜில்லென்று மழையாகப் பொழிகிறது!',
        localMetaphor: 'சமையலறை ரசத்தின் ஆவியும் மூடித் தட்டின் நீர் துளிகளும் (Kitchen Steam & Lid Analogy)',
        culturalKeywords: [
          { term: 'ஆவியாதல் (Evaporation)', meaning: 'தண்ணீர் சூடாகி புகையாக மாறுவது' },
          { term: 'குளிர்வடைதல் (Condensation)', meaning: 'ஆவி குளிர்ந்து நீர் துளியாவது' },
          { term: 'மழைப்பொழிவு (Precipitation)', meaning: 'மேகம் குளிர்ந்து மழையாகப் பொழிவது' }
        ],
        quiz: {
          question: 'மழை மேகங்கள் எப்படி உருவாகின்றன என்று சொல் பார்க்கலாம்?',
          options: [
            'சூரிய வெப்பத்தால் நீர் ஆவியாகி மேலே சென்று குளிர்ந்து மேகமாகிறது',
            'விண்வெளியில் இருந்து யாரோ தண்ணீர் ஊற்றுகிறார்கள்',
            'இரவில் காற்று வீசுவதால் மட்டுமே'
          ],
          correctIndex: 0,
          hint: 'நினைத்துப்பார்: அடுப்பில் சுடு தண்ணீர் வைக்கும் போது என்ன நடக்கும்?',
          successMsg: 'அருமை! சரியாகச் சொன்னாய்! ⭐ நீ ஒரு குட்டி விஞ்ஞானி!'
        }
      },
      hi: {
        literal: 'आसमान से बारिश क्यों गिरती है?',
        phonetic: 'Aasman se baarish kyon girti hai?',
        pedagogyTitle: 'रसोई की चाय की भाप और आसमान के बादल! ☕☁️',
        vernacularExplanation: 'जब घर में चाय या पानी उबलता है, तो भाप ऊपर उठती है ना? अगर हम उस पर एक ठंडी थाली रख दें, तो भाप थाली से टकराकर पानी की बूंदें बन जाती है!\n\nसूरज चाचा भी हमारे तालाबों और नदियों के पानी को गर्म करते हैं। वह भाप बनकर आसमान में जाकर ठंडी होती है और बादल बनाती है। जब बादल भारी हो जाते हैं, तो छम-छम बारिश बनकर बरसते हैं!',
        localMetaphor: 'चाय की भाप और ठंडी थाली की बूंदें (Boiling Tea & Plate Metaphor)',
        culturalKeywords: [
          { term: 'वाष्पीकरण (Evaporation)', meaning: 'पानी का भाप बनकर ऊपर उठना' },
          { term: 'संघनन (Condensation)', meaning: 'भाप का ठंडा होकर बूंद बनना' },
          { term: 'वर्षा (Rainfall)', meaning: 'बादलों से पानी का गिरना' }
        ],
        quiz: {
          question: 'नदियों का पानी आसमान में कैसे पहुँचता है?',
          options: [
            'सूरज की गर्मी से भाप बनकर ऊपर उड़ता है',
            'पक्षी अपनी चोंच में भरकर ले जाते हैं',
            'हवा में जादू से बन जाता है'
          ],
          correctIndex: 0,
          hint: 'सोचो: जब सड़क पर पानी कीचड़ धूप में सूखता है, तो पानी कहाँ जाता है?',
          successMsg: 'शाबाश! बिल्कुल सही जवाब! ⭐ तुम बहुत होशियार हो!'
        }
      },
      te: {
        literal: 'ఆకాశం నుండి వర్షం ఎందుకు పడుతుంది?',
        phonetic: 'Aakaasham nundi varsham enduku padutundi?',
        pedagogyTitle: 'అమ్మ చేసే వేడి చారు ఆవిరి మరియు ఆకాశ మేఘాలు! 🍲☁️',
        vernacularExplanation: 'వంటగదిలో అమ్మ చారు కాచేటప్పుడు పొగలాంటి ఆవిరి పైకి వెళ్లడం చూశావా? దానిపై మూత పెడితే ఆవిరి చల్లబడి చిన్న చిన్న నీటి బిందువులుగా మారుతుంది!\n\nసూర్యుడు చెరువులు, నదుల నీటిని అలాగే వేడెక్కిస్తాడు. ఆ ఆవిరి పైకి వెళ్లి చల్లబడి మేఘాలుగా మారుతుంది. మేఘాలు బరువెక్కినప్పుడు చక్కని వర్షంగా కురుస్తుంది!',
        localMetaphor: 'వేడి చారు ఆవిరి మరియు మూతపై నీటి బిందువులు',
        culturalKeywords: [
          { term: 'బాష్పీభవనం (Evaporation)', meaning: 'నీరు ఆవిరిగా మారడం' },
          { term: 'సాంద్రీకరణం (Condensation)', meaning: 'ఆవిరి చల్లబడి నీరుగా మారడం' }
        ],
        quiz: {
          question: 'వర్షపు మేఘాలు ఎలా ఏర్పడతాయి?',
          options: [
            'సూర్యుడి వేడికి నీరు ఆవిరై పైకెళ్లి చల్లబడటం వల్ల',
            'చెట్లు నీటిని నేరుగా ఆకాశంలోకి విసరడం వల్ల',
            'చల్లని గాలి వల్ల మాత్రమే'
          ],
          correctIndex: 0,
          hint: 'ఆలోచించు: ఎండలో ఆరేసిన బట్టలలోని నీరు ఎక్కడికి పోతుంది?',
          successMsg: 'చాలా బాగుంది! సరైన సమాధానం! ⭐'
        }
      },
      bn: {
        literal: 'আকাশ থেকে কেন বৃষ্টি পড়ে?',
        phonetic: 'Aakash theke keno brishti pore?',
        pedagogyTitle: 'রান্নাঘরের গরম ভাতের ধোঁয়া আর বর্ষার মেঘ! 🍚☁️',
        vernacularExplanation: 'মা যখন গরম ভাত বা চা বানান, তখন কেমন ধোঁয়ার মতো বাষ্প ওঠে দেখেছ? তার ওপর একটা ঠান্ডা ঢাকনা রাখলে বাষ্প জমে জলের ফোঁটা হয়ে যায়!\n\nসূর্য মামাও আমাদের পুকুর আর নদীর জলকে এভাবেই গরম করে বাষ্প বানিয়ে দেয়। সেই বাষ্প ওপরে উঠে ঠান্ডা হয়ে মেঘ তৈরি করে। মেঘ ভারী হলে রিমঝিম বৃষ্টি হয়ে ঝরে পড়ে!',
        localMetaphor: 'গরম ভাতের বাষ্প ও ঠান্ডা ঢাকনা',
        culturalKeywords: [
          { term: 'বাষ্পীভবন (Evaporation)', meaning: 'জল গরম হয়ে বাষ্প হওয়া' },
          { term: 'ঘনীভবন (Condensation)', meaning: 'বাষ্প ঠান্ডা হয়ে জল হওয়া' }
        ],
        quiz: {
          question: 'বৃষ্টির জল আকাশে কোথা থেকে আসে?',
          options: [
            'নদী-পুকুরের জল সূর্যের তাপে বাষ্প হয়ে আকাশে যায়',
            'আকাশে জলের বড় কল আছে',
            'চাঁদের আলো থেকে তৈরি হয়'
          ],
          correctIndex: 0,
          hint: 'ভাবো তো: রোদে ভেজা জামাকাপড় শুকালে জলটা কোথায় যায়?',
          successMsg: 'দুর্দান্ত! একদম সঠিক উত্তর! ⭐'
        }
      },
      kn: {
        literal: 'ಆಕಾಶದಿಂದ ಮಳೆ ಏಕೆ ಬೀಳುತ್ತದೆ?',
        phonetic: 'Aakashadinda male eke beeluttade?',
        pedagogyTitle: 'ಮನೆ ಅಡುಗೆಯ ಬಿಸಿ ಸಾರಿನ ಹಬೆ ಮತ್ತು ಕಾವೇರಿ ಮಳೆ ಮೋಡಗಳು! 🍲☁️',
        vernacularExplanation: 'ಅಮ್ಮ ಬಿಸಿ ಸಾರು ಕುದಿಸುವಾಗ ಹಬೆ ಮೇಲೆ ಹೋಗಿ ಮುಚ್ಚಳದ ಮೇಲೆ ನೀರಿನ ಹನಿಗಳಾಗುವುದನ್ನು ನೋಡಿದ್ದೀರಾ? ಕಾವೇರಿ ನದಿಯ ನೀರು ಬಿಸಿಲಿಗೆ ಆವಿಯಾಗಿ ಮೋಡವಾಗಿ ತಣ್ಣನೆಯ ಗಾಳಿಯಿಂದ ಮಳೆಯಾಗಿ ಬೀಳುತ್ತದೆ!',
        localMetaphor: 'ಸಾರಿನ ಪಾತ್ರೆಯ ಮುಚ್ಚಳದ ಮೇಲಿನ ಹನಿಗಳು',
        culturalKeywords: [{ term: 'ಆವೀಕರಣ', meaning: 'ನೀರು ಆವಿಯಾಗುವುದು' }],
        quiz: {
          question: 'ಮಳೆ ಮೋಡಗಳು ಹೇಗೆ ಉಂಟಾಗುತ್ತವೆ?',
          options: ['ಸೂರ್ಯನ ಶಾಖದಿಂದ ನೀರು ಆವಿಯಾಗಿ ಮೋಡವಾಗುತ್ತದೆ', 'ಗಾಳಿಯಿಂದ ಮಾತ್ರ'],
          correctIndex: 0,
          hint: 'ಬಿಸಿಲಿನಲ್ಲಿ ನೀರು ಏನಾಗುತ್ತದೆ?',
          successMsg: 'ಅದ್ಭುತ! ಸರಿಯಾದ ಉತ್ತರ! ⭐'
        }
      },
      ml: {
        literal: 'ആകാശത്തുനിന്ന് മഴ പെയ്യുന്നത് എന്തുകൊണ്ട്?',
        phonetic: 'Aakasathuninnum mazha peyyunnathu enthukondu?',
        pedagogyTitle: 'അടുക്കളയിലെ തിളച്ച ചായയുടെ ആവിയും മഴമേഘങ്ങളും! ☕☁️',
        vernacularExplanation: 'അടുക്കളയിൽ ചായ തിളപ്പിക്കുമ്പോൾ ആവി മുകളിലേക്ക് പോയി തളികയിൽ തണുത്തു തുള്ളികളാകുന്നത് കണ്ടിട്ടുണ്ടോ? പുഴയിലെ വെള്ളം വെയിൽ കൊണ്ട് ആവിയായി മഴമേഘങ്ങളായി മാറുന്നു!',
        localMetaphor: 'ചായപാത്രത്തിന്റെ തട്ടിലെ നീർത്തുള്ളികൾ',
        culturalKeywords: [{ term: 'ബാഷ്പീകരണം', meaning: 'വെള്ളം ആവിയാകുന്നത്' }],
        quiz: {
          question: 'മഴത്തുള്ളികൾ എങ്ങനെ ഉണ്ടാകുന്നു?',
          options: ['വെള്ളം ആവിയായി തണുത്തു മേഘമാകുമ്പോൾ', 'കാറ്റ് വീശുമ്പോൾ മാത്രം'],
          correctIndex: 0,
          hint: 'ചൂടിൽ വെള്ളം എന്താകും?',
          successMsg: 'മിടുക്കൻ! ശരിയായ ഉത്തരം! ⭐'
        }
      },
      mr: {
        literal: 'आकाशातून पाऊस का पडतो?',
        phonetic: 'Aakashatun paus ka padto?',
        pedagogyTitle: 'गरम चहाची वाफ आणि पावसाचे काळे ढग! ☕☁️',
        vernacularExplanation: 'आईने चहा उकळायला ठेवल्यावर झाकणावर पाण्याचे थेंब जमतात ना? तसेच नदीचे पाणी उन्हामुळे वाफ होऊन आकाशात जाते व थंड हवेने ढग बनून पाऊस पाडते!',
        localMetaphor: 'चहाच्या किटलीच्या वाफेसारखा पाऊस',
        culturalKeywords: [{ term: 'बाष्पीभवन', meaning: 'पाण्याची वाफ होणे' }],
        quiz: {
          question: 'पावसाचे ढग कशाने बनतात?',
          options: ['पाण्याची वाफ थंड होऊन', 'धुराने'],
          correctIndex: 0,
          hint: 'उन्हात पाणी काय बनते?',
          successMsg: 'छान! अगदी बरोबर उत्तर! ⭐'
        }
      },
      gu: {
        literal: 'આકાશમાંથી વરસાદ કેમ પડે છે?',
        phonetic: 'Aakashmathi varsad kem pade chhe?',
        pedagogyTitle: 'ગરમ ચાની કીટલીની વરાળ અને આકાશના વાદળો! ☕☁️',
        vernacularExplanation: 'રસોડામાં ચા ઉકળે ત્યારે ઢાંકણ પર વરાળના ટીપાં બાઝી જાય છે ને? નદીનું પાણી સૂર્યના તાપથી વરાળ બની આકાશમાં વાદળ બને છે અને વરસાદ બની વરસે છે!',
        localMetaphor: 'ચાની કીટલીની વરાળ જેવા વાદળ',
        culturalKeywords: [{ term: 'બાષ્પીભવન', meaning: 'પાણીનું વરાળ બનવું' }],
        quiz: {
          question: 'વાદળ કેવી રીતે બને છે?',
          options: ['સૂર્યની ગરમીથી પાણી વરાળ બનીને', 'પવનથી'],
          correctIndex: 0,
          hint: 'તડકામાં પાણી શું બને?',
          successMsg: 'ખૂબ સરસ! સાચો જવાબ! ⭐'
        }
      },
      pa: {
        literal: 'ਅਸਮਾਨ ਤੋਂ ਮੀਂਹ ਕਿਉਂ ਪੈਂਦਾ ਹੈ?',
        phonetic: 'Aasmaan ton meenh kyon painda hai?',
        pedagogyTitle: 'ਰਸੋਈ ਵਿੱਚ ਚਾਹ ਦੀ ਭਾਫ਼ ਅਤੇ ਸਾਵਣ ਦੇ ਬੱਦਲ! ☕☁️',
        vernacularExplanation: 'ਜਦੋਂ ਘਰ ਵਿੱਚ ਚਾਹ ਉਬਲਦੀ ਹੈ ਤਾਂ ਢੱਕਣ ਉੱਤੇ ਪਾਣੀ ਦੀਆਂ ਬੂੰਦਾਂ ਜੰਮ ਜਾਂਦੀਆਂ ਹਨ। ਦਰਿਆ ਦਾ ਪਾਣੀ ਧੁੱਪ ਨਾਲ ਭਾਫ਼ ਬਣ ਕੇ ਅਸਮਾਨ ਵਿੱਚ ਬੱਦਲ ਬਣਦਾ ਹੈ ਅਤੇ ਮੀਂਹ ਬਣ ਕੇ ਵਰ੍ਹਦਾ ਹੈ!',
        localMetaphor: 'ਚਾਹ ਦੀ ਪਤੀਲੀ ਦੀ ਭਾਫ਼ ਵਾਂਗ ਬੱਦਲ',
        culturalKeywords: [{ term: 'ਵਾਸ਼ਪੀਕਰਨ', meaning: 'ਭਾਫ਼ ਬਣਨਾ' }],
        quiz: {
          question: 'ਮੀਂਹ ਕਿਵੇਂ ਪੈਂਦਾ ਹੈ?',
          options: ['ਪਾਣੀ ਭਾਫ਼ ਬਣ ਕੇ ਬੱਦਲ ਬਣਦਾ ਹੈ', 'ਜਾਦੂ ਨਾਲ'],
          correctIndex: 0,
          hint: 'ਧੁੱਪ ਨਾਲ ਪਾਣੀ ਕੀ ਬਣਦਾ ਹੈ?',
          successMsg: 'ਸ਼ਾਬਾਸ਼! ਬਿਲਕੁਲ ਸਹੀ ਜਵਾਬ! ⭐'
        }
      },
      or: {
        literal: 'ଆକାଶରୁ ବର୍ଷା କାହିଁକି ହୁଏ?',
        phonetic: 'Aakasharu barsha kahinki hue?',
        pedagogyTitle: 'ରୋଷେଇ ଘରର ଚାହା ଭାମ୍ପ ଏବଂ ମହାନଦୀର ବାଦଲ! ☕☁️',
        vernacularExplanation: 'ଚାହା ଫୁଟିଲା ବେଳେ ଢାଙ୍କୁଣୀ ଉପରେ ପାଣି ଟୋପା ଜମିବା ଦେଖିଛ କି? ନଦୀର ଜଳ ଖରାରେ ବାଷ୍ପ ହୋଇ ଆକାଶକୁ ଯାଇ ବାଦଲ ହୁଏ ଏବଂ ବର୍ଷା ହୋଇ ଝରେ!',
        localMetaphor: 'ଚାହା ଢାଙ୍କୁଣୀର ଜଳବିନ୍ଦୁ',
        culturalKeywords: [{ term: 'ବାଷ୍ପୀଭବନ', meaning: 'ବାଷ୍ପ ହେବା' }],
        quiz: {
          question: 'ବାଦଲ କିପରି ସୃଷ୍ଟି ହୁଏ?',
          options: ['ସୂର୍ଯ୍ୟ ତାପରେ ପାଣି ବାଷ୍ପ ହୋଇ', 'ପବନରୁ'],
          correctIndex: 0,
          hint: 'ଖରାରେ ପାଣି କଣ ହୁଏ?',
          successMsg: 'ବହୁତ ବଢ଼ିଆ! ସଠିକ ଉତ୍ତର! ⭐'
        }
      },
      as: {
        literal: 'আকাশৰ পৰা বৰষুণ কিয় পৰে?',
        phonetic: 'Aakashor pora boroxun kiyo pore?',
        pedagogyTitle: 'ৰান্ধনিশালৰ গৰম চাহৰ ধোঁৱা আৰু আকাশৰ ডাৱৰ! ☕☁️',
        vernacularExplanation: 'মায়ে চাহ ৰান্ধিলে ঢাকনিখনত পানীৰ টোপাল জমা হোৱা দেখিছানে? নদীৰ পানী ৰ’দত ভাপ হৈ আকাশলৈ গৈ ডাৱৰ হয় আৰু বৰষুণ হৈ পৰে!',
        localMetaphor: 'চাহৰ ঢাকনিৰ পানী টোপাল',
        culturalKeywords: [{ term: 'বাষ্পীভৱন', meaning: 'ভাপ হোৱা' }],
        quiz: {
          question: 'বৰষুণৰ ডাৱৰ কেনেকৈ হয়?',
          options: ['ৰ’দৰ উত্তাপত পানী ভাপ হৈ', 'গছৰ পৰা'],
          correctIndex: 0,
          hint: 'ৰ’দত পানী কি হয়?',
          successMsg: 'বৰ ধুনীয়া! শুদ্ধ উত্তৰ! ⭐'
        }
      },
      en: {
        literal: 'Why does rain fall from the sky?',
        phonetic: 'Why does rain fall from the sky?',
        pedagogyTitle: 'Kitchen Kettle Steam & Floating Sky Clouds! ☕☁️',
        vernacularExplanation: 'Have you seen steam rise when a kettle or soup pot boils? If you hold a cool lid over it, the steam turns right back into tiny water droplets!\n\nThe hot sun does the exact same thing to lakes and rivers. That invisible water vapor rises into the cold sky, gathers into fluffy clouds, and when they get too heavy, falls down as refreshing rain!',
        localMetaphor: 'Steaming Kettle & Cool Lid Droplets',
        culturalKeywords: [
          { term: 'Evaporation', meaning: 'Liquid water turning into warm vapor' },
          { term: 'Condensation', meaning: 'Vapor cooling down into droplets' },
          { term: 'Precipitation', meaning: 'Water falling back to Earth as rain' }
        ],
        quiz: {
          question: 'How do rain clouds form in our sky?',
          options: [
            'Sun heats water into vapor, which cools into clouds high above',
            'Birds carry water drops into the sky',
            'Clouds are made of cotton candy'
          ],
          correctIndex: 0,
          hint: 'Think about where the water goes when wet clothes dry in the sun!',
          successMsg: 'Brilliant! You answered correctly! ⭐ You are a mini scientist!'
        }
      }
    }
  },
  {
    id: 'fractions-math',
    category: 'Mathematics',
    title: 'What is a Fraction (1/2 and 1/4)?',
    grade: 'Class 2–3',
    sourceText: 'What is a fraction?',
    keywords: ['Fraction', 'Half', 'Quarter', 'Sharing', 'Division', 'mango', 'chapatis'],
    translations: {
      ta: {
        literal: 'பின்னம் என்றால் என்ன?',
        phonetic: 'Pinnam endraal enna?',
        pedagogyTitle: 'அப்பாவின் சுவையான மாம்பழமும் சம பங்கு பிரித்தலும்! 🥭',
        vernacularExplanation: 'அப்பா சந்தையிலிருந்து ஒரு பெரிய இனிப்பான மாம்பழம் வாங்கி வருகிறார். நீயும் உன் தங்கையும் சமமாகச் சாப்பிட வேண்டும் என்றால் என்ன செய்வீர்கள்? நடுவே வெட்டி 2 சம துண்டுகளாகப் பிரிப்பீர்கள்!\n\nஅதில் ஒரு துண்டு தான் "அரை பாகம்" (1/2). அதே மாம்பழத்தை 4 சம துண்டுகளாக வெட்டி, அதில் ஒரு துண்டை எடுத்தால் அது "கால் பாகம்" (1/4). முழுப் பொருளைச் சமமாகப் பிரிப்பது தான் பின்னம்!',
        localMetaphor: 'மாம்பழத்தை சமமாகப் பங்கிட்டு உண்ணுதல் (Sharing Sweet Mango)',
        culturalKeywords: [
          { term: 'முழுமை (Whole)', meaning: 'ஒரு முழு மாம்பழம் (1)' },
          { term: 'அரை (Half - 1/2)', meaning: 'இரண்டில் ஒரு பங்கு' },
          { term: 'கால் (Quarter - 1/4)', meaning: 'நான்கில் ஒரு பங்கு' }
        ],
        quiz: {
          question: 'ஒரு தோசையை 2 சம பாகமாகப் பிரித்து ஒன்றைச் சாப்பிட்டால் நீ எவ்வளவு சாப்பிட்டாய்?',
          options: ['அரை தோசை (1/2)', 'முழு தோசை (1)', 'கால் தோசை (1/4)'],
          correctIndex: 0,
          hint: 'இரண்டு சம பங்கில் ஒரு பங்கு எது?',
          successMsg: 'சூப்பர்! தோசை கணக்கைச் சரியாகப் போட்டுவிட்டாய்! ⭐'
        }
      },
      hi: {
        literal: 'भिन्न (Fraction) क्या होता है?',
        phonetic: 'Bhinn kya hota hai?',
        pedagogyTitle: 'मां की गोल चपाती और दो दोस्तों का बंटवारा! 🫓',
        vernacularExplanation: 'सोचो मां ने एक गरमा-गरम गोल चपाती बनाई और तुम और तुम्हारा भाई दोनों भूखे हो। मां चपाती को बीच से ठीक बराबर काटकर दोनों को एक-एक टुकड़ा देती हैं।\n\nवह एक टुकड़ा कहलाता है "आधा" (1/2)! अगर चार दोस्त मिलकर बांटें तो मिलेगा "चौथाई" (1/4)। किसी पूरी चीज़ को बराबर हिस्सों में बांटना ही भिन्न (Fraction) है!',
        localMetaphor: 'गोल रोटी को बराबर बांटना (Sharing Chapati Metaphor)',
        culturalKeywords: [
          { term: 'आधा (1/2)', meaning: 'दो बराबर हिस्सों में से एक हिस्सा' },
          { term: 'चौथाई (1/4)', meaning: 'चार बराबर हिस्सों में से एक हिस्सा' }
        ],
        quiz: {
          question: 'अगर 4 दोस्तों ने मिलकर 1 तरबूज के 4 बराबर टुकड़े किए, तो हर दोस्त को कितना हिस्सा मिला?',
          options: ['एक चौथाई (1/4)', 'आधा (1/2)', 'पूरा तरबूज (1)'],
          correctIndex: 0,
          hint: '4 बराबर हिस्सों में से 1 हिस्सा क्या कहलाता है?',
          successMsg: 'अरे वाह! गणित का कमाल सीख गए! ⭐'
        }
      },
      te: {
        literal: 'భిన్నం అంటే ఏమిటి?',
        phonetic: 'Bhinnam ante emiti?',
        pedagogyTitle: 'తీపి మామిడి పండు మరియు సమాన పంపకం! 🥭',
        vernacularExplanation: 'నాన్న మార్కెట్ నుండి ఒక పెద్ద మామిడి పండు తెచ్చారు. నువ్వు, నీ చెల్లి సమానంగా తినాలంటే మధ్యలోకి కోసి 2 సమాన భాగాలు చేస్తారు కదా! అందులో ఒక భాగం \'సగం\' (1/2). అదే పండును 4 భాగాలు చేస్తే \'పావు\' (1/4). ఒక వస్తువును సమానంగా పంచడమే భిన్నం!',
        localMetaphor: 'మామిడి పండును సమానంగా పంచుకోవడం',
        culturalKeywords: [{ term: 'సగం (1/2)', meaning: 'రెండు సమాన భాగాల్లో ఒకటి' }, { term: 'పావు (1/4)', meaning: 'నాలుగు సమాన భాగాల్లో ఒకటి' }],
        quiz: { question: 'దోశను రెండు సమాన భాగాలు చేసి ఒకటి తింటే ఎంత తిన్నట్లు?', options: ['సగం (1/2)', 'పూర్తి (1)', 'పావు (1/4)'], correctIndex: 0, hint: 'రెండు సమభాగాల్లో ఒక భాగం ఏమిటి?', successMsg: 'అద్భుతం! సరైన సమాధానం! ⭐' }
      },
      kn: {
        literal: 'ಭಿನ್ನರಾಶಿ ಎಂದರೇನು?',
        phonetic: 'Bhinnaraashi endarenu?',
        pedagogyTitle: 'ಸಿಹಿ ಮಾವಿನ ಹಣ್ಣು ಮತ್ತು ಸಮಪಾಲು ಹಂಚಿಕೆ! 🥭',
        vernacularExplanation: 'ಅಪ್ಪ ಮಾರುಕಟ್ಟೆಯಿಂದ ತಂದ ಮಾವಿನ ಹಣ್ಣನ್ನು ನೀನು ಮತ್ತು ನಿನ್ನ ತಮ್ಮ ಸಮನಾಗಿ ಹಂಚಿಕೊಳ್ಳಲು 2 ಭಾಗ ಮಾಡಿದರೆ, ಒಬ್ಬರಿಗೆ ಸಿಗುವುದು \'ಅರ್ಧ\' (1/2). 4 ಭಾಗ ಮಾಡಿದರೆ \'ಕಾಲು\' (1/4). ಪೂರ್ಣ ವಸ್ತುವನ್ನು ಸಮವಾಗಿ ಹಂಚುವುದೇ ಭಿನ್ನರಾಶಿ!',
        localMetaphor: 'ಮಾವಿನ ಹಣ್ಣನ್ನು ಸಮನಾಗಿ ಹಂಚುವುದು',
        culturalKeywords: [{ term: 'ಅರ್ಧ (1/2)', meaning: 'ಎರಡು ಸಮಭಾಗಗಳಲ್ಲಿ ಒಂದು' }, { term: 'ಕಾಲು (1/4)', meaning: 'ನಾಲ್ಕು ಸಮಭಾಗಗಳಲ್ಲಿ ಒಂದು' }],
        quiz: { question: 'ದೋಸೆಯನ್ನು ಎರಡು ಸಮಭಾಗ ಮಾಡಿ ಒಂದು ತಿಂದರೆ ಎಷ್ಟು ತಿಂದಂತೆ?', options: ['ಅರ್ಧ (1/2)', 'ಪೂರ್ಣ (1)', 'ಕಾಲು (1/4)'], correctIndex: 0, hint: 'ಎರಡರಲ್ಲಿ ಒಂದು ಭಾಗ', successMsg: 'ಬಹಳ ಚೆನ್ನಾಗಿದೆ! ಸರಿಯಾದ ಉತ್ತರ! ⭐' }
      },
      ml: {
        literal: 'ഭിന്നസംഖ്യ എന്നാൽ എന്താണ്?',
        phonetic: 'Bhinnasankhya ennal enthannu?',
        pedagogyTitle: 'മധുരമുള്ള മാമ്പഴവും തുല്യമായി പങ്കിടലും! 🥭',
        vernacularExplanation: 'അച്ഛൻ കൊണ്ടുവന്ന ഒരു മാമ്പഴം നീയും അനിയനും തുല്യമായി കഴിക്കാൻ പകുതിയായി മുറിച്ചാൽ, ഒരാൾക്ക് കിട്ടുന്നത് \'പകുതി\' (1/2). 4 തുല്യ കഷ്ണങ്ങളാക്കിയാൽ \'കാൽ\' (1/4). ഒരു മുഴുവൻ വസ്തുവിനെ തുല്യമായി പങ്കിടുന്നതാണ് ഭിന്നസംഖ്യ!',
        localMetaphor: 'മാമ്പഴം തുല്യമായി മുറിച്ചു പങ്കിടൽ',
        culturalKeywords: [{ term: 'പകുതി (1/2)', meaning: 'രണ്ടിൽ ഒരു ഭാഗം' }, { term: 'കാൽ (1/4)', meaning: 'നാലിൽ ഒരു ഭാഗം' }],
        quiz: { question: 'ഒരു ദോശ രണ്ട് തുല്യ ഭാഗങ്ങളാക്കി ഒന്ന് കഴിച്ചാൽ എത്ര കഴിച്ചു?', options: ['പകുതി (1/2)', 'മുഴുവൻ (1)', 'കാൽ (1/4)'], correctIndex: 0, hint: 'രണ്ടിലൊന്ന് എന്താണ്?', successMsg: 'മിടുക്കൻ! ശരിയായ ഉത്തരം! ⭐' }
      },
      bn: {
        literal: 'ভগ্নাংশ কাকে বলে?',
        phonetic: 'Bhognangsho kake bole?',
        pedagogyTitle: 'মিষ্টি পাকা আম আর সমান ভাগে ভাগ করা! 🥭',
        vernacularExplanation: 'বাবা বাজার থেকে একটা মিষ্টি আম আনলেন। তুমি আর তোমার বোন সমান ভাগে খেতে চাইলে ঠিক মাঝখান দিয়ে কেটে ২ টুকরো করবে। এক টুকরো হলো \'অর্ধেক\' (1/2)। ৪ টুকরো করলে এক টুকরো হলো \'এক-চতুর্থাংশ\' বা সিকি (1/4)। কোনো গোটা জিনিস সমান ভাগে ভাগ করাই ভগ্নাংশ!',
        localMetaphor: 'পাকা আম সমান ভাগে ভাগ করে নেওয়া',
        culturalKeywords: [{ term: 'অর্ধেক (1/2)', meaning: 'দুই ভাগের এক ভাগ' }, { term: 'এক-চতুর্থাংশ (1/4)', meaning: 'চার ভাগের এক ভাগ' }],
        quiz: { question: 'একটি রুটি সমান দুভাগে ভাগ করে একভাগ খেলে কতটা খাওয়া হলো?', options: ['অর্ধেক (1/2)', 'গোটা (1)', 'এক-চতুর্থাংশ (1/4)'], correctIndex: 0, hint: 'দুটো সমান ভাগের একটি ভাগ কী?', successMsg: 'দারুণ! একদম সঠিক উত্তর! ⭐' }
      },
      mr: {
        literal: 'अपूर्णांक म्हणजे काय?',
        phonetic: 'Apoornank mhanje kay?',
        pedagogyTitle: 'आईची गोल पोळी आणि मित्रांसोबत वाटणी! 🫓',
        vernacularExplanation: 'आईने गरम गोल पोळी केली आणि तुम्ही दोघे भावंडे भुकेले आहात, तर आई पोळीचे २ समान तुकडे करते. तो एक तुकडा म्हणजे \'अर्धा\' (1/2). ४ मित्रांमध्ये वाटले तर \'पाव\' (1/4). कोणत्याही पूर्ण वस्तूचे समान भाग करणे म्हणजे अपूर्णांक!',
        localMetaphor: 'गोल पोळीचे समान तुकडे करणे',
        culturalKeywords: [{ term: 'अर्धा (1/2)', meaning: 'दोन समान भागांपैकी एक' }, { term: 'पाव (1/4)', meaning: 'चार समान भागांपैकी एक' }],
        quiz: { question: 'कलिंगडाचे ४ समान भाग करून १ खाल्ला, तर किती खाल्ला?', options: ['पाव (1/4)', 'अर्धा (1/2)', 'पूर्ण (1)'], correctIndex: 0, hint: 'चार तुकड्यांपैकी एक तुकडा काय असतो?', successMsg: 'शाब्बास! अगदी बरोबर उत्तर! ⭐' }
      },
      gu: {
        literal: 'અપૂર્ણાંક એટલે શું?',
        phonetic: 'Apoornaank etle shu?',
        pedagogyTitle: 'મીઠી કેરીની ચીરીઓની સરખી વહેંચણી! 🥭',
        vernacularExplanation: 'પપ્પા લાવેલી મીઠી કેરી તમે બે ભાઈ-બહેન સરખે ભાગે વહેંચો તો દરેકને \'અડધો\' (1/2) ભાગ મળે. 4 સરખા ભાગ કરો તો દરેકને \'પા\' (1/4) ભાગ મળે. આખી વસ્તુના સરખા ભાગ કરવા તેને અપૂર્ણાંક કહેવાય!',
        localMetaphor: 'કેરી કે રોટલીની સરખી વહેંચણી',
        culturalKeywords: [{ term: 'અડધો (1/2)', meaning: 'બે સરખા ભાગમાંથી એક' }, { term: 'પા (1/4)', meaning: 'ચાર સરખા ભાગમાંથી એક' }],
        quiz: { question: 'રોટલીના બે સરખા ભાગમાંથી એક ભાગ એટલે શું?', options: ['અડધી રોટલી (1/2)', 'આખી (1)', 'પા (1/4)'], correctIndex: 0, hint: 'બેમાંથી એક ભાગ', successMsg: 'સરસ! સાચો જવાબ! ⭐' }
      },
      pa: {
        literal: 'ਭਿੰਨ (Fraction) ਕੀ ਹੁੰਦੀ ਹੈ?',
        phonetic: 'Bhinn ki hundi hai?',
        pedagogyTitle: 'ਮਾਂ ਦੀ ਗੋਲ ਰੋਟੀ ਅਤੇ ਦੋ ਦੋਸਤਾਂ ਦੀ ਵੰਡ! 🫓',
        vernacularExplanation: 'ਮਾਂ ਨੇ ਇੱਕ ਗਰਮ ਰੋਟੀ ਬਣਾਈ ਅਤੇ ਤੁਸੀਂ ਦੋਵੇਂ ਭਰਾ-ਭੈਣ ਬਰਾਬਰ ਵੰਡ ਕੇ ਖਾਣਾ ਚਾਹੁੰਦੇ ਹੋ, ਤਾਂ ਅੱਧੀ-ਅੱਧੀ (1/2) ਵੰਡੋਗੇ। ਚਾਰ ਹਿੱਸੇ ਕਰੋਗੇ ਤਾਂ ਚੌਥਾਈ (1/4) ਮਿਲੇਗੀ। ਕਿਸੇ ਪੂਰੀ ਚੀਜ਼ ਨੂੰ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਣਾ ਹੀ ਭਿੰਨ ਹੈ!',
        localMetaphor: 'ਗੋਲ ਰੋਟੀ ਨੂੰ ਬਰਾਬਰ ਵੰਡਣਾ',
        culturalKeywords: [{ term: 'ਅੱਧਾ (1/2)', meaning: 'ਦੋ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚੋਂ ਇੱਕ' }, { term: 'ਚੌਥਾਈ (1/4)', meaning: 'ਚਾਰ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਵਿੱਚੋਂ ਇੱਕ' }],
        quiz: { question: 'ਇੱਕ ਰੋਟੀ ਦੇ 2 ਬਰਾਬਰ ਹਿੱਸੇ ਕੀਤੇ ਤਾਂ ਇੱਕ ਹਿੱਸਾ ਕੀ ਅਖਵਾਉਂਦਾ ਹੈ?', options: ['ਅੱਧਾ (1/2)', 'ਪੂਰਾ (1)', 'ਚੌਥਾਈ (1/4)'], correctIndex: 0, hint: 'ਦੋ ਵਿੱਚੋਂ ਇੱਕ ਹਿੱਸਾ', successMsg: 'ਸ਼ਾਬਾਸ਼! ਬਿਲਕੁਲ ਠੀਕ! ⭐' }
      },
      or: {
        literal: 'ଭଗ୍ନାଂଶ କଣ?',
        phonetic: 'Bhagnangsha kana?',
        pedagogyTitle: 'ମିଠା ଆମ୍ବ ଏବଂ ସମାନ ଭାଗ ବଣ୍ଟନ! 🥭',
        vernacularExplanation: 'ବାପା ଗୋଟିଏ ଆମ୍ବ ଆଣିଲେ, ତୁମେ ଓ ତୁମ ସାଙ୍ଗ ସମାନ ଭାବେ ଖାଇବାକୁ ୨ ଭାଗ କଲେ ଗୋଟିଏ ଭାଗ ହେଲା \'ଅଧା\' (1/2)। ୪ ଭାଗ କଲେ \'ଚାରି ଭାଗରୁ ଏକ ଭାଗ\' (1/4)। ଗୋଟିଏ ପୂର୍ଣ୍ଣ ଜିନିଷକୁ ସମାନ ଭାଗରେ ବାଣ୍ଟିବା ହିଁ ଭଗ୍ନାଂଶ!',
        localMetaphor: 'ଆମ୍ବକୁ ସମାନ ଭାବେ ବାଣ୍ଟିବା',
        culturalKeywords: [{ term: 'ଅଧା (1/2)', meaning: 'ଦୁଇ ଭାଗରୁ ଏକ ଭାଗ' }, { term: 'ଏକ ଚତୁର୍ଥାଂଶ (1/4)', meaning: 'ଚାରି ଭାଗରୁ ଏକ ଭାଗ' }],
        quiz: { question: 'ଗୋଟିଏ ରୁଟିକୁ ୨ ସମାନ ଭାଗ କଲେ ଗୋଟିଏ ଭାଗ କଣ?', options: ['ଅଧା (1/2)', 'ପୂରା (1)', 'ଏକ ଚତୁର୍ଥାଂଶ (1/4)'], correctIndex: 0, hint: 'ଦୁଇଟିରୁ ଗୋଟିଏ ଭାଗ', successMsg: 'ବହୁତ ବଢ଼ିଆ! ସଠିକ ଉତ୍ତរ! ⭐' }
      },
      as: {
        literal: 'ভগ্নাংশ কি?',
        phonetic: 'Bhognangxo ki?',
        pedagogyTitle: 'মিঠা আম আৰু সমান ভাগ কৰা! 🥭',
        vernacularExplanation: 'দেউতাই এটা মিঠা আম আনিলে আৰু তুমি আৰু তোমাৰ ভনীয়ে সমানকৈ খাবলৈ ২ ভাগ কৰিলে, এজনে পাব \'আধা\' (1/2)। ৪ ভাগ কৰিলে \'এক-চতুৰ্থাংশ\' (1/4)। কোনো এটা বস্তু সমান ভাগত ভগোৱাই হ\'ল ভগ্নাংশ!',
        localMetaphor: 'আম সমান ভাগত ভগোৱা',
        culturalKeywords: [{ term: 'আধা (1/2)', meaning: 'দুভাগৰ এভাগ' }, { term: 'এক-চতুৰ্থাংশ (1/4)', meaning: 'চাৰিভাগৰ এভাগ' }],
        quiz: { question: 'এখন ৰুটিক ২ সমান ভাগ কৰিলে এটা ভাগ কি?', options: ['আধা (1/2)', 'সম্পূৰ্ণ (1)', 'এক-চতুৰ্থাংশ (1/4)'], correctIndex: 0, hint: 'দুটাত এটা ভাগ', successMsg: 'বৰ সুন্দৰ! শুদ্ধ উত্তৰ! ⭐' }
      },
      en: {
        literal: 'What is a fraction?',
        phonetic: 'What is a fraction?',
        pedagogyTitle: 'Sharing a Delicious Pizza or Roti! 🍕',
        vernacularExplanation: 'Imagine you have one round, warm pancake. You and your best friend want to share it equally. You cut it straight down the middle into 2 equal slices!\n\nYour slice is 1 out of 2 pieces, written as 1/2 (one half). If 4 friends share it equally, each slice is 1/4 (one quarter). A fraction is just equal sharing of a whole!',
        localMetaphor: 'Sharing Warm Pancakes Equally',
        culturalKeywords: [
          { term: 'Numerator', meaning: 'How many slices you have' },
          { term: 'Denominator', meaning: 'Total number of equal slices' }
        ],
        quiz: {
          question: 'If you cut an apple into 2 equal halves and eat one, what fraction did you eat?',
          options: ['1/2', '1/4', '2/1'],
          correctIndex: 0,
          hint: 'One slice out of two equal pieces is half!',
          successMsg: 'Great job! You mastered fractions! ⭐'
        }
      }
    }
  },
  {
    id: 'photosynthesis-plants',
    category: 'EVS & Biology',
    title: 'How do plants cook their food without a stove?',
    grade: 'Class 4–5',
    sourceText: 'Plants need sunlight to grow. Photosynthesis',
    keywords: ['Photosynthesis', 'Sunlight', 'Chlorophyll', 'Leaves', 'Water', 'sun', 'plants'],
    translations: {
      ta: {
        literal: 'தாவரங்கள் வளர சூரிய ஒளி தேவை.',
        phonetic: 'Thaavarangal valara sooriya oli thevai.',
        pedagogyTitle: 'பச்சை இலைகளின் இயற்கை சமையலறை! 🍃☀️',
        vernacularExplanation: 'நமது வீட்டில் அடுப்பு, சிலிண்டர், அரிசி வைத்து சமைப்பது போல, செடிகளும் சமைக்கின்றன! அவற்றின் சமையலறை தான் "பச்சை இலைகள்".\n\nசூரிய வெளிச்சமே அவற்றின் அடுப்பு! வேரிலிருந்து உறிஞ்சும் நீரும், காற்றில் இருக்கும் காற்றும் சமையல் பொருட்கள். இலைகளில் உள்ள "பச்சையம்" சூரிய ஒளியைப் பிடித்து சுவையான உணவைத் தயாரிக்கிறது. இதற்கு பெயர் தான் "ஒளிச்சேர்க்கை" (Photosynthesis)!',
        localMetaphor: 'இலை தான் செடியின் சமையலறை, சூரிய வெளிச்சம் தான் அடுப்பு!',
        culturalKeywords: [
          { term: 'ஒளிச்சேர்க்கை (Photosynthesis)', meaning: 'சூரிய ஒளியால் உணவு தயாரித்தல்' },
          { term: 'பச்சையம் (Chlorophyll)', meaning: 'இலைகளுக்கு பச்சை நிறம் தரும் பொருள்' },
          { term: 'வேர்கள் (Roots)', meaning: 'மண்ணிலிருந்து நீர் உறிஞ்சும் உறுப்பு' }
        ],
        quiz: {
          question: 'செடிகள் உணவு சமைக்க உதவும் முக்கிய இயற்கை அடுப்பு எது?',
          options: ['சூரிய ஒளி (Sunlight)', 'மின்சார அடுப்பு', 'நிலா வெளிச்சம்'],
          correctIndex: 0,
          hint: 'பகலில் வானத்தில் பிரகாசமாக இருப்பது எது?',
          successMsg: 'அற்புதம்! நீ ஒரு தலைசிறந்த தாவரவியல் நிபுணர்! ⭐'
        }
      },
      hi: {
        literal: 'पौधों को बढ़ने के लिए धूप की आवश्यकता होती है।',
        phonetic: 'Paudhon ko badhne ke liye dhoop ki aavashyakta hoti hai.',
        pedagogyTitle: 'हरी पत्तियों की प्यारी रसोई! 🍃☀️',
        vernacularExplanation: 'जैसे घर की रसोई में मां चूल्हे और मसालों से स्वादिष्ट खाना बनाती हैं, वैसे ही पौधों की रसोई उनकी हरी पत्तियाँ हैं!\n\nसूरज की धूप उनका चूल्हा है। जड़ों से पानी और हवा से कार्बन डाईऑक्साइड लेकर पत्तियां अपने हरे रंग (क्लोरोफिल) की मदद से खाना पकाती हैं। इसे विज्ञान में "प्रकाश संश्लेषण" (Photosynthesis) कहते हैं!',
        localMetaphor: 'पत्ती ही पौधे की रसोई और धूप है चूल्हा',
        culturalKeywords: [
          { term: 'प्रकाश संश्लेषण (Photosynthesis)', meaning: 'धूप से भोजन पकाना' },
          { term: 'क्लोरोफिल (Chlorophyll)', meaning: 'पत्तियों का हरा रंग' }
        ],
        quiz: {
          question: 'पौधों की रसोई किसे कहा जाता है?',
          options: ['हरी पत्तियों को', 'जड़ों को', 'फूलों को'],
          correctIndex: 0,
          hint: 'पौधे का कौन सा हिस्सा हरा और चपटा होता है?',
          successMsg: 'लाजवाब! बिल्कुल सही समझा! ⭐'
        }
      },
      te: {
        literal: 'మొక్కలు పెరగడానికి సూర్యరశ్మి అవసరం.',
        phonetic: 'Mokkalu peragadaniki sooryarashmi avasaram.',
        pedagogyTitle: 'ఆకుపచ్చ ఆకుల సహజ వంటగది! 🍃☀️',
        vernacularExplanation: 'మనం ఇంట్లో పొయ్యి వెలిగించి వంట చేసినట్లే, మొక్కలు కూడా ఆకులలో వంట చేస్తాయి! సూర్యరశ్మి వాటి పొయ్యి, వేర్ల నుండి వచ్చే నీరు, గాలిలోని వాయువు వాటి వంట పదార్థాలు. ఆకులోని పచ్చదనం (క్లోరోఫిల్) ఎండను ఉపయోగించి ఆహారం తయారుచేస్తుంది. దీనినే \'కిరణజన్య సంయోగక్రియ\' అంటారు!',
        localMetaphor: 'ఆకులే మొక్కల వంటగది, సూర్యకాంతే పొయ్యి',
        culturalKeywords: [{ term: 'కిరణజన్య సంయోగక్రియ (Photosynthesis)', meaning: 'కాంతి ద్వారా ఆహార తయారీ' }, { term: 'పత్రహరితం (Chlorophyll)', meaning: 'ఆకులకు పచ్చదనం ఇచ్చేది' }],
        quiz: { question: 'మొక్కల వంటగది అని దేనిని అంటారు?', options: ['ఆకుపచ్చ ఆకులు', 'వేర్లు', 'పూలు'], correctIndex: 0, hint: 'మొక్కలో ఆకుపచ్చగా ఉండే భాగం ఏది?', successMsg: 'చాలా బాగుంది! సరైన సమాధానం! ⭐' }
      },
      kn: {
        literal: 'ಗಿಡಗಳು ಬೆಳೆಯಲು ಸೂರ್ಯನ ಬೆಳಕು ಬೇಕು.',
        phonetic: 'Gidagalu beleyalu sooryana belaku beku.',
        pedagogyTitle: 'ಹಸಿರು ಎಲೆಗಳ ಪ್ರಕೃತಿಯ ಅಡುಗೆಮನೆ! 🍃☀️',
        vernacularExplanation: 'ನಾವು ಅಡುಗೆಮನೆಯಲ್ಲಿ ಅಡುಗೆ ಮಾಡುವಂತೆ, ಸಸ್ಯಗಳು ತಮ್ಮ ಹಸಿರು ಎಲೆಗಳಲ್ಲಿ ಅಡುಗೆ ಮಾಡುತ್ತವೆ! ಸೂರ್ಯನ ಬಿಸಿಲೇ ಅವುಗಳ ಒಲೆ, ಬೇರುಗಳಿಂದ ಹೀರುವ ನೀರು ಅವುಗಳ ಸಾಮಗ್ರಿ. ಎಲೆಯಲ್ಲಿರುವ ಹಸಿರು ಬಣ್ಣ (ಹರಿತ್ತು) ಸೂರ್ಯನ ಬೆಳಕನ್ನು ಬಳಸಿ ಆಹಾರ ತಯಾರಿಸುತ್ತದೆ. ಇದಕ್ಕೆ \'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ\' ಎನ್ನುತ್ತಾರೆ!',
        localMetaphor: 'ಎಲೆಯೇ ಸಸ್ಯದ ಅಡುಗೆಮನೆ, ಬಿಸಿಲೇ ಒಲೆ',
        culturalKeywords: [{ term: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ (Photosynthesis)', meaning: 'ಬೆಳಕಿನಿಂದ ಆಹಾರ ತಯಾರಿಸುವುದು' }, { term: 'ಹರಿತ್ತು (Chlorophyll)', meaning: 'ಎಲೆಗೆ ಹಸಿರು ಬಣ್ಣ ಕೊಡುವ ಅಂಶ' }],
        quiz: { question: 'ಸಸ್ಯದ ಅಡುಗೆಮನೆ ಎಂದು ಯಾವುದನ್ನು ಕರೆಯುತ್ತಾರೆ?', options: ['ಹಸಿರು ಎಲೆಗಳು', 'ಬೇರುಗಳು', 'ಕಾಂಡ'], correctIndex: 0, hint: 'ಸಸ್ಯದ ಹಸಿರು ಭಾಗ', successMsg: 'ಅದ್ಭುತ! ಸರಿಯಾದ ಉತ್ತರ! ⭐' }
      },
      ml: {
        literal: 'ചെടികൾ വളരാൻ സൂര്യപ്രകാശം വേണം.',
        phonetic: 'Chedikal valaran sooryaprakaasham venam.',
        pedagogyTitle: 'പച്ചിലകളുടെ പ്രകൃതിദത്ത അടുക്കള! 🍃☀️',
        vernacularExplanation: 'നമ്മുടെ വീട്ടിലെ അടുക്കളയിൽ ഭക്ഷണം പാകം ചെയ്യുന്നതുപോലെ സസ്യങ്ങൾ തങ്ങളുടെ പച്ചിലകളിൽ ഭക്ഷണം പാകം ചെയ്യുന്നു! സൂര്യപ്രകാശമാണ് അവയുടെ അടുപ്പ്, വേരുകൾ വലിച്ചെടുക്കുന്ന വെള്ളം ചേരുവകൾ. ഇലകളിലെ പച്ചനിറം (ഹരിതകം) സൂര്യപ്രകാശം ഉപയോഗിച്ച് ഭക്ഷണം ഉണ്ടാക്കുന്നു. ഇതിനെ \'പ്രകാശസംശ്ലേഷണം\' എന്നു വിളിക്കുന്നു!',
        localMetaphor: 'ഇലകളാണ് സസ്യത്തിന്റെ അടുക്കള, സൂര്യപ്രകാശമാണ് അടുപ്പ്',
        culturalKeywords: [{ term: 'പ്രകാശസംശ്ലേഷണം (Photosynthesis)', meaning: 'വെളിച്ചത്താൽ ഭക്ഷണം നിർമ്മിക്കൽ' }, { term: 'ഹരിതകം (Chlorophyll)', meaning: 'ഇലകൾക്ക് പച്ചനിറം നൽകുന്നത്' }],
        quiz: { question: 'സസ്യങ്ങളുടെ അടുക്കള എന്നറിയപ്പെടുന്നത് ഏതാണ്?', options: ['പച്ചിലകൾ', 'വേരുകൾ', 'പൂക്കൾ'], correctIndex: 0, hint: 'സസ്യത്തിൽ പച്ച നിറമുള്ളത് ഏതിനാണ്?', successMsg: 'ഗംഭീരം! ശരിയായ ഉത്തരം! ⭐' }
      },
      bn: {
        literal: 'গাছের বৃদ্ধির জন্য সূর্যালোক প্রয়োজন।',
        phonetic: 'Gacher briddhir jonno soorjalok proyojon.',
        pedagogyTitle: 'সবুজ পাতার প্রাকৃতিক রান্নাঘর! 🍃☀️',
        vernacularExplanation: 'যেমন মা রান্নাঘরে উনুন জ্বালিয়ে রান্না করেন, তেমনই গাছপালা নিজেদের সবুজ পাতার মধ্যে খাবার তৈরি করে! সূর্যের রোদ হলো তাদের উনুন, আর শিকড় দিয়ে টানা জল হলো রসদ। পাতার সবুজ রং (ক্লোরোফিল) সূর্যের আলো শুষে নিয়ে মিষ্টি খাবার বানায়। একে বিজ্ঞানে বলে \'সালোকসংশ্লেষ\' (Photosynthesis)!',
        localMetaphor: 'সবুজ পাতাই গাছের রান্নাঘর, সূর্যের রোদ উনুন',
        culturalKeywords: [{ term: 'সালোকসংশ্লেষ (Photosynthesis)', meaning: 'আলোর সাহায্যে খাদ্য তৈরি' }, { term: 'ক্লোরোফিল (Chlorophyll)', meaning: 'পাতার সবুজ কণা' }],
        quiz: { question: 'গাছের রান্নাঘর কাকে বলা হয়?', options: ['সবুজ পাতাকে', 'শিকড়কে', 'ফুলকে'], correctIndex: 0, hint: 'গাছের কোন অংশটি সবুজ ও চ্যাপ্টা?', successMsg: 'দারুণ! সঠিক উত্তর! ⭐' }
      },
      mr: {
        literal: 'झाडे वाढण्यासाठी सूर्यप्रकाशाची गरज असते.',
        phonetic: 'Zhade vaadhnyasathi sooryaprakashachi garaj aste.',
        pedagogyTitle: 'हिरव्या पानांचे नैसर्गिक स्वयंपाकघर! 🍃☀️',
        vernacularExplanation: 'आई स्वयंपाकघरात चूल पेटवून जेवण बनवते, तसेच वनस्पती आपल्या हिरव्या पानांमध्ये स्वतःचे अन्न तयार करतात! सूर्यप्रकाश ही त्यांची चूल आहे. मुळांनी शोषलेले पाणी आणि हवेतील वायू घेऊन पानांमधील हिरवा रंग (हरितद्रव्य) सूर्यप्रकाशाच्या मदतीने अन्न शिजवतो. याला \'प्रकाशसंश्लेषण\' म्हणतात!',
        localMetaphor: 'पान म्हणजे वनस्पतींचे स्वयंपाकघर आणि ऊन म्हणजे चूल',
        culturalKeywords: [{ term: 'प्रकाशसंश्लेषण (Photosynthesis)', meaning: 'प्रकाशाने अन्न तयार करणे' }, { term: 'हरितद्रव्य (Chlorophyll)', meaning: 'पानांचा हिरवा रंग' }],
        quiz: { question: 'वनस्पतींचे स्वयंपाकघर कोणाला म्हणतात?', options: ['हिरव्या पानांना', 'मुळांना', 'फांद्यांना'], correctIndex: 0, hint: 'वनस्पतींचा हिरवा भाग कोणता?', successMsg: 'छान! अचूक उत्तर! ⭐' }
      },
      gu: {
        literal: 'છોડને વધવા માટે સૂર્યપ્રકાશની જરૂર છે.',
        phonetic: 'Chhodne vadhva maate sooryaprakashni jaroor chhe.',
        pedagogyTitle: 'લીલાં પાંદડાંનું કુદરતી રસોડું! 🍃☀️',
        vernacularExplanation: 'જેમ મમ્મી રસોડામાં ગેસ પર સ્વાદિષ્ટ રસોઈ બનાવે છે, તેમ છોડ પોતાના લીલાં પાંદડાંમાં ખોરાક બનાવે છે! સૂર્યનો તડકો એમનો ચૂલો છે, મૂળમાંથી પાણી મેળવી પાંદડાંનો લીલો રંગ (હરિતદ્રવ્ય) સૂર્યપ્રકાશથી ખોરાક રાંધે છે. આને \'પ્રકાશસંશ્લેષણ\' કહેવાય છે!',
        localMetaphor: 'પાંદડું છોડનું રસોડું અને તડકો ચૂલો',
        culturalKeywords: [{ term: 'પ્રકાશસંશ્લેષણ (Photosynthesis)', meaning: 'પ્રકાશથી ખોરાક બનાવવો' }, { term: 'હરિતદ્રવ્ય (Chlorophyll)', meaning: 'પાંદડાંનો લીલો રંગ' }],
        quiz: { question: 'છોડનું રસોડું કોને કહેવાય છે?', options: ['લીલાં પાંદડાંને', 'મૂળને', 'ફૂલને'], correctIndex: 0, hint: 'છોડનો લીલો ભાગ', successMsg: 'શાબાશ! સાચો જવાબ! ⭐' }
      },
      pa: {
        literal: 'ਪੌਦਿਆਂ ਨੂੰ ਵਧਣ ਲਈ ਧੁੱਪ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।',
        phonetic: 'Paudiyan nu vadhan layi dhupp di lod hundi hai.',
        pedagogyTitle: 'ਹਰੇ ਪੱਤਿਆਂ ਦੀ ਕੁਦਰਤੀ ਰਸੋਈ! 🍃☀️',
        vernacularExplanation: 'ਜਿਵੇਂ ਮਾਂ ਰਸੋਈ ਵਿੱਚ ਚੁੱਲ੍ਹੇ \'ਤੇ ਖਾਣਾ ਬਣਾਉਂਦੀ ਹੈ, ਉਵੇਂ ਹੀ ਪੌਦੇ ਆਪਣੇ ਹਰੇ ਪੱਤਿਆਂ ਵਿੱਚ ਖਾਣਾ ਤਿਆਰ ਕਰਦੇ ਹਨ! ਸੂਰਜ ਦੀ ਧੁੱਪ ਉਹਨਾਂ ਦਾ ਚੁੱਲ੍ਹਾ ਹੈ ਅਤੇ ਜੜ੍ਹਾਂ ਤੋਂ ਪਾਣੀ ਲੈ ਕੇ ਪੱਤੇ ਆਪਣੇ ਹਰੇ ਰੰਗ (ਕਲੋਰੋਫਿਲ) ਨਾਲ ਭੋਜਨ ਬਣਾਉਂਦੇ ਹਨ। ਇਸ ਨੂੰ \'ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ\' ਕਿਹਾ ਜਾਂਦਾ ਹੈ!',
        localMetaphor: 'ਪੱਤਾ ਹੀ ਪੌਦੇ ਦੀ ਰਸੋਈ ਅਤੇ ਧੁੱਪ ਚੁੱਲ੍ਹਾ ਹੈ',
        culturalKeywords: [{ term: 'ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ (Photosynthesis)', meaning: 'ਧੁੱਪ ਨਾਲ ਭੋਜਨ ਬਣਾਉਣਾ' }, { term: 'ਕਲੋਰੋਫਿਲ (Chlorophyll)', meaning: 'ਪੱਤਿਆਂ ਦਾ ਹਰਾ ਰੰਗ' }],
        quiz: { question: 'ਪੌਦਿਆਂ ਦੀ ਰਸੋਈ ਕਿਸ ਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?', options: ['ਹਰੇ ਪੱਤਿਆਂ ਨੂੰ', 'ਜੜ੍ਹਾਂ ਨੂੰ', 'ਫੁੱਲਾਂ ਨੂੰ'], correctIndex: 0, hint: 'ਪੌਦੇ ਦਾ ਹਰਾ ਹਿੱਸਾ', successMsg: 'ਬਹੁਤ ਵਧੀਆ! ਸਹੀ ਜਵਾਬ! ⭐' }
      },
      or: {
        literal: 'ଗଛ ବଢ଼ିବା ପାଇଁ ସୂର୍ଯ୍ୟାଲୋକ ଦରକାର।',
        phonetic: 'Gachha badhiba pain sooryaloka darakar.',
        pedagogyTitle: 'ସବୁଜ ପତ୍ରର ପ୍ରାକୃତିକ ରୋଷେଇ ଘର! 🍃☀️',
        vernacularExplanation: 'ଯେପରି ମାଆ ରୋଷେଇ ଘରେ ଚୁଲିରେ ରୋଷେଇ କରନ୍ତି, ସେହିପରି ଗଛମାନେ ନିଜ ସବୁଜ ପତ୍ରରେ ଖାଦ୍ୟ ତିଆରି କରନ୍ତି! ସୂର୍ଯ୍ୟଙ୍କ ଖରା ସେମାନଙ୍କ ଚୁଲି। ଚେରରୁ ପାଣି ନେଇ ପତ୍ରର ସବୁଜ ରଙ୍ଗ (ହରିତକଣିକା) ସାହାଯ୍ୟରେ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତ କରନ୍ତି। ଏହାକୁ \'ଆଲୋକଶ୍ଳେଷଣ\' କୁହାଯାଏ!',
        localMetaphor: 'ପତ୍ର ହିଁ ଗଛର ରୋଷେଇ ଘର ଓ ଖରା ହେଉଛି ଚୁଲି',
        culturalKeywords: [{ term: 'ଆଲୋକଶ୍ଳେଷଣ (Photosynthesis)', meaning: 'ଆଲୋକରେ ଖାଦ୍ୟ ତିଆରି' }, { term: 'ହରିତକଣିକା (Chlorophyll)', meaning: 'ପତ୍ରର ସବୁଜ ରଙ୍ଗ' }],
        quiz: { question: 'ଗଛର ରୋଷେଇ ଘର କାହାକୁ କୁହାଯାଏ?', options: ['ସବୁଜ ପତ୍ରକୁ', 'ଚେରକୁ', 'ଫୁଲକୁ'], correctIndex: 0, hint: 'ଗଛର ସବୁଜ ଅଂଶ', successMsg: 'ଅତି ସୁନ୍ଦର! ସଠିକ ଉତ୍ତର! ⭐' }
      },
      as: {
        literal: 'গছ বাঢ়িবলৈ সূৰ্যৰ পোহৰ লাগে।',
        phonetic: 'Gos barhiboloi soorjor pohor lage.',
        pedagogyTitle: 'সেউজীয়া পাতৰ প্ৰাকৃতিক পাকঘৰ! 🍃☀️',
        vernacularExplanation: 'যিদৰে মাকে পাকঘৰত ৰন্ধা-বঢ়া কৰে, ঠিক তেনেদৰে গছ-গছনিয়ে নিজৰ সেউজীয়া পাতত আহাৰ প্ৰস্তুত কৰে! সূৰ্যৰ ৰ\'দ তেওঁলোকৰ চৌকা, আৰু শিপাৰ পৰা পানী লৈ পাতৰ সেউজীয়া ৰঙে (হৰিৎকণা) আহাৰ তৈয়াৰ কৰে। ইয়াক \'সালোকসংশ্লেষণ\' বোলা হয়!',
        localMetaphor: 'পাতেই গছৰ পাকঘৰ আৰু ৰ\'দেই চৌকা',
        culturalKeywords: [{ term: 'সালোকসংশ্লেষণ (Photosynthesis)', meaning: 'পোহৰৰ দ্বাৰা খাদ্য প্ৰস্তুত' }, { term: 'হৰিৎকণা (Chlorophyll)', meaning: 'পাতৰ সেউজীয়া ৰং' }],
        quiz: { question: 'গছৰ পাকঘৰ কাক কোৱা হয়?', options: ['সেউজীয়া পাতক', 'শিপাক', 'ফুলক'], correctIndex: 0, hint: 'গছৰ সেউজীয়া অংশ', successMsg: 'বৰ ধুনীয়া! শুদ্ধ উত্তৰ! ⭐' }
      },
      en: {
        literal: 'Plants need sunlight to grow.',
        phonetic: 'Plants need sunlight to grow.',
        pedagogyTitle: 'The Green Leaf Kitchen Powered by Sunshine! 🍃☀️',
        vernacularExplanation: 'Plants do not go to the grocery store — they make their own meals right inside their green leaves!\n\nSunlight acts like the cooking stove, water pulled up from roots is the soup, and carbon dioxide from the air is the spice. The green color in leaves (chlorophyll) captures sunshine to bake sweet plant food! We call this Photosynthesis.',
        localMetaphor: 'Leaves as solar-powered kitchens',
        culturalKeywords: [
          { term: 'Photosynthesis', meaning: 'Making food with light' },
          { term: 'Chlorophyll', meaning: 'Green pigment that traps sunlight' }
        ],
        quiz: {
          question: 'What traps the sunlight inside the green leaves?',
          options: ['Chlorophyll', 'Bark', 'Flower petals'],
          correctIndex: 0,
          hint: 'It gives leaves their vibrant green color!',
          successMsg: 'Spot on! You understand photosynthesis! ⭐'
        }
      }
    }
  }
];

// Student Dashboard Mock Data
export const STUDENT_PROFILE = {
  name: 'Aarav Kumar (ஆரவ்)',
  avatar: '👦🏽',
  grade: 'Class 3 (3-ஆம் வகுப்பு)',
  motherTongue: 'Tamil (தமிழ்)',
  streakDays: 5,
  stars: 140,
  xp: 780,
  nextLevelXp: 1000,
  badgeCount: 6,
  badges: [
    { id: 'b1', name: 'Water Wizard 💧', desc: 'Mastered the Water Cycle in Tamil', icon: '🌊' },
    { id: 'b2', name: 'Fraction Friend 🥭', desc: 'Solved Mango Fraction Puzzles', icon: '🥭' },
    { id: 'b3', name: 'Plant Protector 🍃', desc: 'Discovered Photosynthesis secret', icon: '🌱' },
    { id: 'b4', name: '5-Day Flame 🔥', desc: '5-day mother tongue streak', icon: '🔥' },
    { id: 'b5', name: 'Tamil Scholar 📜', desc: 'Learned 25 vernacular scientific terms', icon: '📖' },
    { id: 'b6', name: 'Voice Star 🎙️', desc: 'Spoke 10 questions in Tamil', icon: '⭐' }
  ],
  subjects: [
    {
      id: 'science',
      name: 'Science (அறிவியல்)',
      icon: '🔬',
      color: '#3B82F6',
      progress: 75,
      currentLesson: 'மழை மேகங்களின் ரகசியம் (Secret of Rain Clouds)',
      completedLessons: 6,
      totalLessons: 8,
      recentScore: '95%'
    },
    {
      id: 'math',
      name: 'Mathematics (கணிதம்)',
      icon: '📐',
      color: '#10B981',
      progress: 60,
      currentLesson: 'பின்னங்கள்: மாம்பழப் பகிர்வு (Fractions with Mangoes)',
      completedLessons: 4,
      totalLessons: 7,
      recentScore: '88%'
    },
    {
      id: 'evs',
      name: 'Environmental Studies (சூழ்நிலையியல்)',
      icon: '🌍',
      color: '#F59E0B',
      progress: 85,
      currentLesson: 'நமது உள்ளூர் மூலிகைகள் (Local Medicinal Herbs: Tulsi & Neem)',
      completedLessons: 7,
      totalLessons: 8,
      recentScore: '100%'
    },
    {
      id: 'lang',
      name: 'Regional Language (தாய்மொழித் தமிழ்)',
      icon: '🗣️',
      color: '#EC4899',
      progress: 90,
      currentLesson: 'பாரதியார் பாடல்கள் & சொல்லாட்சி (Poetry & Vocabulary)',
      completedLessons: 9,
      totalLessons: 10,
      recentScore: '92%'
    },
    {
      id: 'gk',
      name: 'General Knowledge (பொது அறிவு)',
      icon: '💡',
      color: '#8B5CF6',
      progress: 50,
      currentLesson: 'நமது மாவட்டத்தின் கைவினைக் கலைகள் (Local Crafts)',
      completedLessons: 3,
      totalLessons: 6,
      recentScore: '80%'
    }
  ]
};

// Teacher Hub Mock Data
export const TEACHER_DATA = {
  name: 'Mrs. Lakshmi Sundaram',
  school: 'Panchayat Union Primary School, Madurai',
  totalStudents: 34,
  averageClassScore: '84%',
  languageBreakdown: [
    { language: 'Tamil (Mother Tongue)', percentage: 72, count: 24, color: '#3B82F6' },
    { language: 'Telugu (Home Language)', percentage: 18, count: 6, color: '#10B981' },
    { language: 'Hindi (Migrant Families)', percentage: 10, count: 4, color: '#F59E0B' }
  ],
  conceptMisconceptions: [
    {
      concept: 'Evaporation vs Boiling',
      confusionLevel: 'High',
      barrierReason: 'English textbook uses "condensation" which children memorized without understanding the lid/steam concept.',
      aiRecommendation: 'Use the vernacular Rasam Lid experiment. Recommended lesson plan ready below.'
    },
    {
      concept: 'Fractions (1/3 vs 1/4)',
      confusionLevel: 'Medium',
      barrierReason: 'Children think 1/4 is bigger because 4 is greater than 3.',
      aiRecommendation: 'Use Chapati or Idli division visual metaphor in Tamil.'
    },
    {
      concept: 'Plant Breathing vs Eating',
      confusionLevel: 'Low',
      barrierReason: 'Confusion between oxygen intake and photosynthesis sugar creation.',
      aiRecommendation: 'Emphasize leaf as cooking kitchen vs roots as drinking straws.'
    }
  ],
  savedLessons: [
    {
      id: 'tl-1',
      topic: 'The Water Cycle (நீர் சுழற்சி)',
      grade: 'Class 4',
      language: 'Tamil',
      difficulty: 'Beginner',
      dateCreated: 'Today',
      storyHook: 'குட்டி நீர்த்துளி "முத்து"வின் சாகசப் பயணம்! (Adventure of little droplet Muthu)',
      activity: 'Bring a stainless steel plate, warm water bowl, and ice cube to the classroom.'
    },
    {
      id: 'tl-2',
      topic: 'Fractions with Local Snacks (பின்னங்கள்)',
      grade: 'Class 3',
      language: 'Tamil',
      difficulty: 'Beginner',
      dateCreated: 'Yesterday',
      storyHook: 'சுடச்சுட மொறுமொறு தோசையும் நால்வர் நட்பும் (Hot Dosa & 4 Friends)',
      activity: 'Use round paper plates folded into halves and quarters.'
    }
  ]
};

// Parent Portal Mock Data
export const PARENT_DATA = {
  parentGreeting: 'வணக்கம் அம்மா / அப்பா! (Welcome Parents)',
  studentName: 'Aarav Kumar (ஆரவ்)',
  timeSpentToday: '28 minutes',
  conceptsMasteredThisWeek: 4,
  recentLearnings: [
    {
      subject: 'Science',
      topic: 'நீர் சுழற்சி (Water Cycle)',
      narrative: 'Aarav learned why rain falls using our kitchen rasam steam analogy. He can explain "ஆவியாதல்" (Evaporation) with 100% confidence!'
    },
    {
      subject: 'Mathematics',
      topic: 'பின்னங்கள் (Fractions)',
      narrative: 'Aarav understands 1/2 and 1/4 by dividing fruits. Ask him to help you slice cucumber or bread at dinner!'
    }
  ],
  dinnerTablePrompt: 'இன்று இரவு சமைக்கும் போது: "குக்கரில் இருந்து வரும் ஆவி எங்கே போகிறது?" என்று ஆரவிடம் கேளுங்கள்! அவன் அழகாக விளக்குவான்.',
  audioNote: 'Aarav spoke 3 sentences in scientific Tamil today with clear pronunciation!'
};
