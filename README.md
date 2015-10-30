Snake.js
========

[View snake.js in action](http://snaaake.dariocarella.com)

Snake.js is a module written in vanilla javascript that lets you create your custom snake game.

It's very easy to use: create a Board, register snake(s) to it and play.
You read that right! Multiplayer snake game are welcome with no extra coding.

You can use it to create a complex web game, or simply putting into your portfolio an enjoying easter egg.

Installation
------------
Loading snake.js you have global access to Board and Snake objects. 

~~~ javascript
<div class="board">
  <div class="snake"></div>
</div>

...

<!-- vanilla w/ love -->
<script src="snake.js"></script>
<script>
  var board = new Board(),
      snake = new Snake();
    
  // Setup commands as you want
  document.onkeydown = function(e) {
    e = e || window.event;
    
    // arrow keys
    if (e.keyCode === 38) snake.goUp();
    if (e.keyCode === 39) snake.goRight();
    if (e.keyCode === 40) snake.goDown();
    if (e.keyCode === 37) snake.goLeft();
  };
    
  board
    .register(snake)
    .play();
</script>
~~~

### Install with Bower

~~~
bower install snake.js
~~~

Configuration
-------------

### Components options

~~~ javascript
  var board = new Board({
    'element': document.querySelector('.board'),
    'columns': 32,
    'rows': 16,
    'cell-width': 24,
    'cell-height': 24,
    'timing': 300,
    'food-count': 1,
    'food-replace': true
  });
  
  var snake = new Snake({
    'element': document.querySelector('.snake'),
    'x': 0,
    'y': 0,
    'size': 4
  });
~~~

### Styling components

~~~ scss
/* Board */
.board {
  position: relative;
  border: 5px solid currentColor; /* optional */
}


/* Snake */
.snake { color: lawngreen; }

.snake .block {
  width: 24px;
  height: 24px;
  position: absolute;
  
  background: currentColor;
}
.snake.gameover .block {
  background-color: red;
}

/* Food */
.food {
  /* The resultant size m ust be the same of snake blocks */
  width: 12px;
  height: 12px;
  margin: 6px;
  position: absolute;

  background: rebeccapurple;
}
~~~

Interaction
-----------

### Board object

#### Init
Automatically invoked into constructor, can be used to restart the board status.

~~~ javascript
  board.init();
~~~

#### Register
Must be used to register snake(s) to the board.

~~~ javascript
  // single snake
  board.register(snake);
  
  // multiple snakes at once
  board.register([snakeOne, snakeTwo]);
  
  // YES, you can add snakes whenever you want
~~~

#### Play
Starts the game.

~~~ javascript
  board.play();
~~~

#### Pause
Pause/Stop the game.

~~~ javascript
  board.pause();
  
  // you can use also the alias STOP
  board.stop();
~~~

#### TogglePause
Very comfortable when you have to pause/play the game.

~~~ javascript
  board.togglePause();
~~~

#### PlaceFood
Put a food block on the board.

~~~ javascript
  var x = 5,
      y = 3;

  board.placeFood(x, y);
  
  // food can be placed also randomly
  board.placeFood();
~~~

#### RemoveFood
Remove a food block from the board.

~~~ javascript
  var x = 5,
      y = 3;
      
  board.removeFood(x, y);
~~~

### Snake object

#### Init
Automatically invoked into constructor, can be used to restart the snake status.

~~~ javascript
  snake.init();
~~~

#### Move
Let the snake make a movement (following its last direction).

~~~ javascript
  snake.move();
~~~

#### Extend
Extend the snake tail.

~~~ javascript
  snake.extend();
~~~

#### Gameover
Change the status of the snake to gameover (usually when dead).

~~~ javascript
  snake.gameover();
~~~

#### Stop
Stops the snake.

~~~ javascript
  snake.stop();
~~~

#### GoUp
Set the snake direction to UP.

~~~ javascript
  snake.goUp();
~~~

#### GoRight
Set the snake direction to RIGHT.

~~~ javascript
  snake.goRight();
~~~

#### GoDown
Set the snake direction to DOWN.

~~~ javascript
  snake.goDown();
~~~

#### GoLeft
Set the snake direction to LEFT.

~~~ javascript
  snake.goLeft();
~~~

Example
-------
Check the example to make it works easy.

Tail
----
Thanks for checking this out. For any questions just tweet me on [Twitter](http://www.twitter.com/splact).

Please let me know if you're using snake.js! I'm curious to see how you made it yours.

Mentions are very appreciated. [dariocarella.com](http://dariocarella.com)
