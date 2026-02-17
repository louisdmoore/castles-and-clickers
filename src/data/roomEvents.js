// Room event definitions for dungeon variety (Section 7.2)
// 15% chance per room, roughly 1-2 events per 10-room dungeon
// Each event uses existing game systems (combat, gold, buffs, HP, XP, loot)

export const ROOM_EVENT_CHANCE = 0.15;

export const ROOM_EVENTS = {
  trapped_chest: {
    id: 'trapped_chest',
    name: 'Trapped Chest',
    description: 'A glittering chest sits in the corner... but something moves inside.',
    outcome: 'Fight a mimic for bonus loot',
    type: 'combat',
    effect: {
      spawnMiniboss: 'mimic',
      bonusLoot: { dropCount: 2, rarityBonus: 1 },
    },
    weight: 12,
  },
  imprisoned_npc: {
    id: 'imprisoned_npc',
    name: 'Imprisoned Adventurer',
    description: 'A caged adventurer calls for help. Free them to earn their gratitude.',
    outcome: 'Party gains a buff for the rest of the run',
    type: 'buff',
    effect: {
      partyBuff: { stat: 'attack', percent: 0.10, duration: 'run' },
    },
    weight: 10,
  },
  cursed_altar: {
    id: 'cursed_altar',
    name: 'Cursed Altar',
    description: 'A dark altar pulses with energy. It demands a blood offering.',
    outcome: 'Trade 20% current HP for gold',
    type: 'trade',
    effect: {
      hpCostPercent: 0.20,
      goldReward: 500,
    },
    weight: 10,
  },
  healing_spring: {
    id: 'healing_spring',
    name: 'Healing Spring',
    description: 'Crystal-clear water bubbles up from the stone. Its warmth is restorative.',
    outcome: 'Full party heal (once per run)',
    type: 'heal',
    effect: {
      healPercent: 1.0,
      oncePerRun: true,
    },
    weight: 8,
  },
  wandering_merchant: {
    id: 'wandering_merchant',
    name: 'Wandering Merchant',
    description: 'A merchant has set up shop in an unlikely place.',
    outcome: 'Buy a random rare+ item for gold',
    type: 'shop',
    effect: {
      itemMinRarity: 'rare',
      priceMultiplier: 0.8,
    },
    weight: 8,
  },
  monster_ambush: {
    id: 'monster_ambush',
    name: 'Monster Ambush',
    description: 'Enemies pour from the shadows! A double-sized pack attacks!',
    outcome: 'Double monster pack, double XP',
    type: 'combat',
    effect: {
      monsterCountMultiplier: 2,
      xpMultiplier: 2,
    },
    weight: 10,
  },
  ancient_library: {
    id: 'ancient_library',
    name: 'Ancient Library',
    description: 'Dusty tomes line the walls. One hero finds something enlightening.',
    outcome: 'Random hero gains 2x XP this room',
    type: 'buff',
    effect: {
      targetCount: 1,
      xpMultiplier: 2,
      duration: 'room',
    },
    weight: 12,
  },
  crumbling_floor: {
    id: 'crumbling_floor',
    name: 'Crumbling Floor',
    description: 'The ground gives way! The party tumbles to the next room.',
    outcome: 'Skip this room (no loot, no XP, no combat)',
    type: 'skip',
    effect: {
      skipRoom: true,
    },
    weight: 8,
  },
  shrine_of_fortune: {
    id: 'shrine_of_fortune',
    name: 'Shrine of Fortune',
    description: 'A golden statue radiates luck. Offerings are accepted.',
    outcome: 'Pay gold for increased drop rates this run',
    type: 'trade',
    effect: {
      goldCost: 300,
      lootBonusPercent: 0.50,
      duration: 'run',
    },
    weight: 8,
  },
  abandoned_campfire: {
    id: 'abandoned_campfire',
    name: 'Abandoned Campfire',
    description: 'Warm embers and supplies left behind by a previous party.',
    outcome: 'Party heals 30% HP and gains a small speed buff',
    type: 'heal',
    effect: {
      healPercent: 0.30,
      partyBuff: { stat: 'speed', amount: 2, duration: 'run' },
    },
    weight: 10,
  },
};

// Roll for a room event (returns event or null)
export const rollRoomEvent = (usedEvents = []) => {
  if (Math.random() > ROOM_EVENT_CHANCE) return null;

  const available = Object.values(ROOM_EVENTS).filter(e => {
    if (e.effect.oncePerRun && usedEvents.includes(e.id)) return false;
    return true;
  });

  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const event of available) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }
  return available[available.length - 1];
};

// Get event by ID
export const getRoomEvent = (id) => ROOM_EVENTS[id];
