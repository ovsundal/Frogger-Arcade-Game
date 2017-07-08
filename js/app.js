// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    //using object.create setups the prototype
  let obj = Object.create(Enemy.prototype);
  obj.x = randomEnemyXStartValue();
  obj.y = randomEnemyYStartValue();
  obj.sprite = 'images/enemy-bug.png';

  return obj;
};

//QUESTION: Is it better to encapsulate these randomizer functions inside the
//constructor function with "let"? Or does this provide more readability/clarity? Since every
//Enemy needs to run these functions at startup, am i right in not including them
//in Enemy.prototype?
var randomEnemyXStartValue = function() {
  return 150;
}

var randomEnemyYStartValue = function() {

  let upper = 59, middle = 142, lower = 225;

  let verticalEnemySpots = [upper, middle, lower];


  // debugger;
  return 225;
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // var obj = this;
    // Enemy.x = 10;
    // debugger;
    // obj.Enemy.x = x + 10;
    // this.x = x + 10;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

  let playerFixedHorizontalStartPosition = 203;
  let playerFixedVerticalStartPosition = 405;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    let obj = Object.create(Player.prototype);
    obj.sprite = 'images/char-boy.png';
    obj.x = playerFixedHorizontalStartPosition;
    obj.y = playerFixedVerticalStartPosition;

    return obj;
};

Player.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function() {

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var numberOfEnemies = 5;
var allEnemies = enemyFactory(numberOfEnemies);
var player = new Player();

function enemyFactory(numberOfEnemies) {

  let enemies = [];
  for(let i = 0; i < numberOfEnemies; i++) {
    enemies.push(new Enemy);
  }
  debugger;
  return enemies;
};

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
