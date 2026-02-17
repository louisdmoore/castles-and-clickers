// Hero trait definitions — random traits assigned at recruitment
// Traits persist through prestige and ascension (permanent to the hero)
// Applied in calculateHeroStats after base stat calculation
// Trait ID included in stat cache key (traits are immutable per hero)

export const HERO_TRAITS = {
  quick_learner: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: '+15% XP gained',
    effect: { xpMultiplier: 1.15 },
    weight: 10,
  },
  iron_will: {
    id: 'iron_will',
    name: 'Iron Will',
    description: '+10% stun and control resist',
    effect: { controlResist: 0.10 },
    weight: 10,
  },
  glass_cannon: {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: '+20% damage, -15% max HP',
    effect: { damageMultiplier: 1.20, maxHpMultiplier: 0.85 },
    weight: 8,
  },
  tough: {
    id: 'tough',
    name: 'Tough',
    description: '+15% max HP, -5% speed',
    effect: { maxHpMultiplier: 1.15, speedMultiplier: 0.95 },
    weight: 10,
  },
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    description: '+5% crit chance, +5% dodge',
    effect: { critChanceBonus: 0.05, dodgeChance: 0.05 },
    weight: 8,
  },
  steady_hand: {
    id: 'steady_hand',
    name: 'Steady Hand',
    description: '+10% accuracy',
    effect: { accuracyBonus: 0.10 },
    weight: 10,
  },
  resilient: {
    id: 'resilient',
    name: 'Resilient',
    description: '+10% damage reduction',
    effect: { damageReduction: 0.10 },
    weight: 8,
  },
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive',
    description: '+10% attack, -5% defense',
    effect: { attackMultiplier: 1.10, defenseMultiplier: 0.95 },
    weight: 10,
  },
  nimble: {
    id: 'nimble',
    name: 'Nimble',
    description: '+10% speed, +5% dodge',
    effect: { speedMultiplier: 1.10, dodgeChance: 0.05 },
    weight: 10,
  },
  devoted: {
    id: 'devoted',
    name: 'Devoted',
    description: '+15% healing done and received',
    effect: { healingMultiplier: 1.15, healingReceivedMultiplier: 1.15 },
    weight: 8,
  },
  bloodthirsty: {
    id: 'bloodthirsty',
    name: 'Bloodthirsty',
    description: '+5% lifesteal on all attacks',
    effect: { lifesteal: 0.05 },
    weight: 6,
  },
  fortified: {
    id: 'fortified',
    name: 'Fortified',
    description: '+15% defense, -5% attack',
    effect: { defenseMultiplier: 1.15, attackMultiplier: 0.95 },
    weight: 10,
  },
  precise: {
    id: 'precise',
    name: 'Precise',
    description: '+8% crit chance, +15% crit damage',
    effect: { critChanceBonus: 0.08, critDamageBonus: 0.15 },
    weight: 6,
  },
  enduring: {
    id: 'enduring',
    name: 'Enduring',
    description: 'Regenerate 1% max HP per turn',
    effect: { regenPercent: 0.01 },
    weight: 8,
  },
};

// Roll random traits for a new hero (1-2 traits, no duplicates)
export const rollHeroTraits = (count = null) => {
  const traitCount = count ?? (Math.random() < 0.4 ? 2 : 1);
  const pool = Object.values(HERO_TRAITS);

  const picked = [];
  const remaining = [...pool];

  for (let i = 0; i < traitCount && remaining.length > 0; i++) {
    const currentWeight = remaining.reduce((sum, t) => sum + t.weight, 0);
    let roll = Math.random() * currentWeight;
    for (let j = 0; j < remaining.length; j++) {
      roll -= remaining[j].weight;
      if (roll <= 0) {
        picked.push(remaining[j].id);
        remaining.splice(j, 1);
        break;
      }
    }
  }

  return picked;
};

// Get trait by ID
export const getHeroTrait = (id) => HERO_TRAITS[id];

// Get all traits
export const getAllHeroTraits = () => Object.values(HERO_TRAITS);
