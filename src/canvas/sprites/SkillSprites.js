// Skill Sprites - Canvas versions of the pixel art skill icons
// Original icons are 16x16 pixel art, rendered with rectangles

// Cache for rendered skill icons
const skillIconCache = new Map();

// Helper to draw a pixel (rectangle) at scaled position
const P = (ctx, x, y, c, w = 1, h = 1, scale) => {
  ctx.fillStyle = c;
  ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
};

// Skill icon drawing functions - each draws a 16x16 icon scaled to size
const SKILL_ICON_DRAWERS = {
  // === COMBAT SKILLS ===
  power_strike: (ctx, scale) => {
    // Sword
    P(ctx, 3, 2, '#fbbf24', 2, 2, scale);
    P(ctx, 5, 4, '#9ca3af', 2, 2, scale);
    P(ctx, 7, 6, '#9ca3af', 2, 2, scale);
    P(ctx, 9, 8, '#9ca3af', 2, 2, scale);
    P(ctx, 11, 10, '#78350f', 2, 4, scale);
    // Impact lines
    P(ctx, 1, 4, '#fbbf24', 2, 1, scale);
    P(ctx, 2, 6, '#fbbf24', 1, 1, scale);
    P(ctx, 6, 2, '#fbbf24', 1, 2, scale);
  },

  cleave: (ctx, scale) => {
    // Axe blade
    P(ctx, 2, 3, '#9ca3af', 6, 1, scale);
    P(ctx, 3, 4, '#9ca3af', 5, 1, scale);
    P(ctx, 4, 5, '#9ca3af', 4, 1, scale);
    P(ctx, 5, 6, '#9ca3af', 3, 1, scale);
    P(ctx, 6, 7, '#6b7280', 2, 1, scale);
    // Handle
    P(ctx, 7, 8, '#78350f', 2, 6, scale);
    // Arc effect
    P(ctx, 1, 5, '#ef4444', 1, 3, scale);
    P(ctx, 9, 2, '#ef4444', 1, 3, scale);
    P(ctx, 10, 4, '#ef4444', 1, 2, scale);
  },

  shield_bash: (ctx, scale) => {
    // Shield
    P(ctx, 3, 2, '#3b82f6', 8, 10, scale);
    P(ctx, 4, 3, '#60a5fa', 6, 8, scale);
    P(ctx, 6, 5, '#fbbf24', 2, 4, scale);
    // Impact
    P(ctx, 11, 4, '#fbbf24', 2, 1, scale);
    P(ctx, 12, 6, '#fbbf24', 2, 1, scale);
    P(ctx, 11, 8, '#fbbf24', 2, 1, scale);
  },

  taunt: (ctx, scale) => {
    // Angry face
    P(ctx, 3, 3, '#ef4444', 10, 10, scale);
    P(ctx, 4, 4, '#fca5a5', 8, 8, scale);
    // Angry eyebrows
    P(ctx, 4, 5, '#1f2937', 3, 1, scale);
    P(ctx, 9, 5, '#1f2937', 3, 1, scale);
    // Eyes
    P(ctx, 5, 6, '#1f2937', 2, 2, scale);
    P(ctx, 9, 6, '#1f2937', 2, 2, scale);
    // Mouth
    P(ctx, 6, 9, '#1f2937', 4, 2, scale);
  },

  // === MAGIC SKILLS ===
  fireball: (ctx, scale) => {
    // Flame core
    P(ctx, 6, 4, '#ef4444', 4, 6, scale);
    P(ctx, 5, 6, '#ef4444', 6, 4, scale);
    // Inner flame
    P(ctx, 7, 6, '#fbbf24', 2, 4, scale);
    P(ctx, 6, 7, '#f97316', 4, 2, scale);
    // Outer flames
    P(ctx, 5, 3, '#f97316', 2, 2, scale);
    P(ctx, 9, 3, '#f97316', 2, 2, scale);
    P(ctx, 4, 5, '#f97316', 1, 3, scale);
    P(ctx, 11, 5, '#f97316', 1, 3, scale);
    // Trail
    P(ctx, 6, 11, '#fbbf24', 4, 2, scale);
    P(ctx, 7, 13, '#f97316', 2, 1, scale);
  },

  frost_nova: (ctx, scale) => {
    // Center crystal
    P(ctx, 6, 5, '#06b6d4', 4, 6, scale);
    P(ctx, 7, 4, '#22d3ee', 2, 1, scale);
    P(ctx, 7, 11, '#22d3ee', 2, 1, scale);
    // Ice spikes
    P(ctx, 3, 7, '#67e8f9', 3, 2, scale);
    P(ctx, 10, 7, '#67e8f9', 3, 2, scale);
    P(ctx, 7, 2, '#67e8f9', 2, 3, scale);
    P(ctx, 4, 4, '#a5f3fc', 2, 2, scale);
    P(ctx, 10, 4, '#a5f3fc', 2, 2, scale);
    P(ctx, 4, 10, '#a5f3fc', 2, 2, scale);
    P(ctx, 10, 10, '#a5f3fc', 2, 2, scale);
  },

  meteor: (ctx, scale) => {
    // Meteor body
    P(ctx, 8, 2, '#78350f', 5, 5, scale);
    P(ctx, 9, 3, '#92400e', 3, 3, scale);
    // Fire trail
    P(ctx, 5, 5, '#ef4444', 3, 2, scale);
    P(ctx, 3, 6, '#f97316', 3, 2, scale);
    P(ctx, 1, 7, '#fbbf24', 3, 2, scale);
    P(ctx, 6, 7, '#ef4444', 2, 2, scale);
    // Impact zone
    P(ctx, 9, 10, '#dc2626', 4, 3, scale);
    P(ctx, 10, 11, '#fbbf24', 2, 2, scale);
  },

  lightning_bolt: (ctx, scale) => {
    P(ctx, 8, 1, '#fbbf24', 3, 2, scale);
    P(ctx, 6, 3, '#fbbf24', 4, 2, scale);
    P(ctx, 5, 5, '#fef08a', 5, 2, scale);
    P(ctx, 7, 7, '#fbbf24', 3, 2, scale);
    P(ctx, 6, 9, '#fef08a', 4, 2, scale);
    P(ctx, 4, 11, '#fbbf24', 4, 2, scale);
    P(ctx, 3, 13, '#fbbf24', 3, 2, scale);
  },

  chain_lightning: (ctx, scale) => {
    P(ctx, 2, 2, '#fbbf24', 2, 3, scale);
    P(ctx, 4, 4, '#fef08a', 2, 2, scale);
    P(ctx, 6, 5, '#fbbf24', 2, 2, scale);
    P(ctx, 8, 6, '#fef08a', 2, 2, scale);
    P(ctx, 10, 7, '#fbbf24', 2, 2, scale);
    P(ctx, 12, 8, '#fbbf24', 2, 3, scale);
    // Branch
    P(ctx, 6, 8, '#fbbf24', 2, 2, scale);
    P(ctx, 4, 10, '#fef08a', 2, 2, scale);
    P(ctx, 2, 12, '#fbbf24', 2, 2, scale);
  },

  inferno: (ctx, scale) => {
    // Central inferno
    P(ctx, 5, 3, '#dc2626', 6, 10, scale);
    P(ctx, 6, 4, '#ef4444', 4, 8, scale);
    P(ctx, 7, 5, '#fbbf24', 2, 6, scale);
    // Side flames
    P(ctx, 2, 5, '#f97316', 3, 6, scale);
    P(ctx, 11, 5, '#f97316', 3, 6, scale);
    P(ctx, 3, 3, '#ef4444', 2, 3, scale);
    P(ctx, 11, 3, '#ef4444', 2, 3, scale);
    // Top flames
    P(ctx, 6, 1, '#fbbf24', 1, 2, scale);
    P(ctx, 8, 1, '#f97316', 2, 2, scale);
  },

  // === ROGUE SKILLS ===
  backstab: (ctx, scale) => {
    // Dagger
    P(ctx, 7, 1, '#9ca3af', 2, 4, scale);
    P(ctx, 6, 5, '#78350f', 4, 2, scale);
    P(ctx, 7, 7, '#78350f', 2, 2, scale);
    // Shadow figure
    P(ctx, 2, 6, '#1f2937', 4, 6, scale);
    P(ctx, 3, 4, '#1f2937', 2, 2, scale);
    // Blood
    P(ctx, 10, 8, '#dc2626', 2, 2, scale);
    P(ctx, 11, 10, '#dc2626', 2, 2, scale);
  },

  smoke_bomb: (ctx, scale) => {
    // Smoke cloud
    P(ctx, 3, 4, '#6b7280', 10, 8, scale);
    P(ctx, 4, 3, '#9ca3af', 8, 1, scale);
    P(ctx, 5, 2, '#9ca3af', 6, 1, scale);
    P(ctx, 2, 6, '#9ca3af', 2, 4, scale);
    P(ctx, 12, 6, '#9ca3af', 2, 4, scale);
    // Bomb
    P(ctx, 6, 10, '#1f2937', 4, 3, scale);
    P(ctx, 7, 9, '#78350f', 2, 1, scale);
  },

  fan_of_knives: (ctx, scale) => {
    // Multiple knives
    P(ctx, 7, 2, '#9ca3af', 2, 5, scale);
    P(ctx, 3, 4, '#9ca3af', 4, 1, scale);
    P(ctx, 2, 5, '#9ca3af', 3, 1, scale);
    P(ctx, 9, 4, '#9ca3af', 4, 1, scale);
    P(ctx, 11, 5, '#9ca3af', 3, 1, scale);
    P(ctx, 4, 7, '#9ca3af', 3, 1, scale);
    P(ctx, 9, 7, '#9ca3af', 3, 1, scale);
    // Center
    P(ctx, 6, 8, '#1f2937', 4, 4, scale);
  },

  assassinate: (ctx, scale) => {
    // Skull
    P(ctx, 4, 2, '#e5e7eb', 8, 7, scale);
    P(ctx, 5, 3, '#1f2937', 2, 3, scale);
    P(ctx, 9, 3, '#1f2937', 2, 3, scale);
    P(ctx, 6, 7, '#1f2937', 4, 1, scale);
    // Crossed daggers
    P(ctx, 2, 9, '#9ca3af', 5, 1, scale);
    P(ctx, 9, 9, '#9ca3af', 5, 1, scale);
    P(ctx, 1, 10, '#9ca3af', 3, 1, scale);
    P(ctx, 12, 10, '#9ca3af', 3, 1, scale);
    P(ctx, 6, 11, '#dc2626', 4, 1, scale);
  },

  deadly_poison: (ctx, scale) => {
    // Poison bottle
    P(ctx, 5, 2, '#78350f', 6, 2, scale);
    P(ctx, 6, 1, '#78350f', 4, 1, scale);
    P(ctx, 4, 4, '#22c55e', 8, 8, scale);
    P(ctx, 5, 5, '#4ade80', 6, 6, scale);
    // Skull symbol
    P(ctx, 6, 6, '#1f2937', 4, 3, scale);
    P(ctx, 7, 7, '#22c55e', 1, 1, scale);
    P(ctx, 9, 7, '#22c55e', 1, 1, scale);
    // Drips
    P(ctx, 4, 12, '#22c55e', 2, 2, scale);
    P(ctx, 10, 12, '#22c55e', 2, 2, scale);
  },

  // === HEALER SKILLS ===
  heal: (ctx, scale) => {
    // Heart
    P(ctx, 3, 4, '#22c55e', 4, 4, scale);
    P(ctx, 9, 4, '#22c55e', 4, 4, scale);
    P(ctx, 4, 3, '#22c55e', 2, 1, scale);
    P(ctx, 10, 3, '#22c55e', 2, 1, scale);
    P(ctx, 3, 8, '#22c55e', 10, 2, scale);
    P(ctx, 4, 10, '#22c55e', 8, 2, scale);
    P(ctx, 5, 12, '#22c55e', 6, 1, scale);
    P(ctx, 6, 13, '#22c55e', 4, 1, scale);
    P(ctx, 7, 14, '#22c55e', 2, 1, scale);
    // Glow
    P(ctx, 7, 6, '#4ade80', 2, 4, scale);
    P(ctx, 6, 7, '#4ade80', 4, 2, scale);
  },

  revitalize: (ctx, scale) => {
    // Multiple hearts
    P(ctx, 2, 3, '#f472b6', 3, 3, scale);
    P(ctx, 3, 2, '#f472b6', 1, 1, scale);
    P(ctx, 2, 6, '#f472b6', 3, 2, scale);
    P(ctx, 3, 8, '#f472b6', 1, 1, scale);
    // Main heart
    P(ctx, 6, 5, '#22c55e', 4, 4, scale);
    P(ctx, 7, 4, '#22c55e', 2, 1, scale);
    P(ctx, 6, 9, '#22c55e', 4, 2, scale);
    P(ctx, 7, 11, '#22c55e', 2, 1, scale);
    // Sparkles
    P(ctx, 11, 3, '#fbbf24', 2, 2, scale);
    P(ctx, 12, 7, '#fbbf24', 2, 2, scale);
    P(ctx, 10, 11, '#fbbf24', 2, 2, scale);
  },

  divine_shield: (ctx, scale) => {
    // Shield
    P(ctx, 3, 2, '#3b82f6', 10, 11, scale);
    P(ctx, 4, 3, '#60a5fa', 8, 9, scale);
    // Cross
    P(ctx, 7, 4, '#fbbf24', 2, 7, scale);
    P(ctx, 5, 6, '#fbbf24', 6, 2, scale);
    // Glow
    P(ctx, 4, 13, '#93c5fd', 2, 1, scale);
    P(ctx, 10, 13, '#93c5fd', 2, 1, scale);
  },

  smite: (ctx, scale) => {
    // Holy light beam
    P(ctx, 6, 1, '#fef08a', 4, 3, scale);
    P(ctx, 5, 4, '#fbbf24', 6, 4, scale);
    P(ctx, 4, 8, '#f59e0b', 8, 3, scale);
    // Impact
    P(ctx, 3, 11, '#fbbf24', 10, 2, scale);
    P(ctx, 5, 13, '#fef08a', 6, 1, scale);
    // Side rays
    P(ctx, 2, 6, '#fef08a', 2, 1, scale);
    P(ctx, 12, 6, '#fef08a', 2, 1, scale);
  },

  holy_nova: (ctx, scale) => {
    // Central burst
    P(ctx, 6, 6, '#fef08a', 4, 4, scale);
    // Rays
    P(ctx, 7, 2, '#fbbf24', 2, 4, scale);
    P(ctx, 7, 10, '#fbbf24', 2, 4, scale);
    P(ctx, 2, 7, '#fbbf24', 4, 2, scale);
    P(ctx, 10, 7, '#fbbf24', 4, 2, scale);
    // Diagonal rays
    P(ctx, 3, 3, '#f59e0b', 3, 3, scale);
    P(ctx, 10, 3, '#f59e0b', 3, 3, scale);
    P(ctx, 3, 10, '#f59e0b', 3, 3, scale);
    P(ctx, 10, 10, '#f59e0b', 3, 3, scale);
  },

  resurrection: (ctx, scale) => {
    // Angel wings
    P(ctx, 1, 4, '#e5e7eb', 3, 6, scale);
    P(ctx, 12, 4, '#e5e7eb', 3, 6, scale);
    P(ctx, 2, 3, '#d1d5db', 2, 2, scale);
    P(ctx, 12, 3, '#d1d5db', 2, 2, scale);
    // Figure
    P(ctx, 6, 2, '#fef08a', 4, 4, scale);
    P(ctx, 5, 6, '#fbbf24', 6, 6, scale);
    // Halo
    P(ctx, 6, 0, '#fbbf24', 4, 1, scale);
    P(ctx, 5, 1, '#fef08a', 1, 1, scale);
    P(ctx, 10, 1, '#fef08a', 1, 1, scale);
    // Rising effect
    P(ctx, 4, 12, '#a5f3fc', 2, 2, scale);
    P(ctx, 10, 12, '#a5f3fc', 2, 2, scale);
  },

  // === RANGER SKILLS ===
  aimed_shot: (ctx, scale) => {
    // Target reticle
    P(ctx, 5, 5, '#ef4444', 6, 6, scale);
    P(ctx, 6, 6, '#1f2937', 4, 4, scale);
    P(ctx, 7, 7, '#ef4444', 2, 2, scale);
    // Crosshairs
    P(ctx, 7, 2, '#ef4444', 2, 3, scale);
    P(ctx, 7, 11, '#ef4444', 2, 3, scale);
    P(ctx, 2, 7, '#ef4444', 3, 2, scale);
    P(ctx, 11, 7, '#ef4444', 3, 2, scale);
    // Arrow
    P(ctx, 12, 3, '#78350f', 2, 1, scale);
    P(ctx, 13, 2, '#78350f', 1, 3, scale);
  },

  multishot: (ctx, scale) => {
    // Multiple arrows
    P(ctx, 2, 4, '#78350f', 8, 1, scale);
    P(ctx, 1, 3, '#9ca3af', 2, 3, scale);
    P(ctx, 2, 7, '#78350f', 8, 1, scale);
    P(ctx, 1, 6, '#9ca3af', 2, 3, scale);
    P(ctx, 2, 10, '#78350f', 8, 1, scale);
    P(ctx, 1, 9, '#9ca3af', 2, 3, scale);
    // Fletching
    P(ctx, 9, 3, '#dc2626', 3, 1, scale);
    P(ctx, 9, 5, '#dc2626', 3, 1, scale);
    P(ctx, 9, 6, '#dc2626', 3, 1, scale);
    P(ctx, 9, 8, '#dc2626', 3, 1, scale);
    P(ctx, 9, 9, '#dc2626', 3, 1, scale);
    P(ctx, 9, 11, '#dc2626', 3, 1, scale);
  },

  trap: (ctx, scale) => {
    // Bear trap
    P(ctx, 2, 8, '#78716c', 12, 2, scale);
    P(ctx, 3, 6, '#9ca3af', 2, 2, scale);
    P(ctx, 5, 5, '#9ca3af', 2, 3, scale);
    P(ctx, 7, 4, '#9ca3af', 2, 4, scale);
    P(ctx, 9, 5, '#9ca3af', 2, 3, scale);
    P(ctx, 11, 6, '#9ca3af', 2, 2, scale);
    // Teeth
    P(ctx, 4, 7, '#ef4444', 1, 2, scale);
    P(ctx, 6, 7, '#ef4444', 1, 2, scale);
    P(ctx, 8, 7, '#ef4444', 1, 2, scale);
    P(ctx, 10, 7, '#ef4444', 1, 2, scale);
    // Chain
    P(ctx, 6, 10, '#78716c', 4, 1, scale);
    P(ctx, 7, 11, '#57534e', 2, 2, scale);
  },

  rapid_fire: (ctx, scale) => {
    // Speed lines
    P(ctx, 1, 4, '#fbbf24', 4, 1, scale);
    P(ctx, 1, 7, '#fbbf24', 3, 1, scale);
    P(ctx, 1, 10, '#fbbf24', 4, 1, scale);
    // Arrows
    P(ctx, 5, 3, '#78350f', 6, 1, scale);
    P(ctx, 4, 2, '#9ca3af', 2, 3, scale);
    P(ctx, 5, 6, '#78350f', 7, 1, scale);
    P(ctx, 4, 5, '#9ca3af', 2, 3, scale);
    P(ctx, 5, 9, '#78350f', 6, 1, scale);
    P(ctx, 4, 8, '#9ca3af', 2, 3, scale);
    // Bow
    P(ctx, 12, 4, '#78350f', 2, 6, scale);
  },

  volley: (ctx, scale) => {
    // Rain of arrows
    P(ctx, 2, 1, '#78350f', 1, 4, scale);
    P(ctx, 5, 2, '#78350f', 1, 4, scale);
    P(ctx, 8, 1, '#78350f', 1, 4, scale);
    P(ctx, 11, 2, '#78350f', 1, 4, scale);
    P(ctx, 3, 5, '#78350f', 1, 4, scale);
    P(ctx, 6, 6, '#78350f', 1, 4, scale);
    P(ctx, 9, 5, '#78350f', 1, 4, scale);
    P(ctx, 12, 6, '#78350f', 1, 4, scale);
    // Arrowheads
    P(ctx, 1, 5, '#9ca3af', 3, 1, scale);
    P(ctx, 4, 6, '#9ca3af', 3, 1, scale);
    P(ctx, 7, 5, '#9ca3af', 3, 1, scale);
    P(ctx, 10, 6, '#9ca3af', 3, 1, scale);
    // Ground impact
    P(ctx, 2, 12, '#78716c', 12, 2, scale);
  },

  // === NECROMANCER SKILLS ===
  drain_life: (ctx, scale) => {
    // Dark energy stream
    P(ctx, 2, 6, '#7f1d1d', 3, 3, scale);
    P(ctx, 5, 7, '#dc2626', 3, 2, scale);
    P(ctx, 8, 6, '#dc2626', 3, 3, scale);
    P(ctx, 11, 6, '#ef4444', 3, 3, scale);
    // Source (victim)
    P(ctx, 12, 3, '#e5e7eb', 3, 3, scale);
    // Destination (caster)
    P(ctx, 1, 3, '#581c87', 3, 3, scale);
    // Blood drops
    P(ctx, 6, 10, '#dc2626', 2, 2, scale);
    P(ctx, 9, 11, '#dc2626', 2, 2, scale);
  },

  corpse_explosion: (ctx, scale) => {
    // Explosion
    P(ctx, 5, 4, '#dc2626', 6, 6, scale);
    P(ctx, 6, 5, '#f97316', 4, 4, scale);
    P(ctx, 7, 6, '#fbbf24', 2, 2, scale);
    // Debris
    P(ctx, 2, 3, '#e5e7eb', 2, 2, scale);
    P(ctx, 12, 3, '#e5e7eb', 2, 2, scale);
    P(ctx, 2, 11, '#e5e7eb', 2, 2, scale);
    P(ctx, 12, 11, '#e5e7eb', 2, 2, scale);
    P(ctx, 4, 1, '#d1d5db', 2, 2, scale);
    P(ctx, 10, 1, '#d1d5db', 2, 2, scale);
  },

  plague: (ctx, scale) => {
    // Plague cloud
    P(ctx, 3, 4, '#22c55e', 10, 8, scale);
    P(ctx, 4, 3, '#4ade80', 8, 1, scale);
    P(ctx, 5, 2, '#4ade80', 6, 1, scale);
    // Skulls
    P(ctx, 4, 6, '#e5e7eb', 3, 3, scale);
    P(ctx, 5, 7, '#1f2937', 1, 1, scale);
    P(ctx, 9, 6, '#e5e7eb', 3, 3, scale);
    P(ctx, 10, 7, '#1f2937', 1, 1, scale);
    // Drips
    P(ctx, 3, 12, '#22c55e', 2, 2, scale);
    P(ctx, 7, 12, '#22c55e', 2, 3, scale);
    P(ctx, 11, 12, '#22c55e', 2, 2, scale);
  },

  lich_form: (ctx, scale) => {
    // Skull
    P(ctx, 4, 2, '#e5e7eb', 8, 6, scale);
    P(ctx, 5, 3, '#a855f7', 2, 2, scale);
    P(ctx, 9, 3, '#a855f7', 2, 2, scale);
    P(ctx, 6, 6, '#1f2937', 4, 1, scale);
    // Crown
    P(ctx, 4, 0, '#fbbf24', 8, 2, scale);
    // Robe
    P(ctx, 3, 8, '#581c87', 10, 6, scale);
    P(ctx, 4, 9, '#7c3aed', 8, 4, scale);
  },

  // === DRUID/SHAMAN SKILLS ===
  rejuvenation: (ctx, scale) => {
    // Leaf
    P(ctx, 4, 3, '#22c55e', 8, 8, scale);
    P(ctx, 5, 4, '#4ade80', 6, 6, scale);
    // Vein
    P(ctx, 7, 4, '#16a34a', 2, 6, scale);
    P(ctx, 5, 6, '#16a34a', 6, 2, scale);
    // Sparkles
    P(ctx, 2, 2, '#fef08a', 2, 2, scale);
    P(ctx, 12, 2, '#fef08a', 2, 2, scale);
    P(ctx, 2, 11, '#fef08a', 2, 2, scale);
    P(ctx, 12, 11, '#fef08a', 2, 2, scale);
  },

  wild_growth: (ctx, scale) => {
    // Tree
    P(ctx, 5, 2, '#22c55e', 6, 8, scale);
    P(ctx, 4, 4, '#4ade80', 8, 4, scale);
    P(ctx, 3, 6, '#22c55e', 10, 2, scale);
    // Trunk
    P(ctx, 7, 10, '#78350f', 2, 4, scale);
    // Roots
    P(ctx, 5, 13, '#78350f', 2, 1, scale);
    P(ctx, 9, 13, '#78350f', 2, 1, scale);
    // Growth sparkles
    P(ctx, 2, 3, '#fbbf24', 2, 2, scale);
    P(ctx, 12, 3, '#fbbf24', 2, 2, scale);
  },

  tree_of_life: (ctx, scale) => {
    // Large tree
    P(ctx, 4, 1, '#22c55e', 8, 9, scale);
    P(ctx, 3, 3, '#4ade80', 10, 5, scale);
    P(ctx, 5, 2, '#86efac', 6, 2, scale);
    // Trunk
    P(ctx, 6, 10, '#78350f', 4, 5, scale);
    // Healing aura
    P(ctx, 2, 5, '#fef08a', 2, 3, scale);
    P(ctx, 12, 5, '#fef08a', 2, 3, scale);
    // Roots
    P(ctx, 4, 14, '#78350f', 2, 1, scale);
    P(ctx, 10, 14, '#78350f', 2, 1, scale);
  },

  spirit_link: (ctx, scale) => {
    // Spirits
    P(ctx, 2, 4, '#a5b4fc', 4, 5, scale);
    P(ctx, 3, 3, '#c7d2fe', 2, 1, scale);
    P(ctx, 10, 4, '#a5b4fc', 4, 5, scale);
    P(ctx, 11, 3, '#c7d2fe', 2, 1, scale);
    // Link chain
    P(ctx, 6, 5, '#fbbf24', 4, 2, scale);
    P(ctx, 7, 7, '#fbbf24', 2, 2, scale);
    // Eyes
    P(ctx, 3, 5, '#1f2937', 1, 1, scale);
    P(ctx, 11, 5, '#1f2937', 1, 1, scale);
  },

  bloodlust: (ctx, scale) => {
    // Blood drops
    P(ctx, 3, 3, '#dc2626', 3, 4, scale);
    P(ctx, 4, 2, '#dc2626', 1, 1, scale);
    P(ctx, 7, 4, '#dc2626', 3, 5, scale);
    P(ctx, 8, 3, '#dc2626', 1, 1, scale);
    P(ctx, 11, 5, '#dc2626', 3, 4, scale);
    P(ctx, 12, 4, '#dc2626', 1, 1, scale);
    // Energy effect
    P(ctx, 2, 10, '#f97316', 12, 2, scale);
    P(ctx, 4, 12, '#fbbf24', 8, 1, scale);
    P(ctx, 6, 13, '#fef08a', 4, 1, scale);
  },

  // === PASSIVE ICONS ===
  fortitude: (ctx, scale) => {
    // Heart with armor
    P(ctx, 3, 4, '#ef4444', 4, 4, scale);
    P(ctx, 9, 4, '#ef4444', 4, 4, scale);
    P(ctx, 4, 3, '#ef4444', 2, 1, scale);
    P(ctx, 10, 3, '#ef4444', 2, 1, scale);
    P(ctx, 3, 8, '#ef4444', 10, 2, scale);
    P(ctx, 4, 10, '#ef4444', 8, 2, scale);
    P(ctx, 6, 12, '#ef4444', 4, 1, scale);
    P(ctx, 7, 13, '#ef4444', 2, 1, scale);
    // Armor plate
    P(ctx, 6, 5, '#9ca3af', 4, 4, scale);
    P(ctx, 7, 6, '#d1d5db', 2, 2, scale);
  },

  precision: (ctx, scale) => {
    // Target
    P(ctx, 3, 3, '#ef4444', 10, 10, scale);
    P(ctx, 4, 4, '#1f2937', 8, 8, scale);
    P(ctx, 5, 5, '#ef4444', 6, 6, scale);
    P(ctx, 6, 6, '#1f2937', 4, 4, scale);
    P(ctx, 7, 7, '#fbbf24', 2, 2, scale);
  },

  spell_mastery: (ctx, scale) => {
    // Open book
    P(ctx, 2, 4, '#fef3c7', 6, 8, scale);
    P(ctx, 8, 4, '#fef3c7', 6, 8, scale);
    P(ctx, 7, 3, '#78350f', 2, 10, scale);
    // Text lines
    P(ctx, 3, 5, '#374151', 4, 1, scale);
    P(ctx, 3, 7, '#374151', 4, 1, scale);
    P(ctx, 3, 9, '#374151', 4, 1, scale);
    P(ctx, 9, 5, '#374151', 4, 1, scale);
    P(ctx, 9, 7, '#374151', 4, 1, scale);
    P(ctx, 9, 9, '#374151', 4, 1, scale);
    // Magic glow
    P(ctx, 6, 1, '#a855f7', 4, 2, scale);
  },

  // === NEW DRAWERS ===

  threatening_presence: (ctx, scale) => {
    // Angry face with red aura
    P(ctx, 4, 4, '#ef4444', 8, 8, scale);
    P(ctx, 5, 5, '#fca5a5', 6, 6, scale);
    // Eyes
    P(ctx, 6, 6, '#1f2937', 2, 2, scale);
    P(ctx, 10, 6, '#1f2937', 2, 2, scale);
    // Eyebrows
    P(ctx, 5, 5, '#1f2937', 3, 1, scale);
    P(ctx, 9, 5, '#1f2937', 3, 1, scale);
    // Mouth
    P(ctx, 7, 9, '#1f2937', 3, 1, scale);
    // Aura waves
    P(ctx, 2, 3, '#dc2626', 2, 2, scale);
    P(ctx, 12, 3, '#dc2626', 2, 2, scale);
    P(ctx, 1, 7, '#dc2626', 2, 2, scale);
    P(ctx, 13, 7, '#dc2626', 2, 2, scale);
  },

  second_wind: (ctx, scale) => {
    // Wind swirl
    P(ctx, 3, 4, '#93c5fd', 10, 2, scale);
    P(ctx, 2, 6, '#60a5fa', 3, 2, scale);
    P(ctx, 11, 6, '#60a5fa', 3, 2, scale);
    P(ctx, 3, 8, '#93c5fd', 10, 2, scale);
    // Heart in center
    P(ctx, 6, 5, '#22c55e', 2, 2, scale);
    P(ctx, 8, 5, '#22c55e', 2, 2, scale);
    P(ctx, 6, 7, '#22c55e', 4, 2, scale);
    P(ctx, 7, 9, '#22c55e', 2, 1, scale);
    // Wind lines
    P(ctx, 1, 2, '#bfdbfe', 4, 1, scale);
    P(ctx, 1, 11, '#bfdbfe', 4, 1, scale);
  },

  wall: (ctx, scale) => {
    // Brick wall
    P(ctx, 1, 2, '#78716c', 14, 12, scale);
    // Bricks
    P(ctx, 1, 2, '#9ca3af', 4, 3, scale);
    P(ctx, 6, 2, '#a8a29e', 4, 3, scale);
    P(ctx, 11, 2, '#9ca3af', 4, 3, scale);
    P(ctx, 3, 6, '#a8a29e', 4, 3, scale);
    P(ctx, 8, 6, '#9ca3af', 4, 3, scale);
    P(ctx, 1, 10, '#9ca3af', 4, 3, scale);
    P(ctx, 6, 10, '#a8a29e', 4, 3, scale);
    P(ctx, 11, 10, '#9ca3af', 4, 3, scale);
    // Mortar lines
    P(ctx, 5, 2, '#57534e', 1, 3, scale);
    P(ctx, 10, 2, '#57534e', 1, 3, scale);
    P(ctx, 1, 5, '#57534e', 14, 1, scale);
    P(ctx, 7, 6, '#57534e', 1, 3, scale);
    P(ctx, 12, 6, '#57534e', 1, 3, scale);
    P(ctx, 1, 9, '#57534e', 14, 1, scale);
    P(ctx, 5, 10, '#57534e', 1, 3, scale);
    P(ctx, 10, 10, '#57534e', 1, 3, scale);
  },

  rally: (ctx, scale) => {
    // War horn
    P(ctx, 2, 6, '#78350f', 3, 4, scale);
    P(ctx, 5, 5, '#92400e', 4, 6, scale);
    P(ctx, 9, 4, '#a16207', 4, 8, scale);
    P(ctx, 13, 3, '#ca8a04', 2, 10, scale);
    // Sound waves
    P(ctx, 1, 3, '#fbbf24', 1, 2, scale);
    P(ctx, 1, 9, '#fbbf24', 1, 2, scale);
    P(ctx, 3, 2, '#fef08a', 1, 1, scale);
    P(ctx, 3, 11, '#fef08a', 1, 1, scale);
  },

  rhino: (ctx, scale) => {
    // Charging figure
    P(ctx, 4, 4, '#9ca3af', 8, 8, scale);
    P(ctx, 5, 5, '#d1d5db', 6, 6, scale);
    // Horn
    P(ctx, 2, 6, '#fbbf24', 3, 2, scale);
    P(ctx, 1, 7, '#f59e0b', 2, 1, scale);
    // Speed lines
    P(ctx, 12, 5, '#fbbf24', 3, 1, scale);
    P(ctx, 13, 7, '#fbbf24', 2, 1, scale);
    P(ctx, 12, 9, '#fbbf24', 3, 1, scale);
    // Eye
    P(ctx, 5, 6, '#1f2937', 1, 1, scale);
  },

  lifesteal: (ctx, scale) => {
    // Heart
    P(ctx, 5, 4, '#dc2626', 3, 3, scale);
    P(ctx, 8, 4, '#dc2626', 3, 3, scale);
    P(ctx, 5, 7, '#dc2626', 6, 2, scale);
    P(ctx, 6, 9, '#dc2626', 4, 1, scale);
    P(ctx, 7, 10, '#dc2626', 2, 1, scale);
    // Blood drips going up
    P(ctx, 3, 11, '#7f1d1d', 2, 2, scale);
    P(ctx, 11, 11, '#7f1d1d', 2, 2, scale);
    P(ctx, 2, 13, '#7f1d1d', 2, 1, scale);
    P(ctx, 12, 13, '#7f1d1d', 2, 1, scale);
    // Dark aura
    P(ctx, 4, 2, '#581c87', 2, 2, scale);
    P(ctx, 10, 2, '#581c87', 2, 2, scale);
  },

  diamond: (ctx, scale) => {
    // Diamond gem shape
    P(ctx, 7, 1, '#93c5fd', 2, 2, scale);
    P(ctx, 5, 3, '#60a5fa', 6, 2, scale);
    P(ctx, 3, 5, '#3b82f6', 10, 3, scale);
    P(ctx, 4, 8, '#60a5fa', 8, 2, scale);
    P(ctx, 5, 10, '#93c5fd', 6, 2, scale);
    P(ctx, 6, 12, '#bfdbfe', 4, 2, scale);
    P(ctx, 7, 14, '#dbeafe', 2, 1, scale);
    // Shine
    P(ctx, 5, 5, '#dbeafe', 2, 2, scale);
    P(ctx, 8, 7, '#bfdbfe', 1, 1, scale);
  },

  warlord: (ctx, scale) => {
    // Crown
    P(ctx, 3, 2, '#fbbf24', 10, 4, scale);
    P(ctx, 3, 1, '#fbbf24', 2, 1, scale);
    P(ctx, 7, 0, '#fbbf24', 2, 2, scale);
    P(ctx, 11, 1, '#fbbf24', 2, 1, scale);
    P(ctx, 5, 4, '#ca8a04', 2, 1, scale);
    P(ctx, 9, 4, '#ca8a04', 2, 1, scale);
    // Crossed swords below
    P(ctx, 3, 8, '#9ca3af', 5, 1, scale);
    P(ctx, 8, 8, '#9ca3af', 5, 1, scale);
    P(ctx, 2, 9, '#9ca3af', 3, 1, scale);
    P(ctx, 11, 9, '#9ca3af', 3, 1, scale);
    P(ctx, 7, 7, '#9ca3af', 2, 1, scale);
    // Handles
    P(ctx, 1, 10, '#78350f', 2, 3, scale);
    P(ctx, 13, 10, '#78350f', 2, 3, scale);
  },

  juggernaut_heal: (ctx, scale) => {
    // Armored figure
    P(ctx, 5, 2, '#6b7280', 6, 4, scale);
    P(ctx, 6, 1, '#9ca3af', 4, 1, scale);
    P(ctx, 4, 6, '#6b7280', 8, 6, scale);
    P(ctx, 5, 7, '#9ca3af', 6, 4, scale);
    // Shield plate
    P(ctx, 7, 3, '#d1d5db', 2, 2, scale);
    // Arms
    P(ctx, 2, 7, '#6b7280', 2, 4, scale);
    P(ctx, 12, 7, '#6b7280', 2, 4, scale);
    // Legs
    P(ctx, 5, 12, '#6b7280', 2, 3, scale);
    P(ctx, 9, 12, '#6b7280', 2, 3, scale);
    // Glow
    P(ctx, 7, 8, '#22c55e', 2, 2, scale);
  },

  aura: (ctx, scale) => {
    // Radiating circle
    P(ctx, 5, 5, '#fef08a', 6, 6, scale);
    P(ctx, 6, 4, '#fef08a', 4, 1, scale);
    P(ctx, 6, 11, '#fef08a', 4, 1, scale);
    P(ctx, 4, 6, '#fef08a', 1, 4, scale);
    P(ctx, 11, 6, '#fef08a', 1, 4, scale);
    // Center
    P(ctx, 6, 6, '#fbbf24', 4, 4, scale);
    P(ctx, 7, 7, '#fef9c3', 2, 2, scale);
    // Rays
    P(ctx, 3, 3, '#f59e0b', 2, 2, scale);
    P(ctx, 11, 3, '#f59e0b', 2, 2, scale);
    P(ctx, 3, 11, '#f59e0b', 2, 2, scale);
    P(ctx, 11, 11, '#f59e0b', 2, 2, scale);
    P(ctx, 7, 1, '#f59e0b', 2, 2, scale);
    P(ctx, 7, 13, '#f59e0b', 2, 2, scale);
    P(ctx, 1, 7, '#f59e0b', 2, 2, scale);
    P(ctx, 13, 7, '#f59e0b', 2, 2, scale);
  },

  reactive_defense: (ctx, scale) => {
    // Shield
    P(ctx, 3, 2, '#3b82f6', 8, 10, scale);
    P(ctx, 4, 3, '#60a5fa', 6, 8, scale);
    // Return arrow
    P(ctx, 5, 5, '#fbbf24', 4, 2, scale);
    P(ctx, 9, 6, '#fbbf24', 2, 2, scale);
    P(ctx, 5, 8, '#fbbf24', 4, 2, scale);
    P(ctx, 3, 6, '#fef08a', 2, 2, scale);
    // Arrow tip
    P(ctx, 3, 4, '#fef08a', 2, 1, scale);
  },

  holy_fervor: (ctx, scale) => {
    // Sword
    P(ctx, 7, 1, '#d1d5db', 2, 5, scale);
    P(ctx, 5, 6, '#fbbf24', 6, 2, scale);
    P(ctx, 7, 8, '#78350f', 2, 4, scale);
    // Flame aura
    P(ctx, 4, 2, '#f97316', 2, 3, scale);
    P(ctx, 10, 2, '#f97316', 2, 3, scale);
    P(ctx, 3, 4, '#ef4444', 2, 3, scale);
    P(ctx, 11, 4, '#ef4444', 2, 3, scale);
    // Holy sparkles
    P(ctx, 2, 1, '#fef08a', 1, 1, scale);
    P(ctx, 13, 1, '#fef08a', 1, 1, scale);
  },

  hammer: (ctx, scale) => {
    // Hammer head
    P(ctx, 2, 2, '#9ca3af', 6, 4, scale);
    P(ctx, 3, 3, '#d1d5db', 4, 2, scale);
    // Handle
    P(ctx, 7, 6, '#78350f', 2, 8, scale);
    // Impact sparkles
    P(ctx, 1, 5, '#fbbf24', 1, 1, scale);
    P(ctx, 9, 3, '#fbbf24', 1, 1, scale);
    P(ctx, 1, 1, '#fef08a', 1, 1, scale);
    // Grip
    P(ctx, 6, 13, '#92400e', 4, 2, scale);
  },

  redeem: (ctx, scale) => {
    // Heart
    P(ctx, 5, 5, '#ef4444', 3, 3, scale);
    P(ctx, 8, 5, '#ef4444', 3, 3, scale);
    P(ctx, 5, 8, '#ef4444', 6, 2, scale);
    P(ctx, 6, 10, '#ef4444', 4, 1, scale);
    P(ctx, 7, 11, '#ef4444', 2, 1, scale);
    // Wings
    P(ctx, 1, 4, '#e5e7eb', 3, 5, scale);
    P(ctx, 12, 4, '#e5e7eb', 3, 5, scale);
    P(ctx, 2, 3, '#d1d5db', 2, 1, scale);
    P(ctx, 12, 3, '#d1d5db', 2, 1, scale);
    // Halo
    P(ctx, 6, 1, '#fbbf24', 4, 2, scale);
  },

  blessed_ground: (ctx, scale) => {
    // Glowing ground tiles
    P(ctx, 1, 10, '#fef08a', 4, 4, scale);
    P(ctx, 6, 10, '#fde68a', 4, 4, scale);
    P(ctx, 11, 10, '#fef08a', 4, 4, scale);
    // Holy light from above
    P(ctx, 3, 1, '#fbbf24', 2, 4, scale);
    P(ctx, 7, 2, '#fef08a', 2, 3, scale);
    P(ctx, 11, 1, '#fbbf24', 2, 4, scale);
    // Light rays
    P(ctx, 5, 5, '#f59e0b', 1, 5, scale);
    P(ctx, 8, 6, '#f59e0b', 1, 4, scale);
    P(ctx, 12, 5, '#f59e0b', 1, 5, scale);
  },

  avenger: (ctx, scale) => {
    // Winged sword
    P(ctx, 7, 1, '#d1d5db', 2, 6, scale);
    P(ctx, 6, 7, '#fbbf24', 4, 2, scale);
    P(ctx, 7, 9, '#78350f', 2, 4, scale);
    // Wings
    P(ctx, 1, 3, '#fef08a', 5, 4, scale);
    P(ctx, 10, 3, '#fef08a', 5, 4, scale);
    P(ctx, 2, 2, '#fde68a', 3, 1, scale);
    P(ctx, 11, 2, '#fde68a', 3, 1, scale);
    // Tip glow
    P(ctx, 6, 0, '#fef08a', 4, 1, scale);
  },

  counter_attack: (ctx, scale) => {
    // Crossed swords
    P(ctx, 2, 2, '#9ca3af', 2, 2, scale);
    P(ctx, 4, 4, '#d1d5db', 2, 2, scale);
    P(ctx, 6, 6, '#9ca3af', 4, 4, scale);
    P(ctx, 10, 4, '#d1d5db', 2, 2, scale);
    P(ctx, 12, 2, '#9ca3af', 2, 2, scale);
    // Handles
    P(ctx, 1, 11, '#78350f', 3, 3, scale);
    P(ctx, 12, 11, '#78350f', 3, 3, scale);
    P(ctx, 4, 8, '#9ca3af', 2, 2, scale);
    P(ctx, 10, 8, '#9ca3af', 2, 2, scale);
    // Spark at cross
    P(ctx, 7, 7, '#fbbf24', 2, 2, scale);
  },

  armor_up: (ctx, scale) => {
    // Reinforced shield
    P(ctx, 3, 2, '#6b7280', 10, 11, scale);
    P(ctx, 4, 3, '#9ca3af', 8, 9, scale);
    // Rivets
    P(ctx, 5, 4, '#d1d5db', 2, 2, scale);
    P(ctx, 9, 4, '#d1d5db', 2, 2, scale);
    P(ctx, 5, 8, '#d1d5db', 2, 2, scale);
    P(ctx, 9, 8, '#d1d5db', 2, 2, scale);
    // Center plate
    P(ctx, 6, 6, '#e5e7eb', 4, 3, scale);
    // Arrow up overlay
    P(ctx, 7, 5, '#22c55e', 2, 1, scale);
    P(ctx, 6, 6, '#22c55e', 4, 1, scale);
  },

  inner_light: (ctx, scale) => {
    // Glowing figure silhouette
    P(ctx, 6, 2, '#fef08a', 4, 4, scale);
    P(ctx, 5, 6, '#fbbf24', 6, 6, scale);
    P(ctx, 4, 12, '#fbbf24', 2, 2, scale);
    P(ctx, 10, 12, '#fbbf24', 2, 2, scale);
    // Inner glow
    P(ctx, 7, 3, '#fef9c3', 2, 2, scale);
    P(ctx, 6, 7, '#fef08a', 4, 4, scale);
    P(ctx, 7, 8, '#fef9c3', 2, 2, scale);
    // Radiance
    P(ctx, 3, 4, '#f59e0b', 2, 2, scale);
    P(ctx, 11, 4, '#f59e0b', 2, 2, scale);
    P(ctx, 2, 8, '#f59e0b', 2, 2, scale);
    P(ctx, 12, 8, '#f59e0b', 2, 2, scale);
  },

  purify: (ctx, scale) => {
    // Central sparkle burst
    P(ctx, 7, 3, '#fef08a', 2, 3, scale);
    P(ctx, 7, 10, '#fef08a', 2, 3, scale);
    P(ctx, 3, 7, '#fef08a', 3, 2, scale);
    P(ctx, 10, 7, '#fef08a', 3, 2, scale);
    // Center
    P(ctx, 6, 6, '#fef9c3', 4, 4, scale);
    P(ctx, 7, 7, '#ffffff', 2, 2, scale);
    // Small sparkles
    P(ctx, 3, 3, '#fbbf24', 2, 2, scale);
    P(ctx, 11, 3, '#fbbf24', 2, 2, scale);
    P(ctx, 3, 11, '#fbbf24', 2, 2, scale);
    P(ctx, 11, 11, '#fbbf24', 2, 2, scale);
  },

  retribution: (ctx, scale) => {
    // Hammer
    P(ctx, 4, 2, '#9ca3af', 5, 3, scale);
    P(ctx, 5, 3, '#d1d5db', 3, 1, scale);
    P(ctx, 7, 5, '#78350f', 2, 5, scale);
    // Cross overlay
    P(ctx, 6, 7, '#fbbf24', 4, 1, scale);
    P(ctx, 7, 6, '#fbbf24', 2, 3, scale);
    // Holy sparks
    P(ctx, 2, 4, '#fef08a', 1, 1, scale);
    P(ctx, 10, 1, '#fef08a', 1, 1, scale);
    // Base
    P(ctx, 6, 10, '#78350f', 4, 1, scale);
    P(ctx, 5, 11, '#92400e', 6, 3, scale);
  },

  seed: (ctx, scale) => {
    // Sprouting seed
    P(ctx, 5, 10, '#78350f', 6, 4, scale);
    P(ctx, 6, 11, '#92400e', 4, 2, scale);
    // Sprout
    P(ctx, 7, 4, '#22c55e', 2, 6, scale);
    P(ctx, 5, 3, '#4ade80', 2, 2, scale);
    P(ctx, 9, 3, '#4ade80', 2, 2, scale);
    P(ctx, 6, 2, '#86efac', 1, 2, scale);
    P(ctx, 9, 2, '#86efac', 1, 2, scale);
    // Root lines
    P(ctx, 4, 13, '#78350f', 2, 1, scale);
    P(ctx, 10, 13, '#78350f', 2, 1, scale);
    // Sparkle
    P(ctx, 3, 1, '#fef08a', 1, 1, scale);
    P(ctx, 12, 1, '#fef08a', 1, 1, scale);
  },

  tranquility: (ctx, scale) => {
    // Peaceful waves
    P(ctx, 1, 5, '#93c5fd', 14, 2, scale);
    P(ctx, 2, 8, '#60a5fa', 12, 2, scale);
    P(ctx, 3, 11, '#93c5fd', 10, 2, scale);
    // Wave crests
    P(ctx, 3, 4, '#bfdbfe', 3, 1, scale);
    P(ctx, 10, 4, '#bfdbfe', 3, 1, scale);
    P(ctx, 5, 7, '#bfdbfe', 3, 1, scale);
    // Stars/sparkles
    P(ctx, 2, 1, '#fef08a', 1, 1, scale);
    P(ctx, 7, 2, '#fef08a', 2, 1, scale);
    P(ctx, 12, 1, '#fef08a', 1, 1, scale);
  },

  moonfire: (ctx, scale) => {
    // Moon crescent
    P(ctx, 3, 2, '#fef08a', 6, 6, scale);
    P(ctx, 5, 2, '#1f2937', 4, 4, scale);
    P(ctx, 4, 1, '#fef9c3', 2, 2, scale);
    // Fire below
    P(ctx, 6, 9, '#ef4444', 4, 4, scale);
    P(ctx, 7, 8, '#f97316', 2, 2, scale);
    P(ctx, 7, 10, '#fbbf24', 2, 2, scale);
    // Sparkles
    P(ctx, 10, 3, '#fef08a', 2, 2, scale);
    P(ctx, 12, 5, '#fbbf24', 1, 1, scale);
    P(ctx, 2, 8, '#fbbf24', 1, 1, scale);
  },

  totem: (ctx, scale) => {
    // Totem pole
    P(ctx, 5, 1, '#78350f', 6, 13, scale);
    P(ctx, 6, 2, '#92400e', 4, 11, scale);
    // Face 1 (top)
    P(ctx, 6, 3, '#ef4444', 1, 1, scale);
    P(ctx, 9, 3, '#ef4444', 1, 1, scale);
    P(ctx, 7, 4, '#ef4444', 2, 1, scale);
    // Face 2 (middle)
    P(ctx, 6, 7, '#3b82f6', 1, 1, scale);
    P(ctx, 9, 7, '#3b82f6', 1, 1, scale);
    P(ctx, 7, 8, '#3b82f6', 2, 1, scale);
    // Wings
    P(ctx, 3, 3, '#78350f', 2, 2, scale);
    P(ctx, 11, 3, '#78350f', 2, 2, scale);
    // Base
    P(ctx, 4, 14, '#57534e', 8, 2, scale);
  },

  ancestral_guide: (ctx, scale) => {
    // Spirit figure (translucent look)
    P(ctx, 5, 2, '#a5b4fc', 6, 5, scale);
    P(ctx, 6, 1, '#c7d2fe', 4, 1, scale);
    P(ctx, 4, 7, '#818cf8', 8, 6, scale);
    P(ctx, 5, 8, '#a5b4fc', 6, 4, scale);
    // Eyes
    P(ctx, 6, 4, '#fef08a', 1, 1, scale);
    P(ctx, 9, 4, '#fef08a', 1, 1, scale);
    // Wispy trails
    P(ctx, 3, 12, '#818cf8', 2, 2, scale);
    P(ctx, 11, 12, '#818cf8', 2, 2, scale);
    P(ctx, 6, 13, '#a5b4fc', 4, 2, scale);
  },

  earth_shield: (ctx, scale) => {
    // Shield shape from rock
    P(ctx, 3, 2, '#78716c', 10, 11, scale);
    P(ctx, 4, 3, '#a8a29e', 8, 9, scale);
    // Rock texture
    P(ctx, 5, 4, '#d6d3d1', 3, 3, scale);
    P(ctx, 8, 7, '#d6d3d1', 3, 2, scale);
    P(ctx, 5, 9, '#d6d3d1', 2, 2, scale);
    // Green earth energy
    P(ctx, 6, 6, '#22c55e', 4, 3, scale);
    P(ctx, 7, 7, '#4ade80', 2, 1, scale);
    // Bottom point
    P(ctx, 4, 13, '#78716c', 2, 1, scale);
    P(ctx, 10, 13, '#78716c', 2, 1, scale);
  },

  dual_mastery: (ctx, scale) => {
    // Fire orb (left)
    P(ctx, 2, 4, '#ef4444', 5, 5, scale);
    P(ctx, 3, 5, '#f97316', 3, 3, scale);
    P(ctx, 4, 6, '#fbbf24', 1, 1, scale);
    // Ice orb (right)
    P(ctx, 9, 4, '#3b82f6', 5, 5, scale);
    P(ctx, 10, 5, '#60a5fa', 3, 3, scale);
    P(ctx, 11, 6, '#93c5fd', 1, 1, scale);
    // Energy between
    P(ctx, 7, 6, '#a855f7', 2, 2, scale);
    // Spark top
    P(ctx, 7, 1, '#fef08a', 2, 2, scale);
    // Spark bottom
    P(ctx, 7, 11, '#fef08a', 2, 2, scale);
  },

  spirit_walk: (ctx, scale) => {
    // Ghost footprints
    P(ctx, 3, 3, '#a5b4fc', 3, 4, scale);
    P(ctx, 4, 2, '#c7d2fe', 1, 1, scale);
    P(ctx, 8, 6, '#818cf8', 3, 4, scale);
    P(ctx, 9, 5, '#a5b4fc', 1, 1, scale);
    P(ctx, 4, 9, '#6366f1', 3, 4, scale);
    P(ctx, 5, 8, '#818cf8', 1, 1, scale);
    // Wispy trail
    P(ctx, 10, 11, '#a5b4fc', 2, 2, scale);
    P(ctx, 12, 13, '#c7d2fe', 2, 2, scale);
  },

  ascendance: (ctx, scale) => {
    // Rising fire figure
    P(ctx, 5, 8, '#ef4444', 6, 6, scale);
    P(ctx, 6, 5, '#f97316', 4, 4, scale);
    P(ctx, 7, 3, '#fbbf24', 2, 3, scale);
    P(ctx, 7, 1, '#fef08a', 2, 2, scale);
    // Arms of fire
    P(ctx, 3, 6, '#f97316', 2, 4, scale);
    P(ctx, 11, 6, '#f97316', 2, 4, scale);
    // Rising energy
    P(ctx, 2, 10, '#dc2626', 2, 3, scale);
    P(ctx, 12, 10, '#dc2626', 2, 3, scale);
    // Head glow
    P(ctx, 7, 2, '#fef9c3', 2, 1, scale);
  },

  arcane: (ctx, scale) => {
    // Arcane orb
    P(ctx, 4, 4, '#7c3aed', 8, 8, scale);
    P(ctx, 5, 3, '#8b5cf6', 6, 1, scale);
    P(ctx, 5, 12, '#8b5cf6', 6, 1, scale);
    P(ctx, 3, 5, '#8b5cf6', 1, 6, scale);
    P(ctx, 12, 5, '#8b5cf6', 1, 6, scale);
    // Inner glow
    P(ctx, 6, 6, '#a78bfa', 4, 4, scale);
    P(ctx, 7, 7, '#c4b5fd', 2, 2, scale);
    // Sparkles
    P(ctx, 2, 2, '#e9d5ff', 1, 1, scale);
    P(ctx, 13, 2, '#e9d5ff', 1, 1, scale);
    P(ctx, 2, 13, '#e9d5ff', 1, 1, scale);
    P(ctx, 13, 13, '#e9d5ff', 1, 1, scale);
  },

  combustion: (ctx, scale) => {
    // Exploding flame
    P(ctx, 5, 5, '#dc2626', 6, 6, scale);
    P(ctx, 6, 6, '#ef4444', 4, 4, scale);
    P(ctx, 7, 7, '#fbbf24', 2, 2, scale);
    // Explosion rays
    P(ctx, 3, 3, '#f97316', 2, 2, scale);
    P(ctx, 11, 3, '#f97316', 2, 2, scale);
    P(ctx, 3, 11, '#f97316', 2, 2, scale);
    P(ctx, 11, 11, '#f97316', 2, 2, scale);
    P(ctx, 7, 1, '#ef4444', 2, 3, scale);
    P(ctx, 7, 12, '#ef4444', 2, 3, scale);
    P(ctx, 1, 7, '#ef4444', 3, 2, scale);
    P(ctx, 12, 7, '#ef4444', 3, 2, scale);
  },

  pyroblast: (ctx, scale) => {
    // Large fireball
    P(ctx, 3, 3, '#dc2626', 10, 10, scale);
    P(ctx, 4, 4, '#ef4444', 8, 8, scale);
    P(ctx, 5, 5, '#f97316', 6, 6, scale);
    P(ctx, 6, 6, '#fbbf24', 4, 4, scale);
    P(ctx, 7, 7, '#fef08a', 2, 2, scale);
    // Trail
    P(ctx, 5, 13, '#f97316', 2, 2, scale);
    P(ctx, 9, 13, '#f97316', 2, 2, scale);
    P(ctx, 7, 14, '#fbbf24', 2, 1, scale);
  },

  blink: (ctx, scale) => {
    // Teleport dash - figure disappearing
    P(ctx, 2, 3, '#818cf8', 4, 8, scale);
    P(ctx, 3, 2, '#a5b4fc', 2, 1, scale);
    // Reappearing figure
    P(ctx, 10, 3, '#6366f1', 4, 8, scale);
    P(ctx, 11, 2, '#818cf8', 2, 1, scale);
    // Spark trail between
    P(ctx, 6, 5, '#c4b5fd', 1, 1, scale);
    P(ctx, 7, 7, '#e9d5ff', 2, 2, scale);
    P(ctx, 9, 5, '#c4b5fd', 1, 1, scale);
    // Bottom particles
    P(ctx, 3, 12, '#a5b4fc', 1, 1, scale);
    P(ctx, 11, 12, '#818cf8', 1, 1, scale);
  },

  time_warp: (ctx, scale) => {
    // Clock face
    P(ctx, 3, 3, '#6b7280', 10, 10, scale);
    P(ctx, 4, 4, '#e5e7eb', 8, 8, scale);
    // Distorted hands
    P(ctx, 7, 5, '#1f2937', 2, 3, scale);
    P(ctx, 9, 7, '#1f2937', 3, 2, scale);
    // Warp effect - swirling edges
    P(ctx, 2, 2, '#a855f7', 2, 2, scale);
    P(ctx, 12, 2, '#a855f7', 2, 2, scale);
    P(ctx, 2, 12, '#a855f7', 2, 2, scale);
    P(ctx, 12, 12, '#a855f7', 2, 2, scale);
    // Center
    P(ctx, 7, 7, '#ef4444', 2, 2, scale);
    // Warped ring
    P(ctx, 1, 7, '#7c3aed', 2, 2, scale);
    P(ctx, 13, 7, '#7c3aed', 2, 2, scale);
    P(ctx, 7, 1, '#7c3aed', 2, 2, scale);
    P(ctx, 7, 13, '#7c3aed', 2, 2, scale);
  },

  momentum: (ctx, scale) => {
    // Speed blade
    P(ctx, 8, 2, '#9ca3af', 2, 6, scale);
    P(ctx, 9, 1, '#d1d5db', 1, 2, scale);
    P(ctx, 7, 8, '#78350f', 2, 4, scale);
    // Speed lines
    P(ctx, 1, 3, '#fbbf24', 5, 1, scale);
    P(ctx, 2, 5, '#fbbf24', 4, 1, scale);
    P(ctx, 1, 7, '#fbbf24', 5, 1, scale);
    P(ctx, 3, 9, '#fbbf24', 3, 1, scale);
    // Blur effect
    P(ctx, 11, 4, '#d1d5db', 1, 3, scale);
  },

  cheap_shot: (ctx, scale) => {
    // Fist
    P(ctx, 4, 4, '#fde68a', 8, 8, scale);
    P(ctx, 5, 5, '#fcd34d', 6, 6, scale);
    // Knuckles
    P(ctx, 4, 5, '#f59e0b', 2, 2, scale);
    P(ctx, 7, 4, '#f59e0b', 2, 2, scale);
    P(ctx, 10, 5, '#f59e0b', 2, 2, scale);
    // Impact star
    P(ctx, 1, 2, '#ef4444', 2, 2, scale);
    P(ctx, 2, 1, '#ef4444', 1, 1, scale);
    P(ctx, 3, 3, '#fbbf24', 1, 1, scale);
    // Thumb
    P(ctx, 5, 10, '#fde68a', 3, 2, scale);
  },

  crit_bonus: (ctx, scale) => {
    // Dagger
    P(ctx, 3, 2, '#9ca3af', 2, 5, scale);
    P(ctx, 4, 1, '#d1d5db', 1, 2, scale);
    P(ctx, 3, 7, '#78350f', 2, 3, scale);
    // Target circle
    P(ctx, 8, 5, '#ef4444', 6, 6, scale);
    P(ctx, 9, 6, '#1f2937', 4, 4, scale);
    P(ctx, 10, 7, '#ef4444', 2, 2, scale);
    // Crit sparkle
    P(ctx, 7, 3, '#fbbf24', 1, 1, scale);
    P(ctx, 13, 3, '#fbbf24', 1, 1, scale);
  },

  blade_flurry: (ctx, scale) => {
    // Spinning blades
    P(ctx, 6, 2, '#9ca3af', 4, 1, scale);
    P(ctx, 3, 5, '#d1d5db', 1, 4, scale);
    P(ctx, 12, 5, '#d1d5db', 1, 4, scale);
    P(ctx, 6, 13, '#9ca3af', 4, 1, scale);
    // Center spin effect
    P(ctx, 5, 5, '#6b7280', 6, 6, scale);
    P(ctx, 6, 6, '#9ca3af', 4, 4, scale);
    P(ctx, 7, 7, '#d1d5db', 2, 2, scale);
    // Motion arcs
    P(ctx, 4, 3, '#ef4444', 2, 1, scale);
    P(ctx, 10, 3, '#ef4444', 2, 1, scale);
    P(ctx, 4, 12, '#ef4444', 2, 1, scale);
    P(ctx, 10, 12, '#ef4444', 2, 1, scale);
  },

  vendetta: (ctx, scale) => {
    // Marked target - skull with crosshair
    P(ctx, 4, 3, '#e5e7eb', 8, 6, scale);
    P(ctx, 5, 4, '#1f2937', 2, 2, scale);
    P(ctx, 9, 4, '#1f2937', 2, 2, scale);
    P(ctx, 6, 7, '#1f2937', 4, 1, scale);
    // Crosshair overlay
    P(ctx, 7, 1, '#ef4444', 2, 2, scale);
    P(ctx, 7, 9, '#ef4444', 2, 3, scale);
    P(ctx, 2, 5, '#ef4444', 2, 2, scale);
    P(ctx, 12, 5, '#ef4444', 2, 2, scale);
    // X marks
    P(ctx, 3, 11, '#dc2626', 2, 2, scale);
    P(ctx, 11, 11, '#dc2626', 2, 2, scale);
  },

  elusiveness: (ctx, scale) => {
    // Dodge silhouette
    P(ctx, 8, 3, '#6b7280', 4, 8, scale);
    P(ctx, 9, 2, '#9ca3af', 2, 1, scale);
    // After-image
    P(ctx, 4, 4, '#374151', 4, 7, scale);
    P(ctx, 5, 3, '#4b5563', 2, 1, scale);
    // Speed lines
    P(ctx, 1, 5, '#93c5fd', 3, 1, scale);
    P(ctx, 2, 7, '#93c5fd', 2, 1, scale);
    P(ctx, 1, 9, '#93c5fd', 3, 1, scale);
    // Dodge spark
    P(ctx, 12, 4, '#fbbf24', 2, 1, scale);
  },

  kingslayer: (ctx, scale) => {
    // Crown
    P(ctx, 4, 2, '#fbbf24', 8, 3, scale);
    P(ctx, 4, 1, '#fbbf24', 2, 1, scale);
    P(ctx, 7, 0, '#fbbf24', 2, 1, scale);
    P(ctx, 10, 1, '#fbbf24', 2, 1, scale);
    // Skull below
    P(ctx, 5, 6, '#e5e7eb', 6, 5, scale);
    P(ctx, 6, 7, '#1f2937', 1, 2, scale);
    P(ctx, 9, 7, '#1f2937', 1, 2, scale);
    P(ctx, 7, 9, '#1f2937', 2, 1, scale);
    // Blood drip
    P(ctx, 6, 11, '#dc2626', 4, 2, scale);
    P(ctx, 7, 13, '#dc2626', 2, 1, scale);
  },

  shadow_clone: (ctx, scale) => {
    // Original figure
    P(ctx, 2, 3, '#374151', 4, 8, scale);
    P(ctx, 3, 2, '#4b5563', 2, 1, scale);
    // Clone figure
    P(ctx, 10, 3, '#374151', 4, 8, scale);
    P(ctx, 11, 2, '#4b5563', 2, 1, scale);
    // Connection
    P(ctx, 6, 5, '#6366f1', 4, 1, scale);
    P(ctx, 6, 7, '#818cf8', 4, 1, scale);
    P(ctx, 6, 9, '#6366f1', 4, 1, scale);
    // Eyes
    P(ctx, 3, 4, '#a78bfa', 1, 1, scale);
    P(ctx, 11, 4, '#a78bfa', 1, 1, scale);
  },

  sniper: (ctx, scale) => {
    // Scope/crosshair
    P(ctx, 3, 3, '#6b7280', 10, 10, scale);
    P(ctx, 4, 4, '#1f2937', 8, 8, scale);
    // Cross
    P(ctx, 7, 3, '#ef4444', 2, 10, scale);
    P(ctx, 3, 7, '#ef4444', 10, 2, scale);
    // Center dot
    P(ctx, 7, 7, '#fbbf24', 2, 2, scale);
    // Scope rim highlights
    P(ctx, 4, 3, '#9ca3af', 2, 1, scale);
    P(ctx, 10, 3, '#9ca3af', 2, 1, scale);
  },

  disengage: (ctx, scale) => {
    // Leaping figure
    P(ctx, 9, 3, '#6b7280', 4, 6, scale);
    P(ctx, 10, 2, '#9ca3af', 2, 1, scale);
    // Jump arc
    P(ctx, 7, 2, '#93c5fd', 2, 1, scale);
    P(ctx, 5, 3, '#60a5fa', 2, 1, scale);
    P(ctx, 3, 5, '#93c5fd', 2, 1, scale);
    // Landing zone
    P(ctx, 2, 10, '#78716c', 4, 2, scale);
    // Dust
    P(ctx, 1, 8, '#d6d3d1', 2, 1, scale);
    P(ctx, 5, 9, '#d6d3d1', 2, 1, scale);
    // Starting zone
    P(ctx, 10, 10, '#78716c', 4, 2, scale);
  },

  barrage: (ctx, scale) => {
    // Dense arrow rain
    P(ctx, 2, 1, '#78350f', 1, 3, scale);
    P(ctx, 4, 2, '#78350f', 1, 3, scale);
    P(ctx, 6, 1, '#78350f', 1, 3, scale);
    P(ctx, 8, 2, '#78350f', 1, 3, scale);
    P(ctx, 10, 1, '#78350f', 1, 3, scale);
    P(ctx, 12, 2, '#78350f', 1, 3, scale);
    // Arrowheads
    P(ctx, 1, 4, '#9ca3af', 3, 1, scale);
    P(ctx, 3, 5, '#9ca3af', 3, 1, scale);
    P(ctx, 5, 4, '#9ca3af', 3, 1, scale);
    P(ctx, 7, 5, '#9ca3af', 3, 1, scale);
    P(ctx, 9, 4, '#9ca3af', 3, 1, scale);
    P(ctx, 11, 5, '#9ca3af', 3, 1, scale);
    // Impact zone
    P(ctx, 2, 10, '#78716c', 12, 4, scale);
    P(ctx, 4, 9, '#dc2626', 2, 1, scale);
    P(ctx, 8, 9, '#dc2626', 2, 1, scale);
  },

  survival: (ctx, scale) => {
    // Wolf paw print
    P(ctx, 4, 6, '#78716c', 3, 4, scale);
    P(ctx, 9, 6, '#78716c', 3, 4, scale);
    P(ctx, 5, 10, '#78716c', 6, 4, scale);
    // Toe pads
    P(ctx, 3, 3, '#9ca3af', 2, 2, scale);
    P(ctx, 7, 2, '#9ca3af', 2, 2, scale);
    P(ctx, 11, 3, '#9ca3af', 2, 2, scale);
    // Center pad
    P(ctx, 6, 11, '#a8a29e', 4, 2, scale);
  },

  kill_shot: (ctx, scale) => {
    // Skull in crosshair
    P(ctx, 5, 4, '#e5e7eb', 6, 5, scale);
    P(ctx, 6, 5, '#1f2937', 1, 2, scale);
    P(ctx, 9, 5, '#1f2937', 1, 2, scale);
    P(ctx, 7, 7, '#1f2937', 2, 1, scale);
    // Crosshair
    P(ctx, 7, 1, '#ef4444', 2, 3, scale);
    P(ctx, 7, 10, '#ef4444', 2, 3, scale);
    P(ctx, 1, 6, '#ef4444', 3, 2, scale);
    P(ctx, 12, 6, '#ef4444', 3, 2, scale);
    // Corner ticks
    P(ctx, 3, 3, '#ef4444', 2, 1, scale);
    P(ctx, 11, 3, '#ef4444', 2, 1, scale);
  },

  arrow_storm: (ctx, scale) => {
    // Dense arrow rain - more intense than barrage
    P(ctx, 1, 1, '#78350f', 1, 4, scale);
    P(ctx, 3, 0, '#78350f', 1, 4, scale);
    P(ctx, 5, 1, '#78350f', 1, 4, scale);
    P(ctx, 7, 0, '#78350f', 1, 4, scale);
    P(ctx, 9, 1, '#78350f', 1, 4, scale);
    P(ctx, 11, 0, '#78350f', 1, 4, scale);
    P(ctx, 13, 1, '#78350f', 1, 4, scale);
    // Second wave
    P(ctx, 2, 5, '#78350f', 1, 3, scale);
    P(ctx, 6, 4, '#78350f', 1, 3, scale);
    P(ctx, 10, 5, '#78350f', 1, 3, scale);
    // Ground destruction
    P(ctx, 1, 10, '#57534e', 14, 4, scale);
    P(ctx, 3, 9, '#dc2626', 2, 1, scale);
    P(ctx, 7, 9, '#dc2626', 2, 1, scale);
    P(ctx, 11, 9, '#dc2626', 2, 1, scale);
  },

  beast_master: (ctx, scale) => {
    // Wolf head
    P(ctx, 4, 3, '#78716c', 8, 8, scale);
    P(ctx, 5, 4, '#a8a29e', 6, 6, scale);
    // Ears
    P(ctx, 3, 1, '#78716c', 3, 3, scale);
    P(ctx, 10, 1, '#78716c', 3, 3, scale);
    P(ctx, 4, 2, '#a8a29e', 1, 1, scale);
    P(ctx, 11, 2, '#a8a29e', 1, 1, scale);
    // Eyes
    P(ctx, 5, 5, '#fbbf24', 2, 2, scale);
    P(ctx, 9, 5, '#fbbf24', 2, 2, scale);
    // Nose
    P(ctx, 7, 8, '#1f2937', 2, 1, scale);
    // Mouth
    P(ctx, 6, 9, '#1f2937', 4, 1, scale);
    // Fangs
    P(ctx, 6, 10, '#e5e7eb', 1, 1, scale);
    P(ctx, 9, 10, '#e5e7eb', 1, 1, scale);
  },

  soul_siphon: (ctx, scale) => {
    // Ghost wisp
    P(ctx, 5, 2, '#a855f7', 6, 6, scale);
    P(ctx, 6, 1, '#c084fc', 4, 1, scale);
    P(ctx, 6, 3, '#e9d5ff', 4, 3, scale);
    // Eyes
    P(ctx, 6, 4, '#1f2937', 1, 1, scale);
    P(ctx, 9, 4, '#1f2937', 1, 1, scale);
    // Wispy tail
    P(ctx, 4, 8, '#a855f7', 2, 2, scale);
    P(ctx, 8, 8, '#a855f7', 2, 2, scale);
    P(ctx, 6, 9, '#7c3aed', 4, 2, scale);
    // Siphon stream
    P(ctx, 7, 11, '#581c87', 2, 4, scale);
  },

  dark_ritual: (ctx, scale) => {
    // Candles
    P(ctx, 3, 8, '#78350f', 2, 4, scale);
    P(ctx, 11, 8, '#78350f', 2, 4, scale);
    P(ctx, 3, 6, '#fbbf24', 2, 2, scale);
    P(ctx, 11, 6, '#fbbf24', 2, 2, scale);
    // Pentagram
    P(ctx, 6, 10, '#7c3aed', 4, 1, scale);
    P(ctx, 5, 13, '#7c3aed', 6, 1, scale);
    P(ctx, 7, 11, '#a855f7', 2, 2, scale);
    // Dark orb
    P(ctx, 5, 2, '#581c87', 6, 5, scale);
    P(ctx, 6, 3, '#7c3aed', 4, 3, scale);
    P(ctx, 7, 4, '#a855f7', 2, 1, scale);
  },

  undying: (ctx, scale) => {
    // Cracked skull
    P(ctx, 4, 2, '#e5e7eb', 8, 7, scale);
    P(ctx, 5, 1, '#d1d5db', 6, 1, scale);
    // Eye sockets
    P(ctx, 5, 4, '#581c87', 2, 2, scale);
    P(ctx, 9, 4, '#581c87', 2, 2, scale);
    // Crack
    P(ctx, 7, 2, '#374151', 1, 4, scale);
    P(ctx, 8, 5, '#374151', 1, 2, scale);
    // Jaw
    P(ctx, 5, 8, '#d1d5db', 6, 2, scale);
    P(ctx, 6, 8, '#1f2937', 1, 1, scale);
    P(ctx, 9, 8, '#1f2937', 1, 1, scale);
    // Green glow
    P(ctx, 4, 10, '#22c55e', 8, 3, scale);
    P(ctx, 5, 11, '#4ade80', 6, 1, scale);
  },

  necrosis: (ctx, scale) => {
    // Green skull
    P(ctx, 4, 2, '#22c55e', 8, 7, scale);
    P(ctx, 5, 1, '#4ade80', 6, 1, scale);
    // Eye sockets
    P(ctx, 5, 4, '#1f2937', 2, 2, scale);
    P(ctx, 9, 4, '#1f2937', 2, 2, scale);
    // Nose
    P(ctx, 7, 6, '#1f2937', 2, 1, scale);
    // Teeth
    P(ctx, 5, 8, '#4ade80', 6, 2, scale);
    P(ctx, 6, 8, '#1f2937', 1, 1, scale);
    P(ctx, 8, 8, '#1f2937', 1, 1, scale);
    // Poison drips
    P(ctx, 4, 11, '#22c55e', 2, 2, scale);
    P(ctx, 10, 11, '#22c55e', 2, 2, scale);
    P(ctx, 7, 12, '#22c55e', 2, 2, scale);
  },

  army_of_dead: (ctx, scale) => {
    // Multiple skulls
    P(ctx, 1, 4, '#e5e7eb', 4, 4, scale);
    P(ctx, 2, 5, '#1f2937', 1, 1, scale);
    P(ctx, 4, 5, '#1f2937', 1, 1, scale);
    P(ctx, 6, 3, '#e5e7eb', 4, 4, scale);
    P(ctx, 7, 4, '#1f2937', 1, 1, scale);
    P(ctx, 9, 4, '#1f2937', 1, 1, scale);
    P(ctx, 11, 4, '#e5e7eb', 4, 4, scale);
    P(ctx, 12, 5, '#1f2937', 1, 1, scale);
    P(ctx, 14, 5, '#1f2937', 1, 1, scale);
    // Dark ground
    P(ctx, 1, 9, '#581c87', 14, 5, scale);
    P(ctx, 2, 10, '#7c3aed', 12, 3, scale);
    // Hands rising
    P(ctx, 3, 8, '#e5e7eb', 2, 2, scale);
    P(ctx, 8, 8, '#e5e7eb', 2, 2, scale);
    P(ctx, 12, 8, '#e5e7eb', 1, 2, scale);
  },

  raise_dead: (ctx, scale) => {
    // Hand from ground
    P(ctx, 6, 3, '#e5e7eb', 4, 7, scale);
    P(ctx, 7, 2, '#d1d5db', 2, 1, scale);
    // Fingers
    P(ctx, 5, 2, '#e5e7eb', 1, 3, scale);
    P(ctx, 10, 2, '#e5e7eb', 1, 3, scale);
    P(ctx, 6, 1, '#d1d5db', 1, 2, scale);
    P(ctx, 9, 1, '#d1d5db', 1, 2, scale);
    // Ground
    P(ctx, 2, 10, '#57534e', 12, 4, scale);
    P(ctx, 3, 11, '#78716c', 10, 2, scale);
    // Dark energy
    P(ctx, 3, 8, '#581c87', 3, 2, scale);
    P(ctx, 10, 8, '#581c87', 3, 2, scale);
    P(ctx, 5, 9, '#7c3aed', 2, 1, scale);
    P(ctx, 9, 9, '#7c3aed', 2, 1, scale);
  },
};

// Mapping from skill IDs to icon drawer keys
const SKILL_ICON_MAP = {
  // Warrior (13 skills)
  warrior_power_strike: 'power_strike',
  warrior_fortitude: 'fortitude',
  warrior_thick_skin: 'divine_shield',
  warrior_threatening_presence: 'threatening_presence',
  warrior_taunt: 'taunt',
  warrior_shield_bash: 'shield_bash',
  warrior_cleave: 'cleave',
  warrior_iron_will: 'fortitude',
  warrior_second_wind: 'second_wind',
  warrior_shield_wall: 'wall',
  warrior_revenge: 'counter_attack',
  warrior_rallying_cry: 'rally',
  warrior_unstoppable: 'rhino',
  warrior_bloodthirst: 'lifesteal',
  warrior_unbreakable: 'diamond',
  warrior_warlord: 'warlord',
  warrior_juggernaut: 'juggernaut_heal',

  // Paladin (13 skills)
  paladin_divine_shield: 'divine_shield',
  paladin_holy_strength: 'fortitude',
  paladin_blessed_armor: 'divine_shield',
  paladin_aura_of_light: 'aura',
  paladin_consecration: 'holy_nova',
  paladin_lay_on_hands: 'heal',
  paladin_judgment: 'smite',
  paladin_righteous_defense: 'reactive_defense',
  paladin_holy_fervor: 'holy_fervor',
  paladin_aura_of_protection: 'divine_shield',
  paladin_hammer_of_justice: 'hammer',
  paladin_redemption: 'redeem',
  paladin_blessed_ground: 'blessed_ground',
  paladin_zealotry: 'holy_fervor',
  paladin_divine_intervention: 'resurrection',
  paladin_avenger: 'avenger',
  paladin_beacon_of_light: 'aura',

  // Knight (13 skills)
  knight_shield_bash: 'shield_bash',
  knight_heavy_armor: 'divine_shield',
  knight_constitution: 'fortitude',
  knight_stalwart: 'fortitude',
  knight_wall_of_steel: 'divine_shield',
  knight_aggro: 'taunt',
  knight_counter: 'counter_attack',
  knight_fortified: 'armor_up',
  knight_stand_firm: 'armor_up',
  knight_shield_wall: 'divine_shield',
  knight_punish: 'power_strike',
  knight_armor_master: 'armor_up',
  knight_bulwark: 'armor_up',
  knight_retaliation: 'counter_attack',
  knight_unbreakable: 'diamond',
  knight_fortress: 'wall',
  knight_colossus: 'wall',

  // Cleric (13 skills)
  cleric_heal: 'heal',
  cleric_blessed: 'heal',
  cleric_holy_aura: 'holy_nova',
  cleric_inner_light: 'inner_light',
  cleric_smite: 'smite',
  cleric_revitalize: 'revitalize',
  cleric_divine_shield: 'divine_shield',
  cleric_purify: 'purify',
  cleric_meditation: 'inner_light',
  cleric_holy_nova: 'holy_nova',
  cleric_sanctuary: 'divine_shield',
  cleric_guardian_angel: 'reactive_defense',
  cleric_martyr: 'heal',
  cleric_retribution: 'retribution',
  cleric_resurrection: 'resurrection',
  cleric_crusader: 'retribution',
  cleric_radiance: 'aura',

  // Druid (13 skills)
  druid_rejuvenation: 'rejuvenation',
  druid_natural_healing: 'rejuvenation',
  druid_thorns: 'deadly_poison',
  druid_natures_gift: 'seed',
  druid_wild_growth: 'wild_growth',
  druid_regrowth: 'rejuvenation',
  druid_wrath: 'lightning_bolt',
  druid_barkskin: 'divine_shield',
  druid_living_seed: 'seed',
  druid_tranquility: 'tranquility',
  druid_moonfire: 'moonfire',
  druid_natures_swiftness: 'rapid_fire',
  druid_lifebloom: 'rejuvenation',
  druid_overgrowth: 'seed',
  druid_tree_of_life: 'tree_of_life',
  druid_rebirth: 'redeem',
  druid_natures_wrath: 'moonfire',

  // Shaman (13 skills)
  shaman_spirit_link: 'spirit_link',
  shaman_ancestral_power: 'spirit_link',
  shaman_elemental_focus: 'lightning_bolt',
  shaman_totemic_might: 'totem',
  shaman_lightning_bolt: 'lightning_bolt',
  shaman_healing_stream: 'rejuvenation',
  shaman_purge: 'purify',
  shaman_wind_fury: 'rapid_fire',
  shaman_ancestral_guidance: 'ancestral_guide',
  shaman_chain_lightning: 'chain_lightning',
  shaman_mana_tide: 'frost_nova',
  shaman_earth_shield: 'earth_shield',
  shaman_elemental_mastery: 'dual_mastery',
  shaman_spirit_walk: 'spirit_walk',
  shaman_bloodlust: 'bloodlust',
  shaman_ascendance: 'ascendance',
  shaman_spirit_link_totem: 'totem',

  // Mage (13 skills)
  mage_fireball: 'fireball',
  mage_arcane_mind: 'spell_mastery',
  mage_mana_efficiency: 'arcane',
  mage_glass_cannon: 'fireball',
  mage_frost_nova: 'frost_nova',
  mage_meteor: 'meteor',
  mage_mana_shield: 'divine_shield',
  mage_combustion: 'combustion',
  mage_arcane_surge: 'arcane',
  mage_chain_lightning: 'chain_lightning',
  mage_pyroblast: 'pyroblast',
  mage_blink: 'blink',
  mage_elemental_mastery: 'dual_mastery',
  mage_ignite: 'combustion',
  mage_inferno: 'inferno',
  mage_archmage: 'arcane',
  mage_time_warp: 'time_warp',

  // Rogue (13 skills)
  rogue_backstab: 'backstab',
  rogue_quick_feet: 'rapid_fire',
  rogue_precision: 'precision',
  rogue_deadly_momentum: 'momentum',
  rogue_fan_of_knives: 'fan_of_knives',
  rogue_smoke_bomb: 'smoke_bomb',
  rogue_cheap_shot: 'cheap_shot',
  rogue_lethality: 'crit_bonus',
  rogue_blade_flurry: 'blade_flurry',
  rogue_assassinate: 'assassinate',
  rogue_shadow_dance: 'smoke_bomb',
  rogue_deadly_poison: 'deadly_poison',
  rogue_vendetta: 'vendetta',
  rogue_elusiveness: 'elusiveness',
  rogue_death_blossom: 'fan_of_knives',
  rogue_kingslayer: 'kingslayer',
  rogue_shadow_clone: 'shadow_clone',

  // Ranger (13 skills)
  ranger_aimed_shot: 'aimed_shot',
  ranger_eagle_eye: 'precision',
  ranger_swift_quiver: 'rapid_fire',
  ranger_steady_aim: 'sniper',
  ranger_multishot: 'multishot',
  ranger_trap: 'trap',
  ranger_disengage: 'disengage',
  ranger_hunters_mark: 'precision',
  ranger_barrage: 'barrage',
  ranger_piercing_arrow: 'aimed_shot',
  ranger_rapid_fire: 'rapid_fire',
  ranger_volley: 'volley',
  ranger_sniper: 'sniper',
  ranger_survival_instincts: 'survival',
  ranger_kill_shot: 'kill_shot',
  ranger_arrow_storm: 'arrow_storm',
  ranger_beast_master: 'beast_master',

  // Necromancer (13 skills)
  necromancer_drain_life: 'drain_life',
  necromancer_dark_pact: 'drain_life',
  necromancer_bone_armor: 'divine_shield',
  necromancer_soul_siphon: 'soul_siphon',
  necromancer_death_coil: 'drain_life',
  necromancer_curse_of_weakness: 'plague',
  necromancer_corpse_explosion: 'corpse_explosion',
  necromancer_life_tap: 'drain_life',
  necromancer_soul_harvest: 'drain_life',
  necromancer_plague: 'plague',
  necromancer_dark_ritual: 'dark_ritual',
  necromancer_undying: 'undying',
  necromancer_necrosis: 'necrosis',
  necromancer_army_of_dead: 'army_of_dead',
  necromancer_lich_form: 'lich_form',
  necromancer_soul_rend: 'lifesteal',
  necromancer_raise_dead: 'raise_dead',
};

// Get or create cached icon canvas
function getSkillIconCanvas(skillId, size) {
  const iconKey = SKILL_ICON_MAP[skillId] || 'power_strike';
  const cacheKey = `${iconKey}_${size}`;

  if (skillIconCache.has(cacheKey)) {
    return skillIconCache.get(cacheKey);
  }

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Scale factor (icons are 16x16)
  const scale = size / 16;

  // Draw the icon
  const drawer = SKILL_ICON_DRAWERS[iconKey];
  if (drawer) {
    drawer(ctx, scale);
  } else {
    // Fallback to power_strike
    SKILL_ICON_DRAWERS.power_strike(ctx, scale);
  }

  skillIconCache.set(cacheKey, canvas);
  return canvas;
}

// Draw skill icon at position
export function drawSkillIcon(ctx, skillId, x, y, size) {
  const iconCanvas = getSkillIconCanvas(skillId, size);
  ctx.drawImage(iconCanvas, x, y);
}

// Clear cache (call if memory becomes an issue)
export function clearSkillIconCache() {
  skillIconCache.clear();
}
