//Animation functions
function flash() {

}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 205;
    this.y = 375;
    this.score = 0;
    this.update = function(){
        if(this.y === -40) {
            // The character has made it to the lake. Flash, increment points and drop them back at the start position on a random grass block
            flash();
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    this.handleInput = function(direction) {
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

    };
    this.selectPlayer = function(image, button) {
        this.sprite = image;
        if(oldSelectedPlayer) {
            oldSelectedPlayer.classList.remove('active-player');
        }
        oldSelectedPlayer = button;
        button.classList.add('active-player');
    };
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var allGameSquares = {
    x: [5, 105, 205, 305, 405],
    y: [-40, 43, 126, 209, 292, 375]
};
var enemyLanes = {
    lane1: {
        start: {
            x: 5,
            y: 292
        },
        end: {
            x: 405,
            y: 292
        },
        occupied: false
    },
    lane2: {
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
    lane3: {
        start: {
            x: 5,
            y: 126
        },
        end: {
            x: 5,
            y: 126
        },
        occupied: false
    }
};
var player = new Player();
var oldSelectedPlayer = document.getElementsByClassName('active-player')[0];
var looper = 5;

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
    this.parentNode.style = 'display: none;';
});

