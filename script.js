let score = 0;
const gravity = 1;

let bY = 200;
const bX = 40;

// BOTTOM IMAGE
const floor = 460;

const birdWidth = 40;
const birdHeight = 30;

const spaceBetweenPipes = 100;
const pipeHeight = 190;
const pipeWidth = 40;


let lost = false;



/////////////////// CANVAS /////////////////////
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext("2d");


let maxX = cvs.width;

let pipes = [

];


// MUSIC
let scoreSound = new Audio("assets/music/score.mp3");
let hitSound = new Audio("assets/music/hit.mp3");


// IMAGES
let birdFly = [
  new Image(),
  new Image(),
  new Image()
];
// birdFly[0] = new Image();
birdFly[0].src = "assets/img/birdFly1.png";

// let birdFly2 = new Image();
birdFly[1].src = "assets/img/birdFly2.png";

// let birdFly3 = new Image();
birdFly[2].src = "assets/img/birdFly3.png";

let topPipe = new Image();
topPipe.src = "assets/img/pipeTop.png";

let bottomPipe = new Image();
bottomPipe.src = "assets/img/pipeBottom.png";

let bottom = new Image();
bottom.src = "assets/img/bottom.png";
////////////////////////////

let birdFrame = 0;

function draw() {

  bY += 2;
  if(bY > floor - birdHeight) {
    lost = true;
  }

  // CLEAR CANVAS
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  // IMAGES
  birdFrame ++;
  if(birdFrame > 2) birdFrame = 0;
  ctx.drawImage(birdFly[birdFrame], bX, bY, birdWidth, birdHeight); // BIRD


  /////////////////////////////// PIPE CREATION ///////////////////////////
  let max = 0;

  for(let i = 0; i < pipes.length; i ++) {
    pipes[i].x --;

    if(pipes[i].x > max) max = pipes[i].x;

    if(pipes[i].x <= cvs.width) {
      ctx.drawImage(topPipe, pipes[i].x, pipes[i].y, pipeWidth, pipeHeight); // TOP PIPE
      ctx.drawImage(bottomPipe, pipes[i].x, pipeHeight + pipes[i].y + spaceBetweenPipes, pipeWidth, cvs.height - pipeHeight - spaceBetweenPipes); // BOTTOM PIPE

      if(bY < pipes[i].y + pipeHeight && pipes[i].x >= bX - birdWidth && pipes[i].x <= bX + birdWidth || //  TOP
        bY + birdHeight > pipeHeight + pipes[i].y + spaceBetweenPipes && pipes[i].x >= bX - birdWidth && pipes[i].x <= bX + birdWidth) { // BOTTOM
        lost = true;
      }
    }
    if(pipes[i].x === bX) {
      score ++;
      scoreSound.play();
    }
    if(pipes[i].x + pipeWidth <= 0) {
      pipes = pipes.slice(i + 1);
    }

  }


  // SCORE TEXT
  ctx.strokeStyle = "white";
  ctx.font = "bold 45px FlappyBirdy";
  ctx.textAlign = "center";
  scoreText = ctx.strokeText(score, canvas.width / 2, 60);

  // BOTTOM
  ctx.drawImage(bottom, 0, floor, cvs.width, cvs.height - floor);

  if(lost) {
    hitSound.play();
    gameOver();
    return;
  }

  requestAnimationFrame(draw);
}
function gameOver() {
  alert("You lost");
}
function createPipe() {
  pipes.push({
    x: maxX,
    y: -Math.random() * 50
  });
}

draw();

setInterval(function() {
  createPipe();
}, 2000);

document.addEventListener("keydown", event => {
  if(event.keyCode === 32) {
    if(bY - 40 < 0) {
      bY = 0;
    } else bY -= 40;

    let wingSound = new Audio("assets/music/wing.mp3");
    wingSound.play();
  }
});

document.addEventListener("click", () => {
  score = 0;
  pipes = [];
  lost = false;
  bY = 200;

  draw();
})
