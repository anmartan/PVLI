import {shopUiManager} from "./itemShopUI.js"


const ItemShop = 
{
    key: "ItemShop",
    preload: function()
    {
        this.load.image("background","../assets/ui/itemShop/itemShopBG.png");
        this.load.image("button","../assets/ui/itemShop/buttons/itemButton.png");
        this.load.image("bg_1lvl","../assets/ui/itemShop/buttons/1lvl/bg_1lvl.png");
        this.load.image("border_1lvl","../assets/ui/itemShop/buttons/1lvl/border_1lvl.png");
        this.load.image("rightbg_2lvls","../assets/ui/itemShop/buttons/2lvls/rightbg_2lvls.png");
        this.load.image("leftbg_2lvls","../assets/ui/itemShop/buttons/2lvls/leftbg_2lvls.png");
        this.load.image("border_2lvls","../assets/ui/itemShop/buttons/2lvls/border_2lvls.png");
        this.load.image("bg_3lvls","../assets/ui/itemShop/buttons/3lvls/bg_3lvls.png");
        this.load.image("border_3lvls","../assets/ui/itemShop/buttons/3lvls/border_3lvls.png");
        this.load.image("number_3lvls","../assets/ui/itemShop/buttons/3lvls/mask_3lvls.png");
        this.load.image("lvlButton","../assets/ui/itemShop/buttons/3lvls/lvlButton.png");

    },
    create: function()
    {
        let manager = new shopUiManager(this);
    },
    update: function(delta)
    {

    }
}
export default ItemShop;