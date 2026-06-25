/**
 * Food — the snack that makes the snake grow.
 *
 * Food spawns at a random position on the grid. The tricky part is making
 * sure it doesn't appear inside the snake's body — otherwise the player
 * could never reach it, or it would look like it's inside the snake.
 *
 * HOW TO EXPLAIN TO A KID:
 * The snake is hungry! A tasty red treat appears somewhere on the grid.
 * But we have to check — is that treat inside the snake's body? If so,
 * pick another spot. Keep picking until we find an empty cell.
 */

class FoodManager {
    constructor() {
        this.position = { x: 0, y: 0 };  // Where the food is right now
    }

    /**
     * Place food at a random empty cell on the grid.
     * We pass in the snake's body segments so we can avoid spawning on them.
     */
    spawn(snakeBody) {
        // Collect all occupied cells (the snake's body)
        const occupied = new Set(snakeBody.map(seg => `${seg.x},${seg.y}`));

        // Find all empty cells
        const empty = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                if (!occupied.has(`${x},${y}`)) {
                    empty.push({ x, y });
                }
            }
        }

        // Pick a random empty cell — if there are any (if the snake fills
        // the entire grid, you've basically won the game!)
        if (empty.length > 0) {
            this.position = empty[Math.floor(Math.random() * empty.length)];
        }
    }

    /** Draw the food as a small red circle */
    draw(ctx) {
        const x = this.position.x * CELL_SIZE + CELL_SIZE / 2;
        const y = this.position.y * CELL_SIZE + CELL_SIZE / 2;

        // Red apple-colored circle
        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.arc(x, y, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // A tiny highlight to make it shiny
        ctx.fillStyle = '#ff7961';
        ctx.beginPath();
        ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
