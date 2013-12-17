
Template.game.events({

  'moveUp': function (event, template) {
    // Check if P1 - move NE || move NW 
    Cursor.move("NE");
  },

  'moveRight': function (event, template) {
    Cursor.move("E");
  },

  'moveDown': function (event, template) {
    // Check for P1, move SE || SW
    Cursor.move("SE");
  },

  'moveLeft': function (event, template) {
    Cursor.move("W");
  },

  'moveConfirm': function (event, template) {
    Cursor.confirm();
  },


  'fire': function (event, template) {
    console.log("Fire event Fired!");
    Player.fire();
  },

});


Template.game.rendered = function() {

  Game.init(this.find("#the-game"));

};



/*************************************
 * Game Globals
 ************************************/
var stage,
    hex,
    mapsize,
    BGLayer,
    FGLayer,
    player,
    cursor;


/*************************************
 * Game Interface
 ************************************/
var Game = {};

/* 
 * Initialize Game ******************/
Game.init = function(game) {

  Crafty.init(Crafty.DOM.window.width, Crafty.DOM.window.height, 'the-game');

  mapsize = {x:20,y:10};
  stage = Game.buildStage();


  Game.createKeybindings(game);


  cursor = Cursor.init();

};

/*
 * Initialize Game Stage ************/
Game.buildStage = function() {

  hex = Crafty.hexametric.init(64, 64, mapsize.x, mapsize.y);

  Crafty.sprite(64, "img/tiles/tile-sprite.png", {
    "tile0":[0,0],
    "tile1":[1,0],
    "tile2":[2,0],
    "tile3":[3,0],
    "tile4":[4,0],
    "tile5":[5,0],

    "CursorSprite":[0,1],
  });
  var map = [];

  _.times(mapsize.x, function(x) {

    var row = [];

    _.times(mapsize.y,function(y) {
      var tile = Game.getRandomInt(0,5);
      row.push(tile);

      var t = Crafty.e("2D, DOM, tile"+tile)
                .attr({w: 64, h: 64});

      hex.place(t, x, y, 1);

    });

    map.push(row);

  });

  return map;
};

/*
 * Initialize Game Key Bindings *****/
Game.createKeybindings = function(game) {

  /* Reset All key press bindings
   ************************************/
  keypress.reset();

  /* Register player move Events
   * Bind to 'w' or 'up' for top
   * Bind to 'd' or 'right' for right
   * Bind to 's' or 'down' for down
   * Bind to 'a' or 'left' for left
   * Bind to 'e' for movement confirm
   ************************************/
  var moveUpEvent = new Event('moveUp');
  var moveRightEvent = new Event('moveRight');
  var moveDownEvent = new Event('moveDown');
  var moveLeftEvent = new Event('moveLeft');
  var moveConfirmEvent = new Event('moveConfirm');

  var movementData = [
    { keys: ['w', 'up'],    event: moveUpEvent },
    { keys: ['d', 'right'], event: moveRightEvent },
    { keys: ['s', 'down'],  event: moveDownEvent },
    { keys: ['a', 'left'],  event: moveLeftEvent },
    { keys: ['e'],  event: moveConfirmEvent },
  ];

  movementData.forEach(function(direction){
    direction.keys.forEach(function(key){
      keypress.register_combo({
        "keys": key,
        "on_keydown": function(e, c){
          if(!Session.get('chatOpen')) {
            e.preventDefault();
            game.dispatchEvent(direction.event);
          }
        }
      });
    });
  });


  /* Register Fire Event
   * Bind to spacebar keypresses
   ************************************/
  var fireEvent = new Event('fire');

  keypress.combo('space', function (e, c) { 
    if(!Session.get('chatOpen')) {
      e.preventDefault();
      game.dispatchEvent(fireEvent);
    }
  });

};


/*
 * Game Utility Functions ***********/
Game.getRandomInt = function(min, max) {
  // Accept single parameter usage
  if(max === typeof undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Game.getTanDeg = function(deg) {
  return Math.tan(deg * Math.PI/180);
};

Game.degToRad = function(deg) {
  return deg * Math.PI / 180;
};

Game.radToDeg = function(rad) {
  return rad * 180 / Math.PI;
};



/*************************************
/* Player Interface 
 ************************************/
var Player = {};

/* 
 * Player Init **********************/
Player.init = function() {
  console.log("initializing player");
};

/*
 * Player Move **********************/
Player.move = function(delta) {
  console.log("moving player to: " + delta );
};

/* 
 * Player Fire Guns *****************/
Player.fire = function(){
  console.log("player firing guns");
};

/* 
 * Player damage ********************/
Player.damage = function(){
  console.log("player damaged");
};



/*************************************
/* Cursor Interface 
 ************************************/
Cursor = {};

/* 
 * Cursor Init **********************/
Cursor.init = function() {

  var x = 0;
  var y = 0;

  var c = Crafty.e("2D, DOM, SpriteAnimation, CursorSprite")
                .reel('CursorBlink', 1000, [[0,1], [2,1]])
                .animate('CursorBlink', -1);

  hex.place(c, x, y, 2);

  return c;

};

Cursor.isOdd = function(y) {

  if(y%2)
    return true;
  else
    return false;

};

Cursor.checkBounds = {};

Cursor.checkBounds.North = function(y) {
  if( y > 0 )
    return true;
  else 
    return false;
};

Cursor.checkBounds.South = function(y) {
  if( y < (mapsize.y - 1) )
    return true;
  else 
    return false;
};

Cursor.checkBounds.East = function(x) {
  if( x < (mapsize.x - 1) ) 
    return true;
  else
    return false;
};

Cursor.checkBounds.West = function(x) {
  if( x > 0 )
    return true;
  else
    return false;
};



/*
 * Cursor Move **********************/
Cursor.move = function(direction) {

  var pos = cursor.pos();
  var hexPos = hex.px2pos(pos._x, pos._y);

  var newX = hexPos.x;
  var newY = hexPos.y;
  var moveFailed = false;


  // Don't forget mapsize.x is just number of columns, not the zero-base array index
  switch(direction) {
    case "E":
      console.log("Moving E");
      if(Cursor.checkBounds.East(hexPos.x) ) 
        newX += 1;
      break;

    case "SE":
      console.log("Moving SE");
      if(Cursor.checkBounds.South(hexPos.y) ) {
        newY += 1;

        if( Cursor.checkBounds.East(hexPos.x) && !Cursor.isOdd(hexPos.y) )
          newX += 1;
      }

      break;

    case "SW":
      console.log("Moving SW");
      if(Cursor.checkBounds.South(hexPos.y) ) {
        newY += 1;
        if( Cursor.checkBounds.West(hexPos.x) && Cursor.isOdd(hexPos.y) )
          newX -= 1;
      }

      break;

    case "W":
      console.log("Moving W");
      if(Cursor.checkBounds.West(hexPos.x) )
        newX -= 1;
      break;

    case "NW":
      console.log("Moving NW");
      if(Cursor.checkBounds.North(hexPos.y) ) {
        newY -= 1; 

        if( Cursor.checkBounds.West(hexPos.x) && Cursor.isOdd(hexPos.y) )
          newX -= 1;
      }
      
      break;

    case "NE":
      console.log("Moving NE");
      if(Cursor.checkBounds.North(hexPos.y) ) {
        newY -= 1; 

        if( Cursor.checkBounds.East(hexPos.x) && !Cursor.isOdd(hexPos.y) )
          newX += 1;
      }
      
      break;

    default:
      break;
  };



  // Check if Move failed
  if( (hexPos.x === newX) && (hexPos.y === newY) )
    moveFailed = true;

  // Handle Failed/Successful Move
  if(moveFailed) {
    console.log("Move Failed");
    console.log("hexPos: " + hexPos.x + ", " + hexPos.y );
    console.log("mapsize: " + mapsize.x + ", " + mapsize.y );
  } else
    hex.place(cursor, newX, newY, 2);

};

/* 
 * Cursor damage ********************/
Cursor.confirm = function(){
  console.log("Cursor confirmed");
};
