/**
 * ==========================================================================
 * NEXUS PLATFORM - INTERACTIVE CANVAS & VISUAL ENGINE
 * ==========================================================================
 * Powers:
 * 1. Global Ambient Hero Particle Constellation
 * 2. Interactive Code Playground Live Sandbox Canvas
 */

class AmbientCyberBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.particleCount = window.innerWidth < 768 ? 35 : 70;
    this.animationId = null;

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, '
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce boundaries
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interactivity / repulsion
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + '0.7)';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.fill();

      // Connect with neighbors
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          const opacity = (1 - dist / 110) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.shadowBlur = 0;
          this.ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

/**
 * Interactive Live Playground Sandbox Engine
 */
class SandboxCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Configurable state
    this.particleCount = 50;
    this.speed = 1.2;
    this.colorTheme = 'cyan'; // 'cyan', 'purple', 'emerald', 'amber'
    this.mode = 'constellation'; // 'constellation' or 'cyberwave'
    this.waveOffset = 0;
    this.particles = [];
    this.running = true;

    this.resize();
    this.initParticles();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 450;
    this.canvas.height = rect.height || 280;
  }

  getColorHex() {
    switch (this.colorTheme) {
      case 'purple': return { main: '#a855f7', rgb: '168, 85, 247' };
      case 'emerald': return { main: '#10b981', rgb: '16, 185, 129' };
      case 'amber': return { main: '#f59e0b', rgb: '245, 158, 11' };
      case 'cyan':
      default: return { main: '#00f0ff', rgb: '0, 240, 255' };
    }
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.speed * 1.5,
        vy: (Math.random() - 0.5) * this.speed * 1.5,
        radius: Math.random() * 3 + 1
      });
    }
  }

  setTheme(theme) {
    this.colorTheme = theme;
  }

  setSpeed(speed) {
    this.speed = parseFloat(speed);
    this.initParticles();
  }

  setCount(count) {
    this.particleCount = parseInt(count, 10);
    this.initParticles();
  }

  setMode(mode) {
    this.mode = mode;
  }

  animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const theme = this.getColorHex();

    if (this.mode === 'constellation') {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = theme.main;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = theme.main;
        this.ctx.fill();

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 75) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(${theme.rgb}, ${1 - dist / 75})`;
            this.ctx.lineWidth = 0.8;
            this.ctx.shadowBlur = 0;
            this.ctx.stroke();
          }
        }
      }
    } else {
      // Cyber Wave Mode
      this.waveOffset += 0.04 * this.speed;
      this.ctx.beginPath();
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = theme.main;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = theme.main;

      const centerY = this.canvas.height / 2;
      for (let x = 0; x < this.canvas.width; x += 4) {
        const y = centerY + Math.sin(x * 0.025 + this.waveOffset) * 45 + Math.cos(x * 0.01 - this.waveOffset) * 20;
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();

      // Second harmonic wave
      this.ctx.beginPath();
      this.ctx.lineWidth = 1.2;
      this.ctx.strokeStyle = `rgba(${theme.rgb}, 0.45)`;
      for (let x = 0; x < this.canvas.width; x += 6) {
        const y = centerY + Math.cos(x * 0.035 - this.waveOffset * 1.5) * 35;
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.bgCanvas = new AmbientCyberBackground('ambient-canvas');
  window.sandboxCanvas = new SandboxCanvasEngine('sandbox-canvas');
});
