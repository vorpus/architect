# Architect

[Live!](https://vorpus.github.io/architect)

## Background

Named after the maze designers of Inception, Architect is a demonstration of a maze building algorithm.

![maze](/images/maze.jpeg)
## How it works

### Maze generation
The maze is generated using a **depth first search** algorithm. A stack stores the current path; after we randomly visit a node, it is added to the stack and we search for the next path from the new node. When there are no unvisited nodes to traverse into, we pop from the stack until we find another possible path. This results in a maze that is completely connected, giving it a degree of difficulty.

```javascript
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
```

### Maze solution
In the same logic that generates the maze, we also obtain the solution by using the longest path from the origin. We can trace from start to finish using `this.path`.

## Tech

* HTML5 Canvas - Rendering the grid, including start/end points, and the solution path

* jQuery - Adds interaction with buttons
