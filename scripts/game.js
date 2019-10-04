import scene1 from './scene1.js'

var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scale: {   //Esto sirve para centrar el canvas
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALY
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false
        }
    },
    scene: [scene1]

}

var game = new Phaser.Game(config);
