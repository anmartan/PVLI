import DungeonEditor from './Scenes/dungeonEditor.js'
import DungeonRun from './Scenes/dungeonRun.js'
import DungeonRunAH from  './Scenes/dungeonRunAH.js'
import SelectGameMode from './Scenes/selectMode.js'
import ItemShop from "./Scenes/itemShop.js"
import EndGame from "./Scenes/endScene.js"
let tileSize = 32;
let scenes = [SelectGameMode, ItemShop, DungeonEditor, DungeonRun,DungeonRunAH, EndGame]
let config = {
    pixelArt: true,
    parent:document.getElementById("GameCanvas"),
    createDOMContainer:true,
    type: Phaser.AUTO,
    width: 11*tileSize,//960,
    height: 11*tileSize,
    backgroundColor:"#181425",/* COMENTANDO ESTO POR LO MENOS SE VE
    scale: {   //Esto sirve para centrar el canvas
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALY
    },*/
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
            debug: true
        }
    },
    scene: scenes,
    canvas: {
        display: proyectoFFOOFF
    }
}

let game = new Phaser.Game(config);
game.dungeon;
game.tiles;
game.tileSize = tileSize;
game.fromTileToPixel = 
function fromTileToPixel(tileX, tileY, scale=1, offsetX=0,offsetY=0)
{

}
game.fromPixelToTile = 
function fromPixelToTile(pos, scale=1, offsetX=0,offsetY=0)
{
    pos.x = pos.x/tileSize;
    pos.x-1.5;//(Si se utiliza el centro como pivote)
    pos.y = pos.y/tileSize;
    pos.y-1.5;//(Si se utiliza el centro como pivote)
}


