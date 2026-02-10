# Development Prompt: Dota Chess - Ancient Wars

## Project Overview

You are tasked with developing a **tactical board game** inspired by Dota2, designed for 2 players with 15-30 minute gameplay sessions. This is a chess-like tactical combat game emphasizing hero skill combinations and Radiant vs Dire faction warfare.

---

## Game Specifications

### Core Design Principles
- **Genre**: Tactical combat board game (similar to Chess/Stratego)
- **Players**: 2 (Radiant vs Dire)
- **Duration**: 15-30 minutes (approximately 18 turns)
- **Core Experience**: Hero skill synergies + faction-based strategic combat
- **Victory Conditions**: Destroy enemy Ancient OR eliminate all enemy heroes

---

## Technical Requirements

### Game Board
- **Grid**: 9x9 square board
- **Three Lanes Structure**:
  - Top Lane: Columns 1-3
  - Mid Lane: Columns 4-6
  - Bot Lane: Columns 7-9
- **Key Zones**:
  - Ancient (base): Both sides at center of baseline (E1/E9 coordinates)
  - Towers: 2 per lane (front tower + back tower) = 6 total per side
  - River: Middle row 5, connecting all three lanes
  - Jungle: 2x2 areas in all four corners of the board

### Game Components to Implement

**1. Game Pieces**
- Hero pieces: 5 per player (unique models with attribute cards)
- Structure pieces:
  - Ancient x1 (10 HP, 3 ATK, range 4)
  - Towers x6 per side (5 HP, 2 ATK, range 3)
  - Barracks x3 (optional rule)
- Creep tokens: 10 circular markers per side
- Resource markers: Gold tokens x50, Experience tokens x30

**2. Card System**
- Hero Cards: 30 total (categorized by STR/AGI/INT)
- Item Cards: 24 total
  - Basic items x12 (500 gold each)
  - Core items x8 (1500 gold each)
  - Luxury items x4 (3000 gold each)
- Skill cooldown markers: 12 cards

**3. Auxiliary Tools**
- Gold/Experience counters for both players
- Turn counter
- First Blood token (grants team-wide +1 ATK)
- 2x six-sided dice (for skill checks)

---

## Game Setup Phase

### 1. Faction Selection
- Randomly determine who plays Radiant/Dire

### 2. Board Setup
- Place both Ancients (E1 for Radiant, E9 for Dire)
- Place 6 towers per side (2 per lane: front and back)
- Place "neutral resource" markers in jungle zones

### 3. Hero Draft (Ban/Pick Phase)
- Shuffle 30 hero cards, reveal 12 randomly
- **Draft Order**:
  1. Radiant bans 1 → Dire bans 1
  2. Dire picks 1 → Radiant picks 2 → Dire picks 2 → Radiant picks 1
  3. Repeat until both sides have 5 heroes

### 4. Starting Resources
- Starting gold: 625
- Starting experience: 0
- Draw 3 item cards (initial shop options)

### 5. Hero Deployment
- Both players secretly deploy 5 heroes in their back 3 rows (rows 1-3 for Radiant, 7-9 for Dire)
- Simultaneously reveal positions

---

## Core Game Mechanics

### Turn Structure (Alternating Activation)

**Phase 1: Turn Start**
- Draw 1 item card
- Receive turn income: 200 gold + (controlled towers x100)
- Reset all heroes' movement and action points

**Phase 2: Creep Spawn** (every 3 turns)
- Both sides spawn 1 creep token in each lane (3 total)
- Creeps auto-move forward 1 space

**Phase 3: Action Phase** (players alternate)
- Current player activates up to 3 heroes
- Each hero can choose: Move→Attack/Skill OR Skill→Move
- Opponent performs same
- Repeat until both pass

**Phase 4: Turn End**
- Check victory conditions
- Auto-move creeps
- Advance to next turn

---

## Hero Attribute System

### Base Attributes (each hero has):
- **HP (Health Points)**: 3-7
- **ATK (Attack)**: 1-3
- **ARM (Armor)**: 0-2 (damage reduction: incoming damage - armor)
- **MOV (Movement)**: 2-4 spaces per turn
- **RNG (Attack Range)**:
  - Melee: 1 space
  - Ranged: 2-3 spaces

### Primary Attribute (affects scaling):
- **STR (Strength)**: +0.5 HP per level
- **AGI (Agility)**: +0.3 ATK per level
- **INT (Intelligence)**: -1 turn skill cooldown (minimum 1)

### Leveling System
- Starting level: 1
- Experience required: 3/6/10/15 XP (to reach levels 2/3/4/5)
- Per level gains: Attribute boost + 1 skill point

---

## Movement Rules

- Heroes move in straight lines or diagonals
- Cannot pass through allied/enemy units
- Cannot pass through tower control zones (1 space around tower, unless tower destroyed)
- **River Bonus**: Movement in river spaces costs 0.5 movement (can move further)

---

## Combat System

### Attack Flow
1. Declare attacker and target
2. Check range (target must be within attack range)
3. Calculate damage: `ATK - target's ARM = actual damage`
4. Deduct target's HP
5. If HP ≤ 0, unit dies

### Special Combat Mechanics
- **High Ground Advantage**: If attacker is closer to enemy side (Radiant attacking from row ≥6, Dire from row ≤4), +1 ATK
- **Backstab**: Attacking from directly behind target, damage x1.5 (round down)
- **First Blood Reward**: First enemy hero kill grants +200 gold + First Blood token (team-wide +1 ATK)

---

## Skill System

### Skill Structure (each hero has 2 active skills)
- **Skill Name**
- **Cooldown**: 1-3 turns
- **Cost**: Some skills require gold or markers
- **Effect**: Damage/Control/Buff/Displacement etc.

### Skill Usage Rules
- Using a skill counts as the hero's "action" - cannot attack same turn
- Skills can be used before OR after movement
- Place cooldown marker after use
- **Skill Upgrade**: At level 3, choose one skill to upgrade (+50% effect OR -1 cooldown)

### Example Hero Skills

**Anti-Mage**
- **Blink**: Cooldown 2, teleport to any empty space within 3 range
- **Mana Break**: Cooldown 1, attack enemy hero and burn 1 skill (add +1 cooldown to one enemy skill)

**Crystal Maiden**
- **Frostbite**: Cooldown 2, freeze enemy within 2 range for 1 turn (cannot move or act)
- **Arcane Aura**: Passive, allied heroes within 2 range get -1 skill cooldown

---

## Item System

### Purchasing Items
- During action phase, spend gold to buy items from hand
- Each hero can equip maximum 3 items
- Items take effect immediately

### Item Categories

**Basic Items (500 gold)**
- Magic Wand: +1 HP
- Buckler: +1 ARM
- Boots of Speed: +1 MOV

**Core Items (1500 gold)**
- Phase Boots: +1 MOV, can phase through units once per turn
- Black King Bar (BKB): Active ability, immune to control skills for 1 turn
- Radiance: Deal 1 damage per turn to enemies within 1 space

**Luxury Items (3000 gold)**
- Refresher Orb: Active ability, instantly refresh all skill cooldowns
- Assault Cuirass: +2 ARM, reduce nearby enemies' ARM by 1
- Monkey King Bar: +2 ATK, attacks ignore armor

---

## Structure System

### Towers
- HP: 5
- ATK: 2 (auto-attacks enemies within 3 range)
- Special: Prioritizes enemies attacking allied heroes
- Destruction reward: Team gets +150 gold, lane push advantage

### Ancient (Base)
- HP: 10
- ATK: 3 (range 4)
- Special: Takes true damage (ignores armor), can only be attacked after both towers in that lane are destroyed

### Creeps
- HP: 1
- ATK: 1
- Movement: Auto-advance 1 space per turn, prioritize enemy creeps, then towers
- Kill reward: 50 gold + 1 XP

---

## Advanced Rules

### Jungle Resources
- Four corner 2x2 jungle zones spawn 1 "neutral creep" marker every 3 turns
- Heroes can spend 1 action to "jungle" (roll dice ≥4 succeeds)
- Success grants: 100 gold + 2 XP

### Rune System (Optional)
- River spawns 1 random rune every 5 turns
- Heroes auto-collect when moving through
- **Rune Types**:
  - Haste Rune: +2 MOV for 2 turns
  - Double Damage: ATK x2 for 2 turns
  - Invisibility: Cannot be targeted for 1 turn
  - Regeneration: Instantly restore 3 HP

### Team Synergy Mechanics

**Combo System**
- If 2 heroes use control skills on same target in same turn:
  - Damage skills deal +1 damage
  - Control duration +1 turn

**Aura Stacking**
- Multiple aura heroes with overlapping ranges: effects stack (maximum +2)

---

## Victory Conditions

Win by achieving any of the following:

1. **Ancient Destruction**: Destroy enemy Ancient
2. **Team Wipe**: All enemy heroes dead simultaneously
3. **Surrender**: Opponent concedes
4. **Time Victory**: After 30 minutes (18 turns), side with more structures destroyed or kills wins

---

## Strategy Framework

### Team Composition Archetypes
- **Push Lineup**: High ATK heroes + summoning units for fast tower destruction
- **Control Lineup**: Multiple disable skills to lock down enemy cores
- **Late Game Lineup**: Scaling heroes that dominate with items
- **Gank Lineup**: High mobility heroes for roaming kills

### Resource Management
- Prioritize items for core heroes
- Maintain at least 500 gold reserve for emergencies
- Don't over-invest in single hero - maintain balanced team

### Map Control
- Control river for rune advantage
- Distribute jungle resources efficiently
- Time tower defense vs push windows correctly

---

## Development Requirements

### 1. Hero Pool Design (30 heroes total)

Distribute by attribute:
- Strength heroes x10 (tanks, initiators)
- Agility heroes x10 (damage dealers, mobile)
- Intelligence heroes x10 (control, support)

**Each hero must have**:
- Unique skill set (2 active skills minimum)
- Clear role (Core/Support/Pusher/Ganker)
- Counter relationships with other heroes

**Required Data Structure per Hero**:
```
{
  "id": "anti_mage",
  "name": "Anti-Mage",
  "faction": "radiant",
  "attribute": "agility",
  "base_stats": {
    "hp": 5,
    "atk": 2,
    "arm": 1,
    "mov": 3,
    "range": 1
  },
  "skills": [
    {
      "name": "Blink",
      "cooldown": 2,
      "effect": "Teleport to empty space within 3 range"
    },
    {
      "name": "Mana Break",
      "cooldown": 1,
      "effect": "Attack and burn 1 enemy skill (+1 cooldown)"
    }
  ],
  "scaling": {
    "per_level_agi": 0.3
  }
}
```

### 2. Item Pool Design (24 items)

**Required Data Structure per Item**:
```
{
  "id": "bkb",
  "name": "Black King Bar",
  "tier": "core",
  "cost": 1500,
  "effect": {
    "type": "active",
    "description": "Immune to control skills for 1 turn",
    "cooldown": 3
  }
}
```

### 3. Game State Management

**Core State Variables**:
```
{
  "board": "9x9 grid array",
  "turn": "integer counter",
  "current_player": "radiant/dire",
  "phase": "turn_start/creep_spawn/action/turn_end",
  "players": {
    "radiant": {
      "gold": 625,
      "experience": 0,
      "heroes": [...],
      "structures": [...],
      "active_buffs": [...]
    },
    "dire": { ... }
  }
}
```

### 4. Action Validation System

Must validate:
- Movement legality (path clear, range valid)
- Attack range and line of sight
- Skill cooldowns and costs
- Item purchase affordability
- Target validity (friendly/enemy, in range, alive)

### 5. AI Opponent (Optional but Recommended)

Implement basic AI with:
- Hero selection strategy (balanced composition)
- Lane assignment logic
- Target prioritization (low HP heroes, structures)
- Item build paths
- Skill usage conditions

### 6. UI/UX Requirements

**Essential Displays**:
- Visual board with clear lane demarcation
- Hero info panels (HP, skills, items, cooldowns)
- Resource counters (gold, XP)
- Turn tracker
- Action log
- Skill/item tooltips

**Interaction Flow**:
- Click hero to select
- Click destination to move
- Click enemy to attack
- Button UI for skills and items
- Clear turn phase indicators

### 7. Balance Testing Parameters

Track during playtesting:
- Individual hero win rate (should be 40-60%)
- Average game duration (target: 15-30 min)
- First player advantage (should be 45-55% win rate)
- Item purchase timing (luxury items should appear turn 12+)
- Tower destruction rate (at least 1 tower by turn 6)

### 8. Asset Requirements

**Visual Assets Needed**:
- Board background (Dota2 style: green for Radiant, red for Dire)
- 30 hero portraits (or placeholder icons)
- Building sprites (Ancient, Tower, Barracks)
- Creep tokens
- Resource icons (gold, XP, runes)
- UI elements (buttons, panels, health bars)

**Audio Assets** (optional):
- Attack sounds
- Skill effect sounds
- Tower destruction
- Victory/defeat music

---

## Implementation Roadmap

### Phase 1: Core Engine (Week 1-2)
- Board grid system
- Movement validation
- Basic combat (attack/damage/death)
- Turn management

### Phase 2: Hero System (Week 3-4)
- Hero data structure
- Skill implementation (10 heroes with 2 skills each)
- Leveling and experience
- Attribute scaling

### Phase 3: Economy & Items (Week 5)
- Gold/XP systems
- Shop interface
- Item effects (implement 12 items minimum)
- Resource generation

### Phase 4: Structures & Objectives (Week 6)
- Tower mechanics and AI targeting
- Ancient invulnerability rules
- Creep spawning and pathing
- Victory condition detection

### Phase 5: Advanced Features (Week 7-8)
- Jungle and rune systems
- Combo detection
- Draft phase UI
- Full 30-hero roster

### Phase 6: Polish & Balance (Week 9-10)
- AI opponent
- Visual effects and animations
- Sound integration
- Balance testing and iteration
- Tutorial mode

---

## Testing Checklist

- [ ] All 30 heroes have unique, functional skills
- [ ] Movement rules correctly implemented (river bonus, blocking)
- [ ] Combat math accurate (damage, armor, special modifiers)
- [ ] Skill cooldowns track correctly
- [ ] Item effects apply and stack properly
- [ ] Towers auto-target correctly
- [ ] Ancient invulnerability enforced
- [ ] Victory conditions trigger appropriately
- [ ] Resource income calculates correctly
- [ ] Draft phase works with bans and picks
- [ ] No game-breaking bugs in turn sequence
- [ ] Game duration averages 15-30 minutes
- [ ] UI clearly displays all necessary information
- [ ] Tutorial explains all mechanics

---

## Extensibility Considerations

Design for future expansions:
- **Expansion Pack**: Add 10 new heroes + 12 new items
- **Game Modes**: 3v3 team mode, single-lane rush mode
- **Competitive Rules**: Tournament Bo3 format, side pool mechanics
- **Cosmetics**: Alternative hero skins, board themes
- **Ranked System**: ELO matchmaking for online play

---

## Technical Stack Recommendations

- **Language**: Python (for rapid prototyping) or JavaScript (for web deployment)
- **Game Engine**: Pygame / Phaser.js / Unity (depending on platform)
- **Data Format**: JSON for heroes, items, and game state
- **UI Framework**: ImGui / React / Unity UI
- **Testing**: Pytest / Jest for unit tests

---

## Quick Reference Table

| Metric | Value |
|--------|-------|
| Starting Gold | 625 |
| Turn Income | 200 + towers x100 |
| Hero Level XP | 3/6/10/15 |
| Creep Spawn Rate | Every 3 turns |
| Jungle Refresh | Every 3 turns |
| Rune Spawn | Every 5 turns |
| First Blood Bonus | 200 gold + team +1 ATK |
| Hero Kill | 200 gold + 2 XP |
| Tower Kill | 150 gold |
| Creep Kill | 50 gold + 1 XP |

---

## Final Notes for Development

This specification provides a complete ruleset for a playable tactical board game. The design prioritizes:

1. **Fast-paced gameplay** (15-30 min target)
2. **Strategic depth** through hero synergies and positioning
3. **Balanced economy** with meaningful item choices
4. **Clear victory paths** (push towers vs kill heroes)

Start with Phase 1 implementation, rigorously test each system before moving to the next phase, and iterate on balance based on playtesting data. The hero pool and item pool are the most critical areas for balance - invest significant testing time there.

Good luck with development!