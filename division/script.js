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
//Grupo de globo de info con texto dentro
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
let posicionLineaRestaEjeY = 72
//Audio incorrecto
let tryAgain
// Get the width and height of the game screen
let screenWidth = 0
let screenHeight = 0
//Some background
var spritebg;

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

function preload() {
    context = this;

    //Initialize screen size
    baseCoordinates.initialX = context.sys.game.config.width / 5;
    baseCoordinates.initialY = context.sys.game.config.height / 3.4;

    this.load.image('bg', 'bg.png');
    //this.load.image('letter-d', 'letter-d.png');
    this.load.image('questionMark', 'questionMark.svg');
    this.load.audio('tryAgain', ['ohno.mp3'])
}

function create() {
    //Initialize vars creation of groups
    group = this.add.group()
    arrowGroup = this.add.group();

    spritebg = this.add.image(0, 0, 'bg').setOrigin(0);
    this.scale.on('resize', resizeBackground, context);

    // posicionar numeros de dividendo y divisor
    positionNumbers(this, dividendo)
    ponerLineaYDivisor(this, divisor)
    //Crear caja informativa y flechas
    ejecutarPistaUno(context)
    tryAgain = this.sound.add('tryAgain')

    // Add CSS to remove border
    document.body.style.margin = '0';
    document.body.style.padding = '0';

}
function update() {
    //update pointer
    //console.log(inputText.text)

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
    const posicionarDividendo = (context, valor, posX, posY) => {
        const button = context.add.text(posX, posY, valor,
            {
                fontSize: '32px', fill: '#fff', backgroundColor: 'transparent',
                color: 'red', cornerRadius: '20px'
            })
        // Set origin to center for proper positioning
        button.setOrigin(0.5, 0.5);
    };
    let posX = context.sys.game.config.width / 5
    let posY = context.sys.game.config.height / 3.4
    for (const char of dividendo.toString()) {
        posicionarDividendo(context, char, posX += 40, posY)
    }
}

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

            //Creacion de caja cociente para ingreso de texto
            crearCajaTexto(context, baseCoordinates.initialX + numeroCajaCociente * 40 + dividendo.toString().length * 40 + 40, baseCoordinates.initialY + 30, 30, 30, 'cociente')

            numeroCajaCociente++;
            graphics.off('pointerover')
            graphics.off('pointerdown')
            //Avanzar el contador para apuntar hacia el siguiente digito del dividendo para bajarlo luego
            siguienteDigitoDividendo = determinarDigitosASeparar(dividendo, divisor) + 1

        } else {
            //Give feedback about incorrect separation of digits
            moverOjosYSignoInterrogacion()
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
    console.log()
    let initialX = context.sys.game.config.width / 5 + dividendo.toString().length * 40 + 40
    let initialY = context.sys.game.config.height / 3.4
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

                    auxInputBackground.setFillStyle()
                    auxInputBackground.off('pointerdown')
                    auxInputBackground.setInteractive({ cursor: 'default' })
                    //ocultar globo anterior y Generar globo de informacion para multiplicacion
                    group.setVisible(false)
                    crearGloboInformacion(context, "Ahora multiplica el numero que encontraste\npor el divisor y lo ubicas en las cajas\n"
                        + "negras para realizar la resta", 500, 100, 500, 100)
                    //Poner cajas resta y estructura
                    ponerCajasResta()
                    context.input.keyboard.off('keydown', handleTextInputChange, context);
                    keyDownEventHandler = false
                    ultimoDigitoCociente = cajaTexto.text
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

                    ponerCajasResultadoMultiplicacion();
                    //Poner linea separadora para la resta
                    dibujarLineaResta(context, baseCoordinates.initialX + indicePosicionLineaResta * 40, baseCoordinates.initialY + posicionLineaRestaEjeY, determinarDigitosASeparar(dividendo, divisor))
                    indicePosicionLineaResta++;
                    // Posicion en el eje y que incrementa para posicionar la siguiente linea de resta
                    posicionLineaRestaEjeY += 85

                }
            }

        } else if (auxInputBackground.getData('tipo') == 'auxiliarResta') {
            if (/^[0-9]$/.test(event.key)) {
                //inputText.text = event.key;
                cajaTexto.text = event.key

                console.log('siguienteDigitoDividendo: ' + siguienteDigitoDividendo, 'dividendo: ' + dividendo.toString().length)
                if (comprobarRestaCorrecta() && siguienteDigitoDividendo <= dividendo.toString().length) {
                    pistaBajarSiguienteDigito()

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
    // Create a rectangle representing the information bubble
    infoBubble = context.add.graphics();
    //infoBubble.fillStyle('transparent').fillRoundedRect(posX, posY, width, height, 3).setInteractive()

    group.add(infoBubble)
    //group.add(text)
    const text = context.add.text(posX, posY + 10, information, { fill: '#000000', backgroundColor: 'white', fontSize: 28 });
    group.add(text)

    // Animar el grupo para que se desplace hacia la izquierda
    context.tweens.add({
        targets: infoBubble,
        x: posX, // Mover hacia la izquierda en el eje x
        ease: 'Cubic.InOut',
        duration: 2000,
        onUpdate: function (tween) {
            // Sincronizar la posición del texto con el grupo
            text.x = infoBubble.x + 550;
        },
        onComplete: function () {
            if (operacionAdicional != null && operacionAdicional != undefined) {
                operacionAdicional()
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
        let posX = context.sys.game.config.width / 5 + 15
        let index = 1
        for (const _ of dividendo.toString()) {
            const arrow = createOtherArrow(context, posX += 40, context.sys.game.config.height / 3.4, 0.3)
            //para saber el indice de la flecha
            arrow.setData('index', index)
            arrowGroup.add(arrow)
            index++
        }
    }
    crearGloboInformacion(context, 'Primer paso.\nSepara los\ndigitos necesarios\ndel dividendo', 200, 50, 200, 80, operacionAdicional)

}
function comprobarCocienteParcialCorrecto(dividendoParcial, divisor, inputText) {
    let cocienteParcial = Math.floor(dividendoParcial / divisor)
    if (cocienteParcial == parseInt(inputText?.text)) {
        return true;
    }
    return false;
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
    graphics.moveTo(initialX, initialY+10); // Starting point

    // Draw arrow body
    //graphics.lineTo(100, 200);
    graphics.lineTo(initialX + 37 * length, initialY+10);
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
    let flechaPistaBajarDigito = createOtherArrow(context, 645 + 40 * siguienteDigitoDividendo, 170, 0.5, { 'altura': 3 })
    flechaPistaBajarDigito.setData('tipo', 'flechaBajarDigito')

    // crear siguiente caja donde se pondra el digito bajado
    let posX = baseCoordinates.initialX +  siguienteDigitoDividendo*40
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
    // Calculate the scale factors to fit the background image to the screen
    let scaleX = window.innerWidth / spritebg.width;
    let scaleY = window.innerHeight / spritebg.height;

    // Set the scale of the background image
    spritebg.setScale(scaleX, scaleY);
}
