# Hermes Snake - Architecture Design

"Hermes Snake" is a lightweight, educational HTML5 Canvas game designed for simplicity and clarity. The goal is to teach the fundamentals of game development: state machines, grid systems, input handling, and collision logic.

## 1. Game State Machine
The game operates in three primary states managed by a central state variable:
*   `MENU`: Displayed on load. Shows "Press Start" message.
*   `PLAYING`: The active game loop. Handles input, movement, and collisions.
*   `GAME_OVER`: Displayed after a collision. Shows final score and "Restart" prompt.

## 2. Core Mechanics
*   **Grid System**: 20x20 cell grid. Cell size is 20px (400x400px canvas).
*   **Snake**: Represented as an array of objects `[{x: 10, y: 10}, {x: 9, y: 10}, ...]`. Head is index 0.
*   **Food**: A single object `{x: random, y: random}`. Must spawn in an empty grid cell.
*   **Direction Queue**: A simple array buffer to store input. Every frame, we shift the input to update direction. This prevents "self-reversal" (e.g., trying to go left when currently moving right) by validating against the current direction.
*   **Collision**: 
    *   *Walls*: Check if `head.x < 0` or `head.x >= 20`, etc.
    *   *Self*: Check if `head` coordinates match any `segment` in the snake array.
*   **Scoring**: Persistent score tracking using `localStorage`.

## 3. File Breakdown
The project is modularized for educational purposes:

*   `index.html`: Boilerplate HTML5 structure. Contains the `<canvas>` element and simple UI overlays.
*   `game.js`: The game loop (`requestAnimationFrame`). Orchestrates the state machine and rendering order.
*   `snake.js`: Contains `Snake` class/logic. Handles movement, growth, and collision checks.
*   `score.js`: Handles logic for updating the current score and interacting with `localStorage` for the high score.
*   `audio.js`: Simple Web Audio API wrappers for sound effects (eat, die, move).

## 4. Controls
*   **Keyboard**: Arrow keys and WASD keys.
*   **Touch**: Basic swipe detection (4-directional) via `touchstart` and `touchend` events.
*   **Input Handling**: All inputs are pushed to a `directionQueue` buffer to ensure one input per frame update, preventing input stacking bugs.

## 5. Rendering Plan
*   **Canvas Context**: `2d`.
*   **Visual Style**:
    *   Background: Dark `#1e1e1e`.
    *   Snake: Green `#4caf50`, head slightly distinct.
    *   Food: Red `#f44336`.
    *   Grid Lines (Optional): Faint grey lines for visualization of the grid (useful for debugging).
    *   Text: Simple CSS-styled overlay `div`s for Menu and Game Over screens (easier to manage than canvas text).

## 6. Data Flow
1.  **User Input** -> Pushed to `inputBuffer`.
2.  **Game Loop** -> `update()` (Read input, process movement, check collisions) -> `draw()` (Clear canvas, render grid, render snake, render food).
3.  **End State** -> Stop `requestAnimationFrame` -> Trigger Game Over UI.
