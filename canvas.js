const WIDTH = 1200;
const HEIGHT = 380;
const CELL = 20;
const COL = WIDTH / CELL;
const ROW = HEIGHT / CELL;
const PERIOD = 10;
const COLOR_HEAD = "#f37a0c";
const COLOR_BODY = "#2dd2d1";
const COLOR_FOOD = "#8d1be4";

let canvas = document.querySelector('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
let ctx = canvas.getContext('2d');

let periodCount = 0;
let deltaX = 0, deltaY = 0;

class Node {
  constructor (x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc((this.x + 0.5) * CELL, (this.y + 0.5) * CELL, CELL / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  update(newX, newY) {
    this.x = newX;
    this.y = newY
  }

  updateRandomly() {
    this.x = Math.round(Math.random() * (COL - 1));
    this.y = Math.round(Math.random() * (ROW - 1));
  }
}

class Snake {
  constructor(snakeArray) {
    this.snakeArray = snakeArray;
  }

  draw() {
    for (let node of this.snakeArray) {
      node.draw();
    }
  } 

  update(dx = 0, dy = 0) {
    if (dx !== 0 || dy !== 0) {
      for (let i = this.getLength() - 1; i > 0; i--) {
        this.snakeArray[i].x = this.snakeArray[i - 1].x;
        this.snakeArray[i].y = this.snakeArray[i - 1].y;
      }
      this.getHead().x += dx; this.getHead().y += dy;
    }
  }
  getHead() { return this.snakeArray[0] }
  getTail() { return this.snakeArray[this.getLength() - 1] }
  getLength() { return this.snakeArray.length }

  makeLonger() {
    let newTail = this.getTail();
    this.snakeArray.push(new Node(newTail.x, newTail.y, COLOR_BODY));
  }

  isHitWall() {
    let head = this.getHead();
    return head.x == COL || head.x < 0 || head.y == ROW || head.y < 0;
  }

  isHitBody() {
    let head = this.getHead();
    let bodies = this.snakeArray.slice(1);
    for (let body of bodies) {
      if (head.x == body.x && head.y == body.y) return true;
    }
    return false;
  }

  isEat(food) {
    let head = this.getHead();
    return head.x == food.x && head.y == food.y;
  }
}

const food = new Node(25, 10, COLOR_FOOD);
let mySnake = new Snake([ 
  new Node(3, 3, COLOR_HEAD),
  new Node(2, 3, COLOR_BODY),
  new Node(1, 3, COLOR_BODY),
  new Node(0, 3, COLOR_BODY),
]);

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

window.addEventListener("keydown", function(e) {
  let isOpposite;
  switch (e.key) {
    case 'ArrowUp':
      isOpposite = mySnake.getHead().x == mySnake.snakeArray[1].x && mySnake.getHead().y > mySnake.snakeArray[1].y;
      if (!isOpposite) { deltaX = 0; deltaY = -1 }
      break;

    case 'ArrowRight':
      isOpposite = mySnake.getHead().x < mySnake.snakeArray[1].x && mySnake.getHead().y == mySnake.snakeArray[1].y;
      if (!isOpposite) { deltaX = 1; deltaY = 0 }
      break;

    case 'ArrowDown':
      isOpposite = mySnake.getHead().x == mySnake.snakeArray[1].x && mySnake.getHead().y < mySnake.snakeArray[1].y;
      if (!isOpposite) { deltaX = 0; deltaY = 1 }
      break;

    case 'ArrowLeft':
      isOpposite = mySnake.getHead().x > mySnake.snakeArray[1].x && mySnake.getHead().y == mySnake.snakeArray[1].y;
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
    // Bait appearence
    if (mySnake.isEat(food)) {
      do {
        food.updateRandomly();
      } while (mySnake.snakeArray.some(body => food.x == body.x && food.y == body.y));
      mySnake.makeLonger();
    }
    food.draw();

    // Update and draw my snake
    mySnake.update(deltaX, deltaY);
    mySnake.draw();

    periodCount = 0;
  }
  periodCount++;

  // Game over
  if (mySnake.isHitWall() || mySnake.isHitBody()) {
    alert("Game over!!!");
    deltaX = 0; deltaY = 0;
    mySnake = new Snake([ 
      new Node(3, 3, COLOR_HEAD),
      new Node(2, 3, COLOR_BODY),
      new Node(1, 3, COLOR_BODY),
      new Node(0, 3, COLOR_BODY),
    ])
  }
}
animate();