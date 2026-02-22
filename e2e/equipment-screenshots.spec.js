// @ts-check
import { test } from '@playwright/test';

const SCREENSHOT_DIR = './screenshots';
const STORAGE_KEY = 'castles-and-clickers-save';

// Build a full game state with heroes, equipment, and inventory
function buildGameState() {
  let idCounter = 1;
  const uid = (prefix) => `${prefix}_${Date.now()}_${idCounter++}`;

  const AFFIX_IDS = ['vampiric', 'of_thorns', 'blazing', 'of_the_phoenix', 'frozen', 'of_haste'];
  const RARITY_COLORS = {
    common: '#9ca3af', uncommon: '#22c55e', rare: '#3b82f6',
    epic: '#a855f7', legendary: '#f59e0b',
  };
  const RARITY_MULT = { common: 1, uncommon: 1.3, rare: 1.6, epic: 2.0, legendary: 2.5 };

  const WEAPON_TEMPLATES = [
    { templateId: 'sword', name: 'Sword', emoji: '\u2694' },
    { templateId: 'axe', name: 'Axe', emoji: '\u{1FA93}' },
    { templateId: 'staff', name: 'Staff', emoji: '\u{1F9AF}' },
    { templateId: 'dagger', name: 'Dagger', emoji: '\u{1F5E1}' },
    { templateId: 'bow', name: 'Bow', emoji: '\u{1F3F9}' },
  ];
  const ARMOR_TEMPLATES = [
    { templateId: 'plate', name: 'Plate', emoji: '\u{1F6E1}' },
    { templateId: 'chainmail', name: 'Chainmail', emoji: '\u26D3' },
    { templateId: 'leather', name: 'Leather', emoji: '\u{1F9E5}' },
    { templateId: 'robe', name: 'Robe', emoji: '\u{1F45A}' },
  ];
  const ACC_TEMPLATES = [
    { templateId: 'ring', name: 'Ring', emoji: '\u{1F48D}' },
    { templateId: 'amulet', name: 'Amulet', emoji: '\u{1F4FF}' },
    { templateId: 'charm', name: 'Charm', emoji: '\u2728' },
  ];

  const PREFIXES = {
    common: ['Worn', 'Rusty', 'Basic'],
    uncommon: ['Sturdy', 'Reinforced', 'Fine'],
    rare: ['Enchanted', 'Tempered', 'Mystic'],
    epic: ['Radiant', 'Shadow-forged', 'Arcane'],
    legendary: ['Godslayer', 'Dragonfire', 'Eternal'],
  };

  function makeItem(slot, rarity, level, affixCount) {
    const id = uid('item');
    const mult = RARITY_MULT[rarity] || 1;
    const base = Math.floor(level * 2 * mult);
    const stats = {};
    let templates, template;

    if (slot === 'weapon') {
      templates = WEAPON_TEMPLATES;
      template = templates[Math.floor(Math.random() * templates.length)];
      stats.attack = base + Math.floor(Math.random() * level);
      stats.speed = Math.floor(base * 0.3);
    } else if (slot === 'armor') {
      templates = ARMOR_TEMPLATES;
      template = templates[Math.floor(Math.random() * templates.length)];
      stats.maxHp = base * 3 + Math.floor(Math.random() * level * 2);
      stats.defense = base + Math.floor(Math.random() * level);
    } else {
      templates = ACC_TEMPLATES;
      template = templates[Math.floor(Math.random() * templates.length)];
      stats.speed = Math.floor(base * 0.5);
      stats.maxHp = base * 2;
      stats.attack = Math.floor(base * 0.3);
    }

    const affixes = [];
    const shuffled = [...AFFIX_IDS].sort(() => Math.random() - 0.5);
    for (let i = 0; i < affixCount && i < shuffled.length; i++) {
      affixes.push(shuffled[i]);
    }

    const prefix = PREFIXES[rarity][Math.floor(Math.random() * PREFIXES[rarity].length)];
    const name = `${prefix} ${template.name}`;

    return {
      id, templateId: template.templateId, name, emoji: template.emoji,
      slot, rarity, rarityColor: RARITY_COLORS[rarity], stats,
      affixes: affixes.length > 0 ? affixes : undefined,
      classes: null,
    };
  }

  function makeHero(classId, name, level) {
    return {
      id: uid('hero'), name, classId, level, xp: 0,
      equipment: {
        weapon: makeItem('weapon', level > 10 ? 'legendary' : 'epic', level, 2),
        armor: makeItem('armor', level > 10 ? 'epic' : 'rare', level, level > 8 ? 2 : 1),
        accessory: makeItem('accessory', 'rare', level, 1),
      },
      skills: [],
      traits: [],
      prestige: { count: 0 },
    };
  }

  // Create 4 heroes
  const heroes = [
    makeHero('paladin', 'Aldric', 14),
    makeHero('cleric', 'Seraphina', 12),
    makeHero('rogue', 'Shadowmere', 11),
    makeHero('mage', 'Zephyrus', 10),
  ];

  // Build a varied inventory
  const inventory = [];
  const slots = ['weapon', 'armor', 'accessory'];
  const rarities = ['common', 'uncommon', 'uncommon', 'rare', 'rare', 'rare', 'epic', 'epic', 'legendary'];
  for (let i = 0; i < 30; i++) {
    const slot = slots[i % 3];
    const rarity = rarities[i % rarities.length];
    const affixCount = rarity === 'rare' ? 1 : rarity === 'epic' ? 2 : rarity === 'legendary' ? 3 : 0;
    const level = 5 + Math.floor(i / 3);
    inventory.push(makeItem(slot, rarity, level, affixCount));
  }

  return {
    state: {
      heroes,
      bench: [],
      maxBenchSize: 6,
      maxPartySize: 4,
      usedSlotDiscounts: [0, 1, 2, 3],
      pendingRecruits: [],
      pendingPartyChanges: [],

      inventory,
      maxInventory: 50,
      equipmentSettings: {
        autoSellJunk: true,
        autoEquipUpgrades: true,
        classPriority: {
          paladin: 'tank', cleric: 'balanced', rogue: 'damage', mage: 'damage',
        },
      },

      ownedUniques: [],
      uniqueLevels: {},
      unreadUniques: [],
      consumables: [],
      shopConsumables: [],
      pendingDungeonBuffs: [],

      tavern: { heroes: [], lastRefresh: Date.now(), refreshCost: 25 },

      gold: 3500,

      dungeon: null,
      combat: null,
      highestDungeonCleared: 15,
      dungeonUnlocked: 16,
      lastDungeonSuccess: null,
      dungeonProgress: {
        currentType: 'normal', currentRaidId: null,
        currentRaidWing: 0, completedRaidWings: [],
        weeklyRaidCompletions: [], lastWeeklyReset: Date.now(),
      },
      dungeonSettings: {
        type: 'normal', autoAdvance: false, targetLevel: null,
      },
      raidState: { active: false, raidId: null, defeatedWingBosses: [], heroHpSnapshot: {} },
      raidPreferences: { lastRaidId: null, lastRaidDifficulty: null, difficultyPerRaid: {} },

      globalDifficulty: 1.0,

      homestead: {
        barracks: 3, armory: 2, fortress: 1, trainingGrounds: 2,
        treasury: 1, infirmary: 1, library: 0,
      },

      ascension: { count: 0 },

      stats: {
        totalGoldEarned: 15000, totalGoldSpent: 11500,
        totalItemsLooted: 120, totalMonstersKilled: 450,
        totalBossesKilled: 15, totalDungeonsCleared: 15,
        totalDeaths: 8, totalDamageDealt: 250000,
        totalDamageTaken: 180000, totalHealingDone: 95000,
        totalHealingReceived: 95000, totalCriticalHits: 340,
        totalDodges: 120, totalMitigated: 45000,
        monsterKills: {}, heroStats: {},
        rareItemsFound: 30, epicItemsFound: 12,
      },
      earnedAchievements: [],
      runHistory: [],

      featureUnlocks: {
        autoAdvance: true, homesteadSeen: true,
        lastSeenRaidsAt: 12, lastSeenVersion: 'v0.3.0',
      },
      notificationSettings: { level: 'full' },

      heroHp: {},
      toasts: [],
      reforgeCount: 0,
    },
    version: 11,
  };
}

test.describe('Equipment Screen Screenshots', () => {
  test('capture all equipment screen states', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Navigate to app first, then seed localStorage, then reload
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);

    // Seed localStorage with full game state
    await page.evaluate(({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    }, { key: STORAGE_KEY, data: buildGameState() });

    // Reload to pick up the seeded state
    await page.reload();
    await page.waitForSelector('nav[aria-label="Main navigation"]', { timeout: 15000 });
    await page.waitForTimeout(2500);

    // Dismiss any modals that appear on load (changelog, etc.)
    const modalCloseBtn = page.locator('[role="dialog"] button[aria-label="Close"]');
    if (await modalCloseBtn.count() > 0) {
      await modalCloseBtn.first().click();
      await page.waitForTimeout(500);
    }
    // Also try clicking backdrop to dismiss any other overlay
    const backdrop = page.locator('div[aria-hidden="true"].absolute.inset-0');
    if (await backdrop.count() > 0) {
      // Press Escape to dismiss any modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // Screenshot 1: Main game with equipped heroes
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-main-game.png` });

    // Open Equipment (Gear) screen
    await page.locator('nav[aria-label="Main navigation"] button:has-text("Gear")').click();
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    await page.waitForTimeout(1000);

    // Screenshot 2: Character tab - default (hero 1)
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-character-tab.png` });

    // Screenshot 3: Click weapon slot to open SlotPanel
    await page.locator('button[aria-label*="Weapon slot"]').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-weapon-slot-panel.png` });

    // Screenshot 4: Armor slot panel
    await page.locator('button[aria-label*="Armor slot"]').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-armor-slot-panel.png` });

    // Screenshot 5: Accessory slot panel
    await page.locator('button[aria-label*="Accessory slot"]').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-accessory-slot-panel.png` });

    // Close slot panel
    const closeSlotBtn = page.locator('button[aria-label="Close slot panel"]');
    if (await closeSlotBtn.isVisible()) await closeSlotBtn.click();
    await page.waitForTimeout(300);

    // Screenshot 6: Hover equipped weapon for tooltip
    const equippedWeapon = page.locator('button[aria-label*="Weapon slot"]').first();
    await equippedWeapon.hover();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-equipped-tooltip.png` });
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);

    // Screenshot 7-8: Other heroes
    const heroTabButtons = page.locator('div.flex.gap-1 > button');
    const heroCount = await heroTabButtons.count();
    if (heroCount > 1) {
      await heroTabButtons.nth(1).click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/07-hero2-character.png` });
    }
    if (heroCount > 2) {
      await heroTabButtons.nth(2).click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/08-hero3-character.png` });
    }
    // Back to hero 1
    await heroTabButtons.nth(0).click();
    await page.waitForTimeout(500);

    // Screenshot 9: Inventory tab
    await page.locator('button:has-text("Inventory")').click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-inventory-all.png` });

    // Screenshot 10: Weapon filter
    const wpnFilter = page.locator('button[aria-label="Filter weapons"]');
    if (await wpnFilter.isVisible()) {
      await wpnFilter.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/10-inventory-weapons.png` });
    }

    // Screenshot 11: Armor filter
    const armFilter = page.locator('button[aria-label="Filter armors"]');
    if (await armFilter.isVisible()) {
      await armFilter.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/11-inventory-armor.png` });
    }

    // Reset to All
    await page.locator('button:has-text("All")').last().click();
    await page.waitForTimeout(300);

    // Screenshot 12: Hover inventory item for tooltip
    const itemRows = page.locator('[style*="border-left: 4px"]');
    if (await itemRows.count() > 0) {
      await itemRows.first().hover();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/12-inventory-tooltip.png` });
    }

    // Switch back to Character tab for responsive screenshots
    await page.locator('button:has-text("Character")').click();
    await page.waitForTimeout(500);

    // Screenshot 13: 1920x1080
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/13-character-1920.png` });

    // Screenshot 14: 1920 with slot panel open
    await page.locator('button[aria-label*="Weapon slot"]').first().click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/14-slot-panel-1920.png` });
    const cs = page.locator('button[aria-label="Close slot panel"]');
    if (await cs.isVisible()) await cs.click();

    // Screenshot 15: Mobile character
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/15-character-mobile.png` });

    // Screenshot 16: Mobile inventory
    await page.locator('button:has-text("Inventory")').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/16-inventory-mobile.png` });

    await context.close();
  });
});
