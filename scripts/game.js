import DungeonEditor from './dungeonEditor.js'
import DungeonRun from './dungeonRun.js'
import DungeonRunAH from './serverDependentSide/dungeonRunAH.js'
import SelectGameMode from './selectMode.js'
import ItemShop from "./itemShop.js"

let scenes = [SelectGameMode,ItemShop, DungeonEditor, DungeonRun,DungeonRunAH]
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
    scene: scenes,
    dom: {
        createContainer: true
      }

}

var game = new Phaser.Game(config);
game.dungeon;
game.tiles;


