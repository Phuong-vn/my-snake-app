const WIDTH = 1200;
const HEIGHT = 380;
const CELL = 20;
const COL = WIDTH / CELL;
const ROW = HEIGHT / CELL;
const PERIOD = 10;
const BASE_SNAKE = JSON.stringify([ {x: 3, y: 3}, { x: 2, y: 3}, {x: 1, y: 3}, {x: 0, y: 3} ])
const bait = {
  x: 25,
  y: 10,
  randomBait() {
    this.x = Math.round(Math.random() * COL);
    this.y = Math.round(Math.random() * ROW);
  }
};

let canvas = document.querySelector('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
let ctx = canvas.getContext('2d');

let mySnake = JSON.parse(BASE_SNAKE);
let periodCount = 0;
let deltaX = 0, deltaY = 0;

// bon mua lai sang
function drawMap () {
  for (let i = 1; i < COL; i++) {
    ctx.beginPath();
    ctx.moveTo(CELL * i, 0);
    ctx.lineTo(CELL * i, HEIGHT);
    ctx.stroke();
  }
  
  for (let i = 1; i < ROW; i++) {
    ctx.beginPath();
    ctx.moveTo(0, CELL * i);
    ctx.lineTo(WIDTH, CELL * i);
    ctx.stroke();
  }
}

function isHitBody([ head, ...bodies ]) {
  for (let body of bodies) {
    if (head.x == body.x && head.y == body.y) return true;
  }
  return false;
}

function isHitWall(head) {
  return head.x == COL || head.x < 0 || head.y == ROW || head.y < 0;
}

function isBaitEaten(currentBait, head) {
  return currentBait.x == head.x && currentBait.y == head.y;
}

function addMoreTailToMySnake(snake) {
  // This function is going to create a new tail for the snake
  // t is the temporatory variable in oder to create new tail
  let newTail;
  let endBody = snake.slice(-2, -1);
  let oldTail = snake.slice(-1);
  if (endBody.x == oldTail.x) {
    let t = endBody.y - oldTail.y;
    newTail = {x: oldTail.x, y: oldTail.y - t};
  } else {
    let t = endBody.x - oldTail.x;
    newTail = {x: oldTail.x - t, y: oldTail.y};
  }
  mySnake.push(newTail);
}

window.addEventListener("keydown", function(e) {
  console.log(e.key)
  let isOpposite;
  switch (e.key) {
    case 'ArrowUp':
      isOpposite = mySnake[0].x == mySnake[1].x && mySnake[0].y > mySnake[1].y;
      if (!isOpposite) { deltaX = 0; deltaY = -1 }
      break;

    case 'ArrowRight':
      isOpposite = mySnake[0].x < mySnake[1].x && mySnake[0].y == mySnake[1].y;
      if (!isOpposite) { deltaX = 1; deltaY = 0 }
      break;

    case 'ArrowDown':
      isOpposite = mySnake[0].x == mySnake[1].x && mySnake[0].y < mySnake[1].y;
      if (!isOpposite) { deltaX = 0; deltaY = 1 }
      break;

    case 'ArrowLeft':
      isOpposite = mySnake[0].x > mySnake[1].x && mySnake[0].y == mySnake[1].y;
      if (!isOpposite) { deltaX = -1; deltaY = 0; }      
      break;
  }
})

function animate () {
  requestAnimationFrame(animate);

  // Set interval
  if (periodCount == PERIOD) {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Update frame
    // drawMap();
    if (deltaX !== 0 || deltaY !== 0) {
      for (let i = mySnake.length - 1; i > 0; i--) {
        mySnake[i].x = mySnake[i - 1].x; mySnake[i].y = mySnake[i - 1].y;
      }
      mySnake[0].x += deltaX; mySnake[0].y += deltaY;
    }

    // Coloring and round mySnake
    for (let i in mySnake) {
      if (i == 0) {
        ctx.beginPath();
        ctx.fillStyle = "#f37a0c"
        ctx.arc((mySnake[i].x + 0.5) * CELL, (mySnake[i].y + 0.5) * CELL, CELL / 2, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.fillRect(mySnake[i].x * CELL, mySnake[i].y * CELL, CELL, CELL);
      } else {
        ctx.beginPath();
        ctx.fillStyle = "#2dd2d1"
        ctx.arc((mySnake[i].x + 0.5) * CELL, (mySnake[i].y + 0.5) * CELL, CELL / 2, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.fillRect(mySnake[i].x * CELL, mySnake[i].y * CELL, CELL, CELL);
      }
    }

    // Bait appearence
    ctx.beginPath();
    ctx.fillStyle = "#8d1be4"
    ctx.arc((bait.x + 0.5) * CELL, (bait.y + 0.5) * CELL, CELL / 2, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.fillRect(bait.x * CELL, bait.y * CELL, CELL, CELL);
    if (isBaitEaten(bait, mySnake[0])) {
      do {
        bait.randomBait();
      } while (mySnake.some(body => bait.x == body.x && bait.y == body.y));
      addMoreTailToMySnake(mySnake);
    }
    
    periodCount = 0;
  }
  periodCount++;

  // Game over
  if (isHitWall(mySnake[0]) || isHitBody(mySnake)) {
    alert("Game over!!!");
    deltaX = 0; deltaY = 0;
    mySnake = JSON.parse(BASE_SNAKE);
    bait.x = Math.round(Math.random() * COL);
    bait.y = Math.round(Math.random() * ROW);
  }
}
animate();