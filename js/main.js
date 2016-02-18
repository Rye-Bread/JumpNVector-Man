var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/Asternaught.png', 32, 48);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/background2.png');
    game.load.image('Vector', 'assets/arrow.png');
    game.load.audio('music', 'assets/Project Lunar Chicken - ChrisK - Lunar Chicken.mp3');
    game.load.audio('jump', 'assets/spaceman.wav');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
//Stuff for the VECTOR
var sprite;
var fuel = 100;
var full = 1;
var fuelstring = "Charge: "
var usedvec = 0;
var music;
var musicincr;
var jump;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);
    
    //Arrow Stuff
    sprite = game.add.sprite(260, 100, 'Vector');
    sprite.anchor.set(0.5);
    game.physics.arcade.enable(sprite);
    //  This adjusts the collision body size.
    sprite.body.setSize(32, 32, 0, 0);

    //  We'll set a lower max angular velocity here to keep it from going totally nuts
    sprite.body.maxAngular = 500;

    //  Apply a drag otherwise the sprite will just spin and never slow down
    sprite.body.angularDrag = 50;
    
    //Make sprite invisible so it doesn't get in the way.
    sprite.visible = false;
    
    //Make text for charge.
    chargeText = game.add.text(player.x -10, player.y - 10, fuelstring + fuel, { font: '12px Arial', fill: '#fff' });

    cursors = game.input.keyboard.createCursorKeys();
    //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
    jumpButton = cursors.up;
    musicoff = game.input.keyboard.addKey(Phaser.Keyboard.M);
    musicon = game.input.keyboard.addKey(Phaser.Keyboard.N);
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    jump.volume = 0.1;

}

function update() {
    game.physics.arcade.collide(player, layer);

    //PAUSING MUSIC ROUND THREE DAMNIT PHASER.
    if (musicoff.isDown)
        music.pause();
    if (musicon.isDown)
        music.resume();
    chargeText.x = player.x - 10;
    chargeText.y = player.y - 10;
    
    //Manage fuel.
    fuel = fuel + 1;
    if (fuel < 0)
        fuel = 0;
    if (fuel > 100)
        fuel = 100;
    //if (fuel == 100 && full != 1)
    //    full = 1;
    if (fuel == 0 /*&& full != 0*/)
        full = 0;
    
    chargeText.text = fuelstring + fuel;

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    //Arrow Stuff.
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.body.angularVelocity = 0;
    //Make the arrow face the cursor, and pin to player.
    sprite.rotation = game.physics.arcade.angleToPointer(sprite);
    sprite.x = player.x;
    sprite.y = player.y;
    
    if (cursors.down.isDown && full == 1)
    {
        game.physics.arcade.velocityFromAngle(sprite.angle, 300, player.body.velocity);
        fuel = fuel - 6;
        usedvec = 1;
    }
    if (!player.body.onFloor() && usedvec == 1 && cursors.down.isUp)
        full = 0;
    if (player.body.onFloor())
        {
        full = 1;
        usedvec = 0;
        }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
        jump.play();
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}