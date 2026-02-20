# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**For comprehensive architecture documentation, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).**

## Project Overview

Castles & Clickers is an idle dungeon crawler browser game built with React 19, Zustand, and Vite. Heroes explore procedurally generated dungeons, fight monsters with initiative-based combat, collect loot with affixes, and progress through skill trees and homestead upgrades.

## Active Development: Design Rethink

The project is undergoing a major feature expansion defined in `DESIGN_RETHINK.md`. The design philosophy is **RPG-first, idle-friendly** — player choice and visibility over automation.

### Workflow
- **`SESSION_PROMPT.md`** — Instructions for each Claude session. Read this at the start of every session.
- **`PROGRESS.md`** — Tracks what's done, what's next, and handoff notes between sessions. **Always read this first** to know the current phase and next task. **Always update this** when completing tasks.
- **`DESIGN_RETHINK.md`** — The full design spec (~1,070 lines, 19 sections). Each task in PROGRESS.md references a specific section — read that section for the detailed spec and implementation notes before writing code.

### Design Principles (from DESIGN_RETHINK.md)
1. **Make existing systems visible** before adding new ones. The game has 180 skills, 34 uniques, 18 affixes, 10 classes — surface what's already there.
2. **Every decision gets feedback within 60 seconds.** If a player changes something, they see the result fast.
3. **Build systems that remix content, not pipelines that produce content.** Difficulty sliders, affix synergies, stacked modifiers — combinatorial variety from existing data.
4. **Run the numbers.** Power budgets and cost curves before implementation.
5. **Idle baseline test:** For every new system, define what happens if the player never touches it. If they fall behind, redesign. If they miss optional depth, it's healthy.

### Key Constraints
- **No mid-combat player input.** The combat engine is non-interactive. Player expression belongs in pre-combat decisions (party, gear, skills, difficulty) and post-combat feedback (DPS meter, death recap).
- **No multiplayer.** localStorage + Zustand architecture. Single-player only.
- **New UI uses existing modal pattern.** New popups/screens should use `ModalOverlay.jsx`. The full layout overhaul is deferred to Phase 7 (v0.4.0).
- **Save migration required for new persistent state.** Use the versioned migration system in `src/store/helpers/migrations.js`. See the "Save Migration System" section below for the pattern.
- **Auto-dismiss for idle players.** Any new screen/popup that interrupts the game loop must auto-dismiss after ~5 seconds when auto-advance is on.

## Version Number

**IMPORTANT: Bump the version number on every git push.**

The version is defined in `src/data/changelog.js` as `CURRENT_VERSION` and displayed in `src/components/GameHUD.jsx`.

Use semantic versioning: `v0.0.X` for patches, `v0.X.0` for features, `vX.0.0` for major changes.

## Development Commands

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build to /dist
npm run lint      # ESLint on all .js/.jsx files
npm run preview   # Preview production build
```

## Architecture

### State Management
Zustand store split into focused slices in `src/store/slices/` with helpers in `src/store/helpers/`, composed in `src/store/gameStore.js`. All imports go through `gameStore.js`. Use individual selectors to prevent unnecessary re-renders:
```js
const heroes = useGameStore(state => state.heroes);  // Good
const { heroes, gold } = useGameStore();              // Avoid - re-renders on any change
```

### Game Loop
The game uses a hook-based loop architecture:
- `useGameLoop` - Main tick orchestration (~500ms intervals)
- `useCombat` - Combat phase resolution with initiative system
- `useDungeon` - Exploration and room navigation
- `useCombatEffects` - Visual effect queue management
- `useThrottledDisplay` - Render throttling (~15 FPS) to reduce component updates

### Combat Phases
`SETUP → EXPLORING → COMBAT → CLEARING → COMPLETE/DEFEAT → PrepScreen → next dungeon`

Combat uses initiative-based turn order with A* pathfinding for movement. Speed stat influences dodge chance and double attack probability. After dungeon ends, `prepPhase` state drives the PrepScreen (party overview, dungeon preview, milestones). The game loop no longer auto-starts the next dungeon — PrepScreen handles auto-advance via its own timer.

## Key Directories

- `src/store/` - Zustand store: `gameStore.js` composes slices from `slices/` with helpers from `helpers/`
- `src/game/` - Core mechanics: combat engine, monster AI, skill system, maze generation
- `src/data/` - Game definitions: classes, equipment, monsters, skill trees, raids, affixes
- `src/hooks/` - Custom hooks for game loop, combat, dungeon, effects
- `src/components/` - React UI components, with reusable pieces in `ui/` subdirectory
- `src/canvas/` - Canvas-based dungeon renderer with layered architecture (terrain, units, UI, effects)

## Critical Files

- `src/store/gameStore.js` - Store composition, persistence config, resetGame (~220 lines)
- `src/game/mazeGenerator.js` - Room-based dungeon generation with A* pathfinding (29KB)
- `src/hooks/useCombat.js` - Combat orchestrator (~560 lines, dispatches to combat modules)
- `src/game/combatHelpers.js` - Combat utilities: targeting, death handling, viewport
- `src/game/combatDamageResolution.js` - Basic attack damage, on-hit/kill/crit effects (~1100 lines)
- `src/game/combatSkillExecution.js` - Hero skill and monster ability execution (~530 lines)
- `src/game/combatStatusEffects.js` - DOT/stun/buff per-turn processing (~310 lines)
- `src/game/combatMovement.js` - A* pathfinding and directional movement (~140 lines)
- `src/game/constants.js` - Game balance values, formulas, and utility functions

### Files You'll Modify Often During Design Rethink
- `src/store/slices/combatSlice.js` - Where `runStats` accumulator lives (DPS meter, death recap, run summary data)
- `src/store/slices/inventorySlice.js` - Has `compareToEquipped` for item comparison; reforging and affix mutation go here
- `src/store/slices/dungeonSlice.js` - `endDungeon` logic; prep phase (`POST_RUN`) inserts here
- `src/store/slices/economySlice.js` - Gold sinks, toast system, offline progress
- `src/hooks/useGameLoop.js` - Main tick loop; auto-advance logic that needs to pause for prep phase
- `src/data/itemAffixes.js` - 18 affixes; add `tags` field for synergy system
- `src/data/dungeonThemes.js` - Dungeon theme definitions; add `favoredAffixes` for loot targeting
- `src/data/statusEffects.js` - Status effect definitions; add combo table
- `src/store/helpers/statCalculator.js` - `calculateHeroStats`; trait bonuses, affix synergies, ascension multipliers apply here. Has module-level `currentAscensionCount` — call `clearStatCache()` when anything affecting stats changes.
- `src/store/helpers/migrations.js` - Versioned save migrations. Increment `SAVE_VERSION` and add migration function when adding new persistent state.
- `src/components/GameLayout.jsx` - Main layout (~857 lines, 12+ modals); avoid refactoring until Phase 7
- `src/components/PrepScreen.jsx` - Between-dungeon screen; new pre-combat features (difficulty, ascension button) go here

## Performance Patterns

This codebase uses several optimization patterns:
- Zustand selector pattern for granular subscriptions
- `useThrottledDisplay` separates game tick rate from render rate
- `useCallback`/`useMemo` for stable references
- Stable default objects to prevent reference churn

## Art Style Guidelines

This game uses a **pixel art RPG aesthetic**. All visual elements must maintain this style.

### Icons - SVG Pixel Art

**NEVER use emojis in the UI.** Always use SVG pixel art icons from `src/components/icons/`.

Icon files:
- `ui.jsx` - General UI icons (gold, hearts, swords, shields, etc.)
- `monsters.jsx` - Monster sprites
- `weapons.jsx` - Equipment icons
- `skills.jsx` - Skill/ability icons
- `statusEffects.jsx` - Buff/debuff indicators
- `ClassIcon.jsx` - Hero class portraits

### Creating New Icons

Feel free to create new SVG icons that match the existing art style:

```jsx
// All icons use a 16x16 grid with pixelated rendering
const IconWrapper = ({ children, size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ imageRendering: 'pixelated' }}  // Note: global CSS in index.css also applies this to all SVGs
  >
    {children}
  </svg>
);

// P helper places rectangular "pixels" at x,y coordinates
const P = ({ x, y, c, w = 1, h = 1 }) => (
  <rect x={x} y={y} width={w} height={h} fill={c} />
);

// Example: Simple sword icon
export const SwordIcon = ({ size }) => (
  <IconWrapper size={size}>
    <P x={12} y={2} w={2} h={2} c="#94a3b8" />  {/* Pommel */}
    <P x={10} y={4} w={2} h={2} c="#64748b" />  {/* Guard */}
    <P x={8} y={6} w={2} h={2} c="#e2e8f0" />   {/* Blade */}
    <P x={6} y={8} w={2} h={2} c="#e2e8f0" />
    <P x={4} y={10} w={2} h={2} c="#e2e8f0" />
    <P x={2} y={12} w={2} h={2} c="#f8fafc" />  {/* Tip highlight */}
  </IconWrapper>
);
```

Guidelines for new icons:
- Use the 16x16 grid system
- Use Tailwind color palette hex values for consistency
- Add highlights/shading for depth (lighter top-left, darker bottom-right)
- Keep designs simple and readable at small sizes
- Export from the appropriate file based on icon category
- Don't add inline `imageRendering: 'pixelated'` on individual SVGs — the global CSS rule in `index.css` handles this for all `<svg>` elements
- Unicode symbols in `title` attributes (plain text tooltips) are acceptable since they're not rendered in the UI

### Canvas Skill Sprites

Skills also have canvas-rendered sprites for the dungeon view, defined in `src/canvas/sprites/SkillSprites.js`:
- `SKILL_ICON_DRAWERS` — Named drawer functions that paint onto an offscreen canvas (e.g., `power_strike`, `heal`, `fireball`)
- `SKILL_ICON_MAP` — Maps every skill ID (e.g., `warrior_power_strike`) to a drawer name
- All 130 skills (10 classes × 13 skills, 4 tiers each) have entries in `SKILL_ICON_MAP`
- When adding a new skill, add both an SVG icon in `skills.jsx` AND a canvas drawer + map entry in `SkillSprites.js`

### CSS Classes

Use pixel-styled CSS classes for UI elements:
- `pixel-panel` / `pixel-panel-dark` - Bordered containers
- `pixel-btn` / `pixel-btn-primary` / `pixel-btn-secondary` - Buttons
- `pixel-bar` / `pixel-bar-fill` - Progress bars
- `pixel-text` / `pixel-label` / `pixel-title` / `pixel-subtitle` - Typography

## Accessibility

The UI targets WCAG AA compliance (v0.1.26). When adding new components:
- All `<button>` elements with only an icon need `aria-label`
- Modals must use `ModalOverlay.jsx` which has focus trap, auto-focus, focus restore, and `role="dialog"`
- Dynamic notifications should use `role="status"` + `aria-live="polite"` (or `aria-live="off"` if updates are too rapid)
- New interactive non-button elements need `role`, `tabIndex`, and keyboard handlers (Enter/Space)
- CSS animations are automatically killed for `prefers-reduced-motion: reduce` users via global rule in `index.css`
- Use CSS variables `--color-text-dim` / `--color-text-dark` for secondary text — they meet contrast requirements

## Documentation

All 6 phases of `REMEDIATION_PLAN.md` are complete (v0.1.17–v0.1.28). When making significant changes, update:
- `WEAK_POINTS.md` — Mark resolved items with strikethrough and version number
- `DEVELOPER_GUIDE.md` — Add/update relevant architecture sections
- `REPASS.md` — Add items that need review/polish after initial implementation. This is a living checklist of rough edges, tuning questions, and things to verify actually work well in practice.
- `src/data/changelog.js` — Add player-facing changelog entry

## Toast Notifications

User-facing error/success feedback uses the toast system in `economySlice.js`:
```js
get().addToast({ type: 'error', message: 'Not enough gold' });
```
Types: `error` (red), `warning` (yellow), `success` (green), `info` (blue). All slices can call `get().addToast()` since they share the same `get()` from store composition. Add toast calls to new store actions that can fail.

## Data File Export Names

When importing from game data files, verify actual export names — they don't always match what you'd guess:
- `equipment.js`: `RARITY` (not `RARITY_CONFIG`) — entries have `.name` and `.multiplier`
- `itemAffixes.js`: `ITEM_AFFIXES` (not `AFFIX_POOL`) — entries use `.minTier` (not `.tier`)
- `statusEffects.js`: effects use `.type` for category (not `.category`)
- `balanceConstants.js`: `DAMAGE_VARIANCE_MIN` + `DAMAGE_VARIANCE_RANGE` (no `DAMAGE_VARIANCE_MAX`)
- `balanceConstants.js`: `BOSS_LOOT_DROP_CHANCE` / `NORMAL_LOOT_DROP_CHANCE` (not without `_CHANCE`)

## Common Pitfalls

- **Temporal Dead Zone (TDZ) in component files**: When adding helper functions used by components in the same file, always define the helper **above** the component that uses it. `const` declarations are not hoisted — if a component calls a `const` function defined below it, the component will crash with a `ReferenceError` at runtime. This won't be caught by ESLint or the build step. (Bug found in v0.3.2: `getReforgeCostForDisplay` was defined after `ReforgePanel` that used it.)
- **EquipmentScreen left panel overflow**: The left column (`w-64 flex flex-col`) in EquipmentScreen.jsx is inside a `h-[60vh]` container. It contains hero tabs, stats, synergies, equipment slots, unequip button, reforge panel, and settings (`mt-auto`). Adding new elements here can cause content to overflow and become invisible. The column has `overflow-y-auto` to handle this, but be mindful of vertical space. Test with all slots populated.
- **Combat resolution data flow**: `calculateBasicAttackDamage` returns `{ dmg, isCrit, passiveBonuses, uniqueBonuses, heroData, affixBonuses }`. This `attackResult` object is passed to `resolveMonsterTargetDamage` and `resolveHeroTargetDamage`. If you need new data in resolution functions, add it to this return value rather than recomputing it.

## Lint Pitfalls

- **`react-hooks/set-state-in-effect`**: Calling `setState` synchronously inside `useEffect` triggers this. For CSS animations, use ref-based DOM class toggling instead of state (e.g., `el.classList.add('save-flash')` with `void el.offsetWidth` to force reflow).
- **Unused destructured vars**: Use `[, b]` instead of `[id, b]` when only the value is needed from `Object.entries()`.

## Lint Baseline

`npm run lint` currently reports ~83 pre-existing errors (mostly unused vars in canvas files and React hooks warnings). Do not try to fix these unless specifically asked — just verify your changes don't add new ones.

## Layout Positioning (learned v0.2.1)

The gameplay screen has tight vertical space. Key constraints:
- **Main area** is a flex column: Zone Header → Canvas (flex-1) → CombatLog (max-h-24) — don't add more stacked elements here without removing something
- **ContributionMeter lives in the Sidebar** (below Party heroes), not the main area
- **LootNotifications** are fixed at `bottom-28 right-4 z-40` — above the combat log area
- **Toasts** are fixed at `top-20 right-4 z-50` — below the game HUD header
- **Z-index stack**: transitions (60) > toasts/modals (50) > notifications/mobile drawer (40)
- New fixed-position UI must avoid the bottom-right (notifications) and top-right (toasts) zones
- Always test layout changes at multiple viewport sizes — the sidebar hides on mobile (<md breakpoint)

## Death Tracking Pattern (learned v0.2.1)

Hero deaths happen at 3 code sites — all use `ctx.heroDeaths` array:
- `combatDamageResolution.js` — attack damage kills
- `combatSkillExecution.js` — skill damage kills
- `combatStatusEffects.js` — DOT kills (killer = DOT type name)

If adding new damage sources that can kill heroes, you must also push to `ctx.heroDeaths` or deaths won't appear in the death recap.

## Loot Notification Types (learned v0.2.1)

`addLootNotification({ type, ... })` in inventorySlice. Types and their auto-cleanup durations:
- Regular types (5s cleanup): `auto-equipped`, `looted`, `auto-sold`, `inventory-full`, `unique-drop`, `unique-duplicate`, `collection-milestone`
- Extended type (9s cleanup): `suggest-equip` — has interactive buttons, needs longer lifetime

When adding new notification types, update both `LootNotifications.jsx` (render case + border color) and `clearOldNotifications` in inventorySlice if the type needs non-standard cleanup timing.

## Existing Combat Stats Infrastructure

The combat system already tracks per-hero stats that new features build on:
- `stats.heroStats` tracks `totalDamageDealt`, `totalDamageTaken`, `totalHealingDone`, `totalHealingReceived` (lifetime)
- `useCombat` computes `totalDamageDealtThisTurn`, `damageTakenByHero`, `healingDoneByHero` per tick
- These are the foundation for the contribution meter, run summary, and death recap — you're adding per-run aggregation on top of existing per-tick data

## Equipment Infrastructure

- `compareToEquipped` in `inventorySlice.js` computes per-stat diffs between items — used by EquipmentTooltip and suggest-equip notifications
- `processLootDrop` has two-tier auto-equip (v0.2.1): rare+ or close-call upgrades (within 10% score) → `suggest-equip` notification with buttons; common/uncommon clear upgrades → silent auto-equip. If inventory is full, always falls through to silent auto-equip
- `generateEquipment` handles affix rolling during loot generation — reforging reuses this logic
- **Reforging** (v0.3.2): `reforgeItem(itemId, lockedAffixIndex)` and `getReforgeCost(locked)` in inventorySlice. Escalating cost curve resets via `reforgeCount: 0` in `endDungeon` (dungeonSlice) and `resetGame` (gameStore). No save migration needed — `reforgeCount` defaults to 0 via currentState spread.

## Affix Synergy System (v0.3.2)

- `getActiveSynergies(affixIds)` in `src/data/itemAffixes.js` — counts tags across affix IDs, returns active synergy bonuses
- `getHeroSynergies(hero)` and `getHeroAffixIds(hero)` in `src/game/affixEngine.js` — convenience wrappers for a hero's equipped items
- `getPassiveAffixBonuses(hero)` in affixEngine.js now returns **both** individual affix bonuses and synergy-derived bonuses (e.g., `synergyDodgeChance`, `synergyDamageReduction`, `synergyLifesteal`, etc.)
- Synergy bonuses are wired into combat at these sites:
  - Dodge calculation in `resolveHeroTargetDamage` (Quicksilver)
  - Damage reduction in `resolveHeroTargetDamage` (Ironclad)
  - Execute/berserker multipliers in `calculateBasicAttackDamage` (Headsman, Blood Rage)
  - Lifesteal in `resolveMonsterTargetDamage` (Siphon)
  - Healing received in `combatSkillExecution.js` (Lifebond)
- **Performance note**: `getPassiveAffixBonuses` is called multiple times per combat tick (once for attacker, once or twice for defender). If this becomes a bottleneck, consider per-tick caching.

## Status Effect Combo System (v0.3.2)

- `STATUS_COMBOS` and `getActiveCombos(targetStatusIds, triggerType)` in `src/data/statusEffects.js`
- Three trigger types wired into combat:
  - `on_attack` → in `calculateBasicAttackDamage` (Shatter, Punish, Cripple) — checked before crit roll, applies guaranteed crit and damage multipliers
  - `on_crit` → in `calculateBasicAttackDamage` after crit (Hemorrhage) — refreshes bleed duration
  - `on_dot_tick` → in `processStatusEffectDamage` in combatStatusEffects.js (Toxic Fire, Exposed Wound) — multiplies DOT damage
- Status effects in `newStatusEffects[targetId]` are arrays of `{ id, duration, stacks, ... }` objects. Extract IDs with `.map(s => s.id)` for combo checks.

## Save Migration System (v0.3.0+)

New persistent state fields require a save migration. The system lives in `src/store/helpers/migrations.js`:

```js
// 1. Increment SAVE_VERSION
export const SAVE_VERSION = 4; // was 3

// 2. Add a numbered migration function (key = previous version)
const MIGRATIONS = {
  1: (state) => { /* v1→v2 */ return state; },
  2: (state) => { /* v2→v3 */ return state; },
  3: (state) => { /* v3→v4: add your new state */
    if (!state.myNewField) state.myNewField = defaultValue;
    return state;
  },
};
```

The `merge` function in `gameStore.js` also needs a fallback for the new field (for saves that somehow skip migration):
```js
merge: (persistedState, currentState) => ({
  ...currentState,
  ...persistedState,
  myNewField: persistedState?.myNewField || defaultValue,
})
```

## Ascension System Architecture (v0.3.0)

- State: `ascension: { count: 0 }` in dungeonSlice. `performAscension()` does selective reset.
- Stat multiplier: Module-level `currentAscensionCount` in `src/store/helpers/statCalculator.js` — avoids threading through every call site. Call `setAscensionCount(n)` to update (auto-clears stat cache).
- Initialized on load: `gameStore.js` merge calls `setAscensionCount(persistedState?.ascension?.count || 0)`.
- Dungeon cap: `maxDungeonLevel` state derived from `getAscensionDungeonCap(count)` — increases +5 per ascension.
- If you add new systems that read ascension count, import `setAscensionCount` from `gameStore.js` (re-exported) or read `get().ascension.count` in store actions.

## Party Slot System (v0.3.0, updated v0.2.3)

`PARTY_SLOTS` in `src/data/classes.js` has 8 entries:
- Slots 1-4: Role-restricted (tank, healer, DPS, DPS), always available (gold recruit cost is the only gate)
- Slots 5-6: Role-restricted (DPS, healer), unlocked via Barracks level 3/7 (`barracksRequired` field)
- Slots 7-8: **Flex slots** (`role: null`, `flex: true`, `ascensionRequired: 1/3`) — any class allowed, unlocked via Ascension

`getMaxPartySize(barracksLevel, ascensionCount)` returns how many slots are available (4-8). **Both parameters are required** at all call sites. When iterating party slots, always use `maxPartySize` from state, never `PARTY_SLOTS.length`. No dungeon-clear gating exists for party slots.

`getClassesByRole(null)` returns all classes (for flex slots). Role checks must handle null: `if (slot.role && heroRole !== slot.role)`.

## Wired Combat Traits (v0.5.1)

All combat-affecting traits from `src/data/heroTraits.js` are now wired:
- `regenPercent` (Enduring: 1% HP/turn) — handler in `combatStatusEffects.js:processHeroTurnStartAffixes`
- `controlResist` (Iron Will: +10% stun resist) — resist check in `statusEngine.js:applyStatusEffect`
- `healingMultiplier` (Devoted: +15% healing done) — wired in `skillEngine.js:getHealingBonuses`
- `healingReceivedMultiplier` (Devoted: +15% healing received) — wired in `combatSkillExecution.js` heal result block
- `accuracyBonus` (Steady Hand) — **removed** in v0.5.1, no accuracy system exists

## Phase 0 Data Files (pre-built)

Phase 0 created data definition files that later phases consume. Check these before creating new data:
- `src/data/roomEvents.js` — 10 room events with weighted rolling (`rollRoomEvent()`)
- `src/data/dungeonAffixes.js` — 8 dungeon affix types with weighted rolling (`rollDungeonAffix()`)
- `src/data/ascensionMilestones.js` — Milestone table with helpers (`getAscensionStatMultiplier`, `getAscensionDungeonCap`, etc.)
- `src/data/achievements.js` — 30 achievements across 5 categories
- `src/data/heroTraits.js` — 14 traits with weighted rolling (`rollHeroTraits()`)
- `src/data/statusEffects.js` — includes `STATUS_COMBOS` + `getActiveCombos()` (wired in Phase 6)
- `src/data/itemAffixes.js` — includes `AFFIX_SYNERGY_BONUSES` + `getActiveSynergies()` (wired in Phase 6)

## Known Technical Debt

See `WEAK_POINTS.md` for detailed analysis. Remaining open issues:
- No test coverage
- Gold economy has no late-game sinks (post-homestead void) — addressed by design rethink Phase 3+
- No onboarding/tutorial for new players — addressed by progressive disclosure in Phase 8
- Speed stat dominance in class balance (intentional design, but noted)
