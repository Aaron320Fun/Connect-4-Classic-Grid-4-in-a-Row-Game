const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = "red";
let gameOver = false;
let godMode = false;

const boardDiv = document.getElementById("board");
const statusSpan = document.getElementById("player");
const resetBtn = document.getElementById("reset");

// ADMIN ELEMENTS
const adminLogin = document.getElementById("admin-login");
const adminPanel = document.getElementById("admin-panel");
const adminBtn = document.getElementById("admin-btn");
const adminPass = document.getElementById("admin-pass");
const forceRed = document.getElementById("force-red");
const forceYellow = document.getElementById("force-yellow");
const godModeBtn = document.getElementById("godmode-btn");

function createBoard() {
  boardDiv.innerHTML = "";
  board = [];
  gameOver = false;
  currentPlayer = "red";
  statusSpan.textContent = "Red";

  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
      board[r][c] = null;

      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", handleMove);
      boardDiv.appendChild(cell);
    }
  }
}

function handleMove(e) {
  if (gameOver) return;

  const col = parseInt(e.target.dataset.col);
  const row = parseInt(e.target.dataset.row);

  if (godMode) {
    board[row][col] = currentPlayer;
    updateCell(row, col);
    return;
  }

  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) {
      board[r][col] = currentPlayer;
      updateCell(r, col);

      if (checkWin(r, col)) {
        document.getElementById("status").textContent =
          currentPlayer.toUpperCase() + " wins!";
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      statusSpan.textContent =
        currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
      return;
    }
  }
}

function updateCell(r, c) {
  const cell = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
  cell.classList.add(board[r][c]);
}

function checkWin(row, col) {
  return (
    checkDirection(row, col, 1, 0) ||
    checkDirection(row, col, 0, 1) ||
    checkDirection(row, col, 1, 1) ||
    checkDirection(row, col, 1, -1)
  );
}

function checkDirection(row, col, dr, dc) {
  let count = 1;
  count += countPieces(row, col, dr, dc);
  count += countPieces(row, col, -dr, -dc);
  return count >= 4;
}

function countPieces(row, col, dr, dc) {
  let r = row + dr;
  let c = col + dc;
  let count = 0;

  while (
    r >= 0 &&
    r < ROWS &&
    c >= 0 &&
    c < COLS &&
    board[r][c] === currentPlayer
  ) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

// ADMIN LOGIN
adminBtn.addEventListener("click", () => {
  const pass = adminPass.value.trim();

  if (pass === "admin123") {
    adminPanel.classList.remove("hidden");
    adminLogin.classList.add("hidden");
  } else {
    alert("Wrong password");
  }
});

// ADMIN ACTIONS
forceRed.addEventListener("click", () => {
  document.getElementById("status").textContent = "RED wins!";
  gameOver = true;
});

forceYellow.addEventListener("click", () => {
  document.getElementById("status").textContent = "YELLOW wins!";
  gameOver = true;
});

godModeBtn.addEventListener("click", () => {
  godMode = !godMode;
  godModeBtn.textContent = godMode ? "God Mode: ON" : "God Mode: OFF";
});

resetBtn.addEventListener("click", createBoard);

createBoard();
