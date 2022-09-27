// store gameBoard array within gameBoard object

const GameBoard = (function () {
  let gameBoardArray = ["", "", "", "", "", "", "", "", ""];
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
    // reset array values
    for (let i = 0; i < gameBoardArray.length; i++) {
      gameBoardArray[i] = "";
    }

    // reset gui elements
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
    element.removeEventListener("click", selectSquare);
    element.classList.remove("enabled");

    const player = Game.getPlayersTurn();
    const marker = player.getMarker();

    element.classList.add(marker);
    element.textContent = marker;

    const index = element.dataset.position;
    gameBoardArray[index] = marker;

    Game.isRoundOver(gameBoardArray);
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

const Game = (function () {
  let player1, player2;
  getPlayerDetails();
  let playersTurn = player1;

  function getPlayerDetails() {
    player1 = playerFactory("Bryan", "x");
    player2 = playerFactory("Joe", "o");
    // prompt user for # of players
    // get user 1 & 2's name > create objects via player
    // if 1 player, automatically assign PC to player 2
    // call beginGame()
  }

  function updateScoreboard() {
    // update elements = player1.getScore()
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

  function isRoundOver(arr) {
    const xo = /[xo]/;

    // arr: gameboard
    // 0, 1, 2
    // 3, 4, 5
    // 6, 7, 8

    if (
      // horizontal line wins:
      (arr[0].match(xo) && arr[0] === arr[1] && arr[1] === arr[2]) ||
      (arr[3].match(xo) && arr[3] === arr[4] && arr[4] === arr[5]) ||
      (arr[6].match(xo) && arr[6] === arr[7] && arr[7] === arr[8]) ||
      // vertical line wins:
      (arr[0].match(xo) && arr[0] === arr[3] && arr[3] === arr[6]) ||
      (arr[1].match(xo) && arr[1] === arr[4] && arr[4] === arr[7]) ||
      (arr[2].match(xo) && arr[2] === arr[5] && arr[5] === arr[8]) ||
      // diagonal / X line wins:
      (arr[0].match(xo) && arr[0] === arr[4] && arr[4] === arr[8]) ||
      (arr[6].match(xo) && arr[2] === arr[4] && arr[4] === arr[6])
    ) {
      declareRoundWinner();
    } else {
      togglePlayersTurn();
      // update players turn gui element
    }
  }

  function declareRoundWinner() {
    const winner = getPlayersTurn();
    winner.incrementScore();

    // display victory gui element / modal
    // updateScoreBoard()

    GameBoard.reset();

    // let loser go first in next round
    togglePlayersTurn();

    console.log(GameBoard.getGameBoard());
    console.warn("Winner:", winner.getName());
    console.log(
      player1.getName(),
      player1.getScore(),
      player2.getName(),
      player2.getScore()
    );
  }

  function togglePlayersTurn() {
    playersTurn === player1 ? (playersTurn = player2) : (playersTurn = player1);
  }

  function getPlayersTurn() {
    return playersTurn;
  }

  return {
    getPlayersTurn,
    isRoundOver: isRoundOver,
  };
})();

// Function Factory:

function playerFactory(playerName, OX) {
  const _name = playerName;
  const _marker = OX;
  let _score = 0;

  function incrementScore() {
    _score += 1;
    console.warn(`${_name}'s score updated! now: ${_score}`);
  }

  function getName() {
    return _name;
  }

  function getScore() {
    return _score;
  }

  function getMarker() {
    return _marker;
  }

  return {
    getName,
    getMarker,
    getScore,
    incrementScore,
  };
}
