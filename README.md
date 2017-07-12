# Frogger Arcade Game
In order to change game parameters, open <game-folder>/js/app.js. Adjustments can be done in the gameAdjustmentVariables object, on top of the page. The following parameters can be adjusted:

* Number of enemies ("numberOfEnemies") (default: 5)
* Type of enemy image ("enemyImage") (default: "images/enemy-bug.png")
* Horizontal spawn point for enemies (enemyStartPositionX) (default: random value from function randomEnemyXStartValue())
* Vertical spawn point for enemies (enemyStartPositionY) (default: random value from function randomEnemyYStartValue())
* Enemy speed modifier ("enemySpeed") (default: 450)
* Horizontal spawn point for player (playerStartPositionX) (default: 203 (center of canvas))
* Vertical spawn point for player (playerStartPositionY) (default: 405 (lowermost part of canvas)
