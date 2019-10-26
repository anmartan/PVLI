import {player, enemy} from "./player.js";
import {tilemap} from './tilemap.js';

    const scene = {
        key: "scene1",
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
        },
        create: function()
        {
        //Cargar tile map
        this.tileMap = new tilemap(this, "tiles",16, 1, "DungeonTiles");
        this.actual=0;

        //--------------------------------------------------------//

        let playerIdle = this.anims.create({
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
        let zombieIdle = this.anims.create({
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
        let entranceRec = this.add.rectangle(16*2+8, 16*5+8, 16, 16, "0x00ff00",0.25);

        this.hero = new player (this, (16*3)-7, (16*5)+2,25,"caballero_idle0",playerIdle, {name:"sword", pos:{x:0,y:0}, scale:0.5}); //x debería ser 48 e y debería ser 80
        this.zombie = new enemy(this, 110,80,2, "zombie_idle0",zombieIdle);

        this.hero.body.setSize(16,16);
        this.hero.body.offset.y=12;
        this.hero.body.setCollideWorldBounds(true);
        this.zombie.body.setCollideWorldBounds(true);

        this.zombie.move();

        this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);

        this.physics.add.collider(this.hero, this.tileMap.Walls);
        this.physics.add.collider(this.zombie, this.tileMap.Walls);
        this.physics.add.collider(this.hero, this.zombie);

        let exitRec = this.add.rectangle(16*8+8, 16*5+8, 16, 16, "0x00ff00", 0.25);
        exitRec = this.physics.add.existing(exitRec, true);
        this.physics.add.collider(this.hero, exitRec, () => 
        {
            this.actual = (this.actual+1)%3;
            this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
            this.hero.sprite.x = ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8; 
            this.hero.sprite.y = (16*5) +2 ; 
            entranceRec.x = ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8;
            exitRec.x = (16*12) - ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16-8;
            exitRec.body.x = (16*11) - ((11-(this.game.dungeon.rooms[this.actual].size))/2)*16;
        });
   },
    update: function(delta)
   {

        this.hero.handleLogic();

   }
   
};

export default scene;