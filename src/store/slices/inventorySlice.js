import { canClassUseEquipment, EQUIPMENT_TEMPLATES, RARITY } from '../../data/equipment';
import { calculateItemScore, calculateSellValue } from '../helpers/itemScoring';
import { invalidateStatCache, calculateHeroStats, setUniqueLevels } from '../helpers/statCalculator';
import { getCollectionForUnique } from '../helpers/heroGenerator';
import { SHOP_CONSUMABLES } from '../../data/consumables';
import { ITEM_AFFIXES, AFFIX_TYPE, rollAffix as rollAffixFromPool, buildAffixedName } from '../../data/itemAffixes';
import { UNIQUE_MAX_LEVEL, UNIQUE_XP_TABLE, AWAKENING_COST, calculateDuplicateValue, getUniqueItem } from '../../data/uniqueItems';
import throttledStorage from '../helpers/throttledStorage';

// Reforge cost curve: escalating per session, resets on dungeon completion
const REFORGE_BASE_COSTS = [2000, 3000, 5000, 8000, 12000];
const getReforgeCostForCount = (count, ascensionCount, locked) => {
  const baseCost = count < 5 ? REFORGE_BASE_COSTS[count] : 12000 + (count - 4) * 5000;
  const ascensionMult = 1 + ascensionCount * 0.5;
  const lockMult = locked ? 2 : 1;
  return Math.floor(baseCost * ascensionMult * lockMult);
};

export const createInventorySlice = (set, get) => ({
  // State
  inventory: [],
  maxInventory: 50,
  reforgeCount: 0,
  consumables: [],
  shopConsumables: [],
  pendingDungeonBuffs: [],
  equipmentSettings: {
    autoSellJunk: true,
    autoEquipUpgrades: true,
    classPriority: {},  // Will be populated with DEFAULT_CLASS_PRIORITY from gameStore.js
  },
  ownedUniques: [],
  uniqueLevels: {}, // templateId -> { xp, level, awakened }
  unreadUniques: [],
  pendingUniqueCelebration: null,
  pendingCollectionMilestone: null,
  lootNotifications: [],

  // Actions
  equipItem: (heroId, item) => {
    set(state => {
      const hero = state.heroes.find(h => h.id === heroId);
      if (!hero) return state;

      // Check class restriction
      if (!canClassUseEquipment(hero.classId, item)) return state;

      const oldItem = hero.equipment[item.slot];
      let newInventory = state.inventory.filter(i => i.id !== item.id);

      // Handle old item - never sell uniques
      let goldGain = 0;
      if (oldItem) {
        if (oldItem.isUnique) {
          // Unique items go to inventory instead of being sold
          if (newInventory.length >= state.maxInventory) {
            // Can't swap - inventory full and unique can't be sold
            return state;
          }
          newInventory = [...newInventory, oldItem];
        } else {
          // Auto-sell non-unique old items
          goldGain = calculateSellValue(oldItem);
        }
      }

      // OPTIMIZATION: Invalidate stat cache when equipment changes
      invalidateStatCache(heroId);

      const heroes = state.heroes.map(h => {
        if (h.id !== heroId) return h;
        return {
          ...h,
          equipment: { ...h.equipment, [item.slot]: item },
        };
      });

      return {
        heroes,
        inventory: newInventory,
        gold: state.gold + goldGain,
      };
    });
  },

  unequipItem: (heroId, slot) => {
    set(state => {
      const hero = state.heroes.find(h => h.id === heroId);
      if (!hero || !hero.equipment[slot]) return state;

      const item = hero.equipment[slot];

      if (state.inventory.length >= state.maxInventory) {
        get().addToast({ type: 'warning', message: 'Inventory full — cannot unequip' });
        return state; // Inventory full
      }

      const heroes = state.heroes.map(h => {
        if (h.id !== heroId) return h;
        return {
          ...h,
          equipment: { ...h.equipment, [slot]: null },
        };
      });

      return {
        heroes,
        inventory: [...state.inventory, item],
      };
    });
  },

  addToInventory: (item) => {
    set(state => {
      if (state.inventory.length >= state.maxInventory) {
        return state;
      }
      return { inventory: [...state.inventory, item] };
    });
  },

  removeFromInventory: (itemId) => {
    const { inventory } = get();
    const item = inventory.find(i => i.id === itemId);
    // Prevent deletion of unique items
    if (item?.isUnique) return;

    set(state => ({
      inventory: state.inventory.filter(i => i.id !== itemId),
    }));
  },

  sellItem: (itemId) => {
    const { inventory } = get();
    const item = inventory.find(i => i.id === itemId);
    if (!item) return 0;

    // Prevent selling unique items
    if (item.isUnique) {
      get().addToast({ type: 'warning', message: 'Cannot sell unique items' });
      return 0;
    }

    const sellValue = calculateSellValue(item);

    set(state => ({
      inventory: state.inventory.filter(i => i.id !== itemId),
      gold: state.gold + sellValue,
      stats: {
        ...state.stats,
        totalGoldEarned: state.stats.totalGoldEarned + sellValue,
      },
    }));

    return sellValue;
  },

  sellAllJunk: () => {
    const { inventory, isUpgradeForAnyHero } = get();
    let totalGold = 0;
    const itemsToKeep = [];
    const itemsToSell = [];

    for (const item of inventory) {
      // Never sell unique items
      if (item.isUnique) {
        itemsToKeep.push(item);
        continue;
      }

      const upgradeCheck = isUpgradeForAnyHero(item);
      if (upgradeCheck.isUpgrade) {
        itemsToKeep.push(item);
      } else {
        itemsToSell.push(item);
        totalGold += calculateSellValue(item);
      }
    }

    if (itemsToSell.length === 0) return { count: 0, gold: 0 };

    set(state => ({
      inventory: itemsToKeep,
      gold: state.gold + totalGold,
      stats: {
        ...state.stats,
        totalGoldEarned: state.stats.totalGoldEarned + totalGold,
      },
    }));

    return { count: itemsToSell.length, gold: totalGold };
  },

  // Consumable actions
  addConsumable: (consumable) => {
    const { consumables } = get();
    // Check max stack (resurrection scroll has max 1)
    const existing = consumables.filter(c => c.templateId === consumable.templateId);
    const maxStack = consumable.maxStack || 1;
    if (existing.length >= maxStack) return false;

    set(state => ({
      consumables: [...state.consumables, consumable],
    }));
    return true;
  },

  removeConsumable: (consumableId) => {
    set(state => ({
      consumables: state.consumables.filter(c => c.id !== consumableId),
    }));
  },

  hasResurrectionScroll: () => {
    const { consumables } = get();
    return consumables.find(c => c.templateId === 'resurrectionScroll') || null;
  },

  useResurrectionScroll: () => {
    const { consumables } = get();
    const scroll = consumables.find(c => c.templateId === 'resurrectionScroll');
    if (!scroll) return null;

    set(state => ({
      consumables: state.consumables.filter(c => c.id !== scroll.id),
    }));

    return scroll;
  },

  clearConsumables: () => {
    set({ consumables: [] });
  },

  // Shop consumable actions
  useShopConsumable: (consumableId, targetHeroId) => {
    const { shopConsumables, heroes, heroHp, getHomesteadBonuses } = get();
    const consumable = shopConsumables.find(c => c.id === consumableId);
    if (!consumable) return false;

    const template = SHOP_CONSUMABLES[consumable.templateId];
    if (!template) return false;

    if (template.effect.type === 'heal') {
      // Healing potions apply immediately to a hero
      const hero = heroes.find(h => h.id === targetHeroId);
      if (!hero) return false;

      const homesteadBonuses = getHomesteadBonuses();
      const stats = calculateHeroStats(hero, heroes, homesteadBonuses);
      const maxHp = stats.maxHp;
      const currentHp = heroHp[targetHeroId] ?? maxHp;
      if (currentHp >= maxHp) return false; // Already full HP

      const healAmount = Math.floor(maxHp * template.effect.percent);
      const newHp = Math.min(maxHp, currentHp + healAmount);

      set(state => ({
        shopConsumables: state.shopConsumables.filter(c => c.id !== consumableId),
        heroHp: { ...state.heroHp, [targetHeroId]: newHp },
      }));
      return true;
    }

    // XP scrolls and elixirs → move to pendingDungeonBuffs
    set(state => ({
      shopConsumables: state.shopConsumables.filter(c => c.id !== consumableId),
      pendingDungeonBuffs: [...state.pendingDungeonBuffs, {
        id: consumable.id,
        templateId: consumable.templateId,
        effect: template.effect,
        name: template.name,
      }],
    }));
    return true;
  },

  getShopConsumableCount: (templateId) => {
    const { shopConsumables } = get();
    return shopConsumables.filter(c => c.templateId === templateId).length;
  },

  // Update equipment settings
  updateEquipmentSettings: (updates) => {
    set(state => ({
      equipmentSettings: { ...state.equipmentSettings, ...updates },
    }));
  },

  // Update class priority
  setClassPriority: (classId, priority) => {
    set(state => ({
      equipmentSettings: {
        ...state.equipmentSettings,
        classPriority: {
          ...state.equipmentSettings.classPriority,
          [classId]: priority,
        },
      },
    }));
  },

  // Check if an item is an upgrade for any hero
  isUpgradeForAnyHero: (item) => {
    const { heroes, equipmentSettings } = get();

    for (const hero of heroes) {
      if (!canClassUseEquipment(hero.classId, item)) continue;

      const priority = equipmentSettings.classPriority[hero.classId] || 'balanced';
      const currentItem = hero.equipment[item.slot];
      const currentScore = currentItem ? calculateItemScore(currentItem, priority) : 0;
      const newScore = calculateItemScore(item, priority);

      if (newScore > currentScore) {
        return { isUpgrade: true, hero, improvement: newScore - currentScore };
      }
    }

    return { isUpgrade: false };
  },

  // Process a loot drop with smart auto-sell and auto-equip
  processLootDrop: (item) => {
    // Track rarity stats for achievements
    if (item.rarity === 'rare' || item.rarity === 'epic') {
      set(state => ({
        stats: {
          ...state.stats,
          rareItemsFound: (state.stats.rareItemsFound || 0) + (item.rarity === 'rare' ? 1 : 0),
          epicItemsFound: (state.stats.epicItemsFound || 0) + (item.rarity === 'epic' ? 1 : 0),
        },
      }));
    }

    const {
      equipmentSettings,
      inventory,
      maxInventory,
    } = get();

    // Check if this item is an upgrade for anyone
    const upgradeCheck = get().isUpgradeForAnyHero(item);

    // If auto-equip is on and item is an upgrade, equip or suggest
    // Never auto-replace unique items - they're too valuable
    if (equipmentSettings.autoEquipUpgrades && upgradeCheck.isUpgrade && upgradeCheck.hero && !upgradeCheck.hero.equipment[item.slot]?.isUnique) {
      const hero = upgradeCheck.hero;
      const oldItem = hero.equipment[item.slot];

      // Smart auto-equip: suggest + confirm for meaningful items, silent for trivial upgrades
      const isRarePlus = item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary';
      const isCloseCall = oldItem && (() => {
        const priority = equipmentSettings.classPriority[hero.classId] || 'balanced';
        const currentScore = calculateItemScore(oldItem, priority);
        const newScore = calculateItemScore(item, priority);
        return currentScore > 0 && (newScore - currentScore) / currentScore < 0.10;
      })();

      if ((isRarePlus || isCloseCall) && get().inventory.length < maxInventory) {
        // Add to inventory and suggest instead of auto-equipping
        const comparison = get().compareToEquipped(item, hero.id);
        set(state => ({
          inventory: [...state.inventory, item],
          stats: {
            ...state.stats,
            totalItemsLooted: (state.stats.totalItemsLooted || 0) + 1,
          },
        }));
        get().addLootNotification({
          type: 'suggest-equip',
          item,
          hero,
          oldItem,
          comparison,
        });
        return { action: 'suggested', hero };
      }

      // Below threshold or inventory full — auto-equip silently
      let goldGain = 0;

      // Handle old item - never sell uniques, sell if autoSellJunk, otherwise add to inventory
      if (oldItem) {
        // Never auto-sell unique items - always keep them
        if (oldItem.isUnique) {
          if (inventory.length < maxInventory) {
            set(state => ({
              inventory: [...state.inventory, oldItem],
            }));
          }
          // If inventory full, unique stays in inventory (don't lose it)
        } else if (equipmentSettings.autoSellJunk) {
          goldGain = calculateSellValue(oldItem);
        } else if (inventory.length < maxInventory) {
          set(state => ({
            inventory: [...state.inventory, oldItem],
          }));
        }
      }

      // Equip the new item
      set(state => ({
        heroes: state.heroes.map(h =>
          h.id === hero.id
            ? { ...h, equipment: { ...h.equipment, [item.slot]: item } }
            : h
        ),
        gold: state.gold + goldGain,
        stats: {
          ...state.stats,
          totalItemsLooted: (state.stats.totalItemsLooted || 0) + 1,
          totalGoldEarned: goldGain > 0 ? state.stats.totalGoldEarned + goldGain : state.stats.totalGoldEarned,
        },
      }));

      get().addLootNotification({
        type: 'auto-equipped',
        item,
        hero,
        oldItem,
        goldGain,
      });
      return { action: 'equipped', hero, oldItem };
    }

    // If auto-sell junk is on and item is not an upgrade, sell it (but never sell uniques)
    if (equipmentSettings.autoSellJunk && !upgradeCheck.isUpgrade && !item.isUnique) {
      const goldValue = calculateSellValue(item);
      set(state => ({
        gold: state.gold + goldValue,
        stats: {
          ...state.stats,
          totalItemsLooted: (state.stats.totalItemsLooted || 0) + 1,
          totalGoldEarned: state.stats.totalGoldEarned + goldValue,
        },
      }));
      get().addLootNotification({
        type: 'auto-sold',
        item,
        gold: goldValue,
      });
      return { action: 'sold', gold: goldValue };
    }

    // Add to inventory if space available (use fresh state to avoid stale snapshot)
    if (get().inventory.length < maxInventory) {
      set(state => ({
        inventory: [...state.inventory, item],
        stats: {
          ...state.stats,
          totalItemsLooted: (state.stats.totalItemsLooted || 0) + 1,
        },
      }));
      get().addLootNotification({
        type: 'looted',
        item,
        upgradeFor: upgradeCheck.isUpgrade ? upgradeCheck.hero : null,
      });
      return { action: 'looted', upgradeFor: upgradeCheck.hero };
    }

    // Inventory full
    get().addLootNotification({ type: 'inventory-full', item });
    return { action: 'lost' };
  },

  // Process a unique item drop - handles duplicates (fusion), tracking, etc.
  processUniqueDrop: (uniqueItem) => {
    const { ownedUniques, uniqueLevels, inventory, maxInventory } = get();

    // Check if we already own this unique
    const templateId = uniqueItem.templateId || uniqueItem.id;
    if (ownedUniques.includes(templateId)) {
      // Duplicate — fuse to advance level
      const currentData = uniqueLevels[templateId] || { xp: 0, level: 1, awakened: false };

      if (currentData.level < UNIQUE_MAX_LEVEL) {
        // Fusion: advance one level
        const newLevel = currentData.level + 1;
        const newUniqueLevels = {
          ...uniqueLevels,
          [templateId]: { ...currentData, level: newLevel },
        };

        set({
          uniqueLevels: newUniqueLevels,
        });

        // Update module-level cache for stat scaling
        setUniqueLevels(newUniqueLevels);

        // Immediate save on fusion
        throttledStorage.flush();

        get().addLootNotification({
          type: 'unique-fused',
          item: uniqueItem,
          newLevel,
        });

        return { action: 'fused', newLevel };
      } else {
        // Already max level — convert to gold
        const { gold: goldValue } = calculateDuplicateValue(templateId);

        set(state => ({
          gold: state.gold + goldValue,
          stats: {
            ...state.stats,
            totalGoldEarned: state.stats.totalGoldEarned + goldValue,
          },
        }));

        get().addLootNotification({
          type: 'unique-duplicate',
          item: uniqueItem,
          gold: goldValue,
        });

        return { action: 'duplicate', gold: goldValue };
      }
    }

    // New unique - add to collection, initialize level, and add to inventory
    const newUniqueLevels = {
      ...uniqueLevels,
      [templateId]: { xp: 0, level: 1, awakened: false },
    };

    if (inventory.length < maxInventory) {
      set(state => ({
        ownedUniques: [...state.ownedUniques, templateId],
        uniqueLevels: newUniqueLevels,
        unreadUniques: [...state.unreadUniques, uniqueItem.id],
        inventory: [...state.inventory, uniqueItem],
        stats: {
          ...state.stats,
          totalItemsLooted: (state.stats.totalItemsLooted || 0) + 1,
        },
      }));
    } else {
      // Inventory full but still track ownership
      set(state => ({
        ownedUniques: [...state.ownedUniques, templateId],
        uniqueLevels: newUniqueLevels,
        unreadUniques: [...state.unreadUniques, uniqueItem.id],
        inventory: [...state.inventory.slice(1), uniqueItem], // Remove oldest item
        stats: {
          ...state.stats,
          totalItemsLooted: (state.stats.totalItemsLooted || 0) + 1,
        },
      }));
    }

    // Update module-level cache
    setUniqueLevels(newUniqueLevels);

    // Immediate save on unique item drop
    throttledStorage.flush();

    get().addLootNotification({
      type: 'unique-drop',
      item: uniqueItem,
    });

    // Trigger celebration modal for new unique
    get().triggerUniqueCelebration(uniqueItem);
    get().checkCollectionMilestone(templateId);

    return { action: 'unique-looted', item: uniqueItem };
  },

  markUniqueRead: (itemId) => {
    set(state => ({
      unreadUniques: state.unreadUniques.filter(id => id !== itemId),
    }));
  },

  markAllUniquesRead: () => {
    set({ unreadUniques: [] });
  },

  triggerUniqueCelebration: (item) => {
    set({ pendingUniqueCelebration: item });
  },

  clearUniqueCelebration: () => {
    const { pendingRaidRecap } = get();
    set({ pendingUniqueCelebration: null });
    // Show milestone if no raid recap waiting
    if (!pendingRaidRecap) {
      get().showPendingMilestone();
    }
  },

  checkCollectionMilestone: (templateId) => {
    const { ownedUniques } = get();
    const collection = getCollectionForUnique(templateId);
    if (!collection) return;

    const ownedCount = collection.uniques.filter(id => ownedUniques.includes(id)).length;
    const isComplete = ownedCount === collection.uniques.length;

    set({
      pendingCollectionMilestone: {
        collectionName: collection.name,
        owned: ownedCount,
        total: collection.uniques.length,
        isComplete,
      },
    });
  },

  showPendingMilestone: () => {
    const { pendingCollectionMilestone } = get();
    if (!pendingCollectionMilestone) return;

    get().addLootNotification({
      type: 'collection-milestone',
      ...pendingCollectionMilestone,
    });
    set({ pendingCollectionMilestone: null });
  },

  ownsUnique: (templateId) => {
    const { ownedUniques } = get();
    return ownedUniques.includes(templateId);
  },

  // Get unique level data (returns { xp, level, awakened } or default)
  getUniqueLevel: (templateId) => {
    const { uniqueLevels } = get();
    return uniqueLevels[templateId] || { xp: 0, level: 1, awakened: false };
  },

  // Grant XP to a unique item. Returns { leveled, newLevel } if the unique leveled up.
  gainUniqueXp: (templateId, amount) => {
    const { uniqueLevels, ownedUniques } = get();
    if (!ownedUniques.includes(templateId)) return null;

    const current = uniqueLevels[templateId] || { xp: 0, level: 1, awakened: false };
    if (current.level >= UNIQUE_MAX_LEVEL) return null;

    let newXp = current.xp + amount;
    let newLevel = current.level;

    // Check for level-ups (can gain multiple levels at once)
    while (newLevel < UNIQUE_MAX_LEVEL && newXp >= UNIQUE_XP_TABLE[newLevel]) {
      newXp -= UNIQUE_XP_TABLE[newLevel];
      newLevel++;
    }
    // Cap XP at 0 if max level reached
    if (newLevel >= UNIQUE_MAX_LEVEL) newXp = 0;

    const leveled = newLevel > current.level;
    const newUniqueLevels = {
      ...uniqueLevels,
      [templateId]: { ...current, xp: newXp, level: newLevel },
    };

    set({ uniqueLevels: newUniqueLevels });

    // Update module-level cache for stat scaling
    if (leveled) {
      setUniqueLevels(newUniqueLevels);
    }

    return leveled ? { leveled: true, newLevel } : null;
  },

  // Awaken a max-level unique by spending essence
  awakenUnique: (templateId) => {
    const { uniqueLevels, ownedUniques, essence } = get();
    if (!ownedUniques.includes(templateId)) {
      get().addToast({ type: 'error', message: 'You do not own this unique' });
      return false;
    }

    const current = uniqueLevels[templateId] || { xp: 0, level: 1, awakened: false };
    if (current.level < UNIQUE_MAX_LEVEL) {
      get().addToast({ type: 'error', message: 'Unique must be max level to awaken' });
      return false;
    }
    if (current.awakened) {
      get().addToast({ type: 'warning', message: 'Already awakened' });
      return false;
    }
    if ((essence || 0) < AWAKENING_COST) {
      get().addToast({ type: 'error', message: `Not enough essence (need ${AWAKENING_COST})` });
      return false;
    }

    const item = getUniqueItem(templateId);
    const newUniqueLevels = {
      ...uniqueLevels,
      [templateId]: { ...current, awakened: true },
    };

    set({
      uniqueLevels: newUniqueLevels,
      essence: (essence || 0) - AWAKENING_COST,
    });

    // Update module-level cache for stat scaling
    setUniqueLevels(newUniqueLevels);

    get().addToast({
      type: 'success',
      message: `${item?.name || 'Unique'} has been awakened!`,
    });

    throttledStorage.flush();
    return true;
  },

  getItemScoreForHero: (item, heroId) => {
    const { heroes, equipmentSettings } = get();
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return 0;
    const priority = equipmentSettings.classPriority[hero.classId] || 'balanced';
    return calculateItemScore(item, priority);
  },

  compareToEquipped: (item, heroId) => {
    const { heroes, equipmentSettings } = get();
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return null;

    const priority = equipmentSettings.classPriority[hero.classId] || 'balanced';
    const currentItem = hero.equipment[item.slot];
    const currentScore = currentItem ? calculateItemScore(currentItem, priority) : 0;
    const newScore = calculateItemScore(item, priority);

    // Calculate per-stat differences
    const statDiff = {};
    const allStats = new Set([
      ...Object.keys(item.stats),
      ...(currentItem ? Object.keys(currentItem.stats) : []),
    ]);

    for (const stat of allStats) {
      const newVal = item.stats[stat] || 0;
      const oldVal = currentItem?.stats[stat] || 0;
      if (newVal !== oldVal) {
        statDiff[stat] = newVal - oldVal;
      }
    }

    return {
      currentItem,
      scoreDiff: newScore - currentScore,
      statDiff,
      isBetter: newScore > currentScore,
    };
  },

  // Add loot notification
  addLootNotification: (notification) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    set(state => ({
      lootNotifications: [
        ...state.lootNotifications.slice(-9), // Keep last 10
        { ...notification, id, timestamp: Date.now() },
      ],
    }));
  },

  removeLootNotification: (id) => {
    set(state => ({
      lootNotifications: state.lootNotifications.filter(n => n.id !== id),
    }));
  },

  clearOldNotifications: () => {
    const now = Date.now();
    set(state => ({
      lootNotifications: state.lootNotifications.filter(
        n => now - n.timestamp < (n.type === 'suggest-equip' ? 9000 : 5000)
      ),
    }));
  },

  // Reforging / Enchantment
  getReforgeCost: (locked = false) => {
    const { reforgeCount, ascension } = get();
    return getReforgeCostForCount(reforgeCount, ascension?.count || 0, locked);
  },

  reforgeItem: (itemId, lockedAffixIndex = null) => {
    const { gold, heroes, inventory } = get();

    // Find item — check equipped items first, then inventory
    let item = null;
    let equippedHeroId = null;
    let equippedSlot = null;

    for (const hero of heroes.filter(Boolean)) {
      for (const slot of ['weapon', 'armor', 'accessory']) {
        if (hero.equipment[slot]?.id === itemId) {
          item = hero.equipment[slot];
          equippedHeroId = hero.id;
          equippedSlot = slot;
          break;
        }
      }
      if (item) break;
    }

    if (!item) {
      item = inventory.find(i => i.id === itemId);
    }

    if (!item || item.isUnique) {
      get().addToast({ type: 'error', message: 'Cannot reforge this item' });
      return false;
    }

    // Must be rare+ to reforge
    if (!['rare', 'epic', 'legendary'].includes(item.rarity)) {
      get().addToast({ type: 'error', message: 'Only rare+ items can be reforged' });
      return false;
    }

    // Calculate cost
    const hasLock = lockedAffixIndex !== null && item.affixes?.[lockedAffixIndex];
    const cost = get().getReforgeCost(!!hasLock);

    if (gold < cost) {
      get().addToast({ type: 'error', message: `Not enough gold (need ${cost.toLocaleString()})` });
      return false;
    }

    // Determine tier from item template
    const template = EQUIPMENT_TEMPLATES[item.templateId];
    const tier = template?.tier || 1;

    // Determine affix count — preserve current count, minimum 1
    const currentAffixCount = item.affixes?.length || 0;
    const targetAffixCount = Math.max(currentAffixCount, item.rarity === 'rare' ? 1 : 2);

    // Keep locked affix
    const lockedAffixId = hasLock ? item.affixes[lockedAffixIndex] : null;

    // Roll new affixes
    const newAffixes = [];
    if (lockedAffixId) {
      newAffixes.push(lockedAffixId);
    }

    const neededCount = targetAffixCount - newAffixes.length;
    for (let i = 0; i < neededCount; i++) {
      const hasPrefix = newAffixes.some(a => ITEM_AFFIXES[a]?.type === AFFIX_TYPE.PREFIX);
      const hasSuffix = newAffixes.some(a => ITEM_AFFIXES[a]?.type === AFFIX_TYPE.SUFFIX);

      let rollType;
      if (!hasPrefix && !hasSuffix) {
        rollType = Math.random() < 0.5 ? AFFIX_TYPE.PREFIX : AFFIX_TYPE.SUFFIX;
      } else if (!hasPrefix) {
        rollType = AFFIX_TYPE.PREFIX;
      } else if (!hasSuffix) {
        rollType = AFFIX_TYPE.SUFFIX;
      } else {
        break; // Already have one of each type
      }

      const rolled = rollAffixFromPool(item.slot, tier, rollType);
      if (rolled && !newAffixes.includes(rolled.id)) {
        newAffixes.push(rolled.id);
      }
    }

    // Rebuild item name
    const qualityPrefix = item.quality === 'ascended' ? 'Ascended ' : item.quality === 'infused' ? 'Infused ' : '';
    const baseName = template?.name || 'Item';
    let newName;
    if (newAffixes.length > 0) {
      newName = qualityPrefix + buildAffixedName(baseName, newAffixes);
    } else {
      const rarityData = RARITY[item.rarity];
      newName = qualityPrefix + `${rarityData?.name || ''} ${baseName}`;
    }

    const updatedItem = {
      ...item,
      affixes: newAffixes.length > 0 ? newAffixes : undefined,
      name: newName,
    };

    set(state => {
      const stateUpdates = {
        gold: state.gold - cost,
        reforgeCount: state.reforgeCount + 1,
        stats: {
          ...state.stats,
          totalGoldSpent: (state.stats.totalGoldSpent || 0) + cost,
        },
      };

      if (equippedHeroId) {
        stateUpdates.heroes = state.heroes.map(h => {
          if (!h || h.id !== equippedHeroId) return h;
          return {
            ...h,
            equipment: { ...h.equipment, [equippedSlot]: updatedItem },
          };
        });
      } else {
        stateUpdates.inventory = state.inventory.map(i =>
          i.id === itemId ? updatedItem : i
        );
      }

      return stateUpdates;
    });

    // Invalidate stat cache after state update (affixes affect stats)
    if (equippedHeroId) {
      invalidateStatCache(equippedHeroId);
    }

    get().addToast({ type: 'success', message: `Reforged! ${newName}` });
    return true;
  },
});
