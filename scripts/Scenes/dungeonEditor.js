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

    },
    create : function()
    {
        this.rooms = Array();
        this.rooms = [ new room(5,new trapManager(),new enemyManager(this),this),new room(7,new trapManager(),new enemyManager(this),this), new room(9,new trapManager(),new enemyManager(this),this) ];
        this.dungeon = new dungeon(this.rooms);
        this.actual = 0;
        this.game.dungeon = new dungeon(this.rooms);
        let hoffset = this.game.tileSize/2*5.5;
        let voffset = 0;
        this.tileMap = new tilemap(this, "tiles2", this.game.tileSize, 0.5, "tilesImage",hoffset, voffset);
        this.editorMenu = new editorMenu(this,hoffset,voffset,this.game.tileSize);
        

        let config =
        {
            scene : this,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#FFFFFF",
            style : {fontFamily:"arial", fontSize:"15px"},
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



