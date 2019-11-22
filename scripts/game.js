import DungeonEditor from './Scenes/dungeonEditor.js'
import DungeonRun from './Scenes/dungeonRun.js'
import DungeonRunAH from  './Scenes/dungeonRunAH.js'
import SelectGameMode from './Scenes/selectMode.js'
import ItemShop from "./Scenes/itemShop.js"

let scenes = [SelectGameMode,ItemShop, DungeonEditor, DungeonRun,DungeonRunAH]
let config = {
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

}

let  game = new Phaser.Game(config);
game.dungeon;
game.tiles;


