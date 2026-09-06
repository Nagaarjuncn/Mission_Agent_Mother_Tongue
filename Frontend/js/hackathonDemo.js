// 1-Click 3-Minute Hackathon Golden Demo Controller
import { speechEngine } from './speechEngine.js';
import { quizManager } from './interactiveQuiz.js';

export class HackathonDemo {
  constructor() {
    this.currentStep = 0;
    this.modalEl = null;
    this.totalSteps = 7;
    this.autoPlayTimer = null;
  }

  init() {
    this.createDemoModal();
  }

  createDemoModal() {
    let modal = document.getElementById('hackathon-demo-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hackathon-demo-modal';
      modal.className = 'demo-tour-overlay';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="demo-tour-card">
          <div class="demo-tour-header">
            <div class="demo-badge">🏆 HACKATHON LIVE DEMO TOUR</div>
            <button class="btn-close-demo" id="btn-close-demo">✕</button>
          </div>
          <div class="demo-step-progress" id="demo-step-progress">
            <div class="demo-step-bar" id="demo-step-bar" style="width: 14%;"></div>
          </div>
          <div class="demo-step-content" id="demo-step-content">
            <!-- Dynamic step info injected here -->
          </div>
          <div class="demo-tour-footer">
            <button class="btn-demo-secondary" id="btn-demo-prev" disabled>← Previous</button>
            <div class="demo-step-counter" id="demo-step-counter">Step 1 of 7</div>
            <button class="btn-demo-primary" id="btn-demo-next">Next Step →</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('btn-close-demo').onclick = () => this.stop();
      document.getElementById('btn-demo-prev').onclick = () => this.prevStep();
      document.getElementById('btn-demo-next').onclick = () => this.nextStep();
    }
    this.modalEl = modal;
  }

  start() {
    this.createDemoModal();
    this.currentStep = 1;
    this.modalEl.style.display = 'flex';
    this.executeStep(1);
  }

  stop() {
    if (this.modalEl) this.modalEl.style.display = 'none';
    if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
    speechEngine.stopSpeaking();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.executeStep(this.currentStep);
    } else {
      this.stop();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.executeStep(this.currentStep);
    }
  }

  executeStep(step) {
    const contentEl = document.getElementById('demo-step-content');
    const barEl = document.getElementById('demo-step-bar');
    const counterEl = document.getElementById('demo-step-counter');
    const prevBtn = document.getElementById('btn-demo-prev');
    const nextBtn = document.getElementById('btn-demo-next');

    barEl.style.width = `${(step / this.totalSteps) * 100}%`;
    counterEl.textContent = `Step ${step} of ${this.totalSteps}`;
    prevBtn.disabled = step === 1;

    if (step === this.totalSteps) {
      nextBtn.textContent = 'Finish Demo ✨';
    } else {
      nextBtn.textContent = 'Next Step →';
    }

    // Step logic
    switch(step) {
      case 1:
        // Switch to Translate view and pick Tamil
        window.vernacApp.switchTab('translate');
        window.vernacApp.setGlobalLanguage('ta');

        contentEl.innerHTML = `
          <div class="step-icon">🎙️</div>
          <h3>Step 1: Voice Question in Tamil</h3>
          <p>A 7-year-old child asks a natural science question: <em>"Why does rain fall from the sky?"</em></p>
          <div class="demo-preview-pill">Simulating Voice Capture: "Why does rain fall from the sky?"</div>
        `;

        // Simulate voice typing into input box
        setTimeout(() => {
          const input = document.getElementById('translate-input');
          if (input) {
            input.value = "Why does rain fall from the sky?";
            speechEngine.playPopSound();
          }
        }, 500);
        break;

      case 2:
        window.vernacApp.switchTab('translate');
        // Trigger translation
        const translateBtn = document.getElementById('btn-do-translate');
        if (translateBtn) translateBtn.click();

        contentEl.innerHTML = `
          <div class="step-icon">💡</div>
          <h3>Step 2: AI Vernacular Pedagogy vs Literal Translation</h3>
          <p>Notice the huge difference! A word-for-word translation leaves a child confused. VernacLearn uses the <strong>Kitchen Rasam Steam</strong> analogy that every south-Indian child understands immediately!</p>
          <div class="demo-preview-pill">🍲 Rasam Steam Analogy Activated!</div>
        `;
        break;

      case 3:
        // Switch to AI Tutor
        window.vernacApp.switchTab('tutor');
        contentEl.innerHTML = `
          <div class="step-icon">🦉</div>
          <h3>Step 3: Mitra (AI Vernacular Tutor)</h3>
          <p>Mitra greets the child in Tamil, listens to their voice, and explains the concept with an interactive storytelling voice!</p>
          <div class="demo-preview-pill">Mitra is speaking in Tamil...</div>
        `;

        setTimeout(() => {
          window.vernacApp.tutorChat.addStudentMessage("Why does rain fall from the sky?");
        }, 600);
        break;

      case 4:
        contentEl.innerHTML = `
          <div class="step-icon">🎯</div>
          <h3>Step 4: Interactive Quiz & Star Reward</h3>
          <p>Mitra challenges the student with a contextual question in their mother tongue. When the student answers, celebrate their success!</p>
          <div class="demo-preview-pill">Simulating correct answer choice...</div>
        `;

        setTimeout(() => {
          const firstOpt = document.querySelector('.inline-quiz-options button');
          if (firstOpt) {
            firstOpt.click();
          } else {
            quizManager.burstConfetti();
            quizManager.awardStars(20, 'Water Cycle Mastered!');
          }
        }, 800);
        break;

      case 5:
        // Switch to Student Dashboard
        window.vernacApp.switchTab('dashboard');
        window.vernacApp.setRole('student');

        contentEl.innerHTML = `
          <div class="step-icon">🎒</div>
          <h3>Step 5: Personalized Mother-Tongue Dashboard</h3>
          <p>See Aarav's 5-day learning streak, earned badges, and subject progression in Tamil medium.</p>
          <div class="demo-preview-pill">Streak: 5 Days 🔥 | Stars: 160 ⭐</div>
        `;
        break;

      case 6:
        // Switch to Teacher Hub
        window.vernacApp.switchTab('teacher');
        window.vernacApp.setRole('teacher');

        contentEl.innerHTML = `
          <div class="step-icon">👩‍🏫</div>
          <h3>Step 6: Teacher Hub & AI Lesson Generator</h3>
          <p>Teachers can generate full localized lesson plans in 2 seconds with narrative hooks, household experiments, and diagnostic heatmaps!</p>
          <div class="demo-preview-pill">Lesson for Class 4 Tamil Science Ready!</div>
        `;

        setTimeout(() => {
          const genBtn = document.getElementById('btn-generate-lesson');
          if (genBtn) genBtn.click();
        }, 500);
        break;

      case 7:
        contentEl.innerHTML = `
          <div class="step-icon">🌟</div>
          <h2 style="color: #2B3467; margin-bottom: 8px;">VernacLearn Vision</h2>
          <div style="font-size: 1.25rem; font-weight: 700; color: #00A8CC; margin: 12px 0;">
            “Language should never be a barrier to understanding.”
          </div>
          <p style="line-height: 1.6; color: #4B5563;">
            From primary school children in Madurai to rural classrooms in Bengal and Maharashtra, VernacLearn brings personalized AI education directly into the language they think in.
          </p>
          <div class="demo-preview-pill" style="background: #E0F2FE; color: #0284C7;">
            Ready for Questions & Evaluation! 🚀
          </div>
        `;
        quizManager.burstConfetti();
        break;
    }
  }
}

export const hackathonDemo = new HackathonDemo();
