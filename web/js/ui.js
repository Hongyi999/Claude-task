// UI Controller

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showHeroSelection() {
    initializeHeroSelection();
    showScreen('hero-selection');
}

function backToMenu() {
    if (gameState.gameStarted) {
        if (confirm('Are you sure you want to quit the current game?')) {
            resetGame();
            showScreen('main-menu');
        }
    } else {
        showScreen('main-menu');
    }
}

function resetGame() {
    gameState = {
        players: [],
        currentPlayerIndex: 0,
        turnNumber: 1,
        selectedHeroes: [],
        playerCount: 2,
        gameStarted: false,
        diceRolled: false
    };

    document.getElementById('event-log').innerHTML = '';
    document.getElementById('dice-result').innerHTML = '';
}

// Modal management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showInstructions() {
    showModal('instructions-modal');
}

function showAbout() {
    showModal('about-modal');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Ancient Tycoon - Web Edition Loaded!');
    showScreen('main-menu');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (gameState.gameStarted) {
        // Space to roll dice
        if (e.code === 'Space' && !gameState.diceRolled) {
            e.preventDefault();
            rollDice();
        }
        // Enter to end turn
        if (e.code === 'Enter' && gameState.diceRolled) {
            e.preventDefault();
            endTurn();
        }
    }

    // Escape to close modals
    if (e.code === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
