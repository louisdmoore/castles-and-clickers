# Plan: Unified Hero Profile Modal

## Context

Three separate modals (Heroes, Equipment, Skills) each have their own hero selector and opening mechanism. Players bounce between them constantly. Combine into one tabbed modal with a shared hero selector, opened via a single "Heroes" NavBar button. The other two NavBar buttons collapse into this one.

## Approach

Create a new `HeroProfileModal.jsx` wrapper component with 3 tabs: **Party**, **Gear**, **Skills**. Shared hero selector at top. Existing screen components stay mostly unchanged — they just lose their own hero selectors and receive `selectedHeroId` as a prop instead.

## Files to Modify

### 1. `src/components/HeroProfileModal.jsx` (NEW)

The unified container. Structure:

```
HeroProfileModal
├─ Tab bar: [Party] [Gear] [Skills]  (+ badges from NavBar logic)
├─ HeroSelector (shared, horizontal — reuse existing component)
│  └─ Hidden on Party tab (Party shows all slots, not one hero)
└─ Tab content:
   ├─ Party → <HeroManagement /> (unchanged)
   ├─ Gear → <EquipmentScreen selectedHeroId={id} onSelectHero={fn} />
   └─ Skills → <SkillTreeScreen selectedHeroId={id} onSelectHero={fn} />
```

- State: `activeTab` ('party' | 'gear' | 'skills'), `selectedHeroId`
- Modal size: `"full"` (Equipment needs the width)
- Title: "Heroes" (simple, matches NavBar button)
- HeroSelector is visible on Gear and Skills tabs, hidden on Party tab
- Badges on tabs: recruit `!` on Party, skill point count on Skills, `NEW` on Gear (unread uniques)
- When switching tabs, `selectedHeroId` persists (so you can check a hero's gear then flip to skills)

### 2. `src/components/EquipmentScreen.jsx` — Accept props

- Add optional props: `selectedHeroId`, `onSelectHero`
- If props provided, use them instead of internal `useState`
- Remove `<HeroSelector>` rendering when controlled externally (check if `onSelectHero` prop exists)
- Everything else stays the same (3-column layout, settings dropdown)

### 3. `src/components/SkillTreeScreen.jsx` — Accept props

- Add optional props: `selectedHeroId`, `onSelectHero`
- If props provided, use them instead of internal `useState`
- Remove the left-panel hero grid when controlled externally
- The left panel keeps: hero info, legend, respec button. Just loses the hero selector grid.

### 4. `src/components/ModalManager.jsx` — Replace 3 modals with 1

- Remove individual `heroes`, `skills`, `equipment` ModalOverlay entries
- Add single `HeroProfileModal` entry that opens on `activeModal === 'heroes'`
- Pass `initialTab` prop based on which modal was requested:
  - `'heroes'` → `initialTab="party"`
  - `'equipment'` → `initialTab="gear"`
  - `'skills'` → `initialTab="skills"`
- Actually simpler: just use `activeModal` value directly as initialTab mapping

### 5. `src/components/NavBar.jsx` — Collapse 3 buttons into 1

- Remove `skills` and `equipment` entries from `navButtons` array
- The `heroes` button stays, keeps its `!` recruit badge
- Add combined badge logic: show skill points badge or `NEW` uniques badge if either is active
- Badge priority: `NEW` > skill points number > `!` recruit

### 6. `src/components/GameLayout.jsx` — Map old modal IDs

- `openModal('skills')` and `openModal('equipment')` still get called from various places
- Map these to `'heroes'` in the `openModal` callback, storing the original as a `modalTab` state
- Or simpler: keep the 3 IDs working, ModalManager handles the routing

### 7. `PROGRESS.md` — Check off the task

## Implementation Order

1. Create `HeroProfileModal.jsx` with tab bar + hero selector + content switching
2. Modify `EquipmentScreen.jsx` to accept external hero selection props
3. Modify `SkillTreeScreen.jsx` to accept external hero selection props
4. Update `ModalManager.jsx` to route all 3 modal IDs to `HeroProfileModal`
5. Update `NavBar.jsx` to collapse into one button with combined badges
6. Test all tabs, hero switching, badge visibility, tab persistence

## Key Decisions

- **Party tab keeps its own layout** — it shows all slots in a grid, not a single-hero view. The shared HeroSelector hides on this tab.
- **Gear/Skills keep their layouts** — just lose their hero selectors. The Equipment 3-column and SkillTree 2-column layouts are preserved.
- **Modal title stays "Heroes"** — the tab bar makes the current section clear.
- **All 3 NavBar IDs still work internally** — ModalManager maps `'equipment'` and `'skills'` to open HeroProfileModal with the right initial tab. This means existing `pendingModal` calls or feature unlock flows don't break.

## Verification

1. `npm run build` — no errors
2. `npm run lint` — no new errors beyond baseline ~77
3. Manual testing:
   - Click "Heroes" in NavBar → opens on Party tab
   - Switch to Gear tab → hero selector appears, equipment 3-column layout works
   - Switch to Skills tab → skill tree layout works
   - Select a hero on Gear, switch to Skills → same hero selected
   - Check badges show correctly (recruit !, skill points, NEW uniques)
   - Verify modal closes cleanly with X, Escape, backdrop click
   - Verify tab state resets when modal reopens
