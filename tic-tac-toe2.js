const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const cells = document.querySelectorAll(".cell");

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener("click", resetGame);

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (boardState[index] !== "" || !gameActive) return;

    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        statusText.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "O";
    setTimeout(aiMove, 500);
}

function aiMove() {
    if (!gameActive) return;

    let bestMove = minimax(boardState, "O").index;
    boardState[bestMove] = "O";
    cells[bestMove].textContent = "O";

    if (checkWin("O")) {
        statusText.textContent = "AI Wins!";
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
}

function checkWin(player) {
    return winPatterns.some(pattern => 
        pattern.every(index => boardState[index] === player)
    );
}

function resetGame() {
    boardState.fill("");
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "";
    cells.forEach(cell => (cell.textContent = ""));
}

function minimax(newBoard, player) {
    let availableSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);

    if (checkWin("X")) return { score: -10 };
    if (checkWin("O")) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let highestScore = -Infinity;
        moves.forEach(m => {
            if (m.score > highestScore) {
                highestScore = m.score;
                bestMove = m;
            }
        });
    } else {
        let lowestScore = Infinity;
        moves.forEach(m => {
            if (m.score < lowestScore) {
                lowestScore = m.score;
                bestMove = m;
            }
        });
    }

    return bestMove;
}
