/**
 * Specialization System — 20 subclasses (2 per class, 10 classes).
 * Heroes pick one at level 30. Grants stat adjustments, a passive bonus,
 * and an active ability that flows through the existing skill pipeline.
 *
 * Active abilities use the same format as skill tree skills:
 *   type: 'active', targetType: TARGET_TYPE string, cooldown, effect: { type, ... }
 */

// Minimum level required to specialize
export const SPECIALIZATION_LEVEL = 30;

export const SPECIALIZATIONS = {
  // === WARRIOR ===
  warrior_berserker: {
    id: 'warrior_berserker',
    className: 'warrior',
    name: 'Berserker',
    description: 'Sacrifices defense for devastating offense.',
    statAdjustments: { attack: 0.20, defense: -0.10 },
    passiveBonus: { type: 'stat_percent', stats: { attack: 0.20, defense: -0.10 } },
    activeAbility: {
      id: 'spec_rampage',
      name: 'Rampage',
      description: 'Cleave all enemies for 80% weapon damage.',
      type: 'active',
      targetType: 'all_enemies',
      cooldown: 5,
      effect: { type: 'damage', multiplier: 0.8 },
    },
  },
  warrior_champion: {
    id: 'warrior_champion',
    className: 'warrior',
    name: 'Champion',
    description: 'Inspires allies to fight harder.',
    statAdjustments: { attack: 0.05, defense: 0.05 },
    passiveBonus: { type: 'party_aura', stats: { attack: 0.10 } },
    activeAbility: {
      id: 'spec_rally',
      name: 'Rally',
      description: "Boost all allies' attack by 25% for 3 turns.",
      type: 'active',
      targetType: 'all_allies',
      cooldown: 6,
      effect: { type: 'buff', attackBonus: 0.25, duration: 3 },
    },
  },

  // === KNIGHT ===
  knight_bulwark: {
    id: 'knight_bulwark',
    className: 'knight',
    name: 'Bulwark',
    description: 'An immovable fortress on the battlefield.',
    statAdjustments: { defense: 0.25, maxHp: 0.25 },
    passiveBonus: { type: 'stat_percent', stats: { defense: 0.25, maxHp: 0.25 } },
    activeAbility: {
      id: 'spec_fortress',
      name: 'Fortress',
      description: 'Reduce all damage taken by 50% for 3 turns.',
      type: 'active',
      targetType: 'self',
      cooldown: 7,
      effect: { type: 'buff', damageReduction: 0.50, duration: 3 },
    },
  },
  knight_crusader: {
    id: 'knight_crusader',
    className: 'knight',
    name: 'Crusader',
    description: 'A balanced holy warrior combining offense and defense.',
    statAdjustments: { attack: 0.15, defense: 0.15 },
    passiveBonus: { type: 'stat_percent', stats: { attack: 0.15, defense: 0.15 } },
    activeAbility: {
      id: 'spec_holy_strike',
      name: 'Holy Strike',
      description: 'Smite a foe for 200% damage with holy power.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 5,
      effect: { type: 'damage', multiplier: 2.0 },
    },
  },

  // === PALADIN ===
  paladin_templar: {
    id: 'paladin_templar',
    className: 'paladin',
    name: 'Templar',
    description: 'Strikes with righteous fury, healing with each blow.',
    statAdjustments: { attack: 0.15 },
    passiveBonus: { type: 'on_hit_heal', percent: 10 },
    activeAbility: {
      id: 'spec_smite',
      name: 'Smite',
      description: 'Deal 180% damage and heal self for the amount dealt.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 5,
      effect: { type: 'damage_and_heal', multiplier: 1.8, healPercent: 1.0, healTarget: 'self' },
    },
  },
  paladin_guardian: {
    id: 'paladin_guardian',
    className: 'paladin',
    name: 'Guardian',
    description: 'Projects a divine aura that shields all allies.',
    statAdjustments: { defense: 0.10, maxHp: 0.10 },
    passiveBonus: { type: 'party_aura', stats: { defense: 0.20 } },
    activeAbility: {
      id: 'spec_divine_shield',
      name: 'Divine Shield',
      description: "Shield all allies, reducing damage taken by 33% for 3 turns.",
      type: 'active',
      targetType: 'all_allies',
      cooldown: 7,
      effect: { type: 'buff', damageReduction: 0.33, duration: 3 },
    },
  },

  // === CLERIC ===
  cleric_priest: {
    id: 'cleric_priest',
    className: 'cleric',
    name: 'Priest',
    description: 'Master of healing arts, keeping the whole party alive.',
    statAdjustments: { maxHp: 0.10 },
    passiveBonus: { type: 'healing_bonus', percent: 30 },
    activeAbility: {
      id: 'spec_mass_heal',
      name: 'Mass Heal',
      description: 'Heal all allies for 20% of their max HP.',
      type: 'active',
      targetType: 'all_allies',
      cooldown: 6,
      effect: { type: 'heal', percentage: 0.20 },
    },
  },
  cleric_bishop: {
    id: 'cleric_bishop',
    className: 'cleric',
    name: 'Bishop',
    description: 'Channels holy power into both harm and healing.',
    statAdjustments: { attack: 0.15 },
    passiveBonus: { type: 'stat_percent', stats: { attack: 0.15 } },
    activeAbility: {
      id: 'spec_holy_fire',
      name: 'Holy Fire',
      description: 'Burn a foe for 150% damage and heal lowest ally for 50% of damage dealt.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 5,
      effect: { type: 'damage_and_heal', multiplier: 1.5, healPercent: 0.5, healTarget: 'lowest_ally' },
    },
  },

  // === MAGE ===
  mage_archmage: {
    id: 'mage_archmage',
    className: 'mage',
    name: 'Archmage',
    description: 'Pushes the limits of arcane destruction.',
    statAdjustments: { attack: 0.25 },
    passiveBonus: { type: 'stat_percent', stats: { attack: 0.25 } },
    activeAbility: {
      id: 'spec_meteor',
      name: 'Meteor',
      description: 'Rain fire on all enemies for 100% damage.',
      type: 'active',
      targetType: 'all_enemies',
      cooldown: 6,
      effect: { type: 'damage', multiplier: 1.0 },
    },
  },
  mage_enchanter: {
    id: 'mage_enchanter',
    className: 'mage',
    name: 'Enchanter',
    description: 'Enhances allies with arcane acceleration.',
    statAdjustments: { speed: 0.15 },
    passiveBonus: { type: 'party_aura', stats: { speed: 0.15 } },
    activeAbility: {
      id: 'spec_haste',
      name: 'Haste',
      description: "Boost all allies' speed by 5 for 3 turns.",
      type: 'active',
      targetType: 'all_allies',
      cooldown: 6,
      effect: { type: 'buff', speedBonus: 5, duration: 3 },
    },
  },

  // === NECROMANCER ===
  necromancer_lich: {
    id: 'necromancer_lich',
    className: 'necromancer',
    name: 'Lich',
    description: 'Drains life force to sustain undying power.',
    statAdjustments: { attack: 0.20 },
    passiveBonus: { type: 'lifesteal', percent: 15 },
    activeAbility: {
      id: 'spec_drain_life',
      name: 'Drain Life',
      description: 'Deal 160% damage to a foe and heal self for 100% of damage dealt.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 5,
      effect: { type: 'damage_and_heal', multiplier: 1.6, healPercent: 1.0, healTarget: 'self' },
    },
  },
  necromancer_reaper: {
    id: 'necromancer_reaper',
    className: 'necromancer',
    name: 'Reaper',
    description: 'Strikes from the shadows with lethal precision.',
    statAdjustments: { attack: 0.10, speed: 0.10 },
    passiveBonus: { type: 'crit_bonus', critChance: 0.25 },
    activeAbility: {
      id: 'spec_death_mark',
      name: 'Death Mark',
      description: 'Mark a foe for guaranteed crit dealing 250% damage.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 6,
      effect: { type: 'damage', multiplier: 2.5, alwaysCrit: true },
    },
  },

  // === RANGER ===
  ranger_sharpshooter: {
    id: 'ranger_sharpshooter',
    className: 'ranger',
    name: 'Sharpshooter',
    description: 'Patient and deadly, each shot finds the mark.',
    statAdjustments: { attack: 0.10, speed: 0.05 },
    passiveBonus: { type: 'crit_damage_bonus', percent: 20 },
    activeAbility: {
      id: 'spec_snipe',
      name: 'Snipe',
      description: 'A devastating shot dealing 300% damage to a single target.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 7,
      effect: { type: 'damage', multiplier: 3.0 },
    },
  },
  ranger_warden: {
    id: 'ranger_warden',
    className: 'ranger',
    name: 'Warden',
    description: 'Protects allies with swift covering fire.',
    statAdjustments: { defense: 0.10, speed: 0.05 },
    passiveBonus: { type: 'party_aura', stats: { speed: 0.05 } },
    activeAbility: {
      id: 'spec_barrage',
      name: 'Barrage',
      description: 'Fire a volley hitting up to 3 enemies for 120% damage each.',
      type: 'active',
      targetType: 'all_enemies',
      cooldown: 5,
      effect: { type: 'damage', multiplier: 1.2, maxTargets: 3 },
    },
  },

  // === ROGUE ===
  rogue_assassin: {
    id: 'rogue_assassin',
    className: 'rogue',
    name: 'Assassin',
    description: 'Strikes from the shadows with lethal precision.',
    statAdjustments: { attack: 0.15, speed: 0.10 },
    passiveBonus: { type: 'crit_bonus', critChance: 0.30 },
    activeAbility: {
      id: 'spec_ambush',
      name: 'Ambush',
      description: 'Strike from stealth for 250% damage. Always crits.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 6,
      effect: { type: 'damage', multiplier: 2.5, alwaysCrit: true },
    },
  },
  rogue_shadowblade: {
    id: 'rogue_shadowblade',
    className: 'rogue',
    name: 'Shadowblade',
    description: 'A phantom blade, impossible to pin down.',
    statAdjustments: { speed: 0.20 },
    passiveBonus: { type: 'stat_percent', stats: { speed: 0.20 } },
    activeAbility: {
      id: 'spec_shadow_step',
      name: 'Shadow Step',
      description: 'Teleport and strike for 200% damage, gaining 50% dodge for 2 turns.',
      type: 'active',
      targetType: 'single_enemy',
      cooldown: 5,
      effect: { type: 'damage', multiplier: 2.0, grantEvasion: 0.50, evasionDuration: 2 },
    },
  },

  // === BARD ===
  bard_minstrel: {
    id: 'bard_minstrel',
    className: 'bard',
    name: 'Minstrel',
    description: 'Uplifting melodies that strengthen every ally.',
    statAdjustments: { speed: 0.10 },
    passiveBonus: { type: 'party_aura', stats: { speed: 0.10 } },
    activeAbility: {
      id: 'spec_anthem',
      name: 'Anthem',
      description: "Buff all allies' attack and defense by 15% for 3 turns.",
      type: 'active',
      targetType: 'all_allies',
      cooldown: 7,
      effect: { type: 'buff', attackBonus: 0.15, damageReduction: 0.15, duration: 3 },
    },
  },
  bard_dirge_singer: {
    id: 'bard_dirge_singer',
    className: 'bard',
    name: 'Dirge Singer',
    description: 'Dark melodies that weaken foes.',
    statAdjustments: { attack: 0.20 },
    passiveBonus: { type: 'stat_percent', stats: { attack: 0.20 } },
    activeAbility: {
      id: 'spec_dirge',
      name: 'Dirge',
      description: "Reduce all enemies' defense by 25% for 3 turns.",
      type: 'active',
      targetType: 'all_enemies',
      cooldown: 6,
      effect: { type: 'debuff', damageAmp: 0.25, duration: 3 },
    },
  },

  // === SHAMAN ===
  shaman_stormcaller: {
    id: 'shaman_stormcaller',
    className: 'shaman',
    name: 'Stormcaller',
    description: 'Channels lightning to devastate foes.',
    statAdjustments: { attack: 0.25 },
    passiveBonus: { type: 'stat_percent', stats: { attack: 0.25 } },
    activeAbility: {
      id: 'spec_chain_lightning',
      name: 'Chain Lightning',
      description: 'Lightning bounces between up to 3 enemies, dealing 130% damage to each.',
      type: 'active',
      targetType: 'all_enemies',
      cooldown: 5,
      effect: { type: 'damage', multiplier: 1.3, maxTargets: 3 },
    },
  },
  shaman_spirit_walker: {
    id: 'shaman_spirit_walker',
    className: 'shaman',
    name: 'Spirit Walker',
    description: 'Communes with spirits to heal and protect.',
    statAdjustments: { maxHp: 0.10 },
    passiveBonus: { type: 'party_aura', stats: { maxHp: 0.15 } },
    activeAbility: {
      id: 'spec_spirit_link',
      name: 'Spirit Link',
      description: 'Heal all allies for 15% of their max HP.',
      type: 'active',
      targetType: 'all_allies',
      cooldown: 7,
      effect: { type: 'heal', percentage: 0.15 },
    },
  },
};

/** Get the two specializations available for a class */
export const getSpecsForClass = (classId) => {
  return Object.values(SPECIALIZATIONS).filter(s => s.className === classId);
};

/** Get a specific specialization by ID */
export const getSpecialization = (specId) => {
  return SPECIALIZATIONS[specId] || null;
};
