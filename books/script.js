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
        //update: update
    },
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
var game = new Phaser.Game(config);
let context;
function preload() {
    context = this;
    this.load.image('bookTemplate', 'template.png');
    context.cameras.main.setBackgroundColor('#eacfbf'); // White background color

}

function create() {
    const template = this.add.image(250, -180, 'bookTemplate').setOrigin(0);
    template.setScale(2.1)

    context.add.text(380, 100, `  EMILY'S STORY BOOK`, { fill: 'RED', fontSize: 28 });
    context.add.text(380, 130, '\n– THE LITTLE PRINCE', { fill: 'GRAY', fontSize: 28 });

}