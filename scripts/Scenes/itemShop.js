import { shopUiManager } from "../UI/itemShopUI.js"


const ItemShop =
{
    key: "ItemShop",
    preload: function () {
        this.load.image("background", "../assets/ui/itemShop/itemShopBG.png");
        this.load.image("button", "../assets/ui/itemShop/buttons/itemButton.png");
        this.load.image("bg_1lvl", "../assets/ui/itemShop/shopSign.png");
        this.load.image("border_1lvl", "../assets/ui/itemShop/buttons/1lvl/border_1lvl.png");
        this.load.image("rightbg_2lvls", "../assets/ui/itemShop/buttons/2lvls/rightbg_2lvls.png");
        this.load.image("leftbg_2lvls", "../assets/ui/itemShop/buttons/2lvls/leftbg_2lvls.png");
        this.load.image("border_2lvls", "../assets/ui/itemShop/buttons/2lvls/border_2lvls.png");
        this.load.image("bg_3lvls", "../assets/ui/itemShop/shopSign.png");
        this.load.image("border_3lvls", "../assets/ui/itemShop/buttons/3lvls/border_3lvls.png");
        this.load.image("number_3lvls", "../assets/ui/itemShop/buttons/3lvls/mask_3lvls.png");
        this.load.image("lvlButton", "../assets/ui/itemShop/buttons/3lvls/lvlButton.png");

        this.load.image("Sword_0", "../assets/player/sword_0.png")
        this.load.image("Sword_1", "../assets/player/sword_1.png")
        this.load.image("Sword_2", "../assets/player/sword_2.png")
        this.load.image("Sword_3", "../assets/player/sword_3.png")

    },
    create: function () {
        socket.on("enemyDisconected", () => {
            if (this.game.scene.isActive("ItemShop")) {
                this.game.scene.stop("ItemShop");
                if (this.timer !== undefined) this.timer.setTimeToZero();
            }
            this.game.player = "Ffo";
            this.game.endMessage = "Has ganado";
            this.game.scene.start("EndGame");
        })

        let music = this.sound.add("introHero");
        music.play({ volume: 0.1 });
        let loop = this.sound.add("loopHero")
        loop.setLoop(true);
        music.once("complete", () => { loop.play({ volume: 0.1 }) })
        let manager = new shopUiManager(this);
    },
    update: function (delta) {

    }
}
export default ItemShop;