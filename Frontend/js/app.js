// VernacLearn Master Application Controller
import { SUPPORTED_LANGUAGES, STUDENT_PROFILE, TEACHER_DATA, PARENT_DATA, PEDAGOGY_KNOWLEDGE_BASE } from './mockData.js';
import { speechEngine } from './speechEngine.js';
import { pedagogyEngine } from './pedagogyEngine.js';
import { tutorChat } from './tutorChat.js';
import { quizManager } from './interactiveQuiz.js';
import { hackathonDemo } from './hackathonDemo.js';
import { apiClient } from './apiClient.js';

class VernacApp {
  constructor() {
    this.currentRole = 'student'; // 'student' | 'teacher' | 'parent'
    this.currentTab = 'home';
    this.currentLang = 'ta';
    this.apiClient = apiClient;
    this.tutorChat = tutorChat;
    this.quizManager = quizManager;
    this.hackathonDemo = hackathonDemo;
    this.isListening = false;
  }

  async init() {
    window.vernacApp = this;

    // 1. Critical UI and Mother-Tongue setup immediately
    try {
      this.initMotherTongueOnboarding();
    } catch (e) {
      console.warn('initMotherTongueOnboarding warning:', e);
    }

    try {
      this.renderLanguageSelectors();
    } catch (e) {
      console.warn('renderLanguageSelectors warning:', e);
    }

    try {
      this.setupEventListeners();
    } catch (e) {
      console.warn('setupEventListeners warning:', e);
    }

    try {
      this.initSecuredHostModal();
    } catch (e) {
      console.warn('initSecuredHostModal warning:', e);
    }

    // 2. Initialize Tutor & Hackathon Demo
    try {
      this.tutorChat.init('tutor-chat-stream', 'mitra-mascot-container');
      this.tutorChat.setLanguage(this.currentLang);
    } catch (e) {
      console.warn('tutorChat warning:', e);
    }

    try {
      this.hackathonDemo.init();
    } catch (e) {
      console.warn('hackathonDemo warning:', e);
    }

    // 3. Health check & Non-blocking dashboard initialization
    this.apiClient.checkHealth().catch(() => {});
    this.renderStudentDashboard().catch(console.error);
    this.renderTeacherDashboard().catch(console.error);
    this.renderParentDashboard().catch(console.error);
    this.runSandboxDemo('Why does rain fall from the sky?').catch(console.error);
  }

  renderLanguageSelectors() {
    const globalSelect = document.getElementById('global-lang-select');
    const sourceSelect = document.getElementById('source-lang-select');
    const targetSelect = document.getElementById('target-lang-select');
    const sandboxSelect = document.getElementById('sandbox-lang-select');
    const teacherLangSelect = document.getElementById('teacher-lesson-lang');

    const optionsHtml = SUPPORTED_LANGUAGES.map(lang => 
      `<option value="${lang.code}" ${lang.code === this.currentLang ? 'selected' : ''}>
        ${lang.flag} ${lang.name} (${lang.nativeName})
      </option>`
    ).join('');

    if (globalSelect) globalSelect.innerHTML = optionsHtml;
    if (targetSelect) targetSelect.innerHTML = optionsHtml;
    if (sandboxSelect) sandboxSelect.innerHTML = optionsHtml;
    if (teacherLangSelect) teacherLangSelect.innerHTML = optionsHtml;

    if (sourceSelect) {
      sourceSelect.innerHTML = `
        <option value="auto" selected>✨ 🔍 Auto-Detect Speaker's Language</option>
        <option value="en">🌐 English</option>
        ${SUPPORTED_LANGUAGES.filter(l => l.code !== 'en').map(l => `<option value="${l.code}">${l.flag} ${l.name} (${l.nativeName})</option>`).join('')}
      `;
    }
  }

  setGlobalLanguage(langCode) {
    if (!langCode) return;
    this.currentLang = langCode;
    const globalSelect = document.getElementById('global-lang-select');
    const targetSelect = document.getElementById('target-lang-select');
    const sandboxSelect = document.getElementById('sandbox-lang-select');
    const teacherLangSelect = document.getElementById('teacher-lesson-lang');

    if (globalSelect) globalSelect.value = langCode;
    if (targetSelect) targetSelect.value = langCode;
    if (sandboxSelect) sandboxSelect.value = langCode;
    if (teacherLangSelect) teacherLangSelect.value = langCode;

    // Highlight button in onboarding modal
    const langGrid = document.getElementById('onboarding-lang-grid');
    if (langGrid) {
      langGrid.querySelectorAll('.btn-lang-choice').forEach(b => {
        b.classList.toggle('selected', b.getAttribute('data-code') === langCode);
      });
    }

    if (this.tutorChat) {
      this.tutorChat.setLanguage(langCode);
    }
    
    // Refresh student dashboard language label
    const mtEl = document.getElementById('dash-mother-tongue');
    const matched = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (mtEl && matched) {
      mtEl.textContent = `${matched.name} (${matched.nativeName})`;
    }

    // Refresh tutor input placeholder to show selected mother tongue
    const tutorInputEl = document.getElementById('tutor-input-box');
    if (tutorInputEl && matched) {
      tutorInputEl.placeholder = `Ask Mitra in ANY language (English, Hindi, etc.) — converts to ${matched.name} (${matched.nativeName})!`;
    }


    // Refresh Person 2 in Two-Way Live Mic Bridge
    const p2Label = document.getElementById('p2-lang-label');
    if (p2Label && matched) {
      p2Label.textContent = `${matched.name} (${matched.nativeName})`;
    }

    // Refresh Mother Tongue Navbar button label
    const navMtLabel = document.getElementById('nav-mt-label');
    if (navMtLabel && matched) {
      navMtLabel.textContent = `${matched.name} (${matched.nativeName})`;
    }

    const confirmLangName = document.getElementById('onboarding-confirm-lang-name');
    if (confirmLangName && matched) {
      confirmLangName.textContent = `${matched.name} (${matched.nativeName})`;
    }

    // Immediately re-run Landing Page sandbox preview with the new mother tongue!
    const currentQuery = document.getElementById('sandbox-input')?.value || 'Why does rain fall from the sky?';
    this.runSandboxDemo(currentQuery, langCode);

    // Update Hero visual cards with localized metaphors
    this.updateHeroFloatingCards(langCode);

    // Re-render Student Dashboard with subjects in chosen mother tongue
    this.renderStudentDashboard();
    this.renderParentDashboard();
  }

  updateHeroFloatingCards(langCode) {
    const cards = document.querySelectorAll('.hero-visual-board .hero-float-card');
    if (!cards || cards.length < 3) return;

    const data = {
      hi: [
        { title: 'Sunlight ⇄ सूर्य का प्रकाश', desc: 'सुबह की रंगोली और दादी के गमलों से समझाया गया' },
        { title: 'Water Cycle ⇄ जल चक्र', desc: 'रसोई में उबलती चाय की भाप और ठंडी थाली की बूंदें' },
        { title: 'Fractions ⇄ भिन्न (1/2, 1/4)', desc: 'मीठे रसीले आम की फांकों को बराबर बांटना' }
      ],
      te: [
        { title: 'Sunlight ⇄ సూర్యకాంతి', desc: 'ఉదయపు ముగ్గులు మరియు అమ్మమ్మ బాల్కనీ మొక్కలు' },
        { title: 'Water Cycle ⇄ జల చక్రం', desc: 'అమ్మ చేసే వేడి చారు ఆవిరి మరియు మూతపై నీటి బిందువులు' },
        { title: 'Fractions ⇄ భిన్నాలు (1/2, 1/4)', desc: 'తీపి మామిడికాయ ముక్కలను సమానంగా పంచుకోవడం' }
      ],
      kn: [
        { title: 'Sunlight ⇄ ಸೂರ್ಯನ ಬೆಳಕು', desc: 'ಮುಂಜಾನೆಯ ರಂಗೋಲಿ ಮತ್ತು ಅಜ್ಜಿಯ ಬಾಲ್ಕನಿ ಗಿಡಗಳು' },
        { title: 'Water Cycle ⇄ ಜಲ ಚಕ್ರ', desc: 'ಅಡುಗೆಮನೆಯ ಕುದಿಯುವ ಸಾರಿನ ಹಬೆ ಮತ್ತು ಮುಚ್ಚಳದ ಹನಿಗಳು' },
        { title: 'Fractions ⇄ ಭಿನ್ನರಾಶಿಗಳು', desc: 'ರುಚಿಯಾದ ಮಾವಿನ ಹಣ್ಣಿನ ಹೋಳುಗಳನ್ನು ಹಂಚುವುದು' }
      ],
      ml: [
        { title: 'Sunlight ⇄ സൂര്യപ്രകാശം', desc: 'രാവിലെയിലെ പൂക്കളവും മുത്തശ്ശിയുടെ ബാൽക്കണി ചെടികളും' },
        { title: 'Water Cycle ⇄ ജലചക്രം', desc: 'അടുക്കളയിലെ തിളച്ച ചായയുടെ ആവിയും പാത്രത്തിലെ തുള്ളികളും' },
        { title: 'Fractions ⇄ ഭിന്നസംഖ്യകൾ', desc: 'മധുരമുള്ള മാമ്പഴ കഷ്ണങ്ങൾ തുല്യമായി പങ്കിടൽ' }
      ],
      bn: [
        { title: 'Sunlight ⇄ সূর্যালোক', desc: 'সকালের আলপনা ও ঠাকুমার বারান্দার চারাগাছ' },
        { title: 'Water Cycle ⇄ জলচক্র', desc: 'রান্নাঘরে ফুটন্ত চায়ের ধোঁয়া ও ঢাকনার জলের ফোঁটা' },
        { title: 'Fractions ⇄ ভগ্নাংশ (1/2, 1/4)', desc: 'মিষ্টি পাকা আম সমান ভাগে ভাগ করে নেওয়া' }
      ],
      mr: [
        { title: 'Sunlight ⇄ सूर्यप्रकाश', desc: 'सकाळची रांगोळी आणि आजीच्या बाल्कनीतील रोपे' },
        { title: 'Water Cycle ⇄ जलचक्र', desc: 'स्वयंपाकघरातील चहाची वाफ आणि झाकणावरील पाण्याचे थेंब' },
        { title: 'Fractions ⇄ अपूर्णांक (1/2, 1/4)', desc: 'गोड आंब्याच्या फोडी मित्रांसोबत वाटणे' }
      ],
      gu: [
        { title: 'Sunlight ⇄ સૂર્યપ્રકાશ', desc: 'સવારની રંગોળી અને દાદીના કુંડાના છોડ' },
        { title: 'Water Cycle ⇄ જળચક્ર', desc: 'રસોડામાં ઊકળતી ચાની વરાળ અને ઢાંકણ પરનાં ટીપાં' },
        { title: 'Fractions ⇄ અપૂર્ણાંક', desc: 'મીઠી કેરીની ચીરીઓની સરખી વહેંચણી' }
      ],
      ta: [
        { name: 'அறிவியல் (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'மழை மேகங்களின் ரகசியம் (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'கணிதம் (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'பின்னங்கள்: மாம்பழப் பகிர்வு (Fractions 1/2)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'சூழ்நிலையியல் (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'நமது வீட்டு மூலிகைகள்: துளசி, வேம்பு', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'தாய்மொழித் தமிழ் (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'பாரதியார் கவிதைகளும் புதிய சொற்களும்', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      pa: [
        { name: 'ਵਿਗਿਆਨ (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'ਮੀਂਹ ਦੇ ਬੱਦਲਾਂ ਦਾ ਭੇਤ (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'ਗਣਿਤ (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'ਭਿੰਨਾਂ: ਰੋਟੀ ਦੀ ਵੰਡ (Fractions 1/2)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'ਵਾਤਾਵਰਣ ਸਿੱਖਿਆ (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'ਸਾਡੇ ਘਰ ਦੇ ਔਸ਼ਧੀ ਪੌਦੇ: ਤੁਲਸੀ ਤੇ ਨਿੰਮ', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'ਮਾਤ-ਭਾਸ਼ਾ ਪੰਜਾਬੀ (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'ਕਹਾਣੀਆਂ ਅਤੇ ਨਵੀਂ ਸ਼ਬਦਾਵਲੀ', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      or: [
        { name: 'ବିଜ୍ଞାନ (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'ବର୍ଷା ବାଦଲର ରହସ୍ୟ (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'ଗଣିତ (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'ଭଗ୍ନାଂଶ: ଆମ୍ବ ବଣ୍ଟନ (Fractions 1/2)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'ପରିବେଶ ବିଜ୍ଞାନ (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'ଆମ ବାଡ଼ିର ଔଷଧୀୟ ଗଛ: ତୁଳସୀ ଓ ନିମ୍ବ', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'ମାତୃଭାଷା ଓଡ଼ିଆ (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'ଉତ୍କଳମଣିଙ୍କ କବିତା ଓ ନୂଆ ଶବ୍ଦ', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      as: [
        { name: 'বিজ্ঞান (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'বৰষুণৰ ডাৱৰৰ ৰহস্য (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'গণিত (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'ভগ্নাংশ: আম ভগাই খোৱা (Fractions 1/2)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'পৰিৱেশ অধ্যয়ন (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'আমাৰ বাৰীৰ ঔষধি গছ: তুলসী আৰু নিম', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'মাতৃভাষা অসমীয়া (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'সাধুকথা আৰু নতুন শব্দ সম্ভাৰ', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      en: [
        { title: 'Sunlight ⇄ Solar Energy', desc: 'Explained with morning warmth & grandma balcony plants' },
        { title: 'Water Cycle ⇄ Evaporation & Rain', desc: 'Explained with boiling tea steam & cooling lid droplets' },
        { title: 'Fractions ⇄ Halves & Quarters', desc: 'Explained with sharing sweet summer mango slices' }
      ],
      pa: [
        { title: 'Sunlight ⇄ ਸੂਰਜ ਦੀ ਰੌਸ਼ਨੀ', desc: 'ਸਵੇਰ ਦੀ ਧੁੱਪ ਅਤੇ ਬਾਲਕੋਨੀ ਵਿੱਚ ਦਾਦੀ ਦੇ ਬੂਟੇ' },
        { title: 'Water Cycle ⇄ ਜਲ ਚੱਕਰ', desc: 'ਰਸੋਈ ਵਿੱਚ ਚਾਹ ਦੀ ਭਾਫ਼ ਅਤੇ ਢੱਕਣ \'ਤੇ ਪਾਣੀ ਦੀਆਂ ਬੂੰਦਾਂ' },
        { title: 'Fractions ⇄ ਭਿੰਨਾਂ (1/2, 1/4)', desc: 'ਮਿੱਠੇ ਅੰਬ ਦੀਆਂ ਫਾੜੀਆਂ ਆਪਸ ਵਿੱਚ ਵੰਡਣਾ' }
      ],
      or: [
        { title: 'Sunlight ⇄ ସୂର୍ଯ୍ୟାଲୋକ', desc: 'ସକାଳର ଝୋଟି ଏବଂ ଜେଜେମାଙ୍କ ବଗିଚା ଗଛ' },
        { title: 'Water Cycle ⇄ ଜଳ ଚକ୍ର', desc: 'ଚାହା ଢାଙ୍କୁଣୀର ଜଳବିନ୍ଦୁ ଏବଂ ବର୍ଷା ବାଦଲ' },
        { title: 'Fractions ⇄ ଭଗ୍ନାଂଶ (1/2, 1/4)', desc: 'ମିଠା ଆମ୍ବ ଫାଳିକି ସମାନ ଭାବେ ବାଣ୍ଟିବା' }
      ],
      as: [
        { title: 'Sunlight ⇄ সূৰ্যৰ পোহৰ', desc: 'পুৱাৰ ৰ\'দ আৰু আইতাৰ ফুলনিৰ গছ' },
        { title: 'Water Cycle ⇄ জল চক্ৰ', desc: 'চাহৰ ঢাকনিৰ পানী টোপাল আৰু বৰষুণৰ ডাৱৰ' },
        { title: 'Fractions ⇄ ভগ্নাংশ (1/2, 1/4)', desc: 'মিঠা আমৰ টুকুৰা সমভাগ কৰি খোৱা' }
      ],
      ta: [
        { title: 'Sunlight ⇄ சூரிய ஒளி', desc: 'காலை கோலமும் பாட்டி வீட்டு பால்கனி செடிகளும்' },
        { title: 'Water Cycle ⇄ நீர் சுழற்சி', desc: 'அம்மா வைக்கும் சுடச்சுட ரசத்தின் ஆவியும் நீர் துளிகளும்' },
        { title: 'Fractions ⇄ பின்னங்கள் (1/2, 1/4)', desc: 'இனிப்பான மாம்பழத் துண்டுகளைப் பகிர்ந்தளித்தல்' }
      ]
    };

    const list = data[langCode] || data['ta'];
    cards.forEach((card, idx) => {
      if (list[idx]) {
        const h4 = card.querySelector('h4');
        const p = card.querySelector('p');
        if (h4) h4.textContent = list[idx].title;
        if (p) p.textContent = list[idx].desc;
      }
    });
  }

  setRole(role) {
    this.currentRole = role;
    document.querySelectorAll('.btn-role-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-role') === role);
    });

    if (role === 'teacher') {
      this.switchTab('teacher');
    } else if (role === 'parent') {
      this.switchTab('parent');
    } else {
      this.switchTab('dashboard');
    }
    speechEngine.playPopSound();
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
    });

    // Update views
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabId}`);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    speechEngine.playPopSound();
  }

  setupEventListeners() {
    // Navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });

    // Role switcher clicks
    document.querySelectorAll('.btn-role-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        if (role) this.setRole(role);
      });
    });

    // Global & Local Language Dropdown Changes
    const globalSelect = document.getElementById('global-lang-select');
    if (globalSelect) {
      globalSelect.addEventListener('change', (e) => {
        this.setGlobalLanguage(e.target.value);
      });
    }

    const sandboxSelect = document.getElementById('sandbox-lang-select');
    if (sandboxSelect) {
      sandboxSelect.addEventListener('change', (e) => {
        this.setGlobalLanguage(e.target.value);
      });
    }

    const targetSelect = document.getElementById('target-lang-select');
    if (targetSelect) {
      targetSelect.addEventListener('change', (e) => {
        this.setGlobalLanguage(e.target.value);
      });
    }

    const teacherLangSelect = document.getElementById('teacher-lesson-lang');
    if (teacherLangSelect) {
      teacherLangSelect.addEventListener('change', (e) => {
        this.setGlobalLanguage(e.target.value);
      });
    }

    // Demo Launch Buttons
    const demoBtns = document.querySelectorAll('.btn-launch-demo');
    demoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.hackathonDemo.start();
      });
    });

    // Landing Page Sandbox controls
    const btnSandboxRun = document.getElementById('btn-sandbox-run');
    const sandboxInput = document.getElementById('sandbox-input');
    const sandboxChips = document.querySelectorAll('.sandbox-preset-chip');

    if (btnSandboxRun && sandboxInput) {
      btnSandboxRun.addEventListener('click', () => {
        speechEngine.prepareForSpeech();
        const text = sandboxInput.value || 'Why does rain fall from the sky?';
        const lang = sandboxSelect ? sandboxSelect.value : this.currentLang;
        this.runSandboxDemo(text, lang);
      });
    }

    sandboxChips.forEach(chip => {
      chip.addEventListener('click', () => {
        speechEngine.prepareForSpeech();
        const query = chip.getAttribute('data-query');
        if (sandboxInput) sandboxInput.value = query;
        if (btnSandboxRun) btnSandboxRun.click();
      });
    });

    // Studio Real-Time Translation controls
    const btnDoTranslate = document.getElementById('btn-do-translate');
    const translateInput = document.getElementById('translate-input');
    const translateTargetSelect = document.getElementById('target-lang-select');

    if (btnDoTranslate && translateInput) {
      const doTranslate = () => {
        speechEngine.prepareForSpeech();
        const text = translateInput.value.trim() || 'Why does rain fall from the sky?';
        const lang = translateTargetSelect ? translateTargetSelect.value : this.currentLang;
        this.executeTranslationStudio(text, lang);
      };

      btnDoTranslate.addEventListener('click', doTranslate);
      translateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doTranslate();
      });
    }

    // Voice Mic button in Translation Studio
    const btnVoiceInput = document.getElementById('btn-voice-translate');
    if (btnVoiceInput) {
      btnVoiceInput.addEventListener('click', () => {
        speechEngine.prepareForSpeech();
        this.toggleVoiceTranslation(btnVoiceInput, translateInput);
      });
    }

    // AI Tutor Send
    const btnTutorSend = document.getElementById('btn-tutor-send');
    const tutorInput = document.getElementById('tutor-input-box');
    const btnTutorMic = document.getElementById('btn-tutor-mic');

    const sendTutor = () => {
      speechEngine.prepareForSpeech();
      const text = tutorInput.value.trim();
      if (!text) return;
      this.tutorChat.addStudentMessage(text);
      tutorInput.value = '';
    };

    if (btnTutorSend && tutorInput) {
      btnTutorSend.addEventListener('click', sendTutor);
      tutorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendTutor();
      });
    }

    if (btnTutorMic) {
      btnTutorMic.addEventListener('click', () => {
        speechEngine.prepareForSpeech();
        speechEngine.playPopSound();
        btnTutorMic.classList.add('recording');
        speechEngine.startWaveform('tutor-wave-canvas');
        
        speechEngine.startListening(
          'auto',
          (transcript, isFinal, detected) => {
            if (tutorInput) tutorInput.value = transcript;
            if (isFinal) {
              btnTutorMic.classList.remove('recording');
              speechEngine.stopWaveform();
              sendTutor();
            }
          },
          () => {
            btnTutorMic.classList.remove('recording');
            speechEngine.stopWaveform();
            if (tutorInput && tutorInput.value) sendTutor();
          },
          "Why does rain fall from the sky?" // Simulation fallback
        );
      });
    }

    // Tutor prompt action chips
    document.querySelectorAll('.tutor-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        speechEngine.prepareForSpeech();
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) this.tutorChat.addStudentMessage(prompt);
      });
    });

    // Teacher Lesson Plan Generator Platform
    const btnGenLesson = document.getElementById('btn-generate-lesson');
    if (btnGenLesson) {
      btnGenLesson.addEventListener('click', () => {
        this.generateTeacherLesson();
      });
    }
    this.setupTeacherPlatform();

    // Minigame Match-the-Pair
    this.setupMinigame();

    // Two-Person Live Mic Bridge
    this.setupTwoPersonLiveMicBridge();
  }

  async runSandboxDemo(query, targetLang = null) {
    const lang = targetLang || this.currentLang || 'ta';
    const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
    let concept = null;
    let isLiveBackend = false;

    // Direct invocation to FastAPI backend with graceful fallback
    try {
      const apiRes = await this.apiClient.explainPedagogy(query, lang);
      if (apiRes && apiRes.vernacular_explanation) {
        concept = {
          literalTranslation: apiRes.literal_translation,
          phonetic: apiRes.phonetic_pronunciation,
          pedagogyTitle: apiRes.pedagogy_title,
          vernacularExplanation: apiRes.vernacular_explanation,
          localMetaphor: apiRes.local_metaphor,
          targetLanguage: apiRes.target_lang_name || langMeta.name,
          targetNativeName: apiRes.target_lang_native || langMeta.nativeName,
          speechCode: apiRes.speech_code || langMeta.speechCode,
          culturalKeywords: apiRes.cultural_keywords || []
        };
        isLiveBackend = true;
      }
    } catch (e) {
      console.warn('[Mission Agent] Backend pedagogy fetch failed, using local fallback:', e);
    }

    if (!concept) {
      concept = pedagogyEngine.explainConcept(query, lang);
    }

    const resultBox = document.getElementById('sandbox-result-box');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div class="sandbox-comparison-grid">
        <div class="sandbox-card literal-card">
          <div class="card-tag literal-tag">❌ Literal Word-for-Word Translation</div>
          <div class="sandbox-text-main">${concept.literalTranslation}</div>
          <div class="sandbox-phonetic">Phonetics: <em>"${concept.phonetic}"</em></div>
          <div class="sandbox-critique">A young child memorizes these formal words without truly understanding the natural phenomenon.</div>
        </div>

        <div class="sandbox-card pedagogy-card">
          <div class="card-tag pedagogy-tag">
            ✨ Mission Agent AI Pedagogy
            <span style="display:inline-block; margin-left:8px; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:600; background:${isLiveBackend ? '#059669' : '#4B5563'}; color:#fff;">
              ${isLiveBackend ? '⚡ Live AI Backend' : '💻 Local Pedagogy'}
            </span>
          </div>
          <div class="sandbox-pedagogy-title">${concept.pedagogyTitle}</div>
          <div class="sandbox-text-vernacular">${concept.vernacularExplanation.replace(/\n\n/g, '<br><br>')}</div>
          
          <div class="sandbox-cultural-box">
            <strong>🍲 Cultural Metaphor:</strong> ${concept.localMetaphor}
          </div>

          <div class="sandbox-audio-bar">
            <button class="btn-audio-speak" id="btn-sandbox-speak">
              🔊 Listen in ${concept.targetLanguage} (${concept.targetNativeName})
            </button>
          </div>
        </div>
      </div>
    `;

    const meaningToSpeak = `${concept.pedagogyTitle}. ${concept.vernacularExplanation}`;
    const speakBtn = document.getElementById('btn-sandbox-speak');
    if (speakBtn) {
      speakBtn.onclick = () => {
        speechEngine.prepareForSpeech();
        speakBtn.classList.add('playing');
        speakBtn.innerHTML = `🔊 <em>Speaking Meaning in ${concept.targetLanguage}...</em>`;
        speechEngine.speak(meaningToSpeak, concept.speechCode, () => {
          speakBtn.classList.remove('playing');
          speakBtn.innerHTML = `🔊 Listen in ${concept.targetLanguage} (${concept.targetNativeName})`;
        }, concept.voiceProfile);
      };
    }

    // Auto-read aloud the meaning in the child's native mother tongue
    if (meaningToSpeak) {
      if (speakBtn) {
        speakBtn.classList.add('playing');
        speakBtn.innerHTML = `🔊 <em>Speaking Meaning in ${concept.targetLanguage}...</em>`;
      }
      speechEngine.speak(meaningToSpeak, concept.speechCode, () => {
        if (speakBtn) {
          speakBtn.classList.remove('playing');
          speakBtn.innerHTML = `🔊 Listen in ${concept.targetLanguage} (${concept.targetNativeName})`;
        }
      }, concept.voiceProfile);
    }
  }

  async executeTranslationStudio(query, targetLang = 'ta') {
    const studioResults = document.getElementById('translate-results-container');
    if (!studioResults) return;

    studioResults.innerHTML = `
      <div style="text-align:center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <div style="font-size: 2.2rem; margin-bottom: 0.6rem; animation: pulseDotChecking 1s infinite alternate;">✨</div>
        <h4 style="color: var(--color-primary); margin-bottom: 0.3rem;">AI Vernacular Pedagogy Engine Processing...</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Translating & synthesizing child-friendly Indian analogies</p>
      </div>
    `;

    let concept = null;
    let isLiveBackend = false;
    try {
      const sourceLang = document.getElementById('source-lang-select')?.value || 'en';
      const [transRes, pedRes] = await Promise.all([
        this.apiClient.translate(query, sourceLang, targetLang),
        this.apiClient.explainPedagogy(query, targetLang)
      ]);

      if (pedRes && pedRes.vernacular_explanation) {
        concept = {
          literalTranslation: transRes?.translated_text || pedRes.literal_translation,
          childExplanation: transRes?.child_explanation || '',
          phonetic: transRes?.phonetic_pronunciation || pedRes.phonetic_pronunciation,
          pedagogyTitle: pedRes.pedagogy_title,
          vernacularExplanation: pedRes.vernacular_explanation,
          localMetaphor: pedRes.local_metaphor,
          targetLanguage: pedRes.target_lang_name || (SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0]).name,
          targetNativeName: pedRes.target_lang_native || (SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0]).nativeName,
          speechCode: pedRes.speech_code || (SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0]).speechCode,
          culturalKeywords: pedRes.cultural_keywords || [],
          voiceProfile: transRes?.voice_profile || pedRes.voice_profile
        };
        isLiveBackend = true;
      }
    } catch (e) {
      console.warn('[Mission Agent] Studio backend fetch fallback:', e);
    }

    if (!concept) {
      const local = pedagogyEngine.explainConcept(query, targetLang);
      concept = {
        ...local,
        childExplanation: local.vernacularExplanation || ''
      };
    }

    const fullSpokenMeaning = concept.childExplanation 
      ? `${concept.literalTranslation}. ${concept.childExplanation}`
      : `${concept.literalTranslation}. ${concept.vernacularExplanation}`;

    studioResults.innerHTML = `
      <div class="studio-output-layout">
        <div class="studio-main-card">
          <div class="studio-card-header">
            <span class="studio-badge">${concept.targetLanguage} (${concept.targetNativeName})</span>
            <div style="display: inline-flex; gap: 6px;">
              <button class="btn-icon-audio" id="btn-studio-speak-literal" title="Listen Translation">🔊 Translation</button>
              <button class="btn-icon-audio" id="btn-studio-speak-meaning" title="Read Aloud Meaning" style="background: var(--color-primary); color: #fff; border-color: var(--color-primary);">🔊 Meaning</button>
            </div>
          </div>
          <div class="studio-translated-text">${concept.literalTranslation}</div>
          ${concept.childExplanation ? `
            <div class="studio-child-meaning" style="margin-top: 0.85rem; padding: 0.65rem 0.85rem; background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10B981; border-radius: 6px; font-size: 0.92rem; color: var(--text-color);">
              <span style="display: block; font-weight: 700; color: #047857; font-size: 0.78rem; text-transform: uppercase; margin-bottom: 2px;">💡 Child Meaning (விளக்கம் / अर्थ):</span>
              ${concept.childExplanation}
            </div>
          ` : ''}
          <div class="studio-phonetics">Pronunciation: ${concept.phonetic}</div>
        </div>

        <div class="studio-pedagogy-container">
          <div class="pedagogy-header">
            <div class="pedagogy-title-row">
              <span class="pedagogy-sparkle">✨</span>
              <h3>AI-Powered Vernacular Pedagogy</h3>
              <span class="pedagogy-badge" style="background:${isLiveBackend ? 'linear-gradient(135deg, #059669, #10B981)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'}; color:#fff; font-weight:600;">
                ${isLiveBackend ? '⚡ Live AI Backend' : 'Child-Centric Context'}
              </span>
            </div>
            <p class="pedagogy-sub">Adapted to local Indian culture, household environments, and age-appropriate analogies.</p>
          </div>

          <div class="pedagogy-body">
            <h4 class="pedagogy-story-title">${concept.pedagogyTitle}</h4>
            <div class="pedagogy-explanation">${concept.vernacularExplanation.replace(/\n\n/g, '<br><br>')}</div>
            
            <div class="pedagogy-analogy-pill">
              <strong>Familiar Household Metaphor:</strong> ${concept.localMetaphor}
            </div>

            <div class="pedagogy-vocab-section">
              <h5>Local Scientific Vocabulary:</h5>
              <div class="vocab-tags-list">
                ${concept.culturalKeywords.map(k => `
                  <div class="vocab-tag">
                    <strong>${k.term}</strong>
                    <span>${k.meaning}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="pedagogy-action-bar">
              <button class="btn-primary-speak" id="btn-studio-speak-story">
                🔊 Read Aloud in ${concept.targetLanguage}
              </button>
              <button class="btn-ask-mitra" id="btn-studio-ask-mitra">
                🦉 Ask Mitra to Quiz Me!
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const litSpeakBtn = document.getElementById('btn-studio-speak-literal');
    if (litSpeakBtn) {
      litSpeakBtn.onclick = () => {
        speechEngine.prepareForSpeech();
        litSpeakBtn.classList.add('playing');
        litSpeakBtn.innerHTML = '🔊 <em>Speaking...</em>';
        speechEngine.speak(concept.literalTranslation, concept.speechCode, () => {
          litSpeakBtn.classList.remove('playing');
          litSpeakBtn.innerHTML = '🔊 Translation';
        }, concept.voiceProfile);
      };
    }

    const meaningSpeakBtn = document.getElementById('btn-studio-speak-meaning');
    if (meaningSpeakBtn) {
      meaningSpeakBtn.onclick = () => {
        speechEngine.prepareForSpeech();
        meaningSpeakBtn.classList.add('playing');
        meaningSpeakBtn.innerHTML = '🔊 <em>Speaking Meaning...</em>';
        speechEngine.speak(fullSpokenMeaning, concept.speechCode, () => {
          meaningSpeakBtn.classList.remove('playing');
          meaningSpeakBtn.innerHTML = '🔊 Meaning';
        }, concept.voiceProfile);
      };
    }

    const storySpeakBtn = document.getElementById('btn-studio-speak-story');
    if (storySpeakBtn) {
      storySpeakBtn.onclick = () => {
        speechEngine.prepareForSpeech();
        storySpeakBtn.classList.add('playing');
        storySpeakBtn.innerHTML = `🔊 <em>Reading Story in ${concept.targetLanguage}...</em>`;
        speechEngine.speak(`${concept.pedagogyTitle}. ${concept.vernacularExplanation}`, concept.speechCode, () => {
          storySpeakBtn.classList.remove('playing');
          storySpeakBtn.innerHTML = `🔊 Read Aloud in ${concept.targetLanguage}`;
        }, concept.voiceProfile);
      };
    }

    // Auto-speak translated meaning in a warm lady voice for children to easily understand
    if (fullSpokenMeaning) {
      if (meaningSpeakBtn) {
        meaningSpeakBtn.classList.add('playing');
        meaningSpeakBtn.innerHTML = '🔊 <em>Speaking Meaning...</em>';
      }
      speechEngine.speak(fullSpokenMeaning, concept.speechCode, () => {
        if (meaningSpeakBtn) {
          meaningSpeakBtn.classList.remove('playing');
          meaningSpeakBtn.innerHTML = '🔊 Meaning';
        }
      }, concept.voiceProfile);
    }

    const askMitraBtn = document.getElementById('btn-studio-ask-mitra');
    if (askMitraBtn) {
      askMitraBtn.onclick = () => {
        this.switchTab('tutor');
        this.tutorChat.addStudentMessage(query);
      };
    }
  }

  toggleVoiceTranslation(btn, input) {
    const banner = document.getElementById('detected-speaker-banner');
    const bannerText = document.getElementById('detected-speaker-text');

    if (this.isListening) {
      speechEngine.stopListening();
      this.isListening = false;
      btn.classList.remove('active-listening');
      speechEngine.stopWaveform();
      if (banner) banner.style.display = 'none';
    } else {
      this.isListening = true;
      btn.classList.add('active-listening');
      speechEngine.startWaveform('studio-wave-canvas', '#00C9A7');

      const sourceLang = document.getElementById('source-lang-select')?.value || 'auto';
      const isAuto = sourceLang === 'auto';
      const matched = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang);
      const listenSpeechCode = isAuto ? 'auto' : (matched ? matched.speechCode : 'auto');

      if (banner && isAuto) {
        banner.style.display = 'flex';
        bannerText.innerHTML = `🎙️ <em>Listening... Speak in English, Tamil, Hindi, or any mother tongue!</em>`;
      }

      speechEngine.startListening(
        listenSpeechCode,
        async (transcript, isFinal, detected) => {
          input.value = transcript;

          if (detected && banner && isAuto) {
            banner.style.display = 'flex';
            bannerText.innerHTML = `🗣️ <strong>Speaker Identified:</strong> ${detected.flag} ${detected.name} (${detected.nativeName}) — ${Math.round(detected.confidence * 100)}% Match`;
          }

          if (isFinal) {
            this.isListening = false;
            btn.classList.remove('active-listening');
            speechEngine.stopWaveform();

            const targetLang = document.getElementById('target-lang-select')?.value || this.currentLang;
            await this.executeTranslationStudio(transcript, targetLang);
          }
        },
        () => {
          this.isListening = false;
          btn.classList.remove('active-listening');
          speechEngine.stopWaveform();
        },
        "Why does rain fall from the sky?" // Fallback simulator
      );
    }
  }

  setupTwoPersonLiveMicBridge() {
    const btnP1 = document.getElementById('btn-p1-mic');
    const btnP2 = document.getElementById('btn-p2-mic');
    const p1Preview = document.getElementById('p1-speech-preview');
    const p2Preview = document.getElementById('p2-speech-preview');
    const p1Pill = document.getElementById('p1-detected-pill');
    const autoSpeakCheck = document.getElementById('bridge-auto-speak-toggle');
    if (autoSpeakCheck) autoSpeakCheck.checked = true;
    const dialogueScroll = document.getElementById('dialogue-scroll');
    const btnClear = document.getElementById('btn-clear-dialogue');

    let isP1Listening = false;
    let isP2Listening = false;
    let lastDetectedP1Lang = 'en';

    if (btnClear && dialogueScroll) {
      btnClear.onclick = () => {
        dialogueScroll.innerHTML = `<div class="dialogue-empty-state">Dialogue cleared. Tap either microphone to start speaking!</div>`;
      };
    }

    const appendDialogueMessage = (speakerName, avatar, originalText, origLangMeta, translatedText, targetLangMeta) => {
      if (!dialogueScroll) return;
      const emptyState = dialogueScroll.querySelector('.dialogue-empty-state');
      if (emptyState) emptyState.remove();

      const isP1 = speakerName.includes('Person 1');
      const bubble = document.createElement('div');
      bubble.className = `dialogue-msg-bubble ${isP1 ? 'from-p1' : 'from-p2'}`;
      bubble.innerHTML = `
        <div class="dialogue-msg-meta">
          <span>${avatar} ${speakerName}</span>
          <span>•</span>
          <span>Spoke: ${origLangMeta.flag} ${origLangMeta.name}</span>
          <span>➔</span>
          <span>Translated: ${targetLangMeta.flag} ${targetLangMeta.name}</span>
        </div>
        <div class="dialogue-orig">"${originalText}"</div>
        <div class="dialogue-trans">
          <span>${translatedText}</span>
          <button class="btn-msg-listen" title="Play speech">🔊</button>
        </div>
      `;

      const listenBtn = bubble.querySelector('.btn-msg-listen');
      if (listenBtn) {
        listenBtn.onclick = () => {
          speechEngine.speak(translatedText, targetLangMeta.speechCode);
        };
      }

      dialogueScroll.appendChild(bubble);
      dialogueScroll.scrollTop = dialogueScroll.scrollHeight;
    };

    // Person 1 (The Other Person / Teacher) Speaks in ANY Language
    if (btnP1) {
      btnP1.onclick = () => {
        if (isP1Listening) {
          speechEngine.stopListening();
          isP1Listening = false;
          btnP1.classList.remove('recording');
          speechEngine.stopWaveform();
          return;
        }

        isP1Listening = true;
        btnP1.classList.add('recording');
        speechEngine.playPopSound();
        speechEngine.startWaveform('p1-wave-canvas', '#4F46E5');
        p1Preview.innerHTML = `<em>Listening to Person 1... Speak in English, Hindi, or any language!</em>`;

        speechEngine.startListening(
          'auto',
          async (transcript, isFinal, detected) => {
            p1Preview.innerHTML = `<strong>Person 1:</strong> "${transcript}"`;
            if (detected) {
              lastDetectedP1Lang = detected.code;
              if (p1Pill) {
                p1Pill.innerHTML = `<span class="indicator-dot online"></span> 🗣️ Identified: ${detected.flag} ${detected.name} (${Math.round(detected.confidence * 100)}%)`;
              }
            }

            if (isFinal) {
              isP1Listening = false;
              btnP1.classList.remove('recording');
              speechEngine.stopWaveform();

              // Translate Person 1's words into Person 2's target mother tongue
              const targetLang = this.currentLang;
              const targetMeta = SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0];
              const origMeta = detected || { code: 'en', name: 'English', flag: '🌐', speechCode: 'en-IN' };

              p2Preview.innerHTML = `<em>✨ Translating into ${targetMeta.name}...</em>`;

              let translatedText = '';
              try {
                const res = await this.apiClient.translate(transcript, origMeta.code, targetLang);
                if (res && res.translated_text) {
                  translatedText = res.translated_text;
                }
              } catch (e) {
                console.warn('[Mission Agent] Mic bridge translation fallback:', e);
              }
              if (!translatedText) {
                const local = pedagogyEngine.explainConcept(transcript, targetLang);
                translatedText = local.literalTranslation;
              }

              p2Preview.innerHTML = `
                <div>
                  <div style="font-size: 0.75rem; color: #047857; font-weight: 700; margin-bottom: 0.2rem;">
                    ${targetMeta.flag} Translated to ${targetMeta.name} (${targetMeta.nativeName}):
                  </div>
                  <strong style="font-size: 1rem;">"${translatedText}"</strong>
                </div>
              `;

              appendDialogueMessage('Person 1 (Teacher)', '👩‍🏫', transcript, origMeta, translatedText, targetMeta);

              // Auto speak aloud in Person 2's language if checked
              if (autoSpeakCheck && autoSpeakCheck.checked) {
                speechEngine.speak(translatedText, targetMeta.speechCode);
              }
            }
          },
          () => {
            isP1Listening = false;
            btnP1.classList.remove('recording');
            speechEngine.stopWaveform();
          },
          "Good morning children! Today we will learn why rain falls from the sky."
        );
      };
    }

    // Person 2 (Student in Mother Tongue) Replies
    if (btnP2) {
      btnP2.onclick = () => {
        if (isP2Listening) {
          speechEngine.stopListening();
          isP2Listening = false;
          btnP2.classList.remove('recording');
          speechEngine.stopWaveform();
          return;
        }

        isP2Listening = true;
        btnP2.classList.add('recording');
        speechEngine.playPopSound();
        speechEngine.startWaveform('p2-wave-canvas', '#059669');

        const studentLang = this.currentLang;
        const studentMeta = SUPPORTED_LANGUAGES.find(l => l.code === studentLang) || SUPPORTED_LANGUAGES[0];
        p2Preview.innerHTML = `<em>Listening to Student in ${studentMeta.name}...</em>`;

        speechEngine.startListening(
          studentMeta.speechCode,
          async (transcript, isFinal) => {
            p2Preview.innerHTML = `<strong>Student (${studentMeta.name}):</strong> "${transcript}"`;

            if (isFinal) {
              isP2Listening = false;
              btnP2.classList.remove('recording');
              speechEngine.stopWaveform();

              // Translate back into Person 1's language (English or last detected)
              const returnLang = lastDetectedP1Lang || 'en';
              const returnMeta = SUPPORTED_LANGUAGES.find(l => l.code === returnLang) || SUPPORTED_LANGUAGES.find(l => l.code === 'en') || SUPPORTED_LANGUAGES[0];

              p1Preview.innerHTML = `<em>✨ Translating reply into ${returnMeta.name}...</em>`;

              let translatedReply = '';
              try {
                const res = await this.apiClient.translate(transcript, studentLang, returnLang);
                if (res && res.translated_text) {
                  translatedReply = res.translated_text;
                }
              } catch (e) {
                console.warn('[Mission Agent] Mic bridge student reply translation fallback:', e);
              }
              if (!translatedReply) {
                translatedReply = `Teacher, I understand that water evaporates and condenses into rain!`;
              }

              p1Preview.innerHTML = `
                <div>
                  <div style="font-size: 0.75rem; color: #4F46E5; font-weight: 700; margin-bottom: 0.2rem;">
                    ${returnMeta.flag} Translated to ${returnMeta.name}:
                  </div>
                  <strong style="font-size: 1rem;">"${translatedReply}"</strong>
                </div>
              `;

              appendDialogueMessage('Person 2 (Student)', '🎒', transcript, studentMeta, translatedReply, returnMeta);

              if (autoSpeakCheck && autoSpeakCheck.checked) {
                speechEngine.speak(translatedReply, returnMeta.speechCode);
              }
            }
          },
          () => {
            isP2Listening = false;
            btnP2.classList.remove('recording');
            speechEngine.stopWaveform();
          },
          "வானத்திலிருந்து மழை மேகங்கள் குளிர்ந்து கீழே விழுகிறது அல்லவா?"
        );
      };
    }
  }

  async renderStudentDashboard() {
    let profile = STUDENT_PROFILE;
    try {
      const apiProfile = await this.apiClient.getStudentDashboard('student_001');
      if (apiProfile && apiProfile.name) {
        profile = {
          ...STUDENT_PROFILE,
          name: apiProfile.name,
          grade: apiProfile.grade,
          motherTongue: apiProfile.mother_tongue,
          learningStreak: apiProfile.learning_streak_days,
          totalStars: apiProfile.total_stars,
          lessonsCompleted: apiProfile.lessons_completed,
          quizAverage: `${apiProfile.quiz_average}%`
        };
      }
    } catch (e) {
      console.warn('[Mission Agent] Student dashboard backend fallback:', e);
    }
    const lang = this.currentLang || 'ta';

    const localizedSubjects = {
      hi: [
        { name: 'विज्ञान (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'बारिश के बादलों का रहस्य (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'गणित (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'भिन्न: मीठे आम का बंटवारा (Fractions 1/2)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'पर्यावरण अध्ययन (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'हमारी रसोई और तुलसी-नीम के पौधे (Herbs)', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'मातृभाषा हिन्दी (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'कवि सम्मेलन और नई शब्दावली (Vocabulary)', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      te: [
        { name: 'సైన్స్ (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'వర్షపు మేఘాల రహస్యం (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'గణితం (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'భిన్నాలు: మామిడి పండ్ల పంపకం (Fractions)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'పరిసరాల విజ్ఞానం (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'మన పెరటి ఔషధ మొక్కలు: తులసి, వేప', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'మాతృభాష తెలుగు (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'వేమన శతక పద్యాలు & పద సంపద', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      kn: [
        { name: 'ವಿಜ್ಞಾನ (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'ಮಳೆ ಮೋಡಗಳ ರಹಸ್ಯ (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'ಗಣಿತ (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'ಭಿನ್ನರಾಶಿಗಳು: ಮಾವಿನ ಹಣ್ಣಿನ ಪಾಲು (Fractions)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'ಪರಿಸರ ಅಧ್ಯಯನ (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'ನಮ್ಮ ಮನೆಯ ಔಷಧೀಯ ಸಸ್ಯಗಳು', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'ಮಾತೃಭಾಷೆ ಕನ್ನಡ (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಹೊಸ ಪದಗಳು', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      ml: [
        { name: 'ശാസ്ത്രം (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'മഴമേഘങ്ങളുടെ രഹസ്യം (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'ഗണിതം (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'ഭിന്നസംഖ്യകൾ: മാമ്പഴം പങ്കിടൽ (Fractions)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'പരിസ്ഥിതി പഠനം (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'നമ്മുടെ ഔഷധ സസ്യങ്ങൾ: തുളസിയും വേപ്പും', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'മാതൃഭാഷ മലയാളം (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'മലയാള കവിതകളും പുതിയ പദങ്ങളും', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      bn: [
        { name: 'বিজ্ঞান (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'বৃষ্টির মেঘের রহস্য (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'গণিত (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'ভগ্নাংশ: মিষ্টি আম ভাগ করে খাওয়া (Fractions)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'পরিবেশবিদ্যা (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'আমাদের ভেষজ গাছপালা: তুলসী ও নিম', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'মাতৃভাষা বাংলা (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'রবীন্দ্রনাথের ছড়া ও নতুন শব্দ', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      mr: [
        { name: 'विज्ञान (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'पावसाच्या ढगांचे रहस्य (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'गणित (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'अपूर्णांक: गोड आंब्याची वाटणी (Fractions)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'परिसर अभ्यास (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'आपल्या बागेतील औषधी वनस्पती: तुळस व कडुनिंब', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'मातृभाषा मराठी (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'मराठी कविता आणि शब्दसंग्रह', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      gu: [
        { name: 'વિજ્ઞાન (Science)', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'વરસાદના વાદળોનું રહસ્ય (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'ગણિત (Mathematics)', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'અપૂર્ણાંક: કેરીના ટુકડાઓની વહેંચણી (Fractions)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'પર્યાવરણ (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'આપણી ઔષધીય વનસ્પતિઓ: તુલસી અને લીમડો', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'માતૃભાષા ગુજરાતી (Mother Tongue)', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'ગુજરાતી કાવ્યો અને શબ્દભંડોળ', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ],
      en: [
        { name: 'Science', icon: '🔬', color: '#3B82F6', progress: 75, currentLesson: 'Secret of Rain Clouds (Water Cycle)', completedLessons: 6, totalLessons: 8, recentScore: '95%' },
        { name: 'Mathematics', icon: '📐', color: '#10B981', progress: 60, currentLesson: 'Fractions: Sharing Sweet Mangoes (1/2, 1/4)', completedLessons: 4, totalLessons: 7, recentScore: '88%' },
        { name: 'Environmental Studies (EVS)', icon: '🌍', color: '#F59E0B', progress: 85, currentLesson: 'Local Medicinal Herbs: Tulsi, Neem & Aloe', completedLessons: 7, totalLessons: 8, recentScore: '100%' },
        { name: 'English Language', icon: '🗣️', color: '#EC4899', progress: 90, currentLesson: 'Storytelling & Vocabulary Enrichment', completedLessons: 9, totalLessons: 10, recentScore: '92%' }
      ]
    };

    const subjects = localizedSubjects[lang] || profile.subjects;

    // Subjects Grid
    const grid = document.getElementById('dashboard-subjects-grid');
    if (grid) {
      grid.innerHTML = subjects.map(s => `
        <div class="subject-card" style="border-top: 4px solid ${s.color};">
          <div class="subject-card-top">
            <div class="subject-icon-bubble" style="background: ${s.color}15; color: ${s.color};">${s.icon}</div>
            <div class="subject-score-pill">${s.recentScore}</div>
          </div>
          <h4 class="subject-title">${s.name}</h4>
          <div class="subject-current-lesson">${s.currentLesson}</div>
          
          <div class="subject-progress-box">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${s.progress}%; background: ${s.color};"></div>
            </div>
            <div class="progress-labels">
              <span>${s.completedLessons}/${s.totalLessons} Lessons</span>
              <span>${s.progress}%</span>
            </div>
          </div>

          <button class="btn-resume-subject" onclick="window.vernacApp.switchTab('translate')">
            Continue in Mother Tongue →
          </button>
        </div>
      `).join('');
    }

    // Badges Grid
    const badgesGrid = document.getElementById('dashboard-badges-grid');
    if (badgesGrid) {
      badgesGrid.innerHTML = profile.badges.map(b => `
        <div class="badge-item">
          <div class="badge-icon-box">${b.icon}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>
      `).join('');
    }
  }

  async renderTeacherDashboard() {
    let data = TEACHER_DATA;
    try {
      const apiCohort = await this.apiClient.getTeacherCohort();
      if (apiCohort && apiCohort.cohort_name) {
        data = {
          ...TEACHER_DATA,
          cohortName: apiCohort.cohort_name,
          totalStudents: apiCohort.total_students,
          averageScore: `${apiCohort.average_score}%`,
          languageBreakdown: (apiCohort.language_breakdown || []).map((l, idx) => ({
            language: l.language,
            percentage: l.percentage,
            count: l.student_count,
            color: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][idx % 5]
          })),
          conceptMisconceptions: (apiCohort.common_misconceptions || []).map(m => ({
            concept: m.concept,
            confusionLevel: m.severity,
            barrierReason: m.misconception_description,
            aiRecommendation: m.pedagogical_remedy
          }))
        };
      }
    } catch (e) {
      console.warn('[Mission Agent] Teacher cohort backend fallback:', e);
    }

    // Misconceptions
    const misconContainer = document.getElementById('teacher-misconceptions-list');
    if (misconContainer) {
      misconContainer.innerHTML = data.conceptMisconceptions.map(m => `
        <div class="misconception-card">
          <div class="miscon-header">
            <div class="miscon-title">${m.concept}</div>
            <span class="badge-confusion ${m.confusionLevel.toLowerCase()}">Confusion: ${m.confusionLevel}</span>
          </div>
          <div class="miscon-barrier"><strong>Mother Tongue Barrier:</strong> ${m.barrierReason}</div>
          <div class="miscon-ai"><strong>AI Recommendation:</strong> ${m.aiRecommendation}</div>
        </div>
      `).join('');
    }

    // Language Distribution Chart simulation
    const langChart = document.getElementById('teacher-lang-chart');
    if (langChart) {
      langChart.innerHTML = `
        <div class="lang-dist-bars">
          ${data.languageBreakdown.map(l => `
            <div class="lang-dist-row">
              <div class="lang-row-label">
                <span>${l.language}</span>
                <strong>${l.count} students (${l.percentage}%)</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${l.percentage}%; background: ${l.color};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  setupTeacherPlatform() {
    // Topic preset chips
    document.querySelectorAll('.topic-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const topic = chip.getAttribute('data-topic');
        const grade = chip.getAttribute('data-grade');
        const subject = chip.getAttribute('data-subject');
        const stage = chip.getAttribute('data-stage');

        const topicInput = document.getElementById('teacher-topic-input');
        const gradeSelect = document.getElementById('teacher-grade-select');
        const subjectSelect = document.getElementById('teacher-subject-select');
        const stageSelect = document.getElementById('teacher-stage-select');

        if (topicInput && topic) topicInput.value = topic;
        if (gradeSelect && grade) gradeSelect.value = grade;
        if (subjectSelect && subject) subjectSelect.value = subject;
        if (stageSelect && stage) {
          Array.from(stageSelect.options).forEach(opt => {
            if (opt.value.includes(stage)) stageSelect.value = opt.value;
          });
        }
        this.generateTeacherLesson();
      });
    });

    // NEP 2020 Stage select change -> auto select appropriate Grade
    const stageSelect = document.getElementById('teacher-stage-select');
    const gradeSelect = document.getElementById('teacher-grade-select');
    if (stageSelect && gradeSelect) {
      stageSelect.addEventListener('change', () => {
        const stageVal = stageSelect.value;
        if (stageVal.includes('Foundational')) {
          gradeSelect.value = 'Class 2';
        } else if (stageVal.includes('Preparatory')) {
          gradeSelect.value = 'Class 4';
        } else if (stageVal.includes('Middle')) {
          gradeSelect.value = 'Class 6';
        } else if (stageVal.includes('Secondary')) {
          gradeSelect.value = 'Class 9';
        }
      });

      gradeSelect.addEventListener('change', () => {
        const gradeVal = gradeSelect.value.toLowerCase();
        if (gradeVal.includes('balvatika') || gradeVal.includes('class 1') || gradeVal.includes('class 2')) {
          Array.from(stageSelect.options).forEach(o => { if (o.value.includes('Foundational')) stageSelect.value = o.value; });
        } else if (gradeVal.includes('class 3') || gradeVal.includes('class 4') || gradeVal.includes('class 5')) {
          Array.from(stageSelect.options).forEach(o => { if (o.value.includes('Preparatory')) stageSelect.value = o.value; });
        } else if (gradeVal.includes('class 6') || gradeVal.includes('class 7') || gradeVal.includes('class 8')) {
          Array.from(stageSelect.options).forEach(o => { if (o.value.includes('Middle')) stageSelect.value = o.value; });
        } else if (gradeVal.includes('class 9') || gradeVal.includes('class 10')) {
          Array.from(stageSelect.options).forEach(o => { if (o.value.includes('Secondary')) stageSelect.value = o.value; });
        }
      });
    }

    // AI Topic Ideator modal triggers
    const openIdeatorBtns = [
      document.getElementById('btn-open-topic-ideator'),
      document.getElementById('btn-suggest-topics-link'),
      document.getElementById('btn-ideate-standard-topics')
    ];
    openIdeatorBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = document.getElementById('modal-topic-ideator');
          if (modal) {
            modal.style.display = 'flex';
            const curGrade = document.getElementById('teacher-grade-select')?.value;
            const curSubject = document.getElementById('teacher-subject-select')?.value;
            const ideatorGrade = document.getElementById('ideator-grade-select');
            const ideatorSubj = document.getElementById('ideator-subject-select');
            if (ideatorGrade && curGrade) ideatorGrade.value = curGrade;
            if (ideatorSubj && curSubject) ideatorSubj.value = curSubject;
            this.runTopicIdeator();
          }
        });
      }
    });

    const closeIdeatorBtn = document.getElementById('btn-close-ideator-modal');
    if (closeIdeatorBtn) {
      closeIdeatorBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-topic-ideator');
        if (modal) modal.style.display = 'none';
      });
    }

    const submitIdeateBtn = document.getElementById('btn-ideate-submit');
    if (submitIdeateBtn) {
      submitIdeateBtn.addEventListener('click', () => {
        this.runTopicIdeator();
      });
    }

    // Saved Lessons Library modal triggers
    const openLibraryBtn = document.getElementById('btn-open-saved-lessons');
    if (openLibraryBtn) {
      openLibraryBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-saved-lessons');
        if (modal) {
          modal.style.display = 'flex';
          this.renderSavedLessonsLibrary();
        }
      });
    }

    const closeLibraryBtn = document.getElementById('btn-close-library-modal');
    if (closeLibraryBtn) {
      closeLibraryBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-saved-lessons');
        if (modal) modal.style.display = 'none';
      });
    }

    // Studio floating toolbar actions
    const btnStudioSpeak = document.getElementById('btn-studio-speak');
    if (btnStudioSpeak) {
      btnStudioSpeak.addEventListener('click', () => {
        this.speakCurrentLessonStory();
      });
    }

    const btnStudioSave = document.getElementById('btn-studio-save');
    if (btnStudioSave) {
      btnStudioSave.addEventListener('click', () => {
        this.saveCurrentLessonToLibrary();
      });
    }

    const btnStudioPrint = document.getElementById('btn-studio-print');
    if (btnStudioPrint) {
      btnStudioPrint.addEventListener('click', () => {
        window.print();
      });
    }

    const btnStudioCopy = document.getElementById('btn-studio-copy');
    if (btnStudioCopy) {
      btnStudioCopy.addEventListener('click', () => {
        this.copyLessonPlanMarkdown();
      });
    }

    const btnStudioWhatsapp = document.getElementById('btn-studio-whatsapp');
    if (btnStudioWhatsapp) {
      btnStudioWhatsapp.addEventListener('click', () => {
        this.shareLessonToWhatsApp();
      });
    }

    // Update saved count badge on startup
    this.updateSavedLessonsCount();
  }

  async runTopicIdeator() {
    const grade = document.getElementById('ideator-grade-select')?.value || 'Class 4';
    const subject = document.getElementById('ideator-subject-select')?.value || 'Environmental Studies (EVS)';
    const lang = document.getElementById('teacher-lesson-lang')?.value || this.currentLang || 'ta';
    const stage = document.getElementById('teacher-stage-select')?.value || 'Preparatory Stage';

    const resultsContainer = document.getElementById('ideator-results-container');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <div style="font-size: 2rem; animation: pulseDotChecking 1s infinite alternate; margin-bottom: 0.5rem;">⚡</div>
        <p style="font-weight: 600; color: var(--color-primary);">AI Brainstorming Curriculum Topics for ${grade} (${subject})...</p>
      </div>
    `;

    let topics = [];
    try {
      const apiRes = await this.apiClient.suggestTopics(grade, subject, stage, lang);
      if (apiRes && apiRes.suggested_topics && apiRes.suggested_topics.length > 0) {
        topics = apiRes.suggested_topics;
      }
    } catch (e) {
      console.warn('[Mission Agent] Topic suggest API fallback:', e);
    }

    if (!topics || topics.length === 0) {
      topics = pedagogyEngine.suggestTopics(grade, subject, stage, lang);
    }

    resultsContainer.innerHTML = topics.map(item => `
      <div class="ideator-topic-card">
        <div class="ideator-topic-info">
          <h4>${item.topic_title}</h4>
          <span class="ideator-vernacular-badge">🇮🇳 ${item.vernacular_title || item.topic_title}</span>
          <div class="ideator-hook-text">🎯 <strong>Cultural Anchor:</strong> ${item.cultural_hook}</div>
          <div style="font-size: 0.78rem; color: #059669; font-weight: 600;">✨ ${item.learning_outcome}</div>
        </div>
        <button class="btn-apply-topic" data-topic="${item.topic_title}" data-grade="${grade}" data-subject="${subject}">
          Apply & Generate ➔
        </button>
      </div>
    `).join('');

    // Wire apply buttons
    resultsContainer.querySelectorAll('.btn-apply-topic').forEach(btn => {
      btn.addEventListener('click', () => {
        const top = btn.getAttribute('data-topic');
        const grd = btn.getAttribute('data-grade');
        const sbj = btn.getAttribute('data-subject');

        const topicInput = document.getElementById('teacher-topic-input');
        const gradeSelect = document.getElementById('teacher-grade-select');
        const subjectSelect = document.getElementById('teacher-subject-select');

        if (topicInput && top) topicInput.value = top;
        if (gradeSelect && grd) gradeSelect.value = grd;
        if (subjectSelect && sbj) subjectSelect.value = sbj;

        const modal = document.getElementById('modal-topic-ideator');
        if (modal) modal.style.display = 'none';

        this.generateTeacherLesson();
      });
    });
  }

  getSavedLessons() {
    try {
      const raw = localStorage.getItem('vernac_saved_lessons');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  updateSavedLessonsCount() {
    const countEl = document.getElementById('saved-lessons-count');
    if (countEl) {
      const count = this.getSavedLessons().length || 1;
      countEl.textContent = count;
    }
  }

  renderSavedLessonsLibrary() {
    const listContainer = document.getElementById('saved-lessons-list-container');
    if (!listContainer) return;

    let saved = this.getSavedLessons();
    if (saved.length === 0) {
      saved = [{
        lesson_id: 'lesson-water-cycle-ta-001',
        topic: 'மழை சுழற்சி & ஆவியாதல் (The Water Cycle)',
        grade: 'Class 4',
        subject: 'Environmental Studies (EVS)',
        language: 'Tamil',
        difficulty: 'Beginner',
        pedagogical_hook: 'மதுரை வைகை ஆறும் இல்லத்துப் பானையும்',
        created_at: '2026-09-20'
      }];
      localStorage.setItem('vernac_saved_lessons', JSON.stringify(saved));
    }

    this.updateSavedLessonsCount();

    listContainer.innerHTML = saved.map(item => `
      <div class="saved-lesson-item-card" data-id="${item.lesson_id}">
        <div>
          <h4 style="font-size: 1rem; color: #1E293B; margin-bottom: 0.2rem;">${item.topic}</h4>
          <div style="font-size: 0.8rem; color: #64748B;">
            ${item.grade || 'Class 4'} | ${item.subject || 'EVS'} | ${item.language || 'Tamil'} • <em>${item.created_at || 'Recent'}</em>
          </div>
        </div>
        <div class="saved-lesson-actions">
          <button class="btn-saved-load" data-id="${item.lesson_id}">📖 Load Studio</button>
          <button class="btn-saved-delete" data-id="${item.lesson_id}">🗑️</button>
        </div>
      </div>
    `).join('');

    listContainer.querySelectorAll('.btn-saved-load').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = saved.find(s => s.lesson_id === id);
        if (found) {
          const topicInput = document.getElementById('teacher-topic-input');
          const gradeSelect = document.getElementById('teacher-grade-select');
          if (topicInput && found.topic) topicInput.value = found.topic;
          if (gradeSelect && found.grade) gradeSelect.value = found.grade;
          const modal = document.getElementById('modal-saved-lessons');
          if (modal) modal.style.display = 'none';
          this.generateTeacherLesson();
        }
      });
    });

    listContainer.querySelectorAll('.btn-saved-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        let cur = this.getSavedLessons().filter(s => s.lesson_id !== id);
        localStorage.setItem('vernac_saved_lessons', JSON.stringify(cur));
        try {
          await this.apiClient.deleteLesson(id);
        } catch (e) {}
        this.renderSavedLessonsLibrary();
      });
    });
  }

  saveCurrentLessonToLibrary() {
    if (!this.currentActiveLesson) {
      alert('Please generate a lesson plan first!');
      return;
    }
    const saved = this.getSavedLessons();
    const lessonToSave = {
      ...this.currentActiveLesson,
      lesson_id: this.currentActiveLesson.lesson_id || `lesson-${Date.now()}`,
      created_at: new Date().toLocaleDateString()
    };
    // Avoid duplicate
    const filtered = saved.filter(s => s.lesson_id !== lessonToSave.lesson_id);
    filtered.unshift(lessonToSave);
    localStorage.setItem('vernac_saved_lessons', JSON.stringify(filtered));
    this.updateSavedLessonsCount();

    const btn = document.getElementById('btn-studio-save');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ Saved!';
      btn.style.background = '#D1FAE5';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 2000);
    }
    quizManager.awardStars(5, 'Lesson Plan saved to your offline/online Library!');
  }

  speakCurrentLessonStory() {
    if (!this.currentActiveLesson || !this.currentActiveLesson.storyHook) return;
    const btn = document.getElementById('btn-studio-speak');
    speechEngine.prepareForSpeech();
    if (btn) {
      btn.innerHTML = '🔊 Speaking...';
      btn.classList.add('playing');
    }
    const textToSpeak = `${this.currentActiveLesson.topic}. ${this.currentActiveLesson.storyHook}`;
    const langCode = this.currentActiveLesson.speechCode || this.currentLang || 'ta';
    speechEngine.speak(textToSpeak, langCode, () => {
      if (btn) {
        btn.innerHTML = '🔊 Listen Story';
        btn.classList.remove('playing');
      }
    });
  }

  copyLessonPlanMarkdown() {
    if (!this.currentActiveLesson) return;
    const l = this.currentActiveLesson;
    const md = `
# ${l.topic}
**Grade / Stage:** ${l.grade} (${l.standardLevel || 'Standard'}) | **Subject:** ${l.subject || 'General'}
**Medium:** ${l.language} | **Duration:** ${l.duration || '40 Minutes'} | **Depth:** ${l.pedagogicalLevel || 'Foundational'}

---

## 🎯 Learning Objectives & NCF Competencies
${(l.learningObjectives || []).map(o => `- ${o}`).join('\n')}

---

## 📖 1. Local Storytelling Narrative Hook (Prerana)
**Regional Cultural Anchor:** ${l.contextHook || 'Household Metaphor'}

${l.storyHook}

---

## 💡 2. Core Vernacular Concept Explanation (Sankalpan)
${l.conceptExplanation}

---

## 📚 3. Mother-Tongue Scientific Glossary (Shabda Kosha)
${(l.keyVocabulary || []).map(v => `- **${v.term}:** ${v.desc}`).join('\n')}

---

## 🧪 4. Zero-Cost Hands-On Classroom Experiment (Kriyatmak)
${l.activity}

---

## 📋 5. Formative Assessment Questions (Mulyankan)
${(l.quizQuestions || []).map((q, idx) => `**Q${idx + 1}:** ${q.q}\n- **Correct Answer:** ${q.a}`).join('\n\n')}

---

## 👨‍👩‍👧 6. Family & Dinner Table Connection (Griha Karya)
${l.homework}
    `.trim();

    navigator.clipboard.writeText(md).then(() => {
      const btn = document.getElementById('btn-studio-copy');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    });
  }

  shareLessonToWhatsApp() {
    if (!this.currentActiveLesson) return;
    const l = this.currentActiveLesson;
    const text = `📚 *Mission Agent Mother-Tongue Lesson Plan*\n\n🎯 *Topic:* ${l.topic}\n🎒 *Class:* ${l.grade} | ${l.language}\n🍲 *Cultural Anchor:* ${l.contextHook}\n\n📖 *Story Hook:* ${l.storyHook.substring(0, 140)}...\n\n🔗 Generated on Mission Agent Mother-Tongue AI Platform`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  async generateTeacherLesson() {
    const topic = document.getElementById('teacher-topic-input')?.value || 'The Water Cycle';
    const grade = document.getElementById('teacher-grade-select')?.value || 'Class 4';
    const stage = document.getElementById('teacher-stage-select')?.value || 'Preparatory Stage (Class 3 - 5)';
    const subject = document.getElementById('teacher-subject-select')?.value || 'Environmental Studies (EVS)';
    const diff = document.getElementById('teacher-diff-select')?.value || 'Beginner';
    const lang = document.getElementById('teacher-lesson-lang')?.value || 'Tamil';
    const duration = document.getElementById('teacher-duration-select')?.value || '40 Minutes';
    const context = document.getElementById('teacher-context-input')?.value || 'Local river & household kitchen pots';

    const outputEl = document.getElementById('teacher-lesson-output');
    const statusText = document.getElementById('studio-status-text');
    if (!outputEl) return;

    if (statusText) statusText.textContent = `Generating AI Lesson for ${topic}...`;

    outputEl.innerHTML = `
      <div style="text-align:center; padding: 3.5rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1.5px dashed #A5B4FC;">
        <div style="font-size: 2.6rem; margin-bottom: 0.8rem; animation: pulseDotChecking 1s infinite alternate;">👩‍🏫</div>
        <h3 style="color: var(--color-primary); margin-bottom: 0.4rem;">Synthesizing AI Vernacular Lesson Plan...</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 500px; margin: 0 auto;">
          Constructing 7-part pedagogical framework with cultural anchor, NCF competencies, chalkboard diagram, and family bridge for <strong>${grade} (${subject})</strong>.
        </p>
      </div>
    `;

    let lesson = null;
    let isLiveBackend = false;
    try {
      const apiLesson = await this.apiClient.generateLesson({
        topic,
        grade,
        stage,
        subject,
        standardLevel: stage,
        language: lang,
        difficulty: diff,
        pedagogicalLevel: diff,
        duration,
        contextNotes: context
      });
      if (apiLesson && apiLesson.concept_explanation) {
        lesson = {
          lesson_id: apiLesson.lesson_id,
          grade: apiLesson.grade,
          stage: apiLesson.standard_level || stage,
          subject: apiLesson.subject || subject,
          standardLevel: apiLesson.standard_level || stage,
          language: apiLesson.language,
          difficulty: apiLesson.difficulty,
          pedagogicalLevel: apiLesson.pedagogical_level || diff,
          duration: apiLesson.duration || duration,
          topic: apiLesson.topic,
          contextHook: apiLesson.pedagogical_hook,
          storyHook: apiLesson.story_based_explanation,
          conceptExplanation: apiLesson.concept_explanation,
          learningObjectives: apiLesson.learning_objectives || [
            'Understand foundational concept in mother tongue.',
            'Connect daily household observations to scientific principles.',
            'Apply understanding in zero-cost group experiments.'
          ],
          keyVocabulary: (apiLesson.local_vocabulary || []).map(v => ({ term: v.term, desc: v.meaning })),
          activity: apiLesson.classroom_activity,
          timelineBreakdown: apiLesson.timeline_breakdown || [
            { phase: '0-5 min', title: 'Prerana (Hook)', desc: 'Show household phenomenon to ignite curiosity.' },
            { phase: '5-18 min', title: 'Sankalpan (Concept)', desc: 'Teach core concept with mother-tongue terms.' },
            { phase: '18-28 min', title: 'Kriyatmak (Activity)', desc: 'Hands-on tactile experiment.' },
            { phase: '28-35 min', title: 'Mulyankan (Quiz)', desc: 'Formative checkpoint questions.' },
            { phase: '35-40 min', title: 'Griha Karya & Wrap', desc: 'Assign dinner table conversation.' }
          ],
          blackboardLayout: apiLesson.blackboard_layout || {
            left_column: `Objectives:\n1. Core concept\n2. Real-world link`,
            center_column: `[Diagram: ${topic}]`,
            right_column: `Key Terms:\n• Term 1\n• Term 2\nHomework: Home bridge`
          },
          differentiatedGuidance: apiLesson.differentiated_guidance || {
            support_struggling_learners: 'Provide physical tactile objects and simplify vocabulary.',
            advanced_learners: 'Encourage independent why-and-how hypotheses.'
          },
          misconceptionsAddressed: apiLesson.misconceptions_addressed || [
            'Abstract formulas must be memorized blindly -> Deep intuitive understanding through mother tongue lasts a lifetime.'
          ],
          quizQuestions: (apiLesson.quiz_questions && apiLesson.quiz_questions.length > 0)
            ? apiLesson.quiz_questions.map(q => ({
                q: q.question,
                a: q.correct || q.correct_answer || 'Understood',
                options: q.options || [],
                explanation: q.explanation || ''
              }))
            : [{ q: `What is the core principle of ${topic}?`, a: 'Natural living laws' }],
          homework: apiLesson.homework_activity
        };
        isLiveBackend = true;
      }
    } catch (e) {
      console.warn('[Mission Agent] Lesson generation backend fallback:', e);
    }

    if (!lesson) {
      lesson = pedagogyEngine.generateLessonPlan({
        topic,
        grade,
        stage,
        subject,
        standardLevel: stage,
        language: lang,
        difficulty: diff,
        pedagogicalLevel: diff,
        duration,
        contextNotes: context
      });
    }

    // Retain as active lesson in instance
    this.currentActiveLesson = lesson;
    if (statusText) statusText.textContent = `Lesson Ready: ${lesson.topic}`;

    outputEl.innerHTML = `
      <div class="lesson-plan-card">
        <!-- Header Banner with Meta Badges -->
        <div class="lesson-plan-header">
          <div>
            <div class="lesson-meta-badges-row">
              <span class="lesson-badge stage-badge">${lesson.stage || lesson.standardLevel || grade}</span>
              <span class="lesson-badge">${lesson.subject || subject}</span>
              <span class="lesson-badge level-badge">${lesson.pedagogicalLevel || diff}</span>
              <span class="lesson-badge">⏱️ ${lesson.duration || duration}</span>
              <span class="lesson-badge">🌐 ${lesson.language || lang}</span>
              <span class="lesson-badge ai-badge">
                ${isLiveBackend ? '⚡ Live AI Backend' : '💻 Local Vernacular Engine'}
              </span>
            </div>
            <h3 class="lesson-title">${lesson.topic}</h3>
            <div class="lesson-context-hook">🎯 Regional Cultural Anchor: <em>${lesson.contextHook}</em></div>
          </div>
        </div>

        <!-- 0. Learning Objectives & NCF Competencies -->
        <div class="lesson-objectives-box">
          <h4>🎯 NEP 2020 / NCF Learning Outcomes</h4>
          <ul class="lesson-objectives-list">
            ${(lesson.learningObjectives || []).map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>

        <!-- 1. Narrative Story Hook -->
        <div class="lesson-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <h4>📖 1. Local Storytelling Narrative Hook (Prerana)</h4>
            <button id="btn-inline-speak-story" class="btn-studio-tool" style="font-size: 0.76rem;">🔊 Listen Story</button>
          </div>
          <p class="lesson-story">${lesson.storyHook}</p>
        </div>

        <!-- 2. Core Vernacular Concept Explanation -->
        <div class="lesson-section">
          <h4>💡 2. Mother-Tongue Concept Explanation (Sankalpan)</h4>
          <div style="background: #F8FAFC; border-left: 4px solid #3B82F6; padding: 1.1rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.94rem; line-height: 1.6; color: #1E293B;">
            ${(lesson.conceptExplanation || '').replace(/\n\n/g, '<br><br>')}
          </div>
        </div>

        <!-- 3. Scientific Glossary Grid -->
        <div class="lesson-section">
          <h4>📚 3. Mother-Tongue Scientific Glossary (Shabda Kosha)</h4>
          <div class="lesson-glossary-grid">
            ${(lesson.keyVocabulary || []).map(v => `
              <div class="glossary-card">
                <strong>${v.term}</strong>
                <span>${v.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. Zero-Cost Hands-On Activity -->
        <div class="lesson-section">
          <h4>🧪 4. Zero-Cost Classroom Experiential Experiment (Kriyatmak)</h4>
          <div style="background: #F0FDF4; border-left: 4px solid #10B981; padding: 1rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.92rem; line-height: 1.6;">
            ${lesson.activity}
          </div>
        </div>

        <!-- 5. Chalkboard Visual Layout & 40-Min Timeline -->
        <div class="lesson-section">
          <h4>📋 5. Teacher Chalkboard Plan & Period Timeline</h4>
          
          <!-- Period Timeline -->
          <div class="lesson-timeline-strip">
            ${(lesson.timelineBreakdown || []).map(t => `
              <div class="timeline-step">
                <strong>${t.phase}: ${t.title}</strong>
                <span>${t.desc}</span>
              </div>
            `).join('')}
          </div>

          <!-- Realistic Classroom Blackboard Simulation -->
          <div class="lesson-blackboard-preview">
            <div style="font-size: 0.78rem; text-align: center; color: #A7F3D0; margin-bottom: 0.6rem; letter-spacing: 1px;">
              ══ CLASSROOM CHALKBOARD BLUEPRINT ══
            </div>
            <div class="blackboard-chalk-grid">
              <div class="chalk-col">
                <h5>[LEFT: OBJECTIVES]</h5>
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${lesson.blackboardLayout?.left_column || '• Concept Objectives'}</pre>
              </div>
              <div class="chalk-col">
                <h5>[CENTER: DIAGRAM / STEPS]</h5>
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #FEF08A;">${lesson.blackboardLayout?.center_column || `[Visual Diagram of ${lesson.topic}]`}</pre>
              </div>
              <div class="chalk-col">
                <h5>[RIGHT: VOCAB & TASK]</h5>
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${lesson.blackboardLayout?.right_column || '• Vocabulary & Homework'}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. Formative Assessment Questions -->
        <div class="lesson-section">
          <h4>🎯 6. Formative Checkpoint Questions (Mulyankan)</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${(lesson.quizQuestions || []).map((q, idx) => `
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.85rem 1.1rem;">
                <div style="font-weight: 700; color: #1E293B; margin-bottom: 0.35rem;">Q${idx + 1}: ${q.q}</div>
                ${q.options && q.options.length > 0 ? `
                  <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.4rem;">
                    ${q.options.map(opt => `<span style="font-size: 0.78rem; padding: 0.2rem 0.6rem; background: #FFF; border: 1px solid #CBD5E1; border-radius: 4px;">${opt}</span>`).join('')}
                  </div>
                ` : ''}
                <div style="font-size: 0.82rem; color: #059669; font-weight: 600;">
                  ✅ Answer: ${q.a} ${q.explanation ? `— <em>${q.explanation}</em>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 7. Differentiated Guidance -->
        <div class="lesson-section">
          <h4>🤝 7. Differentiated Learning Guidance</h4>
          <div class="lesson-guidance-grid">
            <div class="guidance-card support">
              <h5>🌱 For Struggling Learners (Scaffolding):</h5>
              <p style="margin: 0; font-size: 0.85rem; color: #1E3A8A;">${lesson.differentiatedGuidance?.support_struggling_learners || 'Use tactile real objects and physical metaphors.'}</p>
            </div>
            <div class="guidance-card advanced">
              <h5>🚀 For Advanced Learners (Challenge):</h5>
              <p style="margin: 0; font-size: 0.85rem; color: #581C87;">${lesson.differentiatedGuidance?.advanced_learners || 'Encourage students to formulate their own hypotheses.'}</p>
            </div>
          </div>
        </div>

        <!-- 8. Misconceptions Buster -->
        ${lesson.misconceptionsAddressed && lesson.misconceptionsAddressed.length > 0 ? `
          <div class="lesson-misconceptions-box">
            <h4>⚠️ Frequently Addressed Misconceptions</h4>
            <ul style="margin: 0; padding-left: 1.25rem;">
              ${lesson.misconceptionsAddressed.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- 9. Dinner Table Connection (Griha Karya) -->
        <div class="lesson-section" style="margin-bottom: 0;">
          <h4>👨‍👩‍👧 8. Family & Dinner Table Connection (Griha Karya)</h4>
          <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 1rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.92rem;">
            <strong>Tonight at dinner:</strong> ${lesson.homework}
          </div>
        </div>

      </div>
    `;

    const inlineSpeak = document.getElementById('btn-inline-speak-story');
    if (inlineSpeak) {
      inlineSpeak.addEventListener('click', () => {
        this.speakCurrentLessonStory();
      });
    }

    quizManager.awardStars(10, 'Generated Complete 7-Stage Vernacular Lesson Plan!');
  }

  async renderParentDashboard() {
    let data = PARENT_DATA;
    try {
      const apiParent = await this.apiClient.getParentInsights('student_001');
      if (apiParent && apiParent.student_name) {
        data = {
          ...PARENT_DATA,
          studentName: apiParent.student_name,
          grade: apiParent.grade,
          motherTongue: apiParent.mother_tongue,
          timeSpentToday: `${apiParent.screen_time_hours_weekly || 1.5} hrs`,
          conceptsMasteredThisWeek: apiParent.concepts_learned_count || 4
        };
      }
    } catch (e) {
      console.warn('[Mission Agent] Parent insights backend fallback:', e);
    }
    const parentContainer = document.getElementById('parent-dashboard-content');
    if (!parentContainer) return;

    const lang = this.currentLang || 'ta';
    const greetings = {
      ta: 'வணக்கம் அம்மா / அப்பா! (Welcome Parents)',
      hi: 'नमस्ते माता-पिता! (Welcome Parents)',
      te: 'నమస్కారం తల్లిదండ్రులకు! (Welcome Parents)',
      kn: 'ನಮಸ್ಕಾರ ಪೋಷಕರೆ! (Welcome Parents)',
      ml: 'നമസ്കാരം മാതാപിതാക്കളെ! (Welcome Parents)',
      bn: 'নমস্কার অভিভাবকবৃন্দ! (Welcome Parents)',
      mr: 'नमस्कार पालकांनो! (Welcome Parents)',
      gu: 'નમસ્તે વાલીઓ! (Welcome Parents)',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਮਾਪਿਓ! (Welcome Parents)',
      or: 'ନମସ୍କାର ଅଭିଭାବକବୃନ୍ଦ! (Welcome Parents)',
      as: 'নমস্কাৰ অভিভাৱকসকল! (Welcome Parents)',
      en: 'Welcome Parents & Families!'
    };
    const prompts = {
      ta: 'இன்று இரவு சமைக்கும் போது: "குக்கரில் இருந்து வரும் ஆவி எங்கே போகிறது?" என்று பிள்ளையிடம் கேளுங்கள்!',
      hi: 'आज रात खाना बनाते समय पूछें: "पतीले की भाप ठंडी होकर क्या बनती है?"',
      te: 'ఈ రాత్రి భోజనం సమయంలో అడగండి: "పొయ్యి మీద చారు ఆవిరి పైకి ఎందుకు వెళ్తుంది?"',
      kn: 'ಇಂದು ರಾತ್ರಿ ಊಟದ ಸಮಯದಲ್ಲಿ ಕೇಳಿ: "ಬಿಸಿ ಅಡುಗೆಯ ಹಬೆ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತದೆ?"',
      ml: 'ഇന്ന് അത്താഴ സമയത്ത് ചോദിക്കൂ: "ചൂടുള്ള ചായയുടെ ആവി എങ്ങോട്ടാണ് പോകുന്നത്?"',
      bn: 'আজ রাতে রান্না করার সময় জিজ্ঞাসা করুন: "ভাতের হাঁড়ির বাষ্প কোথায় যায়?"',
      mr: 'आज रात्री जेवताना विचारा: "चहाची वाफ थंड झाल्यावर पाण्याचे थेंब कसे बनतात?"',
      gu: 'આજે રાત્રે રસોઈ કરતી વખતે પૂછો: "ગરમ તપેલીની વરાળ આકાશમાં શું બને છે?"',
      pa: 'ਅੱਜ ਰਾਤ ਰੋਟੀ ਵੇਲੇ ਪੁੱਛੋ: "ਦਾਲ ਉਬਲਣ ਵੇਲੇ ਢੱਕਣ ਉੱਤੇ ਪਾਣੀ ਦੀਆਂ ਬੂੰਦਾਂ ਕਿਉਂ ਆਉਂਦੀਆਂ ਹਨ?"',
      or: 'ଆଜି ରାତିରେ ପଚାରନ୍ତୁ: "ହାଣ୍ଡିର ଭାମ୍ପ ଉପରକୁ ଯାଇ କଣ ହୁଏ?"',
      as: 'আজি ৰাতি সোধক: "গৰম চাহৰ ধোঁৱা ওপৰলৈ গৈ কি হয়?"',
      en: 'Tonight at dinner, ask: "Where does the steam from the hot soup pot go in the sky?"'
    };
    const greetingText = greetings[lang] || data.parentGreeting;
    const promptText = prompts[lang] || data.dinnerTablePrompt;

    parentContainer.innerHTML = `
      <div class="parent-welcome-banner">
        <div class="parent-banner-text">
          <h2>${greetingText}</h2>
          <p>Tracking <strong>${data.studentName}'s</strong> learning journey in his native mother tongue.</p>
        </div>
        <div class="parent-stats-pills">
          <div class="parent-stat-box">
            <span class="stat-num">${data.timeSpentToday}</span>
            <span class="stat-lbl">Time Today</span>
          </div>
          <div class="parent-stat-box">
            <span class="stat-num">${data.conceptsMasteredThisWeek}</span>
            <span class="stat-lbl">Mastered Concepts</span>
          </div>
        </div>
      </div>

      <div class="parent-grid">
        <div class="parent-card">
          <div class="parent-card-header">
            <h3>🍲 Tonight's Dinner Conversation Starter</h3>
            <span class="parent-chip">High Engagement</span>
          </div>
          <div class="parent-dinner-box">
            <div class="dinner-icon">🗣️</div>
            <div class="dinner-text">${promptText}</div>
          </div>
          <p class="dinner-help">Asking questions connected to dinner or kitchen routines deepens understanding by 3x!</p>
        </div>

        <div class="parent-card">
          <div class="parent-card-header">
            <h3>🎧 Listen to What Aarav Learned Today</h3>
            <span class="parent-chip">Voice Recording</span>
          </div>
          <div class="parent-audio-snippet">
            <div class="audio-track-info">
              <strong>🎙️ Aarav explaining Evaporation in Tamil:</strong>
              <p>“அம்மா, அடுப்பில் வைக்கும் ரசத்தின் ஆவி மேலே போய் தட்டில் பட்டு மழையாகும்!”</p>
            </div>
            <button class="btn-play-child-voice" id="btn-play-aarav">
              ▶️ Play Recording (Tamil)
            </button>
          </div>
        </div>
      </div>
    `;

    const playBtn = document.getElementById('btn-play-aarav');
    if (playBtn) {
      playBtn.onclick = () => {
        playBtn.classList.add('playing');
        speechEngine.speak("அம்மா, அடுப்பில் வைக்கும் ரசத்தின் ஆவி மேலே போய் தட்டில் பட்டு மழையாகும்!", 'ta-IN', () => {
          playBtn.classList.remove('playing');
        });
      };
    }
  }

  setupMinigame() {
    const minigameContainer = document.getElementById('minigame-container');
    if (!minigameContainer) return;

    const pairs = [
      { id: 'p1', eng: 'Sunlight', vern: 'சூரிய ஒளி', icon: '☀️' },
      { id: 'p2', eng: 'Raindrops', vern: 'மழைத்துளிகள்', icon: '🌧️' },
      { id: 'p3', eng: 'Green Leaf', vern: 'பச்சை இலை', icon: '🍃' },
      { id: 'p4', eng: 'Half (1/2)', vern: 'அரை பாகம்', icon: '🥭' }
    ];

    let selectedLeft = null;
    let matchesCount = 0;

    minigameContainer.innerHTML = `
      <div class="minigame-box">
        <div class="minigame-header">
          <h4>🎮 Match-the-Pair: English to Mother Tongue!</h4>
          <span id="minigame-score">0 / 4 Matched</span>
        </div>
        <div class="minigame-columns">
          <div class="minigame-col" id="col-left">
            ${pairs.map(p => `<button class="minigame-pill pill-left" data-id="${p.id}">${p.icon} ${p.eng}</button>`).join('')}
          </div>
          <div class="minigame-col" id="col-right">
            ${[...pairs].reverse().map(p => `<button class="minigame-pill pill-right" data-id="${p.id}">${p.vern}</button>`).join('')}
          </div>
        </div>
      </div>
    `;

    const leftBtns = minigameContainer.querySelectorAll('.pill-left');
    const rightBtns = minigameContainer.querySelectorAll('.pill-right');

    leftBtns.forEach(b => {
      b.onclick = () => {
        speechEngine.playPopSound();
        leftBtns.forEach(btn => btn.classList.remove('selected'));
        b.classList.add('selected');
        selectedLeft = b.getAttribute('data-id');
      };
    });

    rightBtns.forEach(b => {
      b.onclick = () => {
        if (!selectedLeft) return;
        const rightId = b.getAttribute('data-id');
        if (selectedLeft === rightId) {
          b.classList.add('matched');
          const leftMatched = minigameContainer.querySelector(`.pill-left[data-id="${selectedLeft}"]`);
          if (leftMatched) leftMatched.classList.add('matched');
          matchesCount++;
          document.getElementById('minigame-score').textContent = `${matchesCount} / 4 Matched`;
          selectedLeft = null;

          if (matchesCount === 4) {
            quizManager.burstConfetti();
            quizManager.awardStars(25, 'Minigame Champion! All pairs matched!');
          } else {
            speechEngine.playPopSound();
          }
        } else {
          b.classList.add('shake-error');
          setTimeout(() => b.classList.remove('shake-error'), 500);
        }
      };
    });
  }

  // ==========================================================================
  // MOTHER-TONGUE FIRST VOICE ONBOARDING CONTROLLER
  // ==========================================================================
  initMotherTongueOnboarding() {
    const modal = document.getElementById('modal-mother-tongue-first');
    if (!modal) return;

    const btnClose = document.getElementById('btn-close-onboarding');
    const btnNavTrigger = document.getElementById('btn-nav-mother-tongue');
    const btnMic = document.getElementById('btn-onboarding-mic');
    const waveCanvas = 'onboarding-wave-canvas';
    const detectedBanner = document.getElementById('onboarding-detected-banner');
    const detectedTranscript = document.getElementById('onboarding-detected-transcript');
    const detectedFlag = document.getElementById('onboarding-detected-flag');
    const detectedName = document.getElementById('onboarding-detected-name');
    const detectedNative = document.getElementById('onboarding-detected-native');
    const detectedConf = document.getElementById('onboarding-detected-confidence');
    const detectedScript = document.getElementById('onboarding-detected-script');
    const langGrid = document.getElementById('onboarding-lang-grid');
    const btnConfirm = document.getElementById('btn-confirm-mother-tongue');
    const confirmLangName = document.getElementById('onboarding-confirm-lang-name');

    const step1 = document.getElementById('onboarding-step-1');
    const step2 = document.getElementById('onboarding-step-2');

    let selectedLangCode = this.currentLang || 'ta';
    let detectedMeta = speechEngine.getLanguageMetadata(selectedLangCode);

    // Helper: Select language immediately and enter website
    const selectLanguageAndEnter = (code) => {
      if (!code) return;
      selectedLangCode = code;

      // Update grid selection visually
      if (langGrid) {
        langGrid.querySelectorAll('.btn-lang-choice').forEach(b => {
          b.classList.toggle('selected', b.getAttribute('data-code') === code);
        });
      }

      detectedMeta = speechEngine.getLanguageMetadata(code, 1.0, 'User Selected');
      if (confirmLangName) {
        confirmLangName.textContent = `${detectedMeta.name} (${detectedMeta.nativeName})`;
      }

      // Stop speech & mic immediately
      speechEngine.stopListening();
      speechEngine.stopSpeaking();
      if (btnMic) {
        btnMic.classList.remove('listening');
      }

      // Apply language globally right away
      this.setGlobalLanguage(code);

      try {
        localStorage.setItem('vernac_user_lang', code);
        localStorage.setItem('vernac_onboarding_completed', 'true');
      } catch (err) {}

      try {
        speechEngine.playCelebrationSound();
      } catch (err) {}

      // Immediately close the onboarding modal so the user enters the website
      modal.classList.remove('active');
      modal.style.display = 'none';

      // Show rewarding toast feedback
      const toast = document.createElement('div');
      toast.className = 'star-reward-toast';
      toast.innerHTML = `
        <div class="toast-star-icon">${detectedMeta.flag}</div>
        <div class="toast-content">
          <div class="toast-title">${detectedMeta.name} (${detectedMeta.nativeName}) Selected!</div>
          <div class="toast-msg">Welcome to VernacLearn! AI lessons and quizzes are now set to your mother tongue.</div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('toast-show'), 50);
      setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    };

    // Navbar trigger
    if (btnNavTrigger) {
      btnNavTrigger.onclick = (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        modal.classList.add('active');
        step1.style.display = 'block';
        step2.style.display = 'none';
        if (langGrid) {
          langGrid.querySelectorAll('.btn-lang-choice').forEach(b => {
            b.classList.toggle('selected', b.getAttribute('data-code') === this.currentLang);
          });
        }
        try { speechEngine.playPopSound(); } catch (err) {}
      };
    }

    // Modal backdrop click -> dismiss cleanly
    modal.onclick = (e) => {
      if (e.target === modal) {
        e.preventDefault();
        selectLanguageAndEnter(selectedLangCode || this.currentLang || 'ta');
      }
    };

    // Close button
    if (btnClose) {
      btnClose.onclick = (e) => {
        e.preventDefault();
        selectLanguageAndEnter(selectedLangCode || this.currentLang || 'ta');
      };
    }

    // Render language choice grid (or bind to pre-rendered HTML)
    // "Click Any Language to Choose Immediately"
    if (langGrid) {
      const bindLanguageGridButtons = () => {
        langGrid.querySelectorAll('.btn-lang-choice').forEach(btn => {
          btn.onclick = (e) => {
            e.preventDefault();
            const code = btn.getAttribute('data-code');
            selectLanguageAndEnter(code);
          };
        });
      };

      // If grid has no children, populate it dynamically
      if (!langGrid.children || langGrid.children.length === 0) {
        langGrid.innerHTML = SUPPORTED_LANGUAGES.map(lang => `
          <button class="btn-lang-choice ${lang.code === selectedLangCode ? 'selected' : ''}" data-code="${lang.code}" title="Choose ${lang.name} immediately">
            <span class="lang-choice-flag">${lang.flag}</span>
            <div class="lang-choice-names">
              <span class="lang-choice-eng">${lang.name}</span>
              <span class="lang-choice-native">${lang.nativeName}</span>
            </div>
          </button>
        `).join('');
      }

      bindLanguageGridButtons();
    }

    // Microphone speech capture and auto-identification
    if (btnMic) {
      btnMic.onclick = (e) => {
        e.preventDefault();

        if (speechEngine.isListening) {
          speechEngine.stopListening();
          btnMic.classList.remove('listening');
          speechEngine.stopWaveform();
          const hintEl = document.getElementById('onboarding-mic-hint');
          if (hintEl) hintEl.textContent = 'Click the Microphone & Speak';
          return;
        }

        try { speechEngine.playPopSound(); } catch (err) {}
        btnMic.classList.add('listening');
        speechEngine.startWaveform(waveCanvas, '#00A8CC');

        const hintEl = document.getElementById('onboarding-mic-hint');
        const subhintEl = document.getElementById('onboarding-mic-subhint');
        if (hintEl) hintEl.textContent = '🎙️ Listening in Any Language... Speak now!';
        if (subhintEl) subhintEl.textContent = 'Say your mother tongue (e.g. "Tamil", "Hindi", "Telugu") or speak any sentence!';

        let speechTranscriptHeard = '';
        let detectedLanguageObj = null;

        speechEngine.startListening(
          'auto',
          // onResultCallback
          (transcript, isFinal, detected) => {
            if (!transcript) return;
            speechTranscriptHeard = transcript;

            if (detectedBanner) detectedBanner.style.display = 'flex';
            if (detectedTranscript) detectedTranscript.textContent = transcript;
            
            if (detected) {
              detectedLanguageObj = detected;
              detectedMeta = detected;
              selectedLangCode = detected.code;

              if (detectedFlag) detectedFlag.textContent = detected.flag;
              if (detectedName) detectedName.textContent = detected.name;
              if (detectedNative) detectedNative.textContent = `(${detected.nativeName})`;
              if (detectedConf) detectedConf.textContent = `${Math.round(detected.confidence * 100)}% Confidence`;
              if (detectedScript) detectedScript.textContent = `Identified Script: ${detected.scriptName}`;
              if (confirmLangName) confirmLangName.textContent = `${detected.name} (${detected.nativeName})`;

              // Highlight grid button
              if (langGrid) {
                langGrid.querySelectorAll('.btn-lang-choice').forEach(b => {
                  b.classList.toggle('selected', b.getAttribute('data-code') === detected.code);
                });
              }

              // Immediately switch global language to detected speech
              this.setGlobalLanguage(detected.code);
              try {
                localStorage.setItem('vernac_user_lang', detected.code);
                localStorage.setItem('vernac_onboarding_completed', 'true');
              } catch (err) {}

              if (hintEl) {
                hintEl.textContent = `✅ Heard: "${transcript}" → ${detected.name} (${detected.nativeName})!`;
              }
            }
          },
          // onEndCallback
          () => {
            btnMic.classList.remove('listening');
            speechEngine.stopWaveform();

            if (detectedLanguageObj) {
              if (hintEl) {
                hintEl.textContent = `🎉 Mother Tongue set to ${detectedLanguageObj.name}! Entering website...`;
              }
              try { speechEngine.playCelebrationSound(); } catch (err) {}

              setTimeout(() => {
                selectLanguageAndEnter(detectedLanguageObj.code);
              }, 800);
            } else if (speechTranscriptHeard) {
              const fallbackDetect = speechEngine.detectLanguage(speechTranscriptHeard);
              if (fallbackDetect) {
                selectLanguageAndEnter(fallbackDetect.code);
              }
            } else {
              const hintEl = document.getElementById('onboarding-mic-hint');
              if (hintEl) hintEl.textContent = 'Speak clearly into mic or click any language below to choose immediately!';
            }
          },
          // simulatedText: null (never fake language override)
          null,
          // onErrorCallback
          (errCode) => {
            btnMic.classList.remove('listening');
            speechEngine.stopWaveform();
            console.log('Voice onboarding mic status:', errCode);
            const hintEl = document.getElementById('onboarding-mic-hint');
            if (hintEl) {
              if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
                hintEl.textContent = '🎙️ Microphone access blocked. Click any language below to choose immediately!';
              } else if (errCode === 'no-speech') {
                hintEl.textContent = 'No voice detected. Click mic to speak again, or click any language below!';
              } else if (errCode === 'not-supported') {
                hintEl.textContent = 'Speech recognition not supported in this browser. Click any language below!';
              } else {
                hintEl.textContent = 'Microphone ready. Click any language below to choose immediately!';
              }
            }
          }
        );
      };
    }

    // Quick Close button
    const btnQuickClose = document.getElementById('btn-quick-close-onboarding');
    if (btnQuickClose) {
      btnQuickClose.onclick = (e) => {
        e.preventDefault();
        selectLanguageAndEnter(selectedLangCode || this.currentLang || 'ta');
      };
    }

    // Confirm button -> apply and enter immediately
    if (btnConfirm) {
      btnConfirm.onclick = (e) => {
        e.preventDefault();
        selectLanguageAndEnter(selectedLangCode || this.currentLang || 'ta');
      };
    }

    // Replay greeting button
    const btnReplay = document.getElementById('btn-replay-greeting');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        const meta = detectedMeta || speechEngine.getLanguageMetadata(this.currentLang);
        speechEngine.speak(meta.welcomeGreeting, meta.speechCode);
      });
    }

    // Step 2 Question & Output handling
    const interactionInput = document.getElementById('interaction-input-box');
    const btnInteractionSubmit = document.getElementById('btn-interaction-submit');
    const btnInteractionMic = document.getElementById('btn-interaction-mic');

    const executeQuestion = async (query) => {
      const q = (query || (interactionInput ? interactionInput.value : '')).trim();
      if (!q) return;

      const meta = detectedMeta || speechEngine.getLanguageMetadata(this.currentLang);
      const outputBox = document.getElementById('onboarding-output-box');
      const titleEl = document.getElementById('output-pedagogy-title');
      const metaphorEl = document.getElementById('output-metaphor-bubble');
      const explEl = document.getElementById('output-explanation-text');
      const btnReadAloud = document.getElementById('btn-read-aloud-mt');

      if (titleEl) titleEl.textContent = 'Mitra is thinking in your mother tongue... 💭';
      if (outputBox) outputBox.style.display = 'block';

      // Pedagogy Engine / Backend
      let explanation = null;
      try {
        const apiRes = await this.apiClient.explainPedagogy(q, this.currentLang);
        if (apiRes && apiRes.vernacular_explanation) {
          explanation = {
            title: apiRes.pedagogy_title || apiRes.literal_translation,
            metaphor: apiRes.local_metaphor,
            text: apiRes.vernacular_explanation,
            speechCode: apiRes.speech_code || meta.speechCode
          };
        }
      } catch (e) {
        console.warn('[Mission Agent] Onboarding backend explain fallback:', e);
      }

      if (!explanation) {
        const localConcept = pedagogyEngine.explainConcept(q, this.currentLang);
        explanation = {
          title: localConcept.pedagogyTitle,
          metaphor: localConcept.localMetaphor,
          text: localConcept.vernacularExplanation,
          speechCode: localConcept.speechCode
        };
      }

      if (titleEl) titleEl.textContent = `✨ ${explanation.title}`;
            const metaphorLabels = {
        ta: 'உள்ளூர் உதாரணம் (Local Metaphor)',
        hi: 'स्थानीय उदाहरण (Local Metaphor)',
        te: 'స్థానిక ఉదాహరణ (Local Metaphor)',
        kn: 'ಸ್ಥಳೀಯ ಉದಾಹರಣೆ (Local Metaphor)',
        ml: 'പ്രാദേശിക ഉദാഹരണം (Local Metaphor)',
        bn: 'স্থানীয় উদাহরণ (Local Metaphor)',
        mr: 'स्थानिक उदाहरण (Local Metaphor)',
        gu: 'સ્થાનિક ઉદાહરણ (Local Metaphor)',
        pa: 'ਸਥਾਨਕ ਉਦਾਹਰਣ (Local Metaphor)',
        or: 'ସ୍ଥାନୀୟ ଉଦାହରଣ (Local Metaphor)',
        as: 'স্থানীয় উদাহৰণ (Local Metaphor)',
        en: 'Familiar Household Metaphor'
      };
      const metaLabel = metaphorLabels[this.currentLang] || 'Cultural Metaphor';
      if (metaphorEl) metaphorEl.innerHTML = `🍲 <strong>${metaLabel}:</strong> ${explanation.metaphor}`;
      if (explEl) explEl.textContent = explanation.text;

      // Speak pedagogical explanation aloud in mother tongue
      speechEngine.speak(explanation.title, explanation.speechCode);
      speechEngine.playCelebrationSound();
      quizManager.awardStars(15, `Asked question in ${meta.name}!`);

      if (btnReadAloud) {
        btnReadAloud.onclick = () => {
          speechEngine.speak(`${explanation.title}. ${explanation.text}`, explanation.speechCode);
        };
      }
    };

    if (btnInteractionSubmit && interactionInput) {
      btnInteractionSubmit.addEventListener('click', () => executeQuestion());
      interactionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeQuestion();
      });
    }

    if (btnInteractionMic && interactionInput) {
      btnInteractionMic.addEventListener('click', () => {
        speechEngine.playPopSound();
        btnInteractionMic.classList.add('recording');
        const meta = detectedMeta || speechEngine.getLanguageMetadata(this.currentLang);
        
        speechEngine.startListening(
          meta.speechCode || 'ta-IN',
          (transcript, isFinal) => {
            interactionInput.value = transcript;
            if (isFinal) {
              btnInteractionMic.classList.remove('recording');
              executeQuestion(transcript);
            }
          },
          () => {
            btnInteractionMic.classList.remove('recording');
            if (interactionInput.value) executeQuestion(interactionInput.value);
          },
          meta.sampleQuestion || "வானத்திலிருந்து மழை ஏன் பெய்கிறது?"
        );
      });
    }

    // Finish onboarding button
    const btnFinish = document.getElementById('btn-finish-onboarding');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        modal.classList.remove('active');
        speechEngine.playCelebrationSound();
        this.switchTab('home');
      });
    }
  }

  renderOnboardingPresetQuestions(meta) {
    const container = document.getElementById('onboarding-preset-chips');
    if (!container) return;

    const questions = [
      { label: '🌧️ ' + (meta.sampleQuestion || 'Why does rain fall?'), query: meta.sampleQuestion || 'Why does rain fall from the sky?' },
      { label: '🍃 How plants make food?', query: 'How do plants make food? Photosynthesis' },
      { label: '🥭 What is a fraction (1/2)?', query: 'What is a fraction? Explain with mangoes' }
    ];

    container.innerHTML = questions.map(q => `
      <button class="btn-preset-question" data-query="${q.query}">
        ${q.label}
      </button>
    `).join('');

    container.querySelectorAll('.btn-preset-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        const input = document.getElementById('interaction-input-box');
        if (input) input.value = query;
        const submitBtn = document.getElementById('btn-interaction-submit');
        if (submitBtn) submitBtn.click();
      });
    });
  }

  async initSecuredHostModal() {
    const btnNavHost = document.getElementById('btn-nav-host-link');
    const modalHost = document.getElementById('modal-host-link');
    const btnCloseHost = document.getElementById('btn-close-host-modal');
    const hostUrlInput = document.getElementById('modal-host-url-input');
    const btnCopy = document.getElementById('btn-copy-host-link');
    const qrImg = document.getElementById('host-qr-code-img');
    const navHostLabel = document.getElementById('nav-host-label');

    // Fetch live host metadata
    const info = await this.apiClient.getHostInfo();
    let currentUrl = (info && info.host_url && !info.host_url.includes('localhost:8000') && !info.host_url.includes('127.0.0.1'))
      ? info.host_url
      : window.location.origin;

    if (window.location.protocol === 'https:') {
      currentUrl = window.location.origin;
    }

    if (hostUrlInput) hostUrlInput.value = currentUrl;

    if (qrImg && currentUrl) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;
    }

    if (navHostLabel) {
      if (currentUrl.startsWith('https://')) {
        navHostLabel.textContent = '🔒 HTTPS Active';
      } else {
        navHostLabel.textContent = '🔒 Secured Host';
      }
    }

    if (btnNavHost && modalHost) {
      btnNavHost.addEventListener('click', async () => {
        const freshInfo = await this.apiClient.getHostInfo();
        const activeUrl = (freshInfo && freshInfo.host_url && !freshInfo.host_url.includes('localhost:8000'))
          ? freshInfo.host_url
          : (window.location.protocol === 'https:' ? window.location.origin : (freshInfo ? freshInfo.host_url : window.location.origin));
        
        if (hostUrlInput) hostUrlInput.value = activeUrl;
        if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(activeUrl)}`;
        
        modalHost.classList.add('active');
        speechEngine.playPopSound();
      });
    }

    if (btnCloseHost && modalHost) {
      btnCloseHost.addEventListener('click', () => {
        modalHost.classList.remove('active');
      });
    }

    if (btnCopy && hostUrlInput) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(hostUrlInput.value).then(() => {
          btnCopy.textContent = 'Copied! ✓';
          btnCopy.style.background = '#059669';
          setTimeout(() => {
            btnCopy.textContent = '📋 Copy Link';
            btnCopy.style.background = '#10B981';
          }, 2000);
        });
      });
    }
  }
}

// Initialize immediately or on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new VernacApp();
    app.init();
  });
} else {
  const app = new VernacApp();
  app.init();
}
