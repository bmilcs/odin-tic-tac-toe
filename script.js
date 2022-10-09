//
// GameBoard: a modular, IIFE function, that handles the gameboard array & elements
//

const GameBoard = (() => {
  let _boardArray = Array(9).fill("");

  // stored in gameBoardElements, which is used to reset game after each round
  const prepareElements = () => {
    return _boardArray.map((square, i) => {
      const div = document.createElement("div");
      div.classList.add("square");
      div.setAttribute("data-position", i);
      return div;
    });
  };

  const gameBoardElements = prepareElements();

  // @return: an array of html elements for each clickable square
  const render = () => {
    const gameContainer = document.getElementById("game-container");

    gameBoardElements.forEach((div) => {
      gameContainer.appendChild(div);
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
      square.addEventListener("click", clickSquare);
    });
  };

  // callback: invoked when square is clicked
  const clickSquare = (e) => {
    const element = e.target;
    const activePlayer = Game.getActivePlayer();
    const marker = activePlayer.getMarker();

    disableSquare(element);
    markSquare(element, marker);
    markArray(element.dataset.position, marker);

    // gameboard elements have [data-position] attr, which corresponds
    // to their position in the gameboard array. the array
    // is used to determine when a victory or tie takes place.

    Game.checkForRoundWinner();
  };

  const disableSquare = (element) => {
    element.removeEventListener("click", clickSquare);
    element.classList.remove("enabled");
  };

  const markSquare = (element, marker) => {
    // classes "x" "o": add unique colors for each player
    element.classList.add(marker);
    element.textContent = marker;
  };

  const markArray = (index, marker) => {
    _boardArray[index] = marker;
  };

  const get = () => {
    return _boardArray;
  };

  render();

  // global scope only has access to the following functions
  return {
    reset,
    get,
  };
})();

//
// Display Controller Module: handles animation & gui elements
//

const DisplayController = (() => {
  //
  // utility functions
  //

  // executes a function once transition has completed on an element
  const doAfterTransition = (elementToWaitOn, callbackFunction) => {
    elementToWaitOn.addEventListener("transitionend", callbackFunction, {
      once: true,
    });
  };

  const fadeIn = (element) => {
    element.classList.remove("display-none");
    setTimeout(() => {
      element.classList.remove("opacity0");
    }, 10);
  };

  const fadeOut = (element) => {
    element.classList.add("opacity0");
    doAfterTransition(element, () => {
      element.classList.add("display-none");
    });
  };

  //
  // modal: displays are you ready msg, wins, ties, game winner:
  //

  const modal = document.querySelector(".modal");
  const modalText = document.querySelector(".modal .text-container");

  const showModal = (h3, h4 = "") => {
    modalText.firstElementChild.textContent = h3;
    modalText.lastElementChild.textContent = h4;

    fadeIn(modal);

    doAfterTransition(modal, () => {
      fadeIn(modalText.firstElementChild);
      doAfterTransition(modalText.firstElementChild, () => {
        fadeIn(modalText.lastElementChild);
      });
    });
  };

  // hides the entire modal & h3/h4 for future fadeIn() transitions
  const hideModal = () => {
    fadeOut(modal);
    modalText.firstElementChild.classList.add("opacity0");
    modalText.lastElementChild.classList.add("opacity0");
  };

  //
  // game menu related functions
  //

  const header = document.querySelector("header");
  const gameBoard = document.querySelector(".gameboard");
  const scoreBoard = document.querySelector(".scoreboard");
  const gameMenu = document.querySelector(".game-menu");

  // used on 1st page load & after a game is completed
  const displayMenu = () => {
    gameBoard.classList.add("display-none");
    gameBoard.classList.add("opacity0");
    scoreBoard.classList.add("display-none");
    scoreBoard.classList.add("opacity0");

    fadeIn(header);
    fadeIn(gameMenu);

    enableGameMenu();
  };

  const startGameBtn = document.querySelector(".start-game-btn"),
    nameInput = document.getElementById("name");

  const enableGameMenu = () => {
    startGameBtn.addEventListener("click", startGameHandler);
    window.addEventListener("keypress", startGameHandler);
  };

  const disableGameMenu = () => {
    startGameBtn.removeEventListener("click", startGameHandler);
    window.removeEventListener("keypress", startGameHandler);
  };

  const startGameHandler = (e) => {
    // if enter key OR click triggered event:
    if (e.detail === 0) {
      if (e.key === "Enter") isNamePresent();
    } else isNamePresent();
  };

  const isNamePresent = () => {
    if (nameInput.checkValidity()) {
      Game.createPlayers(nameInput.value);
      disableGameMenu();
    }
  };

  // animates transition from game menu to round #1
  const animateMenuToGame = (playerName) => {
    fadeOut(header);
    fadeOut(gameMenu);

    showModal(
      `Are you ready, ${playerName}?`,
      'PS: You play as "Maynard", too :)'
    );

    setTimeout(() => {
      hideModal();
      doAfterTransition(modal, animateGameBoard);
    }, 4000);
  };

  //
  // gameboard related functions
  //

  const animateGameBoard = () => {
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
        }, 750);
      }, 750);
    }, 750);
  };

  const displayActivePlayer = (player1, player2) => {
    const activePlayer = Game.getActivePlayer();
    const inactivePlayer = Game.getInactivePlayer();

    inactivePlayer.nameElement.style.borderBottom = "none";

    // match color - player1: neutral vs player2: accent
    if (player1 === activePlayer)
      activePlayer.nameElement.style.borderBottom =
        "3px var(--clr-neutral-100) solid";
    else
      activePlayer.nameElement.style.borderBottom =
        "3px var(--clr-accent-100) solid";
  };

  //
  // scoreboard related functions
  //

  // @param: player object
  const renderName = (player) => {
    player.getMarker() === "x"
      ? (player.nameElement = document.querySelector(".player1-name"))
      : (player.nameElement = document.querySelector(".player2-name"));

    // .nameElement: used to show who's turn it is
    player.nameElement.textContent = player.getName();
  };

  const player1Score = document.querySelector(".player1-score"),
    player2Score = document.querySelector(".player2-score");

  const updateScoreBoard = (score1, score2) => {
    player1Score.textContent = score1;
    player2Score.textContent = score2;
  };

  return {
    renderName,
    displayMenu,
    animateMenuToGame,
    displayActivePlayer,
    showModal,
    hideModal,
    updateScoreBoard,
  };
})();

//
// Game Flow Module
//

const Game = (() => {
  let _player1, _player2, _activePlayer, _round;

  DisplayController.displayMenu();

  const createPlayers = (name) => {
    // playerFactory() creates player objects, containing their
    // name, score, marker & methods to retrieve them.
    _player1 = playerFactory(name, "x");
    _player2 = playerFactory("Maynard", "o");
    DisplayController.renderName(_player1);
    DisplayController.renderName(_player2);
    beginGame();
  };

  const beginGame = () => {
    _activePlayer = _player1;
    _round = 1;
    resetScores();
    DisplayController.updateScoreBoard(
      _player1.getScore(),
      _player2.getScore()
    );
    DisplayController.animateMenuToGame(_player1.getName());
    beginRound();
  };

  const resetScores = () => {
    _player1.resetScore();
    _player2.resetScore();
  };

  const beginRound = () => {
    GameBoard.reset();
    displayActivePlayer();
  };

  // Adds underline effect to show who's turn it is
  const displayActivePlayer = () => {
    DisplayController.displayActivePlayer(_player1, _player2);
  };

  // Returns the inverse of a player object (player2 in > player1 out)
  // @param player object
  // @return other player object
  const getOtherPlayer = (player) => {
    if (player.getName() === _player1.getName()) return _player2;
    else return _player1;
  };

  const toggleActivePlayer = () => {
    _activePlayer === _player1
      ? (_activePlayer = _player2)
      : (_activePlayer = _player1);
    displayActivePlayer();
  };

  // invoked by GameBoard module, when a player makes a move (clicks on a square)
  const checkForRoundWinner = () => {
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
  };

  // @return: true, if either player has reached 3 wins.
  const isGameOver = () => {
    if (_player1.getScore() === 3 || _player2.getScore() === 3) return true;
  };

  const declareRoundWinner = () => {
    const winner = getActivePlayer();
    const loser = getOtherPlayer(winner);

    winner.incrementScore();
    DisplayController.updateScoreBoard(
      _player1.getScore(),
      _player2.getScore()
    );

    // if a player has reached 3 wins
    if (isGameOver()) {
      declareGameWinner(winner);
    } else {
      // display round winner & increment round #
      DisplayController.showModal(
        `${winner.getName()} takes round #${_round}!`,
        `${loser.getName()} begins round #${++_round}`
      );

      setTimeout(() => {
        DisplayController.hideModal();
        // let loser go first in next round
        toggleActivePlayer();
        beginRound();
      }, 4250);
    }
  };

  const declareRoundTie = () => {
    DisplayController.showModal(`It's a tie!`, `Repeating Round #${_round}`);

    setTimeout(() => {
      DisplayController.hideModal();
      beginRound();
    }, 4000);
  };

  // @param: player object -- ie: the 1st to reach 3 wins
  const declareGameWinner = (winner) => {
    DisplayController.showModal(
      `${winner.getName()} wins the game!!`,
      `Thanks for playing :)`
    );

    setTimeout(() => {
      DisplayController.hideModal();
      DisplayController.displayMenu();
    }, 5000);
  };

  const getActivePlayer = () => {
    return _activePlayer;
  };

  const getInactivePlayer = () => {
    return getOtherPlayer(_activePlayer);
  };

  // global scope accessible functions, used by GameBoard:
  return {
    getActivePlayer,
    getInactivePlayer,
    checkForRoundWinner,
    createPlayers,
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

  const incrementScore = () => {
    _score += 1;
  };

  const resetScore = () => {
    _score = 0;
  };

  const getName = () => {
    return _name;
  };

  const getScore = () => {
    return _score;
  };

  const getMarker = () => {
    return _marker;
  };

  return {
    getName,
    getMarker,
    getScore,
    incrementScore,
    resetScore,
  };
};
