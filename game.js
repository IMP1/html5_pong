/* Declare constants */
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;
var FPS = 60;
var BG_COLOUR = "#8CF";

/* Create canvas object */
var canvasElement = document.getElementById("game-canvas");
var canvas = canvasElement.getContext("2d");

/* Keep track of mouse position */
var mouse = {x: 0, y: 0};
document.addEventListener('mousemove', function(e){
    var winX = (e.clientX || e.pageX);
    var winY = (e.clientY || e.pageY);
    mouse.x = winX - document.getElementById("game-window").offsetLeft;
    mouse.y = winY - document.getElementById("game-window").offsetTop;
}, false);

var gameOver = false;

/* Paddle creation */
var vertPaddleUpdate = function() {
    this.y = Math.max(0, Math.min(CANVAS_HEIGHT, mouse.y));
}
var horzPaddleUpdate = function() {
    this.x = Math.max(0, Math.min(CANVAS_WIDTH, mouse.x));
}
var paddleDraw = function() {
    canvas.fillStyle = "#222";
    canvas.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
}
var paddleLength = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 4;
var paddleWidth = 4;
var paddle1 = {
    x: 4,
    y: CANVAS_HEIGHT / 2,
    width: paddleWidth,
    height: paddleLength,
    update: vertPaddleUpdate,
    draw: paddleDraw,
}
var paddle2 = {
    x: CANVAS_WIDTH - 4 - 4,
    y: CANVAS_HEIGHT / 2,
    width: paddleWidth,
    height: paddleLength,
    update: vertPaddleUpdate,
    draw: paddleDraw,
}
var paddle3 = {
    x: CANVAS_WIDTH / 2,
    y: 4,
    width: paddleLength,
    height: paddleWidth,
    update: horzPaddleUpdate,
    draw: paddleDraw,
}
var paddle4 = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 4 - 4,
    width: paddleLength,
    height: paddleWidth,
    update: horzPaddleUpdate,
    draw: paddleDraw,
}

var paddles = [paddle1, paddle2, paddle3, paddle4];

/* Ball creation */
var ballSpeed = 2;
var image  = document.getElementById("res-ball");
var ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    vx: 0,
    vy: 0,
    radius: 12, // radius of ball / 2
    update: function() {
        var newX = this.x + this.vx;
        var newY = this.y + this.vy;
        var bounce = false;
        if (newX < 8 + this.radius || newX > CANVAS_WIDTH - 8 - this.radius * 1.5) {
            if (Math.abs(newY - mouse.y) < paddleLength / 2 + this.radius) {
                this.vx *= -1.05;
                bounce = true;
            } else {
                gameOver = true;
            }
        }
        if (newY < 8 + this.radius || newY > CANVAS_HEIGHT - 8 - this.radius * 1.5) {
            if (Math.abs(newX - mouse.x) < paddleLength / 2 + this.radius) {
                this.vy *= -1.05;
                bounce = true;
            } else {
                gameOver = true;
            }
        }
        if (!bounce) {
            this.x = newX;
            this.y = newY;
        } else {
            this.x += this.vx;
            this.y += this.vy;
        }
    },
    draw: function() {
        canvas.drawImage(image, this.x - this.radius, this.y - this.radius)
    },
};
resetBall();

function resetBall() {
    var ballAngle = Math.PI * 2 * Math.random();
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.vx = ballSpeed * Math.cos(ballAngle);
    ball.vy = ballSpeed * Math.sin(ballAngle);
}

function mousePressed(event) {
    
}

function mouseReleased(event) {
    if (gameOver) {
        gameOver = false;
        resetBall();
    }
}

function update() {
    if (gameOver) { return; }
    ball.update();
    for (var i = 0; i < paddles.length; i++) {
        paddles[i].update();
    }
};

function draw() {
    // Clear to background Colour
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.fillStyle = BG_COLOUR;
    canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //
    ball.draw();
    for (var i = 0; i < paddles.length; i++) {
        paddles[i].draw();
    }
    if (gameOver) {
        canvas.fillStyle = "#000";
        canvas.globalAlpha = 0.5;
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.globalAlpha = 1;
        canvas.fillStyle = "#fff";
        canvas.font = "64px Josefin Sans";
        canvas.textAlign = "center"; 
        canvas.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 64);
        canvas.font = "32px Josefin Sans";
        canvas.fillText("Click to continue.", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 64);
    }
};

setInterval(function() {
    update();
    draw();
}, 1000/FPS);
document.onmousedown = mousePressed;
document.onmouseup = mouseReleased;