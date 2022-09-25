// store gameboard array within Gameboard object

const GameboardModule = (function () {
  let gameboardArray = ["", "", "", "", "", "", "", "", ""];
  // const gameboard = ["X", "O", "O", "X", "O", "O", "X", "O", "X"];
  const gameContainer = document.getElementById("game-container");
  const gameboardElements = render();

  function render() {
    return gameboardArray.map((value, i) => {
      const div = document.createElement("div");

      // basic styling
      div.classList.add("square");

      // hover effect
      div.classList.add("enabled");

      div.setAttribute("data-position", i);
      div.addEventListener("click", clickEvent);
      gameContainer.appendChild(div);
      return div;
    });
  }

  function reset() {
    gameboardArray.forEach((i) => (i = ""));
    gameboardElements.forEach((square) => {
      square.textContent = "";
      square.classList.remove("x");
      square.classList.remove("o");
      square.classList.add("enabled");
      square.addEventListener("click", clickEvent);
    });
    console.log(gameboardArray);
  }

  function clickEvent(e) {
    const element = e.target;

    element.removeEventListener("click", clickEvent);
    element.classList.remove("enabled");

    const player = GameFlow.getPlayersTurn();
    playSquare(player, element);
  }

  function playSquare(player, element) {
    const position = element.dataset.position;

    let marker;
    player === 0 ? (marker = "x") : (marker = "o");

    element.classList.add(marker);
    element.textContent = marker;

    gameboardArray[position] = marker;
  }

  return {
    render,
    reset,
  };
})();

const GameFlow = (() => {
  let playersTurn = 0;

  const getPlayersTurn = () =>
    playersTurn === 0 ? (playersTurn = 1) : (playersTurn = 0);

  return {
    getPlayersTurn,
  };
})();

// const playerFactory = (name) => {
//   return {
//     name,
//   };
// };

// let playerOne = playerFactory("Joe");
// let playerTwo = playerFactory("Steve");
