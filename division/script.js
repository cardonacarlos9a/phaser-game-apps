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
let infoBubble;
let arrowGroup;
const dividendo = generarNumeroAleatorio(10000000);
const divisor = generarNumeroAleatorio(100);
let dividendoParcialGlobal = extraerDividendoParcial(dividendo);
let context;
//Grupo de globo de info con texto dentro y equis para cerrar
let group;
//indice global para agregar el 'index' como data a cada caja de texto creada
let index = 0;
// Funciona como un flag para activar o desactivar el keydown event en la caja de texto
// con el proposito de no poner varios eventos del mismo
let keyDownEventHandler = false
//valor para rastrear el indice de la caja de texto que fue clickeada para ingresar el texto en la caja correcta
let inputTextBoxClicked
//Listado de intervalos para el puntuero que titila - no es usada todavia
const intervalIds = [];
// Variable para rastrear cual es el ultimo digito correcto agredado en el cociente
let ultimoDigitoCociente;
//Variable para rastrear el siguiente digito que se debe bajar despues de realizar la resta, almacena un indice
let siguienteDigitoDividendo = 0;
//indice de fila actual de la division, para saber donde posicionar cajas
let indiceFilasX = determinarDigitosASeparar(dividendo, divisor);
let indiceColumnasY = 1;
// Variable para rastrear la cantidad de espacio adicional que se debe considerar a la hora de asignar
// la posicion y a la caja de ingreso de texto
let lineaEspaciadora = 0
// Variable para tener control de la ubicacion de la siguiente caja de texto de cociente que se pondra,
// almacena un indice haciendo referencia al numero de caja
let numeroCajaCociente = 1
//Indice para tener control sobre en que parte poner la linea separadora de la resta en el eje x
let indicePosicionLineaResta = 1
// Posicion para ubicar las lineas separadoras del resultado de resta en el eje y
let posicionLineaRestaEjeY = 67.5
//AUDIOS
//Audio incorrecto
let tryAgain
let veryGood
// Get the width and height of the game screen
let screenWidth = 0
let screenHeight = 0
//Some background
var spritebg;
var text
//Button to show the information bubble
let infoButton;
//Button to close info bubble
let closeButton
//Object has a reference for the global position of all elements in division
const baseCoordinates = {
    initialX: 0,
    initialY: 0
}

const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '10px',
    fontSize: '16px'
};

//vars to reference animations
let sprite2;



function preload() {
    context = this;
    if (context.sys.game.config.width < 500) {
        //Initialize screen size for small screens
        baseCoordinates.initialX = 1;
        baseCoordinates.initialY = context.sys.game.config.height / 10;
    } else {
        baseCoordinates.initialX = context.sys.game.config.width / 5;
        baseCoordinates.initialY = context.sys.game.config.height / 3.4;
    }

    this.load.image('bg', 'bg.png');
    //this.load.image('letter-d', 'letter-d.png');
    this.load.image('questionMark', 'questionMark.svg');

    //Load Audios
    this.load.audio('tryAgain', ['ohno.mp3'])
    this.load.audio('veryGood', ['Verygood.mp3'])
    console.log(window.innerHeight, context.sys.game.config.height)

    // Load the sprite sheet
    context.load.spritesheet('mySprite', 'spritesheet.png', {
        frameWidth: 200,
        frameHeight: 200,
        endFrame: 15 // This should be 23 if you want 24 frames (starting from 0)
    }); 

    context.load.spritesheet('mySprite2', 'spritesheet2.png', {
        frameWidth: 200,
        frameHeight: 200,
        endFrame: 79 // This should be 23 if you want 24 frames (starting from 0)
    });

    context.load.spritesheet('mySprite3', 'banana.png', {
        frameWidth: 200,
        frameHeight: 200,
        endFrame: 8 // This should be 23 if you want 24 frames (starting from 0)
    });
    
    context.load.spritesheet('mySprite4', 'telephone.png', {
        frameWidth: 200,
        frameHeight: 200,
        endFrame: 14 // This should be 23 if you want 24 frames (starting from 0)
    });

    context.load.spritesheet('mySprite5', 'corazon.png', {
        frameWidth: 200,
        frameHeight: 200,
        endFrame: 12 // This should be 23 if you want 24 frames (starting from 0)
    });

    
    

}

function create() {
    spritebg = this.add.image(0, 0, 'bg').setOrigin(0);
    spritebg.setScale(config.width / spritebg.width, config.height / spritebg.height)
    //Creates two groups
    group = this.add.group()
    arrowGroup = this.add.group();
    this.scale.on('resize', _ => {
        resizeBackground()
    }, context);

    // posicionar numeros de dividendo y divisor, first step to show division
    positionNumbers(this, dividendo)
    tryAgain = this.sound.add('tryAgain')
    veryGood = this.sound.add('veryGood')

    //
    this.anims.create({
        key: 'playAnimation',
        frames: this.anims.generateFrameNumbers('mySprite', { start: 0, end: 14 }), // Start and end frames
        frameRate: 10, // Speed of the animation
        repeat: -1 // Loop the animation
    });
    const sprite = this.add.sprite(200, 500, 'mySprite');
    sprite.play('playAnimation'); // Play the animation

    this.anims.create({
        key: 'playAnimation2',
        frames: this.anims.generateFrameNumbers('mySprite2', { start: 0, end: 72 }), // Start and end frames
        frameRate: 40, // Speed of the animation
        repeat: 0 // Loop the animation
    });

    sprite2 = context.add.sprite(900, 500, 'mySprite2');

    this.anims.create({
        key: 'playAnimation3',
        frames: this.anims.generateFrameNumbers('mySprite3', { start: 0, end: 7 }), // Start and end frames
        frameRate: 2, // Speed of the animation
        repeat: -1 // Loop the animation
    });
    const sprite3 = this.add.sprite(100, 150, 'mySprite3');
    sprite3.play('playAnimation3'); // Play the animation

    this.anims.create({
        key: 'playAnimation4',
        frames: this.anims.generateFrameNumbers('mySprite4', { start: 0, end: 13 }), // Start and end frames
        frameRate: 10, // Speed of the animation
        repeat: -1 // Loop the animation
    });
    const sprite4 = this.add.sprite(700, 150, 'mySprite4');
    sprite4.play('playAnimation4'); // Play the animation 

    this.anims.create({
        key: 'playAnimation5',
        frames: this.anims.generateFrameNumbers('mySprite5', { start: 0, end: 13 }), // Start and end frames
        frameRate: 10, // Speed of the animation
        repeat: -1 // Loop the animation
    });
    const sprite5 = this.add.sprite(700, 300, 'mySprite5');
    sprite5.play('playAnimation5'); // Play the animation 

}

function update() {
    // Keep the cursor blinking (optional)
    /*const currentTime = this.time.now;
    const cursorBlinkInterval = 500; // milliseconds
    const cursorVisible = (currentTime % (2 * cursorBlinkInterval)) < cursorBlinkInterval;
    const tempText = inputText?.text.substring(0, 1)
    if (cursorVisible) {
        inputText.setText(tempText+'|');
    } else {
        inputText.setText('h');
        console.log(inputText.text)
    }*/
}

function handleEnter(eveant) {
    // Clear the fill style and stop listening for text input
    this.input.keyboard.off('keydown-ENTER');
    inputBackground.setFillStyle(0xeeeeee);
}

function handleKeyDown(event) {
    if (event.key === 'Backspace') {
        // Handle backspace key
        inputText.text = inputText.text.slice(0, -1);
    } else if (event.key.length === 1) {
        // Handle alphanumeric key
        inputText.setText(event.key);
    }
}

function handleTextInput(event) {
    // Handle text input events
    inputText.setText(event.data);
    console.log(inputText.text)

}
//Metodo encargado de posicionar los numeros del dividendo
function positionNumbers(context, dividendo) {
    ponerLineaYDivisor(context, divisor)
    const posicionarDividendo = (context, valor, posX, posY) => {
        const button = context.add.text(posX, posY, valor,
            {
                fontSize: '32px', fill: '#fff', backgroundColor: 'transparent',
                color: 'red', cornerRadius: '20px'
            })
        // Set origin to center for proper positioning
        button.setOrigin(0.5, 0.5);
    };
    let posX = baseCoordinates.initialX
    let posY = baseCoordinates.initialY
    for (const char of dividendo.toString()) {
        posicionarDividendo(context, char, posX += 40, posY)
    }
    ejecutarPistaUno(context)

}
//Handles the creation of the arrow for digit separation and calls 
// function to create the cocient cocient boxes
//Parametros: en caso de necesitar propiedades especificas
function createOtherArrow(context, x, y, escala, parametros) {
    const graphics = context.add.graphics()

    // Set initial line style for border (2px width, green color)
    graphics.lineStyle(2, 0x00FF00, 1);

    const arrowX = x;
    const arrowY = y - 60;
    const size = escala
    // Draw the arrow without filling
    const arrowPolygon = new Phaser.Geom.Polygon();
    arrowPolygon.setTo([
        arrowX, arrowY,
        arrowX, arrowY + 50 * size,
        arrowX - 20 * size, arrowY + 50 * size,
        arrowX + 10 * size, arrowY + 80 * size,
        arrowX + 40 * size, arrowY + 50 * size,
        arrowX + 40 * size, arrowY + 50 * size,
        arrowX + 20 * size, arrowY + 50 * size,
        arrowX + 20 * size, arrowY
    ]);

    // Draw the initial border of the arrow
    graphics.strokePoints(arrowPolygon.points, true);

    // Add interactive events
    graphics.setInteractive(arrowPolygon, Phaser.Geom.Polygon.Contains);
    // Draw the initial border of the arrow

    //arrowPolygon.setOrigin(0.5,0.5)

    graphics.on('pointerover', function () {
        this.fillStyle(0x00FF00, 1);
        graphics.fillPoints(arrowPolygon.points, true);
        game.canvas.style.cursor = 'pointer';
    });

    graphics.on('pointerout', function () {
        // Restore the initial border when not hovered over
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillPoints(arrowPolygon.points, true);
        // Change the cursor back to the default
        game.canvas.style.cursor = 'default';
        //graphics.fillStyle(blue, 1);
    });

    graphics.on('pointerdown', function () {

        const roundedQuote = new Phaser.Geom.Ellipse(arrowX, arrowY, 40 * size, 50 * size);
        graphics.clear(); // Clear the graphics to redraw
        graphics.fillStyle(0x00FF00, 1);
        graphics.fillEllipseShape(roundedQuote);
        game.canvas.style.cursor = 'default';

        //accion cuando la flecha clickeada es la correcta
        if (this.getData('index') == determinarDigitosASeparar(dividendo, divisor)) {
            this.off('pointerout')
            this.fillStyle(0x00FF00, 1);

            // ocultar las otras flechas no cleckeadas
            arrowGroup.children.iterate(function (child) {
                child.visible = false;
            });
            // Mostrar la flecha clickeada y remover su animacion
            this.visible = true;
            context.tweens.killTweensOf(this);

            text.setVisible(false)
            infoBubble.setVisible(false)
            //TODO - Poner siguiente pista para buscar el primer digito del cociente
            crearGloboInformacion(context, 'Ahora busca el\nprimer digito\ndel cociente', window.innerWidth / 2, window.innerHeight / 2, 350, 150)

            //Creacion de caja cociente para ingreso de texto
            crearCajaTexto(context, baseCoordinates.initialX + numeroCajaCociente * 40 + dividendo.toString().length * 40 + 40, baseCoordinates.initialY + 30, 30, 20, 'cociente')

            numeroCajaCociente++;
            graphics.off('pointerover')
            graphics.off('pointerdown')
            //Avanzar el contador para apuntar hacia el siguiente digito del dividendo para bajarlo luego
            siguienteDigitoDividendo = determinarDigitosASeparar(dividendo, divisor) + 1

        } else {
            //Give feedback about incorrect separation of digits
            //moverOjosYSignoInterrogacion()
            tryAgain.play()
        }

    });

    context.tweens.add({
        targets: graphics,
        y: 30, // Jump height
        duration: 1000, // Duration of each jump in milliseconds
        yoyo: false, // Yoyo effect (return to the original position)
        repeat: 0 // times to repeat, -1 for
    });

    return graphics;
}

function ponerLineaYDivisor(context, divisor) {
    let initialX = baseCoordinates.initialX + dividendo.toString().length * 40 + 40
    let initialY = baseCoordinates.initialY
    const graphics = context.add.graphics({ fillStyle: { color: 0x0000ff } }).setInteractive()

    // Set line style (2px width, white color)
    graphics.lineStyle(3, 0x000000, 1);

    // Draw the arrow
    graphics.beginPath();
    graphics.moveTo(initialX, initialY - 20); // Starting point

    // Draw arrow body
    //graphics.lineTo(100, 200);
    graphics.lineTo(initialX, initialY + 10);
    graphics.lineTo(initialX + 100, initialY + 10);

    // Optional: Draw the outline of the arrow
    graphics.strokePath();

    const _divisor = context.add.text(initialX + 25, initialY - 5, divisor, { fontSize: '32px' })
    _divisor.setOrigin(0.5, 0.5)

}

function generarNumeroAleatorio(max) {
    return Math.floor(Math.random() * max)
}


function setBlink(auxCajaTexto) {
    if (auxCajaTexto.getData('hasBlinkSet') != 'true') {
        //Eliminar todos los intevalos excepto este
        for (let index = 0; index < intervalIds.length; index++) {
            clearInterval(intervalIds[index])
        }
        //auxCajaTexto.fillStyle({fontSize:'50'})
        auxCajaTexto.text = '|'
        auxCajaTexto.setStyle({ fontSize: '25px', color: "white" })
        //console.log(auxCajaTexto)
        let cursorVisible = true;
        cursorBlinkIntervalId = setInterval(function () {
            cursorVisible = !cursorVisible;
            auxCajaTexto.setVisible(cursorVisible);
        }, 500);
        auxCajaTexto.setData('hasBlinkSet', 'true')
        intervalIds.push(cursorBlinkIntervalId);
    }
}

function removeBlink(auxCajaTexto) {

}
/**
 * Metodo para crear un input donde se va agregando los valores de cada paso de la division
 * @param {context} context 
 */
function crearCajaTexto(context, posX, posY, width, height, tipo) {

    index++;
    // let cursorBlinkIntervalId; pendiente implementar
    let inputBackground = context.add.rectangle(context.sys.game.config.width / 5, posY, width, height, 'orange').setData({ 'index': 'R' + index, 'tipo': tipo }).
        setInteractive({ cursor: 'pointer' })
        .on('pointerdown', function () {

            //global variable containing the index of the box that was clicked
            inputTextBoxClicked = inputBackground.getData('index')
            if (!keyDownEventHandler) {
                context.input.keyboard.on('keydown', handleTextInputChange, context);
                keyDownEventHandler = true
            }
            let auxCajaTexto = context.children.getChildren().
                find(element => element.getData('index') == 'texto' + inputTextBoxClicked);

            //Find if the blink animation was already set on the box, otherwise dont set it
            //setBlink(auxCajaTexto)
        });

    function handleTextInputChange(event) {
        // //Eliminar cursor
        // for (let index = 0; index < intervalIds.length; index++) {
        //     clearInterval(intervalIds[index])
        // }
        // Rectangle
        let auxInputBackground = context.children.getChildren().
            find(element => element.getData('index') === inputTextBoxClicked);
        // Elemento de texto posicionado dentro de la caja
        const cajaTexto = context.children.getChildren().
            find(element => element.getData('index') === 'texto' + inputTextBoxClicked);

        if (auxInputBackground?.getData('tipo') == 'cociente') {

            // si es un digito
            if (/^[0-9]$/.test(event.key)) {
                let diviDendoParcial = dividendoParcialGlobal
                cajaTexto.text = event.key

                if (comprobarCocienteParcialCorrecto(diviDendoParcial, divisor, cajaTexto)) {
                    sprite2.play('playAnimation2'); // Play the animation
                    veryGood.play()

                    let cocienteParcial = Math.floor(diviDendoParcial / divisor)
                    const stepsWhenCocienteIsZero = () => {
                        //crearGloboInformacion(context, "Baja el digito que te\n indica la flecha", 500, 100, 500, 60)
                        indiceColumnasY--
                        indicePosicionLineaResta++;
                        pistaBajarSiguienteDigito()
                    }
                    const stepsWhenCocienteIsNotZero = () => {
                        crearGloboInformacion(context, "Ahora multiplica el numero\n que encontraste por el\ndivisor y lo ubicas en las\n cajas"
                            + " negras", 500, 100, 500, 150)
                        ponerCajasResta()
                    }
                    auxInputBackground.setFillStyle()
                    auxInputBackground.off('pointerdown')
                    auxInputBackground.setInteractive({ cursor: 'default' })
                    //ocultar globo anterior y Generar globo de informacion para multiplicacion
                    //group.setVisible(false)
                    infoBubble.setVisible(false)
                    text.setVisible(false)

                    //Poner cajas resta y estructura
                    context.input.keyboard.off('keydown', handleTextInputChange, context);
                    keyDownEventHandler = false
                    ultimoDigitoCociente = cajaTexto.text
                    //Poner pista de 

                    //No debemos poner cajas de resta si el cociente parcial agregado fue cero
                    cocienteParcial != 0 ? stepsWhenCocienteIsNotZero() : stepsWhenCocienteIsZero()
                }
            } else {
                console.log("recuerda que solo puedes ingresar numeros")
            }
        } else if (auxInputBackground.getData('tipo') == 'auxiliarMultiplicacion') {
            if (/^[0-9]$/.test(event.key)) {
                //inputText.text = event.key;
                cajaTexto.text = event.key

                if (comprobarMultiplicacionParcialCorrecta()) {
                    //auxInputBackground.setFillStyle()
                    //Poner linea separadora para la resta
                    dibujarLineaResta(context, baseCoordinates.initialX + indicePosicionLineaResta * 30, baseCoordinates.initialY + posicionLineaRestaEjeY, determinarDigitosASeparar(dividendo, divisor) * 37)
                    // Posicion en el eje y que incrementa para posicionar la siguiente linea de resta
                    posicionLineaRestaEjeY += 95
                    indicePosicionLineaResta++;

                    ponerCajasResultadoMultiplicacion();

                    infoBubble.setVisible(false)
                    text.setVisible(false)
                    crearGloboInformacion(context, "A continuacion realiza\n la resta", 500, 100, 500, 60)

                    //
                    auxInputBackground.setFillStyle()
                    //auxInputBackground.off('pointerdown')
                    //auxInputBackground.setInteractive({ cursor: 'default' })
                }
            }

        } else if (auxInputBackground.getData('tipo') == 'auxiliarResta') {
            if (/^[0-9]$/.test(event.key)) {
                //inputText.text = event.key;
                cajaTexto.text = event.key

                console.log('siguienteDigitoDividendo: ' + siguienteDigitoDividendo, 'dividendo: ' + dividendo.toString().length)
                if (comprobarRestaCorrecta() && siguienteDigitoDividendo <= dividendo.toString().length) {
                    pistaBajarSiguienteDigito()

                    infoBubble.setVisible(false)
                    text.setVisible(false)
                    crearGloboInformacion(context, "Ahora baja el digito que te\n indica la flecha", 500, 100, 500, 60)

                    //Ocultar caja negra resta
                    auxInputBackground.setFillStyle()
                }

            }

        } else if (auxInputBackground.getData('tipo') == 'digitoBajado') {
            if (/^[0-9]$/.test(event.key)) {
                //inputText.text = event.key;
                cajaTexto.text = event.key
                //invocar metodo comprobar digito bajado y poner caja cociente

                if (comprobarDigitoBajado(event.key)) {
                    dividendoParcialGlobal = dividendoParcialGlobal.toString() + event.key
                    console.log('nuevo dividendo parcial global: ' + dividendoParcialGlobal)
                    //poner caja cociente
                    crearCajaTexto(context, baseCoordinates.initialX + numeroCajaCociente * 40 + dividendo.toString().length * 40 + 40, baseCoordinates.initialY + 30, 30, 30, 'cociente')
                    indiceFilasX++;
                    // incrementa el indice para indicar que puso uno nueva caja en el cociente
                    numeroCajaCociente++;
                    //ocultar flecha de la pista del numero a bajar
                    ocultarFlechasPistaBajarNumero()

                    //
                    infoBubble.setVisible(false)
                    text.setVisible(false)
                    crearGloboInformacion(context, "Continua completando\n el cociente", 500, 100, 500, 60)

                    //Oculta caja negra digito bajado
                    auxInputBackground.setFillStyle()
                }
            }

        }

    }

    // Listen for pointerdown event globally
    /*context.input.on('pointerdown', function (pointer) {
        if (!inputBackground.getBounds().contains(pointer.x, pointer.y)) {
            // Click was outside the button
            console.log("Clicked outside the button");
            //inputBackground.setFillStyle(0x000000)
            // Remove keyboard event listeners when the pointer is released
            context.input.keyboard.off('keydown');
            context.input.keyboard.off('textInput', handleTextInput, context);
 
        }
    });*/

    // Tween to animate the creation
    context.tweens.add({
        targets: inputBackground,
        x: posX, // Target x position
        duration: 500, // Animation duration in milliseconds
        ease: 'Linear',
        onUpdate: function (tween, target) {
            // Clear the graphics before redrawing
            //inputBackground.setClear();

            // Draw the updated state
            //inputBackground.setFillStyle(0x00ff00);
            //inputBackground.fillRect(posX, posY, width, height);
        },
        onComplete: function () {
            inputText = context.add.text(inputBackground.x - 8, inputBackground.y - 13, '', { fontSize: '32px', color: "white" }).setData('index', "texto" + inputBackground.getData('index'));
            inputText.setName("texto" + index)
            //console.log(index)
        }
    });
}

function crearGloboInformacion(context, information, posX, posY, width, height, operacionAdicional) {
    const animationMovementX = 100;
    // Create a rectangle representing the information bubble
    infoBubble = context.add.graphics();
    infoBubble.fillStyle(0xffffff).fillRoundedRect(posX, posY, width, height, 20).setInteractive();
    // Draw the speech bubble pointer
    infoBubble.lineStyle(2, 0xffffff); // White outline
    infoBubble.beginPath();
    infoBubble.moveTo(posX + width / 2 - 10, posY + height); // Start at the bottom center
    infoBubble.lineTo(posX + width / 2 + 10, posY + height); // Draw a line to the right
    infoBubble.lineTo(posX + width / 2 + 20, posY + height + 30); // Draw a line back to the bottom center
    infoBubble.closePath();
    infoBubble.fillPath(0xffffff); // Fill the pointer with white color
    //console.log(infoBubble.width)
    infoBubble.setVisible(true)

    text = context.add.text(posX, posY, information, { fill: '#000000', fontSize: 28 });
    text.setVisible(true)
    //text.setOrigin(0.5)

    //Create the X on the top left corner
    closeButton = context.add.text(posX + width + animationMovementX - 20, posY, 'x', { fill: 'black', fontSize: 28 })
        .setInteractive({ cursor: 'pointer' })
    closeButton.on('pointerdown', function () {
        group.setVisible(false)
        createInfoButton()
    });

    // Handle hover effect
    closeButton.on('pointerover', function () {
        closeButton.setScale(1.2); // Increase size by 20%
    });
    closeButton.on('pointerout', function () {
        closeButton.setScale(1); // Reset to original size
    });

    group = context.add.group(); // Create a Phaser group
    group.addMultiple([infoBubble, text, closeButton]); // Add both the infoBubble and text to the group

    // Animate the group to move to the left
    context.tweens.add({
        targets: infoBubble, // Target the entire group
        x: animationMovementX, // Move to the left on the x-axis
        ease: 'Cubic.InOut',
        duration: 1000,
        onUpdate: function () {
            // Update the position of the text relative to the group
            text.x = infoBubble.x + posX + 20
        },
        onComplete: function () {
            if (operacionAdicional) {
                operacionAdicional();
            }
        }
    });
}

// metodo que devuelve la cantidad de digitos iniciales que se deben separar del dividendo
function determinarDigitosASeparar(dividendo, divisor) {
    // Convertir los números a cadenas para facilitar la manipulación de dígitos
    const dividendoStr = dividendo.toString();
    const divisorStr = divisor.toString();

    // Obtener la longitud de los dígitos en el divisor
    const longitudDivisor = divisorStr.length;

    // Verificar si el dividendo tiene más dígitos que el divisor
    if (dividendoStr.length <= longitudDivisor) {
        // Si el dividendo tiene la misma cantidad o menos dígitos que el divisor,
        // solo necesitas separar el primer dígito.
        return 1;
    } else {
        // Si el dividendo tiene más dígitos que el divisor, necesitas separar
        // suficientes dígitos para que la parte separada sea mayor o igual al divisor.
        let primerosDigitos = Number(dividendoStr.substring(0, longitudDivisor));

        // Incrementar la cantidad de dígitos hasta que la parte separada sea mayor o igual al divisor
        let cantidadDigitos = longitudDivisor;
        while (primerosDigitos < divisor) {
            cantidadDigitos++;
            primerosDigitos = Number(dividendoStr.substring(0, cantidadDigitos));
        }
        return cantidadDigitos;
    }
}
//Pistas
function ejecutarPistaUno(context) {
    const operacionAdicional = function () {
        let posX = baseCoordinates.initialX + 15
        let index = 1
        for (const _ of dividendo.toString()) {
            const arrow = createOtherArrow(context, posX += 40, baseCoordinates.initialY, 0.3)
            //para saber el indice de la flecha
            arrow.setData('index', index)
            arrowGroup.add(arrow)
            index++
        }
    }
    crearGloboInformacion(context, 'Primer paso.\nSepara los\ndigitos necesarios\ndel dividendo', baseCoordinates.initialX, 5, 350, 150, operacionAdicional)
}

function comprobarCocienteParcialCorrecto(dividendoParcial, divisor, inputText) {
    let cocienteParcial = Math.floor(dividendoParcial / divisor)
    return cocienteParcial == parseInt(inputText?.text)
}

function extraerDividendoParcial(dividendoCompleto) {
    return parseInt(dividendoCompleto.toString().substring(0, determinarDigitosASeparar(dividendoCompleto, divisor)))
}

function ponerCajasResta() {
    //poner caja resta auxiliar
    const cantidadDigitosSeparados = dividendoParcialGlobal.toString().length
    // Falta definir en que nivel de x se va a poner
    let posX = baseCoordinates.initialX + siguienteDigitoDividendo * 40

    Array.from({ length: cantidadDigitosSeparados }, (_) => {
        // Your loop body code here
        crearCajaTexto(context, posX -= 40, baseCoordinates.initialY + lineaEspaciadora + indiceColumnasY * 40, 30, 30, 'auxiliarMultiplicacion')
    });
    indiceColumnasY++;
    lineaEspaciadora += 15;
}
//Length corresponde a un digito entero que indica la catidad de digitos a traves de los cuales se va a extender
//la linea
function dibujarLineaResta(context, posX, posY, length) {
    let initialX = posX
    let initialY = posY
    const graphics = context.add.graphics({ fillStyle: { color: 0x0000ff } }).setInteractive()

    // Set line style (2px width, white color)
    graphics.lineStyle(3, 0xffffff, 1);

    // Draw the arrow
    graphics.beginPath();
    graphics.moveTo(initialX, initialY); // Starting point

    // Draw arrow body
    //graphics.lineTo(100, 200);
    graphics.lineTo(initialX + length, initialY);
    // Optional: Draw the outline of the arrow
    graphics.strokePath();
}

//Metodo que comprueba si la multiplicacion puesta en las cajas auxiliares es correcta, 
//del cociente parcial por diviso
function comprobarMultiplicacionParcialCorrecta() {
    let resultadoIngresadoMultiplicacion;
    context.children.getChildren().filter
        (rectangle => rectangle.getData('tipo') === 'auxiliarMultiplicacion').forEach(rectangle => {
            //let cajaIngresoTexto = context.children.getChildren().find(element => element.getData('index') === 'texto' + rectangle.getData('index'))
            resultadoIngresadoMultiplicacion += context.children.getChildren().find(element => element.getData('index') === 'texto' + rectangle.getData('index')).text
            console.log(rectangle)

            //Cambiar identificador a los rectagulos de texto ingresado que ya fueron procesados
            // para que en la siguiente iteracion estos ya no sean considerados
            //rectangle.setData('tipo', 'auxiliarMultiplicacionProcesado')

        });
    resultadoIngresadoMultiplicacion = resultadoIngresadoMultiplicacion.replace('undefined', '').split('').reverse().join('')
    console.log(resultadoIngresadoMultiplicacion + ';' + ultimoDigitoCociente * divisor)

    if (resultadoIngresadoMultiplicacion == ultimoDigitoCociente * divisor) {
        //Cambiar identificador a los rectagulos de texto ingresado que ya fueron procesados
        // para que en la siguiente iteracion estos ya no sean considerados
        context.children.getChildren().filter
            (rectangle => rectangle.getData('tipo') === 'auxiliarMultiplicacion').forEach(rectangle => {
                //let cajaIngresoTexto = context.children.getChildren().find(element => element.getData('index') === 'texto' + rectangle.getData('index'))
                rectangle.setData('tipo', 'auxiliarMultiplicacionProcesada')
                //rectangle.fillColor('orange')
                rectangle.setFillStyle()
            });
        return true;
    } else {
        return false;
    }
}

//Creacion de cajas para el resultado de la resta entre el dividendo parcial y el cociente parcial por divisor
function ponerCajasResultadoMultiplicacion() {
    //poner caja resta auxiliar
    const cantidadDigitosSeparados = determinarDigitosASeparar(dividendo, divisor);
    let posX = baseCoordinates.initialX + siguienteDigitoDividendo * 40

    Array.from({ length: cantidadDigitosSeparados }, (_) => {
        // Your loop body code here
        crearCajaTexto(context, posX -= 40, baseCoordinates.initialY + lineaEspaciadora + indiceColumnasY * 40, 30, 30, 'auxiliarResta')
    });
    //indiceColumnasY++;
}

function comprobarRestaCorrecta() {
    let resultadoResta;
    context.children.getChildren().filter
        (rectangle => rectangle.getData('tipo') === 'auxiliarResta').forEach(rectangle => {
            const input = context.children.getChildren().find(element => element.getData('index') === 'texto' + rectangle.getData('index')).text
            resultadoResta += input
        });
    resultadoResta = resultadoResta.replace('undefined', '').split('').reverse().join('')
    console.log('RR: ' + resultadoResta, 'dividendoParcial:' + dividendoParcialGlobal, 'ultimoDigitoCociente: ' + ultimoDigitoCociente)

    if (resultadoResta == dividendoParcialGlobal - (ultimoDigitoCociente * divisor)) {
        dividendoParcialGlobal = resultadoResta;
        // Cambiar data 'tipo' para que esta caja de ingreso de texto no sea tenida en cuenta en
        //La siguiente comprobacion del resultado de la resta
        context.children.getChildren().filter
            (rectangle => rectangle.getData('tipo') === 'auxiliarResta').forEach(rectangle => {
                rectangle.setData('tipo', 'auxiliarRestaProcesada')
                rectangle.setFillStyle()
            });

        //Incrementar el apuntador al siguiente digito del dividendo que se debera bajar
        //siguienteDigitoDividendo++;
        return true;
    }
    else return false;
}
// Metodo que genera la pista del siguiente digito del dividendo que se debe bajar, poniendo una flecha encima
// e indicando con un globo la pista y poniendo una caja adicional a la derecha del del ultimo residuo
function pistaBajarSiguienteDigito() {
    // Quitar separador de digitos anterior
    context.children.getChildren().find(element => element.getData('index') === determinarDigitosASeparar(dividendo, divisor)).visible = false

    // localizar posicion del digito sobre el que se pondra la flecha y poner flecha
    let flechaPistaBajarDigito = createOtherArrow(context, baseCoordinates.initialX - 5 + 40 * siguienteDigitoDividendo, baseCoordinates.initialY + 50, 0.5, { 'altura': 3 })
    flechaPistaBajarDigito.setData('tipo', 'flechaBajarDigito')

    // crear siguiente caja donde se pondra el digito bajado
    let posX = baseCoordinates.initialX + siguienteDigitoDividendo * 40
    crearCajaTexto(context, posX, baseCoordinates.initialY + lineaEspaciadora + indiceColumnasY * 40, 30, 30, 'digitoBajado')
    indiceColumnasY++
    //poner siguiente globo informativo
}
// Funcion para identificar si el digito que se bajo fue el correcto
function comprobarDigitoBajado(numeroIngresado) {
    let digitoABajar = (dividendo.toString())[siguienteDigitoDividendo - 1]
    console.log(digitoABajar, numeroIngresado)
    if (digitoABajar == numeroIngresado) {
        console.log('Se bajo el digito correcto')
        siguienteDigitoDividendo++;
        return true;
    }
    else { return false }
}

function ocultarFlechasPistaBajarNumero() {
    context.children.getChildren().filter(element => {
        if (element.getData('tipo') === 'flechaBajarDigito') {

            console.log(element)
            element.visible = false
        }
    }).forEach(arrow => {
        arrow.visible = false
    });
}

function moverOjosYSignoInterrogacion() {
    const circle = context.add.graphics();
    const x1 = 1240;
    const y1 = 450;
    const radius = 50;

    circle.fillStyle(0xffffff, 1);
    circle.fillCircle(x1, y1, radius);

    const circle2 = context.add.graphics();
    const x2 = 1370;
    const y2 = 430;
    const radius2 = 50;

    circle2.fillStyle(0xffffff, 1);
    circle2.fillCircle(x2, y2, radius2);

    const circle3 = context.add.graphics();
    const x3 = 1370;
    const y3 = 430;
    const radius3 = 40;

    circle3.fillStyle(0x000000, 1);
    circle3.fillCircle(x3, y3, radius3);

    const circle4 = context.add.graphics();
    const x4 = 1240;
    const y4 = 450;
    const radius4 = 40;

    circle4.fillStyle(0x000000, 1);
    circle4.fillCircle(x4, y4, radius4);

    // Create a tween to move the circle horizontally
    if (true)
        circle4.x = -50;
    const tween = context.tweens.add({
        targets: circle4,
        x: 30, // Final x position
        duration: 800, // Duration of the tween in milliseconds
        ease: 'Linear', // Linear easing for constant speed
        yoyo: true, // Yoyo effect to reverse the tween
        repeat: 1 // Repeat indefinitely
    });

    // Create a tween to move the circle horizontally
    if (true)
        circle3.x = -35;
    const tween2 = context.tweens.add({
        targets: circle3,
        x: 30, // Final x position
        duration: 800, // Duration of the tween in milliseconds
        ease: 'Linear', // Linear easing for constant speed
        yoyo: true, // Yoyo effect to reverse the tween
        repeat: 1 // Repeat indefinitely
    });

    const screenWidth = context.sys.game.config.width;
    const screenHeight = context.sys.game.config.height;

    // Add the background image
    const bg = context.add.image(1200, 0, 'questionMark');

    // Set the scale of the background image to fit the screen
    bg.setScale(0.2);

    // Set the background image origin to the top-left corner
    bg.setOrigin(0, 0);
}

function TransformarFigura() {

}
function resizeBackground() {
    console.log(window.innerWidth, context.sys.game.config.width)

    // Calculate the scale factors to fit the background image to the screen
    let scaleX = window.innerWidth / spritebg.width;
    let scaleY = window.innerHeight / spritebg.height;

    // Set the scale of the background image
    spritebg.setScale(scaleX, scaleY);

}

function createInfoButton() {

    // Create the background rectangle for the info button
    let buttonBackground = context.add.graphics();
    buttonBackground.fillStyle('0x00ff00', 1); // Green color
    buttonBackground.fillRoundedRect(context.sys.game.config.width / 2 - 4, 10, 30, 33, 15); // Adjust position and size as needed

    // Create the "info" button on the top right corner
    infoButton = context.add.text(context.sys.game.config.width / 2, 10, 'i', { fill: '#0000ff', fontSize: '2rem' });
    infoButton.setInteractive({ cursor: 'pointer' });

    // Handle hover effect
    infoButton.on('pointerover', function () {
        infoButton.setScale(1.2)
        //buttonBackground.setScale(1.2)
    });

    infoButton.on('pointerout', function () {
        infoButton.setScale(1); // Reset to original size
    });

    // Handle click to show the group
    infoButton.on('pointerdown', function () {
        group.setVisible(true); // Show the group of information
        infoButton.setVisible(false)
        buttonBackground.setVisible(false)
    });
}
