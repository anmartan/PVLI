import { Button } from './ui.js';

import { inventory } from "../Player and Items/items.js"
import { textButton } from "./ui.js"
import { dungeon } from '../Enemies and World/dungeon.js';

import { itemAtlas } from "../Player and Items/itemAtlas.js";
import { Time } from '../Scenes/utils.js';

export class shopUiManager {
    constructor(scene) {
        //let html = '<div style="background-color:#000000;max-height:50px;max-width:100px"><h1 style="color:fuchsia;font-size:10px;text-align:center">Flechas normales</h1><p style="font-size:6px;text-align:center">Pack de 10 flechas.<br/>Se gastan al usar</p></div>'
        let background = scene.add.image(0, 0, "background");
        //console.log(scene.cache.css.get("itemCSS"));
        scene.domElement = scene.add.dom(scene.cameras.main.centerX, scene.cameras.main.centerY).createFromCache("itemHTML");
        console.log(scene.domElement);
        { scene.domElement.visible = true }
        background.setOrigin(0, 0);
        scene.inventory = new inventory(100);
        console.log(scene.inventory.gold);

        this.timer = new Time(scene, 32, 4, 2, 0);

        let config =
        {
            scene: scene,
            clickedColor: "#FF00FF",
            cursorOverColor: "#00FF00",
            basicColor: "#00",
            style: { fontFamily: "m5x7", fontSize: "32px", color: "#00" },
        }
        //Texto del dinero actual
        let text = scene.add.text(136 * 2, 2 * 2, scene.inventory.gold, config.style);

        let weaponTypeButton = new itemTypeButton(scene,10,10,"Armas");

        //Botones de compra de items
        let x = 125;
        let hsize = 105;
        let y = 50;
        let vsize = 62;


        scene.buy = function (itemName, button, upgrade = true, units = 1, level = 1) {
            console.clear();
            let toBuyItemLevel,price,nextLvl;
            let buy = false;
            if (upgrade && scene.inventory[itemName].Level < 3) {
                toBuyItemLevel = scene.inventory[itemName].Level + scene.inventory[itemName].Units;
                let name = itemName + toBuyItemLevel;
                price = itemAtlas[name].Price;
                if (price <= scene.inventory.gold) {
                    buy = true;
                    scene.inventory.upgradeItem(itemName);
                    (scene.inventory[itemName].Units === 0 )?scene.inventory[itemName].addUnits(1):scene.inventory.upgradeItem(itemName);
                    scene.inventory.substractGold(price);
                }
                if (toBuyItemLevel < 3) {
                    nextLvl = scene.inventory[itemName].Level + 1;
                    button.changeText(itemAtlas[itemName + nextLvl].Price);
                }
                else button.changeText(0);
            }
            else if (!upgrade) {
                toBuyItemLevel = level;
                let name = "";
                (itemName === "Arrow") ? name = itemName + level : name = itemName;
                price = itemAtlas[name].Price;
                if (price <= scene.inventory.gold) {
                    scene.inventory.substractGold(price * units);
                    scene.inventory[name].addUnits(units);
                }
            }
            text.text = scene.inventory.gold;
            return { lvl: nextLvl, buy: buy };
        }
        /*
        scene.Sword_Button = new itemButton3lvl(scene, hsize, y + 0 * vsize, "bg_3lvls", "border_3lvls", "lvlButton", "number_3lvls", "Sword", itemAtlas.Sword1.Price);
        //scene.Potion_Button = new itemButton1lvl(scene, x + hsize, y + 0 * vsize, "bg_1lvl", "border_1lvl", "Potion", itemAtlas.Potion.Price);
        scene.Armor_Button = new itemButton3lvl(scene, hsize, y + 1 * vsize, "bg_3lvls", "border_3lvls", "lvlButton", "number_3lvls", "Armor", itemAtlas.Armor1.Price);
        //scene.Grenade_Button = new itemButton1lvl(scene, x + hsize, y + 1 * vsize, "bg_1lvl", "border_1lvl", "Grenade", itemAtlas.Grenade.Price);
        scene.Bow_Button = new itemButton3lvl(scene, hsize, y + 2 * vsize, "bg_3lvls", "border_3lvls", "lvlButton", "number_3lvls", "Bow", itemAtlas.Bow1.Price);
        scene.Arrow_Button = new itemButton2lvl(scene, x + hsize, y + 2 * vsize, "border_2lvls", "leftbg_2lvls", "rightbg_2lvls", "Arrow", itemAtlas.Arrow1.Price * 10);
        scene.Shield_Button = new itemButton3lvl(scene, hsize, y + 3 * vsize, "bg_3lvls", "border_3lvls", "lvlButton", "number_3lvls", "Shield", itemAtlas.Shield1.Price);
       // scene.Radar_Button = new itemButton1lvl(scene, x + hsize, y + 3 * vsize, "bg_1lvl", "border_1lvl", "Radar", itemAtlas.Radar.Price);

        scene.Radar_Button = new itemButton(scene, x + hsize, y + 3 * vsize, "Radar", itemAtlas.Radar.Price);
        scene.Grenade_Button = new itemButton(scene, x + hsize, y + 1 * vsize, "Grenade", itemAtlas.Grenade.Price);
        scene.Potion_Button = new itemButton(scene, x + hsize, y + 0 * vsize, "Potion", itemAtlas.Potion.Price);
        */

        //Botón de continuar
        {
            this.continuar = new textButton(config, 106 * 2, 152 * 2, "Continuar");
            this.continuar.on("pointerdown", () => {
                this.timer.setTimeToZero();
                scene.game.scene.stop("ItemShop");
                scene.game.inventory = scene.inventory;
                socket.emit("finished", scene.inventory);
                socket.on("startDung", (data) => {
                    scene.game.dungeon = data.dungeon;
                    scene.game.scene.start("DungeonRun");
                })
            })
        }
        socket.on("continuar", () => this.continuar.emit("pointerdown"));
    }


}

class itemButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y,itemID) {
        super(scene, x, y);
        scene.add.existing(this);
        this.image = new itemSprite(scene,x,y,itemID,this);
        //this.add(this.image);
        let style = { fontFamily: "m5x7", fontSize: "16px", color: "#00" };
        this.text = scene.add.text(this.image.width / 2 + 4, -this.image.height/2 + 4, "x" +scene.inventory[itemID].Price, style);
        this.text.setOrigin(0, 0);
        this.add(this.text);
        this.itemID = itemID;
    }
}
class itemSprite extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,itemID,container)
    {
        let sp = scene.inventory[itemID].Images.Sprite;
        super(scene,x,y,sp, container);
        scene.add.existing(this);
        this.container=this.container;
        this.itemID=itemID;
        this.setInteractive({pixelPerfect:true, alphaTolerance:0});
        this.on("pointerdown", this.click);
        this.on("pointerover", (cr)=>this.over(cr));
        this.on("pointerout", this.out);
    }
    click()
    {
        this.scene.buy(this.itemID,this.container,false);
    }
    over(cursor)
    {
        this.scene.domElement.setVisible(true);
        this.setTintFill(0xFFF00)
    }
    out()
    {
        this.clearTint();
        this.scene.domElement.setVisible(false);
    }
}

class itemButton1lvl {
    constructor(scene, x, y, background, border, itemID, price) {
        let container = scene.add.container(x, y);
        let bg = scene.add.image(0, 0, background);
        bg.scale = 2;
        container.add(bg)


        this.expositor = scene.add.image(0, -3, scene.inventory[itemID].Images.Sprite);
        container.add(this.expositor);

        let style = { fontFamily: "m5x7", fontSize: "32px", color: "#00" };
        this.text = scene.add.text(bg.width / 2 + 4, - bg.height / 2 + 4, "x" + price, style);
        container.add(this.text);
        this.itemID = itemID;

        this.expositor.setInteractive();
        this.expositor.on("pointerover", () => this.text.setTintFill("0x880088"));
        this.expositor.on("pointerout", () => this.text.clearTint());
        this.expositor.on("pointerdown", () => {
            this.text.setTintFill("0xFF00FF");
            scene.buy(this.itemID, this, false);
        })
        this.expositor.on("pointerup", () => this.text.clearTint());
    }
    changeText(newText) {
        this.text.text = "x" + newText;
    }
}

class itemButton2lvl {
    constructor(scene, x, y, border, leftbackground, rightbackground, itemID, price) {
        let container = scene.add.container(x, y);
        let lbg = scene.add.image(0, 0, leftbackground);
        container.add(lbg)
        let rbg = scene.add.image(0, 0, rightbackground);
        container.add(rbg);
        container.add(scene.add.image(0, 0, border));

        this.expositor = scene.add.image(-5, -3, scene.inventory[itemID + "1"].Images.Sprite);
        this.expositor.angle = 60;
        container.add(this.expositor);
        this.expositor = scene.add.image(5, 1, scene.inventory[itemID + "2"].Images.Sprite);
        this.expositor.angle = 60;
        container.add(this.expositor);

        let style = { fontFamily: "m5x7", fontSize: "32px", color: "#00" };
        this.text = scene.add.text(rbg.width / 2 + 4, - rbg.height / 2 + 4, "x" + price, style);
        container.add(this.text);
        this.itemID = itemID;



        lbg.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
        lbg.on("pointerover", () => this.text.text = "x10");
        lbg.on("pointerout", () => lbg.clearTint());
        lbg.on("pointerdown", () => {
            lbg.setTintFill("0x3f0d59");
            scene.buy(this.itemID, this, false, 10, 1);
        })

        rbg.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
        rbg.on("pointerover", () => this.text.text = "x9");
        rbg.on("pointerout", () => rbg.clearTint());
        rbg.on("pointerdown", () => {
            rbg.setTintFill("0x3f0d59");
            scene.buy(this.itemID, this, false, 3, 2);
        })
    }
    changeText(newText) {
        this.text.text = "x" + newText;
    }
}
class itemButton3lvl {
    constructor(scene, x, y, background, border, button, number, itemID, price) {
        let container = scene.add.container(x, y);
        this.bg = scene.add.image(x, y, background);
        //this.bg.setScale(2);
        //container.add(this.bg)
        console.log(itemID)

        if (itemID === "Sword") {
            this.expositor = scene.add.image(x, y, itemAtlas[itemID + "1"].Images.Sprite);
            this.expositor.angle = 90;
        }
        else
            this.expositor = scene.add.image(x, y, scene.inventory[itemID].Images.Sprite);

        //container.add(this.expositor);

        let style = { fontFamily: "m5x7", fontSize: "32px", color: "#00" };

        this.text = scene.add.text(this.bg.width / 2 + 4, - this.bg.height / 2 + 4, "x" + price, style);
        container.add(this.text);
        container.setSize(32, 32);
        this.itemID = itemID;


        this.bg.setInteractive();
        this.bg.on("pointerover", (cursor) => { this.bg.setTintFill(0xFFF333); scene.domElement.visible = true; });
        this.bg.on("pointerout", () => { scene.domElement.visible = false; this.bg.clearTint() });
        this.bg.on("pointerdown", () => {
            let buyResult = scene.buy(this.itemID, this, true);
            let toBuyItemLvl = buyResult.lvl;
            let buy = buyResult.buy;
            if (toBuyItemLvl < 4) {
                let name = itemID + toBuyItemLvl;
                this.expositor.destroy();
                this.expositor = scene.add.image(0, 4, itemAtlas[name].Images.Sprite);
                if (itemID === "Sword") this.expositor.angle = 90;
                container.add(this.expositor);
            } else if (buy) this.expositor.destroy();
        })
    }
    changeText(newText) {
        this.text.text = "x" + newText;
    }
}




class itemTypeButton extends Phaser.GameObjects.Container
{
    constructor(scene,x,y,itemType)
    {
        super(scene,x,y)
        scene.add.existing(this);
        let config =
        {
            scene: scene,
            clickedColor: "#FF00FF",
            cursorOverColor: "#00FF00",
            basicColor: "#00",
            style: { fontFamily: "m5x7", fontSize: "32px", color: "#FFFFFF" },
        }
        this.buttonShape=scene.add.graphics();
        this.buttonShape.setInteractive();
        this.buttonShape.fillStyle("0xaa00aa");
        this.itemType=itemType;
        this.buttonShape.fillRect(0,0,this.itemType.length*16,34);
        this.text = scene.add.text(8,2,this.itemType,config.style);
        this.text.setInteractive();
        this.text.on("pointerdown",()=>this.click())
        this.text.on("pointerover",()=>this.over())
        this.text.on("pointerout",()=>this.out())
        this.add(this.buttonShape);
        this.add(this.text);
    }
    click()
    {
        if(this.state!=="clicked")
        {
            this.buttonShape.clear();
            this.buttonShape.fillStyle("0x880088");
            this.buttonShape.lineStyle(2,"0xFF00FF");
            this.buttonShape.fillRect(0,0,this.itemType.length*16,34)
            this.buttonShape.strokeRect(0,0,this.itemType.length*16,34)
            this.text.style.color="#FF00FF";
            this.setState("clicked");
        }
        else
        {
            this.buttonShape.fillStyle("0xaa00aa");
            this.buttonShape.fillRect(0,0,this.itemType.length*16,34);
            this.setState("unclicked");
        }
    }
    over()
    {
        if(this.state!=="clicked")
        {
            this.buttonShape.clear();
            this.buttonShape.fillStyle("0x880088");
            this.text.style.color="#00"
            this.buttonShape.fillRect(0,0,this.itemType.length*16,34)
        }
    }
    out()
    {
        if(this.state!=="clicked")
        {
            this.buttonShape.clear();
            this.buttonShape.fillStyle("0xaa00aa");
            this.text.style.color="#FFFFFF"
            this.buttonShape.fillRect(0,0,this.itemType.length*16,34)
        }
    }
}