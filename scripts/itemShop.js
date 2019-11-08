import {inventory} from "./items.js"
import {itemButton} from "./itemShopUI.js"
import {textButton} from "./ui.js"

const ItemShop = 
{
    preload: function()
    {
        this.load.image("background","../assets/ui/itemShop/itemShopBG.png");
        this.load.image("button","../assets//ui/itemShop/itemButton.png");
        this.load.image("yellow","../assets/debug/yellow.png");
        this.load.image("white","../assets/debug/white.png");

    },
    create: function()
    {
        let background = this.add.image(0,0,"background");
        background.setOrigin(0,0);
        this.inventory = new inventory(100);
        console.log(this.inventory.gold);
        let x = 8;
        let hsize =30;
        let y = 44;
        let vsize =24;

        for(let i = 0; i< 4;i++)
        {
            new itemButton(this,   x + hsize, y + i * vsize, "button", i);
            new itemButton(this, 93-x + hsize, y + i * vsize, "button", i);
        }


        //Botón de continuar
        {
        let config =
        {
            scene : this,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#00",
            style : {fontFamily:"arial", fontSize:"15px"},
        }
        let continuar = new textButton(config,96,142,"Continuar");
        continuar.on("pointerdown", () =>
        {
            this.game.scene.start("DungeonEditor");
            this.game.scene.stop("ItemShop");
        })
        }


    },
    update: function(delta)
    {

    }
}
export default ItemShop;