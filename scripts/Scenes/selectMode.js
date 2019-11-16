const SelectGameMode=
{
    key: "selectGameMode",
    preload : function() 
    {
        this.load.image("button","../assets/debug/white.png");
        this.load.image("button2","../assets/debug/pink.png");
        
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
