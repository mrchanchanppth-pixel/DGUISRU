/**
 * ==========================================================================
 * NEXUS PLATFORM - CORE DATA STORE & DEVELOPER API CONTRACTS
 * ==========================================================================
 * 
 * Centralized client state and mock database for:
 * 1. User Profile & Live Balance (Coins, Diamonds, XP, Level, Daily Spins)
 * 2. Coding Mini-Game Levels Catalog (Python, JavaScript, HTML)
 * 3. Daily Rewards Spin Wheel Segments
 * 4. Marketplace Products Catalog (Gaming Diamonds, VPS Nodes, Code Starters)
 * 5. Windows Server Presets & Mock Deployment Scripts
 */

window.NEXUS_DATA = {
  // Current logged in demo user state
  user: {
    name: "Alex V.",
    username: "@alex_cyberdev",
    role: "Verified Developer & Trader",
    diamondBalance: 1450,
    coinBalance: 3200,
    xp: 450,
    codingLevel: 1,
    codingStreak: 0,
    dailySpinsLeft: 1,
    serverNodesActive: 3,
    totalDispatches: 87
  },

  // Daily Rewards Spin Wheel 8 Segments
  spinSegments: [
    { label: "100 🪙", type: "coins", amount: 100, color: "#0284c7", textColor: "#ffffff" },
    { label: "50 💎", type: "diamonds", amount: 50, color: "#7c3aed", textColor: "#ffffff" },
    { label: "250 🪙", type: "coins", amount: 250, color: "#0891b2", textColor: "#ffffff" },
    { label: "500 💎 JACKPOT", type: "diamonds", amount: 500, color: "#d97706", textColor: "#000000" },
    { label: "50 XP", type: "xp", amount: 50, color: "#059669", textColor: "#ffffff" },
    { label: "75 💎", type: "diamonds", amount: 75, color: "#db2777", textColor: "#ffffff" },
    { label: "500 🪙", type: "coins", amount: 500, color: "#4f46e5", textColor: "#ffffff" },
    { label: "150 💎", type: "diamonds", amount: 150, color: "#0d9488", textColor: "#ffffff" }
  ],

  // Interactive Code Learning Puzzle Levels
  codeLevels: [
    {
      id: 1,
      language: "Python",
      langIcon: "terminal",
      langColor: "#38bdf8",
      title: "Level 1: Output Welcome Message",
      prompt: "Display a message welcoming the player to the cyber arena:",
      targetTokens: ["print", "(", "\"Welcome to Nexus!\"", ")"],
      distractors: ["echo", "console.log", ";", "system.out"],
      explanation: "In Python, `print()` writes text to the standard output console.",
      reward: { diamonds: 25, coins: 50, xp: 20 }
    },
    {
      id: 2,
      language: "JavaScript",
      langIcon: "code-2",
      langColor: "#facc15",
      title: "Level 2: ES6 Arrow Function",
      prompt: "Declare a modern ES6 arrow function to calculate total diamonds:",
      targetTokens: ["const", "calcDiamonds", "=", "(amount)", "=>", "amount * 10;"],
      distractors: ["function()", "var", "def", "lambda"],
      explanation: "Arrow functions `(param) => expr` offer a concise syntax for JavaScript expressions.",
      reward: { diamonds: 35, coins: 75, xp: 30 }
    },
    {
      id: 3,
      language: "Python",
      langIcon: "terminal",
      langColor: "#38bdf8",
      title: "Level 3: Loop Through Server Nodes",
      prompt: "Iterate through 5 game server nodes using a Python for loop:",
      targetTokens: ["for", "node_id", "in", "range(5):", "deploy(node_id)"],
      distractors: ["foreach", "node_id++", "while", "do"],
      explanation: "`range(5)` produces numbers 0 to 4 to iterate through each server node.",
      reward: { diamonds: 40, coins: 100, xp: 40 }
    },
    {
      id: 4,
      language: "HTML",
      langIcon: "file-code",
      langColor: "#fb923c",
      title: "Level 4: Glowing Action Button",
      prompt: "Create an interactive HTML button with an instant buy trigger:",
      targetTokens: ["<button", "class=\"btn-neon\"", "onclick=\"buy()\">", "Buy Now", "</button>"],
      distractors: ["<link", "href=\"#\"", "<div>", "</btn>"],
      explanation: "HTML `<button>` tags represent clickable elements that trigger event handlers.",
      reward: { diamonds: 50, coins: 120, xp: 50 }
    },
    {
      id: 5,
      language: "JavaScript",
      langIcon: "code-2",
      langColor: "#facc15",
      title: "Level 5: Asynchronous API Fetch",
      prompt: "Fetch Windows VPS server status asynchronously and parse response:",
      targetTokens: ["const", "res", "=", "await", "fetch('/api/vps');", "await res.json();"],
      distractors: ["async_req", "thread.start()", "then_sync", "xmlHttp"],
      explanation: "`await fetch()` pauses async execution until the HTTP network promise resolves.",
      reward: { diamonds: 60, coins: 150, xp: 60 }
    }
  ],

  // Marketplace Products Catalog
  products: [
    {
      id: "prod-diamond-01",
      title: "Mobile Legends 4,000+ Diamonds Vault",
      category: "gaming-diamonds",
      badge: "BESTSELLER",
      badgeColor: "emerald",
      rating: 4.95,
      reviewsCount: 1420,
      priceUSD: 44.99,
      priceDiamonds: 450,
      priceCoins: 900,
      inStock: 94,
      deliveryTime: "Instant (< 15s)",
      description: "Direct player ID top-up with zero account login required. Moonton approved voucher key with bonus starlight fragments.",
      icon: "gem",
      bannerGradient: "from-cyan-900/60 via-blue-900/40 to-slate-900/90",
      accentColor: "#00f0ff",
      features: ["Instant ID & Zone delivery", "100% Ban Safe", "Includes 400 Bonus Diamonds", "Auto-redeem Ready"]
    },
    {
      id: "prod-diamond-02",
      title: "Free Fire 5,300 Diamond Master Chest",
      category: "gaming-diamonds",
      badge: "HOT DEAL",
      badgeColor: "rose",
      rating: 4.92,
      reviewsCount: 980,
      priceUSD: 38.50,
      priceDiamonds: 385,
      priceCoins: 770,
      inStock: 120,
      deliveryTime: "Instant (< 30s)",
      description: "Massive Free Fire diamond supply for weapon skins and elite passes. Valid globally for NA, EU, and SEA.",
      icon: "flame",
      bannerGradient: "from-rose-950/60 via-amber-900/40 to-slate-900/90",
      accentColor: "#f43f5e",
      features: ["Global UID Support", "Official Garena Pin", "Bonus Elite Pass Token", "Automated Dispatch"]
    },
    {
      id: "prod-diamond-03",
      title: "Roblox 10,000 Robux Digital Keycode",
      category: "gaming-diamonds",
      badge: "LIMITED",
      badgeColor: "amber",
      rating: 4.98,
      reviewsCount: 2310,
      priceUSD: 89.00,
      priceDiamonds: 890,
      priceCoins: 1780,
      inStock: 18,
      deliveryTime: "Instant Key",
      description: "Direct digital gift code redeemable on roblox.com/redeem. Valid for cosmetics, game passes, or dev subscriptions.",
      icon: "sparkles",
      bannerGradient: "from-amber-950/60 via-purple-900/40 to-slate-900/90",
      accentColor: "#f59e0b",
      features: ["Global Activation Key", "No Regional Locks", "Full balance added instantly", "Direct code email dispatch"]
    },
    {
      id: "prod-diamond-04",
      title: "Steam Wallet $100 Global Digital Voucher",
      category: "gaming-diamonds",
      badge: "VERIFIED",
      badgeColor: "cyan",
      rating: 4.99,
      reviewsCount: 3120,
      priceUSD: 99.99,
      priceDiamonds: 1000,
      priceCoins: 2000,
      inStock: 45,
      deliveryTime: "Instant Key",
      description: "Direct official Steam wallet pin. Zero markup, instantly available for games, CS2 keys, or marketplace items.",
      icon: "gamepad-2",
      bannerGradient: "from-blue-950/70 via-indigo-900/40 to-slate-900/90",
      accentColor: "#38bdf8",
      features: ["Global Region Support", "Automatic Key Reveal", "Valid for all Steam sales", "Cryptographically Signed"]
    },
    {
      id: "prod-server-01",
      title: "Windows Server 2025 Datacenter RDP Node",
      category: "cloud-vps",
      badge: "ULTRA FAST",
      badgeColor: "purple",
      rating: 4.97,
      reviewsCount: 840,
      priceUSD: 39.99,
      priceDiamonds: 400,
      priceCoins: 800,
      inStock: 32,
      deliveryTime: "Provisioned in 45s",
      description: "High-frequency virtualized AMD EPYC 9654 node. Windows Server 2025 with Administrator RDP access.",
      icon: "server",
      bannerGradient: "from-purple-950/70 via-indigo-950/50 to-slate-900/90",
      accentColor: "#a855f7",
      features: ["16 vCPU AMD EPYC Cores", "64 GB DDR5 ECC RAM", "1 TB Gen4 NVMe Storage", "10 Gbps Unmetered Uplink"]
    },
    {
      id: "prod-code-01",
      title: "Next.js 15 AI SaaS Platform Starter",
      category: "code-templates",
      badge: "DEV PICK",
      badgeColor: "cyan",
      rating: 4.99,
      reviewsCount: 680,
      priceUSD: 49.00,
      priceDiamonds: 490,
      priceCoins: 980,
      inStock: 999,
      deliveryTime: "Instant GitHub Repo",
      description: "Production boilerplate with App Router, TypeScript, Tailwind CSS, Supabase Auth, and Stripe subscriptions.",
      icon: "code-2",
      bannerGradient: "from-cyan-950/70 via-sky-950/50 to-slate-900/90",
      accentColor: "#00f0ff",
      features: ["Next.js 15 App Router", "Supabase Auth & Database", "Stripe Checkout & Webhooks", "Lifetime Updates"]
    }
  ]
};
