class Cell {
  constructor(i, j, status, cellNum) {
    this.x = i;
    this.y = j;

    this.status = status;
    this.cellNum = cellNum;
  }

  clickMe() {
    this.toggle();
  }

  toggle() {
    if (this.status === 'path') {
      this.status = 'wall';
    } else {
      this.status = 'path';
    }
  }

  carve() {
    this.status = 'path';
  }

  draw(ctx) {
    ctx.fillStyle = '#000000'
    let cellDim = Cell.GRIDSIZE;
    ctx.font = "16px sans-serif";

    if (this.status === 'wall') {
      ctx.fillRect(cellDim*this.x, cellDim*this.y, cellDim, cellDim);
    } else {
      ctx.strokeRect(cellDim*this.x, cellDim*this.y, cellDim, cellDim);
      // ctx.fillText(this.cellNum, cellDim*this.x, cellDim*this.y+15);
    }
  }

  neighbors() {
    const neighborActions = [[2,0], [0,2], [-2,0], [0,-2]]
    const gdSz = Cell.GRIDSIZE;
    let neighborCells = [];
    neighborActions.forEach((move) => {
      let newX = move[0] + this.x;
      let newY = move[1] + this.y;
      if (newX < Cell.CELLS_X && newX >= 0 && newY < Cell.CELLS_Y && newY >= 0) {
        neighborCells.push([newX, newY]);
      }
    });
    return neighborCells;
  }

}

Cell.GRIDSIZE = 10;
Cell.CELLS_X = 71;
Cell.CELLS_Y = 71;

module.exports = Cell;
