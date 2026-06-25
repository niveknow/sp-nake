/**
 * Score — keeps track of points and remembers your best score.
 *
 * The score goes up by 1 every time the snake eats food. The high score
 * is saved in localStorage, which is like a tiny notebook your browser
 * keeps on your computer — even if you close the page and come back later,
 * it remembers your best game.
 *
 * HOW TO EXPLAIN TO A KID:
 * Every time the snake eats a red food, you get a point. Your best score
 * ever is saved so you can try to beat it next time!
 */

class ScoreManager {
    constructor() {
        this.score = 0;
        // Load the high score from localStorage — returns null if never set
        const saved = localStorage.getItem('snakeHighScore');
        this.highScore = saved ? parseInt(saved, 10) : 0;
    }

    /** Add one point when the snake eats food */
    increment() {
        this.score++;
    }

    /** Save the high score if we beat it */
    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore.toString());
        }
    }

    /** Reset the current score (but keep the high score) */
    reset() {
        this.score = 0;
    }

    /** Draw score and high score at the bottom of the canvas */
    draw(ctx, canvasWidth) {
        ctx.fillStyle = '#fff';
        ctx.font = '16px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';

        // Current score — big and centered
        ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Score: ${this.score}`, canvasWidth / 2, 390);

        // High score — smaller, in the corner
        ctx.font = '12px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'right';
        ctx.fillText(`High: ${this.highScore}`, canvasWidth - 10, 390);
    }
}
