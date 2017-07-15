"use strict";

let gameAdjustmentVariables = {

    numberOfEnemies: 7,
    enemyImage: "images/enemy-bug.png",

    playerLifes: 4,
    playerImage: "images/char-boy.png",

    gemImage: "images/Gem Blue.png"
};

//GameMechanics defines game events, updates and creates game objects
let GameMechanics = function (x, y, imageLocation) {

    this.x = x;
    this.y = y;
    this.sprite = imageLocation;
    this.width = 70;
    this.height = 50;
};

GameMechanics.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

GameMechanics.prototype.objectsAreColliding = function (obj1) {

    return (obj1.x < this.x + this.width &&
    obj1.x + obj1.width > this.x &&
    obj1.y < this.y + this.height &&
    obj1.height + obj1.y > this.y)
};

GameMechanics.prototype.getRandomCol = function () {

    const START_IN_COL_1 = 0,
        START_IN_COL_2 = 101,
        START_IN_COL_3 = 202,
        START_IN_COL_4 = 303,
        START_IN_COL_5 = 404;

    let horizontalEnemyStartPositions = [START_IN_COL_1, START_IN_COL_2,
        START_IN_COL_3, START_IN_COL_4, START_IN_COL_5
    ];

    let randomStartColumn = Math.floor(Math.random() * 5);

    return horizontalEnemyStartPositions[randomStartColumn];
};

GameMechanics.prototype.getRandomRow = function () {

    const UPPER_ROW = 59, MIDDLE_ROW = 142,
        LOWER_ROW = 225;
    let verticalEnemyStartPositions = [UPPER_ROW, MIDDLE_ROW,
        LOWER_ROW
    ];
    let randomStartRow = Math.floor(Math.random() * 3);

    return verticalEnemyStartPositions[randomStartRow];
};

let Enemy = function () {

//Question for reviewer: Is it okay to use a constructor like i do here? Or should the values below be
// provided as input to constructor?
    let enemyStartCol = this.getRandomCol();
    let enemyStartRow = this.getRandomRow();
    let enemyImage = gameAdjustmentVariables.enemyImage;

    GameMechanics.call(this, enemyStartCol, enemyStartRow, enemyImage);

    this.speed = this.getRandomSpeed();
};

Enemy.prototype = Object.create(GameMechanics.prototype);

Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    this.moveEnemies(dt);
};

Enemy.prototype.moveEnemies = function (dt) {

    const canvasLength = 505;
    let currentHorizontalPosition = this.x;

    if (currentHorizontalPosition > canvasLength) {
        this.respawnEnemy();
    } else {
        this.x += this.speed * dt;
    }
};

//Respawns enemy. Added randomization by letting enemy respawn outside of canvas with a new speed value (takes a random
// amount of time to reach canvas).
Enemy.prototype.respawnEnemy = function () {

    const startPosition = -250;

    this.x = startPosition;
    this.y = this.getRandomRow();
    this.speed = this.getRandomSpeed();

};

Enemy.prototype.hasCollisionWithPlayer = function (player) {

    if (this.objectsAreColliding(player)) {

        player.life--;
        player.moveToStartPosition();
    }
};

Enemy.prototype.getRandomSpeed = function () {

    const BASE_SPEED = 150;
    const VARIABLE_SPEED = 150;

    return BASE_SPEED + Math.random() * VARIABLE_SPEED;
};

let Player = function () {

    //Question for reviewer: Should i be doing this in the constructor (pass in nothing, and declare & use
    //methods?)
    let x = 0;
    let y = 0;
    let playerImage = gameAdjustmentVariables.playerImage;

    GameMechanics.call(this, x, y, playerImage);

    this.life = gameAdjustmentVariables.playerLifes;
    this.score = 0;
    this.moveToStartPosition();
};

Player.prototype = Object.create(GameMechanics.prototype);

Player.prototype.constructor = Player;

Player.prototype.render = function () {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.lifeBar();
    this.scoreBar();

    //Question for reviewer: I want to write some text and despawn enemies when player wins. Is it correct to put that
    //the checkForPlayerWin in the render method? Or should it be put in update method?
    // Or should the method be split up so that despawn goes into update and the rendering part goes here?

    this.checkForPlayerWin();
    this.checkForPlayerDeath();


};

Player.prototype.moveToStartPosition = function () {

    const PLAYER_START_POSITION_X = 203;
    const PLAYER_START_POSITION_Y = 405;

    this.x = PLAYER_START_POSITION_X;
    this.y = PLAYER_START_POSITION_Y;
};

Player.prototype.update = function () {


};

Player.prototype.checkForPlayerWin = function () {

    const WATER_VERTICAL_POSITION = 72;
    let playerVerticalPosition = this.y;
    let playerWins = (playerVerticalPosition < WATER_VERTICAL_POSITION);

    if (playerWins) {

        this.score += 50;
        //move all enemies outside of canvas and set speed to 0
        allEnemies.forEach(function (enemy) {
            enemy.x = -100;
            enemy.speed = 0;

        });

        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Player wins!", 252, 303);

        //Question for reviewer: I want to terminate the game here, or call the reset function in engine.
        // Do i just make engine a global object and call it with Engine.reset()?

    }
};

Player.prototype.checkForPlayerDeath = function () {

    if (this.life < 1) {
        this.x = -100;

        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", 252, 303);
    }
};

Player.prototype.lifeBar = function () {

    let numberOfLives = this.life;
    let lifeImage = new Image();

    lifeImage.src = "images/Heart.png";

    //Why doesn't this work? It's inside a prototype method?
    // lifeImage.src = Resources.get("images/Heart.png");

    for (let i = 0; i < numberOfLives; i++) {

        ctx.drawImage(lifeImage, i * 30, 540, 30, 50);
    }
};

Player.prototype.scoreBar = function () {

    ctx.font = "15px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score:" + this.score, 410, 70);

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


let Gem = function () {

    let gemPlacementCol = this.getRandomCol(),
        gemPlacementRow = this.getRandomRow();

    GameMechanics.call(this, gemPlacementCol, gemPlacementRow, gameAdjustmentVariables.gemImage);
};

Gem.prototype = Object.create(GameMechanics.prototype);

Gem.prototype.constructor = Gem;

//instantiate objects
//create enemies
let allEnemies = generateEnemies();

function generateEnemies() {

    let enemies = [],
        numberOfEnemies = gameAdjustmentVariables.numberOfEnemies;

    for (let i = 0; i < numberOfEnemies; i++) {
        let newEnemy = new Enemy();
        enemies.push(newEnemy);
    }
    return enemies;
}

//create player
let player = new Player();

//create gem
let gem = new Gem();

document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
