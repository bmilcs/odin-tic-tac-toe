// GameBoard is a modular, IIFE function, that handles the gameboard array & gui elements

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

    Game.isRoundOver();
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

//
// Game Flow Module
//

const Game = (function () {
  let player1, player2, activePlayer, round;
  let player1Score = document.querySelector(".player1-score");
  let player2Score = document.querySelector(".player2-score");

  getPlayerDetails();
  beginGame();

  function getPlayerDetails() {
    // prompt user for # of players
    // get user 1 & 2's name > create objects via player
    // if 1 player, automatically assign PC to player 2
    player1 = playerFactory("Bryan", "x");
    player2 = playerFactory("Joe", "o");
    renderName(player1);
    renderName(player2);
  }

  function renderName(player) {
    player.getMarker() === "x"
      ? (element = document.querySelector(".player1-name"))
      : (element = document.querySelector(".player2-name"));
    element.textContent = player.getName();
  }

  function beginGame() {
    activePlayer = player1;
    round = 0;
    updateScoreBoard();
    beginRound();
  }

  function beginRound() {
    round += 1;
    GameBoard.reset();
    console.log(`Round ${round}. Fight!`);
    displayActivePlayer();
  }

  function displayActivePlayer() {
    // update gui to show whos turn it is
    console.log(`Turn: ${activePlayer.getName()}`);
  }

  function toggleActivePlayer() {
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);
    displayActivePlayer();
  }

  // invoked by GameBoard, when a player makes a move
  function isRoundOver() {
    const arr = GameBoard.getGameBoard();
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
    } else if (GameBoard.getGameBoard().some((i) => i === "")) {
      toggleActivePlayer();
    } else {
      declareRoundTie();
    }
  }

  function declareRoundWinner() {
    const winner = getActivePlayer();
    winner.incrementScore();
    updateScoreBoard();

    // display victory gui element / modal
    console.warn("Winner:", winner.getName());

    if (isGameOver()) {
      declareGameWinner();
    } else {
      // let loser go first in next round
      toggleActivePlayer();
      beginRound();
    }
  }

  function declareRoundTie() {
    // display ui element/modal declaring tie
    // wipe screen clean / animate somehow
    console.log("It's a tie!");
    beginRound();
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

  function updateScoreBoard() {
    player1Score.textContent = player1.getScore();
    player2Score.textContent = player2.getScore();
  }

  function resetScores() {
    // reset scoreboard dom elements
    player1.resetScore();
    player2.resetScore();
    updateScoreBoard();
  }

  function askPlayAgain() {
    // create gui element to ask if they want to play another round
    console.log("Would you like to play again?");
    // if yes
    resetScores();
    beginGame();
  }

  function getActivePlayer() {
    return activePlayer;
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
