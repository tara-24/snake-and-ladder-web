// ---------- helpers ----------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------- DOM ----------
const board = document.getElementById("game-board");
const rollBtn = document.getElementById("roll-btn");
const message = document.getElementById("message");
const turnText = document.getElementById("turn");
const diceBox = document.getElementById("dice-box");

// ---------- game state ----------
let player1Pos = 1;
let player2Pos = 1;
let currentPlayer = 1;

// ---------- snakes & ladders ----------
const snakesAndLadders = {
  4: 14,
  9: 31,
  17: 7,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  54: 34,
  62: 19,
  64: 60,
  71: 91,
  87: 24,
  93: 73,
  95: 75,
  99: 78
};

// ---------- draw board ----------
function drawBoard() {
  board.innerHTML = "";

  for (let i = 100; i >= 1; i--) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = i;

    if (i === player1Pos) {
      const p1 = document.createElement("div");
      p1.className = "player p1";
      cell.appendChild(p1);
    }

    if (i === player2Pos) {
      const p2 = document.createElement("div");
      p2.className = "player p2";
      cell.appendChild(p2);
    }

    board.appendChild(cell);
  }
}

// ---------- move player ----------

  async function movePlayer(player, steps) {
    let position = player === 1 ? player1Pos : player2Pos;

    // 🎯 Move step-by-step (dice movement)
    for (let i = 0; i < steps; i++) {
        if (position < 100) {
            position++;
            if (player === 1) player1Pos = position;
            else player2Pos = position;

            drawBoard();
            await sleep(200);
        }
    }

    // 🐍🪜 Snake or Ladder check
    if (snakesAndLadders[position]) {
        const from = position;
        const to = snakesAndLadders[position];

        message.textContent =
            to > from
                ? `🪜 Ladder at ${from}! Climbing to ${to}`
                : `🐍 Snake at ${from}! Sliding to ${to}`;

        // animate snake / ladder move
        while (position !== to) {
            position += to > position ? 1 : -1;

            if (player === 1) player1Pos = position;
            else player2Pos = position;

            drawBoard();
            await sleep(180);
        }
    }

    // 💾 Save final position
    if (player === 1) player1Pos = position;
    else player2Pos = position;

    // 🏆 Win check
    if (position === 100) {
    message.textContent = `🏆🎉 Player ${player} wins the game! 🎉🏆`;
    rollBtn.disabled = true;
    startConfetti();
}

}


// ---------- roll dice ----------
async function rollDice() {
  rollBtn.disabled = true;

  for (let i = 0; i < 8; i++) {
    diceBox.textContent = Math.floor(Math.random() * 6) + 1;
    await sleep(100);
  }

  const dice = Math.floor(Math.random() * 6) + 1;
  diceBox.textContent = dice;

  message.textContent = `🎲 Player ${currentPlayer} rolled ${dice}`;

  await movePlayer(currentPlayer, dice);

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnText.textContent =
    currentPlayer === 1
      ? "🔵 Player 1's Turn"
      : "🔴 Player 2's Turn";

  rollBtn.disabled = false;
}

// ---------- init ----------
drawBoard();
drawSnakesAndLadders();

rollBtn.addEventListener("click", rollDice);
function drawSnakesAndLadders() {
    const svg = document.getElementById("snakes-ladders");

    svg.innerHTML = `
        <!-- Ladder 9 → 31 -->
        <line x1="110" y1="360" x2="180" y2="250" class="ladder" />
        <line x1="130" y1="360" x2="200" y2="250" class="ladder" />

        <!-- Ladder 20 → 38 -->
        <line x1="40" y1="300" x2="100" y2="200" class="ladder" />
        <line x1="60" y1="300" x2="120" y2="200" class="ladder" />

        <!-- Snake 54 → 34 -->
        <path d="M260 200 C240 260, 280 300, 260 360" class="snake" />

        <!-- Snake 99 → 78 -->
        <path d="M80 40 C60 120, 100 200, 80 260" class="snake" />
    `;
}
function startConfetti() {
    const confetti = document.getElementById("confetti");
    confetti.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";

        piece.style.left = Math.random() * 100 + "vw";
        piece.style.backgroundColor =
            ["red", "blue", "yellow", "green", "purple"]
            [Math.floor(Math.random() * 5)];

        piece.style.animationDelay = Math.random() * 3 + "s";
        confetti.appendChild(piece);
    }
}
