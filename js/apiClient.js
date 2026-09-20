// Mission Agent Mother-Tongue Backend API Client
// Connects the frontend to the Python FastAPI backend service
// Gracefully falls back to local simulation when network is slow or offline.

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export class VernacApiClient {
  constructor() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isPort8000 = window.location.port === '8000';

    let customBackend = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      customBackend = urlParams.get('backend') || (typeof localStorage !== 'undefined' && localStorage.getItem('vernac_backend_url')) || (typeof window !== 'undefined' && window.VERNAC_BACKEND_URL);
    } catch (e) {}

    if (customBackend) {
      const clean = customBackend.replace(/\/+$/, '');
      this.baseUrl = clean.endsWith('/api') ? clean : `${clean}/api`;
      this.healthUrl = clean.endsWith('/api') ? `${clean.slice(0, -4)}/health` : `${clean}/health`;
    } else if (isPort8000 || (!isLocalhost && window.location.origin.startsWith('http'))) {
      this.baseUrl = `${window.location.origin}/api`;
      this.healthUrl = `${window.location.origin}/health`;
    } else {
      this.baseUrl = 'http://127.0.0.1:8000/api';
      this.healthUrl = 'http://127.0.0.1:8000/health';
    }

    this.isBackendOnline = false;
    this.pollInterval = null;
    this.checkHealth();
    this.startHealthPolling();
  }

  async checkHealth() {
    const candidates = [];
    if (this.healthUrl) candidates.push(this.healthUrl);
    if (window.location.origin && window.location.origin.startsWith('http')) {
      const originHealth = `${window.location.origin}/health`;
      if (!candidates.includes(originHealth)) candidates.push(originHealth);
    }
    const ipHealth = 'http://127.0.0.1:8000/health';
    const localHealth = 'http://localhost:8000/health';
    if (!candidates.includes(ipHealth)) candidates.push(ipHealth);
    if (!candidates.includes(localHealth)) candidates.push(localHealth);

    for (const url of candidates) {
      try {
        const res = await fetchWithTimeout(url, {}, 3500);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'healthy') {
            this.isBackendOnline = true;
            try {
              const parsed = new URL(url);
              this.baseUrl = `${parsed.origin}/api`;
              this.healthUrl = `${parsed.origin}/health`;
            } catch (_) {}
            this._updateStatusBadge(true, data);
            return true;
          }
        }
      } catch (e) {
        // Probe next candidate
      }
    }
    this.isBackendOnline = false;
    this._updateStatusBadge(false);
    return false;
  }

  startHealthPolling(intervalMs = 15000) {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => this.checkHealth(), intervalMs);
  }

  _updateStatusBadge(online, healthData = null) {
    const badge = document.getElementById('backend-status-indicator');
    if (badge) {
      if (online) {
        badge.innerHTML = `<span class="indicator-dot online"></span> ⚡ AI Backend Online`;
        badge.className = 'status-pill online';
        badge.title = `FastAPI Backend connected (${healthData?.service || 'Mission Agent Mother-Tongue'})`;
      } else {
        badge.innerHTML = `<span class="indicator-dot offline"></span> 💻 Offline Fallback`;
        badge.className = 'status-pill offline';
        badge.title = 'Backend connecting / offline - Local pedagogy active';
      }
    }
  }

  // 1. Languages
  async getLanguages() {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/languages`, {}, 6000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Languages fetch fallback:', e.message);
    }
    return null;
  }

  // 1b. Language Identification (Auto-detect other person's language)
  async detectLanguage(text) {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/speech/detect-language`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }, 7000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Language detection fallback:', e.message);
    }
    return null;
  }

  // 2. Translation
  async translate(text, sourceLang = 'en', targetLang = 'ta', grade = 'Class 3') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          source_lang: sourceLang,
          target_lang: targetLang,
          generate_explanation: true,
          student_grade: grade
        })
      }, 10000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Translation fallback:', e.message);
    }
    return null;
  }

  // 3. Pedagogy Explanation
  async explainPedagogy(conceptOrQuestion, targetLang = 'ta', grade = 'Class 4', culturalRegion = 'South India') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/pedagogy/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept_or_question: conceptOrQuestion,
          target_lang: targetLang,
          grade,
          cultural_region: culturalRegion
        })
      }, 10000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Pedagogy explain fallback:', e.message);
    }
    return null;
  }

  // 4. Mitra AI Tutor Chat
  async chatTutor(message, targetLang = 'ta', grade = 'Class 3', history = [], topic = 'Science') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          target_lang: targetLang,
          grade,
          history,
          current_topic: topic,
          student_name: 'Arun'
        })
      }, 10000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Tutor chat fallback:', e.message);
    }
    return null;
  }

  // 5. Mitra Scaffolding Hint
  async getTutorHint(topic, question, studentAttempt = '', targetLang = 'ta', hintLevel = 1) {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/tutor/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          question,
          student_attempt: studentAttempt,
          target_lang: targetLang,
          hint_level: hintLevel
        })
      }, 10000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Hint fallback:', e.message);
    }
    return null;
  }

  // 6. Teacher Lesson Generation
  async generateLesson(optionsOrTopic, grade = 'Class 4', language = 'Tamil', difficulty = 'Beginner', contextNotes = '') {
    let payload = {};
    if (typeof optionsOrTopic === 'object' && optionsOrTopic !== null) {
      payload = {
        topic: optionsOrTopic.topic || 'The Water Cycle',
        grade: optionsOrTopic.grade || 'Class 4',
        subject: optionsOrTopic.subject || 'Environmental Studies (EVS)',
        standard_level: optionsOrTopic.standardLevel || 'Preparatory Stage (Class 3-5)',
        language: optionsOrTopic.language || 'Tamil',
        difficulty: optionsOrTopic.difficulty || 'Beginner',
        pedagogical_level: optionsOrTopic.pedagogicalLevel || 'Level 1: Foundational & Story-first',
        duration: optionsOrTopic.duration || '40 Minutes',
        context_notes: optionsOrTopic.contextNotes || ''
      };
    } else {
      payload = {
        topic: optionsOrTopic || 'The Water Cycle',
        grade: grade || 'Class 4',
        subject: 'Environmental Studies (EVS)',
        standard_level: `${grade} Stage`,
        language: language || 'Tamil',
        difficulty: difficulty || 'Beginner',
        pedagogical_level: 'Level 1: Foundational & Story-first',
        duration: '40 Minutes',
        context_notes: contextNotes || ''
      };
    }

    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/lessons/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 15000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Lesson generation fallback:', e.message);
    }
    return null;
  }

  // 6b. AI Topic Suggestions & Ideator
  async suggestTopics(grade = 'Class 4', subject = 'Environmental Studies (EVS)', standardLevel = 'Preparatory Stage', language = 'Tamil') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/lessons/suggest-topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          standard_level: standardLevel,
          language
        })
      }, 10000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Suggest topics fallback:', e.message);
    }
    return null;
  }

  // 6c. Delete Saved Lesson
  async deleteLesson(lessonId) {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'DELETE'
      }, 8000);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Delete lesson fallback:', e.message);
    }
    return null;
  }

  // 7. Interactive Quiz Submission
  async submitQuiz(quizId, answers, language = 'ta', studentId = 'student_001') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quizId,
          student_id: studentId,
          answers,
          language
        })
      }, 8000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Quiz submission fallback:', e.message);
    }
    return null;
  }

  // 8. Dashboards
  async getStudentDashboard(studentId = 'student_001') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/student/dashboard?student_id=${studentId}`, {}, 8000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Student dashboard fallback:', e.message);
    }
    return null;
  }

  async getTeacherCohort() {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/teacher/cohort-summary`, {}, 8000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Teacher cohort fallback:', e.message);
    }
    return null;
  }

  async getParentInsights(studentId = 'student_001') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/parent/summary?student_id=${studentId}`, {}, 8000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Parent insights fallback:', e.message);
    }
    return null;
  }

  // 9. 3-Minute Hackathon Demo Flow
  async runHackathonDemo(language = 'ta', question = 'Why does rain fall from the sky?', studentName = 'Arun', grade = 'Class 4') {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/demo/hackathon-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          question,
          student_name: studentName,
          grade
        })
      }, 10000);
      if (res.ok) {
        this.isBackendOnline = true;
        this._updateStatusBadge(true);
        return await res.json();
      }
    } catch (e) {
      console.warn('[Mission Agent API] Hackathon flow fallback:', e.message);
    }
    return null;
  }

  // 10. Live Secured Host Information & Cloudflare Tunnel
  async getHostInfo() {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/host-info`, {}, 5000);
      if (res.ok) return await res.json();
    } catch (e) {
      // Offline fallback
    }
    return {
      service: 'Mission Agent Mother-Tongue',
      is_secured_host: window.location.protocol === 'https:',
      host_url: window.location.origin,
      protocol: window.location.protocol === 'https:' ? 'HTTPS (TLS 1.3)' : 'HTTP',
      status: 'active',
      microphone_ready: true
    };
  }
}

export const apiClient = new VernacApiClient();
