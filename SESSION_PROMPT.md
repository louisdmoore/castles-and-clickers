# Session Prompt — Castles & Clickers Focused Priority Work

Copy this into a fresh Claude Code session. Tell Claude which priority number to work on.

---

## Instructions for Claude

You are doing **one focused priority** per session. No scope creep. No drive-by fixes. No "while I'm here" refactors. One priority, done right.

### Step 1: Orient (5 minutes max)

1. Read `PROGRESS.md` — find the priority you've been assigned. Understand what's done and what's open.
2. Read `UI_CRITIQUE.md` — find every critique point that relates to your assigned priority. These are your requirements.
3. Read `CLAUDE.md` — conventions, architecture patterns, pitfalls.
4. Read every file you'll touch. Don't guess at existing code. Read it.

### Step 2: Plan before you touch anything

Before writing a single line of code:

1. **Screenshot the current state.** Use Playwright (`npx playwright test` or a quick script) to capture the screen(s) you're about to change. Save to `e2e/screenshots/before/`. This is your "before" evidence.
2. **Write your plan as a checklist** in the conversation. List every specific change you'll make, which files, and what the user will see differently. Be concrete — "fix the idle screen" is not a plan. "Remove duplicate hero list from Party Readiness, keep only the center panel version with actionable badges" is a plan.
3. **Get approval.** Don't start coding until the user says go.

### Step 3: Implement with discipline

1. **One commit per meaningful change.** Not one giant commit. Not a commit per line. Group logically.
2. **Bump version** in `src/data/changelog.js` for each commit. Add a player-facing changelog entry.
3. **Run `npm run lint`** after each change. Don't add new lint errors.
4. **Run `npm run build`** before committing. Verify no build breaks.
5. **If you need new persistent state**, add a save migration in `src/store/helpers/migrations.js`. Increment `SAVE_VERSION`. Add fallback in `gameStore.js` merge function. Add to `resetGame`. If transient, add to `partialize`.
6. **Match existing style.** Pixel art CSS classes (`pixel-panel`, `pixel-btn`, etc.). SVG icons from `src/components/icons/`. No emojis in UI. No new paradigms.

### Step 4: Verify with screenshots

After implementation:

1. **Screenshot the new state.** Save to `e2e/screenshots/after/`. Same screens as your "before" shots.
2. **Show the before/after to the user.** Let them see what changed.
3. **Test edge cases.** Empty states, mobile viewport (375px), full inventory, new player (0 dungeons cleared), veteran player (20+ cleared). Screenshot anything that looks wrong.

### Step 5: Update tracking

1. Check off completed items in `PROGRESS.md`
2. Add a session handoff note at the top of the Handoff Notes section
3. If anything is deferred or discovered, document it in handoff notes
4. Commit the tracking updates

### Step 6: Stop cleanly

When the priority is done (or the session is ending):
- Verify the build passes
- Verify lint hasn't regressed
- Make sure every change is committed
- Update `PROGRESS.md` with what's done and what's next

---

## Priority Assignments

Tell Claude: **"Work on Priority N"** — where N is one of the following.

---

### Priority 5: Difficulty System

**Goal:** Move difficulty from a buried PrepScreen slider to a visible, persistent global setting.

**From PROGRESS.md:**
- Currently per-dungeon slider on PrepScreen (5 stops, 1.0x-3.0x, unlocks at D10)
- Backed by `dungeonSettings.difficultyMultiplier` in dungeonSlice
- Move to a "set and forget" global setting accessible from HUD, with optional per-run override

**From UI_CRITIQUE.md (Prep Screen):**
- "Party Power: Tough" — no scale shown, word without context is meaningless
- Difficulty info needs to be visible and understandable

**Data file:** `src/data/difficulty.js` already exists (uncommitted) with 5 stops, speed/elite bonuses, `getDifficultyInfo()`. Check if it has what you need before building new.

---

### Priority 5b: Equipment Screen Overhaul

**Goal:** Make the equipment screen feel like a proper RPG inventory. Diablo-inspired.

**From PROGRESS.md:**
- Phase 1 (Paper Doll + Components) ✅
- Phase 2 (Stat Breakdown) ✅ but needs visual testing
- Phase 3 (Affix Synergy System) — NOT STARTED
- Phase 4 (Enhanced Tooltips & Loot Feel) — NOT STARTED
- Phase 5 (Polish & Progression) — NOT STARTED

**From UI_CRITIQUE.md (Equipment Modal):**
- Hero paper doll is bare, equipment slots are unlabeled colored rectangles
- Inventory is a wall of same-sized cards — rarity has no visual weight difference
- Settings panel clips/overflows at bottom-left
- No inline comparison without tooltip hover
- Filter buttons are tiny and unlabeled
- Common and Epic items look the same size

**First session:** Visually test Phase 2 in-browser. Fix any issues. Then start Phase 3 or 4 based on what looks worst.

---

### Priority 6: Reduce Modal Dependency

**Goal:** Surface key information inline so players don't have to open full-screen modals for everything.

**From PROGRESS.md:**
- 18 total modals. Every major feature requires a modal that hides the dungeon canvas.
- Consider: inline skill bar, sidebar panels, floating tooltips, split-view layouts

**From UI_CRITIQUE.md:**
- Every modal uses the same dark blue panel — they all blur together after 5
- Equipment, Skills, Stats could show summaries inline
- Heroes modal is a read-only stat dump — could be sidebar content

**Approach:** Don't try to remove all modals. Pick the 2-3 most-opened modals (Heroes, Equipment, Skills) and add inline summaries/quick-actions that reduce how often players need the full modal.

---

### Priority 7: UI Polish Passes

**Goal:** Go screen by screen and fix visual hierarchy, spacing, information density, and empty states.

**This is a BIG priority. Break it into sub-sessions, one screen at a time:**

#### 7a: Idle Screen
From critique: massive dead space, redundant hero info, placeholder text, warning noise, no new-player experience. Also fix: "Victory!" shown to new players, "CONTINUE TO LEVEL 1" verb wrong, locked nav buttons anxiety.

#### 7b: Statistics Screen
From critique: seven identical blue cards, no graphs/charts/trends, "Progression" panel wastes space, tab labels unclear. This is endgame content for idle players — it should be visually rich.

#### 7c: Bestiary
From critique: "???" plus silhouettes is redundant, terrible noise ratio with mostly-empty sections, zero kill counts shown, theme tabs visible when empty.

#### 7d: Achievements
From critique: flat list with no grouping, anti-climactic completion, tiny reward text, all stars identical. Needs tiers, celebration, visual progression.

#### 7e: Homestead
From critique: monotonous identical cards, buried upgrade cost/benefit, milestone info looks disabled, no upgrade guidance.

#### 7f: Shop
From critique: bloated item cards, class restrictions easy to miss, no equipped comparison, destructive buttons have same styling.

#### 7g: Encyclopedia
From critique: plain HTML table, wall of text, oversized search bar, no cross-references. Needs the pixel art treatment.

#### 7h: Collection Screen
From critique: almost entirely empty, hostile empty states, no incentive hooks, detail panel is dead space.

#### 7i: Raids Modal
From critique: duplicate collection bar, hidden loot, no power-level indication, unclear costs.

#### 7j: Toast & Notification Polish
From critique: toasts have no icons (accessibility issue for colorblind users). Also: add defensive null guards to RunSummary.jsx, DeathRecap.jsx, and LootNotifications.jsx so corrupted save data can't crash the game (optional hardening — not a live bug, but good practice).

#### 7k: Mobile Layout
From critique: nav wraps into 3 rows consuming 25% of screen, badges overlap buttons, content below fold.

#### 7l: Changelog
From critique: dense and unscannable, "NEW" pills meaningless when all items are new.

#### 7m: New Player Experience
From critique: "Victory!" before doing anything, "CONTINUE" verb wrong, recruitment pushed before understanding heroes, locked features visible and anxiety-inducing. Need a proper first-time flow.

---

### Priority 8: Skill Management UX

**Goal:** Reduce the tedium of managing skills across 5-7 heroes.

**From PROGRESS.md:**
- Manual per-hero allocation with no templates or auto-spend
- 7 context switches minimum with a full party

**From UI_CRITIQUE.md (Skills Modal):**
- Left panel is an information firehose crammed into 250px
- Skill grid is inscrutable — no names visible, just colored squares
- "Choose wisely — only 10 skills total!" buried in small text
- Legend wastes space because visual language is unclear
- No visual tree — flat grid despite being called "Skill Trees"

---

### Priority 9: Raid Rethink

**Goal:** Make raids feel meaningful and rewarding with less friction.

**From PROGRESS.md:**
- Gate ascension behind raid clears
- More raid loot beyond uniques
- Raid selector UI overhaul

**From UI_CRITIQUE.md (Raids Modal):**
- Duplicate collection bar steals attention
- "Show bosses & drops" is collapsed — hiding the loot in a loot game
- No power-level indication per raid
- Unclear costs (Normal shows nothing)

---

### Priority 10: Balance Pass

**From PROGRESS.md:**
- Party size question (7 or 8 slots?)
- No party-size scaling on monsters
- Overall difficulty curve audit

---

### Priority 11: Combat & Graphics

**From PROGRESS.md:**
- Boss mechanics depth
- Attack/skill animations
- Status effect VFX
- General graphic enhancements

---

## Rules

1. **One priority per session.** If you finish early, stop. Don't start the next priority.
2. **Read before write.** Always.
3. **Screenshot before and after.** Always.
4. **Small commits.** Each commit should be reviewable in under 2 minutes.
5. **Don't fix what isn't in your priority.** Write it down in PROGRESS.md for a future session.
6. **If blocked, say so.** Don't hack around it. Document the blocker and move on to the next item within your priority.
7. **The game must build and run after every commit.** No broken intermediate states.
