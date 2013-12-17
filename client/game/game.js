
Template.game.events({

  'moveUp': function (event, template) {
    console.log("Move Up Fired!");
    Cursor.move("up");
  },

  'moveRight': function (event, template) {
    console.log("Move Right Fired!");
    Cursor.move("right");
  },

  'moveDown': function (event, template) {
    console.log("Move Down Fired!");
    Cursor.move("down");
  },

  'moveLeft': function (event, template) {
    console.log("Move Left Fired!");
    Cursor.move("left");
  },

  'moveConfirm': function (event, template) {
    console.log("Movement Confirmed");
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

      var t = Crafty.e("2D, Canvas, tile"+tile)
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
var Cursor = {};

/* 
 * Cursor Init **********************/
Cursor.init = function() {

  var x = 1;
  var y = 1;

  var c = Crafty.e("2D, Canvas, SpriteAnimation, CursorSprite")
                .reel('CursorBlink', 1000, [[0,1], [2,1]])
                .animate('CursorBlink', -1);

  hex.place(c, x, y, 2);

  return c;

};

/*
 * Cursor Move **********************/
Cursor.move = function(delta) {

  var direction;
  /* Directions
   *
   * 0 - East
   * 1 - South East
   * 2 - South West
   * 3 - West
   * 4 - North West
   * 5 - North East */

  switch(delta) {
    case "up":
      direction = 5;
      break;
    case "right":
      direction = 0;
      break;
    case "down":
      direction = 1;
      break;
    case "left":
      direction = 3;
      break;
    default:
      direction = 0;
      break;
  };

  console.log(cursor);
  console.log(cursor.pos());

  console.log( direction );
};

/* 
 * Cursor damage ********************/
Cursor.confirm = function(){
  console.log("Cursor confirmed");
};
