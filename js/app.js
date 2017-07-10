"use strict";

//QUESTION: In class-inheritance style i would create an abstract motherobject with positional parameters and other similarities.
//I would then generate player and enemy child-objects from motherobject that inherit similar properties. This einstellung
// makes it hard for me to understand exactly how i should approach designing this game thinking in a prototype-delegation based way?

let gameAdjustmentVariables = {

    numberOfEnemies: 7,
    enemySpeed: 450,

    //QUESTION is there a better way to extract width and height from a png?
    gameObjectWidth: 50,
    gameObjectHeight: 50
};

let Enemy = function () {

    let obj = Object.create(Enemy.prototype);

    obj.x = randomEnemyXStartValue();
    obj.y = randomEnemyYStartValue();
    obj.speed = randomEnemySpeedValue();
    obj.sprite = 'images/enemy-bug.png';

    return obj;
};

let randomEnemyXStartValue = function () {

    let startInColumn1 = 0,
        startInColumn2 = 101,
        startInColumn3 = 202,
        startInColumn4 = 303,
        startInColumn5 = 404,
        startInColumn6 = 505,
        startInColumn7 = 606;
    let horizontalEnemyStartPositions = [startInColumn1, startInColumn2,
        startInColumn3, startInColumn4, startInColumn5, startInColumn6, startInColumn7
    ];
    let randomStartColumn = Math.floor(Math.random() * 7);
    let randomHorizontalStartPosition = horizontalEnemyStartPositions[randomStartColumn];

    return randomHorizontalStartPosition;
};

let randomEnemyYStartValue = function () {

    let startInUpperRow = 59,
        startInMiddleRow = 142,
        startInLowerRow = 225;
    let verticalEnemyStartPositions = [startInUpperRow, startInMiddleRow,
        startInLowerRow
    ];
    let randomStartRow = Math.floor(Math.random() * 3);
    let randomVerticalStartPosition = verticalEnemyStartPositions[randomStartRow];

    return randomVerticalStartPosition;
};

let randomEnemySpeedValue = function () {
    return 200 + Math.random() * gameAdjustmentVariables.enemySpeed;
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //QUESTION: Is there a better way to show clarity in my code (avoid magic numbers)
    // without having to define these variables every time?

    const canvasLength = 505;
    let randomLength = Math.random() * 300;
    let longestHorizontalPositionBeforeRespawn = canvasLength + randomLength;
    let currentHorizontalPosition = this.x;

    if (currentHorizontalPosition > longestHorizontalPositionBeforeRespawn) {
        Enemy.prototype.respawnEnemy(this);
    } else {
        this.x += this.speed * dt;
    }
};

Enemy.prototype.respawnEnemy = function (enemy) {

    const startPosition = -150;

    enemy.x = startPosition;
    enemy.y = randomEnemyYStartValue();
    enemy.speed = randomEnemySpeedValue();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Enemy.prototype.hasCollisionWithPlayer = function (playerPosition) {

    let enemyPosition = {
        x: this.x,
        y: this.y,
        width: gameAdjustmentVariables.gameObjectWidth,
        height: gameAdjustmentVariables.gameObjectHeight
    };

    if (playerPosition.x < enemyPosition.x + enemyPosition.width &&
        playerPosition.x + playerPosition.width > enemyPosition.x &&
        playerPosition.y < enemyPosition.y + enemyPosition.height &&
        playerPosition.height + playerPosition.y > enemyPosition.y) {

        console.log("COLLISION");
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function () {

    const playerFixedHorizontalStartPosition = 203;
    const playerFixedVerticalStartPosition = 405;
    let playerObject = Object.create(Player.prototype);

    playerObject.sprite = 'images/char-boy.png';
    playerObject.x = playerFixedHorizontalStartPosition;
    playerObject.y = playerFixedVerticalStartPosition;

    return playerObject;
};

Player.prototype.update = function () {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //QUESTION: What is the point of this update? Player moves instantaneously?
    //The way the engine is implemented it does not pass a dt parameter to player, only enemy
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyInput) {
    //QUESTION: Would it make more sense to store the maxAllowedValues somewhere else
    //so i dont have to declare them every time?
    const minAllowedMovementWest = 101;
    const maxAllowedMovementEast = 305;
    const minAllowedMovementNorth = 72;
    const maxAllowedMovementSouth = 405;

    let currentHorizontalPosition = this.x;
    let currentVerticalPosition = this.y;

    switch (keyInput) {
        case ("left"): {
            if (currentHorizontalPosition > minAllowedMovementWest) {
                this.x -= 101;
            }
            break;
        }
        case ("right"): {
            if (currentHorizontalPosition < maxAllowedMovementEast)
                this.x += 101;
            break;
        }
        case ("up"): {
            if (currentVerticalPosition > minAllowedMovementNorth) {
                this.y -= 83;
            }
            if (playerIsInWinningPosition(this.y)) {
                playerHasWon();
            }
            break;
        }
        case ("down"): {
            if (currentVerticalPosition < maxAllowedMovementSouth) {
                this.y += 83;
            }
            break;
        }
        default: {
            break;
        }

    }
};

Player.prototype.getPosition = function () {


    //QUESTION code duplication; i do the same thing for enemy. How can i use prototype delegation to make this more efficient?
    let playerPosition = {
        x: this.x,
        y: this.y,
        width: gameAdjustmentVariables.gameObjectWidth,
        height: gameAdjustmentVariables.gameObjectHeight
    };

    return playerPosition;
};

let playerIsInWinningPosition = function (currentVerticalPosition) {
    let winConditionPlayerReachesWater = 72;

    return currentVerticalPosition < winConditionPlayerReachesWater;
};

let playerHasWon = function () {
    console.log("hurray");
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player();
let numberOfEnemies = gameAdjustmentVariables.numberOfEnemies;
let allEnemies = enemyFactory(numberOfEnemies);

function enemyFactory(numberOfEnemies) {

    let enemyContainer = [];
    for (let i = 0; i < numberOfEnemies; i++) {
        enemyContainer.push(new Enemy);
    }

    return enemyContainer;
}

document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
