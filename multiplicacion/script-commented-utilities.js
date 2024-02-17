var config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 800,
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

var game = new Phaser.Game(config);
var scoreText, random1, random2, op1, op2, op3, op4, choiceCorrect = true;

function preload() {
    this.load.html('nameform', 'nameForm.html');
    this.load.image('bg', 'bg.png');
    this.load.image('arrow', 'arrow.jpeg');
    this.load.image('grid', 'grid.png');
    this.load.image('play', 'play.png');
}
function create() {
    spritebg = this.add.image(340, 250, 'bg');

    op1 = this.add.text(750, 350, generateRandomNumber(100), numberOptionStyle);
    op2 = this.add.text(850, 350, generateRandomNumber(100), numberOptionStyle);
    op3 = this.add.text(950, 350, generateRandomNumber(100), numberOptionStyle);
    op4 = this.add.text(1050, 350, generateRandomNumber(100), { fontSize: '50px', color: 'pink' });
    [op1, op2, op3, op4].forEach(e => {
        e.setInteractive({ cursor: 'pointer' })
    }
    )
    spritebg.setScale(3)

    sprite2 = this.add.image(300, 250, 'grid');
    sprite2.setScale(0.35)

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffff' });

    const playImage = this.add.image(900, 500, 'play').setScale(0.2)
    playImage.setInteractive({ cursor: 'pointer' })

    numSuperior = this.add.text(880, 100, generateRandomNumber(10), estiloMultiplicador);
    numInferior = this.add.text(880, 170, generateRandomNumber(10), estiloMultiplicador);

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

    [op1, op2, op3, op4].forEach(e => {
        e.on('pointerdown',
            function () {
                if (e.text == random1 * random2) {
                    scoreText.text++;
                    newMultiplication();
                }
            }
        )
    })
//Sample code with utilities for future reference
    /*op1.on('pointerdown',
        function () {
            if (this.text == random1 * random2) {
                scoreText.text++;
                newMultiplication();
            }
        }
    ); 
   */

    //const element = this.add.dom(400, 0).createFromCache('nameform');
    //this will listen for a down event 
    //on every object that is set interactive
    this.input.on('gameobjectdown', onObjectClicked);

    //Numero de multiplicacion

    //Opciones de respuesta

}

function onObjectClicked(pointer, gameObject) {
    //gameObject.angle+=10;
}

function update() {

}

function generateRandomNumber(param) {
    return Math.trunc(Math.random() * param);
}

function newMultiplication() {
    choiceCorrect = false

    random1 = generateRandomNumber(10)
    random2 = generateRandomNumber(10)

    numSuperior.text = random1
    numInferior.text = random2;

    //Random numbers which consitute the possible options
    const arr = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]

    arr.splice((arr.length + 1) * Math.random() | 0, 0, random1 * random2)
    var index = 0;

    //Setting the potencial number answer to each option
    [op1, op2, op3, op4].forEach(e => {
        e.text = arr[index];
        index++
    })

}