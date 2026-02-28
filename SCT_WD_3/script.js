const board = document.getElementById("board");
const turnIndicator = document.getElementById("turnIndicator");
const modal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");

let currentPlayer = "X";
let gameActive = true;
let mode = "player";
let scores = { X: 0, O: 0, draw: 0 };
let cells = [];

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(index) {
  if (!gameActive || cells[index].textContent !== "") return;

  cells[index].textContent = currentPlayer;

  if (checkWinner()) {
    gameActive = false;
    scores[currentPlayer]++;
    updateScore();
    showResult(`Player ${currentPlayer} Wins!`);
    return;
  }

  if (cells.every(cell => cell.textContent !== "")) {
    gameActive = false;
    scores.draw++;
    document.getElementById("drawScore").textContent = scores.draw;
    showResult("It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;

  if (mode === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let empty = cells
    .map((cell, i) => cell.textContent === "" ? i : null)
    .filter(v => v !== null);

  if (empty.length === 0) return;

  let randomIndex = empty[Math.floor(Math.random() * empty.length)];
  handleClick(randomIndex);
}

function checkWinner() {
  for (let condition of winConditions) {
    const [a,b,c] = condition;

    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  document.getElementById("xScore").textContent = scores.X;
  document.getElementById("oScore").textContent = scores.O;
}

function showResult(message) {
  if (modal && resultText) {
    resultText.textContent = message;
    modal.style.display = "flex";
  }
}

function restartGame() {
  currentPlayer = "X";
  gameActive = true;

  if (modal) modal.style.display = "none";

  turnIndicator.textContent = "Player X's Turn";

  createBoard();
}

function setMode(selectedMode) {
  mode = selectedMode;
  restartGame();
}

createBoard();
turnIndicator.textContent = "Player X's Turn";