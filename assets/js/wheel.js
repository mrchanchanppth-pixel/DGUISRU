/**
 * ==============================================================================
 * NEXUS PLATFORM - DAILY REWARDS SPIN WHEEL CONTROLLER
 * ==============================================================================
 * Ultra-lightweight SVG & CSS-driven Spin Wheel (Zero 3D/Canvas Overhead)
 * Smooth 60 FPS rotation physics via CSS cubic-bezier transitions.
 */

class SpinWheelController {
  constructor() {
    this.segments = window.NEXUS_DATA.spinSegments;
    this.currentRotation = 0;
    this.isSpinning = false;
    this.wheelSvg = document.getElementById('wheel-svg');
    this.spinBtn = document.getElementById('wheel-spin-btn');
    this.spinsLeftBadge = document.getElementById('daily-spins-badge');

    this.init();
  }

  init() {
    this.renderWheel();
    this.updateSpinsDisplay();
  }

  updateSpinsDisplay() {
    const user = window.NEXUS_DATA.user;
    if (this.spinsLeftBadge) {
      this.spinsLeftBadge.textContent = `${user.dailySpinsLeft} Free Spin Available`;
      if (user.dailySpinsLeft > 0) {
        this.spinsLeftBadge.className = "text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full";
      } else {
        this.spinsLeftBadge.className = "text-xs font-mono text-slate-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full";
      }
    }
  }

  renderWheel() {
    if (!this.wheelSvg) return;

    const numSegments = this.segments.length;
    const anglePerSegment = 360 / numSegments;
    const radius = 180;
    const centerX = 200;
    const centerY = 200;

    let svgHtml = '';

    this.segments.forEach((seg, i) => {
      const startAngle = (i * anglePerSegment - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * anglePerSegment - 90) * (Math.PI / 180);

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArc = anglePerSegment > 180 ? 1 : 0;
      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Text rotation
      const textAngle = i * anglePerSegment + anglePerSegment / 2;
      const textRadius = radius * 0.62;
      const textRad = (textAngle - 90) * (Math.PI / 180);
      const tx = centerX + textRadius * Math.cos(textRad);
      const ty = centerY + textRadius * Math.sin(textRad);

      svgHtml += `
        <g class="wheel-slice" data-index="${i}">
          <path d="${pathData}" fill="${seg.color}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" />
          <text x="${tx}" y="${ty}" fill="${seg.textColor}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" text-anchor="middle" dominant-baseline="middle" transform="rotate(${textAngle}, ${tx}, ${ty})">
            ${seg.label}
          </text>
        </g>
      `;
    });

    // Center decorative cap
    svgHtml += `
      <circle cx="${centerX}" cy="${centerY}" r="32" fill="#06080f" stroke="#00f0ff" stroke-width="3" />
      <circle cx="${centerX}" cy="${centerY}" r="14" fill="#00f0ff" />
    `;

    this.wheelSvg.innerHTML = svgHtml;
  }

  spin() {
    const user = window.NEXUS_DATA.user;
    if (this.isSpinning) return;

    if (user.dailySpinsLeft <= 0) {
      if (window.app) window.app.showToast('info', 'Spin Claimed', 'Come back tomorrow or solve coding puzzles to earn bonus spins!');
      return;
    }

    this.isSpinning = true;
    user.dailySpinsLeft -= 1;
    this.updateSpinsDisplay();

    if (window.soundFX) window.soundFX.terminalBeep();

    // Pick a random segment (0 to 7)
    const prizeIndex = Math.floor(Math.random() * this.segments.length);
    const winningSegment = this.segments[prizeIndex];

    const segmentAngle = 360 / this.segments.length;
    // Calculate rotation to land under top pointer (0 deg / top marker)
    // Pointer is at 0 deg (top). Each segment i covers [i*segmentAngle, (i+1)*segmentAngle]
    const targetSegmentCenter = prizeIndex * segmentAngle + segmentAngle / 2;
    const randomExtraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    
    // We rotate clockwise, so the landing position is 360 - targetSegmentCenter
    const nextRotation = this.currentRotation + randomExtraRotations + (360 - (this.currentRotation % 360)) + (360 - targetSegmentCenter);
    this.currentRotation = nextRotation;

    if (this.wheelSvg) {
      this.wheelSvg.style.transform = `rotate(${this.currentRotation}deg)`;
    }

    if (this.spinBtn) {
      this.spinBtn.disabled = true;
      this.spinBtn.classList.add('opacity-50', 'cursor-not-allowed');
      this.spinBtn.textContent = 'Spinning...';
    }

    // Wait for the 4.5s CSS rotation transition to complete
    setTimeout(() => {
      this.isSpinning = false;
      if (this.spinBtn) {
        this.spinBtn.disabled = false;
        this.spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        this.spinBtn.textContent = 'SPIN WHEEL';
      }

      // Credit winnings to user
      if (winningSegment.type === 'coins') {
        user.coinBalance += winningSegment.amount;
      } else if (winningSegment.type === 'diamonds') {
        user.diamondBalance += winningSegment.amount;
      } else if (winningSegment.type === 'xp') {
        user.xp += winningSegment.amount;
      }

      if (window.app) {
        window.app.updateWalletDisplay();
        window.app.showToast('diamond', 'Wheel Reward Won!', `Congratulations! You received ${winningSegment.label}!`);
      }

      if (window.soundFX) window.soundFX.success();

      // Show reward victory popup
      this.showRewardPopup(winningSegment);
    }, 4500);
  }

  showRewardPopup(prize) {
    const popup = document.getElementById('wheel-reward-modal');
    const prizeEl = document.getElementById('wheel-prize-display');
    const titleEl = document.getElementById('wheel-prize-title');

    if (prizeEl) prizeEl.textContent = prize.label;
    if (titleEl) titleEl.textContent = `You won ${prize.amount} ${prize.type.toUpperCase()}!`;
    if (popup) popup.classList.remove('hidden');
  }

  closeRewardPopup() {
    const popup = document.getElementById('wheel-reward-modal');
    if (popup) popup.classList.add('hidden');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.spinWheel = new SpinWheelController();
});
