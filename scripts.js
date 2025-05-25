const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("resetBtn");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function initializeGame() {
  cells.forEach((cell) =>
    cell.addEventListener("click", handleCellClick)
  );
  resetButton.addEventListener("click", handleResetGame);
  updateStatus(`Your turn: ${currentPlayer}`);
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-index")
  );

  if (
    gameBoard[clickedCellIndex] !== "" ||
    !gameActive ||
    currentPlayer === "O"
  ) {
    return;
  }

  makeMove(clickedCellIndex, "X");
}

function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  checkGameResult();
}

function checkGameResult() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameBoard[winCondition[0]];
    let b = gameBoard[winCondition[1]];
    let c = gameBoard[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    updateStatus(`Player ${currentPlayer} has won!`);
    gameActive = false;
    return;
  }

  let roundDraw = !gameBoard.includes("");
  if (roundDraw) {
    updateStatus("Game ended in a draw!");
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Your turn: ${currentPlayer}`);

  if (currentPlayer === "O" && gameActive) {
    setTimeout(makeAIMove, 700);
  }
}

function makeAIMove() {
  let bestMove = -1;
  let availableMoves = [];

  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === "") {
      availableMoves.push(i);
    }
  }

  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    gameBoard[move] = "O";
    if (checkWin("O")) {
      bestMove = move;
      gameBoard[move] = "";
      break;
    }
    gameBoard[move] = "";
  }

  if (bestMove === -1) {
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      gameBoard[move] = "X";
      if (checkWin("X")) {
        bestMove = move;
        gameBoard[move] = "";
        break;
      }
      gameBoard[move] = "";
    }
  }

  if (bestMove === -1 && gameBoard[4] === "") {
    bestMove = 4;
  }

  if (bestMove === -1) {
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
      const corner = corners[i];
      if (gameBoard[corner] === "") {
        bestMove = corner;
        break;
      }
    }
  }

  if (bestMove === -1 && availableMoves.length > 0) {
    bestMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (bestMove !== -1) {
    makeMove(bestMove, "O");
  }
}

function checkWin(player) {
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameBoard[winCondition[0]];
    let b = gameBoard[winCondition[1]];
    let c = gameBoard[winCondition[2]];

    if (a === player && b === player && c === player) {
      return true;
    }
  }
  return false;
}

function updateStatus(message) {
  statusDisplay.textContent = message;
}

function handleResetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  updateStatus(`Your turn: ${currentPlayer}`);

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
}

initializeGame();
