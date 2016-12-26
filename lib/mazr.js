const Canvas = require('./canvas');

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

  $(document).on("keydown", (e) => {
    thisCanvas.handleDirection(e.keyCode, e);
    thisCanvas.draw(ctx);
  });

  $('.pathfind').on("click", (e) => {
    thisCanvas.reset();
    thisCanvas.draw(ctx);
  });

  $('.solve').on("click", (e) => {
    thisCanvas.solve();
    thisCanvas.draw(ctx);
  });
})
