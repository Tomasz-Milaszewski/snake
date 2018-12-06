(function game() {
  // canvas
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  // board
  const cellSize = 10;
  const cellsGrid = 20;
  // apple's initial values
  const appleTime = 10000;
  let appleX = Math.floor(Math.random() * cellsGrid);
  let appleY = Math.floor(Math.random() * cellsGrid);
  var appleInterval;
  // snake's initial values
  const snakeTime = 200;
  let snake = [{ x: 0, y: 0 }];
  let currentX = 0;
  let currentY = 0;
  let incrX = 1;
  let incrY = 0;
  var snakeInterval;

  // snake interval
  function moveSnake(time) {
    drawSnake();
    snakeInterval = setInterval(() => {
      clearSnake();
      currentX += incrX;
      currentY += incrY;
      eatApple();
      snake[0].x = currentX;
      snake[0].y = currentY;
      drawSnake();
    }, time);
    return snakeInterval;
  }
  moveSnake(snakeTime);

  // eat apple
  function eatApple() {
    if (currentX === appleX && currentY === appleY) {
      clearInterval(appleInterval);
      appleX = Math.floor(Math.random() * cellsGrid);
      appleY = Math.floor(Math.random() * cellsGrid);
      setApple(appleTime);
    }
  }

  // clear snake
  function clearSnake() {
    for (let i = 0; i < snake.length; i++) {
      ctx.clearRect(
        snake[i].x * cellSize,
        snake[i].y * cellSize,
        cellSize,
        cellSize
      );
    }
  }

  // draw snake
  function drawSnake() {
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(
        snake[i].x * cellSize + 1,
        snake[i].y * cellSize + 1,
        cellSize - 1,
        cellSize - 1
      );
    }
  }

  // move listener
  document.addEventListener("keydown", moveHandler);

  // move handler
  function moveHandler(e) {
    switch (e.keyCode) {
      case 37:
        incrX = -1;
        incrY = 0;
        break;
      case 38:
        incrX = 0;
        incrY = -1;
        break;
      case 39:
        incrX = 1;
        incrY = 0;
        break;
      case 40:
        incrX = 0;
        incrY = 1;
        break;
    }
  }

  // apple interval: random position change every 10 seconds
  function setApple(time) {
    drawApple(appleX, appleY);
    appleInterval = setInterval(() => {
      ctx.clearRect(appleX * cellSize, appleY * cellSize, cellSize, cellSize);
      appleX = Math.floor(Math.random() * cellsGrid);
      appleY = Math.floor(Math.random() * cellsGrid);
      drawApple(appleX, appleY);
    }, time);
    return appleInterval;
  }
  setApple(appleTime);

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
