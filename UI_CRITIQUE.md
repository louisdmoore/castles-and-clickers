# Castles & Clickers — UI/UX Critique

Automated Playwright screenshots of 22 screens. Three crashed the game. Everything else got reviewed.

---

## CRITICAL: Screens That Crash

**Run Summary & Death Recap** — Both show "SOMETHING WENT WRONG — Cannot convert undefined or null to object." These screens appear **every dungeon run**. If the data shape is even slightly off, the entire game dies. No graceful degradation — just a full ErrorBoundary nuke with "CLEAR SAVE & RELOAD" as an option. Terrifying for a player with hours invested.

**Loot Notifications** — Crashed with "Cannot read properties of undefined (reading 'name')." Any race condition in the loot pipeline that produces incomplete data kills the game. No defensive null checks on the render path.

---

## 01 — Idle Screen

- **Massive dead space.** The center is empty void between the sidebar and content panel. "Party Readiness" and "Next Target" are a narrow column floating in dark blue nothing. At 1280x720, ~40% of the screen is wasted.
- **Redundant information.** The sidebar shows Party with all heroes and levels. The center shows "Party Readiness" with the same heroes and levels. Same data, twice, different formatting.
- **"Victory! Ready for the next challenge?"** reads like placeholder text. Tells the player nothing — what did they clear? How hard was it? What's different about the next level?
- **Warning icons are noise.** Every hero row has yellow triangles: "6 SP", "No accessory", "Upgrade". When everything is a warning, nothing is.
- **"New Hero Slot Available!"** — Green banner with no way to act on it inline. Forces the player to hunt for the correct nav button.
- **Sidebar "PROGRESS" section** is bare text with no visual hierarchy. "ASCENSION A1 (+10%)" is meaningful data compressed into an unreadable label. "CLEARED 20/35" — 35 what? No context.

---

## 02 — Heroes Modal

- **Empty slots dominate.** Two "Recruit DPS (8000g)" and "Recruit Healer (12000g)" cards take the same visual weight as filled hero cards. Empty states shouldn't dominate the screen.
- **No hero interaction.** Stats (HP, ATK, DEF, SPD) are displayed but there's nothing to do with them. No equipment preview, no skill summary, no "click for details." Read-only stat dump.
- **Role labels are cramped.** "Tank" and "Healer" badges are tiny colored pills that are easy to miss. The role is the most important piece of info and gets the least visual weight.
- **No sense of power difference.** A level 25 Warrior and level 20 Ranger get identical card sizing. No visual indication of progression.

---

## 03 — Skills Modal

- **Left panel is an information firehose.** Hero tabs, portrait, "Skill Points 6/9" bar, stat block, RESPEC button, and legend — all in a ~250px column. It scrolls but you'd never know.
- **Skill grid is inscrutable.** Small square icons with tiny "A" badges. No skill names visible at rest. Just a grid of indistinguishable colored squares. A player has zero idea what any skill does.
- **"Choose wisely — only 10 skills total!"** is buried in small yellow text below the progress bar. The most important constraint is whispered instead of shouted.
- **The legend wastes premium space** explaining Unlocked/Available/Locked/Active with colored squares. If you need a legend, the visual language failed.
- **No visual tree.** Tiers are horizontal rows with no branches, no dependency lines. It's called "Skill Trees" but it's a flat grid.

---

## 04 — Equipment Modal

- **Hero paper doll is bare.** Three equipment slots are unlabeled colored rectangles with tiny text below ("WEAPON" / "ARMOR" / "ACCESSORY").
- **Inventory is a wall of same-sized cards.** Common Tattered Cloth (+2 defense) gets the same card as Epic Obsidian Blade (+40 attack). No visual weight difference between rarities.
- **Settings panel is clipped.** "Stat Priority" dropdowns at bottom-left are cut off by the viewport. Known bug still present.
- **No inline comparison.** Items show stats but no "this vs. what you have" without hovering for a tooltip. Grid is a guessing game.
- **Filter buttons are tiny and unlabeled.** Four small icon buttons. What do they mean? No text labels.

---

## 05 — Homestead Modal

- **Building cards are monotonous.** All seven are identical blue-bordered rectangles. Nothing distinguishes them visually besides a small pixel icon.
- **Upgrade cost/benefit is buried.** "UPGRADE [gold] 25,768 / +5%" — cost and benefit jammed into a button. Players need instant cost-vs-benefit comparison and this layout buries it.
- **Milestones are afterthoughts.** "Next at Lv7: 6th party slot" is in a dark sub-panel that looks disabled. The thing you're working toward should be prominent.
- **No upgrade guidance.** Seven buildings, all with upgrade buttons. No indicators of what's most efficient or recommended for current progression.

---

## 06 — Shop Modal

- **Item cards are bloated.** Icon, name, rarity, stats, class restriction, gold cost, BUY button per card. Four items fill the viewport. More than 8 items means extensive scrolling.
- **Class restrictions are easy to miss.** "Classes: shaman" in small gray text. Unusable items should be visually dimmed, not require reading fine print.
- **No equipped comparison.** "+42 attack +6 speed" on a staff — is that better than what I have? No context provided.
- **Destructive buttons have same styling.** "SELL NON-UPGRADES" and "REFRESH (90G)" look identical with no visual hierarchy between them.

---

## 07 — Bestiary Modal

- **"???" placeholders are lazy.** Undiscovered monsters show silhouette sprites AND "???" text. Pick one — the silhouette already communicates "undiscovered."
- **Terrible noise ratio.** Most of the screen is question marks. Discovered monsters with full stat blocks are buried among empty cards.
- **Theme tabs all visible** even when nearly empty. "Ancient Crypt (1/7)" shows one monster and six blanks. Collapse or gray out empty sections.
- **Zero kill counts displayed.** Showing "0" kills next to a discovered monster is clutter. Hide zero states.

---

## 08 — Encyclopedia Modal

- **It's a plain HTML table.** Combat Phases is a two-column table with border lines. No icons, no visuals, no interactivity. This is a wiki page, not a game encyclopedia.
- **Wall of text.** Section headers followed by paragraphs. The pixel art aesthetic is completely abandoned. Could be from any corporate knowledge base.
- **Oversized search bar.** Takes more vertical space than two content rows for a screen with maybe 50 entries.
- **No cross-references.** "Speed + d20" is highlighted but doesn't link to the Speed stat explanation. No internal navigation.

---

## 09 — Statistics Modal

- **Seven identical blue cards.** Dungeons Cleared, Monsters Slain, Bosses Slain, Gold Earned/Spent, Items Looted, Hero Deaths — all same size, same color, same layout. Interesting stats get no more weight than obvious ones.
- **"Progression" section** shows two numbers ("Highest Dungeon: 20, Active Heroes: 4") in their own full-width panel with a header. A lot of chrome for two data points.
- **Tab labels don't communicate value.** "Journey" could mean anything.
- **No graphs, no charts, no trends.** Pure numbers. No visual analytics. For an idle game where stats are endgame content, this is a massive missed opportunity.

---

## 11 — Raids Modal

- **Duplicate collection bar.** "Unique Collection 0/16" belongs on the Collection screen, not here. Steals attention from raid selection.
- **Hidden loot.** "Show bosses & drops" is collapsed by default. In a loot-driven game, you're hiding the loot behind an extra click.
- **No power-level indication.** Sunken Temple (Lv14) and Cursed Manor (Lv20) have identical ENTER buttons. If I'm Lv25, the easy raid should look obviously farmable.
- **Unclear costs.** "Hard: 50k" shown but "Normal" has no cost. Is it free? Ambiguous.

---

## 12 — Unique Collection Modal

- **Almost entirely empty.** "0/20 (0%)" with rows of "???" items. The detail panel takes ~40% of width to show a skull icon and "Select an item to view details."
- **No incentive hooks.** No rarity hints, no source hints, no "you're close to getting this" breadcrumbs. A checklist with no dopamine.
- **Tiny icons with "???"** and nothing else. Empty states should encourage action, not display void.

---

## 13 — Achievements Modal

- **Flat list, no grouping.** "Monster Slayer +500g" and "The Culling +50000g" in the same list with same styling. A 50,000g achievement should look dramatically different from a 500g one.
- **Anti-climactic completion.** Completed achievements get a green checkmark. No celebration, no sparkle. The check is anti-climactic.
- **Tiny reward text.** "+500g", "+3000g" are small text next to the title. The reward is the motivation — make it prominent.
- **All star icons identical yellow.** No bronze/silver/gold/diamond tiers. No visual progression.

---

## 15 — Dungeon Map

- **Locked vs. unlocked levels** distinguished only by fill color (blue vs. dark). Level 25 has a tiny boss sprite that's nearly invisible.
- **Region card icons are unreadable.** Three 16x16 icons crammed together on the right side of each region row. Boss sprites and checkmarks at a glance are just noise.
- **"TOTAL PROGRESS: 20/35"** in the smallest, least-styled text at the bottom. The most important metric on this screen.

---

## 16 — Prep Screen

- **Cleanest layout in the game.** Two-panel design (Party + Dungeon Info) is readable. But:
- **ALL CAPS hero names** (THORIN, SERAPHINA) — inconsistent with rest of UI which uses title case.
- **"Party Power: Tough"** — No scale shown. A word without context is meaningless. Is "Tough" good? Bad?
- **"Favored Drops: Blazing, Berserker's, of the Titan"** — Three affix names with no explanation of what they do. Insider knowledge required.
- **Milestone text inconsistency.** "Ready! to Library Lv2" has odd capitalization and awkward phrasing.

---

## 19 — Unique Drop Celebration

- **The best screen in the game.** Full-screen overlay with stars, gradient glow, centered card with stats and unique power. Proves the game *can* look great when motivated.
- **Background bleeds through.** The semi-transparent overlay lets the sidebar and idle screen show behind the celebration, cheapening the moment.
- **"Click anywhere to continue"** in faded text is easy to miss after the dopamine hit.

---

## 20 — Changelog Modal

- **Dense and unscannable.** Each version has 5-7 bullet points of dense text. No visual breaks, no screenshots, no before/after. Players skim changelogs.
- **"NEW" pills on every line** when many versions are unseen. When 15+ items say "NEW," the badge is meaningless.

---

## 21 — Toast Notifications

- **No icons.** Just colored left borders. A red border alone doesn't communicate "error" to a colorblind user. Every toast needs an icon (checkmark, X, warning triangle, info circle).
- **Small and easy to miss** against the dark background.

---

## 23 — Mobile Layout

- **Nav buttons wrap into THREE ROWS** at 375px. Heroes/Skills/Gear/Shop, then Home/Raids/Uniques/More, then Auto/Speed/Settings. Three rows consuming ~25% of the screen before content.
- **"NEW" badges overlap adjacent buttons** at mobile sizes. Looks broken.
- **Content below the fold.** Actual game content requires scrolling past all navigation chrome.

---

## 24 — New Player Empty State

- **"Victory! Ready for the next challenge?"** — Brand new player sees "Victory!" before doing anything. No first-time experience, no tutorial, no welcome.
- **"CONTINUE TO LEVEL 1"** — Continue? They haven't started. Should be "Start Level 1" or "Begin Your Journey."
- **"New Hero Slot Available!"** — Player has one Lv1 hero and is told to recruit more before understanding what heroes do.
- **Locked nav buttons visible.** 5 locked features and 3 available ones. Anxiety-inducing ratio. Hide locked features until close to unlocking.

---

## Systemic Issues

1. **Robustness**: 3/22 screens hard-crashed. Components don't guard against incomplete data.
2. **Information density**: Every screen either shows too much (Equipment, Skills, Bestiary) or too little (Stats, Collection, Heroes). No consistent progressive disclosure.
3. **Dead space**: Fixed sidebar + centered content wastes 30-40% of screen width on every screen.
4. **Visual monotony**: Every modal uses the same dark blue panel with the same border. After 5 modals they blur together.
5. **Empty states are hostile**: "???" everywhere, flat cards, "Select an item" placeholders. Empty states should encourage action.
6. **Mobile is an afterthought**: Nav wrapping, no touch optimization, content below fold.
7. **No visual hierarchy**: Important and trivial info get identical styling. Costs, rewards, warnings, and stats all look the same.
8. **Pixel font hurts readability**: Sub-labels like "6 SP", "No accessory", "Upgrade" become pixel mush at small sizes.
