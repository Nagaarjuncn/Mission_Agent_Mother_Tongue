// Speech Engine: Browser Web Speech API (STT & TTS) + Web Audio Effects & Waveform
export class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.audioCtx = null;
    this.animId = null;
    this.activeWaveCanvas = null;

    this.cachedVoices = [];
    this.isSpeaking = false;
    this.currentAudio = null;
    this.audioUnlocked = false;
    this.audioElement = null;

    this.initRecognition();
    this.initVoiceSynthesis();
    this.initAudioUnlock();
  }

  ensureAudioElement() {
    if (typeof document === 'undefined') return null;
    let audio = document.getElementById('vernac-global-speech-player');
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'vernac-global-speech-player';
      audio.style.display = 'none';
      audio.preload = 'auto';
      document.body.appendChild(audio);
    }
    this.audioElement = audio;
    return audio;
  }

  prepareForSpeech() {
    try {
      this.resumeAudioContext();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      const audio = this.ensureAudioElement();
      if (audio && !this.audioUnlocked) {
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        const p = audio.play();
        if (p !== undefined) {
          p.then(() => {
            this.audioUnlocked = true;
          }).catch(() => {});
        }
      }
    } catch (e) {}
  }

  initAudioUnlock() {
    const unlock = () => {
      this.prepareForSpeech();
      this.audioUnlocked = true;
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => {
      document.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  resumeAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioCtx) this.audioCtx = new AudioCtx();
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
      }
    } catch (e) {}
  }

  getApiBaseUrls() {
    const urls = [];
    if (typeof window !== 'undefined' && window.location) {
      if (window.vernacApp && window.vernacApp.apiClient && window.vernacApp.apiClient.baseUrl) {
        urls.push(window.vernacApp.apiClient.baseUrl);
      }
      const origin = window.location.origin;
      if (origin && origin.startsWith('http')) {
        urls.push(`${origin}/api`);
      }
      urls.push('http://127.0.0.1:8000/api');
      urls.push('http://localhost:8000/api');
    } else {
      urls.push('http://127.0.0.1:8000/api');
    }
    return [...new Set(urls)];
  }

  getApiBaseUrl() {
    const urls = this.getApiBaseUrls();
    return urls[0] || 'http://127.0.0.1:8000/api';
  }

  getLanguageDisplayName(shortLang = 'ta') {
    const map = {
      ta: 'Tamil (தமிழ்)',
      hi: 'Hindi (हिन्दी)',
      te: 'Telugu (తెలుగు)',
      kn: 'Kannada (ಕನ್ನಡ)',
      ml: 'Malayalam (മലയാളം)',
      bn: 'Bengali (বাংলা)',
      mr: 'Marathi (मराठी)',
      gu: 'Gujarati (ગુજરાતી)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)',
      or: 'Odia (ଓଡ଼ିଆ)',
      as: 'Assamese (অসমীয়া)',
      en: 'English'
    };
    return map[(shortLang || 'ta').toLowerCase()] || (shortLang || '').toUpperCase();
  }

  initRecognition() {
    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
      } else {
        this.recognition = null;
      }
    } catch (err) {
      console.warn('SpeechRecognition initialization error:', err);
      this.recognition = null;
    }
  }

  initVoiceSynthesis() {
    if ('speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices() || [];
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices() || [];
      };
    }
  }

  findChildFriendlyLadyVoice(langCode = 'ta-IN', customProfile = null) {
    if (!('speechSynthesis' in window)) return null;
    let voices = (this.cachedVoices && this.cachedVoices.length > 0)
      ? this.cachedVoices
      : (window.speechSynthesis.getVoices() || []);
    if (!voices || voices.length === 0) return null;

    const shortLang = (langCode || 'ta').slice(0, 2).toLowerCase();
    const fullLang = (langCode || 'ta-IN').toLowerCase().replace('_', '-');

    // Child-friendly female/lady voice names & markers across Windows, Chrome, Safari, Android
    const ladyKeywords = [
      'female', 'woman', 'girl', 'lady', 'mother', 'teacher',
      'swara', 'heera', 'pallavi', 'kalpana', 'shruti', 'sapna',
      'sobhana', 'neerja', 'tanishaa', 'aarohi', 'dhwani', 'raavi',
      'sunita', 'priya', 'veena', 'sangeeta', 'zira', 'jenny',
      'aria', 'samantha', 'karen', 'victoria', 'moira', 'fiona',
      'hazel', 'susan', 'helena', 'catherine', 'eva', 'katja', 'elsa'
    ];

    const preferredList = (customProfile && customProfile.preferred_voices) || [];

    // Filter voices matching the requested language
    const langVoices = voices.filter(v => {
      const vLang = (v.lang || '').toLowerCase().replace('_', '-');
      return vLang === fullLang || vLang.startsWith(shortLang);
    });

    // 1. Check if any preferred regional female voice name matches
    if (preferredList.length > 0 && langVoices.length > 0) {
      for (const pref of preferredList) {
        const found = langVoices.find(v => (v.name || '').toLowerCase().includes(pref.toLowerCase()));
        if (found) return found;
      }
    }

    // 2. Check for explicit female name keywords in matching language voices
    const femaleMatch = langVoices.find(v => {
      const name = (v.name || '').toLowerCase();
      return ladyKeywords.some(kw => name.includes(kw));
    });
    if (femaleMatch) return femaleMatch;

    // 3. Check for Google or natural high-definition voice for Indic languages
    const naturalVoice = langVoices.find(v => {
      const name = (v.name || '').toLowerCase();
      return name.includes('google') || name.includes('natural') || name.includes('online');
    });
    if (naturalVoice) return naturalVoice;

    // 4. Any voice in target language that is NOT clearly a male voice
    const nonMale = langVoices.find(v => {
      const name = (v.name || '').toLowerCase();
      return !name.includes('male') && !name.includes('david') && !name.includes('george') && !name.includes('mark') && !name.includes('ravi');
    });
    if (nonMale) return nonMale;

    // 5. Fallback to any matching language voice
    if (langVoices.length > 0) return langVoices[0];

    // 6. Global female voice fallback
    const globalFemale = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      return ladyKeywords.some(kw => name.includes(kw));
    });
    return globalFemale || voices[0] || null;
  }

  showSpeechToast(text, voiceName, onManualPlay = null) {
    let toast = document.getElementById('lady-voice-indicator-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'lady-voice-indicator-toast';
      toast.className = 'lady-voice-indicator-toast';
      document.body.appendChild(toast);
    }
    const preview = text.length > 65 ? text.slice(0, 65) + '...' : text;

    let manualPlayHtml = '';
    if (onManualPlay) {
      manualPlayHtml = `<button id="btn-toast-unmute" style="background: #10B981; color: #FFFFFF; border: none; border-radius: 999px; padding: 0.3rem 0.75rem; font-size: 0.75rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);">▶ Tap to Hear</button>`;
    }

    toast.innerHTML = `
      <div class="lady-toast-inner">
        <div class="lady-toast-avatar">👩‍🏫</div>
        <div class="lady-toast-body">
          <div class="lady-toast-title">
            <span>${voiceName || 'Audible Mother Tongue Voice'}</span>
            <span class="lady-toast-live-badge">🔊 SPEAKING</span>
          </div>
          <div class="lady-toast-text">"${preview}"</div>
        </div>
        ${manualPlayHtml}
        <button class="lady-toast-stop" id="btn-stop-lady-toast" title="Stop Speech">✕</button>
      </div>
    `;
    toast.style.display = 'block';

    if (onManualPlay) {
      const unmuteBtn = document.getElementById('btn-toast-unmute');
      if (unmuteBtn) {
        unmuteBtn.onclick = (e) => {
          e.stopPropagation();
          onManualPlay();
        };
      }
    }

    const stopBtn = document.getElementById('btn-stop-lady-toast');
    if (stopBtn) {
      stopBtn.onclick = (e) => {
        e.stopPropagation();
        this.stopSpeaking();
      };
    }
  }

  hideSpeechToast() {
    const toast = document.getElementById('lady-voice-indicator-toast');
    if (toast) {
      toast.style.display = 'none';
    }
  }

  // Guaranteed Audible Text-To-Speech (TTS) Engine
  // 1. Primary: High-fidelity MP3 voice stream from FastAPI backend (/api/speech/tts)
  // 2. Secondary: Direct Google Translate TTS endpoint fallback (No crossOrigin block)
  // 3. Tertiary: Browser Web Speech API (with verified voice matching)
  speak(text, langCode = 'ta-IN', onEndCallback = null, customProfile = null) {
    this.stopSpeaking();

    // Clean text: strip markdown syntax, links, and emojis so pronunciation is clean and crisp
    const cleanText = (text || '')
      .replace(/[\*\#\_`~]/g, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const fullLang = (langCode || 'ta-IN').toLowerCase().replace('_', '-');
    const shortLang = fullLang.split('-')[0];
    const langDisplay = this.getLanguageDisplayName(shortLang);

    this.isSpeaking = true;
    this.resumeAudioContext();
    this.showSpeechToast(cleanText, `${langDisplay} • Lady Voice`);

    // Map regional languages for TTS providers
    const gttsLangMap = {
      ta: 'ta', hi: 'hi', te: 'te', kn: 'kn', ml: 'ml', bn: 'bn',
      mr: 'mr', gu: 'gu', pa: 'pa', ur: 'ur', en: 'en',
      or: 'hi', as: 'bn'
    };
    const ttsLang = gttsLangMap[shortLang] || shortLang;

    // Prepare candidate audio stream endpoints
    const candidates = [];
    const baseUrls = this.getApiBaseUrls();
    for (const b of baseUrls) {
      candidates.push(`${b}/speech/tts?text=${encodeURIComponent(cleanText.slice(0, 600))}&lang=${encodeURIComponent(shortLang)}`);
    }
    // Direct Google Translate TTS endpoint (client=tw-ob, no CORS required when crossOrigin is not set)
    candidates.push(`https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(ttsLang)}&client=tw-ob&q=${encodeURIComponent(cleanText.slice(0, 250))}`);

    let candidateIndex = 0;
    let isFinished = false;

    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      this.isSpeaking = false;
      this.currentAudio = null;
      this.hideSpeechToast();
      this.stopWaveform();
      if (onEndCallback) onEndCallback();
    };

    const fallbackToSpeechSynthesis = () => {
      if (!('speechSynthesis' in window)) {
        finish();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = fullLang;
        utterance.pitch = (customProfile && customProfile.pitch) ? customProfile.pitch : 1.24;
        utterance.rate = (customProfile && customProfile.rate) ? customProfile.rate : 0.88;
        utterance.volume = 1.0;

        const ladyVoice = this.findChildFriendlyLadyVoice(fullLang, customProfile);
        if (ladyVoice) {
          utterance.voice = ladyVoice;
        }

        utterance.onend = finish;
        utterance.onerror = (err) => {
          console.warn('[SpeechEngine] SpeechSynthesis error:', err);
          finish();
        };

        const watchdog = setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 5000);

        const origOnEnd = utterance.onend;
        utterance.onend = () => {
          clearTimeout(watchdog);
          origOnEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[SpeechEngine] SpeechSynthesis fallback failed:', err);
        finish();
      }
    };

    const tryNextCandidate = () => {
      if (candidateIndex >= candidates.length) {
        fallbackToSpeechSynthesis();
        return;
      }

      const url = candidates[candidateIndex++];
      const audio = this.ensureAudioElement() || new Audio();
      this.currentAudio = audio;
      
      // CRITICAL: Do NOT set audio.crossOrigin to avoid CORS blocks on Google TTS
      try {
        delete audio.crossOrigin;
        audio.removeAttribute('crossorigin');
      } catch (e) {}

      audio.preload = 'auto';
      audio.volume = 1.0;
      audio.src = url;

      audio.onended = () => {
        if (this.currentAudio === audio) {
          finish();
        }
      };

      audio.onerror = (err) => {
        console.warn(`[SpeechEngine] Audio candidate ${candidateIndex - 1} failed, trying next:`, err);
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          tryNextCandidate();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.resumeAudioContext();
        }).catch(err => {
          console.warn(`[SpeechEngine] audio.play() rejected on candidate ${candidateIndex - 1}:`, err);
          if (err && err.name === 'NotAllowedError') {
            // Autoplay policy prevented playback: immediately try Web Speech API
            console.log('[SpeechEngine] Autoplay restriction detected, trying Web Speech API...');
            fallbackToSpeechSynthesis();
            this.showSpeechToast(cleanText, `${langDisplay} • Tap to Hear`, () => {
              this.prepareForSpeech();
              audio.play().then(() => {
                this.showSpeechToast(cleanText, `${langDisplay} • Lady Voice`);
              }).catch(console.warn);
            });
          } else {
            if (this.currentAudio === audio) {
              this.currentAudio = null;
              tryNextCandidate();
            }
          }
        });
      }
    };

    tryNextCandidate();
  }

  stopSpeaking() {
    this.isSpeaking = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.onended = null;
        this.audioElement.onerror = null;
        this.audioElement.removeAttribute('src');
      } catch (e) {}
    }
    if (this.currentAudio && this.currentAudio !== this.audioElement) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.removeAttribute('src');
      } catch (e) {}
    }
    this.currentAudio = null;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.hideSpeechToast();
    this.stopWaveform();
  }

  // Language Identification (LID) Heuristic & Script Analysis
  detectLanguage(text) {
    if (!text || typeof text !== 'string') {
      return { 
        code: 'en', 
        name: 'English', 
        nativeName: 'English', 
        flag: '🌐', 
        speechCode: 'en-IN', 
        confidence: 0.95,
        scriptName: 'Latin Script',
        welcomeGreeting: 'Welcome! What would you like to learn today?',
        sampleQuestion: 'Why does rain fall from the sky?'
      };
    }

    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();

    // 1. Spoken language name detection (e.g. "My mother tongue is Tamil", "Hindi", "I speak Telugu")
    const langNames = [
      { code: 'ta', patterns: ['tamil', 'thamizh', 'tamizh', 'தமிழ்', 'தாய்மொழி', 'வணக்கம்', 'vanakkam'] },
      { code: 'hi', patterns: ['hindi', 'hindee', 'हिन्दी', 'हिंदी', 'मातृभाषा', 'नमस्ते', 'namaste', 'namaskar'] },
      { code: 'te', patterns: ['telugu', 'తెలుగు', 'మాతృభాష', 'నమస్కారం', 'namaskaram'] },
      { code: 'kn', patterns: ['kannada', 'ಕನ್ನಡ', 'ಮಾತೃಭಾಷೆ', 'ನಮಸ್ಕಾರ', 'namaskara'] },
      { code: 'ml', patterns: ['malayalam', 'മലയാളം', 'മാതൃഭാഷ', 'നമസ്കാരം', 'namaskaram'] },
      { code: 'bn', patterns: ['bengali', 'bangla', 'বাংলা', 'মাতৃভাষা', 'নমস্কার', 'nomoshkar'] },
      { code: 'mr', patterns: ['marathi', 'मराठी', 'मातृभाषा', 'नमस्कार'] },
      { code: 'gu', patterns: ['gujarati', 'ગુજરાતી', 'માતૃભાષા', 'નમસ્તે', 'kem cho'] },
      { code: 'pa', patterns: ['punjabi', 'ਪੰਜਾਬੀ', 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'sat sri akaal'] },
      { code: 'or', patterns: ['odia', 'oriya', 'ଓଡ଼ିଆ', 'ନମସ୍କାର'] },
      { code: 'as', patterns: ['assamese', 'অসমীয়া', 'নমস্কাৰ'] },
      { code: 'ur', patterns: ['urdu', 'اردو', 'السلام عليكم', 'adab'] },
      { code: 'es', patterns: ['spanish', 'español', 'espanol', 'hola'] },
      { code: 'fr', patterns: ['french', 'français', 'francais', 'bonjour'] },
      { code: 'de', patterns: ['german', 'deutsch', 'guten tag'] },
      { code: 'ja', patterns: ['japanese', 'nihongo', '日本語', 'konnichiwa'] },
      { code: 'zh', patterns: ['chinese', 'mandarin', 'zhongwen', '中文', 'ni hao'] },
      { code: 'ar', patterns: ['arabic', 'arabi', 'العربية', 'marhaban'] },
      { code: 'en', patterns: ['english', 'inglish', 'angrezi', 'hello', 'hi', 'hey'] }
    ];

    for (const item of langNames) {
      for (const pat of item.patterns) {
        if (lower.includes(pat) || trimmed.includes(pat)) {
          return this.getLanguageMetadata(item.code, 0.99, `${pat} (Spoken Language Name)`);
        }
      }
    }

    // 2. Unicode script-based character frequency
    const scriptCounts = {
      ta: (trimmed.match(/[\u0B80-\u0BFF]/g) || []).length, // Tamil
      te: (trimmed.match(/[\u0C00-\u0C7F]/g) || []).length, // Telugu
      kn: (trimmed.match(/[\u0C80-\u0CFF]/g) || []).length, // Kannada
      ml: (trimmed.match(/[\u0D00-\u0D7F]/g) || []).length, // Malayalam
      hi: (trimmed.match(/[\u0900-\u097F]/g) || []).length, // Devanagari (Hindi, Marathi, Sanskrit)
      bn: (trimmed.match(/[\u0980-\u09FF]/g) || []).length, // Bengali / Assamese
      gu: (trimmed.match(/[\u0A80-\u0AFF]/g) || []).length, // Gujarati
      pa: (trimmed.match(/[\u0A00-\u0A7F]/g) || []).length, // Gurmukhi (Punjabi)
      or: (trimmed.match(/[\u0B00-\u0B7F]/g) || []).length, // Odia
      ar: (trimmed.match(/[\u0600-\u06FF]/g) || []).length, // Arabic / Urdu
      ja: (trimmed.match(/[\u3040-\u30FF]/g) || []).length, // Japanese Hiragana/Katakana
      zh: (trimmed.match(/[\u4E00-\u9FFF]/g) || []).length, // Chinese Hanzi
      ru: (trimmed.match(/[\u0400-\u04FF]/g) || []).length, // Cyrillic
    };

    let bestScriptCode = null;
    let maxCount = 0;
    for (const [code, count] of Object.entries(scriptCounts)) {
      if (count > maxCount) {
        maxCount = count;
        bestScriptCode = code;
      }
    }

    if (maxCount > 0 && bestScriptCode) {
      const scriptNames = {
        ta: 'Tamil Native Script',
        te: 'Telugu Native Script',
        kn: 'Kannada Native Script',
        ml: 'Malayalam Native Script',
        hi: 'Devanagari Script (हिन्दी)',
        bn: 'Bengali Native Script',
        gu: 'Gujarati Native Script',
        pa: 'Gurmukhi Native Script',
        or: 'Odia Native Script',
        ar: 'Arabic / Urdu Script',
        ja: 'Japanese Kana/Kanji',
        zh: 'Chinese Hanzi Script',
        ru: 'Cyrillic Script'
      };
      return this.getLanguageMetadata(bestScriptCode, 0.99, scriptNames[bestScriptCode] || 'Native Script');
    }

    // 3. Latin / Romanized vocabulary detection
    let detectedCode = 'en';
    let confidence = 0.98;
    let scriptDetail = 'Latin Alphabet';

    if (/\b(vanakkam|thanni|mazhai|sooriyan|thavarangal|eppadi|yen|amma|appa|nandri|enathu|enakku|ungal|vanga)\b/i.test(lower)) {
      detectedCode = 'ta';
      confidence = 0.97;
      scriptDetail = 'Tamil (Romanized / Tanglish)';
    } else if (/\b(namaste|dhoop|pani|paudhe|suraj|kaise|kyun|kya|roshni|dhanyavaad|shikshak|aaj|mujhe|tumhara|accha|bahut)\b/i.test(lower)) {
      detectedCode = 'hi';
      confidence = 0.97;
      scriptDetail = 'Hindi (Romanized / Hinglish)';
    } else if (/\b(namaskara|neeru|surya|gidagalu|dhanyavadagalu|hege|yaake|nanage|nimmanna|channagiddeeni)\b/i.test(lower)) {
      detectedCode = 'kn';
      confidence = 0.97;
      scriptDetail = 'Kannada (Romanized)';
    } else if (/\b(namaskaram|vellam|sooryan|nanni|enthukondu|engane|enikku|padikkanam|nalla)\b/i.test(lower)) {
      detectedCode = 'ml';
      confidence = 0.97;
      scriptDetail = 'Malayalam (Romanized / Manglish)';
    } else if (/\b(namaskaram|neellu|sooryudu|dhanyavadalu|ela|enduku|naaku|nerchukovali|bagunnara)\b/i.test(lower)) {
      detectedCode = 'te';
      confidence = 0.97;
      scriptDetail = 'Telugu (Romanized)';
    } else if (/\b(nomoshkar|kemon|bhalo|aami|shunte|shikhte|bangla|jol|roddur)\b/i.test(lower)) {
      detectedCode = 'bn';
      confidence = 0.96;
      scriptDetail = 'Bengali (Romanized)';
    } else if (/\b(namaskar|kasa|aahes|paani|soorya|shikayche|majh|tujh)\b/i.test(lower)) {
      detectedCode = 'mr';
      confidence = 0.96;
      scriptDetail = 'Marathi (Romanized)';
    } else if (/\b(kem cho|maja ma|pani|soorya|aavjo|tamaru|mane)\b/i.test(lower)) {
      detectedCode = 'gu';
      confidence = 0.96;
      scriptDetail = 'Gujarati (Romanized)';
    } else if (/\b(sat sri akaal|ki haal|changa|paani|mera|tussi)\b/i.test(lower)) {
      detectedCode = 'pa';
      confidence = 0.96;
      scriptDetail = 'Punjabi (Romanized)';
    } else if (/\b(hola|buenos|dias|como|estas|gracias|amigo|lengua|madre|espanol)\b/i.test(lower)) {
      detectedCode = 'es';
      confidence = 0.96;
      scriptDetail = 'Spanish (Español)';
    } else if (/\b(bonjour|salut|comment|allez|vous|merci|langue|maternelle|francais)\b/i.test(lower)) {
      detectedCode = 'fr';
      confidence = 0.96;
      scriptDetail = 'French (Français)';
    } else if (/\b(guten|tag|wie|geht|danke|deutsch|muttersprache)\b/i.test(lower)) {
      detectedCode = 'de';
      confidence = 0.96;
      scriptDetail = 'German (Deutsch)';
    }

    return this.getLanguageMetadata(detectedCode, confidence, scriptDetail);
  }

  getLanguageMetadata(code, confidence = 0.98, scriptName = 'Native Script') {
    const langCatalog = {
      ta: { 
        code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN',
        welcomeGreeting: 'வணக்கம்! உங்கள் தாய்மொழி தமிழ் தேர்ந்தெடுக்கப்பட்டது. என்னிடம் எதையும் கேளுங்கள்!',
        sampleQuestion: 'வானத்திலிருந்து மழை ஏன் பெய்கிறது?'
      },
      hi: { 
        code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN',
        welcomeGreeting: 'नमस्ते! आपकी मातृभाषा हिन्दी चुनी गई है। मुझसे कोई भी सवाल पूछिए!',
        sampleQuestion: 'आसमान से बारिश क्यों गिरती है?'
      },
      te: { 
        code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN',
        welcomeGreeting: 'నమస్కారం! మీ మాతృభాష తెలుగు ఎంపిక చేయబడింది. నన్ను ఏదైనా ప్రశ్న అడగండి!',
        sampleQuestion: 'ఆకాశం నుండి వర్షం ఎందుకు కురుస్తుంది?'
      },
      kn: { 
        code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN',
        welcomeGreeting: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಮಾತೃಭಾಷೆ ಕನ್ನಡ ಆಯ್ಕೆಯಾಗಿದೆ. ನನ್ನನ್ನು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ!',
        sampleQuestion: 'ಆಕಾಶದಿಂದ ಮಳೆ ಏಕೆ ಬೀಳುತ್ತದೆ?'
      },
      ml: { 
        code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechCode: 'ml-IN',
        welcomeGreeting: 'നമസ്കാരം! നിങ്ങളുടെ മാതൃഭാഷ മലയാളം തിരഞ്ഞെടുക്കപ്പെട്ടു. എന്നോട് എന്തെങ്കിലും ചോദിക്കൂ!',
        sampleQuestion: 'ആകാശത്തുനിന്ന് മഴ പെയ്യുന്നത് എന്തുകൊണ്ട്?'
      },
      bn: { 
        code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speechCode: 'bn-IN',
        welcomeGreeting: 'নমস্কার! আপনার মাতৃভাষা বাংলা নির্বাচিত হয়েছে। আমাকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন!',
        sampleQuestion: 'আকাশ থেকে বৃষ্টি কেন পড়ে?'
      },
      mr: { 
        code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN',
        welcomeGreeting: 'नमस्कार! तुमची मातृभाषा मराठी निवडली गेली आहे. मला कोणताही प्रश्न विचारा!',
        sampleQuestion: 'आकाशातून पाऊस का पडतो?'
      },
      gu: { 
        code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speechCode: 'gu-IN',
        welcomeGreeting: 'નમસ્તે! તમારી માતૃભાષા ગુજરાતી પસંદ કરવામાં આવી છે. મને કોઈપણ પ્રશ્ન પૂછો!',
        sampleQuestion: 'આકાશમાંથી વરસાદ કેમ પડે છે?'
      },
      pa: { 
        code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speechCode: 'pa-IN',
        welcomeGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੀ ਮਾਤ-ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਚੁਣੀ ਗਈ ਹੈ। ਮੈਨੂੰ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ!',
        sampleQuestion: 'ਅਸਮਾਨ ਤੋਂ ਮੀਂਹ ਕਿਉਂ ਪੈਂਦਾ ਹੈ?'
      },
      or: { 
        code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', speechCode: 'or-IN',
        welcomeGreeting: 'ନମସ୍କାର! ଆପଣଙ୍କ ମାତୃଭାଷା ଓଡ଼ିଆ ଚୟନ କରାଯାଇଛି। ମୋତେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ!',
        sampleQuestion: 'ଆକାଶରୁ ବର୍ଷା କାହିଁକି ହୁଏ?'
      },
      as: { 
        code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', speechCode: 'as-IN',
        welcomeGreeting: 'নমস্কাৰ! আপোনাৰ মাতৃভাষা অসমীয়া নিৰ্বাচিত হৈছে। মোক যিকোনো প্ৰশ্ন সোধক!',
        sampleQuestion: 'আকাশৰ পৰা বৰষুণ কিয় পৰে?'
      },
      es: { 
        code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES',
        welcomeGreeting: '¡Hola! Tu lengua materna es el español. ¡Pregúntame cualquier cosa sobre ciencia!',
        sampleQuestion: '¿Por qué llueve desde el cielo?'
      },
      fr: { 
        code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR',
        welcomeGreeting: 'Bonjour! Votre langue maternelle est le français. Posez-moi une question!',
        sampleQuestion: 'Pourquoi la pluie tombe-t-elle du ciel?'
      },
      de: { 
        code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE',
        welcomeGreeting: 'Guten Tag! Ihre Muttersprache ist Deutsch. Stellen Sie mir eine Frage!',
        sampleQuestion: 'Warum regnet es aus dem Himmel?'
      },
      ja: { 
        code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP',
        welcomeGreeting: 'こんにちは！あなたの母国語は日本語に設定されました。何でも質問してください！',
        sampleQuestion: 'なぜ空から雨が降るのですか？'
      },
      zh: { 
        code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', speechCode: 'zh-CN',
        welcomeGreeting: '你好！你的母语已设置为中文。欢迎向我提问任何科学或数学问题！',
        sampleQuestion: '为什么天上会下雨？'
      },
      ar: { 
        code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA',
        welcomeGreeting: 'مرحباً! تم تحديد لغتك الأم كالعربية. اسألني أي سؤال في العلوم أو الرياضيات!',
        sampleQuestion: 'لماذا يسقط المطر من السماء؟'
      },
      en: { 
        code: 'en', name: 'English', nativeName: 'English', flag: '🌐', speechCode: 'en-IN',
        welcomeGreeting: 'Hello and welcome! Your language is set to English. Ask Mitra any question!',
        sampleQuestion: 'Why does rain fall from the sky?'
      }
    };

    const base = langCatalog[code] || langCatalog.en;
    return {
      ...base,
      confidence,
      scriptName
    };
  }

  // Speech-To-Text (STT) with auto language identification
  startListening(langCode = 'auto', onResultCallback, onEndCallback, simulatedText = null, onErrorCallback = null) {
    if (this.isListening) {
      this.stopListening();
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('Speech recognition not supported in this browser.');
      this.isListening = false;
      this.stopWaveform();
      if (onErrorCallback) {
        onErrorCallback('not-supported');
      } else if (simulatedText && onResultCallback) {
        this.simulateTypingTranscript(simulatedText, onResultCallback, onEndCallback);
      } else if (onEndCallback) {
        onEndCallback();
      }
      return;
    }

    try {
      // Re-instantiate fresh SpeechRecognition instance each session to avoid browser state corruption
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = (!langCode || langCode === 'auto') ? (navigator.language || 'en-IN') : langCode;

      this.isListening = true;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const detected = this.detectLanguage(transcript);
        if (onResultCallback) onResultCallback(transcript, false, detected);
      };

      this.recognition.onerror = (e) => {
        const errCode = (e && e.error) ? e.error : 'unknown';
        console.warn('Speech recognition error event:', errCode);
        this.isListening = false;
        this.stopWaveform();

        if (onErrorCallback) {
          onErrorCallback(errCode);
        } else if (simulatedText && onResultCallback && (errCode === 'not-allowed' || errCode === 'service-not-allowed')) {
          this.simulateTypingTranscript(simulatedText, onResultCallback, onEndCallback);
        } else if (onEndCallback) {
          onEndCallback();
        }
      };

      this.recognition.onspeechend = () => {
        try {
          if (this.recognition) this.recognition.stop();
        } catch (err) {}
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.stopWaveform();
        if (onEndCallback) onEndCallback();
      };

      this.recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      this.isListening = false;
      this.stopWaveform();
      if (onErrorCallback) {
        onErrorCallback(err.name || 'start-failed');
      } else if (simulatedText && onResultCallback) {
        this.simulateTypingTranscript(simulatedText, onResultCallback, onEndCallback);
      } else if (onEndCallback) {
        onEndCallback();
      }
    }
  }

  simulateTypingTranscript(text, onResultCallback, onEndCallback) {
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx += 2;
      const partial = text.slice(0, currentIdx);
      const isDone = currentIdx >= text.length;
      const detected = this.detectLanguage(partial);
      if (onResultCallback) onResultCallback(partial, isDone, detected);
      if (isDone) {
        clearInterval(interval);
        this.stopListening();
        if (onEndCallback) onEndCallback();
      }
    }, 45);
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.stop();
      } catch (e) {}
    }
    this.stopWaveform();
  }

  // Waveform visualization on canvas
  startWaveform(canvasId, strokeColor = '#00C9A7') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.activeWaveCanvas = canvas;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      const width = canvas.width = canvas.offsetWidth * 2 || 300;
      const height = canvas.height = canvas.offsetHeight * 2 || 80;
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 4;
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();

      const centerY = height / 2;
      for (let x = 0; x < width; x += 4) {
        const angle = (x / width) * Math.PI * 4 + phase;
        const amplitude = Math.sin(angle) * (height / 3.5) * Math.sin(x / width * Math.PI);
        const y = centerY + amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary wave
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath();
      for (let x = 0; x < width; x += 4) {
        const angle = (x / width) * Math.PI * 5 - phase * 1.5;
        const amplitude = Math.cos(angle) * (height / 4) * Math.sin(x / width * Math.PI);
        const y = centerY + amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.12;
      this.animId = requestAnimationFrame(render);
    };

    if (this.animId) cancelAnimationFrame(this.animId);
    render();
  }

  stopWaveform() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.activeWaveCanvas) {
      const ctx = this.activeWaveCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.activeWaveCanvas.width, this.activeWaveCanvas.height);
      this.activeWaveCanvas = null;
    }
  }

  playPopSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  playCelebrationSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.16);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.16);
      });
    } catch (e) {}
  }
}

export const speechEngine = new SpeechEngine();
