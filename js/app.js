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

    gameObjectWidth: 70,
    gameObjectHeight: 50
};

//GameMechanics defines game events, updates and creates game objects
let GameMechanics = function(x, y, imageLocation) {

    this.x = x;
    this.y = y;
    this.sprite = imageLocation;
};
//Am i using the preloaded image from engine correctly here?
GameMechanics.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

GameMechanics.prototype.objectsAreColliding = function (obj1, obj2) {

    return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y)
    };

GameMechanics.prototype.getPosition = function(obj) {

    let objectPosition = {
        x: obj.x,
        y: obj.y,
        width: gameAdjustmentVariables.gameObjectWidth,
        height: gameAdjustmentVariables.gameObjectHeight
    };

    return objectPosition;
};

GameMechanics.prototype.getRandomCol = function () {

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

GameMechanics.prototype.getRandomRow = function() {

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

GameMechanics.prototype.getRandomSpeed = function () {

    return 150 + Math.random() * gameAdjustmentVariables.enemySpeed;
};

GameMechanics.prototype.checkForPlayerWin = function (player) {

    let playerVerticalPosition = player.y;
    let winConditionPlayerReachesWater = 72;

    if(playerVerticalPosition < winConditionPlayerReachesWater) {

        this.playerWins();
    }
};

GameMechanics.prototype.playerWins = function (allEnemies) {

    console.log("player wins");

};

let Enemy = function (x, y, imageLocation, speed) {

    GameMechanics.call(this, x, y, imageLocation);

    this.isActive = true;
    this.speed = speed;
};

Enemy.prototype = Object.create(GameMechanics.prototype);

Enemy.prototype.constructor = Enemy;

Enemy.prototype.enemyFactory = function(numberOfEnemies) {

    let enemyContainer = [];
    for (let i = 0; i < numberOfEnemies; i++) {

        //QUESTION FOR REVIEWER: How can i load the image from the Resource object as the third parameter in newEnemy?
        // Resources.get('images/enemy-bug.png') doesn't work, why? This is inside a prototype method, so image should be done
        //loading when it executes?

        let newEnemy = new Enemy(this.getRandomCol(), this.getRandomRow(), "images/enemy-bug.png",
            this.getRandomSpeed());
        enemyContainer.push(newEnemy);
    }

    return enemyContainer;
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    this.moveEnemies(dt);

};

Enemy.prototype.moveEnemies = function (dt) {

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

    if(enemy.isActive) {
        enemy.x = startPosition;
        enemy.y = GameMechanics.prototype.getRandomRow();
        enemy.speed = GameMechanics.prototype.getRandomSpeed();
    }
};



Enemy.prototype.hasCollisionWithPlayer = function (playerPosition) {

    let enemyPosition = GameMechanics.prototype.getPosition(this);
    let playerCollidesWithEnemy = GameMechanics.prototype.objectsAreColliding(playerPosition, enemyPosition);

    if(playerCollidesWithEnemy) {

        player.loseLife();
        player.moveToStartPosition();
    }
};

let Player = function (x, y, imageLocation, life) {

    GameMechanics.call(this, x, y, imageLocation);
    this.life = life;
};

Player.prototype = Object.create(GameMechanics.prototype);

Player.prototype.constructor = Player;

Player.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.lifeBar();
};

Player.prototype.moveToStartPosition = function () {

    this.x = gameAdjustmentVariables.playerStartPositionX;
    this.y = gameAdjustmentVariables.playerStartPositionY;
};

Player.prototype.update = function () {

    Player.prototype.checkForPlayerWin(this);

};



Player.prototype.lifeBar = function() {

    let numberOfLives = this.life;
    let lifeImage = new Image();

    lifeImage.src = Resources.get("images/Heart.png");

    lifeImage.src = "images/Heart.png";

    for(let i = 0; i < numberOfLives; i++) {

        ctx.drawImage(lifeImage, i * 30, 540, 30, 50);
    }
};

Player.prototype.loseLife = function() {

    return this.life--;
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
let numberOfEnemies = gameAdjustmentVariables.numberOfEnemies;
allEnemies = allEnemies.enemyFactory(numberOfEnemies);
let player = new Player(gameAdjustmentVariables.playerStartPositionX, gameAdjustmentVariables.playerStartPositionY,
    gameAdjustmentVariables.playerImage, 3);


document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
