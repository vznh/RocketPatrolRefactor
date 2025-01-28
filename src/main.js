// Jason Son
// Rocket Patrol but as historically accurate as humanly possible
// 2 hours
// Create a new enemy spaceship type: see Apollo.js (5)
// New timing/scoring mechanism that adds time to the counter if successful hit. Else, loses time. More time attributed if Apollo hit. (5)
// Implemented mouse control for player movement and left click to fire. (5)
//

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)
game.settings = {
  spaceshipSpeed: 3,
  apolloSpeed: 4,
  gameTimer: 60000,
  controlType: 'keyboard'
};

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, keyMOUSE, keyKEYBOARD
