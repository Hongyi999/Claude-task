// ============================================
// DOTA 2 HERO CLICKER - GAME LOGIC
// ============================================

// Game State
const gameState = {
  gold: 0,
  level: 1,
  wave: 1,
  currentHero: null,
  damage: 10,
  dps: 0,
  critChance: 0,
  critMultiplier: 2,
  autoAttackInterval: null,
  items: [],
  upgrades: {}
};

// Enemy State
let enemy = {
  name: 'Melee Creep',
  health: 100,
  maxHealth: 100,
  goldReward: 10,
  avatar: '🧟'
};

// Dota 2 Heroes Data
const heroes = [
  {
    id: 'juggernaut',
    name: 'Juggernaut',
    avatar: '⚔️',
    attribute: 'Agility',
    baseDamage: 15,
    color: '#8B0000',
    description: 'Swift blade master with high attack speed'
  },
  {
    id: 'crystal_maiden',
    name: 'Crystal Maiden',
    avatar: '❄️',
    attribute: 'Intelligence',
    baseDamage: 12,
    color: '#4169E1',
    description: 'Ice mage with magical damage'
  },
  {
    id: 'axe',
    name: 'Axe',
    avatar: '🪓',
    attribute: 'Strength',
    baseDamage: 20,
    color: '#DC143C',
    description: 'Mighty warrior with brutal strikes'
  },
  {
    id: 'pudge',
    name: 'Pudge',
    avatar: '🍖',
    attribute: 'Strength',
    baseDamage: 18,
    color: '#228B22',
    description: 'The Butcher - high damage, low speed'
  },
  {
    id: 'invoker',
    name: 'Invoker',
    avatar: '🔮',
    attribute: 'Intelligence',
    baseDamage: 14,
    color: '#9400D3',
    description: 'Master of elements and spells'
  },
  {
    id: 'phantom_assassin',
    name: 'Phantom Assassin',
    avatar: '🗡️',
    attribute: 'Agility',
    baseDamage: 16,
    color: '#191970',
    description: 'Critical strike specialist'
  }
];

// Dota 2 Items
const items = [
  {
    id: 'quelling_blade',
    name: 'Quelling Blade',
    cost: 100,
    damage: 5,
    icon: '🔪',
    description: '+5 Damage'
  },
  {
    id: 'wraith_band',
    name: 'Wraith Band',
    cost: 250,
    damage: 10,
    icon: '💍',
    description: '+10 Damage'
  },
  {
    id: 'power_treads',
    name: 'Power Treads',
    cost: 500,
    damage: 15,
    icon: '👢',
    description: '+15 Damage, +Attack Speed'
  },
  {
    id: 'daedalus',
    name: 'Daedalus',
    cost: 1200,
    damage: 30,
    icon: '🗡️',
    description: '+30 Damage, +30% Crit Chance'
  },
  {
    id: 'divine_rapier',
    name: 'Divine Rapier',
    cost: 3000,
    damage: 100,
    icon: '⚡',
    description: '+100 Damage'
  },
  {
    id: 'monkey_king_bar',
    name: 'Monkey King Bar',
    cost: 2500,
    damage: 50,
    icon: '🦍',
    description: '+50 Damage, True Strike'
  }
];

// Upgrades
const upgrades = [
  {
    id: 'auto_attack',
    name: 'Auto Attack',
    baseCost: 300,
    level: 0,
    maxLevel: 10,
    icon: '🔄',
    description: 'Automatically attack enemies'
  },
  {
    id: 'crit_chance',
    name: 'Critical Strike',
    baseCost: 500,
    level: 0,
    maxLevel: 5,
    icon: '💥',
    description: '+10% Critical Chance per level'
  },
  {
    id: 'gold_multiplier',
    name: 'Gold Bonus',
    baseCost: 400,
    level: 0,
    maxLevel: 10,
    icon: '💰',
    description: '+20% Gold earned per level'
  },
  {
    id: 'damage_multiplier',
    name: 'Damage Amp',
    baseCost: 600,
    level: 0,
    maxLevel: 10,
    icon: '⚔️',
    description: '+15% All Damage per level'
  }
];

// ============================================
// INITIALIZATION
// ============================================

function init() {
  renderHeroes();
  renderShop();
  renderUpgrades();
  setupEventListeners();
  updateUI();
  spawnEnemy();
}

// ============================================
// HERO SELECTION
// ============================================

function renderHeroes() {
  const heroList = document.getElementById('heroList');
  heroList.innerHTML = '';

  heroes.forEach(hero => {
    const heroCard = document.createElement('div');
    heroCard.className = 'hero-card';
    heroCard.innerHTML = `
      <div class="hero-card-avatar">${hero.avatar}</div>
      <div class="hero-card-info">
        <div class="hero-card-name">${hero.name}</div>
        <div class="hero-card-attr">${hero.attribute}</div>
        <div class="hero-card-dmg">⚔️ ${hero.baseDamage}</div>
      </div>
    `;
    heroCard.addEventListener('click', () => selectHero(hero));
    heroList.appendChild(heroCard);
  });
}

function selectHero(hero) {
  gameState.currentHero = hero;
  gameState.damage = hero.baseDamage;

  const currentHeroEl = document.getElementById('currentHero');
  currentHeroEl.innerHTML = `
    <h3 class="hero-name">${hero.name}</h3>
    <div class="hero-avatar">${hero.avatar}</div>
    <div class="hero-info">
      <p class="hero-attr">${hero.attribute} Hero</p>
      <p class="hero-desc">${hero.description}</p>
    </div>
  `;

  updateUI();
  showNotification(`${hero.name} selected!`);
}

// ============================================
// COMBAT SYSTEM
// ============================================

function attack() {
  if (!gameState.currentHero) {
    showNotification('Select a hero first!');
    return;
  }

  let damage = calculateTotalDamage();

  // Critical strike
  if (Math.random() < gameState.critChance) {
    damage *= gameState.critMultiplier;
    showDamageNumber(damage, true);
  } else {
    showDamageNumber(damage, false);
  }

  enemy.health -= damage;

  if (enemy.health <= 0) {
    enemyDefeated();
  }

  updateEnemyHealth();
}

function calculateTotalDamage() {
  let baseDamage = gameState.damage;

  // Add item damage
  gameState.items.forEach(item => {
    baseDamage += item.damage;
  });

  // Apply damage multiplier upgrade
  const damageUpgrade = upgrades.find(u => u.id === 'damage_multiplier');
  if (damageUpgrade && damageUpgrade.level > 0) {
    baseDamage *= (1 + (damageUpgrade.level * 0.15));
  }

  return Math.round(baseDamage);
}

function enemyDefeated() {
  let goldEarned = enemy.goldReward;

  // Apply gold multiplier
  const goldUpgrade = upgrades.find(u => u.id === 'gold_multiplier');
  if (goldUpgrade && goldUpgrade.level > 0) {
    goldEarned *= (1 + (goldUpgrade.level * 0.20));
  }

  gameState.gold += Math.round(goldEarned);
  gameState.level++;

  showNotification(`+${Math.round(goldEarned)} Gold!`);

  // Next wave
  gameState.wave++;
  spawnEnemy();
  updateUI();
}

function spawnEnemy() {
  const waveMultiplier = 1 + (gameState.wave * 0.3);

  const enemies = [
    { name: 'Melee Creep', avatar: '🧟', health: 100 },
    { name: 'Ranged Creep', avatar: '🏹', health: 150 },
    { name: 'Dire Wolf', avatar: '🐺', health: 300 },
    { name: 'Centaur', avatar: '🐴', health: 500 },
    { name: 'Ancient Dragon', avatar: '🐉', health: 1000 },
    { name: 'Roshan', avatar: '👹', health: 2000 }
  ];

  const enemyIndex = Math.min(Math.floor(gameState.wave / 5), enemies.length - 1);
  const enemyTemplate = enemies[enemyIndex];

  enemy = {
    name: enemyTemplate.name,
    avatar: enemyTemplate.avatar,
    health: Math.round(enemyTemplate.health * waveMultiplier),
    maxHealth: Math.round(enemyTemplate.health * waveMultiplier),
    goldReward: Math.round(10 + (gameState.wave * 2))
  };

  document.getElementById('enemyName').textContent = enemy.name;
  document.getElementById('enemyAvatar').textContent = enemy.avatar;
  document.getElementById('wave').textContent = gameState.wave;

  updateEnemyHealth();
}

function updateEnemyHealth() {
  const healthPercent = (enemy.health / enemy.maxHealth) * 100;
  document.getElementById('healthFill').style.width = `${healthPercent}%`;
  document.getElementById('healthText').textContent =
    `${Math.max(0, Math.round(enemy.health))} / ${enemy.maxHealth}`;
}

function showDamageNumber(damage, isCrit) {
  const damageEl = document.createElement('div');
  damageEl.className = `damage-num ${isCrit ? 'crit' : ''}`;
  damageEl.textContent = isCrit ? `${Math.round(damage)} CRIT!` : Math.round(damage);

  const container = document.getElementById('damageNumbers');
  container.appendChild(damageEl);

  setTimeout(() => damageEl.remove(), 1000);
}

// ============================================
// SHOP SYSTEM
// ============================================

function renderShop() {
  const shopItems = document.getElementById('shopItems');
  shopItems.innerHTML = '';

  items.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'shop-item';

    const owned = gameState.items.filter(i => i.id === item.id).length;
    const canAfford = gameState.gold >= item.cost;

    itemCard.innerHTML = `
      <div class="item-icon">${item.icon}</div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.description}</div>
        <div class="item-cost ${canAfford ? '' : 'cant-afford'}">💰 ${item.cost}</div>
      </div>
      <button class="buy-btn ${canAfford ? '' : 'disabled'}" ${canAfford ? '' : 'disabled'}>
        Buy ${owned > 0 ? `(${owned})` : ''}
      </button>
    `;

    itemCard.querySelector('.buy-btn').addEventListener('click', () => buyItem(item));
    shopItems.appendChild(itemCard);
  });
}

function buyItem(item) {
  if (gameState.gold >= item.cost) {
    gameState.gold -= item.cost;
    gameState.items.push(item);

    // Special effects
    if (item.id === 'daedalus') {
      gameState.critChance += 0.30;
    }

    showNotification(`Purchased ${item.name}!`);
    updateUI();
    renderShop();
  }
}

function renderUpgrades() {
  const shopUpgrades = document.getElementById('shopUpgrades');
  shopUpgrades.innerHTML = '';

  upgrades.forEach(upgrade => {
    const cost = Math.round(upgrade.baseCost * Math.pow(1.5, upgrade.level));
    const canAfford = gameState.gold >= cost;
    const maxed = upgrade.level >= upgrade.maxLevel;

    const upgradeCard = document.createElement('div');
    upgradeCard.className = 'shop-item';

    upgradeCard.innerHTML = `
      <div class="item-icon">${upgrade.icon}</div>
      <div class="item-info">
        <div class="item-name">${upgrade.name}</div>
        <div class="item-desc">${upgrade.description}</div>
        <div class="item-level">Level: ${upgrade.level}/${upgrade.maxLevel}</div>
        <div class="item-cost ${canAfford ? '' : 'cant-afford'}">
          ${maxed ? 'MAX' : `💰 ${cost}`}
        </div>
      </div>
      <button class="buy-btn ${canAfford && !maxed ? '' : 'disabled'}"
              ${canAfford && !maxed ? '' : 'disabled'}>
        ${maxed ? 'MAX' : 'Upgrade'}
      </button>
    `;

    upgradeCard.querySelector('.buy-btn').addEventListener('click', () => buyUpgrade(upgrade));
    shopUpgrades.appendChild(upgradeCard);
  });
}

function buyUpgrade(upgrade) {
  const cost = Math.round(upgrade.baseCost * Math.pow(1.5, upgrade.level));

  if (gameState.gold >= cost && upgrade.level < upgrade.maxLevel) {
    gameState.gold -= cost;
    upgrade.level++;

    // Apply upgrade effects
    if (upgrade.id === 'auto_attack' && upgrade.level === 1) {
      startAutoAttack();
    } else if (upgrade.id === 'crit_chance') {
      gameState.critChance = upgrade.level * 0.10;
    }

    showNotification(`${upgrade.name} upgraded to level ${upgrade.level}!`);
    updateUI();
    renderUpgrades();
  }
}

function startAutoAttack() {
  if (gameState.autoAttackInterval) return;

  gameState.autoAttackInterval = setInterval(() => {
    if (gameState.currentHero) {
      attack();
    }
  }, 1000);
}

// ============================================
// UI UPDATES
// ============================================

function updateUI() {
  document.getElementById('gold').textContent = Math.round(gameState.gold);
  document.getElementById('level').textContent = gameState.level;
  document.getElementById('dps').textContent = Math.round(calculateTotalDamage());
}

function showNotification(message) {
  // Simple notification in console for now
  console.log(`[NOTIFICATION] ${message}`);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  document.getElementById('attackBtn').addEventListener('click', attack);

  // Shop tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });
}

// ============================================
// START GAME
// ============================================

document.addEventListener('DOMContentLoaded', init);
