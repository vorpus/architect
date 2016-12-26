/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Canvas = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", () => {
	  const canvas = document.getElementById('canvas');
	
	  canvas.width = Canvas.DIM;
	  canvas.height = Canvas.DIM;
	
	  const ctx = canvas.getContext('2d');
	
	  ctx.fillStyle = Canvas.BG_COLOR;
	  ctx.fillRect(0, 0, Canvas.DIM, Canvas.DIM);
	
	  const thisCanvas = new Canvas();
	
	  thisCanvas.draw(ctx);
	
	  function getMousePos(docCanvas, evt) {
	    var rect = docCanvas.getBoundingClientRect();
	    return {
	      x: evt.clientX - rect.left,
	      y: evt.clientY - rect.top
	    };
	  }
	
	  $('canvas').on("click", (e) => {
	    let clickedPos = getMousePos(e.target, e);
	    thisCanvas.clickHandler(clickedPos.x, clickedPos.y);
	    thisCanvas.draw(ctx);
	  });
	
	  $('.pathfind').on("click", (e) => {
	    thisCanvas.reset();
	    thisCanvas.traverse();
	    thisCanvas.draw(ctx);
	  });
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Cell = __webpack_require__(2);
	const sampling = __webpack_require__(3);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	Array.prototype.sample = function(){
	  return this[Math.floor(Math.random()*this.length)];
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map