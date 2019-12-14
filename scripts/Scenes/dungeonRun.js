import {player} from "../Player and Items/player.js";
import {zombie, enemyManager} from "../Enemies and World/enemy.js";
import {tilemap} from '../Enemies and World/tilemap.js';
import {spikes, trapManager} from "../Enemies and World/traps.js";
import { rec } from "./utils.js";

const scene = {
    key: "DungeonRun",
    createRec: function() 
    {

    },
    preload: function()
    {},
    create: function()
    {
        //Cargar tile map
        this.tileMap = new tilemap(this, "tiles2",this.game.tileSize, 1, "tilesImage");
        this.actual=0;
        console.log(this.game.dungeon);
        console.log(this.actual);
        console.log(this.game.dungeon.rooms[this.actual]);
        this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
        //--------------------------------------------------------//


        let actualRoom=this.game.dungeon.rooms[this.actual];
        let size=actualRoom.size;

        let entranceRec = new rec(this);
        let exitRec =  new rec(this);
        entranceRec.setRecPos(size,false);
        exitRec.setRecPos(size,true);

        this.hero = new player (this, (this.game.tileSize*4), (this.game.tileSize*5), 30, "caballero_idle0", "idle", {name:"sword", pos:{x:0,y:0}, scale:0.5}); //x debería ser 48 e y debería ser 80
        this.enemies = new enemyManager(this,actualRoom.enemies.enemiesInfo);
        this.enemies.summonEnemies(this,this.hero, this.hero.weaponManager.weaponGroup,this.tileMap.Walls); //invoca a los enemigos, y activa las físicas y colisiones

        this.traps = new trapManager(actualRoom.traps.traps);
        this.traps.CreateTraps(this, this.hero, this.tileMap.Walls);

        this.physics.add.collider(this.hero, this.tileMap.Walls);

        this.physics.add.overlap(this.hero, exitRec, () => 
        {
            //Informar al servidor de que ha habido un cambio de habitación
            socket.emit("changeRoom");

            //En caso de que quede algún enemigo vivo, lo ocultamos de la pantalla
            this.enemies.hideAllAlive();

            //Actualizamos la habitación a la siguiente
            this.actual = (this.actual+1)%3;
            let actualRoom=this.game.dungeon.rooms[this.actual];
            this.enemies = new enemyManager(this,actualRoom.enemies.enemiesInfo);
            this.traps = new trapManager(actualRoom.traps.traps);
            let size = actualRoom.size;
            this.tileMap.changeRoom(size);

            //cambiamos la posición del héroe y de los colliders de salida y entrada
            this.hero.x = ((10.5-(size))/2)*this.game.tileSize; 
            this.hero.y = (this.game.tileSize*5) + 2; 
            entranceRec.setRecPos(size,false);
            exitRec.setRecPos(size,true);
            
            //Creamos las nuevas trampas y enemigos
            this.enemies.summonEnemies(this, this.hero, this.hero.weaponManager.weapon, this.tileMap.Walls); //invoca a los enemigos, y activa las físicas y colisiones
            this.traps.CreateTraps(this, this.hero, this.tileMap.Walls);
        })
        this.enemyGroup = this.enemies.enemies.getChildren();
        ;
    },
    update: function(delta)
    {

        this.hero.handleLogic();
        this.enemies.enemies.getChildren()/*this.enemyGroup*/.forEach(enemy => {enemy.update();},this);
    }
   
};

export default scene;