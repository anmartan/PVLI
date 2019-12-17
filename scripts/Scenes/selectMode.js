const SelectGameMode=
{
    key: "selectGameMode",
    preload : function() 
    {
        this.load.image("button","../assets/debug/white.png");
        this.load.image("button2","../assets/debug/pink.png");


        this.load.image("default",  "../assets/debug/default.png");
        this.load.image("default2", "../assets/debug/default2.png");
        this.load.image("white",    "../assets/ui/dungeonEditor/traps.png");
        this.load.image("white2",   "../assets/ui/dungeonEditor/traps.png");
        this.load.image("yellow",   "../assets/ui/dungeonEditor/size.png");
        this.load.image("yellow2",  "../assets/ui/dungeonEditor/size.png");
        this.load.image("pink",     "../assets/ui/dungeonEditor/enemies.png");
        this.load.image("pink2",    "../assets/ui/dungeonEditor/enemies.png");
        this.load.image("green",    "../assets/debug/green.png");
        this.load.image("green2",   "../assets/debug/green2.png");


        this.load.image("Sword_0", "../assets/player/sword_0.png")
        this.load.image("Sword_1", "../assets/player/sword_1.png")
        this.load.image("Sword_2", "../assets/player/sword_2.png")
        this.load.image("Sword_3", "../assets/player/sword_3.png")

        this.load.image("Bow_0", "../assets/player/sword_0.png")
        this.load.image("Bow_1", "../assets/player/sword_1.png")
        this.load.image("Bow_2", "../assets/player/sword_2.png")
        this.load.image("Bow_3", "../assets/player/sword_3.png")
        

        this.load.image("caballero_idle0", "../assets/player/knight_m_idle_anim_f0.png")
        this.load.image("caballero_idle1", "../assets/player/knight_m_idle_anim_f1.png")
        this.load.image("caballero_idle2", "../assets/player/knight_m_idle_anim_f2.png")
        this.load.image("caballero_idle3", "../assets/player/knight_m_idle_anim_f3.png")

        this.load.image("zombie_idle0", "../assets/enemies/zombie_idle0.png")
        this.load.image("zombie_idle1", "../assets/enemies/zombie_idle1.png")

        this.load.image("bee_idle0", "../assets/enemies/zombie_idle_anim_f0.png")
        this.load.image("bee_idle1", "../assets/enemies/zombie_idle_anim_f1.png")
        this.load.image("bee_idle2", "../assets/enemies/zombie_idle_anim_f2.png")
        this.load.image("bee_idle3", "../assets/enemies/zombie_idle_anim_f3.png")

        this.load.image("beetle_idle0", "../assets/enemies/zombie_idle_anim_f0.png")
        this.load.image("beetle_idle1", "../assets/enemies/zombie_idle_anim_f1.png")
        this.load.image("beetle_idle2", "../assets/enemies/zombie_idle_anim_f2.png")
        this.load.image("beetle_idle3", "../assets/enemies/zombie_idle_anim_f3.png")

        this.load.image("wizard_idle0", "../assets/enemies/zombie_idle_anim_f0.png")
        this.load.image("wizard_idle1", "../assets/enemies/zombie_idle_anim_f1.png")
        this.load.image("wizard_idle2", "../assets/enemies/zombie_idle_anim_f2.png")
        this.load.image("wizard_idle3", "../assets/enemies/zombie_idle_anim_f3.png")

        this.load.image("spider_idle0", "../assets/enemies/zombie_idle_anim_f0.png")
        this.load.image("spider_idle1", "../assets/enemies/zombie_idle_anim_f1.png")
        this.load.image("spider_idle2", "../assets/enemies/zombie_idle_anim_f2.png")
        this.load.image("spider_idle3", "../assets/enemies/zombie_idle_anim_f3.png")

        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");

        this.load.image("tilesImage","../assets/ground/intento32/tileset_dungeon.png");
        this.load.tilemapTiledJSON("tiles2","../assets/ground/intento32/intento.json");


    },
    create:function () {

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
            ],
            frameRate: 5,
            repeat: -1,
        });


        let left = this.add.sprite(10,88,"button");
        let right = this.add.sprite(166,88,"button2");

        left.setInteractive();
        right.setInteractive();

        left.on("pointerover", () =>
        {
            console.log("Héroe");
        })
        left.on("pointerdown", () =>
        {
            this.game.scene.stop("selectGameMode");
            socket.emit("start", "Hero");
            socket.on("startMatch", () =>
            {
                this.game.scene.start("ItemShop");
            })
        })
        right.on("pointerover", () =>
        {
            console.log("Anti-Héroe");
        })
        right.on("pointerdown", () =>
        {
            this.game.scene.stop("selectGameMode");
            socket.emit("start", "AntiHero");
            socket.on("startMatch", () =>
            {
                this.game.scene.start("DungeonEditor");
            })
        })
        socket.on("Role", (string)=>console.log(string.role+" is your role"))
        this.add.text(0, 0, "hack", {font:"1px m5x7", fill:"#FFFFFF"});

    },
    update: function () {
        
    }

}



export default SelectGameMode
