# Session Prompt — Castles & Clickers Design Rethink

Paste this into a fresh Claude Code session to continue implementation work.

---

## Instructions for Claude

You are continuing implementation of the Castles & Clickers design rethink. Your job is to pick up where the last session left off, implement the next task(s), and leave a clean handoff for the next session.

### Step 1: Orient yourself

1. Read `PROGRESS.md` — this is your source of truth for what's done and what's next.
2. Read the **current task's section** in `DESIGN_RETHINK.md` (the section number is listed in PROGRESS.md).
3. Read `CLAUDE.md` for project conventions, lint rules, and architecture patterns.
4. Read any files you'll need to modify (the DESIGN_RETHINK.md implementation notes name specific files).

### Step 2: Work the next task

1. Pick the first unchecked task from PROGRESS.md under the current phase.
2. Before writing code, read every file you plan to modify. Understand the existing patterns.
3. Implement the feature following:
   - The implementation notes in DESIGN_RETHINK.md for that feature
   - The conventions in CLAUDE.md (pixel art style, Zustand selectors, existing CSS classes, no emojis in UI)
   - The performance patterns already in the codebase (useThrottledDisplay, stable refs, selector pattern)
4. Run `npm run lint` after changes. Don't add new lint errors (existing ~78 baseline errors are fine).
5. Run `npm run build` to verify no build breaks.
6. **One feature = one commit.** Commit with a clear message describing what was added. Bump the version in `src/data/changelog.js` and add a changelog entry.

### Step 3: Update progress

After each completed feature:
1. Check off the task in `PROGRESS.md`
2. Add a brief note on what was done and any decisions made
3. If you discovered something the next session needs to know (gotcha, prerequisite, data issue), add it to the "Handoff Notes" section at the bottom of PROGRESS.md
4. If you finish all tasks in the current phase, move the "Current Phase" marker to the next phase
5. Commit the PROGRESS.md update alongside the feature commit (or as a separate commit, either is fine)

### Step 4: Scope control

- **Do as many tasks as you can** within the current phase. If you finish the phase, move to the next.
- **Stop at phase boundaries** if the next phase has prerequisites that aren't met (noted in PROGRESS.md).
- **Don't skip ahead** — the phases are ordered by dependency.
- **If blocked**, document the blocker in PROGRESS.md Handoff Notes and move to the next unblocked task in the same phase.
- If a task turns out to be significantly larger than expected, implement the minimum viable version, note what's deferred in Handoff Notes, and move on.

### Guidelines

- Read before you write. Always.
- Match existing code style. This codebase uses specific patterns — don't introduce new paradigms.
- Keep changes minimal and focused. Don't refactor surrounding code.
- Test your work by running dev server (`npm run dev`) if you need to verify behavior.
- All UI must use pixel-art CSS classes (`pixel-panel`, `pixel-btn`, etc.) and SVG icons from `src/components/icons/`. Never use emojis.
- New store state needs save migration handling (see DESIGN_RETHINK.md Section 19, architectural prereq #3).
- When adding new state to Zustand slices, use the existing `merge` function in `gameStore.js` persistence config for backwards compatibility until the versioned migration system is built.

---

## Quick start (copy-paste into session)

```
cd /Users/louismoore/castles-and-clickers && cat SESSION_PROMPT.md
```

Then tell Claude:

> Read SESSION_PROMPT.md and get to work.
