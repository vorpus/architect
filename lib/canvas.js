const Cell = require('./cell.js');
const sampling = require('./array.js');

class Canvas {
  constructor() {
    this.x = Canvas.NUMROWS;
    this.y = Canvas.NUMROWS;

    this.cellHash = {};
    this.cells = this.newCells();
    this.traverse();

    this.startPoint;
    this.finishPoint;
    this.path;
  }

  reset() {
    this.cells = this.newCells();
    this.traverse();
  }

  handleDirection(keyCode, e) {
    switch(keyCode) {
      case 87:
      case 38:
        e.preventDefault();
        this.move([0,-1]);
        break;
      case 65:
      case 37:
        e.preventDefault();
        this.move([-1,0]);
        break;
      case 83:
      case 40:
        e.preventDefault();
        this.move([0,1]);
        break;
      case 68:
      case 39:
        e.preventDefault();
        this.move([1,0]);
        break;
    }
  }

  move(direction) {
    let newX = this.startPoint.x + direction[0];
    let newY = this.startPoint.y + direction[1];

    if (this.cells[newX][newY].status !== 'wall') {
      this.startPoint.carve();
      this.startPoint = this.cells[newX][newY];
      this.startPoint.setStart();
    }

    if (this.startPoint.cellNum === this.finishPoint.cellNum) {
      this.reset();
    }
  }

  getRandomPoint() {
    let randomPoint;
    while (!randomPoint || randomPoint.status ==='wall') {
      let randomRow = this.cells.sample();
      randomPoint = randomRow.sample();
    }
    return randomPoint;
  }

  solve() {
    this.path.forEach((pathPoint, idx) => {
      if (idx === 0 || idx === this.path.length-1) {

      } else {
        pathPoint.setSolution();
      }
    });
  }

  traverse() {
    let cellStack = [this.cellHash[1]];
    let visited = [this.cellHash[1]];
    let longestLength = 0;

    while(cellStack.length) {
      let myNeighbors = this.neighborCells(cellStack[cellStack.length-1], visited);
      if (myNeighbors.length === 0) {
        if (cellStack.length > longestLength) {
          this.path = cellStack.slice(0);
          longestLength = cellStack.length;
          this.finishPoint = cellStack[cellStack.length-1];
        }
        cellStack.pop();
        continue;
      }
      let nextCell = myNeighbors.sample();
      visited.push(nextCell);
      cellStack.push(nextCell);
      this.carvePathBetween(cellStack[cellStack.length-2], nextCell)
    }
    this.startPoint = this.cellHash[1];
    this.cellHash[1].setStart();
    this.finishPoint.setFinish();
  }

  carvePathBetween(cellA, cellB) {
    let pathX = (cellA.x + cellB.x)/2;
    let pathY = (cellA.y + cellB.y)/2;

    this.cells[pathX][pathY].carve();
  }

  printStack(cellStack) {
    let elements = [];
    cellStack.forEach((cell) => {
      elements.push(cell.cellNum);
    });
    console.log(elements.join(', '))
  }

  newCells() {
    let newGrid = [];
    let cellNum = 1;
    for (let i = 0; i < this.x; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.y; j++) {
        if ( i % 2 === 1 && j % 2 === 1) {
          newGrid[i][j] = new Cell(i, j, 'path', cellNum);
          this.cellHash[cellNum] = newGrid[i][j];
          cellNum++;
        } else {
          newGrid[i][j] = new Cell(i, j, 'wall', '');
        }
      }
    }
    return newGrid;
  }

  draw(ctx) {
    ctx.fillStyle = Canvas.BG_COLOR;
    ctx.fillRect(0, 0, Canvas.DIM, Canvas.DIM);

    ctx.strokeStyle = '#222222'
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        this.cells[i][j].draw(ctx);
      }
    }
  }

  neighborCells(cell, visited) {
    let neighbors = cell.neighbors();
    let cellNeighbors = [];
    neighbors.forEach((neighborCoord) => {
      let targetCell = this.cells[neighborCoord[0]][neighborCoord[1]];
      if (!visited.includes(targetCell)) {
        cellNeighbors.push(targetCell)
      }
    });
    return cellNeighbors;
  }
}

Canvas.BG_COLOR = "#ffffff";
Canvas.DIM = 710;
Canvas.NUMROWS = 71;
Canvas.CELLDIM = Canvas.DIM/Canvas.NUMROWS;

module.exports = Canvas;
