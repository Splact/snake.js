(function ( globals ) {

  // Defining helpers
  var $ = globals.document;

  /**
   * Query Selector shorthand
   * @param selector
   * @param context
   * @returns {*}
   */
  var $$ = function (selector, context) {
    return selector ? $.querySelector(selector, context || $) : $;
  };

  /**
   * Extend an object with default values
   * @param options
   * @param defaults
   * @returns {*|{}}
   */
  var $$d = function (options, defaults) {
    var _options = options || {};

    for (var opt in defaults)
      if (defaults.hasOwnProperty(opt) && !_options.hasOwnProperty(opt))
        _options[opt] = defaults[opt];

    return _options;
  };
  /**
   * Emit event on board element
   * @param event
   */
  var $$e = function(eventName, context) {
    var event,
        context = context || $;

    if ($.createEvent) {
      event = $.createEvent("HTMLEvents");
      event.initEvent(eventName, true, true);
    } else {
      event = $.createEventObject();
      event.eventType = eventName;
    }

    event.eventName = eventName;

    if ($.createEvent) {
      context.dispatchEvent(event);
    } else {
      context.fireEvent("on" + event.eventType, event);
    }
  };

  var Directions = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
  };

  var DirectionsInverse = {
    0: 'up',
    1: 'right',
    2: 'down',
    3: 'left'
  };

  /**
   * Board object, manage the elements positioning and limits
   * @param options
   * @returns {Board}
   * @constructor
   */
  var Board = function( options ) {

    // calling constructor if not invoked
    if (this.__proto__.constructor !== Board) {
      return new Board(options);
    }

    // Fullfill options with default values
    var _defaults = {
      'element': $$('.board'),
      'columns': 32,
      'rows': 16,
      'cell-width': 24,
      'cell-height': 24,
      'timing': 300,
      'food-count': 1,
      'food-replace': true
    };
    options = $$d(options, _defaults);


    // Private properties
    var self = this;
    var _board,
        _$board = options.element,
        _snakes;
    var _loop;

    var _moveSnakes = function() {
      _snakes.forEach(function(s) { s.move() });
    }
    /**
     * Process cicle
     * @private
     */
    var _cicle = function() {
      $$e('snake-cicle-start');

      _moveSnakes();

      $$e('snake-cicle-end');
    };

    /**
     * Find board cell
     * @param x
     * @param y
     * @returns {*}
     */
    var _cell = function(x,y) {
      // the board include walls
      return _board[y+1][x+1];
    };


    // Public properties
    /**
     * Initialize the board and register snakes to it
     * @returns {Board}
     */
    self.init = function() {

      // Setup board
      _board = [];
      for (var y = -1; y <= options.rows; y++) {
        // setting up as array of rows ...
        var row = [];
        for (var x = -1; x <= options.columns; x++) {
          // each row contains an array of columns (cells)
          row.push({
            x: x,
            y: y,
            block: null,
            isFood: false,
            isEmpty: true,
            isWall: ((y < 0) || (x < 0) || (y == options.rows) || (x == options.columns))
          });
        }
        _board.push(row);
      }
      // override the board size
      _$board.style.height = options.rows * options['cell-height'];
      _$board.style.width = options.columns * options['cell-width'];

      return self;

    };

    /**
     * Register snake(s) to the board
     * @param snakes
     * @returns {boolean}
     */
    self.register = function( snakes ) {
      if (snakes.__proto__.constructor === Snake) snakes = [snakes];

      // Validate snakes
      var fakeSnakes = [];

      snakes.forEach(function(s, i) {
        if (s.__proto__.constructor !== Snake)
          fakeSnakes.push(i+1);
      });
      if (fakeSnakes.length) {
        console.error('Some snakes given are not valid ' + fakeSnakes.toString());
        return false;
      }
      _snakes = snakes;
      _snakes.forEach(function(s) { s.setBoardHook(self) });

      return self;
    }

    /**
     * Start game cicles
     * @returns {Board}
     */
    self.play = function() {
      _loop = setInterval(_cicle, options.timing);

      return self;
    };

    /**
     * Stop game cicles
     * @returns {Board}
     */
    self.pause = function() {
      clearInterval(_loop);
      _loop = null;

      _snakes.forEach(function(s) { s.stop() });

      return self;
    };

    self.stop = self.pause;

    self.togglePause = function() {
      if (_loop) return self.pause();
      else       return self.play();
    };

    self.placeBlock = function( block, x, y, snake ) {
      if (typeof y === 'undefined') y = 0;
      if (typeof x === 'undefined') x = 0;
      if (typeof block === 'undefined')
        return null;

      var boardX = x * options['cell-width'],
          boardY = y * options['cell-height'],
          $el = block.element;

      // empty the leaving board cell
      _cell(block.x, block.y).block = null;

      // setting current block position
      block.x = x;
      block.y = y;

      // moving DOM element to the right position
      $el.style.left = boardX;
      $el.style.top = boardY;

      var enteringCell = _cell(x,y);

      // if is the head moving check for collisions
      if (block.isHead) {
        if ( (enteringCell.block) || (enteringCell.isWall) ) {
          snake.gameover();
          return self;
        }
        if (enteringCell.isFood) {
          self.removeFood(x,y);

          snake.extend();
          return self;
        }
      }

      // update cell load
       enteringCell.block = block;
    };

    self.placeFood = function(x, y) {
      if ( (typeof y === 'undefined') || (typeof x === 'undefined') ) {
        // generate position
        do {
          x = Math.floor(Math.random() * options.columns);
          y = Math.floor(Math.random() * options.rows);
        } while ( (_cell(x, y).block) || (_cell(x, y).$el) );
      }

      var boardX = x * options['cell-width'],
          boardY = y * options['cell-height'],
          $food;

      $food = $.createElement('div');
      $food.className = 'food';

      // moving DOM element to the right position
      $food.style.left = boardX;
      $food.style.top = boardY;

      _$board.appendChild($food);

      _cell(x, y).isFood = true;
      _cell(x, y).$el = $food;

      return self;
    };

    self.removeFood = function(x,y) {
      _cell(x,y).isFood = false;
      _cell(x,y).$el.parentNode.removeChild(_cell(x,y).$el);
      _cell(x,y).$el = null;

      if(options['food-replace'])
        self.placeFood();
    };

    return self.init();
  };


  /**
   * Snake object, any snake action pass through this
   * @param options
   * @returns {Snake}
   * @constructor
   */
  var Snake = function( options ) {

    // calling constructor if not invoked
    if (this.__proto__.constructor !== Snake) {
      return new Snake(options);
    }

    // Fullfill options with default values
    var _defaults = {
      'element': $$('.snake'),
      'x': 0,
      'y': 0,
      'size': 4
    };
    options = $$d(options, _defaults);


    // Private properties
    var self = this;
    var _board = null,
        _$snake = options.element;
    var _blocks,
        _direction,
        _newDirection,
        _isDirectionChanged,
        _isGameOver;


    /**
     * Set a new direction in "updating" state (wait next pulse) and check if the direction is valid
     * @param d
     * @returns {Snake}
     * @private
     */
    var _updateDirection = function( d ) {

      // if is the same direction
      if (d === _direction)
        return self;

      // avoid snake turning
      if ( (d === Directions.UP) && (_direction === Directions.DOWN) )    return self;
      if ( (d === Directions.DOWN) && (_direction === Directions.UP) )    return self;
      if ( (d === Directions.LEFT) && (_direction === Directions.RIGHT) ) return self;
      if ( (d === Directions.RIGHT) && (_direction === Directions.LEFT) ) return self;

      // update current direction
      _newDirection = d;
      _isDirectionChanged = true;

      return self;
    }


    // add block to the DOM inside snake element
    var _addBlock = function() {
      var fifo = [],
        previousBlock,
        newBlock,
        x = options.x,
        y = options.y;

      // if appending block to snake (new block is not the head)
      if (_blocks.length) {
        // loading tail
        previousBlock = _blocks[_blocks.length-1];

        // defining new fifo as a clone of the previous with an extra null movement
        fifo = previousBlock.fifo.slice(0);
        fifo.push(null);

        x = previousBlock.x;
        y = previousBlock.y;
      }

      // creating DOM element
      $block = $.createElement('div');
      $block.className = 'block';

      // setting up logic block element
      newBlock = {
        fifo: fifo,
        element: $block,
        x: x,
        y: y,
        lastDirection: null, // TODO: check if needed
        isHead: (!_blocks.length)
      };

      // adding new logic block
      _blocks.push(newBlock);
      // appending block to the DOM
      _$snake.appendChild($block);

      // move the DOM element to the right position

      if (_board)
        _board.placeBlock(newBlock, x, y, self);

    };


    /**
     * Move a snake block
     * @param $b
     * @param movement
     * @private
     */
    var _moveBlock = function(block, m) {
      var x = block.x,
        y = block.y;

      if (m === Directions.UP) {
        x = block.x;    y = block.y-1;
      } else if (m === Directions.RIGHT) {
        x = block.x+1;  y = block.y;
      } else if (m === Directions.DOWN) {
        x = block.x;    y = block.y+1;
      } else if (m === Directions.LEFT) {
        x = block.x-1;  y = block.y;
      }

      _board.placeBlock(block, x, y, self);
      block.lastDirection = m;

    };


    // Public properties
    self.init = function() {

      // Setup snake
      _blocks = [];
      _isGameOver = false;
      _$snake.classList.remove('gameover');

      // removing all previously added blocks to the DOM
      while (_$snake.firstChild) {
        _$snake.removeChild(_$snake.firstChild);
      }

      // push head (mandatory)
      _addBlock();
      // push tail blocks (optional)
      for (var b = 0; b < options.size-1; b++) _addBlock();

      return self;
    };

    self.setBoardHook = function(board) {
      _board = board;

      _blocks.forEach(function(b) {
        _board.placeBlock(b, b.x, b.y, self);
      });

      return self;
    };

    /**
     * Mode the snake
     * @returns {Snake}
     */
    self.move = function() {
      if (_isGameOver) return self;

      if (_isDirectionChanged) {
        // remove old direction class
        _$snake.classList.remove('up');
        _$snake.classList.remove('right');
        _$snake.classList.remove('down');
        _$snake.classList.remove('left');

        // add new direction class
        _$snake.classList.add(DirectionsInverse[_newDirection]);
        _isDirectionChanged = false;
        _direction = _newDirection;

        $$e('snake-direction-changed');
      }

      if (_direction === null) return self;

      for ( var i = 0; i < _blocks.length; i++) {
        // feed the block FIFO with a movement
        _blocks[i].fifo.push(_direction);

        // consume a movement from the block FIFO
        var movement = _blocks[i].fifo.shift();
        _moveBlock(_blocks[i], movement);
      }

      return self;
    };

    self.extend = function() {
      _addBlock();
    };

    self.gameover = function() {
      _isGameOver = true;
      _$snake.classList.add('gameover');
      return self;
    };

    self.stop = function() {
      _$snake.classList.remove(_direction);
      return self;
    };

    self.goUp = function () {
      $$e('snake-direction-up', _$snake);
      _updateDirection(Directions.UP);
      return self;
    };
    self.goRight = function () {
      $$e('snake-direction-right', _$snake);
      _updateDirection(Directions.RIGHT);
      return self;
    };
    self.goDown = function () {
      $$e('snake-direction-down', _$snake);
      _updateDirection(Directions.DOWN);
      return self;
    };
    self.goLeft = function () {
      $$e('snake-direction-left', _$snake);
      _updateDirection(Directions.LEFT);
      return self;
    };

    return self.init();
  };

  // Exposing objects
  globals.Board = Board;
  globals.Snake = Snake;

})(this);