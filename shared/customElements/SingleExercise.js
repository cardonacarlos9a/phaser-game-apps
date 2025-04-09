import { exercices } from '../../creative/emily/index.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
    section {
        padding:2rem
    }
         .feedback {
            font-size: 20px;
            font-weight: bold;
            margin-left: 10px;
        }

        .correct {
            color: green;
        }

        .incorrect {
            color: red;
        }

        #incorrectCount {
            font-size: 18px;
            font-weight: bold;
            color: red;
            margin-top: 10px;
        }
</style>
<section>   
    <div id="statement">
        <slot id="hola" name="statement"></slot>
        <br>
    </div>

    </br>
    </br>

    <div id="options">
    </div>

    </br>
    </br>

    <div id="correctCount">Correct Responses: 0</div>
    
    </br>
    </br>
    <div id="incorrectCount">Incorrect Responses: 0</div>
</section>

`
export class SingleExercise extends HTMLElement {
    correctMarked = false
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._shadow.append(template.content.cloneNode(true))
    }

    //Statement or prestatement
    createStatement(statement) {
        const statementElement = this._shadow.getElementById("statement");
        statementElement.innerHTML = ""; // Clear previous content
        statementElement.innerHTML = statement
    }
    /**
     * 
     * @param {options} options, array of options to choose from
     * @param {correctOption} correctOption, option that is correct
     */
    createOptions(options, correctOption) {
        const answersDiv = this._shadow.getElementById("options");
        answersDiv.innerHTML = ""; // Clear previous options

        options.forEach((opcion, index) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "question";
            input.value = opcion;
            input.onclick = () => this.checkAnswer(input, correctOption);

            const spanFeedback = document.createElement("span");
            spanFeedback.className = "feedback";

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${String.fromCharCode(65 + index)}. ${opcion} `));
            label.appendChild(spanFeedback);
            answersDiv.appendChild(label);
            answersDiv.appendChild(document.createElement("br"));
        })
    }

    checkAnswer(selectedOption, correctAnswer) {
        let options = document.querySelectorAll('input[name="question"]');
        options.forEach(option => {
            let feedbackSpan = option.parentElement.querySelector(".feedback");
            feedbackSpan.textContent = "";
            feedbackSpan.classList.remove("correct", "incorrect");
        });

        let feedbackSpan = selectedOption.parentElement.querySelector(".feedback");
        if (selectedOption.value == correctAnswer) {
            feedbackSpan.textContent = " ✅";
            feedbackSpan.classList.add("correct");

            this.increaseCorrect()
        } else {
            feedbackSpan.textContent = " ❌";
            feedbackSpan.classList.add("incorrect");

            this.increaseIncorrect()
        }
    }

    //Interactive content
    //Error counter
    //Correct counts-does not count if it was not first try
    //Drawing section

    connectedCallback() {
        const observer = new IntersectionObserver(this._runWhenVisible.bind(this), { threshold: 1.0 });
        observer.observe(this); // Observe this component itself
        this._observer = observer;
        this._isVisible = false;

        // ✅ Listen to global counter updates
        this._handleCounterUpdate = this.updateCounters.bind(this);
        window.addEventListener('counter-updated', this._handleCounterUpdate);

        // Initial display
        this.updateCounters();
    }

    updateCounters() {
        const correctAttempts = this._shadow.getElementById("correctCount");
        correctAttempts.innerHTML = 'Correct responses: ' + exercices.counter;

        const incorrectCount = this._shadow.getElementById("incorrectCount");
        incorrectCount.innerHTML = "Incorrect Attempts: " + exercices.incorrectCounter;
    }

    _runWhenVisible(entries) {
        entries.forEach(entry => {
            if (entry.intersectionRatio === 1 && !this._isVisible) {
                this._isVisible = true;
                console.log("✅ Web component is fully visible. Regenerating exercise.");
                this._generateExercise(); // trigger generation
                this.correctMarked = false // Reset the correctMarked flag
            } else if (entry.intersectionRatio === 0 && this._isVisible) {
                this._isVisible = false;
                console.log("❌ Web component is no longer visible.");
            }
        });
    }

    _generateExercise() {
        const exerciseIdentifier = this.getAttribute('exerciseIdentifier')
        if (!exerciseIdentifier || !exercices[exerciseIdentifier]) {
            console.error('ExerciseIdentifier not provided or does not match an existing operation');
            return;
        }

        const { statement, options, correctAnswer } = exercices[exerciseIdentifier]()
        this.createStatement(statement)
        this.createOptions(options, correctAnswer)
    }

    increaseCorrect() {
        !this.correctMarked && (exercices.counter = exercices.counter + 1)

        const correctAttempts = this._shadow.getElementById("correctCount");
        correctAttempts.innerHTML = 'Correct responses: ' + exercices.counter; // Clear previous content
        this.correctMarked = true
        window.dispatchEvent(new CustomEvent('counter-updated'));

    }

    increaseIncorrect() {
        exercices.incorrectCounter = exercices.incorrectCounter + 1

        let incorrectCount = this._shadow.getElementById("incorrectCount");
        incorrectCount.textContent = "Incorrect Attempts: " + exercices.incorrectCounter;
        window.dispatchEvent(new CustomEvent('counter-updated'));

    }

    disconnectedCallback() {
        if (this._observer) {
            this._observer.disconnect();
        }

        // Remove global listener
        window.removeEventListener('counter-updated', this._handleCounterUpdate);

    }

}



customElements.define('single-exercise', SingleExercise)