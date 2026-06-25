/**
 * Audio — makes sounds using the Web Audio API.
 *
 * Instead of loading audio files (which would need to be downloaded),
 * we generate sounds on the fly using oscillators — like a tiny
 * electronic music box that plays different pitches.
 *
 * HOW TO EXPLAIN TO A KID:
 * Your computer can make sounds just by creating vibrations at different
 * speeds. Fast vibrations = high notes. Slow vibrations = low notes.
 * We use this to make a "ding!" when the snake eats food, and a
 * "boooop" when it crashes.
 */

class AudioManager {
    constructor() {
        // The AudioContext is like a sound mixer board — we create it
        // when the player first interacts (browsers require user interaction
        // before they let websites make noise)
        this.ctx = null;
        this.initialized = false;
    }

    /** Set up the audio context on first user interaction */
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not available:', e);
        }
    }

    /**
     * Play a tone at a given frequency for a given duration.
     * Every sound in the game is built from this one function!
     */
    _playTone(frequency, duration, type = 'square') {
        if (!this.ctx) return;

        // An oscillator is like a speaker cone that vibrates at a specific speed
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;           // 'square' sounds retro/game-like
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        // Connect: oscillator → volume control → speakers
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Start playing now
        osc.start(this.ctx.currentTime);
        // Fade out to avoid a clicking sound when it stops
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        // Stop after the duration
        osc.stop(this.ctx.currentTime + duration);
    }

    /** Happy ascending beep — snake ate some food! */
    playEat(foodType) {
        if (foodType === FOOD_TYPE.SUSHI) {
            // 🍣 Sushi — two quick ascending beeps: ding-ding!
            this._playTone(523, 0.08);  // C5
            setTimeout(() => this._playTone(784, 0.1), 60);  // G5
        } else if (foodType === FOOD_TYPE.CANDY) {
            // 🍬 Candy — bright high-pitched sparkle!
            this._playTone(880, 0.06, 'square');   // A5
            setTimeout(() => this._playTone(1047, 0.08, 'square'), 50); // C6
            setTimeout(() => this._playTone(1319, 0.1, 'square'), 100); // E6
        } else if (foodType === FOOD_TYPE.ICE_CREAM) {
            // 🍨 Ice cream — smooth low mmm-nom!
            this._playTone(330, 0.15, 'triangle'); // E4
            setTimeout(() => this._playTone(392, 0.2, 'triangle'), 80); // G4
        }
    }

    /** Sad descending tone — snake hit a wall or itself */
    playDie() {
        this._playTone(330, 0.3);  // E4
        setTimeout(() => this._playTone(220, 0.4), 150);  // A3
    }
}
