(function game() {
  const cellSize = 10;
  const cellsGrid = 20;

  // render snake
  let snake = [{ x: 0, y: 0 }];
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "green";
  ctx.fillRect(snake[0].x + 1, snake[0].y + 1, cellSize - 1, cellSize - 1);

  // apple's initial position
  let appleX = Math.floor(Math.random() * cellsGrid);
  let appleY = Math.floor(Math.random() * cellsGrid);
  
  // apple interval: random position change every 10 seconds
  function setApple(time) {
    drawApple(appleX, appleY);
    const appleInterval = setInterval(() => {
      ctx.clearRect(appleX * cellSize, appleY * cellSize, cellSize, cellSize);
      appleX = Math.floor(Math.random() * cellsGrid);
      appleY = Math.floor(Math.random() * cellsGrid);
      drawApple(appleX, appleY);
    }, time);
    return appleInterval;
  }
  setApple(2000);
  
  // draw apple
  function drawApple(x, y) {
    ctx.beginPath();
    ctx.arc(
      x * cellSize + cellSize / 2,
      y * cellSize + cellSize / 2,
      cellSize / 2,
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = "red";
    ctx.fill();
  }
})();
