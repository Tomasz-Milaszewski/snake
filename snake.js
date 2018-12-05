function game() {
  let snake = [{ x: 0, y: 0 }];
  const cellSize = 10;

  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "green";
  ctx.fillRect(snake[0].x + 1, snake[0].y + 1, cellSize - 1, cellSize - 1);
}
game();
