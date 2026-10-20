/**
 * ==============================================================================
 * NEXUS PLATFORM - INTERACTIVE CODE LEARNING PUZZLE MINI-GAME
 * ==============================================================================
 * An engaging, featherweight programming learning system across Python, JS & HTML.
 * Users assemble code tiles in sequence to solve real programming lines, earn Coins,
 * Diamonds, and XP!
 */

class CodePuzzleGame {
  constructor() {
    this.levels = window.NEXUS_DATA.codeLevels;
    this.currentIndex = 0;
    this.assembledTokens = [];
    this.availableTiles = [];
    this.levelSolved = false;

    // DOM references
    this.levelBadge = document.getElementById('puzzle-level-badge');
    this.langPill = document.getElementById('puzzle-lang-pill');
    this.promptEl = document.getElementById('puzzle-prompt');
    this.explanationEl = document.getElementById('puzzle-explanation');
    this.assembledArea = document.getElementById('puzzle-assembled-area');
    this.optionsTray = document.getElementById('puzzle-options-tray');
    this.checkBtn = document.getElementById('puzzle-check-btn');
    this.nextBtn = document.getElementById('puzzle-next-btn');
    this.resetBtn = document.getElementById('puzzle-reset-btn');
    this.rewardBadge = document.getElementById('puzzle-reward-badge');
    this.progressBar = document.getElementById('puzzle-progress-bar');
    this.progressText = document.getElementById('puzzle-progress-text');
    this.streakEl = document.getElementById('puzzle-streak-val');

    this.init();
  }

  init() {
    this.loadLevel(this.currentIndex);
    this.bindEvents();
  }

  loadLevel(index) {
    if (index >= this.levels.length) {
      index = 0; // Loop or celebrate
    }
    this.currentIndex = index;
    this.levelSolved = false;
    this.assembledTokens = [];

    const level = this.levels[this.currentIndex];

    // Combine target tokens and distractors, then shuffle
    const all = [...level.targetTokens, ...level.distractors];
    this.availableTiles = this.shuffleArray(all);

    this.render();
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  render() {
    const level = this.levels[this.currentIndex];
    const user = window.NEXUS_DATA.user;

    // Header info
    if (this.levelBadge) this.levelBadge.textContent = `Level ${level.id} of ${this.levels.length}`;
    if (this.langPill) {
      this.langPill.textContent = level.language;
      this.langPill.style.color = level.langColor;
      this.langPill.style.borderColor = `${level.langColor}55`;
      this.langPill.style.backgroundColor = `${level.langColor}18`;
    }
    if (this.promptEl) this.promptEl.textContent = level.prompt;
    if (this.rewardBadge) {
      this.rewardBadge.textContent = `+${level.reward.diamonds} 💎 | +${level.reward.coins} 🪙 | +${level.reward.xp} XP`;
    }
    if (this.streakEl) this.streakEl.textContent = user.codingStreak;

    // Progress
    const progressPercent = Math.round(((this.currentIndex) / this.levels.length) * 100);
    if (this.progressBar) this.progressBar.style.width = `${progressPercent}%`;
    if (this.progressText) this.progressText.textContent = `${this.currentIndex + 1} / ${this.levels.length}`;

    // Explanation hide/show
    if (this.explanationEl) {
      if (this.levelSolved) {
        this.explanationEl.innerHTML = `
          <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0"></i>
            <div>
              <span class="font-bold">Correct! Line Solved.</span>
              <p class="text-slate-300 mt-0.5">${level.explanation}</p>
            </div>
          </div>
        `;
        this.explanationEl.classList.remove('hidden');
      } else {
        this.explanationEl.classList.add('hidden');
      }
    }

    // Next button toggle
    if (this.nextBtn) {
      if (this.levelSolved) {
        this.nextBtn.classList.remove('hidden');
        if (this.checkBtn) this.checkBtn.classList.add('hidden');
      } else {
        this.nextBtn.classList.add('hidden');
        if (this.checkBtn) this.checkBtn.classList.remove('hidden');
      }
    }

    // Render Assembled Code Area
    if (this.assembledArea) {
      this.assembledArea.className = `code-slot-area p-3 rounded-xl flex flex-wrap items-center gap-2 transition duration-200 ${
        this.levelSolved ? 'correct' : ''
      }`;

      if (this.assembledTokens.length === 0) {
        this.assembledArea.innerHTML = `
          <span class="text-xs font-mono text-slate-500 italic select-none py-1.5 px-2">
            Click option tiles below to build the correct code statement...
          </span>
        `;
      } else {
        this.assembledArea.innerHTML = this.assembledTokens.map((token, i) => `
          <div onclick="puzzleGame.removeToken(${i})" class="code-tile placed group" title="Click to remove">
            <span>${this.escapeHtml(token)}</span>
            <span class="ml-1 text-[10px] text-slate-400 group-hover:text-white">✕</span>
          </div>
        `).join('');
      }
    }

    // Render Available Options Tray
    if (this.optionsTray) {
      this.optionsTray.innerHTML = this.availableTiles.map((tile, i) => `
        <button onclick="puzzleGame.selectTile(${i})" class="code-tile transform active:scale-95">
          ${this.escapeHtml(tile)}
        </button>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  selectTile(tileIndex) {
    if (this.levelSolved) return;
    const tile = this.availableTiles[tileIndex];
    if (!tile) return;

    if (window.soundFX) window.soundFX.click();

    // Move from available to assembled
    this.assembledTokens.push(tile);
    this.availableTiles.splice(tileIndex, 1);
    this.render();
  }

  removeToken(tokenIndex) {
    if (this.levelSolved) return;
    const token = this.assembledTokens[tokenIndex];
    if (!token) return;

    if (window.soundFX) window.soundFX.click();

    // Move back to available
    this.assembledTokens.splice(tokenIndex, 1);
    this.availableTiles.push(token);
    this.render();
  }

  resetLevel() {
    if (window.soundFX) window.soundFX.click();
    this.loadLevel(this.currentIndex);
    if (window.app) window.app.showToast('info', 'Puzzle Reset', 'Code tiles cleared back to tray.');
  }

  checkSolution() {
    const level = this.levels[this.currentIndex];
    const user = window.NEXUS_DATA.user;

    const userString = this.assembledTokens.join(' ');
    const targetString = level.targetTokens.join(' ');

    if (userString === targetString) {
      // SUCCESS!
      this.levelSolved = true;
      user.codingStreak += 1;
      user.diamondBalance += level.reward.diamonds;
      user.coinBalance += level.reward.coins;
      user.xp += level.reward.xp;

      if (window.soundFX) window.soundFX.success();
      if (window.app) {
        window.app.updateWalletDisplay();
        window.app.showToast(
          'diamond',
          'Code Solved!',
          `+${level.reward.diamonds} Diamonds, +${level.reward.coins} Coins & +${level.reward.xp} XP added!`
        );
      }

      this.render();
    } else {
      // INCORRECT
      if (window.soundFX) window.soundFX.terminalBeep();
      if (this.assembledArea) {
        this.assembledArea.classList.add('error');
        setTimeout(() => {
          if (this.assembledArea) this.assembledArea.classList.remove('error');
        }, 500);
      }

      if (window.app) {
        window.app.showToast('warning', 'Incorrect Syntax', 'Double check order or unused words. Hint: Review the prompt!');
      }
    }
  }

  nextLevel() {
    if (window.soundFX) window.soundFX.click();
    this.currentIndex += 1;
    if (this.currentIndex >= this.levels.length) {
      // All levels completed!
      if (window.app) {
        window.app.showToast('diamond', 'Mastery Achieved!', 'You have solved all available coding puzzle levels!');
      }
      this.currentIndex = 0;
    }
    this.loadLevel(this.currentIndex);
  }

  bindEvents() {
    if (this.checkBtn) {
      this.checkBtn.addEventListener('click', () => this.checkSolution());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextLevel());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetLevel());
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.puzzleGame = new CodePuzzleGame();
});
