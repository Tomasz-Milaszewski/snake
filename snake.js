(function game() {
  let spaceCounter = 0;
  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      spaceCounter === 0
        ? action()
        : spaceCounter % 2 !== 0
        ? pauseOn()
        : pauseOff();
      spaceCounter++;
    }
  });

  // TODO
  // function pauseOn() {}
  // function pauseOff() {}

  function gameOver() {
    document.querySelector(".game-message").innerHTML =
      "Game over. Press Space to replay";
    spaceCounter = 0;
  }

  function action() {
    // canvas
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 200);
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
    let snake = [
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 }
    ];
    let currentHeadX = 3;
    let currentHeadY = 0;
    let incrX = 1;
    let incrY = 0;
    let previousCode = "";
    var snakeInterval;

    // snake interval
    function moveSnake(time) {
      drawSnake();
      snakeInterval = setInterval(() => {
        clearSnake();
        currentHeadX += incrX;
        currentHeadY += incrY;
        hitBorderOrItself();
        snake.unshift({ x: currentHeadX, y: currentHeadY });
        eatApple();
        drawSnake();
      }, time);
      return snakeInterval;
    }
    moveSnake(snakeTime);

    // hit border or itself
    function hitBorderOrItself() {
      if (
        currentHeadX < 0 ||
        currentHeadX > 19 ||
        currentHeadY < 0 ||
        currentHeadY > 19 ||
        snake.some(e => {
          return e.x === currentHeadX && e.y === currentHeadY;
        })
      ) {
        clearInterval(appleInterval);
        drawSnake();
        clearInterval(snakeInterval);
        gameOver();
      }
    }

    // eat apple
    function eatApple() {
      if (currentHeadX === appleX && currentHeadY === appleY) {
        clearInterval(appleInterval);
        appleX = Math.floor(Math.random() * cellsGrid);
        appleY = Math.floor(Math.random() * cellsGrid);
        setApple(appleTime);
      } else {
        snake.pop();
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
      switch (e.code) {
        case "ArrowLeft":
          if (previousCode === "ArrowRight") {
            return;
          }
          incrX = -1;
          incrY = 0;
          previousCode = e.code;
          break;
        case "ArrowUp":
          if (previousCode === "ArrowDown") {
            return;
          }
          incrX = 0;
          incrY = -1;
          previousCode = e.code;
          break;
        case "ArrowRight":
          if (previousCode === "ArrowLeft") {
            return;
          }
          incrX = 1;
          incrY = 0;
          previousCode = e.code;
          break;
        case "ArrowDown":
          if (previousCode === "ArrowUp") {
            return;
          }
          incrX = 0;
          incrY = 1;
          previousCode = e.code;
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
  }
})();
