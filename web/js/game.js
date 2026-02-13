// Game State
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    turnNumber: 1,
    selectedHeroes: [],
    playerCount: 2,
    gameStarted: false,
    diceRolled: false
};

// Player Class
class Player {
    constructor(id, name, hero, color) {
        this.id = id;
        this.name = name;
        this.hero = hero;
        this.color = color;
        this.gold = GAME_CONSTANTS.STARTING_GOLD;
        this.position = 0;
        this.properties = [];
        this.items = [];
        this.isInJail = false;
        this.jailTurnsRemaining = 0;
        this.isBankrupt = false;
        this.hasUsedBuyback = false;
        this.abilityCooldown = 0;
    }

    moveToPosition(newPosition) {
        const oldPosition = this.position;
        this.position = newPosition % GAME_CONSTANTS.TOTAL_SPACES;

        // Check if passed fountain (position 0)
        if (oldPosition > this.position || (oldPosition < GAME_CONSTANTS.TOTAL_SPACES && newPosition >= GAME_CONSTANTS.TOTAL_SPACES)) {
            this.collectSalary();
        }
    }

    collectSalary() {
        let salary = GAME_CONSTANTS.BASE_SALARY;

        // Apply hero bonuses
        if (this.hero.bonus_salary) {
            salary += this.hero.bonus_salary;
        }

        // Apply item bonuses
        if (this.items.includes('wraith_band')) {
            salary += 50;
        }

        this.gold += salary;
        addEventLog(`${this.name} collected ${salary} gold salary!`);
        return salary;
    }

    addGold(amount) {
        this.gold += amount;
    }

    deductGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    buyProperty(propertyId) {
        const property = PROPERTIES[propertyId];
        if (this.deductGold(property.price)) {
            this.properties.push(propertyId);
            addEventLog(`${this.name} purchased ${property.name} for ${property.price} gold!`);
            return true;
        }
        return false;
    }

    payRent(amount, toPlayer) {
        if (this.deductGold(amount)) {
            toPlayer.addGold(amount);
            addEventLog(`${this.name} paid ${amount} gold rent to ${toPlayer.name}`);
            return true;
        } else {
            addEventLog(`${this.name} cannot afford ${amount} gold rent!`);
            // Handle bankruptcy
            return false;
        }
    }

    reduceCooldown() {
        if (this.abilityCooldown > 0) {
            this.abilityCooldown--;
            if (this.items.includes('aghanims_shard')) {
                this.abilityCooldown = Math.max(0, this.abilityCooldown - 1);
            }
        }
    }
}

// Initialize hero selection
function initializeHeroSelection() {
    const heroGrid = document.getElementById('hero-grid');
    heroGrid.innerHTML = '';

    HEROES.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.dataset.heroId = hero.id;

        card.innerHTML = `
            <div class="hero-portrait">?</div>
            <div class="hero-name">${hero.name}</div>
            <div class="hero-ability">${hero.ability_description}</div>
        `;

        card.onclick = () => toggleHeroSelection(hero.id);
        heroGrid.appendChild(card);
    });
}

function toggleHeroSelection(heroId) {
    const maxSelections = gameState.playerCount;
    const index = gameState.selectedHeroes.indexOf(heroId);

    if (index > -1) {
        // Deselect
        gameState.selectedHeroes.splice(index, 1);
    } else {
        // Select
        if (gameState.selectedHeroes.length >= maxSelections) {
            // Remove first selection
            gameState.selectedHeroes.shift();
        }
        gameState.selectedHeroes.push(heroId);
    }

    updateHeroSelection();
}

function updateHeroSelection() {
    // Update visual selection
    document.querySelectorAll('.hero-card').forEach(card => {
        const heroId = card.dataset.heroId;
        const index = gameState.selectedHeroes.indexOf(heroId);

        if (index > -1) {
            card.classList.add('selected');
            const badge = card.querySelector('.player-badge') || document.createElement('div');
            badge.className = 'player-badge';
            badge.textContent = `P${index + 1}`;
            badge.style.backgroundColor = GAME_CONSTANTS.PLAYER_COLORS[index];
            if (!card.querySelector('.player-badge')) {
                card.appendChild(badge);
            }
        } else {
            card.classList.remove('selected');
            const badge = card.querySelector('.player-badge');
            if (badge) badge.remove();
        }
    });

    // Update status
    const needed = gameState.playerCount - gameState.selectedHeroes.length;
    document.getElementById('heroes-needed').textContent = needed;

    // Enable/disable start button
    const startBtn = document.getElementById('start-game-btn');
    startBtn.disabled = gameState.selectedHeroes.length < gameState.playerCount;
}

function updatePlayerCount(count) {
    gameState.playerCount = parseInt(count);
    document.getElementById('player-count-display').textContent = count;

    // Adjust selected heroes if needed
    while (gameState.selectedHeroes.length > gameState.playerCount) {
        gameState.selectedHeroes.pop();
    }

    updateHeroSelection();
}

// Game initialization
function startGame() {
    // Create players
    gameState.players = [];
    gameState.selectedHeroes.forEach((heroId, index) => {
        const hero = HEROES.find(h => h.id === heroId);
        const player = new Player(
            index,
            `Player ${index + 1}`,
            hero,
            GAME_CONSTANTS.PLAYER_COLORS[index]
        );
        gameState.players.push(player);
    });

    gameState.currentPlayerIndex = 0;
    gameState.turnNumber = 1;
    gameState.gameStarted = true;
    gameState.diceRolled = false;

    // Show game screen
    showScreen('game-screen');
    initializeBoard();
    updateGameUI();
    addEventLog('Game started! ' + gameState.players[0].name + "'s turn.");
}

// Board rendering
let canvas, ctx;

function initializeBoard() {
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#0f0f1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw spaces (simplified - 10 per side)
    drawBoardSpaces();

    // Draw players
    drawPlayers();

    // Draw center
    drawCenter();
}

function drawBoardSpaces() {
    const spaceSize = 70;
    const boardSize = canvas.width - 20;
    const spacesPerSide = 10;

    // Bottom row (0-9)
    for (let i = 0; i <= spacesPerSide; i++) {
        const x = canvas.width - 10 - (i * spaceSize);
        const y = canvas.height - 10 - spaceSize;
        drawSpace(i, x, y, spaceSize);
    }

    // Left column (10-19)
    for (let i = 1; i < spacesPerSide; i++) {
        const x = 10;
        const y = canvas.height - 10 - spaceSize - (i * spaceSize);
        drawSpace(10 + i, x, y, spaceSize);
    }

    // Top row (20-29)
    for (let i = 0; i <= spacesPerSide; i++) {
        const x = 10 + (i * spaceSize);
        const y = 10;
        drawSpace(20 + i, x, y, spaceSize);
    }

    // Right column (30-39)
    for (let i = 1; i < spacesPerSide; i++) {
        const x = canvas.width - 10 - spaceSize;
        const y = 10 + (i * spaceSize);
        drawSpace(30 + i, x, y, spaceSize);
    }
}

function drawSpace(id, x, y, size) {
    const property = PROPERTIES[id];
    if (!property) return;

    // Space background
    let color = '#1a1a2e';
    if (property.faction === 'radiant') color = '#2d5016';
    else if (property.faction === 'dire') color = '#5c1414';
    else if (property.type === 'fountain') color = '#1e3a8a';
    else if (property.type === 'event') color = '#7c2d12';

    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);

    // Border
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);

    // Property name (abbreviated)
    ctx.fillStyle = '#fff';
    ctx.font = '9px Arial';
    ctx.textAlign = 'center';
    const shortName = property.name.substring(0, 10);
    ctx.fillText(shortName, x + size / 2, y + size / 2);
}

function drawPlayers() {
    gameState.players.forEach((player, index) => {
        const pos = getSpaceCenter(player.position);
        const offset = (index - (gameState.players.length - 1) / 2) * 12;

        // Draw player token
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(pos.x + offset, pos.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Outline
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Player number
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(index + 1, pos.x + offset, pos.y + 4);
    });
}

function drawCenter() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(canvas.width * 0.25, canvas.height * 0.25, canvas.width * 0.5, canvas.height * 0.5);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ANCIENT TYCOON', centerX, centerY - 20);

    ctx.font = '16px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Dota 2 Monopoly', centerX, centerY + 10);
}

function getSpaceCenter(spaceId) {
    const spaceSize = 70;
    const spacesPerSide = 10;

    let x, y;

    if (spaceId <= 10) {
        // Bottom row
        x = canvas.width - 10 - (spaceId * spaceSize) + spaceSize / 2;
        y = canvas.height - 10 - spaceSize / 2;
    } else if (spaceId <= 20) {
        // Left column
        const i = spaceId - 10;
        x = 10 + spaceSize / 2;
        y = canvas.height - 10 - spaceSize - (i * spaceSize) + spaceSize / 2;
    } else if (spaceId <= 30) {
        // Top row
        const i = spaceId - 20;
        x = 10 + (i * spaceSize) + spaceSize / 2;
        y = 10 + spaceSize / 2;
    } else {
        // Right column
        const i = spaceId - 30;
        x = canvas.width - 10 - spaceSize / 2;
        y = 10 + (i * spaceSize) + spaceSize / 2;
    }

    return { x, y };
}

// Game actions
function rollDice() {
    if (gameState.diceRolled) return;

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;

    gameState.diceRolled = true;

    // Update UI
    document.getElementById('dice-result').innerHTML = `
        🎲 ${die1} + ${die2} = <strong>${total}</strong>
    `;

    // Move player
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const oldPos = currentPlayer.position;
    currentPlayer.moveToPosition(oldPos + total);

    addEventLog(`${currentPlayer.name} rolled ${total} and moved to ${PROPERTIES[currentPlayer.position].name}`);

    // Handle landing
    handleLanding(currentPlayer);

    // Update UI
    updateGameUI();
    drawBoard();

    // Enable end turn
    document.getElementById('roll-dice-btn').disabled = true;
    document.getElementById('end-turn-btn').disabled = false;
}

function handleLanding(player) {
    const property = PROPERTIES[player.position];

    if (property.type === 'property') {
        // Check if owned
        const owner = gameState.players.find(p => p.properties.includes(player.position));

        if (!owner) {
            // Unowned property - offer to buy
            if (confirm(`Buy ${property.name} for ${property.price} gold?`)) {
                if (player.buyProperty(player.position)) {
                    addEventLog(`${player.name} bought ${property.name}!`);
                } else {
                    addEventLog(`${player.name} cannot afford ${property.name}`);
                }
            }
        } else if (owner !== player) {
            // Pay rent
            const rent = property.rent[0]; // Basic rent for now
            player.payRent(rent, owner);
        }
    } else if (property.type === 'event') {
        addEventLog(`${player.name} landed on ${property.name}: ${property.description}`);
        // Could add event handling here
    } else if (property.type === 'tax') {
        const taxAmount = 200;
        player.deductGold(taxAmount);
        addEventLog(`${player.name} paid ${taxAmount} gold in taxes`);
    }

    updateGameUI();
}

function endTurn() {
    // Reduce cooldowns
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.reduceCooldown();

    // Next player
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;

    // If back to player 0, increment turn
    if (gameState.currentPlayerIndex === 0) {
        gameState.turnNumber++;
    }

    gameState.diceRolled = false;

    // Update UI
    updateGameUI();
    document.getElementById('roll-dice-btn').disabled = false;
    document.getElementById('end-turn-btn').disabled = true;
    document.getElementById('dice-result').innerHTML = '';

    const newPlayer = gameState.players[gameState.currentPlayerIndex];
    addEventLog(`--- ${newPlayer.name}'s turn ---`);
}

// UI updates
function updateGameUI() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Update top bar
    document.getElementById('turn-number').textContent = gameState.turnNumber;
    document.getElementById('current-player-name').textContent = currentPlayer.name;
    document.getElementById('current-player-name').style.color = currentPlayer.color;

    // Update player info
    const playerInfo = document.getElementById('player-info');
    playerInfo.innerHTML = `
        <p><strong>Name:</strong> ${currentPlayer.name}</p>
        <p><strong>Hero:</strong> ${currentPlayer.hero.name}</p>
        <p><strong>Gold:</strong> ${currentPlayer.gold} 💰</p>
        <p><strong>Position:</strong> ${PROPERTIES[currentPlayer.position].name}</p>
        <p><strong>Properties:</strong> ${currentPlayer.properties.length}</p>
        ${currentPlayer.abilityCooldown > 0 ? `<p><strong>Ability CD:</strong> ${currentPlayer.abilityCooldown}</p>` : '<p style="color: #0f0;"><strong>Ability Ready!</strong></p>'}
    `;
}

function addEventLog(message) {
    const eventLog = document.getElementById('event-log');
    const entry = document.createElement('p');
    entry.textContent = message;
    eventLog.insertBefore(entry, eventLog.firstChild);

    // Limit to 20 entries
    while (eventLog.children.length > 20) {
        eventLog.removeChild(eventLog.lastChild);
    }
}
