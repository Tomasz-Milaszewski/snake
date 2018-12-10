(function game() {
  let spaceCounter = 0;
  let actionLock = false;
  let highscoresVisible = false;

  let scoreTable = [];
  let scores = [];
  let scoresSorted = [];
  let player = "Anonymous";
  let highscore = null;

  function handleScoreTable() {
    if (localStorage.length !== 0) {
      for (let i = 0; i < localStorage.length; i++) {
        scoreTable[(2 * i)] = localStorage.key(i);
        scoreTable[(2 * i + 1)] = JSON.parse(localStorage.getItem(localStorage.key(i)));
      }
    }
    console.log(scoreTable);
    scores = scoreTable.filter(el => typeof el === "number");
    if (scores.length > 0) {
      highscore = Math.max(...scores);
    }
    document.querySelector(".highscore span").innerHTML = highscore;
    for (let j = highscore; j >= 0; j--) {
      if (!scoresSorted.includes(j)) {
        scoresSorted.push(j);
      }
    }
    scoresSorted = scoresSorted.sort((a, b) => b - a);
  }
  handleScoreTable();

  function handleHighscoresDisplay() {
    const list = document.querySelector(".highscores ul");
    const button = document.querySelector(".highscores button");
    button.addEventListener("click", () => {
      if (highscoresVisible) {
        document.querySelectorAll(".highscores li").forEach(function(node) {
          node.remove();
        });
        list.style.display = "none";
        highscoresVisible = false;
        button.innerHTML = "Show Highscores";
      } else {
        list.style.display = "initial";
        button.innerHTML = "Hide Highscores";
        scoresSorted.map(e => {
          let li = document.createElement("li");
          let players = [];
          scoreTable.forEach((element, index) => {
            if (element === e) {
              players.push(scoreTable[index - 1]);
            }
          });
          players = players.join(", ");
          li.innerHTML = `${e}: ${players}`;
          players.length > 0 && list.appendChild(li);
        });
        highscoresVisible = true;
      }
    });
  }
  handleHighscoresDisplay();

  function handleNameInput() {
    const form = document.querySelector(".name-input-form");
    const label = document.querySelector(".name-input-form label");
    const input = document.querySelector(".name-input-form input");
    form.addEventListener("submit", event => {
      event.preventDefault();
      player = input.value;
      input.style.display = "none";
      label.innerHTML = `Good luck ${player}!<br>Personal best: ${JSON.parse(
        localStorage.getItem(player)
      ) || 0}`;
    });
  }
  handleNameInput();

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

  function pauseOn() {
    document.querySelector(".game-message").innerHTML =
      "Pause On<br>Press Space to resume";
    actionLock = true;
  }
  function pauseOff() {
    document.querySelector(".game-message").innerHTML = "Press Space to pause";
    actionLock = false;
  }

  function gameOver() {
    document.querySelector(".game-message").innerHTML =
      "Game over<br>Press Space to replay";
    spaceCounter = 0;
  }

  function action() {
    if (actionLock) {
      return;
    }
    // message
    document.querySelector(".game-message").innerHTML = "Press Space to pause";
    // canvas
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 200);
    // board
    const cellSize = 10;
    const cellsGrid = 20;
    // score
    let score = 0;
    document.querySelector(".score span").innerHTML = `Score: ${score}`;
    // apple's initial values
    const appleTime = 10000;
    let appleX = 1 + Math.floor(Math.random() * (cellsGrid - 1));
    let appleY = 1 + Math.floor(Math.random() * (cellsGrid - 1));
    var appleInterval;
    // mine initial values
    const mineTime = 30000;
    let mineX = null;
    let mineY = null;
    do {
      mineX = 1 + Math.floor(Math.random() * (cellsGrid - 1));
      mineY = 1 + Math.floor(Math.random() * (cellsGrid - 1));
    } while (mineX === appleX && mineY === appleY);
    var mineInterval;
    // snake's initial values
    let snakeTime = 200;
    let snake = [{ x: 0, y: 0 }];
    let currentHeadX = 0;
    let currentHeadY = 0;
    let incrX = 1;
    let incrY = 0;
    let previousCode = "";
    var clearSnakeTimeout = false;

    // snake interval
    function moveSnake() {
      if (!actionLock) {
        clearSnake();
        currentHeadX += incrX;
        currentHeadY += incrY;
        hitBorderOrItselfOrMine();
        snake.unshift({ x: currentHeadX, y: currentHeadY });
        eatApple();
        drawSnake();
      }
      !clearSnakeTimeout && setTimeout(moveSnake, snakeTime);
    }
    moveSnake();

    // hit border or itself or mine
    function hitBorderOrItselfOrMine() {
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
        clearInterval(mineInterval);
        drawSnake();
        clearSnakeTimeout = true;
        gameOver();
        updatePlayerHighscore();
      } else {
        if (currentHeadX === mineX && currentHeadY === mineY) {
          clearInterval(appleInterval);
          clearInterval(mineInterval);
          snake.pop();
          clearSnakeTimeout = true;
          drawSnake();
          gameOver();
          updatePlayerHighscore();
        }
      }
    }

    //update player's highscore
    function updatePlayerHighscore() {
      if (!scoreTable.includes(player)) {
        localStorage.setItem(player, JSON.stringify(score));
        console.log(scoreTable);
        handleScoreTable();
        console.log(scoreTable);
      }
      if (score > localStorage.getItem(player)) {
        localStorage.setItem(player, JSON.stringify(score));
        console.log(scoreTable);
        handleScoreTable();
        console.log(scoreTable);
        const label = document.querySelector(".name-input-form label");
        label.innerHTML = `Good luck ${player}!<br>Personal best: ${score ||
          0}`;
      }
      // if (score > Math.max(...scores)) {
      //   console.log("new highscore");
      //   highscore = score;
      //   document.querySelector(".highscore span").innerHTML = highscore;
      // }
    }

    // eat apple
    function eatApple() {
      if (currentHeadX === appleX && currentHeadY === appleY) {
        score++;
        document.querySelector(".score span").innerHTML = `Score: ${score}`;
        clearInterval(appleInterval);
        do {
          appleX = Math.floor(Math.random() * cellsGrid);
          appleY = Math.floor(Math.random() * cellsGrid);
        } while (
          snake.some(e => {
            return e.x === appleX && e.y === appleY;
          }) &&
          (mineX === appleX && mineY === appleY)
        );
        drawAppleOrMine(appleX, appleY, "red");
        setApple(appleTime);
        if (score % 5 === 0) {
          snakeTime = snakeTime / 1.25;
        }
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
    drawSnake();

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
      if (actionLock) {
        return;
      }
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
      appleInterval = setInterval(() => {
        if (actionLock) {
          return;
        }
        ctx.clearRect(appleX * cellSize, appleY * cellSize, cellSize, cellSize);
        do {
          appleX = Math.floor(Math.random() * cellsGrid);
          appleY = Math.floor(Math.random() * cellsGrid);
        } while (
          snake.some(e => {
            return e.x === appleX && e.y === appleY;
          }) &&
          (mineX === appleX && mineY === appleY)
        );
        drawAppleOrMine(appleX, appleY, "red");
      }, time);
      return appleInterval;
    }
    setApple(appleTime);

    // mine interval: random position change every 30 seconds
    function setMine(time) {
      mineInterval = setInterval(() => {
        if (actionLock) {
          return;
        }
        ctx.clearRect(mineX * cellSize, mineY * cellSize, cellSize, cellSize);
        do {
          mineX = Math.floor(Math.random() * cellsGrid);
          mineY = Math.floor(Math.random() * cellsGrid);
        } while (
          snake.some(e => {
            return e.x === mineX && e.y === mineY;
          }) &&
          (mineX === appleX && mineY === appleY)
        );
        drawAppleOrMine(mineX, mineY, "black");
      }, time);
      return mineInterval;
    }
    setMine(mineTime);

    // draw apple and mine
    function drawAppleOrMine(x, y, color) {
      ctx.beginPath();
      ctx.arc(
        x * cellSize + cellSize / 2,
        y * cellSize + cellSize / 2,
        cellSize / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.fillStyle = color;
      ctx.fill();
    }
    drawAppleOrMine(appleX, appleY, "red");
    drawAppleOrMine(mineX, mineY, "black");
  }
})();
