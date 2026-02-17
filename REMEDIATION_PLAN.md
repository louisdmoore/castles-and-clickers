# Remediation Plan — Castles & Clickers

This plan addresses all verified weaknesses from `WEAK_POINTS.md`, organized into 6 phases ordered by dependency and impact. Each phase is self-contained with enough context for an independent agent to execute.

**Excluded from this plan:**
| Item | Reason |
|------|--------|
| Gold economy / late-game sinks (WP §3) | Needs dedicated design session — could be prestige, new systems, or shop-driven |
| Combat & class balance (WP §5) | Speed buff is intentional — keeps DPS alive in dungeons, dodge/double-attack scaling working as designed |
| Test coverage (WP §6 partial) | Separate project, doesn't block gameplay improvements |

---

## ~~Phase 1: Error Handling & Resilience (Foundation)~~ DONE (v0.1.17)

> ~~Everything else builds on a stable base. Do this first.~~

### ~~1A. React ErrorBoundary~~ DONE

- ~~Create `src/components/ErrorBoundary.jsx` — class component with `componentDidCatch`~~
- ~~Show a pixel-styled recovery screen with "Something went wrong" + "Reload" button~~
- ~~Wrap the app root in `src/App.jsx`~~

### ~~1B. localStorage Protection~~ DONE

- ~~Wrap all 3 operations in `throttledStorage` (`getItem`, `setItem`, `removeItem`) in try-catch~~
- ~~On `setItem` failure: log warning, continue with in-memory state (no crash)~~
- ~~On `getItem` failure: return null (fresh game)~~
- ~~Add `window.addEventListener('beforeunload', ...)` to flush any pending save immediately~~

### ~~1C. Critical Event Saves~~ DONE

- ~~Add an `immediateSave()` function that bypasses the 2s throttle~~
- ~~Call it on: level up, skill unlock, unique item drop, dungeon completion, raid completion, homestead upgrade~~

### ~~1D. Canvas Null Checks~~ DONE

~~Add null guards on `getContext('2d')` in:~~
- ~~`src/canvas/CanvasRenderer.js:21`~~
- ~~`src/canvas/layers/TerrainLayer.js:62`~~
- ~~`src/canvas/CanvasDungeonView.jsx:116,149`~~
- ~~If null, skip rendering gracefully (no crash)~~

~~Also added guards in `SpriteManager.js`, `MonsterSprites.js`, and `HeroSprites.js`.~~

### ~~1E. NaN / Undefined Guards~~ DONE

- ~~`src/data/equipment.js:708` — check `possibleItems.length > 0` before access~~
- ~~`src/data/equipment.js:736` — validate `RARITY[rarity]` exists, fallback to common multiplier~~
- ~~`src/hooks/useCombat.js:92` — validate `dungeon.level` is a finite number~~
- ~~`src/canvas/CanvasDungeonView.jsx:120` — add optional chaining `grid[y]?.[x]`~~

### ~~Phase 1 Verification~~ DONE

1. ~~`npm run build` — no build errors~~
2. ~~`npm run lint` — no new lint warnings~~
3. Manual test: simulate localStorage failure (private browsing), verify ErrorBoundary catches render errors

---

## ~~Phase 2: Technical Debt Cleanup~~ DONE (v0.1.25)

> ~~Clean up the codebase before adding new features to it.~~

### ~~2A. Split `useCombat.js` (3,508 lines → 6 files)~~ DONE (v0.1.18)

| New File | Lines | Contents |
|----------|-------|----------|
| `src/hooks/useCombat.js` | ~560 | Thin orchestrator, builds shared `ctx` object |
| `src/game/combatHelpers.js` | ~210 | Targeting, death handling, viewport, utilities |
| `src/game/combatDamageResolution.js` | ~1100 | Basic attack damage, on-hit/kill/crit effects |
| `src/game/combatSkillExecution.js` | ~530 | Hero skill & monster ability execution |
| `src/game/combatStatusEffects.js` | ~310 | DOT/stun/buff per-turn processing |
| `src/game/combatMovement.js` | ~140 | A* pathfinding & directional movement |

All modules share a mutable `ctx` object. Game files never import `useGameStore` — store actions are wrapped as callbacks on `ctx`.

### ~~2B. Split `gameStore.js` (2,929 lines → slices)~~ DONE (v0.1.19)

| New File | Contents |
|----------|----------|
| `src/store/gameStore.js` | Main store composition + state init (~220 lines) |
| `src/store/slices/heroSlice.js` | Hero management actions |
| `src/store/slices/inventorySlice.js` | Inventory actions |
| `src/store/slices/combatSlice.js` | Combat state actions |
| `src/store/slices/dungeonSlice.js` | Dungeon progression actions |
| `src/store/slices/economySlice.js` | Economy + homestead + shop actions |
| `src/store/helpers/` | `throttledStorage`, `statCalculator`, `itemScoring`, `heroGenerator`, `validation` |

### ~~2C. Split `skillEngine.js` (2,067 lines → 4 files)~~ DONE (v0.1.25)

| New File | Contents |
|----------|----------|
| `src/game/skillEngine.js` | Core exports, helpers, re-exports (~950 lines) |
| `src/game/skillExecution.js` | `executeSkillAbility` — active skill execution |
| `src/game/passiveEffects.js` | `applyPassiveEffects` — refactored switch → handler map |
| `src/game/skillAI.js` | `chooseBestSkill` — skill selection AI |

Re-exports in `skillEngine.js` preserve existing import paths — no consumer changes needed.

### ~~2D. Centralize Magic Numbers~~ DONE (v0.1.25)

Created `src/game/balanceConstants.js` with 30+ named constants for core combat balance values:
- Speed/dodge/double-attack coefficients and caps
- Damage formula (defense reduction, variance, crit multiplier)
- Crit chances (DPS vs non-DPS base rates)
- HP thresholds for skill AI (0.25, 0.50, 0.75)
- Loot drop chances (boss 90%, normal 25%)
- Chain attack, AoE, counter attack, summon stat multipliers

Updated `constants.js`, `skillEngine.js`, `skillAI.js`, `combatDamageResolution.js`.

### ~~2E. Console & Package Cleanup~~ DONE (v0.1.25)

- `combatSimulator.js` import in `main.jsx` guarded with `if (import.meta.env.DEV)` dynamic import — eliminates 1,657-line file from production builds (~26 KB saved)
- Added `import.meta.env.DEV` guard on `window` assignments inside `combatSimulator.js` as safety net
- Removed `@types/react` and `@types/react-dom` from `devDependencies`

### ~~Phase 2 Verification~~ DONE

1. ~~`npm run build` — no build errors~~ ✓
2. ~~`npm run lint` — no new lint warnings~~ ✓
3. ~~Manual test: verify all imports resolve, game functions identically after split~~

---

## ~~Phase 3: Progression & Shop Rework~~ DONE (v0.1.20–v0.1.23)

### ~~3A. Early Game Pacing Fixes~~ DONE (v0.1.20)

- ~~Free skill point at level 1~~ → **Skill point at level 2, no auto-starter skill** — heroes choose their first skill from the tree
- **Party size wired up:** `getMaxPartySize()` now connected to `endDungeon` and merge (D10→5, D20→6)
- **Elites at D8:** `ELITE_CONFIG.minLevel` changed from 10 to 8

### ~~3B. Flat Respec Cost~~ DONE (v0.1.20)

Changed formula in `src/data/skillTrees.js`:
- **From:** `50 * Math.pow(2, usedSkillPoints - 1)` (exponential, punishing)
- **To:** `250 * usedSkillPoints` (linear — meaningful early, 2,500g at 10 points instead of 25,600g)

### ~~3C. Shop Rework~~ DONE (v0.1.22–v0.1.23)

- **Rarity scaling:** Rare at D10, Epic at D20, Legendary at D25
- **Consumables tab:** Healing potions, XP scrolls, stat elixirs in `src/data/consumables.js`
- **"Sell Non-Upgrades" button** for bulk inventory cleanup
- **Consumable buffs apply to raids** (v0.1.23)
- **Dungeon buffs refunded on fail/abandon** (v0.1.23)
- Featured item slot deferred — not implemented

### ~~Phase 3 Verification~~ DONE

1. ~~`npm run build` — no build errors~~ ✓
2. ~~`npm run lint` — no new lint warnings~~ ✓
3. ~~Manual test: shop at D1, D10, D20; respec cost; consumable usage~~ ✓

---

## ~~Phase 4: Accessibility (WCAG AA)~~ DONE (v0.1.26)

### ~~4A. Motion Safety~~ DONE

Added `@media (prefers-reduced-motion: reduce)` block to `src/index.css` that sets `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, and `transition-duration: 0.01ms !important` on all elements. Kills all 24+ keyframe animations and transitions.

### ~~4B. Color Contrast Fixes~~ DONE

- `--color-text-dim` updated from `#a0a0b0` to `#b8b8c8` (~5.5:1 contrast on `#1a1a2e`)
- `--color-text-dark` updated from `#606070` to `#8a8a9a`
- `.pixel-label` and `.pixel-speed-btn` inherit the fix via CSS variables

### ~~4C. ARIA Labels & Roles~~ DONE

- GameHUD: `aria-label` on hamburger button, `role="button"` + `aria-label` on version span
- NavBar: `aria-label="Main navigation"` on `<nav>`, `aria-disabled`/`aria-current` on buttons
- CombatLog: `role="log"`, `aria-label="Combat log"`, `aria-live="off"`
- LootNotifications: `role="status"`, `aria-live="polite"`
- RaidSelectorModal: `aria-expanded`, `aria-controls` on expand/collapse toggle
- ModalOverlay: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`, `aria-label="Close"` on close button, `aria-hidden="true"` on backdrop
- SkillNode: `aria-label` with skill name, tier, and status

### ~~4D. Focus Management~~ DONE

- Focus trap in `ModalOverlay.jsx`: Tab/Shift+Tab wrap within modal
- Auto-focus close button on open
- Focus restore to previous element on close
- `aria-modal="true"` + focus trap replaces `inert` attribute approach
- `:focus-visible` styles in CSS: gold outline on `.pixel-btn`/`.pixel-speed-btn`, blue outline on `input`/`select`

### ~~4E. Keyboard Navigation~~ DONE

- SkillNode: `onFocus`/`onBlur` shows/hides tooltip for keyboard users
- Version span: keyboard-activatable with Enter/Space, `tabIndex={0}`
- All interactive elements already use native `<button>` which is tabbable
- Skipped game speed keyboard shortcuts (would conflict with text inputs)

### ~~Phase 4 Verification~~ DONE

1. `npm run build` — no build errors ✓
2. `npm run lint` — no new lint warnings (only pre-existing) ✓
3. Manual test: Tab through UI, modal focus trap, reduced motion, contrast

---

## Phase 5: Player Experience — DONE (v0.1.27)

### 5A. Save Indicator — DONE
- `SaveIndicator` component in `GameHUD.jsx` shows "Saved Xs ago" with green flash animation
- `throttledStorage.js` has `onSave(cb)` callback for save-state tracking
- `saveStatus` state in `economySlice.js`, excluded from persistence
- Warning icon + red text on save failure

### 5B. Error Toasts — DONE
- `src/components/ui/Toast.jsx` — pixel-styled toast with 4 types (error/warning/success/info)
- Toast queue in `economySlice.js` (`toasts` array, `addToast`, `removeToast`)
- Auto-dismiss 3s, max 5 visible, click to dismiss
- Added to: `spendGold`, `upgradeBuilding`, `refreshShop`, `buyFromShop`, `buyConsumable`, `unequipItem`, `sellItem`, `recruitFromTavern`, `unlockSkill`, `respecHero`, `refreshTavern`
- Save failure toast connected in `gameStore.js`

### 5C. In-Game Encyclopedia — DONE
- `src/components/EncyclopediaScreen.jsx` — 6 tabs (Combat, Equipment, Classes, Dungeons, Homestead, Status FX)
- Searchable with keyword filtering across tabs
- Content sourced live from `balanceConstants.js`, `equipment.js`, `itemAffixes.js`, `classes.js`, `milestones.js`, `homestead.js`, `statusEffects.js`
- `BookIcon` in `ui.jsx`, accessible as "Help" from NavBar (after Stats)

### 5D. Contextual Help Tooltips — DONE
- `src/components/ui/HelpTooltip.jsx` — wraps `Tooltip.jsx` with `QuestionIcon` button
- Added to 5 locations: SkillTreeScreen, EquipmentScreen, HomesteadScreen, ShopScreen, DungeonMap
- `QuestionIcon` in `ui.jsx`

---

## Phase 6: Polish

### 6A. Unicode → SVG Replacements

Replace 6 remaining Unicode symbols with pixel-art SVG icons:

| Location | Unicode | Replacement |
|----------|---------|-------------|
| `EquipmentScreen.jsx:51` | Star character | `StarIcon` |
| `EquipmentScreen.jsx:143` | Up triangle | `UpArrowIcon` |
| `EquipmentScreen.jsx:145` | Four-pointed star | `SparkleIcon` |
| `RaidSelectorModal.jsx:230` | Up/down triangles | `ChevronUpIcon` / `ChevronDownIcon` |
| `StatsScreen.jsx:329` | Checkmark | `CheckIcon` |
| `ui/EquipmentTooltip.jsx:96` | Up/down triangles | `UpArrowIcon` / `DownArrowIcon` |

Add new icons to `src/components/icons/ui.jsx` if they don't already exist. Follow the 16x16 grid pixel art style documented in `CLAUDE.md`.

### 6B. Inline Style Cleanup

Convert avoidable inline styles to Tailwind utilities in:
- `RaidSelectorModal.jsx` (18 instances)
- `GameLayout.jsx` (12 instances)
- `BestiaryScreen.jsx` (10 instances)

Keep inline styles for truly dynamic values (runtime colors, calculated positions).

### 6C. Canvas Skill Sprites (51 missing)

Add canvas sprite implementations to `src/canvas/sprites/SkillSprites.js` for the 51 skills currently falling back to `power_strike`.

Organized by class:
| Class | Missing Count |
|-------|--------------|
| Cleric | 7 |
| Druid | 7 |
| Knight | 7 |
| Mage | 7 |
| Necromancer | 7 |
| Paladin | 8 |
| Ranger | 7 |
| Rogue | 6 |
| Shaman | 8 |
| Warrior | 8 |

### Phase 6 Verification

1. `npm run build` — no build errors
2. `npm run lint` — no new lint warnings
3. Visual check: all replaced icons render correctly, canvas sprites display for all skills

---

## Usage Notes

- **Execute phases in order** — each phase builds on the previous
- **Each phase can be given to an independent agent** — all necessary context (file paths, line numbers, approach) is included
- **Bump version after each phase** — version is in `src/data/changelog.js` as `CURRENT_VERSION`
- **Line numbers are approximate** — they were accurate at time of audit but may shift after Phase 2 file splits
- **After Phase 2**, all file path references in later phases should be updated to reflect the new split file structure
