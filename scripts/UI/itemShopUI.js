import { Button } from './ui.js';

import { inventory } from "../Player and Items/items.js"
import { textButton } from "./ui.js"
import { dungeon } from '../Enemies and World/dungeon.js';

import { itemAtlas } from "../Player and Items/itemAtlas.js";
import { Time } from '../Scenes/utils.js';

export class shopUiManager {
    constructor(scene) {
        //let html = '<div style="background-color:#000000;max-height:50px;max-width:100px"><h1 style="color:fuchsia;font-size:10px;text-align:center">Flechas normales</h1><p style="font-size:6px;text-align:center">Pack de 10 flechas.<br/>Se gastan al usar</p></div>'
        //let background = scene.add.image(0, 0, "background");
        //console.log(scene.cache.css.get("itemCSS"));
        scene.domElement = scene.add.dom(scene.cameras.main.centerX, scene.cameras.main.centerY + 30).createFromCache("itemHTML");
        console.log(scene.domElement);
        { scene.domElement.visible = true }
        scene.inventory = new inventory(100);
        console.log(scene.inventory.gold);


        new buttonPanel(scene, 20, 25);

        //Botones de compra de items
        let x = 125;
        let hsize = 105;
        let y = 50;
        let vsize = 62;


        scene.buy = function (itemName, button, upgrade = true, units = 1, level = 1) {
            console.clear();
            let toBuyItemLevel, price, nextLvl;
            let buy = false;
            if (upgrade && scene.inventory[itemName].Level < 3) {
                toBuyItemLevel = scene.inventory[itemName].Level + scene.inventory[itemName].Units;
                let name = itemName + toBuyItemLevel;
                price = itemAtlas[name].Price;
                if (price <= scene.inventory.gold) {
                    buy = true;
                    scene.inventory.upgradeItem(itemName);
                    (scene.inventory[itemName].Units === 0) ? scene.inventory[itemName].addUnits(1) : scene.inventory.upgradeItem(itemName);
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
            scene.text.text = scene.inventory.gold;
            return { lvl: nextLvl, buy: buy };
        }

        let bar = new statusBar(scene, scene.cameras.main.centerX - 6, scene.cameras.main.centerY + 150);
        //Botón de continuar
        socket.on("continuar", () => scene.continuar.emit("pointerdown"));
    }


}
class statusBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        let config =
        {
            scene: scene,
            clickedColor: "#FF00FF",
            cursorOverColor: "#00FF00",
            basicColor: "#555555",
            style: { fontFamily: "m5x7", fontSize: "32px", color: "#555555" },
        }
        //Texto del dinero actual
        scene.continuar = new textButton(config, -6, -3, "Continuar");
        scene.continuar.on("pointerdown", () => {
            scene.timer.setTimeToZero();
            scene.game.scene.stop("ItemShop");
            scene.game.inventory = scene.inventory;
            socket.emit("finished", scene.inventory);
            socket.on("startDung", (data) => {
                scene.game.dungeon = data.dungeon;
                scene.game.scene.start("DungeonRun");
            })
        })
        scene.text = scene.add.text(-30, -20, scene.inventory.gold, config.style);
        scene.timer = new Time(scene, -85, -3, 2, 0);
        this.add(scene.add.image(0, 0, "UI", "buttonLong_beige_pressed.png")).setScale(1.5, 1);
        scene.add.existing(this);
        this.add(scene.text);
        this.add(scene.timer);
        this.add(scene.continuar);
    }
}
class buttonPanel {
    constructor(scene, x, y) {
        scene.add.image(x, y, "UI", "panel_beigeLight.png").setOrigin(0, 0).setScale(3);
        scene.add.image(scene.cameras.main.centerX, scene.cameras.main.centerY + 30, "UI", "panel_beige.png").setScale(2, 1);

        this.weaponButton = new itemTypeButton(scene, x + 4, y + 4, "Armas", this);
        this.objetsButton = new itemTypeButton(scene, x + 100, y + 4, "Objetos", this);
        this.defenseButton = new itemTypeButton(scene, x + 200, y + 4, "Defensa", this);

        this.itemButtons = new itemButtons(scene);

        this.leftArrowButton = new arrowButton(scene, x + 90, 90, x + 90, 92, "arrowBeige_left.png",this).setOrigin(0.5, 0.5)
        this.rightArrowButton = new arrowButton(scene, x + 222, 90, x + 220, 92, "arrowBeige_right.png",this).setOrigin(0.5, 0.5);
    }
    buttonClicked(itemType) 
    {
        this.itemButtons.set(itemType);
    }
    next()
    {
        this.itemButtons.next();
    }
    prev()
    {
        this.itemButtons.prev();
    }
}
class arrowButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, x1, y1, sprite,buttonPanel) {
        super(scene, x, y, "UI", sprite)
        this.button = scene.add.image(x1, y1, "UI", "buttonSquare_brown.png").setOrigin(0.5, 0.5);
        this.buttonPressed = scene.add.image(x1, y1, "UI", "buttonSquare_brown_pressed.png").setOrigin(0.5, 0.5).setVisible(false);
        scene.add.existing(this);
        this.buttonPanel=buttonPanel;
        this.button.setInteractive({cursor: 'url(assets/ui/cursorHand.png), pointer'});
        this.buttonPressed.setInteractive({cursor: 'url(assets/ui/cursorHand.png), pointer'});
        this.button.on("pointerdown", ()=>
        {
            this.button.setVisible(false);
            this.buttonPressed.setVisible(true);
        })
        this.buttonPressed.on("pointerup", ()=>
        {
            this.button.setVisible(true);
            this.buttonPressed.setVisible(false);
            if(sprite.includes("left"))
            {
                this.buttonPanel.prev();
            }
            else
            {
                this.buttonPanel.next();
            }
        })
        

    }
}
class itemButtons {
    constructor(scene) {
        this.buttons = new Array();
        for (let i = 1; i < 4; i++) { this.buttons.push(new itemButton(scene, 55 + 60 * i, 90)) } //Arriba
        this.buttons[0].setVisible(false);
        this.buttons[2].setVisible(false);

        /*this.buttons[0].next = this.buttons[1];
        this.buttons[1].next = this.buttons[2];
        this.buttons[2].next = this.buttons[0];
        this.buttons[2].prev = this.buttons[1];
        this.buttons[1].prev = this.buttons[0];
        this.buttons[0].prev = this.buttons[2];*/

        this.actualIndex=0;
        this.actualType =0;

        this.weapons = ["Sword", "Bow", "Arrow1", "Arrow2"];
        this.defense = ["Armor", "Shield", "Boots"];
        this.objects = ["Potion", "Grenade", "Radar"];
        this.types=[this.weapons,this.objects,this.defense];
    }

    setImage(item)
    {
        this.buttons[1].setTexture(scene.inventory[item].images.sprite);
    }
    next()
    {
        console.log(this.types[0].length);
        this.actualIndex=(this.actualIndex+1)%(this.types[this.actualType].length);
        console.log(this.actualIndex);
        this.buttons[1].next(this.types[this.actualType][this.actualIndex])
    }
    prev()
    {
        this.actualIndex=(this.actualIndex+(this.types[this.actualType].length-1))%this.types[this.actualType].length;
        this.buttons[1].prev(this.types[this.actualType][this.actualIndex])
    }

}

class itemButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, itemID) {
        super(scene, x, y);
        scene.add.existing(this);
        this.bgImage = scene.add.image(0, 0, "UI", "panel_blue.png").setScale(0.5);
        this.itemImage = scene.add.image(0, 0, "Sword1");
        this.add(this.bgImage);
        this.add(this.itemImage);
    }
    next(string)
    {
        console.log(string)
    }
    prev(string)
    {
        console.log(string);
    }
    setTexture(sprite)
    {
        this.itemImage.destroy();
        this.itemImage = scene.add.image(0, 0, sprite);
        this.add(this.itemImage);
    }
}

class itemTypeButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, itemType, manager) {
        super(scene, x, y)
        scene.add.existing(this);
        let config =
        {
            scene: scene,
            clickedColor: "#FF00FF",
            cursorOverColor: "#00FF00",
            basicColor: "#00",
            style: { fontFamily: "m5x7", fontSize: "32px", color: "#555555" },
        }
        this.itemType = itemType;
        this.text = scene.add.text(4, 2, this.itemType, config.style);
        this.text.setInteractive();
        this.text.on("pointerdown", () => this.click())
        this.text.on("pointerover", () => this.over())
        this.text.on("pointerout", () => this.out())
        this.add(this.text);
        this.manager = manager;
    }
    click() {
        if (this.state !== "clicked") {
            this.manager.buttonClicked(this.itemType);
            this.text.setColor("#FF00FF");
            this.setState("clicked");
        }
    }
    over() {
        if (this.state !== "clicked") {
            this.text.setColor("#00");
        }
    }
    out() {
        if (this.state !== "clicked") {
            this.text.setColor("#555555");
        }
    }
}