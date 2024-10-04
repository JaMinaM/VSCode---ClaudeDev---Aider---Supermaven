const BOARD_SIZE = 10;
const NUM_MINES = 15;

let board = [];
let gameOver = false;

function createBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  board = [];
  gameOver = false;

  // Create empty board
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = {
        isMine: false,
        revealed: false,
        neighborMines: 0,
      };
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", () => revealCell(i, j));
      gameBoard.appendChild(cell);
    }
  }

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < NUM_MINES) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (!board[i][j].isMine) {
        board[i][j].neighborMines = countNeighborMines(i, j);
      }
    }
  }
}

function countNeighborMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE
      ) {
        if (board[newRow][newCol].isMine) {
          count++;
        }
      }
    }
  }
  return count;
}

function revealCell(row, col) {
  if (gameOver || board[row][col].revealed) return;

  board[row][col].revealed = true;
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add("revealed");

  if (board[row][col].isMine) {
    cell.classList.add("mine");
    cell.textContent = "💣";
    gameOver = true;
    alert("Game Over! You hit a mine.");
  } else {
    const neighborMines = board[row][col].neighborMines;
    if (neighborMines > 0) {
      cell.textContent = neighborMines;
    } else {
      // Reveal neighboring cells if no adjacent mines
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (
            newRow >= 0 &&
            newRow < BOARD_SIZE &&
            newCol >= 0 &&
            newCol < BOARD_SIZE
          ) {
            revealCell(newRow, newCol);
          }
        }
      }
    }
  }

  checkWin();
}

function checkWin() {
  let revealedCount = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j].revealed) {
        revealedCount++;
      }
    }
  }
  if (revealedCount === BOARD_SIZE * BOARD_SIZE - NUM_MINES) {
    gameOver = true;
    alert("Congratulations! You won!");
  }
}

document.getElementById("new-game-btn").addEventListener("click", createBoard);

// Initialize the game
createBoard();
