import DungeonEditor from './dungeonEditor.js'
import DungeonRun from './dungeonRun.js'
import ItemShop from "./itemShop.js"

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
            debug: true
        }
    },
    scene: [ItemShop, DungeonEditor, DungeonRun]

}

var game = new Phaser.Game(config);
game.dungeon;
game.tiles;


