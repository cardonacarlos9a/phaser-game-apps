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
var scoreText, random1 = 0, random2 = 0, op1, op2, op3, op4, choiceCorrect = true;

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
    const sound = this.sound.add('sound')
    const correct = this.sound.add('correct')

    spritebg = this.add.image(340, 250, 'bg');
    spritebg.setScale(3)

    scoreText = this.add.text(16, 30, 'score: 0', { fontSize: '32px', fill: '#ffff' });
    this.add.text(650, 10, 'Multiplications to rock', numberOptionStyle);
    numSuperior = this.add.text(880, 100, 0, estiloMultiplicador);
    numInferior = this.add.text(880, 170, 0, estiloMultiplicador);
    this.add.line(900, 230, 0, 0, 100, 0, '0xffffff');
    const playImage = this.add.image(900, 500, 'play').setScale(0.2);

    this.add.image(830,180,'multiplication').setScale(0.15)
    //this.circle = this.add.circle(775, 375, 50, 0xa60e1a).setScale(1);

    op1 = this.add.text(750, 350, 0, numberOptionStyle);
    //Phaser.Display.Align.In.line( op1, this.circle );

    op2 = this.add.text(850, 350, 0, numberOptionStyle);
    op3 = this.add.text(950, 350, 0, numberOptionStyle);
    op4 = this.add.text(1050, 350, 0, { fontSize: '50px', color: 'pink' });

    //Set pointer displayed as hand when hovering
    [op1, op2, op3, op4, playImage].forEach(e => {
        e.setInteractive({ cursor: 'pointer' });
    }
    )

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

    //Veifies if the clicked number is the correct answer
    [op1, op2, op3, op4].forEach(e => {
        e.on('pointerdown',
            function () {
                if (e.text == random1 * random2) {
                    scoreText.text++;
                    correct.play()
                    newMultiplication();
                }
                else {
                    sound.play()
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
}

function update() {

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