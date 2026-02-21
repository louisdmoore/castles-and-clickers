// Rarity border/glow CSS class helper
export const getRarityBorderClass = (item) => {
  if (!item) return '';

  // Quality overrides rarity visual
  if (item.quality === 'ascended') return 'rarity-border-ascended';
  if (item.quality === 'infused') return 'rarity-border-infused';

  // Unique items use the existing unique-shimmer system
  if (item.isUnique) return 'unique-shimmer';

  switch (item.rarity) {
    case 'legendary': return 'rarity-border-legendary';
    case 'epic': return 'rarity-border-epic';
    case 'rare': return 'rarity-border-rare';
    case 'uncommon': return 'rarity-border-uncommon';
    default: return 'rarity-border-common';
  }
};

// Get just the rarity color for inline styles
export const getRarityColor = (item) => {
  if (!item) return '#4b5563';
  if (item.quality === 'ascended') return '#f472b6';
  if (item.quality === 'infused') return '#34d399';
  return item.rarityColor || '#9ca3af';
};
