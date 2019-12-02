const SelectGameMode=
{
    key: "selectGameMode",
    preload : function() 
    {
        this.load.image("button","../assets/debug/white.png");
        this.load.image("button2","../assets/debug/pink.png");

        this.load.image("Sword_0", "../assets/player/sword_0.png")
        this.load.image("Sword_1", "../assets/player/sword_1.png")
        this.load.image("Sword_2", "../assets/player/sword_2.png")
        this.load.image("Sword_3", "../assets/player/sword_3.png")

        this.load.image("Bow_0", "../assets/player/sword_0.png")
        this.load.image("Bow_1", "../assets/player/sword_1.png")
        this.load.image("Bow_2", "../assets/player/sword_2.png")
        this.load.image("Bow_3", "../assets/player/sword_3.png")
        
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
