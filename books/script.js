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
    context.load.image('arrow', 'assets/nextPageArrow.png')
}

function create() {
    const template = this.add.image(250, -180, 'bookTemplate').setOrigin(0);
    template.setScale(2.1)

    context.add.text(380, 100, `  EMILY'S STORY BOOK`, { fill: 'RED', fontSize: 28 });
    context.add.text(380, 130, '\n– THE LITTLE PRINCE', { fill: 'GRAY', fontSize: 28 });


    addAnimatedArrow()
}

function addAnimatedArrow(){
 // Add the sprite to the scene
 let mySprite = context.add.sprite(1245, 350, 'arrow');
 mySprite.setInteractive({ cursor: 'pointer' });

 // Initial scale of the sprite
 mySprite.setScale(0.1);

 // Tween to animate the sprite's stretching effect
 let animation = context.tweens.add({
     targets: mySprite,
     scaleX: 0.12, // Stretch horizontally to 2x its original width
     scaleY: 0.08, // Compress vertically to half its original height
     duration: 800, // Duration of the stretch in milliseconds
     ease: 'Sine.easeInOut', // Easing function for smooth transition
     yoyo: true, // Reverse the animation after completing
     repeat: -1, // Repeat indefinitely
     paused: true
 });
 mySprite.on('pointerover', () => {
     //mySprite.setInteractive({ cursor: 'pointer' });  // Change the cursor to a hand
    animation.play();

});

mySprite.on('pointerout', () => {
    animation.pause(); // Pause the tween when the hover ends
    animation.seek(0)
});

}
