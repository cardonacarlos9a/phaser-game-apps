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


const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '10px',
    fontSize: '16px'
};

function preload() {
    //const 
    this.load.image('tipos', 'Tipos-de-angulos.webp')
}

function create() {
    context = this;
    //createRectangle()
    draggingTest()
    this.add.text(window.innerWidth / 2, 20, 'Ángulos', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })
    this.add.text(window.innerWidth / 3, 40, 'Selecciona el tipo de angulo correcto', { fontFamily: 'Bradley Hand', fontSize: 28, color: '#eeeeee' })

    //Add CSS to remove border
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    drawHalveCircle()
    draggingTest1(this)

    //Add tipe of angles image
    const anglesTypeImage = this.add.image(700, 0, 'tipos').setOrigin(0).setScale(0.5);


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
    const line = new Phaser.Geom.Line(200, 300, 400, 300);
    // Drws the vertical line
    //drawAngle()

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

function draggingTest1(context) {
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

    //Continuous tracking of pointer movement
    context.input.on('pointermove', function (pointer) {
        if (pointer.x < 210) {
            endX = 100
            console.log(endX)
        }
    });

    // Add pointermove event listener to drag the line
    context.input.on('pointermove', function (pointer, localX, localY, event) {
        // Update the end point of the line
        
        endX = pointer.x;
        endY = pointer.y;

        // Clear the graphics and redraw the line
        graphics.clear();
        graphics.lineStyle(2, 0xffffff);
        graphics.beginPath();
        graphics.moveTo(startX, startY); // Move to the start point
        graphics.lineTo(endX, endY); // Draw a line to the end point
        graphics.strokePath(); // Stroke the path
    });

}


