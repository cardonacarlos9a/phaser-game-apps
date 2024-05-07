
import { speak, createText } from '../common/common.js'

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
//Variables section
var game = new Phaser.Game(config);
var context;
var randomAngleType;
let angleDegrees;
var correct
var sound

const AngleType = {
    'AGUDO': 'Agudo',
    RECTO: 'Recto',
    OBTUSO: 'Obtuso',
    LLANO: 'Llano',
    CONCAVO: 'Concavo',
    CONVEXO: 'Convexo',
    PERIGONAL: 'Perigonal',
    NULO: 'Nulo'
};

const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '10px',
    fontSize: '16px'
};

function preload() {
    context = this
    this.load.image('tipos', 'Tipos-de-angulos.webp')
    // Sound to tell correct or incorrect
    this.load.audio('sound', ['../multiplicacion/sound.mp3'])
    this.load.audio('correct', ['../multiplicacion/correct.mp3'])
}

function create() {
    sound = this.sound.add('sound')
    correct = this.sound.add('correct')

    this.add.text(window.innerWidth / 2, 20, 'Ángulos', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })
    this.add.text(window.innerWidth / 3, 40, 'Selecciona el tipo de angulo correcto', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })

    //Add CSS to remove border
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    drawHalveCircle()
    draggingTest1(this)

    //Add tipe of angles image
    //const anglesTypeImage = this.add.image(700, 100, 'tipos').setOrigin(0).setScale(0.5);

    //Adds a button on the left to select game mode
    addCustomButtom(150, 50, null, null, 'Create Angle')

    createGameOptionAngleCreation()
    speak("Bienvenido");
    createText(context)
}

function update() {

}


function createRectangle() {
    // Create a rectangle
    const rectangle = context.add.rectangle(300, 100, 300, 10, 0xffffff);
    rectangle.setInteractive({ cursor: 'pointer' })
    rectangle.setOrigin(0.5); // Set origin to the center (optional)

    // Add pointerdown event listener
    rectangle.on('pointerdown', function (pointer, localX, localY, event) {
        // Rotate the rectangle by 90 degrees on each click
        rectangle.rotation += Phaser.Math.DegToRad(30); // Rotate by 90 degrees
    });
}

function drawAngle() {
    // Create a line
    const line = new Phaser.Geom.Line(200, 300, 200, 100);
    // Draw the line
    const graphics = context.add.graphics();
    graphics.lineStyle(2, 0xffffff); // Set line style
    graphics.strokeLineShape(line); // Draw the line
}

function drawHalveCircle() {
    const centerX = 200; // x-coordinate of the center of the circle
    const centerY = 100; // y-coordinate of the center of the circle
    const radius = 30; // radius of the circle
    const startAngle = Phaser.Math.DegToRad(90); // start angle of the arc (180 degrees)
    const endAngle = Phaser.Math.DegToRad(0); // end angle of the arc (0 degrees)
    const anticlockwise = false; // draw the arc clockwise

    const graphics = context.add.graphics();
    graphics.lineStyle(2, 0xffffff); // Set line style
    graphics.beginPath();
    graphics.arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise);
    graphics.strokePath(); // Draw the path
}

function draggingTest1() {

    (_ => { // Creates the horizontal line
        const line = new Phaser.Geom.Line(200, 300, 400, 300);
        context.add.graphics()
            .lineStyle(2, 0xffffff)
            .strokeLineShape(line)
    })();

    const degrees = context.add.text(420, 280, '0°', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })
    // Define the initial coordinates of the line
    let startX = 200;
    let startY = 300;
    let endX = 400;
    let endY = 100;

    // Draw the line
    const graphics = context.add.graphics();
    graphics.lineStyle(3, 0xffffff); // Set line style
    graphics.beginPath();
    graphics.moveTo(startX, startY); // Move to the start point
    graphics.lineTo(endX, endY); // Draw a line to the end point
    graphics.strokePath(); // Stroke the path

    // Calculate the bounds of the line
    const bounds = new Phaser.Geom.Rectangle(Math.min(startX, endX), Math.min(startY, endY), Math.abs(endX - startX), Math.abs(endY - startY));
    // Enable input events on the line
    graphics.setInteractive(bounds, Phaser.Geom.Rectangle.Contains);
    const updateLine = () => {
        // Add pointermove event listener to drag the line
        context.input.on('pointermove', function (pointer, localX, localY, event) {


            // Update the end point of the line
            if (pointer.x <= 400 && pointer.y <= 500) {
                endX = pointer.x;
                endY = pointer.y;

                // Calculate the angle between the fixed start point and the pointer position
                const angle = Phaser.Math.Angle.Between(startX, startY, pointer.x, pointer.y);

                // Convert the angle to degrees
                angleDegrees = Phaser.Math.RadToDeg(angle);
                angleDegrees = (360 - angleDegrees) % 360;
                angleDegrees = Math.floor(angleDegrees);

                degrees.text = angleDegrees

            }
            // Clear the graphics and redraw the line
            graphics.clear();
            graphics.lineStyle(2, 0xffffff);
            graphics.beginPath();
            graphics.moveTo(startX, startY); // Move to the start point
            graphics.lineTo(endX, endY); // Draw a line to the end point
            graphics.strokePath(); // Stroke the path
        });
    }

    // Add pointermove event listener to update line direction
    context.input.on('pointermove', updateLine);

    // Add click event listener to stop line movement
    context.input.on('pointerdown', function () {
        // Remove the pointermove event listener
        context.input.off('pointermove');
        console.log('hola')
        if (randomAngleType == 'Recto' && angleDegrees == 90) {
            console.log('congratulations')
            correct.play()
        } else if (randomAngleType == 'Agudo' && angleDegrees < 90 && angleDegrees > 0) {
            correct.play()
        } else if (randomAngleType == 'Obtuso' && angleDegrees > 90 && angleDegrees < 180) {
            correct.play()

        } else if (randomAngleType == 'Llano' && angleDegrees == 180) {
            correct.play()

        } else if (randomAngleType == AngleType.CONCAVO && angleDegrees > 180 && angleDegrees < 360) {
            correct.play()

        } else if (randomAngleType == AngleType.CONVEXO && angleDegrees > 0 && angleDegrees < 180) {
            correct.play()

        } else if (randomAngleType == AngleType.NULO && angleDegrees == 0) {
            correct.play()
        } else {
            sound.play()
        }
    });
}

function addCustomButtom(width, height, posX, posY, text) {

    const defaultAtributes = {
        width: 150,
        height: 50,
        posX: 100,
        posY: 100
    }

    const button = context.add.sprite(posX ?? defaultAtributes.posX, posY ?? defaultAtributes.posY, 'tipos')
        .setInteractive({ cursor: 'pointer' })

    button.displayWidth = width ?? defaultAtributes.width
    button.displayHeight = height ?? defaultAtributes.height;
    // Create text for the button
    const buttonText = context.add.text(button.x, button.y, text || 'Button Text', { fontFamily: 'Arial', fontSize: 20, color: '#aaaaaa' });
    buttonText.setOrigin(0.5); // Center the text relative to the button

    button.on('pointerdown', function () {
        context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        draggingTest1()
    });
}

//Asks the user to draw an angle based on type provided as text
function createGameOptionAngleCreation() {
    // Convert object keys into an array
    const angleTypeKeys = Object.keys(AngleType);

    // Get a random index
    const randomIndex = Math.floor(Math.random() * angleTypeKeys.length);

    // Get the random angle type value
    randomAngleType = AngleType[angleTypeKeys[randomIndex]];
    context.add.text(200, 500, 'Crea un Angulo ' + randomAngleType, { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })
}


