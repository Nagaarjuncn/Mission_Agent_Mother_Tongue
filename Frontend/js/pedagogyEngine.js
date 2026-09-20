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

  // AI Topic Suggestions by Standard Level & Subject
  suggestTopics(grade = 'Class 4', subject = 'Environmental Studies (EVS)', standardLevel = 'Preparatory Stage', lang = 'ta') {
    const isTamil = lang === 'ta' || lang === 'Tamil';
    const isHindi = lang === 'hi' || lang === 'Hindi';
    const g = (grade || 'Class 4').toLowerCase();

    if (g.includes('1') || g.includes('2') || g.includes('balvatika') || g.includes('anganwadi')) {
      return [
        {
          topic_title: 'Parts of a Plant & Little Green Sprouts',
          vernacular_title: isTamil ? 'செடியின் உறுப்புகளும் பாட்டியின் தோட்டமும்' : 'पौधे के अंग और दादी की बगिया',
          cultural_hook: 'Sprouting green moong beans on wet cotton with grandmother',
          difficulty: 'Beginner',
          standard_level: `${grade} (Foundational Stage)`,
          learning_outcome: 'Identify roots, stem, leaves, and flowers using living garden plants.'
        },
        {
          topic_title: 'Our Five Senses & Festive Sweets',
          vernacular_title: isTamil ? 'ஐம்புலன்களும் தீபாவளி பலகாரமும்' : 'पांच ज्ञानेंद्रियां और दीवाली के पकवान',
          cultural_hook: 'Smelling fresh jasmine, tasting sweet payasam/ladoo, hearing morning temple bells',
          difficulty: 'Beginner',
          standard_level: `${grade} (Foundational Stage)`,
          learning_outcome: 'Name the 5 sense organs and connect them to daily bodily experiences.'
        },
        {
          topic_title: 'Shapes Around Us: Round Rotis & Triangular Samosas',
          vernacular_title: isTamil ? 'வடிவங்கள்: வட்ட நிலாவும் முக்கோண சமோசாவும்' : 'हमारे आकार: गोल रोटी और तिकोना समोसा',
          cultural_hook: 'Identifying circles in rotis, triangles in samosas, rectangles in school slates',
          difficulty: 'Beginner',
          standard_level: `${grade} (Foundational Stage)`,
          learning_outcome: 'Recognize circles, squares, rectangles, and triangles in everyday life.'
        }
      ];
    } else if (g.includes('6') || g.includes('7') || g.includes('8')) {
      return [
        {
          topic_title: 'States of Matter & Kitchen Phase Transitions',
          vernacular_title: isTamil ? 'பருப்பொருளின் நிலைகள்: பனி முதல் நீராவி வரை' : 'पदार्थ की अवस्थाएं: ठोस, द्रव और गैस',
          cultural_hook: 'Melting ice cubes, boiling tea saucepan, and condensing steam lids',
          difficulty: 'Intermediate',
          standard_level: `${grade} (Middle Stage)`,
          learning_outcome: 'Demonstrate particulate behavior of solids, liquids, and gases during phase transitions.'
        },
        {
          topic_title: 'Electric Circuits & Festive String Lights',
          vernacular_title: isTamil ? 'மின்சுற்றுகளும் தீபாவளி வண்ண விளக்குகளும்' : 'विद्युत परिपथ और त्योहारों की झालर',
          cultural_hook: 'Tracing how battery torches and festive festival lights turn on only when the loop is complete',
          difficulty: 'Intermediate',
          standard_level: `${grade} (Middle Stage)`,
          learning_outcome: 'Construct a simple series circuit with cell, switch, wires, and LED bulb.'
        },
        {
          topic_title: 'Seed Dispersal & Traveling Plants of the Village',
          vernacular_title: isTamil ? 'விதை பரவுதல்: காற்றில் பறக்கும் விதைகளும் பறவைகளும்' : 'बीज प्रकीर्णन: हवा और पक्षियों की यात्रा',
          cultural_hook: 'How banyan seeds sprout on old temple walls carried by birds',
          difficulty: 'Advanced',
          standard_level: `${grade} (Middle Stage)`,
          learning_outcome: 'Categorize seed dispersal by wind, water, animals, and explosive action.'
        }
      ];
    }

    // Default Preparatory Stage (Class 3 - 5)
    return [
      {
        topic_title: 'The Water Cycle & Cloud Formation',
        vernacular_title: isTamil ? 'மழை சுழற்சி & ஆவியாதல்' : 'जल चक्र और वर्षा की बूंदें',
        cultural_hook: 'Boiling tea pot steam condensing on the lid compared with Vaigai/Ganges rivers',
        difficulty: 'Beginner',
        standard_level: `${grade} (Preparatory Stage)`,
        learning_outcome: 'Explain evaporation, condensation, and precipitation using everyday kitchen phenomena.'
      },
      {
        topic_title: 'Photosynthesis: The Plant Kitchen in the Courtyard',
        vernacular_title: isTamil ? 'ஒளிச்சேர்க்கை: முற்றத்து துளசிச் செடியின் சமையலறை' : 'प्रकाश-संश्लेषण: आंगन के पौधे की रसोई',
        cultural_hook: 'How green leaves use sunlight like mother uses stove fire to make sweet food',
        difficulty: 'Intermediate',
        standard_level: `${grade} (Preparatory Stage)`,
        learning_outcome: 'Describe how plants synthesize food using sunlight, carbon dioxide, and root water.'
      },
      {
        topic_title: 'Fractions: Sharing Sweet Mangoes & Steaming Idlis',
        vernacular_title: isTamil ? 'பின்னங்கள்: மாம்பழத் துண்டுகளும் இட்லிப் பகிர்வும்' : 'भिन्न: आम के टुकड़े और रोटी का बंटवारा',
        cultural_hook: 'Dividing one sweet Alphonso mango or flat chapati equally among 2 and 4 siblings',
        difficulty: 'Intermediate',
        standard_level: `${grade} (Preparatory Stage)`,
        learning_outcome: 'Understand 1/2, 1/4, 3/4 visually as parts of a whole.'
      }
    ];
  }

  // Generate complete 7-stage teacher lesson plan dynamically
  generateLessonPlan(optionsOrTopic, grade = 'Class 4', lang = 'ta', difficulty = 'Beginner', context = '') {
    let opt = {};
    if (typeof optionsOrTopic === 'object' && optionsOrTopic !== null) {
      opt = optionsOrTopic;
    } else {
      opt = {
        topic: optionsOrTopic || 'The Water Cycle',
        grade: grade || 'Class 4',
        language: lang || 'Tamil',
        difficulty: difficulty || 'Beginner',
        subject: 'Environmental Studies (EVS)',
        standardLevel: `${grade || 'Class 4'} Stage`,
        pedagogicalLevel: 'Level 1: Foundational & Story-first',
        duration: '40 Minutes',
        contextNotes: context || ''
      };
    }

    const topic = opt.topic || 'The Water Cycle';
    const topicLower = topic.toLowerCase();
    const lGrade = opt.grade || 'Class 4';
    const lLang = opt.language || 'Tamil';
    const lDiff = opt.difficulty || 'Beginner';
    const lSubj = opt.subject || 'Environmental Studies (EVS)';
    const lStandard = opt.standardLevel || `${lGrade} Stage`;
    const lPedagogy = opt.pedagogicalLevel || 'Level 1: Foundational & Story-first';
    const lDuration = opt.duration || '40 Minutes';

    const isTamil = lLang.toLowerCase().includes('ta') || lLang.toLowerCase().includes('tamil');
    const isHindi = lLang.toLowerCase().includes('hi') || lLang.toLowerCase().includes('hindi');

    // 1. Water Cycle
    if (topicLower.includes('water') || topicLower.includes('rain') || topic.includes('மழை') || topic.includes('நீர்') || topic.includes('जल')) {
      if (isTamil) {
        return {
          topic: 'மழை சுழற்சி & ஆவியாதல் (The Water Cycle)',
          grade: lGrade,
          subject: lSubj,
          standardLevel: lStandard,
          language: 'Tamil (தமிழ்)',
          difficulty: lDiff,
          pedagogicalLevel: lPedagogy,
          duration: lDuration,
          contextHook: 'மதுரை வைகை ஆறும் இல்லத்துப் பானையும் (Local River & Kitchen Pot)',
          storyHook: 'குட்டி நீர்த்துளி "முத்து"வின் சாகசப் பயணம்: வைகை ஆற்றில் மீன்களோடு விளையாடிய முத்து, சூரியனின் அன்பான வெப்பத்தால் நீராவிச் சிறகு பெற்று வானத்துக்குப் பறந்தான்! அங்கே குளிர்ந்த காற்றோடு கைகோர்த்து மேகமாகி, மீண்டும் மழையாகத் தன் நண்பர்களான நெற்பயிர்களைக் காண பூமிக்கு வந்தான்.',
          conceptExplanation: 'சூரியனின் வெப்பத்தால் நிலத்திலும் ஆறுகளிலும் உள்ள நீர் சூடாகி நீராவியாக மேலே செல்கிறது. மேலே செல்லச் செல்லக் காற்று குளிர்ச்சியடைவதால், அந்த நீராவி குளிர்ந்து மேகங்களாக மாறுகிறது. மேகங்கள் கனத்து குளிர்ந்த காற்று படும்போது மீண்டும் மழைத்துளிகளாகப் பூமிக்கு வருகின்றன.',
          learningObjectives: [
            'வெப்பம் நீரை கண்ணுக்குத் தெரியாத நீராவியாக மாற்றுகிறது என்பதை அறிதல்.',
            'குளிர்ந்த காற்றில் நீராவி சுருங்கி மேகமாவதை உணர்தல்.',
            'மழைநீர் நிலத்தடி நீராகவும் நீர்நிலைகளிலும் சேர்வதைப் புரிந்துகொள்ளுதல்.'
          ],
          keyVocabulary: [
            { term: 'ஆவியாதல் (Evaporation)', desc: 'வெப்பத்தால் நீர் நீராவியாக மேலே பறப்பது' },
            { term: 'குளிர்வடைதல் (Condensation)', desc: 'ஆவி குளிர்ந்து மேகக் கூட்டமாவது' },
            { term: 'மழைப்பொழிவு (Precipitation)', desc: 'குளிர்ந்த மேகம் நீராவது' },
            { term: 'நிலத்தடி நீர் (Groundwater)', desc: 'மண்ணில் ஊறி ஊற்றாக மாறும் நீர்' }
          ],
          activity: 'வகுப்பறை செயல்முறை: ஒரு எவர்சில்வர் தட்டை எடுத்து, சுடுநீர்க் கிண்ணத்தின் மேல் வையுங்கள். தட்டின் கீழ் பனித்துளி போல நீர்த்துளிகள் உருவாவதைக் குழந்தைகள் தொட்டுப் பார்க்கச் செய்யுங்கள்.',
          timelineBreakdown: [
            { phase: '0-5 min', title: 'பிரேரணை (Story Hook)', desc: 'சுடுநீர்க் கிண்ணத்தின் மேல் எழும் ஆவியைக் காட்டி கதையைத் தொடங்குதல்.' },
            { phase: '5-18 min', title: 'சங்கல்பம் (Core Concept)', desc: 'முத்து நீர்த்துளியின் 3 நிலை மாற்றங்களை பலகையில் வரைந்து கற்பித்தல்.' },
            { phase: '18-28 min', title: 'செயல்முறை (Activity)', desc: 'எவர்சில்வர் தட்டு & சுடுநீர்க் கிண்ணப் பரிசோதனை.' },
            { phase: '28-35 min', title: 'மதிப்பீடு (Quiz)', desc: '3 விரைவு வாய்மொழி வினாக்கள்.' },
            { phase: '35-40 min', title: 'குடும்பப் பாலம் (Home Bridge)', desc: 'இரவு உணவுக் கலந்துரையாடல் வினாவை வழங்கி முடித்தல்.' }
          ],
          blackboardLayout: {
            left_column: 'நோக்கங்கள்:\n1. ஆவியாதல்\n2. மேகம் உருவாதல்\n3. மழைப்பொழிவு',
            center_column: '[படம்: ஆறு ➔ ஆவி (மேலே) ➔ மேகம் ➔ மழை ➔ நிலத்தடி நீர்]',
            right_column: 'முக்கியச் சொற்கள்:\n• ஆவியாதல்\n• குளிர்வடைதல்\nவீட்டுப் பணி: மழைநீர் சேகரிப்பு'
          },
          differentiatedGuidance: {
            support_struggling_learners: 'குளிர்ந்த கரண்டியில் ஆவி படியும் காட்சியைத் தொட்டு உணரச் செய்தல்.',
            advanced_learners: 'வெயிலில் துணி காயும் நிகழ்வோடு ஆவியாதலை ஒப்பிடச் செய்தல்.'
          },
          misconceptionsAddressed: [
            'தவறான கருத்து: மேகங்கள் பஞ்சு போன்ற திடப்பொருட்கள். -> உண்மை: மேகங்கள் லட்சக்கணக்கான நுண் நீர்த்துளிகளால் ஆனவை.',
            'தவறான கருத்து: கடலிலிருந்து மட்டுமே மழை வருகிறது. -> உண்மை: குளம், வயல்வெளிகள், மரங்களின் இலைகளிலிருந்தும் நீர் ஆவியாகிறது.'
          ],
          quizQuestions: [
            { q: 'வைகை ஆற்றின் நீர் எதனால் நீராவியாக மாறுகிறது?', a: 'சூரிய வெப்பம்', options: ['சூரிய வெப்பம்', 'நிலவொளி', 'மின்னல்', 'காற்று'] },
            { q: 'வானில் உள்ள மேகங்கள் குளிர்ந்ததும் என்னவாக மாறுகின்றன?', a: 'மழைத்துளிகள்', options: ['மழைத்துளிகள்', 'பஞ்சு', 'புகை', 'மணல்'] },
            { q: 'பூமியில் விழும் மழைநீரில் ஒரு பகுதி பூமிக்குள் இறங்குவது என்ன?', a: 'நிலத்தடி நீர்', options: ['நிலத்தடி நீர்', 'கடல் நீர்', 'காற்று நீர்', 'வான நீர்'] }
          ],
          homework: 'இன்று உங்கள் வீட்டில் மழைநீர் சேகரிப்புத் தொட்டி இருக்கிறதா என்று பெற்றோரிடம் கேட்டு, ஒரு வரைபடம் வரைந்து வாருங்கள்!'
        };
      }
    }

    // 2. Photosynthesis / Plants
    if (topicLower.includes('plant') || topicLower.includes('leaf') || topicLower.includes('photosynthesis') || topicLower.includes('seed') || topic.includes('செடி') || topic.includes('ஒளிச்சேர்க்கை') || topic.includes('पौध')) {
      return {
        topic: `${topic} - தாவரங்களின் பச்சையம் & இயற்கை சமையலறை`,
        grade: lGrade,
        subject: lSubj,
        standardLevel: lStandard,
        language: lLang,
        difficulty: lDiff,
        pedagogicalLevel: lPedagogy,
        duration: lDuration,
        contextHook: 'முற்றத்து துளசிச் செடியும் அம்மாவின் சமையலறையும்',
        storyHook: 'துளசிச் செடியின் குட்டி இலை "பச்சைநிலா"வின் கதை: காலை சூரியனின் கதிர்கள் தன் மேல் விழுந்ததும், வேர் அனுப்பிய நீர்த்துளியை வாங்கி, காற்றுத் தரும் வாயுவோடு சேர்த்து இனிப்பான மாவுச்சத்தை சமைத்தாள்!',
        conceptExplanation: 'தாவரங்களின் பச்சை இலைகளில் பச்சையம் (Chlorophyll) உள்ளது. அது சூரிய ஒளியைப் பயன்படுத்தி, வேர்கள் தரும் நீரையும் காற்று தரும் கரியமில வாயுவையும் சேர்த்து சர்க்கரை உணவாக மாற்றுகிறது. இந்த அற்புத நிகழ்வே ஒளிச்சேர்க்கை!',
        learningObjectives: [
          'இலைகள் சூரிய ஒளியால் உணவு தயாரிக்கும் முறையைப் புரிந்துகொள்ளுதல்.',
          'பச்சையம் மற்றும் வேர்களின் பணியை அடையாளம் காணுதல்.',
          'மரங்கள் நமக்குத் தரும் சுத்தமான ஆக்சிஜனின் முக்கியத்துவத்தை உணர்தல்.'
        ],
        keyVocabulary: [
          { term: 'பச்சையம் (Chlorophyll)', desc: 'இலைக்கு பச்சை நிறம் தரும் இயற்கைச் சாறு' },
          { term: 'ஒளிச்சேர்க்கை (Photosynthesis)', desc: 'சூரிய ஒளியால் இலைகள் உணவு தயாரித்தல்' },
          { term: 'வேர்த் தூவிகள் (Roots)', desc: 'மண்ணிலிருந்து நீரையும் உப்புகளையும் உறிஞ்சும் பகுதி' },
          { term: 'உயிர்வளி (Oxygen)', desc: 'செடிகள் வெளியிடும் மனிதன் சுவாசிக்கும் தூய காற்று' }
        ],
        activity: 'தொட்டிச் செடியின் ஓர் இலையை மட்டும் கருப்புக் காகிதத்தால் மூடி வைத்து, இரண்டு நாட்கள் கழித்து ஒளி படாத பகுதி வெளிறிப் போவதை உற்றுநோக்குதல்.',
        timelineBreakdown: [
          { phase: '0-5 min', title: 'பிரேரணை', desc: 'முற்றத்து துளசி மாடக் கதையைத் தொடங்குதல்.' },
          { phase: '5-18 min', title: 'சங்கல்பம்', desc: 'இலைகளின் சமையலறை செயல்பாட்டை வரைந்து காட்டுதல்.' },
          { phase: '18-28 min', title: 'செயல்முறை', desc: 'இலைகளைத் தொட்டுப் பார்த்தல் மற்றும் நரம்புகளை உற்றுநோக்குதல்.' },
          { phase: '28-35 min', title: 'மதிப்பீடு', desc: 'விரைவு வினாடி-வினா.' },
          { phase: '35-40 min', title: 'முடிவுரை', desc: 'இரவு உணவுப் பகிர்வு வினா வழிகாட்டல்.' }
        ],
        blackboardLayout: {
          left_column: 'நோக்கங்கள்:\n• பச்சையம்\n• ஒளிச்சேர்க்கை\n• தூய காற்று',
          center_column: '[படம்: சூரியன் ☀️ ➔ இலை 🍃 ➔ உணவு + ஆக்சிஜன் 💨]',
          right_column: 'முக்கியச் சொற்கள்:\n• பச்சையம்\n• ஒளிச்சேர்க்கை\nவீட்டுப் பணி: வீட்டுச் செடி உற்றுநோக்கல்'
        },
        differentiatedGuidance: {
          support_struggling_learners: 'பச்சை இலை மற்றும் மஞ்சள் காய்ந்த இலையின் நிறத்தை ஒப்பிடச் செய்தல்.',
          advanced_learners: 'இரவில் செடிகள் எப்படி சுவாசிக்கின்றன என்று யோசிக்கத் தூண்டுதல்.'
        },
        misconceptionsAddressed: [
          'தவறான கருத்து: வேர்கள் மட்டுமே உணவை உருவாக்குகின்றன. -> உண்மை: உணவை இலைகளே தயாரிக்கின்றன; வேர்கள் நீரை மட்டுமே உறிஞ்சுகின்றன.'
        ],
        quizQuestions: [
          { q: 'தாவரத்தின் சமையலறை என்று எதை அழைக்கிறோம்?', a: 'பச்சை இலை', options: ['பச்சை இலை', 'வேர்', 'பூக்கள்', 'மரப்பட்டை'] },
          { q: 'ஒளிச்சேர்க்கைக்கு மிகவும் அத்தியாவசியமான ஒளி எது?', a: 'சூரிய ஒளி', options: ['சூரிய ஒளி', 'மின்விளக்கு', 'நிலவொளி', 'மெழுகுவர்த்தி'] }
        ],
        homework: 'இன்று உங்கள் வீட்டுச் செடியின் இலையைத் தொட்டுப் பார்த்து, அது எத்திசையில் சூரியனை நோக்கி நிற்கிறது என்று கவனித்து வாருங்கள்!'
      };
    }

    // Default Universal Plan
    return {
      topic: `${topic} (${lGrade} - ${lStandard})`,
      grade: lGrade,
      subject: lSubj,
      standardLevel: lStandard,
      language: lLang,
      difficulty: lDiff,
      pedagogicalLevel: lPedagogy,
      duration: lDuration,
      contextHook: `வட்டார வாழ்வியல் உதாரணங்கள் (${topic})`,
      storyHook: `கிராமத்துக் குழந்தைகள் மற்றும் பாட்டி கதாபாத்திரங்கள் வழியே ${topic} குறித்த ரகசியங்களை வெளிப்படுத்தும் சுவாரஸ்யமான தொடக்கப்பள்ளி கதை.`,
      conceptExplanation: `${lLang} மொழியில் எளிய மற்றும் தெளிவான கற்பித்தல் விளக்கம்: மாணவர்கள் அன்றாடம் காணும் எளிய சூழல் வழியே ${topic} கோட்பாடுகளைப் புகட்டுதல்.`,
      learningObjectives: [
        `${topic} பாடத்தின் அடிப்படைக் கோட்பாட்டைப் புரிந்துகொள்ளுதல்.`,
        'அன்றாட வாழ்க்கை நிகழ்வுகளோடு இக்கருத்தை இணைத்துப் பார்த்தல்.',
        'எளிய செயல்முறை மூலம் புதிய அறிவியல் உண்மைகளை விளக்குதல்.'
      ],
      keyVocabulary: [
        { term: `மையக் கருத்து (${topic})`, desc: 'தொடக்கப் பள்ளி மாணவர்களுக்குப் புரியும் எளிய பொருள்' },
        { term: 'வட்டாரப் பயன்பாடு', desc: 'வீட்டிலும் கிராமத்திலும் புழங்கும் எளிய பயன்பாடு' },
        { term: 'அறிவியல் சொல்', desc: 'பாடப்புத்தக கலைச்சொல்லின் எளிய தாய்மொழி விளக்கம்' }
      ],
      activity: 'செயல்முறை வழிக் கற்றல்: மாணவர்கள் சிறிய குழுக்களாகப் பிரிந்து, வகுப்பறையில் உள்ள பொருட்களைக் கொண்டு செய்து பார்த்தல்.',
      timelineBreakdown: [
        { phase: '0-5 min', title: 'பிரேரணை', desc: 'சுவாரஸ்யமான கதை அல்லது விடுகதை வழியே தொடங்குதல்.' },
        { phase: '5-18 min', title: 'சங்கல்பம்', desc: 'மையக் கருத்தை தாய்மொழி கலைச்சொற்களோடு விளக்குதல்.' },
        { phase: '18-28 min', title: 'செயல்முறை', desc: 'குழுவாகச் செய்து பார்த்தல்.' },
        { phase: '28-35 min', title: 'மதிப்பீடு', desc: 'விரைவு வாய்மொழி வினாக்கள்.' },
        { phase: '35-40 min', title: 'குடும்பப் பாலம்', desc: 'இரவு உணவுக் கலந்துரையாடல் வினாவை வழங்கி முடித்தல்.' }
      ],
      blackboardLayout: {
        left_column: `நோக்கங்கள்:\n1. ${topic} அறிதல்\n2. வாழ்வியல் தொடர்பு`,
        center_column: `[கரும்பலகை வரைபடம்: ${topic}]`,
        right_column: `கலைச்சொற்கள்:\n• சொல் 1\n• சொல் 2\nவீட்டுப் பணி: குடும்பப் பகிர்வு`
      },
      differentiatedGuidance: {
        support_struggling_learners: 'நேரடிப் பொருட்களைத் தொட்டுப் பார்த்து உணரச் செய்யும் எளிய வழிகாட்டல்.',
        advanced_learners: 'இக்கருத்து வேறு எங்கே பயன்படுகிறது என்று புதிய கேள்விகளை எழுப்ப ஊக்குவித்தல்.'
      },
      misconceptionsAddressed: [
        `பொதுவான தவறான கருத்து: ${topic} கடினமான மனப்பாடப் பாடம். -> உண்மை: எளிய வாழ்வியல் நிகழ்வுகளை உற்றுநோக்கினால் மிக எளிதாகப் புரிந்துவிடும்.`
      ],
      quizQuestions: [
        {
          q: `${topic} பற்றி இன்று நாம் கற்றதில் எது மிக முக்கியமானது?`,
          a: 'இயற்கையோடு இணைந்து கற்பது',
          options: ['இயற்கையோடு இணைந்து கற்பது', 'எதையும் மனப்பாடம் செய்யாமல் புரிந்துகொள்வது', 'இரண்டும் சரி']
        }
      ],
      homework: 'இன்று கற்றுக்கொண்ட விஷயத்தை உங்கள் அம்மா, அப்பா அல்லது பாட்டியிடம் விளக்கிச் சொல்லி, அவர்கள் கூறிய கருத்தை எழுதி வாருங்கள்!'
    };
  }
}

export const pedagogyEngine = new PedagogyEngine();
