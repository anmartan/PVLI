import {dummiePlayer} from "../Enemies and World/dummieEntitties.js";
import {enemyManager} from "../Enemies and World/enemy.js";
import {tilemap} from '../Enemies and World/tilemap.js';
import {trapManager} from "../Enemies and World/traps.js";

const scene = {
    key: "DungeonRunAH",
    preload: function()
    {    },
    create: function()
    {
        //Cargar tile map
        this.tileMap = new tilemap(this, "tiles2",32, 1, "tilesImage");
        this.actual=0;
        console.log(this.game.dungeon);
        console.log(this.actual);
        console.log(this.game.dungeon.rooms[this.actual]);
        this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
        //--------------------------------------------------------//

        let playerIdle = this.anims.create({     //animación del jugador
            key: 'idle',
            frames:
            [
                {key: "caballero_idle0"},
                {key: "caballero_idle1"},
                {key: "caballero_idle2"},
                {key: "caballero_idle3"},
            ],
            frameRate: 10,
            repeat: -1,
        });
        let zombieIdle = this.anims.create({    //animación del zombie
            key: 'idleZ',
            frames:
            [
                {key: "zombie_idle0"},
                {key: "zombie_idle1"},
                {key: "zombie_idle2"},
                {key: "zombie_idle3"},
            ],
            frameRate: 10,
            repeat: -1,
        });
    
        //this.hero = new player (this, (16*4), (16*5), 30, "caballero_idle0", playerIdle, {name:"sword", pos:{x:0,y:0}, scale:0.5}); //x debería ser 48 e y debería ser 80
        this.hero = new dummiePlayer(this, (16*4), (16*5), "caballero_idle0", "Sword_0", 0.5 ).play(playerIdle);
        this.enemies = new enemyManager(this,this.game.dungeon.rooms[this.actual].enemies.enemiesInfo);
        this.enemies.summonDummyEnemies(this); //invoca a los enemigos

        this.traps = new trapManager(this.game.dungeon.rooms[this.actual].traps.traps);
        this.traps.createDummyTraps(this);
        console.log(this.enemies);

        socket.on("changeRoom", ()=>
        {
            this.enemies.hideAllAlive();
            this.actual = (this.actual+1)%3;
            this.enemies = new enemyManager(this,this.game.dungeon.rooms[this.actual].enemies.enemiesInfo);
            //this.traps = new trapManager(this.game.dungeon.rooms[this.actual].traps.traps);
            this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
            this.hero.x = ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8; 
            this.hero.y = (16*5) + 2; 
            this.enemies.summonDummyEnemies(this); //invoca a los enemigos, y activa las físicas y colisiones
            //this.traps.CreateTraps(this, this.hero, this.tileMap.Walls);
        });
        

   },
    update: function(delta)
   {

   }
   
};

export default scene;