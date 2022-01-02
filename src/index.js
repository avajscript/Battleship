import {
  Gameboard,
  Carrier,
  Battleship,
  Destroyer,
  Patrol,
} from "./classes.js";

import { BOARD_SQUARES, shipNames } from "./variables.js";

const introScreen = document.querySelector(".intro-screen"),
  draggables = document.querySelectorAll(".draggable");
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

function playerMove(square) {
  if (square.classlist.contains("square-ship")) {
  } else {
  }
}

function startGame() {
  const computerBoardElem = document.querySelector(".computer-board"),
    computerSquares = document.querySelectorAll(".computer-square");
  computerSquares.forEach((square) => {
    square.classList.add("hover");
    square.addEventListener("click", (e) => {
      playerMove(e.currentTarget);
    });
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

  squares.forEach((square) => {
    square.classList.add("square-ship");
  });
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

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();
function renderGame() {
  renderGameBoards();
  renderComputerBoard();
}
renderGame();
