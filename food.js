/**
 * Food — the yummy things the snake eats to grow.
 *
 * Instead of boring red circles, we have THREE different food types:
 *   🍣 SUSHI  — a piece of nigiri (rice + fish on top)
 *   🍬 CANDY  — a wrapped candy (twisted ends)
 *   🍨 ICE CREAM — a cone with a scoop on top
 *
 * Each time food spawns, a random type is chosen!
 *
 * HOW TO EXPLAIN TO A KID:
 * The snake is hungry and loves different treats! Sometimes sushi appears,
 * sometimes candy, sometimes ice cream. You get different points depending
 * on what you eat (kidding — they're all 1 point each).
 */

// Food types — like picking different items from a menu
const FOOD_TYPE = {
    SUSHI:     0,   // 🍣 Salmon nigiri
    CANDY:     1,   // 🍬 Wrapped candy
    ICE_CREAM: 2    // 🍨 Cone with scoop
};

const FOOD_NAMES = ['SUSHI', 'CANDY', 'ICE CREAM'];

class FoodManager {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.type = FOOD_TYPE.SUSHI;  // Start with sushi
    }

    /**
     * Place food at a random empty cell on the grid.
     * Picks a random food type too!
     */
    spawn(snakeBody) {
        // Collect all occupied cells
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

        // Pick a random empty cell
        if (empty.length > 0) {
            this.position = empty[Math.floor(Math.random() * empty.length)];
        }

        // Pick a random food type!
        const types = [FOOD_TYPE.SUSHI, FOOD_TYPE.CANDY, FOOD_TYPE.ICE_CREAM];
        this.type = types[Math.floor(Math.random() * types.length)];
    }

    /** Draw the food — different drawing for each type */
    draw(ctx) {
        const cx = this.position.x * CELL_SIZE + CELL_SIZE / 2;
        const cy = this.position.y * CELL_SIZE + CELL_SIZE / 2;
        const s = CELL_SIZE;  // shortcut

        if (this.type === FOOD_TYPE.SUSHI) {
            this._drawSushi(ctx, cx, cy, s);
        } else if (this.type === FOOD_TYPE.CANDY) {
            this._drawCandy(ctx, cx, cy, s);
        } else if (this.type === FOOD_TYPE.ICE_CREAM) {
            this._drawIceCream(ctx, cx, cy, s);
        }
    }

    /**
     * Draw a piece of salmon nigiri sushi.
     * White oval = rice. Orange shape on top = salmon.
     * Small darker stripe = salmon skin detail.
     */
    _drawSushi(ctx, cx, cy, s) {
        const r = s / 2 - 1;

        // Rice — white rounded rectangle
        ctx.fillStyle = '#f5f5dc';  // Rice white
        ctx.beginPath();
        ctx.ellipse(cx, cy + 1, r - 1, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Salmon — orange oval on top
        ctx.fillStyle = '#ff8a65';  // Salmon orange
        ctx.beginPath();
        ctx.ellipse(cx, cy - 2, r - 2, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Salmon stripe detail
        ctx.strokeStyle = '#ff7043';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy - 2);
        ctx.lineTo(cx + 4, cy - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy - 4);
        ctx.lineTo(cx + 3, cy - 4);
        ctx.stroke();
    }

    /**
     * Draw a wrapped candy.
     * Colored oval center with triangle twists on the sides.
     */
    _drawCandy(ctx, cx, cy, s) {
        const r = s / 2 - 2;

        // Candy body — bright colored oval
        // Pick a random-ish bright color based on position for variety
        const colors = ['#ff4081', '#7c4dff', '#00e676', '#ff6d00', '#00e5ff'];
        const colorIdx = (this.position.x + this.position.y) % colors.length;
        ctx.fillStyle = colors[colorIdx];
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left wrapper twist
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.moveTo(cx - r + 2, cy - 4);
        ctx.lineTo(cx - r - 4, cy);
        ctx.lineTo(cx - r + 2, cy + 4);
        ctx.fill();

        // Right wrapper twist
        ctx.beginPath();
        ctx.moveTo(cx + r - 2, cy - 4);
        ctx.lineTo(cx + r + 4, cy);
        ctx.lineTo(cx + r - 2, cy + 4);
        ctx.fill();

        // Shiny highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(cx - 2, cy - 3, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw an ice cream cone.
     * Triangle cone (waffle color) + circular scoop (pink/vanilla).
     */
    _drawIceCream(ctx, cx, cy, s) {
        const r = s / 2 - 1;

        // Cone — brown triangle pointing down
        ctx.fillStyle = '#a1887f';  // Waffle cone brown
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy);
        ctx.lineTo(cx + 5, cy);
        ctx.lineTo(cx, cy + 8);
        ctx.closePath();
        ctx.fill();

        // Cone criss-cross waffle pattern
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - 2, cy + 1);
        ctx.lineTo(cx + 2, cy + 6);
        ctx.moveTo(cx + 2, cy + 1);
        ctx.lineTo(cx - 2, cy + 6);
        ctx.stroke();

        // Ice cream scoop — rounded on top
        ctx.fillStyle = '#f8bbd0';  // Strawberry pink
        ctx.beginPath();
        ctx.ellipse(cx, cy - 2, r * 0.6, r * 0.5, 0, Math.PI, 0);
        ctx.fill();

        // Cherry on top!
        ctx.fillStyle = '#e53935';
        ctx.beginPath();
        ctx.arc(cx, cy - 6, 2, 0, Math.PI * 2);
        ctx.fill();
        // Cherry stem
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx + 2, cy - 10);
        ctx.stroke();
    }
}
