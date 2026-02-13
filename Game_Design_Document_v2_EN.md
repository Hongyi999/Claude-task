# Dota2 Monopoly Game Design Document v2.0 (Optimized Edition)

> This document is based on the original design with comprehensive balance optimization and mechanism refinement

---

## 📋 Table of Contents
1. [Board Map Layout Design](#1-board-map-layout-design)
2. [Economic Balance Sheet](#2-economic-balance-sheet)
3. [Hero System](#3-hero-system)
4. [Item Shop System](#4-item-shop-system)
5. [Card System](#5-card-system)
6. [UI/UX Design](#6-uiux-design)
7. [Art Style Guide](#7-art-style-guide)
8. [Game Flow & Rules](#8-game-flow--rules)

---

## 1. Board Map Layout Design

### Design Philosophy
The board is divided into four sides, corresponding to the logical regions of the Dota 2 map:
1. **Bottom Side:** Radiant Safe Lane & Jungle
2. **Left Side:** River & Mid Lane
3. **Top Side:** Dire Offlane & Jungle
4. **Right Side:** High Ground & Ancients — **Most Expensive Zone**

---

### 🗺️ Detailed Board List (32 Spaces, Clockwise)

#### 【Corner 1: Start - GO】
**Fountain**
- **Mechanism:** Pass or land to receive 200G salary
- **Special Effect:** Full HP/Mana restore, remove all debuffs (mines, stuns)
- **Visual:** Blue fountain particle effect

---

#### 【First Side: Radiant Jungle & Safe Lane】(Brown/Light Blue Properties)

1. **Small Camp**
   - Price: 60G | Base Rent: 6G
   - Color Set: Spaces 1, 2 (2 properties to build)

2. **Medium Camp**
   - Price: 60G | Base Rent: 6G
   - Color Set: Spaces 1, 2

3. **Outpost 1** [Transportation]
   - Price: 200G
   - Rent Rule: Own 1=20G, 2=50G, 3=120G, 4=250G
   - Special: Cannot build houses

4. **Radiant T1 Tower**
   - Price: 100G | Base Rent: 10G
   - Color Set: Spaces 4, 6, 7 (3 properties to build)

5. **Bounty Rune** [Chance Card]
   - Draw a Rune card (random event)

6. **Radiant T2 Tower**
   - Price: 100G | Base Rent: 10G
   - Color Set: Spaces 4, 6, 7

7. **Radiant Shrine**
   - Price: 120G | Base Rent: 12G
   - Color Set: Spaces 4, 6, 7

8. **Side Shop** [Tax Space]
   - Pay "Shopping Tax" 100G
   - Can purchase items here

---

#### 【Corner 2: Jail - Low Priority】
**Low Priority**
- **Just Visiting:** Nothing happens
- **In Jail:** Skip turn until rolling doubles or paying 50G bail
- **Visual:** Red cage particle effect on hero model

---

#### 【Second Side: River & Mid Lane】(Pink/Orange Properties)

9. **Mid T1 Tower**
   - Price: 140G | Base Rent: 14G
   - Color Set: Spaces 9, 11, 12 (3 properties to build)

10. **Secret Shop** [Utility]
    - Price: 150G
    - Rent Rule: Dice roll × 4; If owning both shops (Secret + Jungle), × 10
    - Cannot build houses

11. **Mid T2 Tower**
    - Price: 140G | Base Rent: 14G
    - Color Set: Spaces 9, 11, 12

12. **Mid T3 Tower**
    - Price: 160G | Base Rent: 16G
    - Color Set: Spaces 9, 11, 12

13. **Outpost 2** [Transportation]
    - Price: 200G (same as above)

14. **Radiant Ancients**
    - Price: 180G | Base Rent: 18G
    - Color Set: Spaces 14, 16 (2 properties to build)

15. **Neutral Item** [Community Chest]
    - Draw an item card (usually positive)

16. **Dire Ancients**
    - Price: 200G | Base Rent: 20G
    - Color Set: Spaces 14, 16

---

#### 【Corner 3: Free Parking - Roshan Pit】
**Roshan Pit**
- **Mechanism:** Safe zone, no payment required
- **Special Mechanic:** If you roll doubles (Critical Strike), you can challenge Roshan
  - **Challenge:** Both players roll dice, highest wins
  - **Victory Reward:** Obtain "Aegis of the Immortal" (block 1 rent payment or free revive after bankruptcy)
  - **Failure Penalty:** Lose 100G

---

#### 【Third Side: Dire Jungle & Offlane】(Red/Yellow Properties)

17. **Dire T1 Tower**
    - Price: 220G | Base Rent: 22G
    - Color Set: Spaces 17, 19, 20 (3 properties to build)

18. **Haste Rune** [Chance Card]
    - Draw a Rune card

19. **Dire T2 Tower**
    - Price: 220G | Base Rent: 22G
    - Color Set: Spaces 17, 19, 20

20. **Dire T3 Tower**
    - Price: 240G | Base Rent: 24G
    - Color Set: Spaces 17, 19, 20

21. **Outpost 3** [Transportation]
    - Price: 200G

22. **Dire Melee Barracks**
    - Price: 260G | Base Rent: 26G
    - Color Set: Spaces 22, 23 (2 properties to build)

23. **Dire Ranged Barracks**
    - Price: 260G | Base Rent: 26G
    - Color Set: Spaces 22, 23

24. **Jungle Shop** [Utility]
    - Price: 150G (pairs with Space 10 Secret Shop)

---

#### 【Corner 4: Go to Jail - Reported!】
**Reported!**
- **Mechanism:** Sent directly to "Low Priority" (teleport to Corner 2)
- **Penalty:** Cannot collect salary this turn
- **Sound Effect:** "Your behavior score is too low!"

---

#### 【Fourth Side: High Ground & Core Structures】(Green/Deep Blue Properties - Most Expensive)

25. **Radiant Melee Barracks**
    - Price: 300G | Base Rent: 30G
    - Color Set: Spaces 25, 26 (2 properties to build)

26. **Radiant Ranged Barracks**
    - Price: 300G | Base Rent: 30G
    - Color Set: Spaces 25, 26

27. **Neutral Item** [Community Chest]
    - Draw a card

28. **Radiant T4 Towers**
    - Price: 320G | Base Rent: 32G
    - Independent property (no color set)

29. **Outpost 4** [Transportation]
    - Price: 200G

30. **Buyback Cost** [Luxury Tax]
    - Pay 200G or 10% of total assets (whichever is higher)

31. **Radiant Ancient**
    - Price: 350G | Base Rent: 35G
    - Color Set: Spaces 31, 32 (2 properties to build)

32. **Dire Ancient**
    - Price: 400G | Base Rent: 40G
    - Color Set: Spaces 31, 32

---

## 2. Economic Balance Sheet

### 2.1 Basic Currency System

| Item | Value | Notes |
|------|-------|-------|
| **Starting Capital** | 2000G | ⬆️ Increased from 1500G to ensure early purchase space |
| **Salary (Passing Fountain)** | 200G | Once per lap |
| **Bail (Exit Jail)** | 50G | Or roll doubles to exit free |
| **Shopping Tax** | 100G | Landing on Side Shop |
| **Luxury Tax** | 200G or 10% assets | Landing on "Buyback Cost" space |

---

### 2.2 Building Upgrade System (Core Balance Adjustment)

#### ✅ Optimized Rent Multiplier Table

| Level | Building Name | Multiplier | Build Cost | Example: Dire Ancient (400G) |
|-------|--------------|------------|------------|------------------------------|
| **Empty** | No Building | x1 | - | 40G |
| **Level 1** | Green House x1 | x3 | 100G/house | 120G |
| **Level 2** | Green House x2 | x5 | 100G/house | 200G |
| **Level 3** | Green House x3 | x8 | 100G/house | 320G |
| **Level 4** | Green House x4 | x15 | 100G/house | 600G |
| **Level 5** | Red Hotel | x30 | 500G + Remove 4 houses | 1200G |

**Key Changes Explained:**
1. ⬇️ **Significantly reduced rent multiplier**: From x125 down to x30 (Level 5)
2. ⬆️ **Increased hotel construction cost**: From 200G to 500G
3. 🛡️ **Added rent cap protection**: Single rent cannot exceed 40% of player's assets
4. 🚫 **First 20 turns ban Red Hotels**: Prevent speed-running

#### Example Calculation (Rent for Different Property Values)

| Property | Price | Base Rent | Lvl 1 | Lvl 2 | Lvl 3 | Lvl 4 | Lvl 5 (Red Hotel) |
|----------|-------|-----------|-------|-------|-------|-------|-------------------|
| Small Camp | 60G | 6G | 18G | 30G | 48G | 90G | 180G |
| Radiant T1 | 100G | 10G | 30G | 50G | 80G | 150G | 300G |
| Mid T1 | 140G | 14G | 42G | 70G | 112G | 210G | 420G |
| Dire T1 | 220G | 22G | 66G | 110G | 176G | 330G | 660G |
| Ancient (Max) | 400G | 40G | 120G | 200G | 320G | 600G | 1200G |

---

### 2.3 Building Construction Rules

#### Color Set Requirements
```
2 properties: Can start building green houses
3 properties: Build faster (can build 2 houses directly)
4 properties: Build cost -10%
```

#### Build Order
```
1. Must own all properties in a color set
2. Must distribute houses evenly across all properties (no skipping)
3. Example: Cannot build 3 houses on Property A while Property B only has 1
```

#### Red Hotel Construction Conditions
```
1. All properties in color set must have 4 green houses
2. Pay 500G
3. Remove 4 green houses, upgrade to 1 red hotel
```

---

### 2.4 Bankruptcy & Revival Mechanism (New Addition)

#### Bankruptcy Determination
```
When a player cannot pay rent/tax/penalty:
1. Automatically sell all buildings (50% of construction cost recovery)
2. Auction all properties (starting price = 80% of purchase price)
3. Still cannot pay → Bankruptcy elimination
```

#### Buyback Mechanism
```
【Conditions】
- Each player can buyback only once per game
- Requires 500G "revival fee"

【Effects】
- Clear all properties and buildings
- Return to start, receive 1000G to restart
- Keep hero and purchased items

【Strategic Significance】
- Provides comeback opportunity
- Extends game duration
- Increases dramatic tension
```

---

## 3. Hero System

### 3.1 Hero Ability Table (Balanced Version)

| Hero | Type | Ability Name | Effect | CD | Power Rating |
|------|------|--------------|--------|----|----|
| **Alchemist** | Passive | Greedy | Salary +30G; Rent income +5% | - | ⭐⭐⭐⭐ |
| **Bounty Hunter** | Passive | Jinada | Pay 20% less rent on others' properties (max 3 times/lap); Opponent still receives 100%, difference subsidized by bank | - | ⭐⭐⭐⭐ |
| **Nature's Prophet** | Active | Teleportation | Teleport to any unpurchased property or own property; Pay 50G teleport fee | 7 turns | ⭐⭐⭐⭐ |
| **Techies** | Active | Land Mines | Place mine on any space, next player to land gets stunned 1 turn and loses 100G | 4 turns | ⭐⭐⭐ |
| **Faceless Void** | Active | Time Walk | After rolling dice, if unsatisfied, can undo and move back 1-3 spaces (player choice) | 5 turns | ⭐⭐⭐⭐ |
| **Crystal Maiden** | Passive | Arcane Aura | When drawing Rune cards, draw 2 and choose 1 (other players still draw only 1) | - | ⭐⭐⭐ |
| **Rubick** | Active | Spell Steal | Copy the last active ability used by the previous player, use immediately (doesn't consume their CD) | 4 turns | ⭐⭐⭐⭐ |
| **Axe** | Passive | Counter Helix | When someone lands on the same space as you, force them to pay you 50G | - | ⭐⭐⭐ |
| **Invoker** | Active | Sun Strike | Target a player, deduct 10% of their current gold (min 100G, max 500G) | 6 turns | ⭐⭐⭐⭐ |
| **Pudge** | Active | Meat Hook | Hook a player 3-4 spaces ahead to your space (triggers Axe effect or rent collection) | 4 turns | ⭐⭐⭐ |

---

### 3.2 Detailed Hero Ability Descriptions

#### 🟢 Well-Balanced Heroes

**Techies**
```
【Land Mines】
- At the start of your turn, can place a mine on any space
- Next player to land on it:
  ∟ Stunned for 1 turn (skip next action)
  ∟ Pay 100G to Techies
- Mine shows a small red dot on board (but not exact location)
- CD: 4 turns
```

**Axe**
```
【Counter Helix】
- Passive trigger: When another player moves to Axe's space
- Effect: Force them to pay 50G "friction fee"
- Special interaction: Works with Pudge's Meat Hook
```

**Pudge**
```
【Meat Hook】
- Can hook any player 3-4 spaces ahead
- Hook to your own property → They pay rent
- Hook to Axe's space → Triggers Counter Helix
- Tactical play: Combo with teammates or your own expensive properties
- CD: 4 turns
```

---

#### 🟡 Strategic Heroes

**Alchemist** ⚖️ Balanced
```
【Greedy】(Passive)
- Salary bonus: +30G extra when passing Fountain (total 230G)
- Rent bonus: All rent collected +5%
- 30 turns estimated extra income: ~450G salary + 300G rent = 750G
- Positioning: Steady development, significant late-game economic advantage
```

**Bounty Hunter** ⚖️ Balanced
```
【Jinada】(Passive)
- When landing on others' properties, pay 20% less rent
- Opponent still receives 100% rent (difference subsidized by bank)
- Max 3 triggers per lap (Jinada energy limit)
- Positioning: High survivability, doesn't affect opponent income
```

**Nature's Prophet** ⚖️ Balanced
```
【Teleportation】(Active)
- Can teleport to: ①Any unpurchased property ②Your own property
- Teleport fee: 50G
- CD: 7 turns (extended from 5)
- Positioning: Flexible map control, but with economic cost
```

**Faceless Void** ⚖️ Balanced
```
【Time Walk】(Active)
- After rolling dice, if unsatisfied with result, can undo
- Choose to move back 1-3 spaces (player selects distance)
- CD: 5 turns (extended from 3)
- Positioning: Risk control, precise danger avoidance
```

---

#### 🔵 Support/Special Heroes

**Crystal Maiden** ⚖️ Enhanced
```
【Arcane Aura】(Passive)
- When drawing Rune cards, draw 2 cards and keep 1
- Other players still draw only 1 card
- Positioning: Luck amplification, suitable for players who like probability
```

**Rubick** ⚖️ Clarified
```
【Spell Steal】(Active)
- Copy the "active ability" of the previous player
- Use immediately, no CD wait
- Doesn't consume their ability CD
- Can only steal active abilities (Teleportation, Land Mines, Meat Hook, etc.)
- CD: 4 turns
- Positioning: High risk high reward, requires timing judgment
```

---

### 3.3 Hero Selection Recommendations

#### Beginner-Friendly Heroes ⭐⭐⭐⭐⭐
- **Techies**: Simple and direct, plant mines for money
- **Axe**: Passive trigger, no operation needed
- **Alchemist**: Constant bonuses, no decision-making required

#### Intermediate Player Heroes ⭐⭐⭐⭐
- **Nature's Prophet**: Requires strategic teleport timing planning
- **Faceless Void**: Need to judge when to use time rewind
- **Pudge**: Need to calculate hook profit

#### Advanced Player Heroes ⭐⭐⭐⭐⭐
- **Rubick**: Need to predict others' abilities, copy timing
- **Invoker**: Need to assess opponent assets, select targets
- **Bounty Hunter**: Need to calculate Jinada usage count

---

## 4. Item Shop System

### 4.1 Item Purchase Rules

```
【Purchase Timing】
1. When passing "Side Shop" or "Jungle Shop" spaces
2. At the start of each turn (can purchase from anywhere)
3. Before paying rent (emergency purchase of defensive items)

【Carry Limit】
- Each hero can carry maximum 2 items
- Divine Rapier occupies 1 slot
- Can sell items anytime (50% of purchase price recovery)
```

---

### 4.2 Item Attributes Table

| Item Name | Icon | Price | Effect | Tactical Positioning | Recommended Heroes |
|-----------|------|-------|--------|----------------------|-------------------|
| **Wraith Band** | ![wb](wraith_band.png) | 200G | Salary +50G | Early must-buy, pays back in 5 laps | Alchemist, Bounty |
| **Phase Boots** | ![pb](phase_boots.png) | 500G | Can choose to move only one die's value (5 turn CD) | Precise map control | Prophet, Void |
| **Aghanim's Shard** | ![shard](shard.png) | 800G | Ability CD -1 turn | Ability acceleration | Techies, Rubick |
| **Aghanim's Scepter** | ![scepter](scepter.png) | 1500G | Force upgrade one property 1 level (no color set needed) | Quick formation | All heroes |
| **Divine Rapier** | ![rapier](rapier.png) | 3000G | All property rent x1.5; Drops on bankruptcy | Game ender | Late-game cores |
| **Black King Bar** | ![bkb](bkb.png) | 300G | Immune to 1 jail or mine (consumable) | Defensive item | All heroes |
| **Town Portal Scroll** | ![tp](tp_scroll.png) | 50G | Next action teleports to Fountain (consumable) | Emergency recall | All heroes |
| **Bottle** | ![bottle](bottle.png) | 100G | Store 1 Rune card for later use | Tactical reserve | CM, Rubick |

---

### 4.3 Detailed Item Descriptions

#### 💰 Economic Items

**Wraith Band**
```
【Attribute】Salary +50G
【Calculation】Extra 50G per lap, pays back in 4 laps
【Recommendation】First item early game, snowball artifact
【Stacking】Stacks with Alchemist's Greedy = 280G/lap
```

**Town Portal Scroll (TP)**
```
【Effect】After use, next dice roll teleports directly to Fountain
【Uses】
1. Emergency return to collect salary
2. Avoid dangerous spaces ahead
3. Last salary collection before bankruptcy
【Price】50G (one-time consumable)
```

---

#### 🎯 Tactical Items

**Phase Boots**
```
【Effect】After rolling 2 dice, can choose:
- Move only first die's value
- Move only second die's value
- Move sum of both (normal)

【Example】
Roll 3 and 5:
- Option 1: Move 3 spaces
- Option 2: Move 5 spaces
- Option 3: Move 8 spaces

【CD】5 turns
【Tactics】Precisely avoid Red Hotel zones
```

**Aghanim's Scepter**
```
【Effect】Force upgrade one property 1 level
【Special】No need to own complete color set
【Uses】
1. Quickly build houses on key properties
2. Break stalemate (when opponent blocks color set)
3. Combo with Divine Rapier

【Price】1500G
【Recommendation】Mid-to-late game acceleration
```

---

#### ⚔️ Offensive Items

**Divine Rapier**
```
【Effect】All property rent x1.5
【Special Mechanic】
- On bankruptcy or jail, Rapier drops on current space
- Other players can pick up by landing on it
- Pickup auto-equips (must replace if carrying 2 items)

【Example】
- Original rent 1000G → With Rapier 1500G
- Combo with Red Hotel, landing = instant bankruptcy

【Risk】
- 3000G investment, benefits opponent if you go bankrupt
- Dota2's classic "double-edged sword" design

【Recommendation】
- When ahead: Solidify advantage
- When behind: All-in gamble
```

---

#### 🛡️ Defensive Items

**Black King Bar (BKB)**
```
【Effect】Immune to 1 instance of:
- Jail sentence (Reported, Go to Jail)
- Techies Land Mines
- Invoker Sun Strike

【Usage Timing】
- See "Reported" space ahead
- Know opponent Techies just placed mine
- Critical turn must take action

【Price】300G (one-time consumable)
【Recommendation】Late-game essential defensive item
```

**Bottle**
```
【Effect】Store 1 Rune card for later use
【Uses】
1. Store good runes when drawn (like Double Damage)
2. Use at critical moments (about to collect high rent)
3. Combo with Crystal Maiden (draw 2 choose 1)

【Price】100G
【Recommendation】Mid-to-late game purchase, increases tactical depth
```

---

### 4.4 Item Combination Recommendations

#### Early Combinations (5-15 turns)
```
【Steady Development】
- Wraith Band + TP Scroll
- Cost: 250G
- Effect: Quick payback + emergency capability

【Aggressive Expansion】
- Aghanim's Scepter
- Cost: 1500G
- Effect: Quick house building, seize advantage
```

#### Mid-Game Combinations (15-30 turns)
```
【Map Control】
- Phase Boots + Black King Bar
- Cost: 800G
- Effect: Precise movement + immune to control

【Ability Focus】
- Aghanim's Shard + Bottle
- Cost: 900G
- Effect: Frequent ability usage
```

#### Late-Game Combinations (30+ turns)
```
【Finishing Combo】
- Divine Rapier + Black King Bar
- Cost: 3300G
- Effect: Ultra-high rent + immune to jail

【Comeback Combo】
- Aghanim's Scepter + Bottle
- Cost: 1600G
- Effect: Quick house building + stored runes
```

---

## 5. Card System

### 5.1 Rune Cards - High Randomness

| Card Name | Rarity | Effect | Tactical Use |
|-----------|--------|--------|--------------|
| **Double Damage** | Common | Next rent collection x2 | Combo with Red Hotel |
| **Invisibility** | Rare | Pass opponent properties without rent, until next dice roll | Traverse dangerous zones |
| **Illusion** | Common | Create illusion on any space, landing player stunned 1 turn | Like Techies mine |
| **Arcane** | Rare | All ability CDs refresh immediately | God-tier for ability heroes |
| **Bounty** | Common | Immediately gain 150G | Economic supplement |
| **Haste** | Rare | Next dice roll +3 value | Quick reach target |
| **Regeneration** | Common | Immune to next rent payment | Defensive card |

**Draw Probability:**
- Common (60%): Bounty, Illusion, Regeneration
- Rare (30%): Double Damage, Haste
- Epic (10%): Invisibility, Arcane

---

### 5.2 Neutral Item Cards - Fate Events

| Card Name | Type | Effect | Balance Adjustment |
|-----------|------|--------|-------------------|
| **Connection Lost** | Negative | Skip 1 turn, cannot collect rent | Light penalty |
| **GabeN's Blessing** | Positive | Next building upgrade cost 50% off | Random reward |
| **Ganked!** | Negative | Pay 30G to each player | ⚖️ Reduced from 50G to 30G |
| **Nerfed by Patch** | Negative | All properties -30% rent this turn | ⚖️ Changed from "downgrade" to "rent reduction" |
| **Deny** | Neutral | One property immune to negative effects this turn, but cannot collect rent | Tactical card |
| **Roshan is Up** | Neutral | All players move 1-2 spaces toward Roshan Pit | Disrupts rhythm |
| **Refresher Orb** | Positive | All ability CDs refresh immediately | ⚖️ Newly added |
| **Tome of Knowledge** | Positive | Immediately gain 300G | ⚖️ Newly added |

**Draw Probability:**
- Positive (40%): GabeN, Refresher, Tome
- Neutral (30%): Deny, Roshan
- Negative (30%): Connection Lost, Ganked, Nerfed

---

### 5.3 Card Usage Rules

```
【Rune Cards】
- Use immediately upon draw or discard
- Can store in Bottle
- Crystal Maiden can draw 2 choose 1

【Neutral Item Cards】
- Take effect immediately upon draw
- Cannot store or cancel
- Represents "random events"

【Draw Timing】
- Land on "Bounty Rune" or "Haste Rune" spaces
- Land on "Neutral Item" spaces
```

---

## 6. UI/UX Design

### 6.1 Main Interface Layout (HUD)

```
┌─────────────────────────────────────────────────┐
│ [Radiant Logo] ⚔️ Turn 12/50 ☀️/🌙 [Dire Logo]  │ Top Bar
├─────────────────────────────────────────────────┤
│                                                 │
│          3D Board View                          │
│                                                 │
│     (32-space board with Dota2 map texture)     │
│                                                 │
├──────────────┬──────────────────┬───────────────┤
│ 🧙 Hero      │  💰 1250G        │   🎲 ROLL     │ Bottom Bar
│ Level 15     │ [Skills] [Items] │ (Huge Button) │
│ Alchemist    │  CD:3 | CD:-     │               │
└──────────────┴──────────────────┴───────────────┘
│                                                 │ Right Sidebar
│  📜 Event Log                                   │
│  • Player A landed on Red Hotel! -1200G         │
│  • Player B buyback successful!                 │
│  • Player C rolled doubles, challenging Roshan! │
└─────────────────────────────────────────────────┘
```

---

### 6.2 Interactive Popup Designs

#### Property Purchase Popup
```
╔═══════════════════════════════════╗
║   🏰 Radiant T1 Tower             ║
╠═══════════════════════════════════╣
║                                   ║
║   [3D Tower Model Rotating]       ║
║                                   ║
║   Price: 100G                     ║
║   Base Rent: 10G                  ║
║   Color Set: T1, T2, Shrine       ║
║                                   ║
║  [ 💰 Purchase ]  [ ❌ Pass ]     ║
╚═══════════════════════════════════╝
```

#### Buyback Interface
```
╔═══════════════════════════════════╗
║      💀 BANKRUPTCY!                ║
╠═══════════════════════════════════╣
║                                   ║
║  Unable to pay rent: 1200G        ║
║  Current assets: 800G             ║
║                                   ║
║  ⏰ Countdown: 10 seconds          ║
║                                   ║
║  [ ⚡ BUYBACK - 500G ] (1 left)   ║
║  [ 🏳️ GG - Surrender ]            ║
╚═══════════════════════════════════╝
```

---

### 6.3 New UI Features

#### 🚨 Rent Warning System
```
【Trigger Condition】
- Red Hotel or expensive property within 3 spaces

【Display Effect】
- Screen edge red flashing
- Warning text:
  "⚠️ 2 spaces ahead: Dire Ancient (Red Hotel) - Est. Rent 1200G"

【Interaction】
- 2 seconds decision time
- Can use Phase Boots, Faceless Void ability, etc.
```

#### 💚 Asset Health Display
```
【HP Bar Below Player Avatar】
- Green (>1500G): Safe
- Yellow (500-1500G): Caution
- Red (<500G): Danger
- Flashing Red (<200G): Near bankruptcy

【Tactical Significance】
- Quick opponent status assessment
- Decide whether to use Invoker ability to attack
- Decide whether to use Pudge hook
```

---

### 6.4 Sound Effects & BGM

#### Core Sound Effects (Direct Dota2 Resources)
```
✅ Gold Gained: ui.gold_tick (last-hit sound)
✅ Purchase Item: ui.shop_purchase (coin sound)
✅ Build House: ui.crafting_success (magic sound)
✅ Upgrade Hotel: DOTA_Item.Refresher.Activate
✅ Jailed: Hero_Silencer.GlobalSilence.Cast
✅ Buyback: ui.buyback (epic metal clash)
✅ Rapier Drop: DOTA_Item.Rapier.Drop
✅ Roshan Challenge: Roshan.Slam + Roshan.Death
```

#### BGM Recommendations
```
【Main Menu】Dota2 - Main Theme
【In-Game】Dota2 - Battle Music (low volume loop)
【Victory】Dota2 - Victory Fanfare
【Bankruptcy】Dota2 - Defeat Sting
```

---

## 7. Art Style Guide

### 7.1 Core Art Philosophy

**Style Keywords:**
- Miniature Battlefield
- Dark Fantasy
- High-Fidelity Models
- Rich Particle Effects

---

### 7.2 Resource Extraction Plan

#### Extracting Resources from Dota2 Client
```
【Model Files】
Path: Steam\steamapps\common\dota 2 beta\game\dota\models\heroes\
Format: .vmdl → Convert to .fbx

【Texture Files】
Path: Steam\steamapps\common\dota 2 beta\game\dota\materials\
Format: .vtf → Convert to .png

【Sound Files】
Path: Steam\steamapps\common\dota 2 beta\game\dota\sounds\
Format: .vsnd → Convert to .wav/.mp3

【UI Icons】
Path: Steam\steamapps\common\dota 2 beta\game\dota\panorama\images\
Format: .png (use directly)
```

---

### 7.3 Hero Token Design

**Model Processing:**
```
1. Extract hero FBX models
2. Remove combat animation skeletons
3. Keep "Loadout Idle" animation
4. Simplify to 5000-8000 polygons (performance optimization)
```

**Base Design:**
```
Material: Metallic PBR
Color: Assigned by player
  - Player 1: Gold
  - Player 2: Silver
  - Player 3: Bronze
  - Player 4: Emerald
  - Player 5: Amethyst

Logo: Dota2 Logo etched on base
Size: 3cm diameter (virtual units)
```

---

### 7.4 Board & Building Design

#### Board Texture
```
【Base】
- Screenshot Dota2 7.xx version map top-down view
- Resolution: 4096x4096
- Grid size: Uniform 128x128 pixels

【Radiant Zone】
- Grass texture: Green with moss-covered stones
- Color tone: Warm (yellowish-green)

【Dire Zone】
- Lava texture: Black-red with flame cracks
- Color tone: Cool (reddish-black)

【River Zone】
- Water texture: Blue with sparkling ripples
- Dynamic effect: UV scrolling simulates water flow
```

#### Building Models

**Green Houses**
```
Shape: Retain classic Monopoly house silhouette
Material:
  - Radiant side: White stone + moss (Radiant Stone)
  - Dire side: Black rock + lava veins (Dire Stone)
Decoration:
  - Roof features miniature "Iron Branch" or "Tango" model
Size: Height ~1/3 of grid space
```

**Red Hotels**
```
Shape: Retain classic Monopoly large hotel silhouette
Material:
  - Radiant side: Glowing white marble
  - Dire side: Black volcanic rock (with red glow)
Decoration:
  - Doorway features miniature "Aegis" model
  - Top has particle effect light pillar (gold/red)
Size: Height ~2/3 of grid space
```

---

### 7.5 Visual Effects Design

#### Movement Effects
```
【Hero Movement】
- Ground trail (Radiant gold, Dire red)
- Particles last 0.5s then fade

【Dice Roll Effects】
- Dice descend from sky with rotation
- Slight screen shake on landing
- Number display enlarges with golden flash
```

#### Property Effects
```
【Purchased Properties】
- Grid edge shows player color border
- Border has flowing light animation

【Building Construction】
- "Growing" animation from ground
- Construction sound effects (ding ding)

【Red Hotels】
- Top has continuous light pillar effect
- Extremely intimidating presence
```

---

## 8. Game Flow & Rules

### 8.1 Game Start Flow

```
1️⃣ Select player count (2-5 players)
2️⃣ Each player chooses a hero (10 to choose from, no duplicates)
3️⃣ Determine turn order (all players roll dice, highest goes first)
4️⃣ Each player receives starting capital: 2000G
5️⃣ All hero tokens placed at "Fountain" start
6️⃣ Game begins!
```

---

### 8.2 Single Turn Flow

```
🎲 Turn Start Phase
├─ Check if in jail (Yes→ Attempt exit; No→ Continue)
├─ Item purchase phase (optional)
└─ Ability cooldowns -1

🎯 Action Phase
├─ Roll 2 dice
├─ Move token
├─ Trigger space effect
│  ├─ Empty→ Purchase option
│  ├─ Opponent property→ Pay rent
│  ├─ Chance/Neutral Item→ Draw card
│  └─ Special space→ Special effect
└─ Use hero ability (optional)

🏁 Turn End Phase
└─ Turn count +1, switch to next player
```

---

### 8.3 Special Rules

#### Doubles Rule
```
【When Rolling Doubles (Same Value on Both Dice)】
- After completing current turn, immediately roll again
- 3 consecutive doubles→ Forced to jail (prevent infinite loop)

【When in Jail】
- Roll doubles→ Free exit
- Don't roll doubles→ Stay jailed or pay 50G bail
```

#### Salary Collection
```
【Passing or Landing on "Fountain"】
- Base salary: 200G
- Alchemist bonus: +30G
- Wraith Band bonus: +50G
- Maximum possible: 280G/lap
```

#### Bankruptcy Auction
```
【When Player Goes Bankrupt】
1. Automatically sell all buildings (50% of construction cost)
2. Auction all properties
   - Starting bid = 80% of purchase price
   - Other players bid
   - Highest bidder wins
3. Still cannot pay→ Eliminated or buyback
```

---

### 8.4 Victory Conditions

```
【Standard Victory】
- All other players bankrupt
- Last remaining player wins

【Time Victory】(Optional rule)
- At turn 50, player with most assets wins
- Assets = Cash + Property value + Building value + Item value

【Ancient Victory】(Optional rule)
- Own both Radiant Ancient + Dire Ancient + Red Hotels on both
- Instant victory
```

---

### 8.5 Estimated Game Duration

#### 2-Player Game
```
Estimated turns: 30-40 turns
Estimated time: 30-35 minutes
Pace: Fast, direct confrontation
```

#### 3-Player Game
```
Estimated turns: 35-45 turns
Estimated time: 35-45 minutes
Pace: Medium, alliances and betrayals
```

#### 4-Player Game
```
Estimated turns: 40-50 turns
Estimated time: 45-55 minutes
Pace: Chaotic, high variance
```

#### 5-Player Game
```
Estimated turns: 45-60 turns
Estimated time: 50-65 minutes
Pace: Slow, complex strategy
```

---

## 📊 Appendix: Quick Reference Tables

### Hero Power Rankings
```
⭐⭐⭐⭐⭐ Alchemist, Nature's Prophet, Rubick
⭐⭐⭐⭐   Bounty Hunter, Faceless Void, Invoker
⭐⭐⭐     Techies, Pudge, Axe, Crystal Maiden
```

### Item Purchase Priority
```
【Early】Wraith Band > TP Scroll > Bottle
【Mid】Phase Boots > Aghanim's Shard > BKB
【Late】Divine Rapier > Aghanim's Scepter
```

### Property Investment ROI
```
Low-price properties (60-100G): Slow return, but safe
Mid-price properties (140-200G): Balanced, recommended
High-price properties (300-400G): High risk high reward
```

---

## 🎮 Development Priority Recommendations

### Phase 1: Core Prototype (2-3 weeks)
```
✅ Basic board (32 spaces)
✅ Dice roll movement system
✅ 3 test heroes (Alchemist, Axe, Techies)
✅ Purchase, rent, bankruptcy system
✅ Simple UI (text display sufficient)
```

### Phase 2: Game Mechanics (3-4 weeks)
```
✅ All 10 heroes
✅ Building system (Green houses + Red hotels)
✅ Item system (5-8 items)
✅ Rune cards + Neutral item cards (8 each)
✅ Complete UI (HP bars, skill CD, event log)
```

### Phase 3: Art & Audio (2-3 weeks)
```
✅ Import Dota2 models and textures
✅ Particle effects
✅ Sound effects and BGM
✅ Animations (movement, construction, bankruptcy, etc.)
```

### Phase 4: Testing & Balance (2-4 weeks)
```
✅ Player testing
✅ Data collection
✅ Numerical tuning
✅ Bug fixes
✅ Final optimization
```

**Total Development Cycle: 9-14 weeks**

---

## ✅ Document Completion Status

- ✅ Board design refined
- ✅ Economic system balanced
- ✅ Hero abilities rebalanced
- ✅ Item system detailed design
- ✅ Card system optimized
- ✅ UI/UX design proposal
- ✅ Art style guide
- ✅ Game rules complete
- ✅ Development roadmap

**Status: Ready for Development Phase! 🚀**

---

*Document Version: v2.0 - Optimized Balance Edition*  
*Last Updated: February 13, 2026*
