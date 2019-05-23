// MAIN GAME SETTINGS
const consts = {
  gravity: 2,
  floor: 460,
  bX: 40,
  birdWidth: 40,
  birdHeight: 30,
  spaceBetweenPipes: 100,
  pipeHeight: 190,
  pipeWidth: 40,
  cvs: document.getElementById('canvas'),
  ctx: document.getElementById('canvas').getContext("2d")
};

// GAME Data
const gameData = {
  score: 0,
  bY: 200,
  lost: false,
  pipes: [],
  highScore: 0,
  lastScore: 0,
  birdFrame: 0
};

// IMAGES/ SOUNDS
const assets = {
  scoreSound: new Audio("assets/music/score.mp3"),
  hitSound: new Audio("assets/music/hit.mp3"),
  birdFly: [
    new Image(),
    new Image(),
    new Image()
  ],
  topPipe: new Image(),
  bottomPipe: new Image(),
  bottom: new Image()
};

class Data {
  static loadData() {
    gameData.highScore = localStorage.getItem('highScore') || 0;
    gameData.lastScore = localStorage.getItem('lastScore') || 0;

    this.updateDataForUser();
  }
  static saveData() {
    localStorage.setItem('highScore', gameData.highScore);
    localStorage.setItem('lastScore', gameData.lastScore);
  }
  static updateData() {
    gameData.lastScore = gameData.score;
    if(gameData.score > gameData.highScore) gameData.highScore = gameData.score;
    this.saveData();
    this.updateDataForUser();
  }
  static updateDataForUser() {
    document.getElementById('lastScore').innerHTML = `Last score: ${gameData.lastScore}`;
    document.getElementById('highScore').innerHTML = `High Score: ${gameData.highScore}`;
  }

}
class Canvas {
  static draw() {

    gameData.bY += consts.gravity;
    if(gameData.bY > consts.floor - consts.birdHeight) {
      gameData.lost = true;
    }

    // CLEAR CANVAS
    consts.ctx.clearRect(0, 0, consts.cvs.width, consts.cvs.height);

    // IMAGES
    gameData.birdFrame ++;
    if(gameData.birdFrame > 2) gameData.birdFrame = 0;
    consts.ctx.drawImage(assets.birdFly[gameData.birdFrame], consts.bX, gameData.bY, consts.birdWidth, consts.birdHeight); // BIRD


    /////////////////////////////// PIPE CREATION ///////////////////////////
    for(let i = 0; i < gameData.pipes.length; i ++) {
      gameData.pipes[i].x --;

      if(gameData.pipes[i].x <= consts.cvs.width) {
        consts.ctx.drawImage(assets.topPipe, gameData.pipes[i].x, gameData.pipes[i].y, consts.pipeWidth, consts.pipeHeight); // TOP PIPE
        consts.ctx.drawImage(assets.bottomPipe, gameData.pipes[i].x, consts.pipeHeight + gameData.pipes[i].y + consts.spaceBetweenPipes, consts.pipeWidth, consts.cvs.height - consts.pipeHeight - consts.spaceBetweenPipes); // BOTTOM PIPE

        if(gameData.bY < gameData.pipes[i].y + consts.pipeHeight && gameData.pipes[i].x >= consts.bX - consts.birdWidth && gameData.pipes[i].x <= consts.bX + consts.birdWidth || //  TOP
          gameData.bY + consts.birdHeight > consts.pipeHeight + gameData.pipes[i].y + consts.spaceBetweenPipes && gameData.pipes[i].x >= consts.bX - consts.birdWidth && gameData.pipes[i].x <= consts.bX + consts.birdWidth) { // BOTTOM
            gameData.lost = true;
          }
        }
        if(gameData.pipes[i].x === consts.bX) {
          gameData.score ++;
          assets.scoreSound.play();
        }
        if(gameData.pipes[i].x + consts.pipeWidth <= 0) {
          gameData.pipes = gameData.pipes.slice(i + 1);
        }

      }


      // SCORE TEXT
      consts.ctx.strokeStyle = "white";
      consts.ctx.font = "bold 45px FlappyBirdy";
      consts.ctx.textAlign = "center";
      consts.ctx.strokeText(gameData.score, canvas.width / 2, 60);

      // BOTTOM IMAGE
      consts.ctx.drawImage(assets.bottom, 0, consts.floor, consts.cvs.width, consts.cvs.height - consts.floor);

      if(gameData.lost) {
        assets.hitSound.play();
        Game.gameOver();
        return;
      }

      requestAnimationFrame(Canvas.draw);
    }
  static createPipe() {
      if(document.visibilityState == 'hidden') return;
      gameData.pipes.push({
        x: consts.cvs.width,
        y: -Math.random() * 50
      });
    }
  static flyUp() {
    if(gameData.bY - 40 < 0) {
      gameData.bY = 0;
    } else gameData.bY -= 40;

    if(!gameData.lost) {
      let wingSound = new Audio("assets/music/wing.mp3");
      wingSound.play();
    }
  }
}
class Controls {
  constructor() {
    document.addEventListener("keydown", event => {
      if(event.keyCode === 32) Canvas.flyUp();
    });
    document.addEventListener("click", Canvas.flyUp);

    document.getElementById('restart').addEventListener("click", () => {
      document.getElementById('restart').style.visibility = "hidden";

      gameData.score = 0;
      gameData.pipes = [];
      gameData.lost = false;
      gameData.bY = 200;

      Canvas.draw();
    })
  }
}
class Game {
  constructor() {
    Game.loadAssets();
    Data.loadData();

    Canvas.draw();

    new Controls();

    setInterval(function() {
      Canvas.createPipe();
    }, 2000);

  }
  static gameOver() {
    document.getElementById('restart').style.visibility = "visible";
    Data.updateData();
  }
  static loadAssets() {
    assets.birdFly[0].src = "assets/img/birdFly1.png";
    assets.birdFly[1].src = "assets/img/birdFly2.png";
    assets.birdFly[2].src = "assets/img/birdFly3.png";

    assets.topPipe.src = "assets/img/pipeTop.png";
    assets.bottomPipe.src = "assets/img/pipeBottom.png";
    assets.bottom.src = "assets/img/bottom.png";
  }
}

new Game();
