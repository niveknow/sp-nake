/**
 * Game — the main loop that ties everything together.
 *
 * This is the conductor of the orchestra. It creates all the game objects
 * (snake, food, score, audio), runs the game loop, handles input, and
 * decides what gets drawn on screen each frame.
 *
 * State Machine:
 *   MENU → PLAYING → GAME_OVER → MENU (restart)
 *
 * HOW TO EXPLAIN TO A KID:
 * Every video game has a "hidden clock" that ticks many times per second.
 * Each tick, the game:
 *   1. Checks what buttons you pressed
 *   2. Moves everything a tiny bit
 *   3. Checks if anything crashed
 *   4. Draws everything on the screen
 * This is called the "game loop" — and it runs about 60 times per second!
 */

// --- SETUP ---

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create all the game objects
const snake = new Snake();
const food = new FoodManager();
const score = new ScoreManager();
const audio = new AudioManager();

// Define game states
const STATE = {
    MENU:      0,   // Title screen — waiting for player
    PLAYING:   1,   // Snake is alive and moving
    GAME_OVER: 2    // Snake crashed — show final score
};

let currentState = STATE.MENU;
let lastTickTime = 0;     // For the tick-based timer

// --- INPUT HANDLING ---

// Map key presses to directions
const KEY_DIR_MAP = {
    'ArrowUp':    DIR.UP,
    'ArrowDown':  DIR.DOWN,
    'ArrowLeft':  DIR.LEFT,
    'ArrowRight': DIR.RIGHT,
    'w': DIR.UP,    'W': DIR.UP,
    's': DIR.DOWN,  'S': DIR.DOWN,
    'a': DIR.LEFT,  'A': DIR.LEFT,
    'd': DIR.RIGHT, 'D': DIR.RIGHT
};

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (KEY_DIR_MAP[e.key]) {
        e.preventDefault();  // Stop the page from scrolling
        snake.setDirection(KEY_DIR_MAP[e.key]);
    }
});

// Touch/click to start or restart — also initializes audio
canvas.addEventListener('pointerdown', () => {
    audio.init();

    if (currentState === STATE.MENU) {
        // First interaction — spawn food and start
        food.spawn(snake.body);
        currentState = STATE.PLAYING;
        lastTickTime = performance.now();
    } else if (currentState === STATE.GAME_OVER) {
        // Restart the game
        resetGame();
    }
});

// --- GAME FUNCTIONS ---

/** Reset everything for a new game */
function resetGame() {
    snake.reset();
    score.reset();
    currentState = STATE.MENU;
    // Don't spawn food yet — wait for tap
}

/** Update game logic — runs at a fixed tick rate, not every frame */
function update() {
    if (currentState !== STATE.PLAYING) return;

    // Move the snake — true means collision (game over)
    const collision = snake.update();

    if (collision) {
        // BONK! Snake hit something
        score.saveHighScore();
        audio.playDie();
        currentState = STATE.GAME_OVER;
        return;
    }

    // Check if snake's head is on the food
    const head = snake.body[0];
    if (head.x === food.position.x && head.y === food.position.y) {
        // NOM NOM — the snake ate the food!
        snake.grow();
        score.increment();
        audio.playEat();
        food.spawn(snake.body);  // New snack appears!
    }
}

/** Draw everything on the canvas */
function draw() {
    // --- BACKGROUND ---
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- GRID LINES (faint — helps show the grid system) ---
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_SIZE; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= GRID_SIZE; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(canvas.width, y * CELL_SIZE);
        ctx.stroke();
    }

    if (currentState === STATE.MENU) {
        // --- MENU SCREEN ---
        // Just draw the snake and food in their starting positions
        snake.draw(ctx);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐍 HERMES SNAKE', canvas.width / 2, 160);
        ctx.font = '16px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#888';
        ctx.fillText('Tap to start!', canvas.width / 2, 200);

    } else if (currentState === STATE.PLAYING) {
        // --- PLAYING SCREEN ---
        food.draw(ctx);
        snake.draw(ctx);
        score.draw(ctx, canvas.width);

    } else if (currentState === STATE.GAME_OVER) {
        // --- GAME OVER SCREEN ---
        // Draw the final state of the game underneath
        food.draw(ctx);
        snake.draw(ctx);

        // Semi-transparent overlay so text is readable
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Game Over text
        ctx.fillStyle = '#f44336';
        ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 170);

        // Final score
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Score: ${score.score}`, canvas.width / 2, 210);

        // High score
        ctx.fillStyle = '#888';
        ctx.font = '14px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Best: ${score.highScore}`, canvas.width / 2, 235);

        ctx.fillStyle = '#4caf50';
        ctx.font = '16px "Segoe UI", Arial, sans-serif';
        ctx.fillText('Tap to play again', canvas.width / 2, 280);
    }
}

/** The main game loop — runs ~60 times per second */
function gameLoop(timestamp) {
    // Tick-based movement: only update game logic at a fixed interval (150ms).
    // This is different from Flappy Bird, which moved every frame.
    // The accumulator pattern keeps the game speed consistent even if the
    // frame rate drops.
    if (currentState === STATE.PLAYING) {
        if (timestamp - lastTickTime >= TICK_INTERVAL) {
            update();
            lastTickTime = timestamp;
        }
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// --- START THE GAME ---
lastTickTime = performance.now();
requestAnimationFrame(gameLoop);
