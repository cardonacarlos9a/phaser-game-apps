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

//Styles
const numberOptionStyle = {
    fontSize: '50px',
    fontFamily: 'Arial',
    color: 'pink',
    align: 'center',
    backgroundColor: 'transparent',
    border: '30px'

}
const estiloMultiplicador = {
    fontSize: '60px',
    fill: '#ffff'
}
var context;
var game = new Phaser.Game(config);
var scoreText, random1 = 0, random2 = 0, op1, op2, op3, op4, choiceCorrect = true;
var timerValue = 0, timerComponent;
var endGame;
var negativePointsCounter = 0;
var negativePointsComponent;
var positivePointsCounter = 0;
var positivePointsComponent;
var spritebg;

function preload() {

    this.load.audio('sound', ['sound.mp3'])
    this.load.audio('correct', ['correct.mp3'])
    this.load.html('nameform', 'nameForm.html');
    this.load.image('bg', 'bg.png');
    this.load.image('arrow', 'arrow.jpeg');
    this.load.image('grid', 'grid.png');
    this.load.image('play', 'play.png');
    this.load.image('multiplication', 'multiplication.png');
}

function create() {
    context = this;
    const sound = this.sound.add('sound')
    const correct = this.sound.add('correct')

    spritebg = this.add.image(0, 0, 'bg').setOrigin(0);
    this.scale.on('resize', resizeBackground, context);
    resizeBackground()

    scoreText = this.add.text(16, 30, 'score: 0', { fontSize: '32px', fill: '#ffff' });
    this.add.text(650, 10, 'Multiplications to rock', numberOptionStyle);
    numSuperior = this.add.text(880, 100, 0, estiloMultiplicador);
    numInferior = this.add.text(880, 170, 0, estiloMultiplicador);
    this.add.line(900, 230, 0, 0, 100, 0, '0xffffff');
    const playImage = this.add.image(900, 500, 'play').setScale(0.2);

    this.add.image(830, 180, 'multiplication').setScale(0.15)
    //this.circle = this.add.circle(775, 375, 50, 0xa60e1a).setScale(1);

    op1 = this.add.text(650, 350, 0, numberOptionStyle);
    //Phaser.Display.Align.In.line( op1, this.circle );

    op2 = this.add.text(800, 350, 0, numberOptionStyle);
    op3 = this.add.text(950, 350, 0, numberOptionStyle);
    op4 = this.add.text(1100, 350, 0, { fontSize: '55px', color: 'pink' });

    createNavigationMenu(this);

    //Set pointer displayed as hand when hovering
    [op1, op2, op3, op4, playImage].forEach(e => {
        e.setInteractive({ cursor: 'pointer' });
    })

    sprite2 = this.add.image(300, 250, 'grid');
    sprite2.setScale(0.35)

    playImage.on('pointerdown',
        function () {
            choiceCorrect ? newMultiplication() : '';
        }
    );

    playImage.on('pointerover',
        function (event) {
            this.setTint(0xff0000);
        }
    );
    negativePointsComponent = this.add.text(300, 350, '- ' + negativePointsCounter, numberOptionStyle);
    positivePointsComponent = this.add.text(330, 450, positivePointsCounter, numberOptionStyle);

    //Veifies if the clicked number is the correct answer
    [op1, op2, op3, op4].forEach(e => {
        e.setScale(1.5)
        e.on('pointerdown',
            function () {
                if (e.text == random1 * random2) {
                    scoreText.text++;
                    correct.play()
                    newMultiplication();
                    positivePointsCounter += 1;
                    positivePointsComponent.text = positivePointsCounter
                }
                else {
                    sound.play()
                    negativePointsCounter += 1;
                    negativePointsComponent.text = '- ' + negativePointsCounter
                    //this.cameras.main.shake(500)
                }
            }
        );
        e.on('pointerover',
            function (event) {
                this.setTint(0x00ff00);
            }
        );
        e.on('pointerout',
            function (event) {
                this.setTint(0xeeeeee);
            }
        );

    })

    timerComponent = this.add.text(700, 700, 0, { fontSize: '32px', fill: '#ffff' });
    updateTimer()
    endGame = this.add.text(200, 200, 'OVER', { fontSize: '32px', fill: '#ffff' });

    // Add CSS to remove border
    document.body.style.margin = '0';
    document.body.style.padding = '0';
}

function update() {

}
function updateTimer() {
    const interval = setInterval(() => {
        timerValue++;
        this.timerComponent.text = 'Your time is: ' + timerValue;
        if (timerValue == 3) {
            endGame.setScale(0)
        }
    }, 1000);
}

function generateRandomNumber(param) {
    return Math.trunc(Math.random() * param);
}

function newMultiplication() {
    choiceCorrect = false
    //Generates number up to 10
    random1 = generateRandomNumber(10)
    random2 = generateRandomNumber(10)

    numSuperior.text = random1
    numInferior.text = random2;

    //Random numbers which consitute the possible answer options
    const arr = [Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100)];

    //Randomize position of choices, along with the correct one
    arr.splice((arr.length + 1) * Math.random() | 0, 0, random1 * random2)
    var index = 0;

    //Setting the potencial number answer to each option
    [op1, op2, op3, op4].forEach(e => {
        e.text = arr[index];
        index++
    })
}

function createNavigationMenu(context) {
    const buttonWidth = 400;
    const buttonHeight = 300;
    const cornerRadius = 100;

    const graphics = context.add.graphics();
    graphics.fillStyle(0x3498db, 1); // Set fill color (use your desired color)
    graphics.fillRoundedRect(2 - buttonWidth / 2, -6 - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

    const button = context.add.text(400, 300, 'Divisiones', { fontSize: '32px', fill: '#fff', backgroundColor: 'red', color: 'red', cornerRadius: '20px' })
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () => {
            // This function will be called when the button is clicked
            window.location.href = 'experiment-game/index.html'; // Replace with your desired URL

        });

    // Set origin to center for proper positioning
    button.setOrigin(2, -6);
    return { graphics, button }
}
function resizeBackground() {
    // Calculate the scale factors to fit the background image to the screen
    let scaleX = window.innerWidth / spritebg.width;
    let scaleY = window.innerHeight / spritebg.height;

    // Set the scale of the background image
    spritebg.setScale(scaleX, scaleY);
}