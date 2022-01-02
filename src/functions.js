import { Gameboard } from "./classes.js";
import { renderGameBoards } from "./index.js"; // Works?
import { BOARD_LENGTH } from "./variables.js";

export function findSquare(column, row) {
  return column === 0 && row === 0
    ? 0
    : column === 0 && row > 0
    ? row
    : `${column}${row}`;
}
export function randomNumber(num) {
  return Math.floor(Math.random() * num);
}

export function preRenderEnemyShip(
  ship,
  amount,
  computerBoard,
  computerBoardElem
) {
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
    console.log(computerBoardElem);
    
    if (
      indexes.every((index) => {
        let square = document.querySelector(`#c-${index}`);
        return !square.classList.contains('square-ship');
      })
    ) {
      indexes.forEach(index => {
        index.
      });
    }
  }
}

export function renderComputerBoard() {
  const computerBoardElem = document.querySelector(".computer-board"),
    computerBoard = new Gameboard();
  for (const [key, value] of Object.entries(computerBoard.shipsToRender)) {
    preRenderEnemyShip(key, value, computerBoard, computerBoardElem);
  }
}

renderComputerBoard();
