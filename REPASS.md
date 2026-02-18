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

- [x] ~~RunSummary auto-dismiss 5s + PrepScreen auto-dismiss 5s — total 10s between runs feels long with auto-advance~~ (v0.5.1: reduced both to 3s, total 6s)
- [ ] MilestoneWidget goal priorities — are the "nearest goals" actually the most useful ones to show?
- [ ] PrepScreen "favored drops" display — does it make sense to players who haven't seen the affix system yet?
- [ ] PrepScreen dungeon preview — should it show monster types / difficulty info?

## Contribution Meter

- [ ] Role-aware stat choice (tank=dmg taken, healer=healing, dps=damage) — intuitive or confusing?
- [ ] Bars reset every run — no way to see previous run's contribution after leaving prep screen
- [ ] With 6 heroes the meter is tall — may push sidebar content down too far

## Difficulty Slider

- [ ] Balance tuning — does 3.0x difficulty feel fair with +200% enemy stats? May need playtesting
- [x] ~~Drop rate cap — at 3.0x the normal mob drop chance is 75% (0.25 * 3.0), boss is 270% (capped at 100% but uncapped in code). Should cap the multiplied chance at 1.0~~ (v0.5.1: wrapped with Math.min(1.0, ...))
- [x] ~~Difficulty setting persists across sessions — is that the right UX? Player might forget they set it to 3.0x and get wiped~~ (v0.5.1: difficulty badge now shows in DungeonHeader during combat)
- [ ] Auto-advance + high difficulty — should auto-advance reset difficulty to 1.0x to protect idle players?

## Hero Traits

- [x] ~~HeroRecruitment.jsx is dead code — never imported by any component. Should be removed or integrated~~ (v0.5.1: deleted)
- [x] ~~`recruitFromTavern` in heroSlice is also never called from UI — tavern recruitment has no frontend~~ (v0.5.1: removed action)
- [ ] Trait display only on HeroCard — traits should also be visible on the tavern recruitment UI (once it exists) and the sidebar hero list
- [x] ~~`regenPercent` trait (Enduring) not wired into combat — needs per-turn HP regen in combatStatusEffects.js~~ (v0.5.1: wired)
- [x] ~~`controlResist` trait (Iron Will) not wired into status effect application — needs resist check in statusEngine.js~~ (v0.5.1: wired)
- [x] ~~`healingMultiplier` / `healingReceivedMultiplier` traits (Devoted) not applied in healing code paths~~ (v0.5.1: wired in skillEngine + combatSkillExecution)
- [x] ~~`accuracyBonus` trait (Steady Hand) not applied — no accuracy system exists yet~~ (v0.5.1: trait removed, no accuracy system)
- [ ] Glass Cannon `damageMultiplier` is applied as attack boost in statCalculator — should this be a true damage multiplier in combat resolution instead?
- [ ] Existing heroes get empty traits array on migration — intentional (no retroactive random traits), but may feel bad for players

## Loot Targeting

- [ ] Favored affix display on PrepScreen — players see affix names but may not understand what they do. Tooltip or explanation needed?
- [ ] 2x weight may not be noticeable enough — with 20 affixes in the pool, a favored affix goes from ~5% to ~9.5%. Increase to 3x?

## Infused / Ascended Gear

- [x] ~~Infused/Ascended items override rarity color — player can't tell rarity (rare vs epic) at a glance anymore. Show both?~~ (v0.5.1: tooltip now shows rarity + [Infused]/[Ascended] label)
- [x] ~~`quality` field not displayed anywhere in equipment tooltips or inventory — only the name prefix and color signal quality~~ (v0.5.1: quality label added to EquipmentTooltip)
- [ ] Ascended 1.3x stat boost stacks with rarity multiplier — verify the resulting stat values aren't too high for game balance
- [ ] Equipment comparison tooltips don't account for quality tier — should "Infused" be treated as an upgrade signal?

## Room Events

- [ ] Event balance — Healing Spring full heal may be too strong in early dungeons; Cursed Altar 20% HP cost may be too harsh
- [ ] Shrine of Fortune gold cost scaling — cost is `50 * dungeonLevel`, may need tuning for late-game gold levels
- [ ] Trapped Chest loot — generates a single item via `generateEquipment`, no difficulty/rarity boost. Should trapped chests guarantee better rarity?
- [x] ~~Wandering Merchant — always gives rare+ item for free. May need a gold cost or trade mechanic to feel more like a "merchant"~~ (v0.5.1: costs 50*dungeonLevel gold, lower-tier fallback if can't afford)
- [ ] Imprisoned NPC +10% attack buff — permanent for the run, no visual indicator on hero stats. Should show as a buff icon
- [ ] Monster Ambush 2x XP — only applies to that room's combat. Is 2x enough to feel rewarding?
- [ ] Crumbling Floor skip combat — kills all non-boss monsters. If the room has a boss, the skip doesn't apply. Is this clear to the player?
- [ ] Ancient Library — gives 2x XP to one random hero. No feedback about which hero got the bonus
- [ ] Room event combat log messages — events log to combat log, but combat log resets on new combat. Events may not be visible long enough
- [ ] Once-per-run events (healing_spring, wandering_merchant, abandoned_campfire) — `usedEvents` tracking is per-generation, not per-run. If dungeon is re-entered, these could appear again

## Tower of Trials

- [ ] Tower effective level caps at 50 — `getTowerEffectiveLevel(floor) = min(9 + floor, 50)`. Floors above 41 all have the same difficulty. Should scale further?
- [ ] Tower has no loot drops — heroes don't get gear from tower runs. Intentional (challenge mode) but may feel unrewarding
- [ ] No healing at all in tower — passive exploration healing disabled, no healing springs. Healer classes become essential. Is this too restrictive?
- [ ] Tower seed display — shown on TowerResult modal and PrepScreen best score. Seed is cosmetic only (no seed-based replay). Should explain what seed means
- [ ] TowerResult auto-dismiss 8s — same as DeathRecap. If player is away, they won't see their score. Score is persisted though
- [ ] Tower entry from PrepScreen only — no way to enter tower from main menu or when not in prep phase. UX may be confusing
- [ ] Tower floor display in zone header — shows "Tower Floor X" but no indication of effective dungeon level
- [ ] Tower with auto-advance on — tower doesn't auto-advance (it's a separate flow), but auto-advance timer on PrepScreen still counts down. Verify no conflict

## Reforging

- [ ] Reforge cost curve tuning — is 2000g base too cheap or too expensive for the stage of the game where rare+ items appear?
- [ ] Lock-one 2x multiplier — is this enough of a premium? Consider 3x for high-ascension players
- [ ] Reforging on inventory items — currently only works on equipped items. Should inventory items be reforgeable too?
- [x] ~~Reforge result feedback — toast shows "Reforged!" but doesn't show what changed. Should show old vs new affixes~~ (v0.5.1: toast now shows [old] → [new] affix names)
- [ ] ReforgePanel visibility — only appears when a slot with rare+ gear is selected. May not be discoverable for new players

## Affix Synergies

- [ ] Synergy display in EquipmentScreen — shows active synergies but no indication of "almost active" synergies (1 affix away from a pair)
- [ ] Synergy bonuses in tooltips — EquipmentTooltip doesn't show what synergies an item contributes to
- [ ] `getPassiveAffixBonuses` called multiple times per combat tick — called for attacker in attack calc, for defender in dodge calc, and for defender in damage taken calc. Consider per-tick caching
- [ ] Fortify synergy (Ironclad) calls `getPassiveAffixBonuses` a second time in `resolveHeroTargetDamage` after it's already called at line 305 for `damageTakenMultiplier`. Could share the result
- [ ] Synergy balance — +10% dodge from Quicksilver is very strong. Verify it doesn't make speed-stacking builds unkillable

## Status Effect Combos

- [ ] Combo messages in combat log — "SHATTER!" etc. May scroll by too fast in rapid combat. Consider visual effect or notification
- [ ] Hemorrhage (bleed refresh on crit) — refreshes to template duration regardless of remaining duration. Is this always beneficial or could it extend a low-duration bleed?
- [ ] Toxic Fire requires burn + poison on same target — both are hero weapon affixes. Need two heroes with blazing/venomous to trigger this. Is that achievable?
- [ ] Combo accessibility — no in-game documentation for what combos exist. Players need to discover them through gameplay or external guides
- [ ] Monster status combos — combos work for both hero and monster attacks. If a monster stuns a hero, other monsters get +50% Punish damage on that hero. Intentional?

## Layout Overhaul (v0.4.0)

- [ ] Three-column grid only activates at 1440px+ — verify behavior on 1280px, 1366px, and ultrawide monitors
- [ ] Collapsible run stats panel — does the toggle button/icon make sense? Is "Run Stats" the right label?
- [ ] GameLayout extraction — verify no regressions in modal stacking order (12+ modals moved to ModalManager)
- [ ] Mobile layout — sidebar drawer still works after extraction? Test hamburger menu on small screens
- [ ] DungeonHeader extracted — does zone header still align properly with canvas below it?

## Capstone Auras (v0.4.0)

- [ ] Warlord +10% party attack — is this too strong when stacking with ascension bonuses and prestige? Check actual ATK values at A3+
- [ ] Iron Fortress +15% party defense — same stacking concern. Verify tanks don't become unkillable
- [ ] Divine Radiance 2% party regen — this is per-tick regen. Verify it doesn't trivialize early/mid dungeons
- [ ] Aura stacking — can a party have multiple auras active? If so, is the combined bonus balanced?
- [ ] Aura display in sidebar — glow indicator on aura providers. Is it visible enough? Does it explain what the aura does?
- [ ] Aura loss on respec — if a hero with a capstone aura respecs, the aura should disappear. Verify stat cache invalidates
- [ ] `currentPartyAuras` module-level state in statCalculator — needs to be updated when heroes change skills. Verify all code paths call `setPartyAuras()`

## Unique Item Leveling (v0.4.0)

- [ ] XP table tuning — `[0, 500, 2000, 5000, 12000]` — is the curve too steep or too flat? How many dungeons to max a unique?
- [ ] Stat scale `[1.0, 1.15, 1.35, 1.60, 2.0]` — 2x stats at level 5 is a huge power spike. Verify it doesn't break game balance
- [x] ~~Conditional XP triggers not wired into combat — `on_crit`, `on_kill`, `on_heal` etc. defined but `gainUniqueXp` never called from combat code~~ (v0.5.1: on_kill, on_crit, on_heal wired into combatDamageResolution + combatSkillExecution)
- [ ] Level display on UniqueCollectionScreen — star icon at max level, number for levels 1-4. Clear enough?
- [ ] XP bar visibility — is the XP progress bar on the detail panel noticeable? Players need to know their unique is gaining XP
- [ ] Unique level scaling in stat display — does the equipped item tooltip show the leveled-up stats or base stats?
- [ ] `uniqueLevels` not in partialize exclusion — it's persisted, which is correct. But verify it saves/loads properly

## Duplicate Fusion (v0.4.0)

- [ ] Fusion notification (`unique-fused`) — purple border, "Duplicate fused! Level X" text. Is this clear that it's a good thing?
- [ ] Max-level duplicate → gold conversion — shows "Max level - converted to Xg". Is the gold amount balanced? Uses `calculateDuplicateValue`
- [ ] Fusion skips XP entirely — goes straight to level+1. Is this too generous vs. earning XP through gameplay?
- [ ] Fusion UX — no confirmation dialog. If a player wanted to sell the duplicate for gold instead, they can't. Intentional?
- [ ] Multiple rapid fusions — finding 3+ duplicates quickly. Does each fusion notification show correctly?

## Hero Prestige Stars (v0.4.0)

- [ ] +3% per star balance — at 5 stars that's +15% all stats. Combined with ascension bonuses, how strong does a hero get?
- [ ] Prestige resets to level 10 — hero loses all skills but keeps equipment. Is level 10 the right reset point?
- [ ] Prestige button only in SkillTreeScreen — should it also be accessible from hero card or sidebar?
- [ ] Prestige disabled during dungeon — verified, but toast message could be more helpful (explain why)
- [ ] Prestige confirmation modal — does it clearly communicate what's lost vs gained?
- [ ] Prestige star display in sidebar/HeroCard/PrepScreen — ★ symbols. Do they scale well with 5 stars? Any alignment issues?
- [x] ~~Prestige count has no cap — can prestige infinitely for +3% each time~~ (v0.5.1: capped at 10 stars, 30% max bonus)
- [ ] Stars survive ascension — verified via spread operator. But test an actual ascension with prestiged heroes to confirm

## Raid Difficulty Tiers (v0.5.0)

- [ ] Heroic gold cost (50k) — is this the right price point? May be trivial for late-game, too expensive for mid-game
- [ ] Heroic unique drop bonus (+50%) — is this noticeable? With base 20% unique drop rate going to 30%, verify the difference feels meaningful
- [ ] Mythic unique drop bonus (+100%) — 2x unique drops. Verify it doesn't make uniques trivially farmable
- [ ] Mythic dungeon affixes — only stat-based affixes (fortified/hasty/enraged/resilient) and passive affixes (vampiric/thorny) are applied at monster creation. Bolstering (per-room scaling) and bountiful (gold bonus) are not wired into combat yet — will be handled by the "Dungeon affixes" task
- [ ] Difficulty selector UX — three buttons inline below raid header. Is this discoverable? Do players understand what each tier means?
- [ ] Difficulty not persisted per-raid — resets to Normal each time the modal opens. Should it remember last selected?
- [ ] Mythic affix preview — currently shows "2 random dungeon affixes" text but doesn't preview which affixes will roll. Should the preview show the rolled affixes before entering?
- [ ] Raid difficulty in DungeonHeader — shows [Heroic]/[Mythic] tag next to raid name. Verify it's visible and not clipped
- [ ] Raid recap difficulty display — shows difficulty tag on completion screen. Verify it renders correctly for all tiers

## Raid-Specific Mechanics (v0.5.0)

- [ ] Water Curse -20% speed — is this impactful enough to feel like a raid mechanic? May need tuning (e.g., -30%)
- [ ] Ghost Ward 75% DR on all non-boss enemies — is this too punishing? Makes trash mobs near-unkillable without high damage builds
- [ ] Ghost Ward DR stacks with boss phase DR — verify bosses don't have both passive DR and phase DR simultaneously
- [ ] Raid mechanic display in RaidSelectorModal — shows name and description. Is SkullIcon the right indicator? Should it be more prominent?
- [ ] Combat log message for raid mechanics — logged once at dungeon setup. Should it persist or remind the player mid-combat?
- [ ] Only 2 of 5 raids have mechanics — sky_fortress, the_abyss, void_throne need mechanics designed and added (Tier 2)
- [ ] Hero speed debuff is applied once at setup — if heroes are resurrected or rejoin, do they keep the debuff? Currently yes (baked into stats)
- [ ] Monster passive DR not visible to the player — no UI indicator shows enemies have damage reduction. Should show as a buff icon or stat overlay

## Dungeon Affixes (v0.5.0)

- [ ] Affix rolling at 2.0x+ difficulty — is the threshold right? Should 1.5x also get occasional affixes?
- [ ] Bolstering +10% per room — at room 10+, monsters have +100% stats. May snowball too hard in longer dungeons. Needs playtesting
- [ ] Bolstering scaling applies at combat start — if monsters are pre-placed, their stats in the monsters array won't match the scaled stats shown in combat. Could confuse HP bar display
- [ ] Bountiful +50% gold — does this feel impactful? Consider showing the bonus in gold drop combat log messages
- [ ] Affix badges in DungeonHeader — are they visible enough? On narrow screens they may wrap or overlap other elements
- [ ] Affix preview before entering — player doesn't see which affixes will roll until dungeon starts. Should PrepScreen show a preview?
- [ ] Affix interaction with raid difficulty tiers — Mythic raids already roll 2 affixes. If a Mythic raid has bountiful, verify gold calculations don't double-dip
- [ ] No affix display in RunSummary or DeathRecap — player won't see what affixes were active after the run ends

## Raid Mastery (v0.5.0)

- [ ] Mastery stat buffs applied in setupDungeon — scales attack, defense, maxHp, speed. Are all four stats the right choice? Should speed be excluded to keep a ceiling on dodge/double attack?
- [ ] Mastery progress bar in RaidSelectorModal — only visible after first clear. Is this discoverable enough?
- [ ] Master tier unique drop bonus (+25%) stacks with difficulty tier bonus — verify the combined boost doesn't make mythic master raids drop uniques too reliably
- [ ] Mastery labels (Novice/Apprentice/Veteran/Master) — are these clear enough? "Novice" shown for 0 clears but not in the mastery badge area
- [ ] No mastery reset on ascension — mastery carries over. Is this intended? Should it reset to provide replay incentive?
- [ ] Combat log "Raid Mastery" message — shown once at setup. Is it visible enough given other setup messages (affixes, mechanics)?

## Essence & Unique Awakening (v0.5.0)

- [ ] Essence earn rates — 50/100/200 for Normal/Heroic/Mythic raids and 10-20 for 2.0x+ dungeons. Are these balanced? 500 cost means ~5 Normal raids to awaken one unique
- [ ] Awakened power descriptions are data-only — none of the enhanced effects are wired into combat yet. Need to implement when unique powers are wired in general
- [ ] Essence display in HUD — only appears when > 0. Should there be a tooltip or info about how to earn it?
- [ ] Awakening is one-way and irreversible — no confirmation dialog. Should there be one for spending 500 essence?
- [ ] Awakened power preview shown in UniqueCollectionScreen — is it clear enough that this is a preview vs the current power?
- [ ] No essence display in stats screen — should totalEssenceEarned appear in the Stats tab?
- [ ] Essence earned on dungeon completion — awarded after set() clears dungeon state. Uses `dungeonDifficulty` captured before the set. Verify this works
- [ ] No essence spent tracking in stats — only totalEssenceEarned is tracked, not totalEssenceSpent

## Achievement System (v0.5.0)

- [ ] Achievement check timing — only runs after dungeon/raid completion. Should it also run after recruiting heroes, buying items, or leveling up?
- [ ] Speed clear threshold (30 seconds) — is this achievable? May need tuning based on actual run durations
- [ ] Flawless run tracking — only counts zero deaths. Should "flawless" also require no healing used?
- [ ] Solo room clear condition — tracks alive heroes === 1. Does this count correctly if heroes die mid-room?
- [ ] Achievement gold rewards — flat amounts defined per achievement. Are the amounts balanced with the current economy?
- [ ] Hidden achievements show "???" — is it clear enough to the player that hidden achievements exist and can be discovered?
- [ ] Achievement progress bars — only show for stat-based achievements. Custom conditions show no progress (0 or 1). Could show partial progress for multi-step customs
- [ ] `useGameStore.getState()` called outside selector in AchievementScreen — progress calculation uses full state snapshot. May not react to real-time stat changes while the modal is open

## Progressive Disclosure (v0.5.0)

- [ ] Celebration toast ordering — if multiple milestones unlock at once (e.g., first clear triggers D1 welcome + death recap), do the toasts stack well?
- [ ] Locked button tooltip — shows "Unlocks at Dungeon X". Is this discoverable enough? Should it be more prominent?
- [ ] Achievements/Stats gated at D5 — but achievements start tracking from D1. Player may miss early achievement progress
- [ ] Shop gated at D5 — is this the right level? Players may want to buy gear earlier
- [ ] `checkFeatureUnlocks` called only after endDungeon — should it also fire on game load for players who already passed milestones without the feature?
- [ ] Celebration toasts use `addToast` — verify they don't conflict with other post-dungeon toasts (loot, level-up, etc.)
- [ ] Ascension prompt at D30 — this fires even if the player has already ascended. Should it track whether the player has seen this message?

## General

- [x] ~~Lint count crept from ~78 to ~84 — audit whether any are from Phase 1-2 changes~~ (v0.5.1: lint at 81, no new errors from polish pass)
- [ ] No tests for any Phase 1-3 features — acceptable for now but increasing risk surface
- [ ] Save migration — new state fields (prepPhase, deathLog, runStats, lastDeathRecap) use partialize exclusion, not migration. Will this cause issues for existing saves?
- [ ] Versioned migration system built but `merge` function in gameStore still does its own hero sanitization — should that logic move into migrations too?
