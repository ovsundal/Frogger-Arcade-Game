"use strict";

let gameAdjustmentVariables = {

    numberOfEnemies: 5,
    enemyImage: "images/enemy-bug.png",
    // enemyStartPositionX: randomEnemyXStartValue(),
    // enemyStartPositionY: randomEnemyYStartValue(),
    enemySpeed: 150,

    playerStartPositionX: 203,
    playerStartPositionY: 405,
    playerImage: "images/char-boy.png",

    //QUESTION FOR REVIEWER is there a better way to extract width and height from any png? Collision detection works okay,
    // but without exact width and height it will not be optimal
    gameObjectWidth: 50,
    gameObjectHeight: 50
};

//GameObject defines game events, updates and creates player/enemy
let GameObject = function(x, y, imageLocation) {

    this.x = x;
    this.y = y;
    this.sprite = imageLocation;
};
//first, render page
GameObject.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//then, check if player has collided with enemy
GameObject.prototype.objectsAreColliding = function (obj1, obj2) {

    return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y)
    };

//then, check if player is in winning position
GameObject.prototype.isPlayerInWinningPosition = function(currentVericalPosition) {

    let winConditionPlayerReachesWater = 72;

    return currentVericalPosition < winConditionPlayerReachesWater;
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

GameObject.prototype.enemyFactory = function(numberOfEnemies) {

    let enemyContainer = [];
    for (let i = 0; i < numberOfEnemies; i++) {
        debugger;
        let newEnemy = new Enemy(this.getRandomCol(), this.getRandomRow(), gameAdjustmentVariables.enemyImage,
            this.getRandomSpeed());
        enemyContainer.push(newEnemy);
    }

    return enemyContainer;
};

GameObject.prototype.getRandomCol = function () {

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
    let randomCol = horizontalEnemyStartPositions[randomStartColumn];

    return randomCol;
};

GameObject.prototype.getRandomRow = function() {

    let startInUpperRow = 59,
        startInMiddleRow = 142,
        startInLowerRow = 225;
    let verticalEnemyStartPositions = [startInUpperRow, startInMiddleRow,
        startInLowerRow
    ];
    let randomStartRow = Math.floor(Math.random() * 3);
    let randomRow = verticalEnemyStartPositions[randomStartRow];

    return randomRow;
};

GameObject.prototype.getRandomSpeed = function () {

    return 150 + Math.random() * gameAdjustmentVariables.enemySpeed;
};


//Should this be a method of enemy? I could not implement it, could not find class if i tried to access it with enemy object




let Enemy = function (x, y, imageLocation, speed) {

    GameObject.call(this, x, y, imageLocation);

    this.isActive = true;
    this.speed = speed;
};

Enemy.prototype = Object.create(GameObject.prototype);

Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    const canvasLength = 505;

    let currentHorizontalPosition = this.x;

    if (currentHorizontalPosition > canvasLength) {
        Enemy.prototype.respawnEnemy(this);
    } else {
        this.x += this.speed * dt;
    }
};

//Respawns enemy. Added randomization by letting enemy respawn outside of canvas with a new speed value (takes a random
// amount of time to reach canvas).
Enemy.prototype.respawnEnemy = function (enemy) {

    const startPosition = -250;
debugger;
    if(enemy.isActive) {
        enemy.x = startPosition;
        enemy.y = GameObject.prototype.getRandomRow();
        enemy.speed = GameObject.prototype.getRandomSpeed();
    }
};

Enemy.prototype.hasCollisionWithPlayer = function (playerPosition) {

    let enemyPosition = GameObject.prototype.getPosition(this);
    let playerCollidesWithEnemy = GameObject.prototype.objectsAreColliding(playerPosition, enemyPosition);

    if(playerCollidesWithEnemy) {

        player.moveToStartPosition();
    }
};

let Player = function (x, y, imageLocation) {

    GameObject.call(this, x, y, imageLocation);
};

Player.prototype = Object.create(GameObject.prototype);

Player.prototype.constructor = Player;

Player.prototype.moveToStartPosition = function () {

    this.x = gameAdjustmentVariables.playerStartPositionX;
    this.y = gameAdjustmentVariables.playerStartPositionY;

};

//Check if player has won (stands on water tile)
Player.prototype.update = function () {

    let playerVerticalPosition = GameObject.prototype.getPosition(this).y;
    let playerIsInWinningPosition = GameObject.prototype.isPlayerInWinningPosition(playerVerticalPosition);

    if(playerIsInWinningPosition) {

    }
    if(this.isPlayerInWinningPosition(playerVerticalPosition)) {

        this.playerHasWon();
    }
};

//condition that triggers when player reaches water tile
Player.prototype.playerHasWon = function () {

    //QUESTION FOR REVIEWER: If i put despawnEnemies inside Enemy.prototype, how would i call it here, inside Player prototype?
    despawnEnemies(allEnemies);
};

//removes all enemies by setting their x value outside of canvas, and prevent respawn by setting isActive = false
function despawnEnemies(allEnemies) {

    //remove enemies by setting their x value outside the canvas
    allEnemies.forEach(function(enemy) {
        enemy.x = 1000;
        enemy.isActive = false;
    });
}

Player.prototype.handleInput = function (keyInput) {

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

//instantiate objects

let allEnemies = new Enemy();
let player = new Player(gameAdjustmentVariables.playerStartPositionX, gameAdjustmentVariables.playerStartPositionY,
    gameAdjustmentVariables.playerImage);
let numberOfEnemies = gameAdjustmentVariables.numberOfEnemies;

allEnemies = allEnemies.enemyFactory(numberOfEnemies);

document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
