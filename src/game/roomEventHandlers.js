// Room event handlers — each processes an event when the party enters a room
// All handlers receive a context object with access to game state and actions

import { ROOM_EVENTS } from '../data/roomEvents';
import { generateEquipment } from '../data/equipment';

/**
 * Process a room event when the party enters a room that has one.
 * Returns an object describing state updates to apply to roomCombat.
 * @param {string} eventId - The room event ID
 * @param {object} ctx - { combatHeroes, dungeon, roomCombat, addGold, addCombatLog, syncHeroHp, processLootDrop, addEffect, partyPosition }
 * @returns {object|null} Updates to merge into roomCombat, or null if no updates
 */
export function processRoomEvent(eventId, ctx) {
  const event = ROOM_EVENTS[eventId];
  if (!event) return null;

  const handler = EVENT_HANDLERS[eventId];
  if (!handler) return null;

  return handler(event, ctx);
}

const EVENT_HANDLERS = {
  trapped_chest: (event, ctx) => {
    const { dungeon, addGold, addCombatLog, processLootDrop, addEffect, partyPosition } = ctx;
    // Award bonus gold + generate a loot drop
    const bonusGold = 100 + (dungeon?.level || 1) * 50;
    addGold(bonusGold);
    addCombatLog({ type: 'system', message: `Trapped Chest! The mimic is defeated! +${bonusGold} gold` });

    // Generate bonus loot drops
    const dropCount = event.effect.bonusLoot?.dropCount || 1;
    const rarityBonus = event.effect.bonusLoot?.rarityBonus || 0;
    for (let i = 0; i < dropCount; i++) {
      const item = generateEquipment(dungeon?.level || 1, {
        lootMultiplier: 1.0 + rarityBonus,
        favoredAffixes: dungeon?.favoredAffixes,
      });
      const result = processLootDrop(item);
      if (addEffect && partyPosition) {
        addEffect({ type: 'lootDrop', position: partyPosition, slot: item.slot, rarityColor: item.rarityColor || '#9ca3af' });
      }
      if (result.action === 'sold') {
        addCombatLog({ type: 'system', message: `Chest Loot: ${item.name} (sold +${result.gold}g)` });
      } else {
        addCombatLog({ type: 'system', message: `Chest Loot: ${item.name}` });
      }
    }
    return null;
  },

  imprisoned_npc: (event, ctx) => {
    const { combatHeroes, addCombatLog } = ctx;
    const buffPercent = event.effect.partyBuff?.percent || 0.10;
    // Apply +10% attack to all alive heroes for the rest of the run
    const buffedHeroes = combatHeroes.map(h => {
      if (h.stats.hp <= 0) return h;
      return {
        ...h,
        stats: {
          ...h.stats,
          attack: Math.floor(h.stats.attack * (1 + buffPercent)),
        },
      };
    });
    addCombatLog({ type: 'system', message: `Imprisoned Adventurer freed! Party gains +${Math.round(buffPercent * 100)}% ATK!` });
    return { heroes: buffedHeroes };
  },

  cursed_altar: (event, ctx) => {
    const { combatHeroes, dungeon, addGold, addCombatLog, syncHeroHp } = ctx;
    const hpCostPercent = event.effect.hpCostPercent || 0.20;
    const goldReward = Math.floor((event.effect.goldReward || 500) * (1 + (dungeon?.level || 1) * 0.1));

    // Reduce all alive heroes' HP by 20% of current
    const hpUpdates = {};
    const updatedHeroes = combatHeroes.map(h => {
      if (h.stats.hp <= 0) return h;
      const hpLoss = Math.floor(h.stats.hp * hpCostPercent);
      const newHp = Math.max(1, h.stats.hp - hpLoss); // Never kill from altar
      hpUpdates[h.id] = newHp;
      return { ...h, stats: { ...h.stats, hp: newHp } };
    });

    syncHeroHp(hpUpdates);
    addGold(goldReward);
    addCombatLog({ type: 'system', message: `Cursed Altar! Party sacrifices ${Math.round(hpCostPercent * 100)}% HP for +${goldReward} gold` });
    return { heroes: updatedHeroes };
  },

  healing_spring: (event, ctx) => {
    const { combatHeroes, addCombatLog, syncHeroHp } = ctx;
    const healPercent = event.effect.healPercent || 1.0;

    const hpUpdates = {};
    const healedHeroes = combatHeroes.map(h => {
      if (h.stats.hp <= 0) return h;
      const newHp = Math.min(h.stats.maxHp, Math.floor(h.stats.hp + h.stats.maxHp * healPercent));
      hpUpdates[h.id] = newHp;
      return { ...h, stats: { ...h.stats, hp: newHp } };
    });

    syncHeroHp(hpUpdates);
    addCombatLog({ type: 'system', message: 'Healing Spring! Party fully restored!' });
    return { heroes: healedHeroes };
  },

  wandering_merchant: (event, ctx) => {
    const { dungeon, addCombatLog, processLootDrop, addEffect, partyPosition } = ctx;
    // Generate a guaranteed rare+ item — free find (no gold cost for simplicity in auto-play)
    const item = generateEquipment(dungeon?.level || 1, {
      guaranteedRarity: event.effect.itemMinRarity || 'rare',
      favoredAffixes: dungeon?.favoredAffixes,
    });
    const result = processLootDrop(item);
    if (addEffect && partyPosition) {
      addEffect({ type: 'lootDrop', position: partyPosition, slot: item.slot, rarityColor: item.rarityColor || '#9ca3af' });
    }
    addCombatLog({ type: 'system', message: `Wandering Merchant! Found: ${item.name}` });
    if (result.action === 'sold') {
      addCombatLog({ type: 'system', message: `Auto-sold for +${result.gold}g` });
    }
    return null;
  },

  monster_ambush: (event, ctx) => {
    const { addCombatLog } = ctx;
    const xpMult = event.effect.xpMultiplier || 2;
    addCombatLog({ type: 'system', message: `Monster Ambush! Double enemies! ${xpMult}x XP this room!` });
    // Store XP multiplier on roomCombat for the next combat encounter
    return { roomEventXpMultiplier: xpMult };
  },

  ancient_library: (event, ctx) => {
    const { combatHeroes, addCombatLog } = ctx;
    const aliveHeroes = combatHeroes.filter(h => h.stats.hp > 0);
    if (aliveHeroes.length === 0) return null;

    const luckyHero = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
    const xpMult = event.effect.xpMultiplier || 2;
    addCombatLog({ type: 'system', message: `Ancient Library! ${luckyHero.name} gains ${xpMult}x XP this room!` });
    // Store hero-specific XP bonus on roomCombat
    return { roomEventHeroXpBonus: { [luckyHero.id]: xpMult } };
  },

  crumbling_floor: (_event, ctx) => {
    const { addCombatLog } = ctx;
    addCombatLog({ type: 'system', message: 'Crumbling Floor! The party tumbles through to the next area!' });
    // Set a flag that the exploration tick checks to skip monsters in this room
    return { roomEventSkipCombat: true };
  },

  shrine_of_fortune: (event, ctx) => {
    const { addCombatLog } = ctx;
    const goldCost = event.effect.goldCost || 300;
    const lootBonus = event.effect.lootBonusPercent || 0.50;

    // Check if player can afford the offering
    const state = ctx.getState();
    const currentGold = state.gold || 0;
    if (currentGold >= goldCost) {
      ctx.addGold(-goldCost);
      addCombatLog({ type: 'system', message: `Shrine of Fortune! Offered ${goldCost} gold for +${Math.round(lootBonus * 100)}% drop rate this run!` });
      return { roomEventLootBonus: (ctx.roomCombat?.roomEventLootBonus || 0) + lootBonus };
    } else {
      addCombatLog({ type: 'system', message: `Shrine of Fortune... but you lack the ${goldCost} gold offering.` });
      return null;
    }
  },

  abandoned_campfire: (event, ctx) => {
    const { combatHeroes, addCombatLog, syncHeroHp } = ctx;
    const healPercent = event.effect.healPercent || 0.30;
    const speedAmount = event.effect.partyBuff?.amount || 2;

    // Heal 30% HP
    const hpUpdates = {};
    const updatedHeroes = combatHeroes.map(h => {
      if (h.stats.hp <= 0) return h;
      const healAmount = Math.floor(h.stats.maxHp * healPercent);
      const newHp = Math.min(h.stats.maxHp, h.stats.hp + healAmount);
      hpUpdates[h.id] = newHp;
      return {
        ...h,
        stats: {
          ...h.stats,
          hp: newHp,
          speed: h.stats.speed + speedAmount,
        },
      };
    });

    syncHeroHp(hpUpdates);
    addCombatLog({ type: 'system', message: `Abandoned Campfire! Party heals ${Math.round(healPercent * 100)}% HP and gains +${speedAmount} SPD!` });
    return { heroes: updatedHeroes };
  },
};
