var board = new Board({
  timing: 120
});

var snakeOne = new Snake({
  x: 16,
  y: 8,
  size: 7
});

board
  .register(snakeOne)
  .placeFood()
  .play();

/* Setup interactions */
var $padUp = document.querySelector('.pad .up');
var $padRight = document.querySelector('.pad .right');
var $padDown = document.querySelector('.pad .down');
var $padLeft = document.querySelector('.pad .left');
$padUp.onclick = snakeOne.goUp;
$padRight.onclick = snakeOne.goRight;
$padDown.onclick = snakeOne.goDown;
$padLeft.onclick = snakeOne.goLeft;

function checkKeyDown(e) {
  e = e || window.event;

  // snake keys
  if (e.keyCode === 38) {
    $padUp.classList.add('active');
    snakeOne.goUp();
  }
  if (e.keyCode === 39) {
    $padRight.classList.add('active');
    snakeOne.goRight();
  }
  if (e.keyCode === 40) {
    $padDown.classList.add('active');
    snakeOne.goDown();
  }
  if (e.keyCode === 37) {
    $padLeft.classList.add('active');
    snakeOne.goLeft();
  }
  if ( (e.keyCode === 32) || (e.keyCode === 80) ) {
    board.togglePause();
  }
  
  e.preventDefault();
  return false;
}

function checkKeyUp(e) {
  e = e || window.event;

  // snake keys
  if (e.keyCode === 38) $padUp.classList.remove('active');
  if (e.keyCode === 39) $padRight.classList.remove('active');
  if (e.keyCode === 40) $padDown.classList.remove('active');
  if (e.keyCode === 37) $padLeft.classList.remove('active');
}

document.onkeydown = checkKeyDown;
document.onkeyup = checkKeyUp;