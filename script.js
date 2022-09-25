// store gameboard array within Gameboard object

const GameboardModule = (function () {
  const gameboardArray = ["", "", "", "", "", "", "", "", ""];
  // const gameboard = ["X", "O", "O", "X", "O", "O", "X", "O", "X"];
  const gameContainer = cacheDOM();
  const gameboardElements = render();

  function cacheDOM() {
    return document.getElementById("game-container");
  }

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
      square.classList.remove("player1");
      square.classList.remove("player2");
      square.classList.add("enabled");
      square.addEventListener("click", clickEvent);
    });
    console.log(gameboardArray);
  }

  function clickEvent(e) {
    const element = e.target;
    const position = e.target.dataset.position;

    element.removeEventListener("click", clickEvent);
    element.classList.remove("enabled");

    // pass event to gameflow module

    // temporary:
    element.classList.add("player1");
    element.textContent = "X";
    console.log({ position }, gameboardArray[position]);
    console.log(element);
  }

  return {
    render,
    reset,
  };
})();
