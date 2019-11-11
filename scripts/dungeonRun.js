import {player} from "./player.js";
import {zombie} from "./enemy.js";
import {tilemap} from './tilemap.js';
import {spikes} from "./traps.js";

const scene = {
    key: "DungeonRun",
    preload: function()
    {
        //Cargar tiles
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");

        //cargar imágenes del player
        this.load.image("caballero_idle0", "../assets/player/knight_m_idle_anim_f0.png")
        this.load.image("caballero_idle1", "../assets/player/knight_m_idle_anim_f1.png")
        this.load.image("caballero_idle2", "../assets/player/knight_m_idle_anim_f2.png")
        this.load.image("caballero_idle3", "../assets/player/knight_m_idle_anim_f3.png")

        this.load.image("sword", "../assets/player/weapon_anime_sword.png")

        this.load.image("zombie_idle0", "../assets/enemies/zombie_idle_anim_f0.png")
        this.load.image("zombie_idle1", "../assets/enemies/zombie_idle_anim_f1.png")
        this.load.image("zombie_idle2", "../assets/enemies/zombie_idle_anim_f2.png")
        this.load.image("zombie_idle3", "../assets/enemies/zombie_idle_anim_f3.png")

        this.load.image("spikes", "../assets/traps/spikes.png");
    },
    create: function()
    {
        //Cargar tile map
        this.tileMap = new tilemap(this, "tiles",16, 1, "DungeonTiles");
        this.actual=0;
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
        let entranceRec = this.add.zone(16*2+8, 16*5+8, 16, 16)
        this.physics.add.existing(entranceRec);
        entranceRec.body.debugBodyColor="0x00ff00";

        let exitRec = this.add.zone(16*8+8, 16*5+8, 16, 16);
        this.physics.add.existing(exitRec);
        exitRec.body.debugBodyColor="0x00ff00";
        

        this.hero = new player (this, (16*4), (16*5), 30, "caballero_idle0", playerIdle, {name:"sword", pos:{x:0,y:0}, scale:0.5}); //x debería ser 48 e y debería ser 80


        this.game.dungeon.rooms[this.actual].enemies.summonEnemies(this,this.hero,this.hero.weapon,this.tileMap.Walls); //invoca a los enemigos, y activa las físicas y colisiones
        this.game.dungeon.rooms[this.actual].traps.CreateTraps(this,this.hero, this.tileMap.Walls);


        this.physics.add.collider(this.hero, this.tileMap.Walls);


        this.physics.add.overlap(this.hero, exitRec, () => 
        {
            this.game.dungeon.rooms[this.actual].enemies.hideAllAlive();
            this.actual = (this.actual+1)%3;
            this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
            this.hero.x = ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8; 
            this.hero.y = (16*5) + 2; 
            entranceRec.x = ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8;
            exitRec.x = (16*12) - ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8;
            this.game.dungeon.rooms[this.actual].enemies.summonEnemies(this,this.hero,this.hero.weapon,this.tileMap.Walls); //invoca a los enemigos, y activa las físicas y colisiones
        });
   },
    update: function(delta)
   {

        this.hero.handleLogic();
   }
   
};

export default scene;