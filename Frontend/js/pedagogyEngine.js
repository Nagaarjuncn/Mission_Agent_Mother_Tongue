// Vernacular Pedagogy Engine: Transforming raw questions into culturally rooted learning
import { PEDAGOGY_KNOWLEDGE_BASE, SUPPORTED_LANGUAGES } from './mockData.js';

export class PedagogyEngine {
  constructor() {
    this.knowledgeBase = PEDAGOGY_KNOWLEDGE_BASE;
  }

  // Find best matching concept or fallback to smart generative synthesis
  explainConcept(query, targetLang = 'ta') {
    const qLower = query.toLowerCase().trim();

    // 1. Search knowledge base
    let matchedItem = this.knowledgeBase.find(item => {
      const titleMatch = item.title.toLowerCase().includes(qLower) || qLower.includes(item.sourceText.toLowerCase());
      const keywordMatch = item.keywords.some(kw => qLower.includes(kw.toLowerCase()));
      return titleMatch || keywordMatch;
    });

    if (!matchedItem) {
      // Default to water cycle if nothing matched
      matchedItem = this.knowledgeBase[0];
    }

    const langData = matchedItem.translations[targetLang] || matchedItem.translations['en'] || matchedItem.translations['ta'];
    const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

    return {
      conceptId: matchedItem.id,
      category: matchedItem.category,
      grade: matchedItem.grade,
      queryText: query,
      targetLanguage: langMeta.name,
      targetNativeName: langMeta.nativeName,
      speechCode: langMeta.speechCode,
      literalTranslation: langData.literal,
      phonetic: langData.phonetic || '',
      pedagogyTitle: langData.pedagogyTitle,
      vernacularExplanation: langData.vernacularExplanation,
      localMetaphor: langData.localMetaphor,
      culturalKeywords: langData.culturalKeywords || [],
      quiz: langData.quiz
    };
  }

  // Generate complete teacher lesson plan dynamically
  generateLessonPlan(topic, grade, lang, difficulty, context) {
    const isTamil = lang === 'ta' || lang === 'Tamil';
    const isHindi = lang === 'hi' || lang === 'Hindi';

    if (topic.toLowerCase().includes('water') || topic.toLowerCase().includes('rain') || topic.includes('மழை') || topic.includes('நீர்')) {
      if (isTamil) {
        return {
          topic: 'மழை சுழற்சி & ஆவியாதல் (The Water Cycle)',
          grade: grade || 'Class 4',
          language: 'Tamil (தமிழ்)',
          difficulty: difficulty || 'Beginner',
          contextHook: 'மதுரை வைகை ஆறும் இல்லத்துப் பானையும் (Local River & Kitchen Pot)',
          storyHook: 'குட்டி நீர்த்துளி "முத்து"வின் சாகசப் பயணம்: வைகை ஆற்றில் விளையாடிய முத்து, சூரியனின் அன்பான வெப்பத்தால் நீராவிச் சிறகு பெற்று வானத்துக்குப் பறந்தான்! அங்கே குளிர்ந்த காற்றோடு கைகோர்த்து மேகமாகி, மீண்டும் மழையாகத் தன் நண்பர்களான நெற்பயிர்களைக் காண பூமிக்கு வந்தான்.',
          keyVocabulary: [
            { term: 'ஆவியாதல் (Evaporation)', desc: 'நீர் சூடாகி மேலே செல்வது' },
            { term: 'குளிர்வடைதல் (Condensation)', desc: 'ஆவி குளிர்ந்து மேகமாவது' },
            { term: 'மழைப்பொழிவு (Precipitation)', desc: 'குளிர்ந்த மேகம் நீராவது' },
            { term: 'நிலத்தடி நீர் (Groundwater)', desc: 'மண்ணில் ஊறும் ஊற்று நீர்' }
          ],
          activity: 'வகுப்பறை செயல்முறை: ஒரு எவர்சில்வர் தட்டை எடுத்து, சுடுநீர்க் கிண்ணத்தின் மேல் வையுங்கள். தட்டின் கீழ் பனித்துளி போல நீர்த்துளிகள் உருவாவதைக் குழந்தைகள் தொட்டுப் பார்க்கச் செய்யுங்கள்.',
          quizQuestions: [
            { q: 'வைகை ஆற்றின் நீர் எதனால் நீராவியாக மாறுகிறது?', a: 'சூரிய வெப்பம்' },
            { q: 'வானில் உள்ள மேகங்கள் குளிர்ந்ததும் என்னவாக மாறுகின்றன?', a: 'மழைத்துளிகள்' }
          ],
          homework: 'இன்று உங்கள் வீட்டில் மழைநீர் சேகரிப்புத் தொட்டி இருக்கிறதா என்று பெற்றோரிடம் கேட்டு, ஒரு வரைபடம் வரைந்து வாருங்கள்!'
        };
      } else if (isHindi) {
        return {
          topic: 'जल चक्र और वर्षा (Water Cycle & Rain)',
          grade: grade || 'Class 4',
          language: 'Hindi (हिन्दी)',
          difficulty: difficulty || 'Beginner',
          contextHook: 'गंगा नदी की धारा और घर की रसोई की चाय',
          storyHook: 'छोटी जलपरी "बूंद" की कहानी: नदी में तैरती बूंद धूप के जादू से पंख लगाकर आसमान में उड़ी और बादलों के साथ खेल-कूद कर फिर से किसान के खेतों पर छम-छम बरस पड़ी!',
          keyVocabulary: [
            { term: 'वाष्पीकरण (Evaporation)', desc: 'पानी का भाप बनना' },
            { term: 'संघनन (Condensation)', desc: 'भाप का बादल बनना' },
            { term: 'वर्षा (Precipitation)', desc: 'बूंदों का गिरना' }
          ],
          activity: 'कक्षा गतिविधि: कटोरी में गर्म पानी लें और उसपर ठंडी थाली रखें। थाली के नीचे बूंदों को बच्चों को दिखाएं।',
          quizQuestions: [
            { q: 'नदी का पानी भाप कौन बनाता है?', a: 'सूरज की गर्मी' }
          ],
          homework: 'घर में जाकर मां से पूछें कि दाल उबलते समय ढक्कन पर पानी की बूंदें क्यों आती हैं?'
        };
      }
    }

    // Default universal lesson plan
    return {
      topic: `${topic} (${grade})`,
      grade: grade || 'Class 4',
      language: lang || 'Tamil',
      difficulty: difficulty || 'Beginner',
      contextHook: 'Local village market & everyday household objects',
      storyHook: `A relatable narrative introducing ${topic} using familiar storytelling traditions, engaging children through curiosity and everyday kitchen/farm observations.`,
      keyVocabulary: [
        { term: 'Core Principle', desc: 'Fundamental concept explained in mother tongue' },
        { term: 'Local Example', desc: 'Metaphor from daily household life' },
        { term: 'Scientific Application', desc: 'Real-world relevance' }
      ],
      activity: 'Interactive group activity using paper, clay, or common classroom stationery with zero additional cost.',
      quizQuestions: [
        { q: `How does ${topic} help our community?`, a: 'Provides life and understanding' }
      ],
      homework: 'Observe this phenomenon at home and discuss with grandparents or parents in your mother tongue.'
    };
  }
}

export const pedagogyEngine = new PedagogyEngine();
