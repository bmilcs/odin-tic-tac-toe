// store gameBoard array within gameBoard object

const GameBoard = (function () {
  const gameBoardArray = ["", "", "", "", "", "", "", "", ""];
  // const gameBoard = ["X", "O", "O", "X", "O", "O", "X", "O", "X"];
  const gameContainer = document.getElementById("game-container");
  const gameBoardElements = render();

  function render() {
    return gameBoardArray.map((value, i) => {
      const div = document.createElement("div");

      div.classList.add("square");
      div.classList.add("enabled");
      div.setAttribute("data-position", i);

      div.addEventListener("click", selectSquare);
      gameContainer.appendChild(div);
      return div;
    });
  }

  function reset() {
    gameBoardArray.forEach((i) => (i = ""));
    gameBoardElements.forEach((square) => {
      square.textContent = "";
      square.classList.remove("x");
      square.classList.remove("o");
      square.classList.add("enabled");
      square.addEventListener("click", selectSquare);
    });
  }

  function selectSquare(e) {
    const element = e.target;

    // disable square
    element.removeEventListener("click", selectSquare);
    element.classList.remove("enabled");

    const player = Game.getPlayersTurn();
    playSquare(player, element);
  }

  function playSquare(player, element) {
    const position = element.dataset.position;

    let marker;
    player === "o" ? (marker = "x") : (marker = "o");

    element.classList.add(marker);
    element.textContent = marker;

    gameBoardArray[position] = marker;
    console.log(gameBoardArray);
  }

  function getGameBoard() {
    return gameBoardArray;
  }

  return {
    render,
    reset,
    getGameBoard,
  };
})();

const Game = (() => {
  let playersTurn = "x";

  function getPlayerDetails() {
    // prompt user for # of players
    // get user 1 & 2's name > create objects via player
    // if 1 player, automatically assign PC to player 2
    // call beginGame()
  }

  function resetScoreboard() {
    // reset player1.score & player 2
    // reset dom elements
  }

  function beginGame() {
    // reset scoreboard
    // set player's turn
    // beginRound()
  }

  function beginRound() {
    // Gameboard.reset()
    // display player X's name
  }

  function checkForWinner() {
    const gameStatus = GameBoard.getGameBoard;
    // check for winning combinations
    // return true if winner exists, false if not
  }

  function getPlayersTurn() {
    playersTurn === "x" ? (playersTurn = "o") : (playersTurn = "x");
  }

  return {
    getPlayersTurn,
  };
})();

// Function Factory:

const playerFactory = (playerName, OX) => {
  const name = playerName;
  const marker = OX;
  const score = 0;
  const getName = () => {
    return name;
  };
  const getScore = () => {
    return score;
  };
  const getMarker = () => {
    return marker;
  };
  return {
    getName,
    getMarker,
    getScore,
  };
};
