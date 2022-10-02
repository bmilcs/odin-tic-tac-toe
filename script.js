//
// GameBoard: a modular, IIFE function, that handles the gameboard array & elements
//

const GameBoard = (function () {
  let _boardArray = Array(9).fill("");

  // @return: an array of html elements for each clickable square
  const render = () => {
    const gameContainer = document.getElementById("game-container");

    return _boardArray.map((value, i) => {
      const div = document.createElement("div");
      div.classList.add("square");
      div.setAttribute("data-position", i);
      gameContainer.appendChild(div);
      return div;
    });
  };

  const reset = () => {
    resetArray();
    resetSquares();
  };

  const resetArray = () => {
    _boardArray = Array(9).fill("");
  };

  const resetSquares = () => {
    gameBoardElements.forEach((square) => {
      square.textContent = "";
      square.classList.remove("x");
      square.classList.remove("o");
      square.classList.add("enabled");
      square.addEventListener("click", selectSquare);
    });
  };

  // callback function: invoked when square is clicked
  const selectSquare = (e) => {
    const element = e.target;
    const activePlayer = Game.getActivePlayer();
    const marker = activePlayer.getMarker();

    disableSquare(element);
    markSquare(element, marker);
    markArray(element.dataset.position, marker);
    // gameboard elements have [data-position] attr, which corresponds
    // to their position in the gameboard array. the array
    // is used to determine when a victory or tie takes place.

    // Game module handles flow of the game & game menu
    Game.isRoundOver();
  };

  const disableSquare = (element) => {
    element.removeEventListener("click", selectSquare);
    element.classList.remove("enabled");
  };

  const markSquare = (element, marker) => {
    // classes "x" "o": add unique styles for each player
    element.classList.add(marker);
    element.textContent = marker;
  };

  const markArray = (index, marker) => {
    _boardArray[index] = marker;
  };

  const get = () => {
    return _boardArray;
  };

  const gameBoardElements = render();

  // global scope only has access to the following functions
  return {
    reset,
    get,
  };
})();

//
// Function Factory: creates player objects
//

const playerFactory = (playerName, OX) => {
  // Capitalize 1st letter of playerName
  const _name = playerName.charAt(0).toUpperCase() + playerName.slice(1);
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
};

//
// Game Flow Module
//

const Game = (() => {
  let player1, player2, activePlayer, round;
  const header = document.querySelector("header"),
    gameBoard = document.querySelector(".gameboard"),
    scoreBoard = document.querySelector(".scoreboard"),
    gameMenu = document.querySelector(".game-menu"),
    nameInput = document.getElementById("name"),
    startGameBtn = document.querySelector(".start-game-btn"),
    player1Score = document.querySelector(".player1-score"),
    player2Score = document.querySelector(".player2-score"),
    modal = document.querySelector(".modal"),
    modalText = document.querySelector(".modal .text-container");

  activateGameMenu();

  // used on page first load & after a game is completed
  function activateGameMenu() {
    // hides gameboard & scoreboard after game is done:
    gameBoard.classList.add("display-none");
    scoreBoard.classList.add("display-none");
    gameBoard.classList.add("opacity0");
    scoreBoard.classList.add("opacity0");

    // fadeIn: removes "display: none" & adds utility class that
    // has an opacity transition
    fadeIn(header);
    fadeIn(gameMenu);

    // enables button & enter key to start game
    startGameBtn.addEventListener("click", startGameHandler);
    window.addEventListener("keypress", startGameHandler);
  }

  function disableGameMenu() {
    startGameBtn.removeEventListener("click", startGameHandler);
    window.removeEventListener("keypress", startGameHandler);
  }

  function startGameHandler(e) {
    // if enter key OR click triggered event:
    if (e.detail === 0) {
      if (e.key === "Enter") isNamePresent();
    } else isNamePresent();

    function isNamePresent() {
      if (nameInput.checkValidity()) {
        createPlayers();
        disableGameMenu();
      }
    }
  }

  function createPlayers() {
    // playerFactory() creates player objects, containing their
    // name, score, marker & methods to retrieve them.
    player1 = playerFactory(nameInput.value, "x");
    player2 = playerFactory("Robot", "o");
    renderName(player1);
    renderName(player2);
    beginGame();
  }

  // displays player names in scoreboard & stores name element in the
  // player object
  // @param: player object
  function renderName(player) {
    player.getMarker() === "x"
      ? (player.nameElement = document.querySelector(".player1-name"))
      : (player.nameElement = document.querySelector(".player2-name"));

    player.nameElement.textContent = player.getName();
  }

  function beginGame() {
    activePlayer = player1;
    round = 1;
    resetScores();
    updateScoreBoard();
    animateMenuTransition();
    beginRound();
  }

  function resetScores() {
    player1.resetScore();
    player2.resetScore();
  }

  function updateScoreBoard() {
    player1Score.textContent = player1.getScore();
    player2Score.textContent = player2.getScore();
  }

  function beginRound() {
    GameBoard.reset();
    displayActivePlayer();
  }

  // Adds underline effect to show who's turn it is
  function displayActivePlayer() {
    inactivePlayer = getOtherPlayer(activePlayer);
    inactivePlayer.nameElement.style.borderBottom = "none";

    // match color - player1: neutral vs player2: accent
    if (player1 === activePlayer)
      activePlayer.nameElement.style.borderBottom =
        "3px var(--clr-neutral-100) solid";
    else
      activePlayer.nameElement.style.borderBottom =
        "3px var(--clr-accent-100) solid";
  }

  // Returns the inverse of a player object
  // @param player object
  // @return other player object
  function getOtherPlayer(player) {
    if (player.getName() === player1.getName()) return player2;
    else return player1;
  }

  function toggleActivePlayer() {
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);
    displayActivePlayer();
  }

  // invoked by GameBoard module, when a player makes a move (clicks on a square)
  function isRoundOver() {
    // regex: matches "x" or "o"
    const xo = /[xo]/;
    const arr = GameBoard.get();

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
      // if one of the winning combos are all equal to one another
      // and contain an "x" or "o" -- ie: not blank:
      declareRoundWinner();
    } else if (GameBoard.get().some((i) => i === "")) {
      // not a win & there are empty spaces on the board:
      toggleActivePlayer();
    } else {
      // not a win, no empty spaces left:
      declareRoundTie();
    }
  }

  function declareRoundWinner() {
    const winner = getActivePlayer();
    const loser = getOtherPlayer(winner);

    winner.incrementScore();
    updateScoreBoard();

    if (isGameOver()) {
      // a player has reached 3 wins
      declareGameWinner(winner);
    } else {
      // display winner & increment round
      showModal(
        `${winner.getName()} takes round #${round}!`,
        `${loser.getName()} begins round #${++round}`
      );

      setTimeout(() => {
        hideModal();
        // let loser go first in next round
        toggleActivePlayer();
        beginRound();
      }, 5000);
    }
  }

  // @return: true, if either player has reached 3 wins.
  function isGameOver() {
    if (player1.getScore() === 3 || player2.getScore() === 3) return true;
  }

  function declareRoundTie() {
    showModal(`It's a tie! `, `Repeating Round #${round}`);

    setTimeout(() => {
      hideModal();
      beginRound();
    }, 4000);
  }

  // @param: player object -- ie: the 1st to reach 3 wins
  function declareGameWinner(winner) {
    showModal(`${winner.getName()} wins the game!!`, `Thanks for playing :)`);

    setTimeout(() => {
      returnToGameMenu();
    }, 5000);
  }

  function returnToGameMenu() {
    hideModal();
    activateGameMenu();
  }

  // modal is used to display wins/ties/etc. between rounds
  // @params: h3 & h4 text
  function showModal(h3, h4 = "") {
    modalText.firstElementChild.textContent = h3;
    modalText.lastElementChild.textContent = h4;

    fadeIn(modal);

    // doAfterTransition: waits for transition end of 1st parameter (element)
    // & executes the second parameter (function)
    doAfterTransition(modal, () => {
      // after modal transition ends (blurred background), fadeIn(h3)
      fadeIn(modalText.firstElementChild);
      doAfterTransition(modalText.firstElementChild, () => {
        // after h3 transition ends (blurred background), fadeIn(h4)
        fadeIn(modalText.lastElementChild);
      });
    });
  }

  // hides the entire modal
  // resets h3 / h4 to opacity: 0 for future fadeIn() transitions
  function hideModal() {
    fadeOut(modal);
    modalText.firstElementChild.classList.add("opacity0");
    modalText.lastElementChild.classList.add("opacity0");
  }

  // animates transition from game menu to round #1
  function animateMenuTransition() {
    fadeOut(header);
    fadeOut(gameMenu);

    showModal(
      `Are you ready, ${player1.getName()}?`,
      "PS: You play as the robot, too :)"
    );
    doAfterTransition(modal, animateGameBoard);

    function animateGameBoard() {
      // Remove "display: none" so elements position themselves while invisible,
      // before opacity tranisitions kick in (prevents abrupt position shifts)
      header.classList.remove("display-none");
      gameBoard.classList.remove("display-none");
      scoreBoard.classList.remove("display-none");

      setTimeout(() => {
        fadeIn(header);
        setTimeout(() => {
          fadeIn(gameBoard);
          setTimeout(() => {
            fadeIn(scoreBoard);
            setTimeout(() => {
              hideModal();
            }, 1500);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }

  // utility function for timing transitions:
  // @params: html element to wait for & function to execute once transition is done
  function doAfterTransition(elementToWaitOn, callbackFunction) {
    elementToWaitOn.addEventListener("transitionend", callbackFunction, {
      once: true,
    });
  }

  // utility function for animating the fade in effect
  // @param: html element
  function fadeIn(element) {
    element.classList.remove("display-none");

    setTimeout(() => {
      element.classList.remove("opacity0");
    }, 100);
  }

  // utility function for animating the fade out effect
  // @param: html element
  function fadeOut(element) {
    element.classList.add("opacity0");

    doAfterTransition(element, () => {
      element.classList.add("display-none");
    });
  }

  // used by GameBoard to determine which mark to place on the board
  function getActivePlayer() {
    return activePlayer;
  }

  // global scope accessible functions, used by GameBoard:
  return {
    getActivePlayer,
    isRoundOver,
  };
})();

const displayController = (() => {})();
