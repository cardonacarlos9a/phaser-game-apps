function createFractionOperation() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function simplifyFraction(numerator, denominator) {
        function gcd(a, b) {
            return b === 0 ? a : gcd(b, a % b);
        }
        let commonDivisor = gcd(numerator, denominator);
        return [numerator / commonDivisor, denominator / commonDivisor];
    }

    let num1 = getRandomInt(1, 9);
    let den1 = getRandomInt(2, 9);
    let num2 = getRandomInt(1, 9);
    let den2 = getRandomInt(2, 9);

    let operation = Math.random() < 0.5 ? '+' : '-';

    let commonDenominator = den1 * den2;
    let adjustedNum1 = num1 * den2;
    let adjustedNum2 = num2 * den1;

    let resultNum = operation === '+' ? adjustedNum1 + adjustedNum2 : adjustedNum1 - adjustedNum2;
    let resultDen = commonDenominator;

    let [simplifiedNum, simplifiedDen] = simplifyFraction(resultNum, resultDen);

    let correctAnswer = `${simplifiedNum}/${simplifiedDen}`;

    let options = new Set([correctAnswer]);
    while (options.size < 4) {
        let randNum = getRandomInt(1, 9);
        let randDen = getRandomInt(2, 9);
        let fakeAnswer = `${randNum}/${randDen}`;
        options.add(fakeAnswer);
    }

    let optionArray = Array.from(options);
    optionArray.sort(() => Math.random() - 0.5);

    let correctOption = optionArray.indexOf(correctAnswer);

    return {
        statement: `
            <p style="text-align: center;">Solve this fraction!</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <span style="display: inline-block; text-align: center;">
                    <span style="display: block; border-bottom: 1px solid black;">${num1}</span>
                    <span style="display: block;">${den1}</span>
                </span>
                <span style="font-size: 24px; line-height: 1;">${operation}</span>
                <span style="display: inline-block; text-align: center;">
                    <span style="display: block; border-bottom: 1px solid black;">${num2}</span>
                    <span style="display: block;">${den2}</span>
                </span>
            </div>`,//String
        interactiveContent: '',
        options: optionArray, //Array
        correctAnswer //String
    };
}

function createPercentageOperation() {
    let cantidadPropuesta, porcentajeEquivalente, cantidadCorrecta;
    // Function to generate and display the exercise
    while (true) {
        porcentajeEquivalente = Math.floor(Math.random() * 100) + 1;
        cantidadCorrecta = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
        cantidadPropuesta = (porcentajeEquivalente * cantidadCorrecta) / 100;

        if (Number.isInteger(cantidadPropuesta) && Number.isInteger(cantidadCorrecta - cantidadPropuesta) && cantidadPropuesta > 0 && cantidadPropuesta <= cantidadCorrecta) {
            break;
        }
    }
    //generated = true
    // }
    const planteamiento = `Si ${cantidadPropuesta} estudiantes equivalen al ${porcentajeEquivalente}% del curso, ¿cuántos estudiantes hay en total?`;
    const respuestaCorrecta = cantidadCorrecta;
    const opciones = [respuestaCorrecta];

    while (opciones.length < 4) {
        const variacion = Math.floor(Math.random() * (respuestaCorrecta * 0.4)) - (respuestaCorrecta * 0.2);
        const opcionIncorrecta = respuestaCorrecta + variacion;
        if (opcionIncorrecta > 0 && opcionIncorrecta !== respuestaCorrecta && !opciones.includes(opcionIncorrecta)) {
            opciones.push(opcionIncorrecta);
        }
    }
    opciones.sort((a, b) => a - b);

    return {
        statement: planteamiento, //string
        interactiveContent: '',
        options: opciones, // Array
        correctAnswer: respuestaCorrecta //string
    };
}

function recorridoEsquinas() {
    //Create a random number of corners
    const timeFromCornerToAnother = Math.floor(Math.random() * 4) + 10; // Random number between 2 and 5
    const options = [timeFromCornerToAnother * 3, timeFromCornerToAnother + 5, timeFromCornerToAnother + 10, timeFromCornerToAnother + 15];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return {
        statement: `<img style="width:95%" src="exercise1.png" alt="Description of your GIF">
        <h4>Él demora ${timeFromCornerToAnother} minutos en ir de una esquina a la siguiente. ¿Cuántos minutos demora en ir desde su casa a la casa de su tía?</h4>`,
        interactiveContent: '',
        options: shuffledOptions,
        correctAnswer: timeFromCornerToAnother * 3,
    };
}

function createDecimalOperation() {
    function getRandomDecimal(min, max, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return +(Math.random() * (max - min) + min).toFixed(decimals);
    }

    // Generate two random decimal numbers
    const num1 = getRandomDecimal(1, 10, Math.random() < 0.5 ? 1 : 2);
    const num2 = getRandomDecimal(1, 10, Math.random() < 0.5 ? 1 : 2);

    const operation = Math.random() < 0.5 ? '+' : '-';

    // Calculate correct result and round to 2 decimals
    const result = operation === '+' ? num1 + num2 : num1 - num2;
    const correctAnswer = result.toFixed(2);

    // Generate fake options
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        const offset = getRandomDecimal(0.1, 1.5, 2);
        let fake = operation === '+'
            ? (result + offset * (Math.random() < 0.5 ? -1 : 1)).toFixed(2)
            : (result + offset * (Math.random() < 0.5 ? -1 : 1)).toFixed(2);

        if (fake !== correctAnswer) options.add(fake);
    }

    const optionArray = Array.from(options);
    optionArray.sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p style="text-align: center;">Solve this decimal operation:</p>
            <p style="text-align: center; font-size: 24px;">
                ${num1} ${operation} ${num2}
            </p>
        `,
        interactiveContent: '',
        options: optionArray,
        correctAnswer
    };
}

function createFractionBarExercise() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function simplifyFraction(numerator, denominator) {
        function gcd(a, b) {
            return b === 0 ? a : gcd(b, a % b);
        }
        let commonDivisor = gcd(numerator, denominator);
        return [numerator / commonDivisor, denominator / commonDivisor];
    }

    let den1 = getRandomInt(2, 5);
    let num1 = getRandomInt(1, den1 - 1);

    let den2 = getRandomInt(2, 5);
    let num2 = getRandomInt(1, den2 - 1);

    let operation = Math.random() < 0.5 ? '+' : '-';

    // Calculate using a common denominator
    let commonDenominator = den1 * den2;
    let adjustedNum1 = num1 * den2;
    let adjustedNum2 = num2 * den1;

    let resultNum = operation === '+' ? adjustedNum1 + adjustedNum2 : adjustedNum1 - adjustedNum2;
    let resultDen = commonDenominator;

    let [simplifiedNum, simplifiedDen] = simplifyFraction(resultNum, resultDen);
    let correctAnswer = `${simplifiedNum}/${simplifiedDen}`;

    // Options
    let options = new Set([correctAnswer]);
    while (options.size < 4) {
        let randNum = getRandomInt(1, 9);
        let randDen = getRandomInt(randNum + 1, 10);
        options.add(`${randNum}/${randDen}`);
    }

    let optionArray = Array.from(options);
    optionArray.sort(() => Math.random() - 0.5);

    // Fraction bar HTML generator
    function generateFractionBar(numerator, denominator, color) {
        let cells = '';
        for (let i = 0; i < denominator; i++) {
            cells += `<div style="flex: 1; height: 20px; margin: 1px; background-color: ${i < numerator ? color : '#eee'};"></div>`;
        }
        return `<div style="display: flex; width: 200px; border: 1px solid #000; margin-bottom: 8px;">${cells}</div>`;
    }

    const statement = `
        <p style="text-align:center">Solve the operation with the fraction bars!</p>
        <div style="text-align:center">
            <div>${num1}/${den1}</div>
            ${generateFractionBar(num1, den1, '#66bb6a')}
            <div style="font-size: 24px; margin: 8px 0;">${operation}</div>
            <div>${num2}/${den2}</div>
            ${generateFractionBar(num2, den2, '#42a5f5')}
        </div>
    `;

    return {
        statement,
        interactiveContent: '', // You could later add bar animations or drawing here
        options: optionArray,
        correctAnswer
    };
}

function createLogicalComparisonExercise() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const types = ['integer', 'decimal', 'fraction'];
    const selectedType = types[getRandomInt(0, types.length - 1)];

    let valueA, valueB, displayA, displayB;

    if (selectedType === 'integer') {
        valueA = getRandomInt(1, 20);
        valueB = getRandomInt(1, 20);
        displayA = valueA;
        displayB = valueB;
    } else if (selectedType === 'decimal') {
        valueA = parseFloat((Math.random() * 10).toFixed(2));
        valueB = parseFloat((Math.random() * 10).toFixed(2));
        displayA = valueA.toFixed(2);
        displayB = valueB.toFixed(2);
    } else {
        // fraction comparison
        let num1 = getRandomInt(1, 9), den1 = getRandomInt(2, 10);
        let num2 = getRandomInt(1, 9), den2 = getRandomInt(2, 10);

        valueA = num1 / den1;
        valueB = num2 / den2;
        displayA = `<div style="text-align: center;"><span style="border-bottom: 1px solid black;">${num1}</span><br>${den1}</div>`;
        displayB = `<div style="text-align: center;"><span style="border-bottom: 1px solid black;">${num2}</span><br>${den2}</div>`;
    }

    let correctAnswer;
    if (Math.abs(valueA - valueB) < 0.01) {
        correctAnswer = "They are equal";
    } else if (valueA > valueB) {
        correctAnswer = "A is greater";
    } else {
        correctAnswer = "B is greater";
    }

    const options = ["A is greater", "B is greater", "They are equal"];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    const statement = `
        <p style="text-align: center;">Compare the two values and choose the correct answer:</p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 2rem; font-size: 24px;">
            <div><strong>A</strong><br>${displayA}</div>
            <div><strong>B</strong><br>${displayB}</div>
        </div>
    `;

    return {
        statement,
        interactiveContent: '',
        options: shuffledOptions,
        correctAnswer
    };
}

function createBoxPackingExercise() {
    function getRandomTotalCookies(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const totalCookies = getRandomTotalCookies(60, 150); // total cookies to pack
    const minCookiesPerBox = 2;
    const maxCookiesPerBox = 20;

    const validBoxSizes = [];
    for (let i = minCookiesPerBox; i <= maxCookiesPerBox; i++) {
        if (totalCookies % i === 0) {
            validBoxSizes.push(i);
        }
    }

    const correctAnswer = validBoxSizes.length;

    // Generate 3 fake answers within range ±3 of the real answer
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        let fake = correctAnswer + Math.floor(Math.random() * 7) - 3;
        if (fake >= 0 && fake !== correctAnswer) options.add(fake);
    }

    const optionArray = Array.from(options).sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p style="text-align: center;">🎉 Real-World Math: Box Packing!</p>
            <p style="text-align: center;">There are <strong>${totalCookies}</strong> cookies to pack for a party.</p>
            <p style="text-align: center;">Each box must have <strong>more than 1</strong> and <strong>less than 20</strong> cookies.</p>
            <p style="text-align: center;">How many different box sizes could Santi choose so that there are <strong>no cookies left over</strong>?</p>
        `,
        interactiveContent: '',
        options: optionArray,
        correctAnswer: correctAnswer.toString()
    };
}

function createPositionalValueExercise() {
    function getRandomDigit(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Create a number with both integer and decimal parts
    const intPart = `${getRandomDigit(1, 9)}${getRandomDigit(0, 9)}${getRandomDigit(0, 9)}`; // e.g., "473"
    const decimalPart = `${getRandomDigit(0, 9)}${getRandomDigit(0, 9)}${getRandomDigit(0, 9)}`; // e.g., "892"
    const fullNumber = `${intPart}.${decimalPart}`; // "473.892"

    // Randomly choose a digit from the full number
    const fullNumberStr = fullNumber.replace('.', '');
    const digitIndex = getRandomDigit(0, fullNumberStr.length - 1);
    const chosenDigit = fullNumberStr[digitIndex];

    // Determine its place value
    let position;
    if (digitIndex < intPart.length) {
        const power = intPart.length - 1 - digitIndex;
        position = Math.pow(10, power); // 100, 10, 1
    } else {
        const power = digitIndex - intPart.length + 1;
        position = 1 / Math.pow(10, power); // 0.1, 0.01, 0.001
    }

    const correctAnswer = (chosenDigit * position).toString();

    // Generate plausible distractors
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        const variation = getRandomDigit(-3, 3);
        const fakeValue = (chosenDigit * position + variation).toFixed(3);
        if (fakeValue !== correctAnswer && Number(fakeValue) > 0) {
            options.add(fakeValue);
        }
    }

    const optionArray = Array.from(options).sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p style="text-align: center;">📍 Positional Value Challenge</p>
            <p style="text-align: center;">Look at the number <strong>${fullNumber}</strong>.</p>
            <p style="text-align: center;">What is the <strong>value</strong> of the digit <strong>${chosenDigit}</strong> in this number?</p>
        `,
        interactiveContent: '',
        options: optionArray,
        correctAnswer
    };
}

function crearEjercicioDescomposicion() {
    function getRandomDigit(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Crear número entero o decimal aleatorio
    const esDecimal = Math.random() < 0.5;
    const parteEntera = `${getRandomDigit(1, 9)}${getRandomDigit(0, 9)}${getRandomDigit(0, 9)}`; // ej: "407"
    const parteDecimal = `${getRandomDigit(1, 9)}${getRandomDigit(0, 9)}`; // ej: "36"
    const numeroCompleto = esDecimal ? `${parteEntera}.${parteDecimal}` : parteEntera;

    const partes = numeroCompleto.split('.');
    const enteros = partes[0].split('').map((d, i) => {
        const potencia = partes[0].length - 1 - i;
        return `${d} × ${Math.pow(10, potencia)} = ${d * Math.pow(10, potencia)}`;
    });

    const decimales = partes[1]
        ? partes[1].split('').map((d, i) => {
            const potencia = -1 - i;
            return `${d} × 1/${Math.pow(10, -potencia)} = ${d * Math.pow(10, potencia)}`;
        })
        : [];

    const descomposicion = [...enteros, ...decimales];
    const respuestaCorrecta = descomposicion.join(' + ');

    const opciones = new Set([respuestaCorrecta]);
    while (opciones.size < 4) {
        let variacion = respuestaCorrecta
            .split(' + ')
            .map(s => {
                const valor = s.split('=')[1].trim();
                const alterado = (parseFloat(valor) + getRandomDigit(-9, 9)).toFixed(2);
                return alterado;
            })
            .join(' + ');
        opciones.add(variacion);
    }

    const opcionesFinales = Array.from(opciones).sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p style="text-align: center;">✍️ Descompón el número <strong>${numeroCompleto}</strong></p>
            <p style="text-align: center;">Selecciona la opción que representa correctamente la suma del valor posicional de sus dígitos.</p>
        `,
        interactiveContent: '',
        options: opcionesFinales,
        correctAnswer: respuestaCorrecta
    };
}

function createPlaceValueDecompositionWithCards() {
    const number = Math.floor(Math.random() * 9000) + 1000; // Número aleatorio de 4 cifras
    const digits = number.toString().split('').map(Number);
    const placeValues = [1000, 100, 10, 1];

    const decomposition = digits.map((digit, idx) => digit * placeValues[idx]);

    const shuffled = [...decomposition].sort(() => Math.random() - 0.5);

    const cardsHTML = shuffled.map(value => `
        <div draggable="true" class="card" data-value="${value}">
            ${value}
        </div>
    `).join('');

    const dropZonesHTML = decomposition.map(value => `
        <div class="drop-zone" data-expected="${value}"></div>
    `).join('');

    return {
        statement: `
            <p style="text-align: center;">Descompón el número <strong>${number}</strong> usando tarjetas arrastrables.</p>
            <p>Arrastra cada tarjeta a su lugar correcto según el valor posicional.</p>
            <style>
                .card {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #e0e0ff;
                    border: 1px solid #aaa;
                    border-radius: 8px;
                    cursor: grab;
                    margin: 5px;
                    font-weight: bold;
                }

                .drop-zone {
                    display: inline-block;
                    width: 100px;
                    height: 40px;
                    border: 2px dashed #ccc;
                    margin: 5px;
                    vertical-align: top;
                }

                .drop-zone.filled {
                    border-color: green;
                    background-color: #e8ffe8;
                }
            </style>
            <div style="text-align: center; margin: 20px 0;">
                ${cardsHTML}
            </div>
            <div style="text-align: center;">
                ${dropZonesHTML}
            </div>
        `,
        interactiveContent: `
            <script>
                const cards = document.querySelectorAll('.card');
                const dropZones = document.querySelectorAll('.drop-zone');

                cards.forEach(card => {
                    card.addEventListener('dragstart', e => {
                        e.dataTransfer.setData('text/plain', card.dataset.value);
                    });
                });

                dropZones.forEach(zone => {
                    zone.addEventListener('dragover', e => {
                        e.preventDefault();
                    });

                    zone.addEventListener('drop', e => {
                        const value = e.dataTransfer.getData('text/plain');
                        if (zone.dataset.expected === value && !zone.classList.contains('filled')) {
                            zone.textContent = value;
                            zone.classList.add('filled');
                        }
                    });
                });
            </script>
        `,
        options: [], // Not needed in this type of drag-and-drop exercise
        correctAnswer: decomposition.join(' + ') // Para referencia o validación si se necesita
    };
}

function createPatternExercise() {
    const start = Math.floor(Math.random() * 20) + 1;
    const step = Math.floor(Math.random() * 10) + 2;
    const type = Math.random() < 0.5 ? 'add' : 'multiply';

    const sequence = [];
    for (let i = 0; i < 5; i++) {
        if (type === 'add') {
            sequence.push(start + i * step);
        } else {
            sequence.push(start * Math.pow(step, i));
        }
    }

    const correctAnswer = type === 'add'
        ? sequence[sequence.length - 1] + step
        : sequence[sequence.length - 1] * step;

    const fakeOptions = new Set();
    while (fakeOptions.size < 3) {
        const delta = Math.floor(Math.random() * 5 + 1);
        const variation = Math.random() < 0.5 ? -delta : delta;
        const fake = correctAnswer + variation;
        if (fake !== correctAnswer && fake > 0) {
            fakeOptions.add(fake);
        }
    }

    const allOptions = Array.from(fakeOptions);
    allOptions.push(correctAnswer);
    allOptions.sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p><strong>Completa el siguiente patrón numérico:</strong></p>
            <p style="font-size: 1.5rem; text-align: center;">
                ${sequence.join(', ')}, <span style="font-weight: bold;">?</span>
            </p>
            <p>¿Cuál número sigue?</p>
        `,
        options: allOptions.map(n => n.toString()),
        correctAnswer: correctAnswer.toString(),
        interactiveContent: ''
    };
}

function createNumberTongueTwister() {
    const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
    const number = parseInt(digits.join(''));

    const tongueTwister = `Si ${digits[0]} decenas dicen que valen ${digits[0] * 10}, 
y ${digits[1]} centenas que son ${digits[1] * 100}, 
¿cuánto valen todas si las unes con ${digits[2]} unidades 
y ${digits[3]} milésimas?`;

    const correctAnswer = (digits[1] * 100) + (digits[0] * 10) + digits[2] + digits[3] / 1000;
    const correctStr = correctAnswer.toFixed(3);

    const distractors = new Set();
    while (distractors.size < 3) {
        const offset = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 10).toFixed(3);
        const fake = (correctAnswer + parseFloat(offset)).toFixed(3);
        if (fake !== correctStr && parseFloat(fake) > 0) distractors.add(fake);
    }

    const options = Array.from(distractors);
    options.push(correctStr);
    options.sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p><strong>🎙️ Trabalenguas numérico:</strong></p>
            <p style="font-style: italic; font-size: 1.1rem;">${tongueTwister}</p>
            <p><strong>¿Cuál es el valor total?</strong></p>
        `,
        options: options,
        correctAnswer: correctStr,
        interactiveContent: ''
    };
}

function createOperationGroupingExercise() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 10) + 1;

    const correctExpression = `(${a} + ${b}) × ${c}`;
    const correctAnswer = (a + b) * c;

    const distractors = [
        `${a} + (${b} × ${c})`,
        `${a} + ${b} × ${c}`,
        `${a} × (${b} + ${c})`
    ];

    const options = [correctExpression, ...distractors].sort(() => Math.random() - 0.5);

    return {
        statement: `
            <p><strong>🧠 Elige la agrupación que da como resultado <code>${correctAnswer}</code></strong></p>
            <p style="font-size: 1.2rem;">¿Cuál de estas expresiones es correcta?</p>
        `,
        options,
        correctAnswer: correctExpression,
        interactiveContent: ''
    };
}

export const exercices = {
    createFractionOperation,
    createPercentageOperation,
    recorridoEsquinas,
    createDecimalOperation,
    createFractionBarExercise,
    createLogicalComparisonExercise,
    createBoxPackingExercise,
    createPositionalValueExercise,
    crearEjercicioDescomposicion,
    createPlaceValueDecompositionWithCards,
    createPatternExercise,
    createNumberTongueTwister,
    createOperationGroupingExercise,
    counter: 0,
    incorrectCounter: 0,
};