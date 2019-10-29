import scene1 from './scene1.js'
import scene2 from './scene2.js'

var config = {
    pixelArt: true,
    type: Phaser.AUTO,
    width: 176,//960,
    height: 176,
    scale: {   //Esto sirve para centrar el canvas
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALY
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
            debug: false
        }
    },
    scene: [scene2, scene1]

}

var game = new Phaser.Game(config);
game.dungeon;
game.tiles;
