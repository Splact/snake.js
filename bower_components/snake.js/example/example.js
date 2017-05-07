var board = new Board({
  timing: 120
});
var snake1 = new Snake({
  element: document.querySelector('#snake-1'),
  size: 7
});
/*var snake2 = new Snake({
  element: document.querySelector('#snake-2'),
  size: 7
});*/

function checkKey(e) {
  e = e || window.event;

  // snake 1 keys
  if (e.keyCode === 38) snake1.goUp();
  if (e.keyCode === 39) snake1.goRight();
  if (e.keyCode === 40) snake1.goDown();
  if (e.keyCode === 37) snake1.goLeft();

  /*// snake 2 keys
  if (e.keyCode === 87) snake2.goUp();
  if (e.keyCode === 68) snake2.goRight();
  if (e.keyCode === 83) snake2.goDown();
  if (e.keyCode === 65) snake2.goLeft();*/
}
document.onkeydown = checkKey;

board
  // register snake to the board
  .register([snake1])
  .placeFood()
  // start game
  .play();