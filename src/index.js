import {
  Gameboard,
  Carrier,
  Battleship,
  Destroyer,
  Patrol,
} from "./classes.js";

import { BOARD_SQUARES, shipNames } from "./variables.js";

const introScreen = document.querySelector(".intro-screen"),
  draggables = document.querySelectorAll(".draggable"),
  GAME_SPEED = 2000;
let GAME_SPEED_MULTIPLIER = 1;
// Functions
/* 
window.addEventListener(
  "keydown",
  () => {
    introScreen.style.setProperty("display", "none");
    console.log("x");
  },
  { once: true }
); */

function resetGame(gameOverScreen) {
  document.querySelector("main").removeChild(gameOverScreen);
  const navBar = document.querySelector(".intro-sidebar");
  navBar.classList.remove("hide-nav");
  const gameBoard = document.querySelector(".computer-board"),
    playerBoard = document.querySelector(".player-board"),
    shipVals = document.querySelectorAll(".ship-val"),
    vals = [1, 1, 2, 1];

  [gameBoard, playerBoard].forEach((board) => {
    board.innerHTML = "";
  });
  shipVals.forEach((val, index) => {
    val.innerText = vals[index];
    let shipElem = val.nextElementSibling;
    shipElem.classList.add("draggable");
    shipElem.setAttribute("draggable", true);
  });
  renderGame();
}
function computerMove() {
  displayActualText("The enemy clicked a square...");
  const index = randomNumber(BOARD_SQUARES);
  const square = document.getElementById(index);
  if (
    square.classList.contains("hit") ||
    square.classList.contains("miss-square")
  ) {
    computerMove();
    return;
  }
  let circle = document.createElement("div");
  if (square.classList.contains("square-ship")) {
    square.classList.add("hit");
    circle.classList.add("hit-square");
    setTimeout(() => {
      displayActualText("The enemy hit a square!");
    }, GAME_SPEED / GAME_SPEED_MULTIPLIER);
    updateCoords(index, playerBoard);
  } else {
    circle.classList.add("miss-square");
    setTimeout(() => {
      displayActualText("The enemy missed...");
    }, GAME_SPEED / GAME_SPEED_MULTIPLIER);
  }

  square.appendChild(circle);
}

function renderEndScreen(msg) {
  const container = document.createElement("div"),
    title = document.createElement("h1"),
    playAgain = document.createElement("button");
  container.classList.add("end-game-screen");
  title.innerText = msg;
  title.classList.add("end-game-title");
  playAgain.classList.add("play-again-btn");
  playAgain.innerText = "Play Again?";
  playAgain.addEventListener("click", () => resetGame(container));

  container.appendChild(title);
  container.appendChild(playAgain);
  setTimeout(() => {
    displayActualText("");
  }, 2000);

  document.querySelector("main").appendChild(container);
}

function endGame(playerWon) {
  const computerSquares = document.querySelectorAll(".computer-square");
  setTimeout(() => {
    computerSquares.forEach((square) => {
      square.classList.remove("hover");
      square.removeEventListener("click", playerMove, true);
    });
  }, 3000);
  if (playerWon) {
    setTimeout(() => {
      renderEndScreen("You won!");
    }, 3000);
  } else {
    setTimeout(() => {
      renderEndScreen("You lost!");
    }, 3000);
  }
}
function checkAllDestroyed(board, boardIsComputer) {
  const arrs = [];

  for (const [shipName, shipArr] of Object.entries(board.shipCoords)) {
    shipArr.forEach((arr) => {
      arrs.push(arr);
    });
  }
  const gameOver = arrs.every((arr) => {
    return arr.length == 0;
  });
  if (gameOver) {
    endGame(boardIsComputer);
  }
}
function updateCoords(id, board) {
  const boardIsComputer = board === computerBoard;
  for (const [shipName, shipArr] of Object.entries(board.shipCoords)) {
    shipArr.forEach((ship, shipIndex) => {
      const index = ship.findIndex((shipValue) => {
        return shipValue == id;
      });
      if (index !== -1) {
        ship[index] += "-hit";
        const shipDestroyed = ship.every((shipValue) => {
          return /-hit/.test(shipValue);
        });
        if (shipDestroyed) {
          shipArr[shipIndex] = [];
          setTimeout(() => {
            displayActualText(
              `${
                boardIsComputer ? "You" : "The computer"
              } destroyed a ${shipName}`
            );
          }, 2000);
          checkAllDestroyed(board, boardIsComputer);
        }
      }
    });
  }
}
function displayActualText(msg) {
  const h2Holder = document.querySelector(".output-field");
  h2Holder.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.classList.add("output-message");
  h2Holder.appendChild(h2);
  h2.innerText = msg;
}

function displayMessage(state) {
  displayActualText("You clicked a square...");
  if (state === true) {
    setTimeout(() => {
      displayActualText("You hit a ship!!");
    }, GAME_SPEED / GAME_SPEED_MULTIPLIER);
  } else {
    setTimeout(() => {
      displayActualText("You hit nothing...");
    }, GAME_SPEED / GAME_SPEED_MULTIPLIER);
  }
}

function playerMove(square) {
  square = square.currentTarget;
  removeClicks(true);
  let circle = document.createElement("div");
  if (square.classList.contains("square-ship")) {
    square.classList.add("hit");
    circle.classList.add("hit-square");
    displayMessage(true);
    const id = square.id.match(/\d+/);
    updateCoords(id[0], computerBoard);
  } else {
    square.classList.add("clicked");
    circle.classList.add("miss-square");
    displayMessage(false);
  }
  square.appendChild(circle);
  setTimeout(() => {
    computerMove();
  }, GAME_SPEED / GAME_SPEED_MULTIPLIER + GAME_SPEED / GAME_SPEED_MULTIPLIER);
}
function removeClicks(state) {
  const computerSquares = document.querySelectorAll(".computer-square");
  if (state) {
    computerSquares.forEach((square) => {
      square.classList.remove("hover");
    });
    setTimeout(() => {
      computerSquares.forEach((square) => {
        if (
          !square.classList.contains("hit") &&
          !square.classList.contains("clicked")
        ) {
          square.classList.add("hover");

          square.addEventListener("click", playerMove, true);
        }
      });
    }, GAME_SPEED / GAME_SPEED_MULTIPLIER + (GAME_SPEED + 1000) / GAME_SPEED_MULTIPLIER);
  } else {
  }
}
function startGame() {
  const computerBoardElem = document.querySelector(".computer-board"),
    computerSquares = document.querySelectorAll(".computer-square");
  computerSquares.forEach((square) => {
    square.classList.add("hover");
    square.addEventListener("click", playerMove, true);
  });
}

function updateGameboard(ship) {
  const shipValues = [...document.querySelectorAll(".ship-val")];
  playerBoard.shipsToRender[ship]--;

  shipNames.forEach((shipName) => {
    let shipElemH2 = document.querySelector(`.${shipName}-container > h2`);
    shipElemH2.innerHTML = playerBoard.shipsToRender[shipName];
    if (shipElemH2.innerHTML == 0) {
      let shipElemDiv = document.querySelector(`.${shipName}-container > div`);
      shipElemDiv.classList.remove("draggable");
      shipElemDiv.setAttribute("draggable", false);
    }
  });
  if (
    shipValues.every((value) => {
      return value.innerText == 0;
    })
  ) {
    const navBar = document.querySelector(".intro-sidebar");
    navBar.classList.add("hide-nav");
    startGame();
  }
}
function renderShip(squares, ship) {
  // Style squares
  const indexes = [];
  squares.forEach((square) => {
    square.classList.add("square-ship");
    indexes.push(square.id);
  });
  playerBoard.shipCoords[ship].push(indexes);
  updateGameboard(ship);
}
function preRenderShip(square, ship, length, id) {
  let squares = [],
    squareShip,
    renderState = true;

  square.classList.remove("square-hover");
  // Save active squares to array
  for (let i = 0; i < length; i++) {
    squareShip = document.getElementById(`${id + i}`);
    if (squareShip.classList.contains("square-ship")) {
      renderState = false;
    }
    squares.push(squareShip);
  }

  if (renderState) {
    renderShip(squares, ship);
  }
}
function checkRenderable(ship) {
  const square = document.querySelector(".square-hover");
  let idCopy,
    length = playerBoard.shipInfo[ship].length;

  if (square.id.length === 2) {
    idCopy = square.id.split("")[1];
  } else {
    idCopy = square.id;
  }

  if (length + parseInt(idCopy) > 10) {
    square.classList.remove("square-hover");
  } else {
    preRenderShip(square, ship, length, parseInt(square.id));
  }
}

function findShip(e) {
  let ship = ["carrier", "battleship", "destroyer", "patrol"].find(
    (shipName) => {
      return e.classList.contains(shipName);
    }
  );
  return ship;
}

draggables.forEach((draggable) => {
  draggable.addEventListener("dragend", (e) => {
    let ship = findShip(e.currentTarget);
    checkRenderable(ship);
  });
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
    const shipName = ["carrier", "battleship", "destroyer", "patrol"].find(
      (ship) => {
        return draggable.classList.contains(ship);
      }
    );
    playerBoard.toggleShip(shipName);
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});
function renderShips() {
  const carrier = new Carrier();
  const battleship = new Battleship();
  const destroyer = new Destroyer();
  const patrol = new Patrol();
  const patrol2 = new Patrol();
  [carrier, battleship, destroyer, patrol, patrol2].forEach((ship) => {
    playerBoard.ships.push(ship);
  });
}

function findSquare(column, row) {
  return column === 0 && row === 0
    ? 0
    : column === 0 && row > 0
    ? row
    : `${column}${row}`;
}

function randomNumber(num) {
  return Math.floor(Math.random() * num);
}

function preRenderEnemyShip(ship, amount) {
  let length;
  for (let i = 0; i < amount; i++) {
    length = computerBoard.shipInfo[ship].length;

    let column = randomNumber(10);
    let row = randomNumber(10 - length);
    let index = findSquare(column, row);
    let indexes = [];

    for (let j = 0; j < length; j++) {
      indexes.push(parseInt(index) + j);
    }

    if (
      indexes.every((index) => {
        let square = document.querySelector(`#c-${index}`);
        return !square.classList.contains("square-ship");
      })
    ) {
      computerBoard.shipCoords[ship].push(indexes);
      indexes.forEach((index) => {
        let square = document.querySelector(`#c-${index}`);
        square.classList.add("square-ship");
      });
    } else {
      amount++;
    }
  }
}

function renderComputerBoard() {
  for (const [key, value] of Object.entries(computerBoard.shipsToRender)) {
    preRenderEnemyShip(key, value);
  }
}
export function renderGameBoards() {
  const playerBoard = document.querySelector(".player-board"),
    computerBoard = document.querySelector(".computer-board");

  (function () {
    for (let i = 0; i < BOARD_SQUARES; i++) {
      const square = document.createElement("div");
      square.id = i;
      square.classList.add("square", "player-square");
      square.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("square-hover");
      });
      square.addEventListener("dragleave", (e) => {
        e.currentTarget.classList.remove("square-hover");
      });

      playerBoard.appendChild(square);
    }
  })();

  (function () {
    for (let i = 0; i < BOARD_SQUARES; i++) {
      const square = document.createElement("div");
      square.id = `c-${i}`;
      square.classList.add("square", "computer-square");

      computerBoard.appendChild(square);
    }
  })();
}
function setMultiplier() {
  let multiplierLevel =
    multiplier.firstChild.nextSibling.innerText.match(/\d/)[0];

  if (multiplierLevel >= 4) {
    multiplierLevel = 1;
  } else {
    multiplierLevel++;
  }
  GAME_SPEED_MULTIPLIER = multiplierLevel;
  multiplier.firstChild.nextSibling.innerText = `${multiplierLevel}x`;
}

function renderGame() {
  window.playerBoard = new Gameboard();
  window.computerBoard = new Gameboard();
  renderGameBoards();
  renderComputerBoard();
}
renderGame();
const multiplier = document.querySelector(".multiplier"),
  tooltip = document.querySelector(".hidden");
multiplier.addEventListener("mouseover", () => {
  tooltip.style.opacity = 1;
});
multiplier.addEventListener("mouseout", () => {
  tooltip.style.opacity = 0;
});
multiplier.addEventListener("click", setMultiplier);
