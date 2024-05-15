export class PickAngleOption extends Phaser.Scene {
    constructor() {
        super({ key: 'PickAngleOption' });
    }

    preload() {
        // Load assets
    }

    create() {
        this.add.text(100, 100, 'This is Scene A', { fill: '#0f0' });
    }

    update() {
        // Update logic
    }
}