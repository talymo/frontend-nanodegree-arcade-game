var timer, minutes, seconds;
var gamedone = false;
var gameLength = 60 * 5,
    display = document.getElementById('timer');
var enemy, enemy2, enemy3;
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

var bonusItems = [
    {
        'name': 'Gem Blue',
        'image': 'images/gem-blue.png',
        'points': 100,
        'timer': 0,
        'rain': false,
        'lives': 0
    },
    {
        'name': 'Gem Green',
        'image': 'images/gem-green.png',
        'points': 50,
        'timer': 0,
        'rain': false,
        'lives': 0
    },
    {
        'name': 'Gem Orange',
        'image': 'images/gem-orange.png',
        'points': 25,
        'timer': 0,
        'rain': false,
        'lives': 0
    },
    {
        'name': 'Heart',
        'image': 'images/Heart.png',
        'points': 0,
        'timer': 0,
        'rain': false,
        'lives': 1
    },
    {
        'name': 'Key',
        'image': 'images/Key.png',
        'points': 0,
        'timer': 0,
        'rain': true,
        'lives': 0
    },
    {
        'name': 'Star',
        'image': 'images/Star.png',
        'points': 0,
        'timer': 1200,
        'rain': false,
        'lives': 0
    }
];

var oldSelectedPlayer = document.getElementsByClassName('active-player')[0];
var moveable = true;
var finalScore;

var timerInterval;

function generateGem(){
    var randomGem = Math.floor(Math.random() * 3);
    var gem = bonusItems[randomGem];

    var gem_x = Math.floor(Math.random() * 5);
    var gem_y = Math.floor(Math.random() * 6);

    var gem_board_x = allGameSquares['x'][gem_x];
    var gem_board_y = allGameSquares['y'][gem_y];

    var bonus_gem = new Bonus(gem, gem_board_x, gem_board_y, 'points', 100);

    activeBonuses.push(bonus_gem);
}

// Start a timer
// Code from https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function startTimer(duration, display) {
    timer = duration;
    timerInterval = setInterval(function () {
        if(!gamedone) {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.innerText = minutes + ":" + seconds;

            // Let's generate some lovely bonus items for the player
            var randomNum = Math.floor(Math.random() * 60) + 1;

            // We want the gems to be pretty available, so we are going to check the random number to be evenly
            // divisible against 2 and if it is, we will populate a random gem that will last about 10 seconds
            // on the board
            if(randomNum % 12 === 0) {

                generateGem();
            }

            if(randomNum % 20 === 0) {

                var heart = bonusItems[3];

                var heart_x = Math.floor(Math.random() * 5);
                var heart_y = Math.floor(Math.random() * 6);

                var heart_board_x = allGameSquares['x'][heart_x];
                var heart_board_y = allGameSquares['y'][heart_y];

                var bonus_heart = new Bonus(heart, heart_board_x, heart_board_y, 'lives', 1);

                activeBonuses.push(bonus_heart);
            }

            if(randomNum % 30 === 0) {

                var key = bonusItems[4];

                var key_x = Math.floor(Math.random() * 5);
                var key_y = Math.floor(Math.random() * 6);

                var key_board_x = allGameSquares['x'][key_x];
                var key_board_y = allGameSquares['y'][key_y];

                var bonus_key = new Bonus(key, key_board_x, key_board_y, 'key', 5);

                activeBonuses.push(bonus_key);
            }

            if(randomNum % 30 === 0) {

                var star = bonusItems[5];

                var star_x = Math.floor(Math.random() * 5);
                var star_y = Math.floor(Math.random() * 6);

                var star_board_x = allGameSquares['x'][star_x];
                var star_board_y = allGameSquares['y'][star_y];

                var bonus_star = new Bonus(star, star_board_x, star_board_y, 'star', 100);

                activeBonuses.push(bonus_star);
            }

            if (--timer < 0) {
                gamedone = true;
            }
        }
    }, 1000);
}

window.onload = function () {
    startTimer(gameLength, display);
};

function stopGame(){
    gamedone = true;
    player.y = 375;
    player.x = 205;
    allEnemies = [];
    moveable = false;
    activeBonuses = [];
}

function startGame() {
    player.score = 0;
    player.lives = 3;
    gamedone = false;
    moveable = true;
    timer = gameLength;
    enemy = new Enemy();
    enemy2 = new Enemy();
    enemy3 = new Enemy();
    allEnemies = [enemy, enemy2, enemy3];
}

// Bonuses our player can collect
var Bonus = function(bonus, x, y, perk, value) {
    this.sprite = bonus.image;
    this.x = x;
    this.y = y;
    this.duration = 500;
    this.perk = perk;
    this.value = value;
};

Bonus.prototype.update = function(dt) {

    if(this.duration > 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.duration -= 1;
    } else {
        activeBonuses.splice(0,1);
    }


};

Bonus.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var activeBonuses = [];

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
    this.speed = Math.floor(Math.random() * 500) + 1;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x > 505) {
        this.x = -75;
        this.lane = enemyLanes[Math.floor((Math.random() * 3) + 1)];
        this.y = this.lane.start.y;
        this.speed = Math.floor(Math.random() * 500) + 100;
    }
    this.x = this.x + (dt * this.speed);

    if(this.x > (player.x - 30) && this.x < (player.x + 30) && this.y > (player.y - 30) && this.y < (player.y + 30) ) {
        player.lose();
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 205;
    this.y = 375;
    this.lives = 3;
    this.score = 0;
    this.update = function(){
        if(gamedone || (player.lives === 0) ) {
            // Stop the game
            stopGame();
        }
        if(this.y === -40 && moveable) {
            this.win();
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        document.getElementById("score").innerText = this.score.toString();
        document.getElementById("lives").innerText = this.lives.toString();

        // Check for bonus items
        activeBonuses.forEach(function(bonus, index) {
            if(player.x === bonus.x && player.y === bonus.y) {
                switch(bonus.perk){
                    case 'points':
                        player.score += bonus.value;
                        break;
                    case 'lives':
                        player.lives += bonus.value;
                        break;
                    case 'key':
                        // Throw a bunch of gems down
                        var loop = bonus.value;
                        while(loop > 0) {
                            generateGem();
                            loop--;
                        }
                        break;
                    case 'star':
                        // Add some time on the timer
                        timer += bonus.value;
                        break;
                    default:
                        console.log('whoops, what the hell did you just touch?');
                }
                activeBonuses.splice(index, 1);
            }
        });

    };
    this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    this.handleInput = function(direction) {
        if(moveable) {
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
        moveable = false;
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
            player.score += 150;
            moveable = true;
        }, 2500);
    };
    this.lose = function() {
        moveable = false;
        var loops = 2;
        player.y = 375;
        player.lives -= 1;
        player.score -= 75;
        setInterval(function() {
            if(loops > 0) {
                ctx.globalAlpha = 0.5;
                player.y = player.y - 5;
                setTimeout(function(){
                    ctx.globalAlpha = 1;
                    player.y = player.y + 5;
                }, 100);
                loops--;
            }
        },200);
        moveable = true;
    };
};

var player = new Player();

enemy = new Enemy();
enemy2 = new Enemy();
enemy3 = new Enemy();
var allEnemies = [enemy, enemy2, enemy3];


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

document.getElementById('restart').addEventListener('click', function() {
    startGame();
});

var charCookie = localStorage.getItem('saveCharacter');
if(charCookie) {
    document.getElementById("char-select").style = 'display: none;';
    player.sprite = charCookie;
}




