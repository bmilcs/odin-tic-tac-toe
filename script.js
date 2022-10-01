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

  function activateGameMenu() {
    gameBoard.classList.add("display-none");
    scoreBoard.classList.add("display-none");
    gameBoard.classList.add("opacity0");
    scoreBoard.classList.add("opacity0");
    fadeIn(header);
    fadeIn(gameMenu);

    startGameBtn.addEventListener("click", gameMenuHandler);
    window.addEventListener("keypress", gameMenuHandler);
  }

  function disableGameMenu() {
    startGameBtn.removeEventListener("click", gameMenuHandler);
    window.removeEventListener("keypress", gameMenuHandler);
  }

  function gameMenuHandler(e) {
    // if enter was pressed OR click triggered event:
    if (e.detail === 0) {
      if (e.key === "Enter") isNamePresent();
    } else isNamePresent();

    function isNamePresent() {
      if (nameInput.checkValidity()) {
        setPlayerDetails();
        disableGameMenu();
      }
    }
  }

  function setPlayerDetails() {
    player1 = playerFactory(nameInput.value, "x");
    player2 = playerFactory("Robot", "o");
    renderName(player1);
    renderName(player2);
    beginGame();
  }

  function renderName(player) {
    player.getMarker() === "x"
      ? (element = document.querySelector(".player1-name"))
      : (element = document.querySelector(".player2-name"));
    element.textContent = player.getName();
  }

  function beginGame() {
    animateMenuTransition();
    activePlayer = player1;
    round = 1;
    updateScoreBoard();
    beginRound();
  }

  function beginRound() {
    GameBoard.reset();
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

    if (isGameOver()) {
      declareGameWinner();
    } else {
      showModal(
        `${winner.getName()} takes round #${round}!`,
        `Up Next: Round #${++round}`
      );
      setTimeout(() => {
        hideModal();
        // let loser go first in next round
        toggleActivePlayer();
        beginRound();
      }, 5000);
    }
  }

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

  function declareGameWinner() {
    let winner;
    player1.getScore() === 3 ? (winner = player1) : (winner = player2);

    showModal(`${winner.getName()} wins the game!!`, `Thanks for playing :)`);

    setTimeout(() => {
      returnToGameMenu();
    }, 5000);
  }

  function returnToGameMenu() {
    hideModal();
    resetScores();
    activateGameMenu();
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

  function getActivePlayer() {
    return activePlayer;
  }

  function showModal(h3, h4 = "") {
    modalText.firstElementChild.textContent = h3;
    modalText.lastElementChild.textContent = h4;

    fadeIn(modal);

    doAfterTransition(modal, () => {
      fadeIn(modalText.firstElementChild);
      doAfterTransition(modalText.firstElementChild, () => {
        fadeIn(modalText.lastElementChild);
      });
    });
  }

  function hideModal() {
    fadeOut(modal);
    modalText.firstElementChild.classList.add("opacity0");
    modalText.lastElementChild.classList.add("opacity0");
  }

  function animateMenuTransition() {
    fadeOut(header);
    fadeOut(gameMenu);

    showModal("Are you ready?", "PS: You play as the robot, too :)");
    doAfterTransition(modal, animateGame);

    function animateGame() {
      // Remove "display: none" so elements position themselves
      // before opacity changes kick in (so they don't move things around)
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

  function doAfterTransition(waitOn, perform) {
    waitOn.addEventListener("transitionend", perform, { once: true });
  }

  function fadeIn(element) {
    element.classList.remove("display-none");

    setTimeout(() => {
      element.classList.remove("opacity0");
    }, 100);
  }

  function fadeOut(element) {
    element.classList.add("opacity0");
    element.addEventListener("transitionend", displayNone);

    function displayNone(e) {
      element.classList.add("display-none");
      element.removeEventListener("transitionend", displayNone);
    }
  }

  return {
    // Used by GameBoard() Module
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
