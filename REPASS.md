# Repass — Review & Polish Tracker

Things that shipped but need a second look. Add items as you go, check them off when resolved.

---

## Layout & Positioning

- [ ] ContributionMeter in sidebar — does it fit well with 6 heroes + buffs visible? May need collapsible toggle
- [ ] LootNotifications at `bottom-28` — verify it doesn't overlap canvas or combat log at various screen sizes
- [ ] Suggest-equip notification card is wider/taller than regular notifs — check it doesn't clip off-screen on narrow viewports
- [ ] CombatLog at `max-h-24` — is 96px enough to be useful? May need to test with fast combat / many entries
- [ ] Toast notifications (top-right) vs zone header — do they overlap on small screens?
- [ ] PrepScreen layout — untested on mobile / narrow screens
- [ ] DeathRecap modal sizing — does the kill order + hero summary overflow on small screens with 6 heroes?

## Smart Auto-Equip

- [ ] Threshold tuning — is rare+ the right cutoff? Does the 10% close-call threshold fire too often or too rarely?
- [ ] Suggest-equip with auto-advance on — 8s enough time? Items go to inventory if ignored, but player may not notice
- [ ] Multiple suggest-equip notifs stacking — if 2 rare items drop in quick succession, do the buttons still work?
- [ ] Stat diff display — are the abbreviated stat names (ATK, DEF, SPD, HP) clear enough?

## Death Recap

- [ ] DOT killer names ("Burn", "Poison", "Bleed") — should these say "Burn damage" or name the monster that applied the DOT?
- [ ] `healingReceived` stat — verify it accumulates correctly (was added alongside existing `healingDone`)
- [ ] Healing vs damage balance message — is "Incoming damage outpaced healing by X" actionable feedback?
- [ ] Kill order accuracy — deaths are recorded per-tick, so simultaneous deaths within one tick may have arbitrary ordering

## Equipment Comparison Tooltips

- [ ] Tooltip positioning — does it clip off-screen when hovering items near edges?
- [ ] Comparison shows stat diffs but not affix comparison — is that enough info to decide?
- [ ] Tooltip on mobile — hover doesn't exist on touch, need tap-to-show or long-press

## Run Summary & Prep Screen

- [ ] RunSummary auto-dismiss 5s + PrepScreen auto-dismiss 5s — total 10s between runs feels long with auto-advance
- [ ] MilestoneWidget goal priorities — are the "nearest goals" actually the most useful ones to show?
- [ ] PrepScreen "favored drops" display — does it make sense to players who haven't seen the affix system yet?
- [ ] PrepScreen dungeon preview — should it show monster types / difficulty info?

## Contribution Meter

- [ ] Role-aware stat choice (tank=dmg taken, healer=healing, dps=damage) — intuitive or confusing?
- [ ] Bars reset every run — no way to see previous run's contribution after leaving prep screen
- [ ] With 6 heroes the meter is tall — may push sidebar content down too far

## Difficulty Slider

- [ ] Balance tuning — does 3.0x difficulty feel fair with +200% enemy stats? May need playtesting
- [ ] Drop rate cap — at 3.0x the normal mob drop chance is 75% (0.25 * 3.0), boss is 270% (capped at 100% but uncapped in code). Should cap the multiplied chance at 1.0
- [ ] Difficulty setting persists across sessions — is that the right UX? Player might forget they set it to 3.0x and get wiped
- [ ] Auto-advance + high difficulty — should auto-advance reset difficulty to 1.0x to protect idle players?

## Hero Traits

- [ ] HeroRecruitment.jsx is dead code — never imported by any component. Should be removed or integrated
- [ ] `recruitFromTavern` in heroSlice is also never called from UI — tavern recruitment has no frontend. Traits on tavern heroes are invisible to the player until a tavern UI exists
- [ ] Trait display only on HeroCard — traits should also be visible on the tavern recruitment UI (once it exists) and the sidebar hero list
- [ ] `regenPercent` trait (Enduring) not wired into combat — needs per-turn HP regen in combatStatusEffects.js
- [ ] `controlResist` trait (Iron Will) not wired into status effect application — needs resist check in statusEngine.js
- [ ] `healingMultiplier` / `healingReceivedMultiplier` traits (Devoted) not applied in healing code paths
- [ ] `accuracyBonus` trait (Steady Hand) not applied — no accuracy system exists yet
- [ ] Glass Cannon `damageMultiplier` is applied as attack boost in statCalculator — should this be a true damage multiplier in combat resolution instead?
- [ ] Existing heroes get empty traits array on migration — intentional (no retroactive random traits), but may feel bad for players

## Loot Targeting

- [ ] Favored affix display on PrepScreen — players see affix names but may not understand what they do. Tooltip or explanation needed?
- [ ] 2x weight may not be noticeable enough — with 20 affixes in the pool, a favored affix goes from ~5% to ~9.5%. Increase to 3x?

## Infused / Ascended Gear

- [ ] Infused/Ascended items override rarity color — player can't tell rarity (rare vs epic) at a glance anymore. Show both?
- [ ] `quality` field not displayed anywhere in equipment tooltips or inventory — only the name prefix and color signal quality
- [ ] Ascended 1.3x stat boost stacks with rarity multiplier — verify the resulting stat values aren't too high for game balance
- [ ] Equipment comparison tooltips don't account for quality tier — should "Infused" be treated as an upgrade signal?

## General

- [ ] Lint count crept from ~78 to ~84 — audit whether any are from Phase 1-2 changes
- [ ] No tests for any Phase 1-3 features — acceptable for now but increasing risk surface
- [ ] Save migration — new state fields (prepPhase, deathLog, runStats, lastDeathRecap) use partialize exclusion, not migration. Will this cause issues for existing saves?
- [ ] Versioned migration system built but `merge` function in gameStore still does its own hero sanitization — should that logic move into migrations too?
