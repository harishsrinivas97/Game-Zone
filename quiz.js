const startScreen = document.querySelector(".start-screen");
const quizContainer = document.querySelector(".quiz-container");
const usernameInput = document.getElementById("username");
const categorySelect = document.getElementById("category");
const startButton = document.getElementById("start-btn");
const playerNameDisplay = document.getElementById("player-name");

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let playerName = "";

startButton.addEventListener("click", () => {
    playerName = usernameInput.value.trim();
    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }
    
    playerNameDisplay.innerText = `Player: ${playerName}`;
    startScreen.style.display = "none";
    quizContainer.style.display = "block";
    fetchQuestions(categorySelect.value);
});

async function fetchQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        questions = data.results.map(q => ({
            question: q.question,
            answers: shuffleAnswers([...q.incorrect_answers, q.correct_answer]),
            correctAnswer: q.correct_answer
        }));
        startQuiz();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function shuffleAnswers(answers) {
    return answers
        .map(answer => ({ text: answer, correct: false }))
        .sort(() => Math.random() - 0.5)
        .map(answer => {
            if (answer.text === questions[currentQuestionIndex]?.correctAnswer) {
                answer.correct = true;
            }
            return answer;
        });
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerText = "Next";
    scoreDisplay.innerText = `Score: 0`;
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("answer-btn");
        button.dataset.correct = answer.correct;
        button.addEventListener("click", () => selectAnswer(button, answer.correct, currentQuestion.correctAnswer));
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
}

function selectAnswer(button, correct, correctAnswer) {
    if (correct) {
        button.classList.add("correct"); 
        score++;
    } else {
        button.classList.add("wrong");
    
        Array.from(answerButtons.children).forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    
    Array.from(answerButtons.children).forEach(btn => (btn.disabled = true));
    nextButton.style.display = "block";
    scoreDisplay.innerText = `Score: ${score}`;
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    questionElement.innerHTML = `Quiz Completed! 🎉 <br> Final Score: ${score}/${questions.length}`;
    answerButtons.innerHTML = "";
    nextButton.innerText = "Restart";
    nextButton.style.display = "block";
    nextButton.addEventListener("click", () => location.reload());
}
