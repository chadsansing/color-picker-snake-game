// Original project forked from https://github.com/JDStraughan/html5-snake
// under a MIT License http://opensource.org/licenses/MIT
// and Copyright (c) 2013 Jason D. Straughan

// Fork by Chad Sansing and Luke Pacholski under an Mozilla Public License https://www.mozilla.org/en-US/MPL/.
//Repo at https://github.com/chadsansing/color-picker-snake-game.

//Sound effect assist from http://cssdeck.com/labs/classic-snake-game-with-html5-canvas.
//Soud effectes last updated on 5/17/16 from Luke Pacholski's https://github.com/flukeout/simple-sounds.

var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");
var startMusic = document.getElementById("press-space");
var foodMusic = document.getElementById("eat-food");
var gameOverMusic = document.getElementById("game-over");
// themeMusic.volume = 0;
// themeMusic.pause();
// themeMusic.currentTime = 0;
// themeMusic.play();
var game, snake, food;

game = {

  score: 0,
  fps: 8,
  over: false,
  message: null,
  musicButtonLabel: document.getElementById("music-button-label"),
  themeMusicEl: document.getElementById("theme-music"),
  musicOn: false,
  // music: [77],
  // lastKey: null,
  //
  // addEventListener("keydown", function (e) {
  //   this.lastKey = getKey(e.keyCode);
  //   if (this.lastKey == 'music') {
  //     toggleMusic();
  // }, false);
  
  toggleMusic: function() {
    if(this.musicOn == false) {
      this.musicOn = true;
      this.themeMusicEl.volume = .33;
      this.musicButtonLabel.innerText = "Music Off";
    } else {
      this.musicOn = false;
      this.themeMusicEl.volume = 0;
      this.musicButtonLabel.innerText = "Music On";
    }
  },
  
  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 12;
    snake.init();
    food.set();
    this.themeMusicEl.play();
    this.themeMusicEl.volume = 0;
  },
  

  stop: function() {
    game.over = true;
    game.message = 'GAME OVER - PRESS SPACEBAR';
  },

  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  drawScore: function() {
    context.fillStyle = 'transparent';
    context.font = (canvas.height) + 'px sans-serif';
    context.textAlign = 'center';
    context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
  },
  
  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#000';
      context.strokeStyle = '#none';
      context.font = (canvas.height / 14) + 'px sans-serif';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      //context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
	
  },

  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

};

snake = {

  size: canvas.width / 40,
  x: null,
  y: null,
  color: '#0F0',
  direction: 'left',
  playerDirection: 'left',
  sections: [], 

  init: function() {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height / 2 + snake.size / 2;
    for (var i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) {
      snake.sections.push(i + ',' + snake.y);
    }
  },

//Need to fix this to prevent killing yourself by doubling back w/in a tick.

  move: function() {
    if(snake.playerDirection != inverseDirection[snake.direction]) {
      snake.direction = snake.playerDirection;
      ''}
    switch (snake.direction) {
      case 'up':
        snake.y -= snake.size;
        break;
      case 'down':
        snake.y += snake.size;
        break;
      case 'left':
        snake.x -= snake.size;
        break;
      case 'right':
        snake.x += snake.size;
        break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push(snake.x + ',' + snake.y);
  },

  draw: function() {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
    }
  },

  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },

  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      gameOverMusic.pause();
      gameOverMusic.currentTime = 0;
      gameOverMusic.play();
      game.stop();
    }
  },

  isCollision: function(x, y) {
    if (x < snake.size / 2 ||
        x > canvas.width ||
        y < snake.size / 2 ||
        y > canvas.height ||
        snake.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
  },

  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) {
      // Note - This code runs when the snake eats the food
      snake.color = food.color;
      game.score++;
      foodMusic.pause();
      foodMusic.currentTime = 0;
      foodMusic.play();
      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      food.set();

    } else {
      snake.sections.shift();
    }
  }

};

food = {
  size: null,
  x: null,
  y: null,
  color: "",
  rgbValue: "",  // Note - we don't even need to set it here, since we set it again every time food is made

	colorList: function(color) {

		var node = document.createElement("DIV");
		node.setAttribute("style", "background-color:" + color + ";");
    node.innerText = color + ", " + hexToRgb(color);
		document.getElementById("my-colors").appendChild(node);
	
	},

  set: function() {
    // Note - This is where new food is generated, and where we want to set the food color
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
    food.color='#' + ("000000" + Math.random().toString(16).slice(2,8).toUpperCase()).slice(-6);
    
  	var rgbFood =hexToRgb(food.color);
  	this.rgbFood = rgbFood;
  
    document.body.style.backgroundColor = food.color;
    document.getElementById("hexColorCode").innerHTML = "<span style='font-weight: 700;'>" + food.color + "</span>";
    document.getElementById("rgbColorCode").innerHTML = "<span style='font-weight: 700;'>" + hexToRgb(food.color) + "</span>";
  	document.getElementById("my-score").innerHTML = "<span style='font-weight: 700;'>" + game.score + "</span>";

  	this.colorList(food.color);
	
  },

  draw: function() {
	  
	  if (this.rgbFood == undefined) {
  	    context.fillStyle = '#777';
  	    context.font = (canvas.height/20) + 'px monospace';
  	    context.textAlign = 'center';
  	    context.fillText("", canvas.width / 2, canvas.height * .97);
  	    game.drawBox(food.x, food.y, food.size, food.color); // Note - This draws the food every frame     
	  }
	  else {
	  	
	    context.fillStyle = '#777';
	    context.font = (canvas.height/16) + 'px monospace';
	    context.textAlign = 'center';
	    context.fillText(food.color + ", " + this.rgbFood, canvas.width / 2, canvas.height * .97);
	    game.drawBox(food.x, food.y, food.size, food.color); // Note - This draws the food every frame
	  }
  },
  
};


var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

var keys = {
  up: [38, 75],
  down: [40, 74],
  left: [37, 65],
  right: [39, 68],
  music: [77, 77],
  start_game: [13, 32]
};

function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}

addEventListener("keydown", function (e) {
  var lastKey = getKey(e.keyCode);
  if (lastKey == 'start_game') {
    e.preventDefault();
  }
  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0) {
    snake.playerDirection = lastKey;
    e.preventDefault();
  } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
    game.start();
    startMusic.pause();
    startMusic.currentTime = 0;
    startMusic.play();
    e.preventDefault();
  }
}, false);

var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame;

function loop() {
  if (game.over == false) {
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }  
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}

requestAnimationFrame(loop);

function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  return "rgb("+r+", "+g+", "+b+")";
}