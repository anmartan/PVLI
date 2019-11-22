import {dungeon, room} from '../Enemies and World/dungeon.js';
import {textButton, editorMenu} from '../UI/ui.js';
import {tilemap} from '../Enemies and World/tilemap.js';
import {enemyManager} from '../Enemies and World/enemy.js';
import {trapManager} from '../Enemies and World/traps.js';





const  scene =
{
    key: "DungeonEditor",
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.image("default","../assets/debug/default.png");
        this.load.image("default2","../assets/debug/default2.png");
        this.load.image("white","../assets/debug/white.png");
        this.load.image("white2","../assets/debug/white2.png");
        this.load.image("yellow","../assets/debug/yellow.png");
        this.load.image("yellow2","../assets/debug/yellow2.png");
        this.load.image("pink","../assets/debug/pink.png");
        this.load.image("pink2","../assets/debug/pink2.png");
        this.load.image("green","../assets/debug/green.png");
        this.load.image("green2","../assets/debug/green2.png");
        this.load.image("spikes", "../assets/traps/spikes.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        this.rooms = [ new room(5,new trapManager(),new enemyManager(),this),new room(7,new trapManager(),new enemyManager(),this), new room(9,new trapManager(),new enemyManager(),this) ];
        this.dungeon = new dungeon(this.rooms);
        this.actual = 0;
        this.game.dungeon = new dungeon(this.rooms);

        
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
            style : {fontFamily:"m5x7", fontSize:"16px"},
        }
        let continuar = new textButton(config,110,160,"Continuar");
        let scene;
        continuar.on("pointerdown", () =>
        {
            console.log(this);
            this.game.scene.stop("DungeonEditor");
            let dungeon = update(this);
            console.log(dungeon);
            socket.emit("finished", dungeon);
            console.log("Después de lanzar mensaje");

        },[],this)

        let update = function updateGameDungeon(scene) {
            scene.game.dungeon = new dungeon(scene.rooms);
            scene.editorMenu.save(scene.game.dungeon);
            return scene.game.dungeon;
        }
        socket.on("startDung", (dungeon, inventory) =>
        {
            this.game.inventory = inventory;
            this.game.scene.start("DungeonRunAH");
        })
    },
    update : function(delta)
    {

    }
    
}
export default scene;



