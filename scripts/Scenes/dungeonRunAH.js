import {dummiePlayer, dummieEnemy} from "../Enemies and World/dummieEntitties.js";
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
        this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
        //--------------------------------------------------------//
        
        this.hero = new dummiePlayer(this, (16*4), (16*5), "caballero_idle0", "Sword_0", 0.5 ).play("idle");
        this.enemies = new enemyManager(this,this.game.dungeon.rooms[this.actual].enemies.enemiesInfo);
        this.enemies.summonDummyEnemies(this); //invoca a los enemigos

        this.traps = new trapManager(this.game.dungeon.rooms[this.actual].traps.traps);
        this.traps.createDummyTraps(this);

        socket.on("changeRoom", ()=>
        {
            this.enemies.hideAllAlive();
            this.actual = (this.actual+1);
            if(this.actual>=3){this.finish(true);}
            else
            {
                this.enemies = new enemyManager(this,this.game.dungeon.rooms[this.actual].enemies.enemiesInfo);
                //this.traps = new trapManager(this.game.dungeon.rooms[this.actual].traps.traps);
                this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
                this.enemies.summonDummyEnemies(this); //invoca a los enemigos, y activa las físicas y colisiones
                //this.traps.CreateTraps(this, this.hero, this.tileMap.Walls);
            }
        });

        socket.on("enemySpawned", (enemy)=>
        {
            console.log("Voy a hacer un spawn de: " + enemy.enemy.type+" en: "+enemy.id);
            //new dummieEnemy(this,5,5,"zombie_idle0",zombieIdle,this.enemies,0);
            this.enemies.addEnemy(this.enemies.summonDummy(enemy.enemy,this,enemy.id));
        })

        socket.on("deadHero",()=>{        
            console.log("ha muerto el hero")
            this.finish(false);
        })
        this.finish= function (bool) {
            socket.emit("DungeonFinished");
            bool ? this.game.endMessage="Has perdido":this.game.endMessage="Has ganado";
            this.game.player="Off";
            this.game.scene.stop("DungeonRunAH");
            this.game.scene.start("EndGame");
        }
   },

    update: function(delta)
   {

   }
   
};

export default scene;