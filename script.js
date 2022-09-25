// store gameboard array within Gameboard object

const GameModule = (function () {
  const gameboard = ["X", "O", "X", "O", "X", "O", "X", "O", "O"];
  const gameContainer = cacheDOM();

  function cacheDOM() {
    console.warn("cacheDOM fired: targetting game container.");
    return document.getElementById("game-container");
  }

  function render() {
    gameboard.forEach((value, i) => {
      const div = document.createElement("div");
      div.classList.add("square");
      div.setAttribute("data-position", i);
      div.textContent = value;
      value === "X"
        ? div.classList.add("player1")
        : div.classList.add("player2");
      div.addEventListener("click", clickEvent);
      gameContainer.appendChild(div);
    });
  }

  function clickEvent(e) {
    const position = e.target.dataset.position;
    console.log({ position }, gameboard[position]);
  }

  // function reset() {
  //   gameboard.forEach((box) => {});
  // }

  return {
    render,
  };
})();

// const playerFactory = (name) => {
//   return {
//     name,
//   };
// };

GameModule.render();
