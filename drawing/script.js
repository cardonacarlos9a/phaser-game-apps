import { config } from './constants.js';

var game = new Phaser.Game(config(preload, create, update));

let graphics;
let isDrawing = false;
let lastPosition = null;
let isErasing = false;

function preload() {}

function create() {
    graphics = this.add.graphics(); // Create a graphics object
    graphics.lineStyle(4, 0xAAEEAA, 1); // Set line thickness and color

    // Input handling for drawing
    this.input.on('pointerdown', (pointer) => {
        isDrawing = true;
        lastPosition = { x: pointer.x, y: pointer.y };
    });

    this.input.on('pointerup', () => {
        isDrawing = false;
        lastPosition = null;
    });

    // Toggle erase mode with 'E' key
    this.input.keyboard.on('keydown-E', () => {
        isErasing = !isErasing;
        console.log(isErasing ? "Erasing Mode ON" : "Drawing Mode ON");
    });
}

function update() {
    if (isDrawing) {
        let pointer = this.input.activePointer;
        if (lastPosition) {
            if (isErasing) {
                // Erase by drawing with background color (white in this case)
                graphics.lineStyle(10, 0x000000, 1); 
            } else {
                // Normal drawing mode
                graphics.lineStyle(4, 0xAAEEAA, 1);
            }
            graphics.lineBetween(lastPosition.x, lastPosition.y, pointer.x, pointer.y);
        }
        lastPosition = { x: pointer.x, y: pointer.y };
    }
}
