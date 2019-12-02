import {Button} from './ui.js';

import {inventory} from "../Player and Items/items.js"
import {textButton} from "./ui.js"
import {dungeon} from '../Enemies and World/dungeon.js';

import {itemAtlas} from "../Player and Items/itemAtlas.js"; 

export class shopUiManager
{
    constructor(scene)
    {
        let background = scene.add.image(0,0,"background");
        background.setOrigin(0,0);
        scene.inventory = new inventory(1000);
        console.log(scene.inventory.gold);
        

        let config =
        {
            scene : scene,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#00",
            style : {fontFamily:"arial", fontSize:"15px", color:"#00"},
        }
        //Texto del dinero actual
        let text = scene.add.text(134,1,scene.inventory.gold, config.style);
        


        //Botones de compra de items
        let x = 0;
        let hsize =30;
        let y = 44;
        let vsize =24;


        scene.buy = function(itemName, lvls, arrowLevel)
        {
            
            let toBuyItemLevel;
            let price;
            let buyResult;
            switch(lvls)
            {
                case 3:
                    //let maybe = (scene.inventory[itemName].Units > 0) ? 1 : 0; //esto solo aplica para la espada porque empiezas con una pero de lvl 0
                    let maybe = 1;
                    if(scene.inventory[itemName].Units === 0) maybe=0;
                    console.log(maybe);
                    toBuyItemLevel = scene.inventory[itemName].Level + maybe;
                    console.log(toBuyItemLevel);
                    price = itemAtlas[itemName+"_"+toBuyItemLevel].Price;
                    buyResult = scene.inventory.substractGold(price);
                    if(buyResult!==-1)
                    {
                        if(maybe===1)scene.inventory.upgradeItem(itemName);
                        else scene.inventory[itemName].Units+=1;
                        toBuyItemLevel+=1;
                        let newItemLevelPrice = 0;
                        if(toBuyItemLevel<4) newItemLevelPrice= itemAtlas[itemName+"_"+toBuyItemLevel].Price;
                        text.text = scene.inventory.gold;
                        scene[itemName+"_Button"].text.text ="x"+newItemLevelPrice;
                        console.log(itemName+"_"+scene.inventory[itemName].Level) 
                    }
                    else(console.log("No te dan los monedos"));
                    return scene.inventory[itemName].Level;
                case 2:
                    toBuyItemLevel = arrowLevel;
                    price = itemAtlas[itemName+"_"+arrowLevel].Price;
                    buyResult = scene.inventory.substractGold(price*10);
                    if(buyResult!=-1)
                    {
                        scene.inventory.gold = buyResult;
                        scene.inventory.addConsumible(itemName,10);        
                        text.text = scene.inventory.gold;
                        console.log(itemName+"_"+scene.inventory[itemName].Level + " - "+scene.inventory[itemName].Units) 
                    }
                    else(console.log("No te dan los monedos"));
                    break;
                case 1:
                    toBuyItemLevel = scene.inventory[itemName].Level;
                    price = itemAtlas[itemName].Price;
                    buyResult = scene.inventory.substractGold(price);
                    if(buyResult!=-1)
                    {
                        scene.inventory.gold = buyResult;
                        scene.inventory.addConsumible(itemName,1);        
                        text.text = scene.inventory.gold;
                        console.log(itemName+"_"+scene.inventory[itemName].Level + " - "+scene.inventory[itemName].Units) 
                    }
                    else(console.log("No te dan los monedos"));
                    break;
            }
        }

        scene.Sword_Button = new itemButton3lvl(scene, hsize, y + 0 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Sword",itemAtlas.Sword_1.Price);
        scene.Potion_Button = new itemButton1lvl(scene, 88 + hsize, y + 0 * vsize, "bg_1lvl", "border_1lvl","Potion",itemAtlas.Potion.Price);
        scene.Armor_Button = new itemButton3lvl(scene, hsize, y + 1 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Armor",itemAtlas.Armor_1.Price);
        scene.Grenade_Button = new itemButton1lvl(scene, 88 + hsize, y + 1 * vsize, "bg_1lvl","border_1lvl", "Grenade",itemAtlas.Grenade.Price);
        scene.Bow_Button = new itemButton3lvl(scene, hsize, y + 2 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Bow",itemAtlas.Bow_1.Price);
        scene.Arrow_Button = new itemButton2lvl(scene, 88 + hsize, y + 2 * vsize, "border_2lvls","leftbg_2lvls","rightbg_2lvls", "Arrow",itemAtlas.Arrow_1.Price*10);
        scene.Shield_Button = new itemButton3lvl(scene, hsize, y + 3 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Shield",itemAtlas.Shield_1.Price);
        scene.Radar_Button = new itemButton1lvl(scene, 88 + hsize, y + 3 * vsize, "bg_1lvl","border_1lvl", "Radar",itemAtlas.Radar.Price);



        //Botón de continuar
        {

        let continuar = new textButton(config,96,150,"Continuar");
        continuar.on("pointerdown", () =>
        {
            scene.game.scene.stop("ItemShop");
            scene.game.inventory = scene.inventory;
            socket.emit("finished",  scene.inventory);
            console.log(socket);
            socket.on("startDung", (dung, inventory) =>
            {
                scene.game.dungeon = dung;
                console.log(scene.game.dungeon);
                scene.game.scene.start("DungeonRun");
            })
        })
        }

    }


}

export class itemButton extends Button
{
    constructor(scene, x, y, sprite, itemID, price)
    {
        super(scene,x,y,sprite);
        let style = {fontFamily:"arial", fontSize:"15px", color:"#00"};
        this.text = scene.add.text(x+this.width/2+4,y-this.height/2+4,"x"+price, style);
        this.text.setOrigin(0,0);
        this.itemID = itemID;
    }
    click()
    {
        this.on("pointerdown", () => this.scene.buy(this.itemID));
    }
}

export class itemButton1lvl 
{
    constructor(scene, x, y, background, border, itemID, price)
    {
        let container = scene.add.container(x,y);
        let bg = scene.add.image(0,0,background);
        container.add(bg)
        container.add(scene.add.image(0,0,border));

        let style = {fontFamily:"arial", fontSize:"15px", color:"#00"};
        this.text = scene.add.text(bg.width/2+4, - bg.height/2+4, "x"+price, style);
        container.add(this.text);
        this.itemID = itemID;

        bg.setInteractive();
        bg.on("pointerover", ()=>bg.setTintFill("0xc67aed"));
        bg.on("pointerout", ()=>bg.clearTint());
        bg.on("pointerdown", () =>
        {
            bg.setTintFill("0x3f0d59");
            scene.buy(this.itemID, 1);

        })
    }
}

export class itemButton2lvl 
{
    constructor(scene, x, y,border,leftbackground, rightbackground, itemID, price)
    {
        let container = scene.add.container(x,y);
        let lbg = scene.add.image(0,0,leftbackground);
        container.add(lbg)
        let rbg = scene.add.image(0,0,rightbackground);
        container.add(rbg);
        container.add(scene.add.image(0,0,border));

        let style = {fontFamily:"arial", fontSize:"15px", color:"#00"};
        this.text = scene.add.text(rbg.width/2+4, - rbg.height/2+4, "x"+price, style);
        container.add(this.text);
        this.itemID = itemID;



        lbg.setInteractive({pixelPerfect: true, alphaTolerance:1});
        lbg.on("pointerover", ()=>lbg.setTintFill("0xc67aed"));
        lbg.on("pointerout", ()=>lbg.clearTint());
        lbg.on("pointerdown", () =>
        {
            lbg.setTintFill("0x3f0d59");
            scene.buy(this.itemID,2,1);
        })

        rbg.setInteractive({pixelPerfect: true, alphaTolerance:1});
        rbg.on("pointerover", ()=>rbg.setTintFill("0xc67aed"));
        rbg.on("pointerout", ()=>rbg.clearTint());
        rbg.on("pointerdown", () =>
        {
            rbg.setTintFill("0x3f0d59");
            scene.buy(this.itemID,2,2);
        })
    }
}
export class itemButton3lvl 
{
    constructor(scene, x, y, background, border,button,number, itemID, price)
    {
        let container = scene.add.container(x,y);
        let bg = scene.add.image(0,0,background);
        container.add(bg)
        let width = -13;
        for(let i =0;i<3;i++)
        {
            this["button"+i]=scene.add.image(width+13*i,7,button);
            container.add(this["button"+i]);
        }   
        container.add(scene.add.image(0,0,number).setTintFill("0xc3c3c3"));
        container.add(scene.add.image(0,0,border));

        if(itemID === "Sword" || itemID === "Bow")
        {
            let stringMalHecha = scene.inventory[itemID].Level+1;
            this.expositor = scene.add.image(0,-3,itemID+"_"+stringMalHecha);
            this.expositor.angle=90;
            container.add(this.expositor);
        }



        let style = {fontFamily:"arial", fontSize:"15px", color:"#00"};
        this.text = scene.add.text(bg.width/2+4, - bg.height/2+4, "x"+price, style);
        container.add(this.text);
        this.itemID = itemID;

        
        bg.setInteractive();
        bg.on("pointerover", ()=>bg.setTintFill("0xc67aed"));
        bg.on("pointerout", ()=>bg.clearTint());
        bg.on("pointerdown", () =>
        {
            bg.setTintFill("0x3f0d59");
            let index = scene.buy(this.itemID, 3) - 1;
            if(index >= 0)
            {
                this["button"+index].setTintFill("0x3f0d59");
            }
            if(itemID === "Sword" || itemID === "Bow")
            {
                container.remove(this.expositor, true);
                this.stringMalHecha = scene.inventory[itemID].Level+1;
                if(this.stringMalHecha<4)
                {
                    this.expositor = scene.add.image(0,-3, itemID+"_"+this.stringMalHecha );
                    this.expositor.angle=90;
                    container.add(this.expositor);
                }
            }

        })
    }
}
