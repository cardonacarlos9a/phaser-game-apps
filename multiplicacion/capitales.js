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
var platforms;

var game = new Phaser.Game(config);


function preload() {
    this.load.image('ground', 'capital-assets/platform.png');
   
}

function create() {
    platforms = this.physics.add.staticGroup();

    platforms.create(500, 100, 'ground').setScale(2).refreshBody();
    platforms.create(500, 700, 'ground').setScale(2).refreshBody();
   
}

function update() {

}
function updateTimer(){
    const interval = setInterval(() => {
        timerValue++;
        this.timerComponent.text = 'Your time is: ' +timerValue;
        if(timerValue==3){
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