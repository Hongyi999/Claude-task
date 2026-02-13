# Ancient Tycoon - Web Edition 🎮

A Dota 2 themed Monopoly-style board game built with pure HTML, CSS, and JavaScript.

## 🚀 How to Play

### Option 1: Open Directly in Browser
1. Navigate to the `web` folder
2. **Double-click `index.html`**
3. The game will open in your default browser
4. Start playing immediately!

### Option 2: Using a Local Server (Recommended for development)
```bash
cd web
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

## 🎯 Features

### ✅ Currently Implemented
- **10 Dota 2 Heroes** with unique abilities
- **40 Properties** including:
  - Radiant and Dire territories
  - Neutral zones (Roshan Pit, Secret Shop, etc.)
  - Special spaces (Fountain, Jail, Events)
- **Local Multiplayer** (2-5 players on same device)
- **Beautiful UI** with responsive design
- **Keyboard Shortcuts**:
  - `Space` - Roll Dice
  - `Enter` - End Turn
  - `Esc` - Close Modals

### 🔧 Game Mechanics
- Roll dice to move around the board
- Buy properties when you land on them
- Collect rent from other players
- Pass Fountain to earn 200 gold salary
- Each hero has unique passive abilities
- Purchase items to gain advantages

## 📱 Device Support

Works on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablets
- ✅ Any device with a modern web browser!

## 🌐 Next Steps: Multiplayer Version

Want to enable **online multiplayer** where players can join from different devices?

### Option A: WebSocket Server (Recommended)
```bash
# Install dependencies
npm install express socket.io

# Run multiplayer server
node server.js
```

### Option B: Firebase (Easiest)
- No server setup needed
- Free hosting on Firebase
- Real-time synchronization
- Just add Firebase SDK to `index.html`

## 📂 File Structure

```
web/
├── index.html          # Main game page
├── css/
│   └── style.css      # All styles
├── js/
│   ├── constants.js   # Game data (heroes, properties, items)
│   ├── game.js        # Core game logic
│   └── ui.js          # UI controls and screens
└── assets/
    └── heroes/        # (Optional) Add hero portrait images here
```

## 🎨 Adding Hero Portraits

1. Download Dota 2 hero images (256x144 PNG recommended)
2. Save them as `assets/heroes/{hero_id}.png`
   - Example: `assets/heroes/alchemist.png`
3. Portraits will automatically load if files exist
4. See `../assets/heroes/README.md` for image sources

## 🔨 Customization

### Add More Heroes
Edit `js/constants.js` → `HEROES` array

### Add More Properties
Edit `js/constants.js` → `PROPERTIES` array

### Modify Game Rules
Edit `js/game.js` → Adjust gold amounts, rent calculations, etc.

### Change Theme Colors
Edit `css/style.css` → Modify color variables

## 🐛 Troubleshooting

**Game doesn't load:**
- Make sure you're using a modern browser
- Check browser console for errors (F12)
- Try using a local server instead of opening directly

**Heroes not showing:**
- This is normal - portraits will show "?" until you add images
- Add hero images to `assets/heroes/` folder

**Multiplayer not working:**
- Current version is local-only (single device)
- See "Next Steps: Multiplayer Version" above

## 📜 License

Dota 2 and all related characters are property of Valve Corporation.
This project is for educational purposes only.

## 🎮 Controls

- **Click** to select heroes and interact with UI
- **Space** to roll dice
- **Enter** to end turn
- **Esc** to close modals

---

Enjoy the game! 🎉
