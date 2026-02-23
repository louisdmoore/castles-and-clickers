// Rarity border/glow CSS class helper
export const getRarityBorderClass = (item) => {
  if (!item) return '';

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
  return item.rarityColor || '#9ca3af';
};
