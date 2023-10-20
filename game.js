// Queries
const gameBoardContainer = document.querySelector(".game-board");
const msgContainer = document.querySelector(".msg");

// Globals
const ROWS = 6,
  COLUMNS = 7;

let rowsOnEachColumn = [5, 5, 5, 5, 5, 5, 5];
let gameBoardState = [];
let numberOfEmptyTiles = ROWS * COLUMNS;

const redPlayer = {
  name: "red",
  backgroundColor: "var(--red-color)",
  msg: "Red Player Turn",
  turnInfo: document.querySelector(".players .red"),
  score: 0,
};

const yellowPlayer = {
  name: "yellow",
  backgroundColor: "var(--yellow-color)",
  msg: "Yellow Player Turn",
  turnInfo: document.querySelector(".players .yellow"),
  score: 0,
};

let playerTurn = redPlayer;

// Event Listeners
window.addEventListener("DOMContentLoaded", initGame);
gameBoardContainer.addEventListener("click", playGame);

function initGame() {
  // Create tiles inside game board container
  createTiles();

  // Player Info Set up
  playerTurn.turnInfo.classList.toggle("turn");
  playerTurn.turnInfo.innerHTML = playerTurn.score;
  msgContainer.classList.add(`${playerTurn.name}-turn`);
  msgContainer.innerHTML = playerTurn.msg;
}

function createTiles() {
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLUMNS; j++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.id = `${i}X${j}`;
      gameBoardContainer.appendChild(tile);
      row.push("");
    }
    gameBoardState.push(row);
  }
}

function playGame(e) {
  const clickedTile = e.target;

  if (clickedTile.className === "tile") {
    // Extract row and column form id
    const [row, column] = clickedTile.id.split("X").map((elm) => parseInt(elm));
    if (rowsOnEachColumn[column] >= 0) {
      updateGameBoardState(column);
      // play clicking sound
      playSound("click");
    }
  }
}

function updateGameBoardState(column) {
  // update game board state
  gameBoardState[rowsOnEachColumn[column]][column] = playerTurn.name;
  const chosenTile = document.getElementById(
    `${rowsOnEachColumn[column]}X${column}`
  );
  // Update game board UI
  chosenTile.style.backgroundColor = playerTurn.backgroundColor;

  // Decrease number rows
  rowsOnEachColumn[column]--;
  // Decrease number of empty tiles
  numberOfEmptyTiles--;
  
  // Check for win
  if (checkForWin()) {
    // block user from playing
    gameBoardContainer.classList.add("block-clicking");
    // update Player info For winner
    playerTurn.score++;
    playerTurn.turnInfo.innerHTML = playerTurn.score;
    msgContainer.innerHTML = `${playerTurn.name.toUpperCase()} Player Won`;
    msgContainer.classList.add("won");
    // play wining sound
    playSound("win");
    // Reset Game
    resetGame();
  } else {
    // update player info
    updatePlayerInfo();
  }
  
  // Check if there is a draw
  if (numberOfEmptyTiles <= 0) {
    msgContainer.className = "msg";
    msgContainer.innerHTML = "Draw!";
    // play draw sound
    playSound("draw");
    resetGame();
  }
}
function checkForWin() {
  // horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS - 3; c++) {
      if (checkTiles("horizontal", r, c)) {
        showWinnerTiles("horizontal", r, c);
        return true;
      }
    }
  }

  // Vertically
  for (let c = 0; c < COLUMNS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (checkTiles("vertical", r, c)) {
        showWinnerTiles("vertical", r, c);
        return true;
      }
    }
  }

  // Leading Diagonal
  for (let c = 0; c < COLUMNS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (checkTiles("leading-diagonal", r, c)) {
        showWinnerTiles("leading-diagonal", r, c);
        return true;
      }
    }
  }

  // anti-diagonal
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS - 3; c++) {
      if (checkTiles("anti-diagonal", r, c)) {
        showWinnerTiles("anti-diagonal", r, c);
        return true;
      }
    }
  }

  return false;
}

function checkTiles(dir, r, c) {
  switch (dir) {
    case "horizontal":
      return (
        gameBoardState[r][c] !== "" &&
        gameBoardState[r][c] === gameBoardState[r][c + 1] &&
        gameBoardState[r][c + 1] === gameBoardState[r][c + 2] &&
        gameBoardState[r][c + 2] === gameBoardState[r][c + 3]
      );

    case "vertical":
      return (
        gameBoardState[r][c] !== "" &&
        gameBoardState[r][c] === gameBoardState[r + 1][c] &&
        gameBoardState[r + 1][c] === gameBoardState[r + 2][c] &&
        gameBoardState[r + 2][c] === gameBoardState[r + 3][c]
      );

    case "leading-diagonal":
      return (
        gameBoardState[r][c] !== "" &&
        gameBoardState[r][c] === gameBoardState[r + 1][c + 1] &&
        gameBoardState[r + 1][c + 1] === gameBoardState[r + 2][c + 2] &&
        gameBoardState[r + 2][c + 2] === gameBoardState[r + 3][c + 3]
      );

    case "anti-diagonal":
      return (
        gameBoardState[r][c] !== "" &&
        gameBoardState[r][c] === gameBoardState[r - 1][c + 1] &&
        gameBoardState[r - 1][c + 1] === gameBoardState[r - 2][c + 2] &&
        gameBoardState[r - 2][c + 2] === gameBoardState[r - 3][c + 3]
      );

    default:
      break;
  }
}

function showWinnerTiles(dir, r, c) {
  switch (dir) {
    case "horizontal":
      for (let k = 0; k < 4; k++) {
        document.getElementById(`${r}X${c + k}`).style.borderColor = "black";
      }
      break;
    case "vertical":
      for (let k = 0; k < 4; k++) {
        document.getElementById(`${r + k}X${c}`).style.borderColor = "black";
      }
      break;

    case "leading-diagonal":
      for (let k = 0; k < 4; k++) {
        document.getElementById(`${r + k}X${c + k}`).style.borderColor =
          "black";
      }
      break;

    case "anti-diagonal":
      for (let k = 0; k < 4; k++) {
        document.getElementById(`${r - k}X${c + k}`).style.borderColor =
          "black";
      }
      break;
    default:
      break;
  }
}

function updatePlayerInfo() {
  playerTurn.turnInfo.classList.toggle("turn");
  msgContainer.classList.toggle("red-turn");
  msgContainer.classList.toggle("yellow-turn");
  if (playerTurn.name === "red") {
    playerTurn = yellowPlayer;
  } else {
    playerTurn = redPlayer;
  }
  msgContainer.innerHTML = playerTurn.msg;
  playerTurn.turnInfo.classList.toggle("turn");
}

function resetGame() {
  // after 2 second
  setTimeout(() => {
    msgContainer.className = "msg";
    msgContainer.innerHTML = "Another Round Will begin...";
  }, 2000);

  // after 3 seconds
  setTimeout(() => {
    msgContainer.className = `msg ${playerTurn.name}-turn`;
    msgContainer.innerHTML = playerTurn.msg;
    // Clear Board Container
    gameBoardContainer.innerHTML = "";
    // reset game board state
    gameBoardState = [];
    rowsOnEachColumn = [5, 5, 5, 5, 5, 5, 5];
    numberOfEmptyTiles = ROWS * COLUMNS;
    // Create tiles inside game board container
    createTiles();
    // Allow user to play again
    gameBoardContainer.classList.remove("block-clicking");
  }, 5000);
}

function playSound(fileName) {
  const audio = new Audio(`./sounds/${fileName}.wav`);
  audio.play();
}
