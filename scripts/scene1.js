
    import {livingEntity, player} from "./player.js";
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
        //Cargar dungeon y tile map
        this.dungeon = this.game.dungeon;
        let tileMap = this.add.tilemap("tiles");
        let side = 16;
        let scale = 1;
        let pos = ((11*side)-((side*scale)*11))/2;
        this.DungeonTiles = tileMap.addTilesetImage("DungeonTiles");
        this.Background = tileMap.createDynamicLayer("Background", [this.DungeonTiles],0,0);
        this.Ground = tileMap.createDynamicLayer("Ground", [this.DungeonTiles],pos,pos);
        this.Walls = tileMap.createDynamicLayer("Walls", [this.DungeonTiles],pos,pos);
        this.Ground.scale=scale;
        this.Walls.scale=scale;
        for(let i= 0; i<3;i++)
        {
            this.dungeon.rooms[i].scene = this;
        }
        //--------------------------------------------------------//
            this.physics.world.setBounds(0,0,176,176)
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
        this.hero = new player(this,50,50,2,"caballero_idle0");
        console.log(" ... ");
        this.hero.body.setCollideWorldBounds(true);
        this.hero.play("idle");
        this.hero.setScale(1.5,1.5); //no se si hace falta pero yo lo veo mejor creo
        this.dungeon.rooms[0].resize(7);
   },
    update: function(delta)
   {
        this.hero.handleLogic();
   }
   
};

export default scene;