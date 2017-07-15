"use strict";

let gameAdjustmentVariables = {

    numberOfEnemies: 5,
    enemyImage: "images/enemy-bug.png",

    // enemySpeed: 150,

    playerStartPositionX: 203,
    playerStartPositionY: 405,
    playerImage: "images/char-boy.png"

};

//GameMechanics defines game events, updates and creates game objects
let GameMechanics = function(x, y, imageLocation) {

    this.x = x;
    this.y = y;
    this.sprite = imageLocation;
    this.width = 70;
    this.height = 50;
};
//Am i using the preloaded image from engine correctly here?
GameMechanics.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

GameMechanics.prototype.objectsAreColliding = function (obj1) {

    return (obj1.x < this.x + this.width &&
        obj1.x + obj1.width > this.x &&
        obj1.y < this.y + this.height &&
        obj1.height + obj1.y > this.y)
    };

// GameMechanics.prototype.getRandomSpeed = function () {
//
//     return 150 + Math.random() * gameAdjustmentVariables.enemySpeed;
// };

GameMechanics.prototype.checkForPlayerWin = function (player) {

    let playerVerticalPosition = player.y;
    let winConditionPlayerReachesWater = 72;

    if(playerVerticalPosition < winConditionPlayerReachesWater) {

        this.playerWins();
    }
};

GameMechanics.prototype.playerWins = function () {

    //QUESTION FOR REVIEWER: Is it "okay" to pass in allEnemies from global scope to despawnEnemy?
    //Is it okay to use enemy or player methods in gamemechanics like this? (Or player methods in enemy methods etc.)
    Enemy.prototype.despawnEnemy(allEnemies);

};

GameMechanics.prototype.playerLoses = function (player) {

    player.x = 1000;
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
        enemy.y = this.getRandomRow();
        enemy.speed = this.getRandomSpeed();
    }
};

Enemy.prototype.despawnEnemy = function (allEnemies) {

    allEnemies.forEach(function(enemy) {
        enemy.x = -1000;
        enemy.speed = 0;
    });

};

Enemy.prototype.hasCollisionWithPlayer = function (player) {

    if(this.objectsAreColliding(player)) {

        player.loseLife();
        player.moveToStartPosition();
    }
};

Enemy.prototype.getRandomCol = function () {

    const START_IN_COL_1 = 0,
        START_IN_COL_2 = 101,
        START_IN_COL_3 = 202,
        START_IN_COL_4 = 303,
        START_IN_COL_5 = 404,
        START_IN_COL_6 = 505,
        START_IN_COL_7 = 606;
    let horizontalEnemyStartPositions = [START_IN_COL_1, START_IN_COL_2,
        START_IN_COL_3, START_IN_COL_4, START_IN_COL_5, START_IN_COL_6, START_IN_COL_7
    ];

    //Question for reviewer: I prefer to declare variables like randomStartColumn for added clarity in my code
    //I could of course pass horizontalEnemyStartPositions[Math.floor(Math.random() * 7)] into randomCol, would that
    //be better? It is more efficient, but i feel its easier to quickly understand what is going on by using one extra
    //layer of description
    let randomStartColumn = Math.floor(Math.random() * 7);
    let randomCol = horizontalEnemyStartPositions[randomStartColumn];

    return randomCol;
};

Enemy.prototype.getRandomRow = function() {

    const UPPER_ROW = 59, MIDDLE_ROW = 142,
        LOWER_ROW = 225;
    let verticalEnemyStartPositions = [UPPER_ROW, MIDDLE_ROW,
        LOWER_ROW
    ];
    let randomStartRow = Math.floor(Math.random() * 3);
    let randomRow = verticalEnemyStartPositions[randomStartRow];

    return randomRow;
};

Enemy.prototype.getRandomSpeed = function () {

    const BASE_SPEED = 150;
    const VARIABLE_SPEED = 150;

    return BASE_SPEED + Math.random() * VARIABLE_SPEED;
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

    if(this.life < 1) {
        GameMechanics.prototype.playerLoses(this);
    }
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
