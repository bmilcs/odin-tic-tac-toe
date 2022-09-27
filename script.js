// store gameBoard array within gameBoard object

const GameBoard = (function () {
  const gameContainer = document.getElementById("game-container");
  let gameBoardArray = ["", "", "", "", "", "", "", "", ""];
  const gameBoardElements = render();

  function render() {
    return gameBoardArray.map((value, i) => {
      const div = document.createElement("div");
      div.classList.add("square");
      div.setAttribute("data-position", i);
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

    const activePlayer = Game.getActivePlayer();
    const marker = activePlayer.getMarker();

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
  let player1, player2, activePlayer, round;

  getPlayerDetails();
  beginGame();

  function getPlayerDetails() {
    // prompt user for # of players
    // get user 1 & 2's name > create objects via player
    // if 1 player, automatically assign PC to player 2
    player1 = playerFactory("Bryan", "x");
    player2 = playerFactory("Joe", "o");
  }

  function updateScoreboard() {
    // update elements = player1/2.getScore()
    console.log(
      player1.getName(),
      player1.getScore(),
      player2.getName(),
      player2.getScore()
    );
  }

  function resetScores() {
    player1.resetScore();
    player2.resetScore();
    // reset scoreboard dom elements
  }

  function beginGame() {
    activePlayer = player1;
    round = 0;
    beginRound();
  }

  function beginRound() {
    GameBoard.reset();
    round += 1;
    // display player X's name
    console.log(
      `Round ${round} Begins. ${activePlayer.getName()} is up first!`
    );
  }

  function isRoundOver(arr) {
    const xo = /[xo]/;

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
      toggleActivePlayer();
    }
  }

  function declareRoundWinner() {
    const winner = getActivePlayer();
    winner.incrementScore();

    // display victory gui element / modal
    console.warn("Winner:", winner.getName());

    updateScoreboard();

    if (isGameOver()) {
      declareGameWinner();
    } else {
      // let loser go first in next round
      toggleActivePlayer();
      beginRound();
    }
  }

  function isGameOver() {
    if (player1.getScore() === 3 || player2.getScore() === 3) return true;
  }

  function declareGameWinner() {
    let winner;
    player1.getScore() === 3 ? (winner = player1) : (winner = player2);

    // display gui element for winner of 3 round game
    console.warn(`${winner.getName()} is the winner of 3 rounds!`);

    askPlayAgain();
  }

  function toggleActivePlayer() {
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);
    displayActivePlayer();
  }

  function displayActivePlayer() {
    // update gui to show whos turn it is
    console.log(`Turn: ${activePlayer.getName()}`);
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function askPlayAgain() {
    console.log("Would you like to play again?");
    // create gui element to ask if they want to play another round
    // if yes
    resetScores();
    beginGame();
  }

  return {
    getActivePlayer,
    isRoundOver,
  };
})();

// Function Factory:

function playerFactory(playerName, OX) {
  const _name = playerName;
  const _marker = OX;
  let _score = 0;

  function incrementScore() {
    _score += 1;
  }

  function resetScore() {
    _score = 0;
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
    resetScore,
  };
}
