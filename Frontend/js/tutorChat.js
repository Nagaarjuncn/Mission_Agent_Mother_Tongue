// Mitra AI Vernacular Tutor Controller
import { TUTOR_PROFILES, SUPPORTED_LANGUAGES } from './mockData.js';
import { pedagogyEngine } from './pedagogyEngine.js';
import { speechEngine } from './speechEngine.js';
import { quizManager } from './interactiveQuiz.js';
import { apiClient } from './apiClient.js';

export class TutorChat {
  constructor() {
    this.currentLanguage = 'ta';
    this.messages = [];
    this.chatContainer = null;
    this.mascotMood = 'greeting'; // greeting, thinking, happy, cheering
    this.mascotEl = null;
    this.currentTopic = 'General Science';
  }

  init(containerId, mascotId) {
    this.chatContainer = document.getElementById(containerId);
    this.mascotEl = document.getElementById(mascotId);
    this.resetConversation();
  }

  setLanguage(langCode) {
    this.currentLanguage = langCode;
    this.resetConversation();
  }

  setMood(mood) {
    this.mascotMood = mood;
    if (!this.mascotEl) return;
    this.mascotEl.className = `mascot-avatar mood-${mood}`;
    
    const moodBadge = this.mascotEl.querySelector('.mascot-mood-badge');
    if (moodBadge) {
      if (mood === 'greeting') moodBadge.textContent = '👋';
      if (mood === 'thinking') moodBadge.textContent = '💭';
      if (mood === 'happy') moodBadge.textContent = '✨';
      if (mood === 'cheering') moodBadge.textContent = '🎉';
    }
  }

  resetConversation() {
    if (!this.chatContainer) return;
    this.messages = [];
    this.chatContainer.innerHTML = '';
    const profile = TUTOR_PROFILES[this.currentLanguage] || TUTOR_PROFILES['ta'];

    this.addTutorMessage(profile.greeting, true);
    this.setMood('greeting');
  }

  addStudentMessage(text, extraMeta = {}) {
    speechEngine.prepareForSpeech();
    const msgId = 'student-msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const msg = {
      id: msgId,
      sender: 'student',
      text,
      convertedText: extraMeta.convertedText || null,
      inputWasConverted: extraMeta.inputWasConverted || false,
      sourceLang: extraMeta.sourceLang || null,
      sourceLangName: extraMeta.sourceLangName || null,
      timestamp: new Date()
    };
    this.messages.push(msg);
    this.renderMessage(msg);
    speechEngine.playPopSound();

    this.setMood('thinking');

    // Show thinking indicator in chat
    const typingRow = document.createElement('div');
    typingRow.id = 'tutor-typing-indicator';
    typingRow.className = 'chat-msg-row row-tutor';
    typingRow.innerHTML = `
      <div class="tutor-bubble-avatar">🦉</div>
      <div class="chat-bubble bubble-tutor">
        <div class="bubble-text" style="color: var(--text-muted); font-style: italic;">
          Mitra is converting & thinking in your mother tongue... 💭
        </div>
      </div>
    `;
    this.chatContainer.appendChild(typingRow);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

    setTimeout(async () => {
      await this.handleAIResponse(text, msg);
      const indicator = document.getElementById('tutor-typing-indicator');
      if (indicator) indicator.remove();
    }, 450);
  }

  addTutorMessage(text, isInitial = false, quizData = null, extraMeta = {}) {
    const msg = { sender: 'tutor', text, quiz: quizData, timestamp: new Date(), ...extraMeta };
    this.messages.push(msg);
    this.renderMessage(msg);

    if (!isInitial) {
      this.setMood(extraMeta.emotion || 'happy');
    }
  }

  async handleAIResponse(userInput, studentMsg = null) {
    // 1. Try Live FastAPI Backend First
    try {
      const chatHistory = this.messages.slice(-6).map(m => ({
        role: m.sender === 'student' ? 'user' : 'assistant',
        content: m.convertedText || m.text
      }));

      const res = await apiClient.chatTutor(userInput, this.currentLanguage, 'Class 3', chatHistory, this.currentTopic);
      if (res && res.reply_text) {
        // Update student message with conversion information
        if (studentMsg) {
          if (res.input_was_converted && res.translated_input_text) {
            studentMsg.inputWasConverted = true;
            studentMsg.convertedText = res.translated_input_text;
            studentMsg.sourceLang = res.detected_source_lang;
            studentMsg.sourceLangName = res.source_lang_name;
          } else {
            studentMsg.inputWasConverted = false;
          }
          this.updateMessageElement(studentMsg);
        }

        this.addTutorMessage(res.reply_text, false, null, {
          speechCode: res.reply_speech_code,
          misconception: res.detected_misconception,
          hintAvailable: res.hint_available,
          hintText: res.hint_text,
          emotion: res.emotion,
          quickReplies: res.suggested_quick_replies,
          isBackendLive: true
        });

        if (res.stars_awarded > 0) {
          quizManager.awardStars(res.stars_awarded, 'Great question to Mitra!');
        }

        speechEngine.speak(res.reply_text, res.reply_speech_code || 'ta-IN');
        return;
      }
    } catch (e) {
      console.warn('[Mission Agent] Tutor backend chat fallback:', e);
    }

    // 2. Local Fallback Pedagogy Engine
    const concept = pedagogyEngine.explainConcept(userInput, this.currentLanguage);
    if (studentMsg) {
      if (concept.literalTranslation && concept.literalTranslation.trim() !== userInput.trim()) {
        studentMsg.inputWasConverted = true;
        studentMsg.convertedText = concept.literalTranslation;
        studentMsg.sourceLangName = 'Original';
      }
      this.updateMessageElement(studentMsg);
    }

    const metaphorPrefixes = {
      ta: 'உள்ளூர் உதாரணம் (Local Metaphor):',
      hi: 'स्थानीय उदाहरण (Local Metaphor):',
      te: 'స్థానిక ఉదాహరణ (Local Metaphor):',
      kn: 'ಸ್ಥಳೀಯ ಉದಾಹರಣೆ (Local Metaphor):',
      ml: 'പ്രാദേശിക ഉദാഹരണം (Local Metaphor):',
      bn: 'স্থানীয় উদাহরণ (Local Metaphor):',
      mr: 'स्थानिक उदाहरण (Local Metaphor):',
      gu: 'સ્થાનિક ઉદાહરણ (Local Metaphor):',
      pa: 'ਸਥਾਨਕ ਉਦਾਹਰਣ (Local Metaphor):',
      or: 'ସ୍ଥାନୀୟ ଉଦାହରଣ (Local Metaphor):',
      as: 'স্থানীয় উদাহৰণ (Local Metaphor):',
      en: 'Familiar Metaphor:'
    };
    const metaphorLabel = metaphorPrefixes[this.currentLanguage] || 'Cultural Metaphor:';
    const tutorResponse = `✨ **${concept.pedagogyTitle}**\n\n${concept.vernacularExplanation}\n\n💡 *${metaphorLabel}* ${concept.localMetaphor}`;
    
    this.addTutorMessage(tutorResponse, false, concept.quiz, {
      speechCode: concept.speechCode
    });

    const tutorSpokenText = `${concept.pedagogyTitle}. ${concept.vernacularExplanation}`;
    speechEngine.speak(tutorSpokenText, concept.speechCode);
  }

  updateMessageElement(msg) {
    if (!this.chatContainer || !msg.id) return;
    const existingRow = document.getElementById(msg.id);
    if (existingRow) {
      const newRow = this.createMessageRow(msg);
      this.chatContainer.replaceChild(newRow, existingRow);
    }
  }

  renderMessage(msg) {
    if (!this.chatContainer) return;
    const row = this.createMessageRow(msg);
    this.chatContainer.appendChild(row);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  createMessageRow(msg) {
    const row = document.createElement('div');
    if (msg.id) row.id = msg.id;
    row.className = `chat-msg-row ${msg.sender === 'student' ? 'row-student' : 'row-tutor'}`;

    if (msg.sender === 'tutor') {
      const avatar = document.createElement('div');
      avatar.className = 'tutor-bubble-avatar';
      avatar.innerHTML = '🦉';
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble bubble-${msg.sender}`;

    // Student Message Bubble with Automatic Mother Tongue Conversion Display
    if (msg.sender === 'student') {
      const targetMeta = SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage) || {
        name: 'Tamil',
        nativeName: 'தமிழ்',
        flag: '🇮🇳',
        speechCode: 'ta-IN'
      };

      if (msg.inputWasConverted && msg.convertedText) {
        bubble.classList.add('has-converted-mt');
        bubble.innerHTML = `
          <div class="conversion-status-pill">
            <span class="pill-dot"></span>
            <span>🌐 Converted to <strong>${targetMeta.name} (${targetMeta.nativeName})</strong></span>
            <span class="source-tag">from ${msg.sourceLangName || 'Original'}</span>
          </div>
          <div class="student-mt-display">
            "${msg.convertedText}"
          </div>
          <div class="student-orig-note">
            <span class="note-label">Original input:</span> "${msg.text}"
          </div>
          <div class="bubble-actions" style="margin-top: 0.5rem; justify-content: flex-end;">
            <button class="btn-bubble-listen btn-student-listen" title="Listen in Mother Tongue">
              🔊 Speak in ${targetMeta.nativeName || targetMeta.name}
            </button>
          </div>
        `;

        const speakBtn = bubble.querySelector('.btn-student-listen');
        if (speakBtn) {
          speakBtn.onclick = () => {
            speakBtn.classList.add('playing');
            speechEngine.playPopSound();
            speechEngine.speak(msg.convertedText, targetMeta.speechCode, () => {
              speakBtn.classList.remove('playing');
            });
          };
        }
      } else {
        // Plain text when already in selected mother tongue
        let formattedText = msg.text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>');

        bubble.innerHTML = `
          <div class="bubble-text">${formattedText}</div>
          <div class="student-mt-badge">
            <span>🗣️ Mother Tongue Input (${targetMeta.nativeName || targetMeta.name})</span>
          </div>
        `;
      }
    } else {
      // Tutor Message Bubble
      let formattedText = msg.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      let contentHtml = `<div class="bubble-text">${formattedText}</div>`;

      // Misconception Callout
      if (msg.misconception) {
        contentHtml += `
          <div class="misconception-callout">
            💡 <strong>Friendly Guide:</strong> ${msg.misconception}
          </div>
        `;
      }

      bubble.innerHTML = contentHtml;

      // Add listen button for tutor messages
      const actionsBar = document.createElement('div');
      actionsBar.className = 'bubble-actions';

      if (msg.isBackendLive) {
        const liveBadge = document.createElement('span');
        liveBadge.style.cssText = 'font-size: 0.72rem; font-weight: 600; padding: 2px 7px; border-radius: 10px; background: #059669; color: #fff; margin-right: 6px; display: inline-flex; align-items: center;';
        liveBadge.textContent = '⚡ Live AI Mitra';
        actionsBar.appendChild(liveBadge);
      }

      const listenBtn = document.createElement('button');
      listenBtn.className = 'btn-bubble-listen';
      listenBtn.innerHTML = '🔊 Listen';
      listenBtn.onclick = () => {
        listenBtn.classList.add('playing');
        speechEngine.playPopSound();
        const speechCode = msg.speechCode || (this.currentLanguage === 'hi' ? 'hi-IN' : (this.currentLanguage === 'ta' ? 'ta-IN' : 'en-IN'));
        speechEngine.speak(msg.text, speechCode, () => {
          listenBtn.classList.remove('playing');
        });
      };
      actionsBar.appendChild(listenBtn);

      // Progressive Scaffolding Hint Button
      if (msg.hintAvailable || msg.hintText) {
        const hintBtn = document.createElement('button');
        hintBtn.className = 'btn-tutor-hint';
        hintBtn.innerHTML = '💡 Need a Hint?';
        hintBtn.onclick = async () => {
          speechEngine.playPopSound();
          hintBtn.disabled = true;
          hintBtn.innerHTML = '✨ Unlocking clue...';
          
          let hintContent = msg.hintText;
          if (!hintContent) {
            try {
              const hintRes = await apiClient.getTutorHint('Science', msg.text, '', this.currentLanguage, 1);
              if (hintRes) hintContent = `${hintRes.hint_text} (${hintRes.local_clue})`;
            } catch (e) {
              console.warn('[Mission Agent] Hint API fallback:', e);
            }
          }
          if (!hintContent) {
            hintContent = 'தண்ணீர் சூடாகும் போது என்ன நடக்கும் என்று யோசித்துப் பார்!';
          }

          const hintBox = document.createElement('div');
          hintBox.className = 'misconception-callout';
          hintBox.style.marginTop = '0.5rem';
          hintBox.style.background = '#EFF6FF';
          hintBox.style.borderLeftColor = '#3B82F6';
          hintBox.style.color = '#1E40AF';
          hintBox.innerHTML = `🌟 <strong>Mitra's Clue:</strong> ${hintContent}`;
          bubble.appendChild(hintBox);
          hintBtn.style.display = 'none';
          this.setMood('happy');
        };
        actionsBar.appendChild(hintBtn);
      }

      bubble.appendChild(actionsBar);

      // If interactive quiz attached
      if (msg.quiz) {
        const quizBox = document.createElement('div');
        quizBox.className = 'tutor-inline-quiz';
        quizBox.innerHTML = `
          <div class="inline-quiz-badge">🎯 Mini Challenge for You!</div>
          <div class="inline-quiz-question">${msg.quiz.question}</div>
          <div class="inline-quiz-options">
            ${msg.quiz.options.map((opt, idx) => `
              <button class="btn-quiz-option" data-idx="${idx}">${opt}</button>
            `).join('')}
          </div>
          <div class="inline-quiz-feedback" style="display:none;"></div>
        `;

        const optionBtns = quizBox.querySelectorAll('.btn-quiz-option');
        const feedbackEl = quizBox.querySelector('.inline-quiz-feedback');

        optionBtns.forEach(btn => {
          btn.onclick = () => {
            const chosenIdx = parseInt(btn.getAttribute('data-idx'));
            optionBtns.forEach(b => b.disabled = true);

            if (chosenIdx === msg.quiz.correctIndex) {
              btn.classList.add('correct');
              feedbackEl.className = 'inline-quiz-feedback success';
              feedbackEl.innerHTML = `🌟 <strong>${msg.quiz.successMsg}</strong>`;
              feedbackEl.style.display = 'block';
              this.setMood('cheering');
              quizManager.burstConfetti();
              quizManager.awardStars(20, 'Correct Answer in Mother Tongue!');
            } else {
              btn.classList.add('incorrect');
              optionBtns[msg.quiz.correctIndex].classList.add('correct');
              feedbackEl.className = 'inline-quiz-feedback hint';
              feedbackEl.innerHTML = `💡 <strong>குறிப்பு:</strong> ${msg.quiz.hint}`;
              feedbackEl.style.display = 'block';
              this.setMood('thinking');
            }
          };
        });

        bubble.appendChild(quizBox);
      }
    }

    row.appendChild(bubble);
    return row;
  }
}

export const tutorChat = new TutorChat();
