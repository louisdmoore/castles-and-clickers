// Dungeon affix definitions — per-run random modifiers (Section 7.3)
// Player sees these before entering the dungeon on the prep screen
// Pair with difficulty slider for combinatorial variety

export const DUNGEON_AFFIXES = {
  fortified: {
    id: 'fortified',
    name: 'Fortified',
    description: 'Monsters have +25% defense',
    icon: 'shield',
    color: '#6366f1',
    effect: {
      monsterStatMultiplier: { defense: 1.25 },
    },
    difficulty: 1,
    weight: 10,
  },
  vampiric: {
    id: 'vampiric',
    name: 'Vampiric',
    description: 'Monsters heal 5% of damage dealt',
    icon: 'heart',
    color: '#dc2626',
    effect: {
      monsterLifesteal: 0.05,
    },
    difficulty: 2,
    weight: 8,
  },
  hasty: {
    id: 'hasty',
    name: 'Haste',
    description: 'Monster speed +30%',
    icon: 'lightning',
    color: '#eab308',
    effect: {
      monsterStatMultiplier: { speed: 1.30 },
    },
    difficulty: 1,
    weight: 10,
  },
  thorny: {
    id: 'thorny',
    name: 'Thorns',
    description: 'Attackers take 10% reflected damage',
    icon: 'thorns',
    color: '#16a34a',
    effect: {
      monsterReflectDamage: 0.10,
    },
    difficulty: 2,
    weight: 8,
  },
  bolstering: {
    id: 'bolstering',
    name: 'Bolstering',
    description: 'Monsters gain +10% stats per room cleared',
    icon: 'arrow_up',
    color: '#f97316',
    effect: {
      monsterScalingPerRoom: 0.10,
    },
    difficulty: 3,
    weight: 6,
  },
  bountiful: {
    id: 'bountiful',
    name: 'Bountiful',
    description: '+50% gold drops',
    icon: 'gold',
    color: '#fbbf24',
    effect: {
      goldDropMultiplier: 1.50,
    },
    difficulty: 0,
    weight: 10,
  },
  enraged: {
    id: 'enraged',
    name: 'Enraged',
    description: 'Monsters have +20% attack',
    icon: 'sword',
    color: '#ef4444',
    effect: {
      monsterStatMultiplier: { attack: 1.20 },
    },
    difficulty: 1,
    weight: 10,
  },
  resilient: {
    id: 'resilient',
    name: 'Resilient',
    description: 'Monsters have +30% HP',
    icon: 'heart_full',
    color: '#22c55e',
    effect: {
      monsterStatMultiplier: { maxHp: 1.30 },
    },
    difficulty: 1,
    weight: 10,
  },
};

// Roll random dungeon affixes for a run
// count: how many affixes to apply (usually 1-2 based on difficulty)
export const rollDungeonAffixes = (count = 1, excludeIds = []) => {
  const available = Object.values(DUNGEON_AFFIXES).filter(
    a => !excludeIds.includes(a.id)
  );

  const picked = [];
  const remaining = [...available];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, a) => sum + a.weight, 0);
    let roll = Math.random() * totalWeight;
    for (let j = 0; j < remaining.length; j++) {
      roll -= remaining[j].weight;
      if (roll <= 0) {
        picked.push(remaining[j]);
        remaining.splice(j, 1);
        break;
      }
    }
  }

  return picked;
};

// Get dungeon affix by ID
export const getDungeonAffix = (id) => DUNGEON_AFFIXES[id];

// Get all dungeon affixes
export const getAllDungeonAffixes = () => Object.values(DUNGEON_AFFIXES);
