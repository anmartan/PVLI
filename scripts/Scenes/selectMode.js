const SelectGameMode=
{
    key: "selectGameMode",
    preload : function() 
    {
        this.load.image("button","../assets/debug/white.png");
        this.load.image("button2","../assets/debug/pink.png");


        this.load.image("default","../assets/debug/default.png");
        this.load.image("default2","../assets/debug/default2.png");
        this.load.image("white","../assets/debug/white.png");
        this.load.image("white2","../assets/debug/white2.png");
        this.load.image("yellow","../assets/debug/yellow.png");
        this.load.image("yellow2","../assets/debug/yellow2.png");
        this.load.image("pink","../assets/debug/pink.png");
        this.load.image("pink2","../assets/debug/pink2.png");
        this.load.image("green","../assets/debug/green.png");
        this.load.image("green2","../assets/debug/green2.png");


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

        this.load.image("zombie_idle0", "../assets/enemies/zombie_idle_anim_f0.png")
        this.load.image("zombie_idle1", "../assets/enemies/zombie_idle_anim_f1.png")
        this.load.image("zombie_idle2", "../assets/enemies/zombie_idle_anim_f2.png")
        this.load.image("zombie_idle3", "../assets/enemies/zombie_idle_anim_f3.png")

        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");


    },
    create:function () {
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
        this.add.dom(36,46,"p", "font: 48px Arial", 'Pa Nico');

    },
    update: function () {
        
    }

}



export default SelectGameMode
