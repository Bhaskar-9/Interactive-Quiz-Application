let Questions = [];
let currQuestion = 0;
let score = 0;

const ques = document.getElementById("ques");
const opt = document.getElementById("opt");
const scoreContainer = document.getElementById("score");
const nextBtn = document.getElementById("btn");

// Show loading message initially
ques.innerHTML = `<h5>Please wait... Loading questions.</h5>`;

// Fetch quiz questions
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) throw new Error("Unable to fetch data. Try again later.");

        const data = await response.json();
        Questions = data.results;

        // Load first question after data is fetched
        loadQuestion();
    } catch (error) {
        console.error(error);
        ques.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
    }
}
fetchQuestions();

// Load one question and options
function loadQuestion() {
    if (Questions.length === 0) return;

    let currentQuestion = Questions[currQuestion].question;

    // Clean HTML entities
    currentQuestion = currentQuestion
        .replace(/&quot;/g, `"`)
        .replace(/&#039;/g, `'`)
        .replace(/&amp;/g, "&");

    ques.innerHTML = `<h3>Q${currQuestion + 1}: ${currentQuestion}</h3>`;
    opt.innerHTML = "";

    const correct = Questions[currQuestion].correct_answer;
    const incorrect = Questions[currQuestion].incorrect_answers;
    const options = [correct, ...incorrect].sort(() => Math.random() - 0.5);

    options.forEach((option, index) => {
        const div = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");

        input.type = "radio";
        input.name = "answer";
        input.value = option;
        input.id = `option${index}`;

        label.htmlFor = input.id;
        label.textContent = option;

        div.appendChild(input);
        div.appendChild(label);
        opt.appendChild(div);
    });
}

// Handle next button click
function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
        alert("Please select an answer.");
        return;
    }

    if (selected.value === Questions[currQuestion].correct_answer) {
        score++;
    }

    currQuestion++;

    if (currQuestion < Questions.length) {
        loadQuestion();
    } else {
        showScore();
    }
}

// Display score and answers
function showScore() {
    ques.remove();
    opt.remove();
    nextBtn.remove();

    scoreContainer.innerHTML = `
        <h2>You scored ${score} out of ${Questions.length}</h2>
        <h3>Correct Answers:</h3>
    `;

    Questions.forEach((q, i) => {
        scoreContainer.innerHTML += `<p>${i + 1}. ${q.correct_answer}</p>`;
    });
}
