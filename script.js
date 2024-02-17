var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    dom: {
        createContainer: true
    }
};
var game = new Phaser.Game(config);
let context;
function preload() {
    this.load.image('bg', 'background.svg');
    this.load.image('division', 'division.webp');
}
function create() {
    context = this;
    positionBackgroundImage()
    //

    // Create a graphics object
    const graphics = this.add.graphics();

    // Set the line style and fill style for the rounded rectangle
    graphics.lineStyle(10, 0xffffff, 1);
    graphics.fillStyle(0x7ED7C1, 1);

    // Define the position and size of the rounded rectangle
    const x = 500;
    const y = 200;
    const width = 200;
    const height = 100;
    const radius = 20;

    // Draw the rounded rectangle
    graphics.strokeRoundedRect(x, y, width, height, radius);
    graphics.fillRoundedRect(x, y, width, height, radius);

    // Add the background image
    const backgroundImage = this.add.image(x, y, 'division');
    backgroundImage.setDisplaySize(50, 50);
    backgroundImage.setOrigin(-1.5, -0.2); // Set the origin to the top-left corner

    // Add text inside the rounded rectangle
    const text = this.add.text(x + 10, y + 5, 'Division', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#000000' });

    // Center the text inside the rounded rectangle
    const textWidth = text.width;
    const textHeight = text.height;
    text.setPosition(x + (width - textWidth) / 2, y + (height - textHeight + (height * 0.7)) / 2);

    // Add a hand cursor when hovering over the rounded rectangle
    graphics.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
    graphics.on('pointerover', function () {
        game.canvas.style.cursor = 'pointer';
        console.log('over')
    });
    graphics.on('pointerout', function () {
        game.canvas.style.cursor = 'default';
    });

    graphics.on('pointerdown', function(){
        console.log('click')
        window.location.href = '/division/index.html'; // Replace with your desired URL

    })
}


function update() {

}
function positionBackgroundImage() {
    // Get the size of the game canvas (screen)
    const screenWidth = context.sys.game.config.width;
    const screenHeight = context.sys.game.config.height;

    // Add the background image
    const bg = context.add.image(0, 0, 'bg');

    // Set the scale of the background image to fit the screen
    bg.setScale(screenWidth / bg.width, screenHeight / bg.height);

    // Set the background image origin to the top-left corner
    bg.setOrigin(0, 0);
}