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
var bg;

function preload() {
    context = this;
    this.load.image('bg', 'background.svg');
    this.load.image('division', 'division.webp');
    this.load.image('gif', 'divide.gif')
    this.load.image('logo', 'assets/logo.png')
}

function create() {
    // Add resize event listener
    this.scale.on('resize', resizeBackground, context);

    // Position button that contains the item to navigate to game
    bg = this.add.image(0, 0, 'bg').setOrigin(0)
        .setScale(config.width / this.textures.get('bg').getSourceImage().width,
            config.height / this.textures.get('bg').getSourceImage().height);

    {//Position the apps buttons at home screen
        positionItemButon(context.sys.game.config.width * 0.2, 200, '/division/index.html', 'Division')
        positionItemButon(context.sys.game.config.width * 0.4, 200, '/multiplicacion/index.html', 'Multiplication')
        positionItemButon(context.sys.game.config.width * 0.6, 200, '/angulos/index.html', 'Angulos')
        positionItemButon(context.sys.game.config.width * 0.2, 400, 'https://local-learning-app.vercel.app/', 'Dict Mejorado')
        positionItemButon(context.sys.game.config.width * 0.4, 400, 'https://play-ground-angular-teaching.vercel.app/', 'Generador')
        positionItemButon(context.sys.game.config.width * 0.6, 400, '/books/index.html', 'Books')
        positionItemButon(context.sys.game.config.width * 0.2, 550, '/customDesign/index.html', 'Designs')
    }
    // Add CSS to remove border
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    placeLogo()
}

function update() {
    //console.log(context.sys.game.config.width)
}
function positionBackgroundImage() {
    // Get the size of the game canvas (screen)
    const screenWidth = context.sys.game.config.width;
    const screenHeight = context.sys.game.config.height;

    // Add the background image
    bg = context.add.image(0, 0, 'bg');

    // Set the scale of the background image to fit the screen
    bg.setScale(screenWidth / bg.width, screenHeight / bg.height);

    // Set the background image origin to the top-left corner
    bg.setOrigin(0, 0);
}

/**
 * Positions the button that we click at the initial screen to navigate to an app
 */
function positionItemButon(posX, posY, navigationUrl, buttonText) {

    //defineScreenSize()
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
    graphics.fillRoundedRect(x, y, width, height, 20);

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

        if (buttonText != 'Division') {
            let userInput = prompt("Please enter password");

            // Check if user input is not null (Cancel returns null)
            if (userInput !== "pass") {
                alert("You entered incorrect password ");
                return
            } else {
                alert("You are authorized");
            }
        }

        window.location.href = navigationUrl; // Navigate to specific url
        graphics.fillStyle(0xFF7171, 1);

    })
}

function resizeBackground() {
    // Calculate the scale factors to fit the background image to the screen
    let scaleX = window.innerWidth / bg.width;
    let scaleY = window.innerHeight / bg.height;

    // Set the scale of the background image
    bg.setScale(scaleX, scaleY);
}

function placeLogo() {
    context.add.image(0, 0, 'logo').setOrigin(0).setScale(0.5,0.5)
}