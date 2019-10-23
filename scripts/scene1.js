import {player} from "./player.js";
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
        },
        create: function()
        {
        //Cargar tile map
        this.tileMap = new tilemap(this, "tiles",16, 1, "DungeonTiles");
        this.actual=0;

        //--------------------------------------------------------//

        this.anims.create({
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
        this.hero = new player(this,100,100,30,"caballero_idle0");
        this.hero.body.setSize(16,16,16,16);
        this.hero.body.setCollideWorldBounds(true);
        this.hero.play("idle");
        this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
        this.physics.add.collider(this.hero, this.tileMap.Walls);
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.key.on("down", () => {this.actual++;this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual%3].size)});

   },
    update: function(delta)
   {

        this.hero.handleLogic();

   }
   
};

export default scene;