const Cell = require('./cell.js');
const sampling = require('./array.js');

class Canvas {
  constructor() {
    this.x = Canvas.NUMROWS;
    this.y = Canvas.NUMROWS;

    this.cellHash = {};
    this.cells = this.newCells();
    this.traverse();
  }

  reset() {
    this.cells = this.newCells();
  }

  clickHandler(x,y) {
    console.log(this.cells[Math.floor(x/Canvas.CELLDIM)][Math.floor(y/Canvas.CELLDIM)].neighbors());
    // this.cells[Math.floor(x/Canvas.CELLDIM)][Math.floor(y/Canvas.CELLDIM)].clickMe();
  }

  traverse() {
    let cellStack = [this.cellHash[1]];
    let visited = [this.cellHash[1]];

    while(cellStack.length) {
      let myNeighbors = this.neighborCells(cellStack[cellStack.length-1], visited);
      if (myNeighbors.length === 0) {
        cellStack.pop();
        continue;
      }
      let nextCell = myNeighbors.sample();
      visited.push(nextCell);
      cellStack.push(nextCell);

      this.carvePathBetween(cellStack[cellStack.length-2], nextCell)
    }


    this.printStack(cellStack);
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
