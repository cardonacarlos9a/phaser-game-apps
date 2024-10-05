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
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
var game = new Phaser.Game(config);
let context
let selectedItem

function preload() {
    context = this
}
function update() {

}

function create() {
    const textarea = document.getElementById('prompt');
    textarea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && textarea.value.length > 0) {
            console.log(textarea.value)
            event.preventDefault();
            const userInput = textarea.value;
            textarea.value = '';
            if (userInput.includes('add')) {
                add(userInput.split(' ')[1], userInput.split(' ')[2])
            }
            else if (userInput.includes('round corners')) {
                roundVertex(userInput.split(' ')[2])
            } else if (userInput.toLowerCase().includes('change color')) {
                //changeBackgroundColor(userInput.split(' ')[2])
                changeColorFunction[selectedItem.data.type](userInput.split(' ')[2])
            } else if (userInput.toLowerCase().includes('resize')) {
                resizeShape[selectedItem.data.type](userInput)
            }
        }
    });

}

function add(figureToAdd, params) {
    figures[figureToAdd](params)
}
const changeColorFunction = {
    square: (newColor) => {
        selectedItem.clear(); // Clear the current graphic
        selectedItem.fillStyle('0x' + newColor, 1); // Set the new color
        selectedItem.fillRoundedRect(100, 100, selectedItem.width, selectedItem.height, selectedItem.radius); //
        selectedItem.backgroundColor = '0x' + newColor
        console.log(selectedItem)
    },
    text: (newColor) => {
        selectedItem.setColor('#' + newColor)
    }
}

function roundVertex(number) {
    let radius = parseInt(number, 10); // Extract the corner radius from input
    if (selectedItem) {
        selectedItem.clear();
        selectedItem.fillRoundedRect(100, 100, selectedItem.width, selectedItem.height, radius); //
        selectedItem.radius = radius
    }
}
const resizeShape = {
    square: (userInput) => {
        let width = parseInt(userInput.split(' ')[1], 10); // Extract the corner radius from input
        let height = parseInt(userInput.split(' ')[2], 10); // Extract the corner radius from input
        console.log(width, height)
        // Ensure selectedItem has a radius property to avoid errors
        if (typeof selectedItem.radius === 'undefined') {
            selectedItem.radius = 0; // Default radius if it's not set
        }
        if (selectedItem) {
            selectedItem.clear(); // Clear the current graphic
            selectedItem.fillStyle(selectedItem.backgroundColor, 1); // Set the new color
            // Redraw the shape with the new dimensions and existing radius
            selectedItem.fillRoundedRect(100, 100, width, height, selectedItem.radius);
            selectedItem.width = width
            selectedItem.height = height
        }
    },
    text: (userInput) => {
        selectedItem.setFontSize(parseInt(userInput.split(' ')[1], 10));
    }
}
function changeBorderColor() {

}

function setDraggingFunctionality(item) {
    context.input.setDraggable(item);
    let index = 0;

    context.input.on('dragstart', (pointer, gameObject) => {
        index = context.children.getIndex(gameObject); // Get index to manage z-order
        context.children.bringToTop(gameObject); // Bring the dragged object to the top
    });
    context.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX; // Update x position
        gameObject.y = dragY; // Update y position
    });
    context.input.on('dragend', (pointer, gameObject) => {
        context.children.moveTo(gameObject, index); // Restore the original z-order
    });
}

const figures = {
    //Default size if seize not provided
    //Add on click event
    square: () => {
        let graphics = context.add.graphics()
            .fillStyle(0xFFFFFF, 1)
            .fillRoundedRect(100, 100, 100, 100, 0) // Use fillRoundedRect with dynamic corner radius
            .setInteractive(new Phaser.Geom.Rectangle(100, 100, 100, 100), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', function () {
                selectedItem = this
            });
        graphics.data = { type: 'square' }
        graphics.radius = 0
        graphics.backgroundColor = 0xe7e2f2
        graphics.width = 100
        graphics.height = 100
        console.log(graphics)
        // Enable dragging for the graphics object
        setDraggingFunctionality(graphics)
    },
    circle: () => {
        let graphics = context.add.graphics()
            .fillStyle(0xFF0000, 1) // Set fill color to red
            .fillCircle(200, 200, 50) // Draw a circle at position (200, 200) with a radius of 50
            .setInteractive(new Phaser.Geom.Circle(200, 200, 50), Phaser.Geom.Circle.Contains)
            .on('pointerdown', function () {
                selectedItem = this;
            })

        setDraggingFunctionality(graphics)
    },
    heart: () => {
        var graphics = context.add.graphics()
            .fillStyle(0xFF69B4, 1); // Set the fill color for the heart (pink)

        // Heart shape points (relative to (x, y) of the heart)
        const heartShape = [
            { x: 0, y: -50 },
            { x: -50, y: -10 },
            { x: -40, y: 40 },
            { x: 0, y: 50 },
            { x: 40, y: 40 },
            { x: 50, y: -10 }
        ];

        // Position of the heart
        const heartX = 300;
        const heartY = 300;

        // Offset the heart shape points to the desired position
        const heartPoints = heartShape.map(point => ({
            x: heartX + point.x,
            y: heartY + point.y
        }));
        // Draw the heart shape
        graphics.fillPoints(heartPoints, true)
            .setInteractive(new Phaser.Geom.Polygon(heartPoints), Phaser.Geom.Polygon.Contains)
            .on('pointerdown', function () {
                selectedItem = this;
            });

        setDraggingFunctionality(graphics)
    },
    text: (textToAdd) => {
        // Create a text object
        const text = context.add.text(100, 100, textToAdd, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        });
        // Set the text object to be interactive
        text.setInteractive();
        text.data = { type: 'text' }

        // Add the pointerdown event to the text
        text.on('pointerdown', function () {
            console.log('Text clicked!');
            selectedItem = this
        });
        setDraggingFunctionality(text)
    }
}