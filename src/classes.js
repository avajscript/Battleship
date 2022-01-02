export class Ship {
  constructor() {
    this.isSunk = false;
    this.length = 5;
    this.hits = [0, 0, 0, 0, 0];
  }

  hit(num) {
    let index = num + 1;
    if (this.hits[index] === 0) {
      this.hits[index] = 1;
    }
  }
  checkSunk() {
    if (
      this.hits.every((value) => {
        return value === 1;
      })
    ) {
      this.isSunk = true;
    }
  }
}

export class Carrier extends Ship {
  constructor() {
    super();
    this.length = 5;
    this.hits = [0, 0, 0, 0, 0];
  }
}

export class Battleship extends Ship {
  constructor() {
    super();
    this.length = 4;
    this.hits = [0, 0, 0, 0];
  }
}

export class Destroyer extends Ship {
  constructor() {
    super();
    this.length = 3;
    this.hits = [0, 0, 0];
  }
}

export class Patrol extends Ship {
  constructor() {
    super();
    this.length = 2;
    this.hits = [0, 0];
  }
}

export class Gameboard {
  constructor() {
    this.width = 10;
    this.height = 10;
    this.shipsValue = 5;
    this.ships = [];
    this.shipDrag = {
      ship: "",
      horizontal: true
    };
    this.shipInfo = {
      carrier: {
        length: 5
      },
      battleship: {
        length: 4
      },
      destroyer: {
        length: 3
      },
      patrol: {
        length: 2
      }
    };
    this.shipsToRender = {
      carrier: 1,
      battleship: 1,
      destroyer: 2,
      patrol: 1
    };
  }
  renderShip() {}

  toggleShip(ship) {
    this.shipDrag.ship = ship;
  }

  toggleDirection() {
    this.shipDrag.horizontal === true
      ? (this.shipDrag.horizontal = false)
      : (this.shipDrag.horizontal = true);
  }

  receiveAttack(x, y) {
    let msg = "";
    if (true) {
    } else {
      msg = "A ship has not been hit";
    }
    //renderMessage(msg);
  }
  appendShip(ship) {
    this.ships.push(ship);
  }

  renderMessage(msg) {}
}
