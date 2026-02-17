# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**For comprehensive architecture documentation, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).**

## Project Overview

Castles & Clickers is an idle dungeon crawler browser game built with React 19, Zustand, and Vite. Heroes explore procedurally generated dungeons, fight monsters with initiative-based combat, collect loot with affixes, and progress through skill trees and homestead upgrades.

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
`SETUP → EXPLORING → COMBAT → CLEARING → COMPLETE`

Combat uses initiative-based turn order with A* pathfinding for movement. Speed stat influences dodge chance and double attack probability.

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

## Lint Pitfalls

- **`react-hooks/set-state-in-effect`**: Calling `setState` synchronously inside `useEffect` triggers this. For CSS animations, use ref-based DOM class toggling instead of state (e.g., `el.classList.add('save-flash')` with `void el.offsetWidth` to force reflow).
- **Unused destructured vars**: Use `[, b]` instead of `[id, b]` when only the value is needed from `Object.entries()`.

## Lint Baseline

`npm run lint` currently reports ~78 pre-existing errors (mostly unused vars in canvas files and React hooks warnings). Do not try to fix these unless specifically asked — just verify your changes don't add new ones.

## Known Technical Debt

See `WEAK_POINTS.md` for detailed analysis. Remaining open issues:
- No test coverage
- Gold economy has no late-game sinks (post-homestead void)
- No onboarding/tutorial for new players
- Speed stat dominance in class balance (intentional design, but noted)
