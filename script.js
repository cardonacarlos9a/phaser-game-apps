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
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
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
    // Position button that contains the item to navigate to game
    positionItemButon(context.sys.game.config.width * 0.4, 200, '/division/index.html', 'Division')
    positionItemButon(context.sys.game.config.width * 0.4, 400, '/multiplicacion/index.html', 'Multiplication')

}


function update() {
    console.log(context.sys.game.config.width)
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

/**
 * Positions the button that we click at the initial screen to navigate to an app
 */
function positionItemButon(posX, posY, navigationUrl, buttonText) {
    defineScreenSize()
    // Create a graphics object
    const graphics = context.add.graphics();

    // Set the line style and fill style for the rounded rectangle
    graphics.lineStyle(10, 0xffffff, 1);
    graphics.fillStyle(0xFF7171, 1);

    // Define the position and size of the rounded rectangle
    const x = posX;
    const y = posY;
    const width = 200;
    const height = 100;
    const radius = 20;

    // Draw the rounded rectangle
    //graphics.strokeRoundedRect(x, y, width, height, radius);
    graphics.fillRoundedRect(x, y, width, height, radius);

    // Add the background image
    const backgroundImage = context.add.image(x, y, 'division');
    backgroundImage.setDisplaySize(50, 50);
    backgroundImage.setOrigin(-1.5, -0.2); // Set the origin to the top-left corner

    // Add text inside the rounded rectangle
    const text = context.add.text(x + 10, y + 5, buttonText, { fontFamily: 'Bradley Hand', fontSize: 28, color: '#000000' });

    // Center the text inside the rounded rectangle
    const textWidth = text.width;
    const textHeight = text.height;
    text.setPosition(x + (width - textWidth) / 2, y + (height - textHeight + (height * 0.7)) / 2);

    // Add a hand cursor when hovering over the rounded rectangle
    graphics.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
    graphics.on('pointerover', function () {
        game.canvas.style.cursor = 'pointer';
        // Clear any previous graphics
        //graphics.clear();

        // Redraw the rounded rectangle with green border
        graphics.lineStyle(4, 0x00aa00);
        graphics.strokeRoundedRect(x, y, width, height, radius);

    });
    graphics.on('pointerout', function () {
        game.canvas.style.cursor = 'default';

        //graphics.clear();

        // Redraw the rounded rectangle with green border
        graphics.lineStyle(2, 0xffffff, 1);

        graphics.strokeRoundedRect(x, y, width, height, radius);

        graphics.fillStyle(0xFF7171, 1);

    });

    graphics.on('pointerdown', function () {
        console.log('click')
        window.location.href = navigationUrl; // Replace with your desired URL
        graphics.fillStyle(0xFF7171, 1);

    })
}

function defineScreenSize() {
    console.log(context.sys.game.config.width, context.sys.game.config.height)

    // Resize event listener
    context.scale.on('resize', (gameSize) => {
        // Adjust logo position and scale on resize
        logo.x = gameSize.width / 2;
        logo.y = gameSize.height / 2;
        logo.setScale(gameSize.width / logo.width, gameSize.height / logo.height);
    });
}