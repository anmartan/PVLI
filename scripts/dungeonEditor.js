import {dungeon, room, trap} from './dungeon.js';
import {textButton, editorMenu} from './ui.js';
import {tilemap} from './tilemap.js';
import {enemyManager} from './enemy.js';

const  scene =
{
    key: "DungeonEditor",
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.image("default","../assets/debug/default.png");
        this.load.image("white","../assets/debug/white.png");
        this.load.image("white2","../assets/debug/white2.png");
        this.load.image("yellow","../assets/debug/yellow.png");
        this.load.image("yellow2","../assets/debug/yellow2.png");
        this.load.image("pink","../assets/debug/pink.png");
        this.load.image("pink2","../assets/debug/pink2.png");
        this.load.image("spikes", "../assets/traps/spikes.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        this.rooms = [ new room(5,0,new enemyManager(),this),new room(7,0,new enemyManager(),this), new room(9,0,new enemyManager(),this) ];
        this.dungeon = new dungeon(this.rooms);
        this.actual = 0;
        
    },
    create : function()
    {
        let hoffset = 8*5.5;
        let voffset = 0;
        this.tileMap = new tilemap(this, "tiles", 16, 0.5, "DungeonTiles",hoffset, voffset);
        this.editorMenu = new editorMenu(this,hoffset,voffset);
        
        let config =
        {
            scene : this,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#FFFFFF",
            style : {fontFamily:"arial", fontSize:"15px"},
        }
        let continuar = new textButton(config,110,160,"Continuar");
        continuar.on("pointerdown", () =>
        {
            this.game.scene.start("DungeonRun");
            this.game.scene.stop("DungeonEditor");
            this.game.dungeon = new dungeon(this.rooms);
            this.editorMenu.save(this.game.dungeon);
        })
    },
    update : function(delta)
    {

    }
    
}
export default scene;

