# Equipment Screen Critique: Diablo/Destiny 2 Comparison

*Generated 2026-02-21 from Playwright screenshots across desktop (1440x900), widescreen (1920x1080), and mobile (390x844) viewports.*

---

## The Good (briefly)

- The stat breakdown panels (HP/ATK/DEF/SPD with source attribution) are genuinely useful - Diablo players love knowing where their numbers come from
- Rarity color-coding on item borders works
- The upgrade arrows (green highlight + arrow icon) on inventory items are a solid pattern from both Diablo and Destiny
- The tooltip showing equipped vs. candidate comparison (DOWNGRADE with red diffs) is correct directionally

---

## The Bad - Layout & Spatial Design

### 1. The Paper Doll is anemic
In Diablo, the character model dominates the left third of the screen. Destiny 2's Guardian fills the entire left half. Your "paper doll" is a 72px pixel art sprite with three 64px empty squares floating around it in a cross pattern. It looks like a form layout, not a character showcase. There's a massive amount of dead space between the hero name and the stat panel - the entire middle third of the screen is just... a tiny sprite and some boxes. This is the character fantasy screen. It should make the player feel powerful, not like they're filling out a tax form.

### 2. The Character tab has a brutal vertical scroll problem
At 1440x900, the Settings panel (Auto-equip, Auto-sell, Priority dropdowns) is cut off at the bottom. At default viewport the stat breakdowns push it below fold. You're asking the player to scroll past 4 stat breakdown boxes just to reach settings toggles. Diablo puts settings in a separate tab. They don't share screen real estate with the character sheet.

### 3. The 40/60 split when a slot panel opens is claustrophobic on the left
When you click a weapon slot, the hero side compresses to 40% width. The stat breakdowns that were already tight now become a compressed column fighting for space with the paper doll, the equipped item tooltip, and the hero name. Meanwhile the right panel (weapons list) gets 60% but shows items in a 2-column grid that wastes horizontal space with tiny stat labels.

### 4. No visual hierarchy in the slot panel
The equipped item tooltip appears as a floating card overlapping the paper doll area, while the replacement items panel sits to the right. There's no clear "currently equipped vs. candidates" visual relationship. Diablo III puts the equipped item on the left and the candidate on the right with comparison arrows between them. Destiny shows the equipped piece prominently with candidates below it. Your layout has the equipped tooltip floating ambiguously.

---

## The Bad - Inventory Tab

### 5. The inventory is a spreadsheet, not a loot screen
The inventory shows a flat list of rows with tiny icons, text names, and inline stats. This is fine for an email inbox. For a loot game, it's death. Diablo uses a grid of item icons where rarity glows, set bonuses shimmer, and you can visually scan your haul at a glance. Destiny uses card-style items with big power numbers. Your items are text rows with a 4px colored left border as the only visual rarity indicator. "Dragonfire Charm" and "Godslayer Charm" look almost identical - two rows of text with some numbers.

### 6. The stat diff numbers are microscopic and easy to miss
The green/red "+12" / "-6" comparison diffs are rendered at 9px font (`text-[9px]`) inline next to the base stat. At a glance, the entire right side of each inventory row is a jumble of tiny numbers that requires squinting. Diablo shows big green/red arrows. Destiny shows the power delta front-and-center. Your diffs are afterthoughts.

### 7. No item preview/detail without hover
The tooltip only appears on hover (or tap on mobile - if it even works). There's no way to tap an item and see its full detail card. On mobile, the stat columns are hidden entirely (`hidden md:flex`), so mobile players see item name + affixes + equip/sell buttons. They literally cannot see an item's stats without hovering.

---

## The Bad - Visual Identity

### 8. It doesn't feel like loot
Diablo's equipment screen makes you feel like you're sorting through a treasure hoard. Destiny's makes you feel like you're at a weapons dealer. Your equipment screen feels like you're looking at a database table with some colored borders. There's no texture, no shine, no visual weight. The `bg-gray-900/60` panels blend into the `bg-gray-950` background. Everything is flat dark rectangles on a slightly darker rectangle.

### 9. The equipment slot icons are placeholder-quality
The weapon slot shows a tiny orange line. The armor slot shows a tiny purple square. The accessory slot shows a tiny blue circle. These read as "icons we haven't designed yet." Compare to Diablo where empty slots show detailed outlines of swords, helmets, boots, etc.

### 10. No rarity "moment"
When you look at a legendary item in Diablo, it glows orange. In Destiny, exotic items have a gold shimmer and distinct visual treatment. Your legendary items have a `#f59e0b` colored left border and the word "Legendary" in orange text. The item row itself is the same dark gray as everything else. There's no visual payoff for getting rare loot.

---

## The Bad - Mobile

### 11. Mobile is barely functional
The paper doll takes up half the viewport, stat breakdowns require extensive scrolling, and there's no way to see the slot panel without pushing everything off-screen. The inventory tab hides all stat columns, so items are just names with buttons. This isn't a responsive design - it's a desktop screen being viewed through a keyhole.

---

## The Bad - Information Architecture

### 12. Two tabs isn't enough
"Character" and "Inventory" force too much onto each tab. Character has: hero info, paper doll, equipped item tooltips, full stat breakdown with sources, equipment settings, class priorities, AND the slot panel with all candidates. That's at least 3 screens of content jammed into one scrollable column. Diablo separates character stats, equipped gear, and inventory into distinct visual zones. Consider: Character (paper doll + equipped gear), Stats (detailed breakdowns), Inventory (grid), Settings (separate).

### 13. The "Sell Junk" button is easy to miss
It's a tiny 10px orange button next to the inventory count. If this is supposed to be a primary action for inventory management, it should be more prominent.

### 14. No equipped item comparison flow
If I want to see "what's the best weapon in my inventory for this hero", I click the weapon slot, get the slot panel, and then manually scan rows for green arrows. There's no "auto-select best upgrade" or even a sort-by-upgrade option. The sort dropdown only has "Rarity" as an option.

---

## Summary

The core data is there - stat sources, comparisons, affix display. But the presentation is developer-functional, not player-exciting. This is a spreadsheet wearing a dark theme, not a loot screen. Every surface-level visual decision is conservative (tiny fonts, flat panels, minimal color, cramped layout) where Diablo/Destiny go bold (large items, dramatic glows, clear visual hierarchy, generous spacing). The screen informs but doesn't excite. In a loot game, the equipment screen IS the game.
