/**
 * Snake — the player-controlled character.
 *
 * The snake is an array of segments. Each segment has an {x, y} grid position.
 * The head is at index 0. Every frame the head moves one cell in the current
 * direction, and the tail gets removed (unless the snake just ate food).
 *
 * HOW TO EXPLAIN TO A KID:
 * Imagine a line of toy blocks. Each block is one cell on the grid.
 * When the snake moves, a new block appears in front and the last block
 * disappears — the line slides forward like a train. Eating food makes it
 * grow instead of shrinking at the back, so the train gets longer!
 */

const GRID_SIZE = 20;          // 20x20 cells
const CELL_SIZE = 20;          // Each cell is 20x20 pixels
const TICK_INTERVAL = 150;     // Milliseconds between moves (controls speed)

// Direction constants as vectors
const DIR = {
    UP:    { x:  0, y: -1 },
    DOWN:  { x:  0, y:  1 },
    LEFT:  { x: -1, y:  0 },
    RIGHT: { x:  1, y:  0 }
};

class Snake {
    constructor() {
        // Load Sterling's face for the snake head
        this.headImg = new Image();
        this.headImg.src = 'assets/sterling_head.png';
        this.headImgLoaded = false;
        this.headImg.onload = () => { this.headImgLoaded = true; };
        this.reset();
    }

    /** Reset the snake to its starting state — center, length 3, moving right */
    reset() {
        const mid = Math.floor(GRID_SIZE / 2);
        // Body starts as 3 segments running left from center
        this.body = [
            { x: mid,     y: mid },   // head (index 0)
            { x: mid - 1, y: mid },   // body
            { x: mid - 2, y: mid }    // tail
        ];
        this.direction = DIR.RIGHT;   // which way we're facing
        this.nextDirection = DIR.RIGHT; // buffered input (set on keypress)
        this.growFlag = false;         // true = we ate food, grow on next move
    }

    /**
     * Accept a direction change from keyboard input.
     * We reject 180° reversals (you can't go left if moving right)
     * because that would instantly kill the snake.
     */
    setDirection(newDir) {
        // If trying to reverse, ignore it
        if (this.direction.x + newDir.x === 0 && this.direction.y + newDir.y === 0) {
            return;
        }
        this.nextDirection = newDir;
    }

    /** Move the snake one step. Returns true if the snake collided (game over). */
    update() {
        // Apply the buffered direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // --- COLLISION CHECKS ---

        // Wall collision: if head goes outside the grid, game over
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            return true; // You hit a wall!
        }

        // Self collision: if new head lands on any body segment, game over
        // We skip the last segment because it will be removed this frame (unless growing)
        const tailEnd = this.growFlag ? 0 : 1;
        for (let i = 0; i < this.body.length - tailEnd; i++) {
            if (this.body[i].x === newHead.x && this.body[i].y === newHead.y) {
                return true; // You bit yourself!
            }
        }

        // --- MOVEMENT ---

        // Add new head to the front
        this.body.unshift(newHead);

        // Remove tail unless we ate food this move (growing)
        if (this.growFlag) {
            this.growFlag = false;  // Ate once — clear the flag
        } else {
            this.body.pop();        // Remove last segment — snake slides forward
        }

        return false; // No collision, snake lives to slither another day
    }

    /** Flag the snake to grow on the next move (called when food is eaten) */
    grow() {
        this.growFlag = true;
    }

    /** Draw the snake on the canvas */
    draw(ctx) {
        for (let i = 0; i < this.body.length; i++) {
            const seg = this.body[i];
            const x = seg.x * CELL_SIZE;
            const y = seg.y * CELL_SIZE;

            if (i === 0) {
                // --- HEAD: Draw Sterling's face, rotated to face the direction ---
                if (this.headImgLoaded) {
                    ctx.save();
                    ctx.translate(x + CELL_SIZE / 2, y + CELL_SIZE / 2);
                    // Rotate to face the direction of movement
                    const angle = Math.atan2(this.direction.y, this.direction.x);
                    ctx.rotate(angle);
                    // Draw Sterling's face centered, scaled to fill the cell
                    ctx.drawImage(this.headImg, -CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
                    ctx.restore();
                } else {
                    // Fallback: bright green square while image loads
                    ctx.fillStyle = '#66bb6a';
                    ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
                }
            } else {
                // --- BODY: Green rounded rectangles ---
                ctx.fillStyle = '#4caf50';
                const pad = 1;
                ctx.beginPath();
                ctx.roundRect(x + pad, y + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, 3);
                ctx.fill();
            }
        }
    }
}
