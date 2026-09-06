// Interactive Learning Mode: Mini-quizzes, Match-the-Pair & Canvas Confetti Engine
import { speechEngine } from './speechEngine.js';

export class InteractiveQuizManager {
  constructor() {
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.particles = [];
    this.animId = null;
  }

  initConfetti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
    }
    this.confettiCanvas = canvas;
    this.confettiCtx = canvas.getContext('2d');
  }

  burstConfetti() {
    this.initConfetti();
    const canvas = this.confettiCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFD93D', '#FF6B6B', '#4D96FF', '#6BCB77', '#9D4EDD', '#FF9F45'];
    this.particles = [];

    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    speechEngine.playCelebrationSound();

    if (this.animId) cancelAnimationFrame(this.animId);
    this.renderConfetti();
  }

  renderConfetti() {
    const ctx = this.confettiCtx;
    const canvas = this.confettiCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      this.animId = requestAnimationFrame(() => this.renderConfetti());
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  // Award stars with visual popup toast
  awardStars(amount = 20, message = 'Great job!') {
    const toast = document.createElement('div');
    toast.className = 'star-reward-toast';
    toast.innerHTML = `
      <div class="toast-star-icon">⭐</div>
      <div class="toast-content">
        <div class="toast-title">+${amount} Stars Earned!</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;
    document.body.appendChild(toast);

    // Update star badge counters in navbar
    const starCounters = document.querySelectorAll('.nav-star-count');
    starCounters.forEach(el => {
      let cur = parseInt(el.textContent) || 140;
      el.textContent = `${cur + amount}`;
    });

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

export const quizManager = new InteractiveQuizManager();
