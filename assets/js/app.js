/**
 * ==============================================================================
 * NEXUS CORE - MAIN APPLICATION CONTROLLER (LIGHTWEIGHT 60 FPS OPTIMIZED)
 * ==============================================================================
 * Handles:
 * - Live Wallet Balance (Diamonds 💎 & Coins 🪙)
 * - Marketplace Engine (Filter, Search, Sort, Quick Purchase Modal)
 * - Creator Dashboard (Mock Project Upload, Mock Windows Server 2025 Deployer)
 * - Toast Notification System with Procedural SoundFX
 * - Fast Search and Lightweight State
 */

class NexusApp {
  constructor() {
    this.data = window.NEXUS_DATA;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.selectedProductForPurchase = null;

    // Windows Server Lab state
    this.serverLab = {
      os: 'Windows Server 2025 Datacenter',
      vcpu: 16,
      ram: 64,
      storage: 1000,
      region: 'Singapore (SG1)',
      priceDiamonds: 400,
      priceCoins: 800
    };

    this.init();
  }

  init() {
    this.updateWalletDisplay();
    this.renderMarketplace();
    this.bindEvents();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ============================================================================
  // LIVE WALLET & COUNTERS
  // ============================================================================
  updateWalletDisplay() {
    const user = this.data.user;
    const diamondEl = document.getElementById('nav-diamond-balance');
    const coinEl = document.getElementById('nav-coin-balance');
    const dashDiamonds = document.getElementById('dash-diamond-val');
    const dashCoins = document.getElementById('dash-coin-val');
    const dashXp = document.getElementById('dash-xp-val');

    if (diamondEl) diamondEl.textContent = user.diamondBalance.toLocaleString();
    if (coinEl) coinEl.textContent = user.coinBalance.toLocaleString();
    if (dashDiamonds) dashDiamonds.textContent = user.diamondBalance.toLocaleString() + ' 💎';
    if (dashCoins) dashCoins.textContent = user.coinBalance.toLocaleString() + ' 🪙';
    if (dashXp) dashXp.textContent = user.xp.toLocaleString() + ' XP';
  }

  // ============================================================================
  // TOAST NOTIFICATIONS & SOUNDS
  // ============================================================================
  showToast(type, title, message) {
    if (window.soundFX) {
      if (type === 'success' || type === 'diamond') window.soundFX.success();
      else window.soundFX.click();
    }

    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastId = 'toast-' + Date.now();
    let borderClass = 'border-cyan-500/50';
    let iconName = 'check-circle';
    let iconColor = 'text-cyan-400';

    if (type === 'diamond') {
      borderClass = 'border-amber-500/50';
      iconName = 'gem';
      iconColor = 'text-amber-400';
    } else if (type === 'warning') {
      borderClass = 'border-rose-500/50';
      iconName = 'alert-triangle';
      iconColor = 'text-rose-400';
    } else if (type === 'info') {
      borderClass = 'border-purple-500/50';
      iconName = 'info';
      iconColor = 'text-purple-400';
    }

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `glass-panel flex items-start gap-3.5 p-4 rounded-xl border ${borderClass} shadow-2xl backdrop-blur-xl transform translate-x-8 opacity-0 transition-all duration-200 max-w-sm w-full pointer-events-auto`;
    toast.innerHTML = `
      <div class="mt-0.5 ${iconColor}">
        <i data-lucide="${iconName}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 pr-2">
        <h4 class="text-sm font-semibold text-white tracking-wide">${title}</h4>
        <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button onclick="document.getElementById('${toastId}').remove()" class="text-slate-500 hover:text-white transition">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });

    setTimeout(() => {
      toast.classList.remove('translate-x-8', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
      if (document.getElementById(toastId)) {
        toast.classList.add('translate-x-8', 'opacity-0');
        setTimeout(() => toast.remove(), 250);
      }
    }, 3600);
  }

  // ============================================================================
  // MARKETPLACE RENDER & FILTER ENGINE
  // ============================================================================
  renderMarketplace() {
    const grid = document.getElementById('marketplace-grid');
    if (!grid) return;

    let items = [...this.data.products];

    // Filter Category
    if (this.activeCategory !== 'all') {
      items = items.filter(item => item.category === this.activeCategory);
    }

    // Filter Search
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.sortBy === 'price-low') {
      items.sort((a, b) => a.priceDiamonds - b.priceDiamonds);
    } else if (this.sortBy === 'price-high') {
      items.sort((a, b) => b.priceDiamonds - a.priceDiamonds);
    } else if (this.sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    const countEl = document.getElementById('marketplace-item-count');
    if (countEl) countEl.textContent = `${items.length} items available`;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-14 text-center glass-panel rounded-2xl border border-white/5">
          <i data-lucide="search-x" class="w-10 h-10 text-slate-500 mx-auto mb-3"></i>
          <h3 class="text-base font-bold text-white">No assets found</h3>
          <p class="text-xs text-slate-400 mt-1">Try switching categories or clearing search keywords.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons({ root: grid });
      return;
    }

    grid.innerHTML = items.map(product => {
      const badgeBg = 
        product.badgeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
        product.badgeColor === 'rose' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
        product.badgeColor === 'amber' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
        product.badgeColor === 'purple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
        'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

      return `
        <div class="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-200 border border-white/10 hover:border-cyan-500/40">
          <!-- Card Top Graphic Banner -->
          <div class="relative h-40 bg-gradient-to-br ${product.bannerGradient} p-4 flex flex-col justify-between overflow-hidden border-b border-white/5">
            <div class="flex items-center justify-between z-10">
              <span class="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md ${badgeBg}">
                ${product.badge}
              </span>
              <div class="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
                <i data-lucide="star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400"></i>
                <span class="text-xs font-semibold text-white">${product.rating}</span>
                <span class="text-[10px] text-slate-400">(${product.reviewsCount})</span>
              </div>
            </div>

            <!-- Central Icon & Category -->
            <div class="z-10 flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-black/50 border border-white/15 flex items-center justify-center text-white backdrop-blur-md shadow-lg" style="box-shadow: 0 0 15px -3px ${product.accentColor}55;">
                <i data-lucide="${product.icon}" class="w-5 h-5" style="color: ${product.accentColor};"></i>
              </div>
              <div>
                <span class="text-[10px] font-mono tracking-wide uppercase text-slate-300/80">${product.category.replace('-', ' ')}</span>
                <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ${product.deliveryTime}
                </div>
              </div>
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition duration-150 line-clamp-1">
                ${product.title}
              </h3>
              <p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                ${product.description}
              </p>

              <!-- Feature Pills -->
              <div class="mt-3 flex flex-wrap gap-1.5">
                ${product.features.slice(0, 2).map(f => `
                  <span class="text-[10px] bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1">
                    <i data-lucide="check" class="w-3 h-3 text-cyan-400"></i> ${f}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Price & Buy Button -->
            <div class="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
              <div>
                <div class="text-sm font-black text-cyan-400 font-mono flex items-center gap-1">
                  <i data-lucide="gem" class="w-3.5 h-3.5"></i> ${product.priceDiamonds} 💎
                </div>
                <div class="text-[11px] font-semibold text-slate-400 font-mono">
                  or ${product.priceCoins} 🪙
                </div>
              </div>

              <button onclick="app.openPurchaseModal('${product.id}')" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wide shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5 transform active:scale-95">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i> Buy Now
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons({ root: grid });
  }

  // ============================================================================
  // MOCK PURCHASE MODAL
  // ============================================================================
  openPurchaseModal(productId) {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) return;

    this.selectedProductForPurchase = product;
    if (window.soundFX) window.soundFX.click();

    const modal = document.getElementById('purchase-modal');
    const content = document.getElementById('purchase-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="relative bg-slate-900/95 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl backdrop-blur-xl">
        <div class="flex items-center justify-between pb-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <i data-lucide="${product.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono text-cyan-400">${product.category}</span>
              <h3 class="text-base font-bold text-white">${product.title}</h3>
            </div>
          </div>
          <button onclick="app.closePurchaseModal()" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="py-4 space-y-3">
          <p class="text-xs text-slate-300 leading-relaxed">${product.description}</p>
          <div class="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1.5 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400">Delivery Speed:</span>
              <span class="text-emerald-400 font-bold">${product.deliveryTime}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Item Price:</span>
              <span class="text-cyan-400 font-bold">${product.priceDiamonds} Diamonds / ${product.priceCoins} Coins</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Your Wallet Balance:</span>
              <span class="text-white">${this.data.user.diamondBalance} 💎 / ${this.data.user.coinBalance} 🪙</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
          <button onclick="app.confirmPurchase('diamonds')" class="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5">
            <i data-lucide="gem" class="w-3.5 h-3.5"></i> Pay ${product.priceDiamonds} 💎
          </button>
          <button onclick="app.confirmPurchase('coins')" class="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5">
            <i data-lucide="coins" class="w-3.5 h-3.5"></i> Pay ${product.priceCoins} 🪙
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons({ root: content });
  }

  closePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if (modal) modal.classList.add('hidden');
    this.selectedProductForPurchase = null;
  }

  confirmPurchase(currencyType) {
    const product = this.selectedProductForPurchase;
    if (!product) return;
    const user = this.data.user;

    if (currencyType === 'diamonds') {
      if (user.diamondBalance < product.priceDiamonds) {
        this.showToast('warning', 'Insufficient Diamonds', 'Spin the Daily Wheel or solve code puzzles to earn more!');
        return;
      }
      user.diamondBalance -= product.priceDiamonds;
    } else {
      if (user.coinBalance < product.priceCoins) {
        this.showToast('warning', 'Insufficient Coins', 'Spin the Daily Wheel or solve code puzzles to earn more!');
        return;
      }
      user.coinBalance -= product.priceCoins;
    }

    if (window.soundFX) window.soundFX.success();
    this.updateWalletDisplay();
    this.closePurchaseModal();
    this.showToast('diamond', 'Purchase Complete!', `Successfully acquired ${product.title}. Dispatched instantly!`);
  }

  // ============================================================================
  // WINDOWS SERVER SIMULATION & TERMINAL STREAMER
  // ============================================================================
  deployMockServer() {
    const statusPill = document.getElementById('hero-server-status');
    const terminal = document.getElementById('hero-server-terminal');
    const deployBtn = document.getElementById('hero-deploy-btn');

    if (statusPill) {
      statusPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> PROVISIONING`;
      statusPill.className = "text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-2";
    }

    if (deployBtn) {
      deployBtn.disabled = true;
      deployBtn.classList.add('opacity-50');
      deployBtn.textContent = 'Deploying...';
    }

    if (window.soundFX) window.soundFX.terminalBeep();

    const logs = [
      "[11:24:00] [HYPER-V] Allocating virtual cores on AMD EPYC 9654...",
      "[11:24:01] [NET] Binding IP 194.88.24.112 (Singapore Equinix SG1)...",
      "[11:24:02] [TLS 1.3] Enforcing RDP Network Level Authentication on Port 3389...",
      "[11:24:03] [RUNTIMES] Injecting Node.js 22 LTS, Docker & Python 3.12...",
      "[11:24:04] [ONLINE] Windows Server node active. Latency: 9ms. RDP Ready!"
    ];

    if (terminal) terminal.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        const line = document.createElement('div');
        line.className = 'text-cyan-400 font-mono text-xs';
        line.textContent = logs[i];
        if (terminal) {
          terminal.appendChild(line);
          terminal.scrollTop = terminal.scrollHeight;
        }
        if (window.soundFX) window.soundFX.click();
        i++;
      } else {
        clearInterval(interval);
        if (statusPill) {
          statusPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE (194.88.24.112)`;
          statusPill.className = "text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-2";
        }
        if (deployBtn) {
          deployBtn.disabled = false;
          deployBtn.classList.remove('opacity-50');
          deployBtn.textContent = 'Redeploy Node';
        }
        if (window.soundFX) window.soundFX.success();
        this.showToast('success', 'Node Deployed', 'Windows Server 2025 online at 194.88.24.112.');
      }
    }, 600);
  }

  // ============================================================================
  // CREATOR DASHBOARD SIMULATION
  // ============================================================================
  openDashboardModal(tab = 'upload') {
    if (window.soundFX) window.soundFX.click();
    const modal = document.getElementById('dashboard-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.switchDashboardTab(tab);
  }

  closeDashboardModal() {
    const modal = document.getElementById('dashboard-modal');
    if (modal) modal.classList.add('hidden');
  }

  switchDashboardTab(tab) {
    document.querySelectorAll('.dash-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
        btn.classList.remove('text-slate-400', 'border-transparent');
      } else {
        btn.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
        btn.classList.add('text-slate-400', 'border-transparent');
      }
    });

    const paneUpload = document.getElementById('dash-pane-upload');
    const paneVPS = document.getElementById('dash-pane-vps');
    const paneTokens = document.getElementById('dash-pane-tokens');

    if (paneUpload) paneUpload.classList.toggle('hidden', tab !== 'upload');
    if (paneVPS) paneVPS.classList.toggle('hidden', tab !== 'vps');
    if (paneTokens) paneTokens.classList.toggle('hidden', tab !== 'tokens');
  }

  simulateUpload(e) {
    e.preventDefault();
    const titleInput = document.getElementById('dash-upload-title');
    const catSelect = document.getElementById('dash-upload-category');
    const priceInput = document.getElementById('dash-upload-price');

    if (!titleInput || !titleInput.value) {
      this.showToast('warning', 'Missing Details', 'Please provide a project or template title.');
      return;
    }

    const newProduct = {
      id: 'prod-user-' + Date.now(),
      title: titleInput.value,
      category: catSelect ? catSelect.value : 'code-templates',
      badge: "COMMUNITY",
      badgeColor: "cyan",
      rating: 5.0,
      reviewsCount: 1,
      priceUSD: 19.99,
      priceDiamonds: parseInt(priceInput ? priceInput.value : 190, 10),
      priceCoins: parseInt(priceInput ? priceInput.value * 2 : 380, 10),
      inStock: 999,
      deliveryTime: "Instant Download",
      description: "Community published verified digital asset with instant cryptographic validation.",
      icon: "sparkles",
      bannerGradient: "from-cyan-950/70 via-blue-950/50 to-slate-900/90",
      accentColor: "#00f0ff",
      features: ["Source Code Included", "Commercial License", "Verified Package"]
    };

    this.data.products.unshift(newProduct);
    this.renderMarketplace();
    this.closeDashboardModal();
    this.showToast('diamond', 'Asset Published!', `"${titleInput.value}" is now live in the marketplace!`);
    titleInput.value = '';
  }

  // ============================================================================
  // EVENT BINDINGS
  // ============================================================================
  bindEvents() {
    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (window.soundFX) {
          const enabled = window.soundFX.toggle();
          soundToggle.innerHTML = enabled ? 
            `<i data-lucide="volume-2" class="w-4 h-4 text-cyan-400"></i>` : 
            `<i data-lucide="volume-x" class="w-4 h-4 text-slate-500"></i>`;
          if (window.lucide) window.lucide.createIcons({ root: soundToggle });
          this.showToast('info', 'Sound FX', enabled ? 'Sound FX Enabled' : 'Sound FX Muted');
        }
      });
    }

    // Category tabs
    document.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.click();
        const cat = btn.getAttribute('data-category');
        this.activeCategory = cat;

        document.querySelectorAll('.category-tab-btn').forEach(b => {
          b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
          b.classList.add('text-slate-400', 'border-transparent');
        });
        btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
        btn.classList.remove('text-slate-400', 'border-transparent');

        this.renderMarketplace();
      });
    });

    // Marketplace search
    const searchInput = document.getElementById('marketplace-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderMarketplace();
      });
    }

    // Nav search
    const navSearch = document.getElementById('nav-search-input');
    if (navSearch) {
      navSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderMarketplace();
        const section = document.getElementById('marketplace');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Sort select
    const sortSelect = document.getElementById('marketplace-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderMarketplace();
      });
    }
  }
}

// Global instantiation
window.addEventListener('DOMContentLoaded', () => {
  window.app = new NexusApp();
});
