"use strict";

//Hi, code is a bit messy, because im trying to "prototype-delegate" it.
let gameAdjustmentVariables = {

    numberOfEnemies: 7,
    enemySpeed: 450,

    //QUESTION is there a better way to extract width and height from any png? Collision detection works okay, but without
    //exact width and height it will not be optimal
    gameObjectWidth: 50,
    gameObjectHeight: 50
};

let GameObject = function(x, y, imageLocation) {

    this.x = x;
    this.y = y;
    this.sprite = imageLocation;
};

GameObject.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

GameObject.prototype.objectCollision = function (obj1, obj2) {

    return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y)
    };

GameObject.prototype.getPosition = function(obj) {

    let objectPosition = {
        x: obj.x,
        y: obj.y,
        width: gameAdjustmentVariables.gameObjectWidth,
        height: gameAdjustmentVariables.gameObjectHeight
    };
    return objectPosition;
};

let Enemy = function (x, y, imageLocation) {

    GameObject.call(this, x, y, imageLocation);

    //QUESTION: How to access Enemy.prototype.randomEnemySpeedValue() here?
        this.speed = 500;
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

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
    //This doesn't work - since the function ticks all the time, randomLength will approach ~0 after a few ticks
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

Enemy.prototype.hasCollisionWithPlayer = function (playerPosition) {

    let enemyPosition = GameObject.prototype.getPosition(this);
    let playerCollidesWithEnemy = GameObject.prototype.objectCollision(playerPosition, enemyPosition);

    if(playerCollidesWithEnemy) {

        player.moveToStartPosition();
    }
};

let Player = function (x, y, imageLocation) {

    GameObject.call(this, x, y, imageLocation);
};

Player.prototype.moveToStartPosition = function () {

    const playerFixedHorizontalStartPosition = 203;
    const playerFixedVerticalStartPosition = 405;

    this.x = playerFixedHorizontalStartPosition;
    this.y = playerFixedVerticalStartPosition;

    console.log("COLLISION");
};

Player.prototype.update = function () {

    let playerVerticalPosition = player.getPosition().y;

    if(this.isPlayerInWinningPosition(playerVerticalPosition)) {
        this.playerHasWon();
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //QUESTION: What is the point of multiplying movement of player? Player teleports?
    //The way the engine is implemented it does not pass a dt parameter to player, only enemy
};
//QUESTION: If i remove this method player should fall back to GameObject.prototype.render (works with enemy). But it breaks the game, why?
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
//QUESTION: Cannot remove this method either, something is wrong with player fallback to GameObject prototype methods i think
Player.prototype.getPosition = function () {

    let playerPosition = {
        x: this.x,
        y: this.y,
        width: gameAdjustmentVariables.gameObjectWidth,
        height: gameAdjustmentVariables.gameObjectHeight
    };

    return playerPosition;
};

Player.prototype.isPlayerInWinningPosition = function (currentVerticalPosition) {
    let winConditionPlayerReachesWater = 72;

    return currentVerticalPosition < winConditionPlayerReachesWater;
};

Player.prototype.playerHasWon = function () {

    //QUESTION: How to make screen go grey and wait 1 sec
    console.log("hurray");

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player(203, 405, "images/char-boy.png");
let numberOfEnemies = gameAdjustmentVariables.numberOfEnemies;
let allEnemies = enemyFactory(numberOfEnemies);

//QUESTION: I can't get this factorymethod to work when i add it to enemy.prototype - cannot find and access it
function enemyFactory(numberOfEnemies) {

    let enemyContainer = [];
    for (let i = 0; i < numberOfEnemies; i++) {

        let newEnemy = new Enemy(101, 59, "images/enemy-bug.png");
        enemyContainer.push(newEnemy);
    }

    return enemyContainer;
}

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

let enemyType = function () {
    let url = "images/enemy-bug.png";

    return url;
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
