// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.lane = enemyLanes[Math.floor((Math.random() * 3) + 1)];
    this.x = 5;
    this.y = this.lane.start.y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allGameSquares = {
    x: [5, 105, 205, 305, 405],
    y: [-40, 43, 126, 209, 292, 375]
};
var enemyLanes = {
    1: {
        start: {
            x: 5,
            y: 209
        },
        end: {
            x: 405,
            y: 209
        },
        occupied: false
    },
    2: {
        start: {
            x: 5,
            y: 126
        },
        end: {
            x: 405,
            y: 126
        },
        occupied: false
    },
    3: {
        start: {
            x: 5,
            y: 43
        },
        end: {
            x: 5,
            y: 43
        },
        occupied: false
    }
};

var oldSelectedPlayer = document.getElementsByClassName('active-player')[0];
var win = false;

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 205;
    this.y = 375;
    this.score = 0;
    this.update = function(){
        if(this.y === -40 && win === false) {
            this.win();
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        document.getElementById("score").innerText = this.score.toString();
    };
    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    this.handleInput = function(direction) {
        if(!win) {
            switch(direction) {
                case "up":
                    if(this.y !== -40) {
                        this.y -= 83;
                    }
                    break;
                case "down":
                    if(this.y !== 375) {
                        this.y += 83;
                    }
                    break;
                case "left":
                    if(this.x !== 5) {
                        this.x -= 100;
                    }
                    break;
                case "right":
                    if(this.x !== 405) {
                        this.x += 100;
                    }
                    break;
                default:
                    console.log('Cannot move outside of the board!');
            }
        }
    };
    this.selectPlayer = function(image, button) {
        this.sprite = image;
        if(oldSelectedPlayer) {
            oldSelectedPlayer.classList.remove('active-player');
        }
        oldSelectedPlayer = button;
        button.classList.add('active-player');
    };
    this.win = function() {
        win = true;
        var looper = 5;
        setInterval(function(){
            if(looper > 0) {
                player.y = -60;
                setTimeout(function(){
                    player.y = -43;
                }, 150);
                looper--;
            }
        },300);
        setTimeout(function(){
            player.y = 375;
            player.score += 10;
            win = false;
        }, 2500);
    };
};
var player = new Player();

var enemy = new Enemy();
var enemy2 = new Enemy();
var allEnemies = [enemy, enemy2];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

document.getElementById('start').addEventListener('click', function() {
    var saveChar = document.getElementsByName("saveCharacter")[0].checked;
    if(saveChar) {
        localStorage.setItem('saveCharacter', player.sprite);
    }
    this.parentNode.style = 'display: none;';
});

var charCookie = localStorage.getItem('saveCharacter');
if(charCookie) {
    document.getElementById("char-select").style = 'display: none;';
    player.sprite = charCookie;
}

