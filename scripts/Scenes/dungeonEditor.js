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
        let music = this.sound.add("introAntiHero");
        music.play({volume:0.1});
        let loop =this.sound.add("loopAntiHero") 
        loop.setLoop(true);
        music.once("complete", ()=> {loop.play({volume:0.1})})

        this.money = 100;
        this.rooms = Array();
        this.rooms = [ new room(5,new trapManager(),new enemyManager(),this),new room(5,new trapManager(),new enemyManager(),this), new room(5,new trapManager(),new enemyManager(),this) ];
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
            style : {fontFamily:"m5x7", fontSize:"32px"},
        }
        this.continuar = new textButton(config,110 *2 ,160 * 2,"Continuar");
        this.continuar.on("pointerdown", () =>
        {
            this.editorMenu.timer.setTimeToZero();
            this.game.scene.stop("DungeonEditor");
            let dungeon = update(this);
            socket.emit("finished", dungeon);

        },[],this)

        let update = function updateGameDungeon(scene) {
            scene.game.dungeon = new dungeon(scene.rooms);
            scene.editorMenu.save(scene.game.dungeon);
            return scene.game.dungeon;
        }
        socket.on("startDung", (data) =>
        {
            this.game.inventory = data.inventory;
            this.game.scene.start("DungeonRunAH");
        })

        socket.on("continuar", ()=>  this.continuar.emit("pointerdown"));   
    },
    update : function(time,delta)
    {

    }
    
}
export default scene;



