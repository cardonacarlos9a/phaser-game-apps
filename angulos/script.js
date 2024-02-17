var config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 1300,
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
let context;

const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '10px',
    fontSize: '16px'
};

function preload() {


}

function create() {
    context = this;
    //createRectangle()
    draggingTest()
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

function draggingTest() {
    // Create a line
    const line = new Phaser.Geom.Line(50, 50, 200, 100);

    // Draw the line
    const graphics = context.add.graphics();
    graphics.lineStyle(2, 0xffffff); // Set line style
    graphics.strokeLineShape(line); // Draw the line

    // Enable input events on the line
    graphics.setInteractive(new Phaser.Geom.Rectangle(line.x1, line.y1, line.length, 5), Phaser.Geom.Rectangle.Contains);

    // Add pointerdown event listener to the line
    graphics.on('pointerdown', function (pointer, localX, localY, event) {
        // Start dragging only if the pointer is close to the draggable end of the line
        const threshold = 10; // Adjust this threshold as needed
        if (Phaser.Math.Distance.Between(pointer.x, pointer.y, line.x2, line.y2) < threshold) {
            graphics.dragging = true;
        }
    });

    // Add pointerup event listener to stop dragging
    graphics.on('pointerup', function (pointer, localX, localY, event) {
        graphics.dragging = false;
    });

    // Add pointermove event listener to drag the line
    graphics.on('pointermove', function (pointer, localX, localY, event) {
        if (graphics.dragging) {
            // Update the position of the draggable end of the line
            line.x2 = pointer.x;
            line.y2 = pointer.y;

            // Clear the graphics and redraw the line
            graphics.clear();
            graphics.lineStyle(2, 0xffffff);
            graphics.strokeLineShape(line);
        }
    });

}
