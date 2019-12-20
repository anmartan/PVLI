import {Button} from './ui.js';

import {inventory} from "../Player and Items/items.js"
import {textButton} from "./ui.js"
import {dungeon} from '../Enemies and World/dungeon.js';

import {itemAtlas} from "../Player and Items/itemAtlas.js"; 
import { Time } from '../Scenes/utils.js';

export class shopUiManager
{
    constructor(scene)
    {
        let background = scene.add.image(0,0,"background");
        background.setOrigin(0,0);
        scene.inventory = new inventory(100);
        console.log(scene.inventory.gold);
        
        this.timer = new Time(scene, 32, 4, 2, 0);        

        let config =
        {
            scene : scene,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#00",
            style : {fontFamily:"m5x7", fontSize:"32px", color:"#00"},
        }
        //Texto del dinero actual
        let text = scene.add.text(136*2,2*2,scene.inventory.gold, config.style);
        


        //Botones de compra de items
        let x = 125;
        let hsize =105;
        let y = 50;
        let vsize =62;


        scene.buy = function(itemName, button,  upgrade=true, units=1,level=1)
        {
            console.clear();
            let toBuyItemLevel;
            let price;
            let nextLvl;
           console.log("Estás comprando: "+itemName);

            if(upgrade && scene.inventory[itemName].Level<3 )
            {
                //Si tienes 0 unidades, el nivel es el actual, si tienes 1 unidad el nivel es actual +1
                toBuyItemLevel = scene.inventory[itemName].Level + scene.inventory[itemName].Units;
                let name = itemName+toBuyItemLevel;
                price = itemAtlas[name].Price;
                console.log("Vas a pagar: "+price);
                if(scene.inventory[itemName].Units===0 && price < scene.inventory.gold)
                {
                    scene.inventory[itemName].addUnits(1);
                    scene.inventory.substractGold(price);

                    if(toBuyItemLevel<3)
                    {
                        nextLvl=scene.inventory[itemName].Level+1;
                        button.changeText(itemAtlas[itemName+nextLvl].Price);
                    }
                    else button.changeText(0);
                }
                else if(price < scene.inventory.gold)
                {
                    scene.inventory.substractGold(price);
                    scene.inventory.upgradeItem(itemName);
                    if(toBuyItemLevel<3)
                    {
                        nextLvl=scene.inventory[itemName].Level+1;
                        button.changeText(itemAtlas[itemName+nextLvl].Price);
                    }
                    else button.changeText(0);
                }
            }
            else if(!upgrade)
            {
                toBuyItemLevel = level;
                let name="";
                (itemName==="Arrow")? name=itemName+level : name=itemName;
                console.log(name);
                price = itemAtlas[name].Price;
                if(price<scene.inventory.gold)
                {
                    scene.inventory.substractGold(price);
                    scene.inventory[name].addUnits(units);
                }
            }
            text.text=scene.inventory.gold;
            console.log(scene.inventory);
            return nextLvl;
        }

        scene.Sword_Button = new itemButton3lvl(scene, hsize, y + 0 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Sword",itemAtlas.Sword1.Price);
        scene.Potion_Button = new itemButton1lvl(scene, x + hsize, y + 0 * vsize, "bg_1lvl", "border_1lvl","Potion",itemAtlas.Potion.Price);
        scene.Armor_Button = new itemButton3lvl(scene, hsize, y + 1 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Armor",itemAtlas.Armor1.Price);
        scene.Grenade_Button = new itemButton1lvl(scene, x + hsize, y + 1 * vsize, "bg_1lvl","border_1lvl", "Grenade",itemAtlas.Grenade.Price);
        scene.Bow_Button = new itemButton3lvl(scene, hsize, y + 2 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Bow",itemAtlas.Bow1.Price);
        scene.Arrow_Button = new itemButton2lvl(scene, x + hsize, y + 2 * vsize, "border_2lvls","leftbg_2lvls","rightbg_2lvls", "Arrow",itemAtlas.Arrow1.Price*10);
        scene.Shield_Button = new itemButton3lvl(scene, hsize, y + 3 * vsize, "bg_3lvls","border_3lvls","lvlButton","number_3lvls", "Shield",itemAtlas.Shield1.Price);
        scene.Radar_Button = new itemButton1lvl(scene, x + hsize, y + 3 * vsize, "bg_1lvl","border_1lvl", "Radar",itemAtlas.Radar.Price);



        //Botón de continuar
        {

        this.continuar = new textButton(config,106*2,152*2,"Continuar");
        this.continuar.on("pointerdown", () =>
        {
            this.timer.setTimeToZero();
            scene.game.scene.stop("ItemShop");
            scene.game.inventory = scene.inventory;
            socket.emit("finished",  scene.inventory);
            socket.on("startDung", (data) =>
            {
                scene.game.dungeon = data.dungeon;
                scene.game.scene.start("DungeonRun");
            })
        })
        }
        socket.on("continuar", ()=>  this.continuar.emit("pointerdown"));   
    }


}

export class itemButton extends Button
{
    constructor(scene, x, y, sprite, itemID, price)
    {
        super(scene,x,y,sprite);
        let style = {fontFamily:"m5x7", fontSize:"16px", color:"#00"};
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
        bg.scale=2;
        container.add(bg)

        
        this.expositor = scene.add.image(0,-3,scene.inventory[itemID].Images.Sprite);
        container.add(this.expositor);
        
        let style = {fontFamily:"m5x7", fontSize:"32px", color:"#00"};
        this.text = scene.add.text(bg.width/2+4, - bg.height/2+4, "x"+price, style);
        container.add(this.text);
        this.itemID = itemID;

        this.expositor.setInteractive();
        this.expositor.on("pointerover", ()=>this.expositor.setTint("0x888888"));
        this.expositor.on("pointerout", ()=>this.expositor.clearTint());
        this.expositor.on("pointerdown", () =>
        {
            this.expositor.setTint("0xAAAAAA");
            scene.buy(this.itemID, this,false);
        })
        this.expositor.on("pointerup", () =>this.expositor.clearTint());
    }
    changeText(newText)
    {
        this.text.text="x"+newText;
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

        this.expositor = scene.add.image(-5,-3,scene.inventory[itemID+"1"].Images.Sprite);
        this.expositor.angle=60;
        container.add(this.expositor);
        this.expositor = scene.add.image(5,1,scene.inventory[itemID+"2"].Images.Sprite);
        this.expositor.angle=60;
        container.add(this.expositor);
        
        let style = {fontFamily:"m5x7", fontSize:"32px", color:"#00"};
        this.text = scene.add.text(rbg.width/2+4, - rbg.height/2+4, "x"+price, style);
        container.add(this.text);
        this.itemID = itemID;



        lbg.setInteractive({pixelPerfect: true, alphaTolerance:1});
        lbg.on("pointerover", ()=>lbg.setTintFill("0xc67aed"));
        lbg.on("pointerout", ()=>lbg.clearTint());
        lbg.on("pointerdown", () =>
        {
            lbg.setTintFill("0x3f0d59");
            scene.buy(this.itemID,this,false,10,1);
        })

        rbg.setInteractive({pixelPerfect: true, alphaTolerance:1});
        rbg.on("pointerover", ()=>rbg.setTintFill("0xc67aed"));
        rbg.on("pointerout", ()=>rbg.clearTint());
        rbg.on("pointerdown", () =>
        {
            rbg.setTintFill("0x3f0d59");
            scene.buy(this.itemID,this,false,3,2);
        })
    }
    changeText(newText)
    {
        this.text.text="x"+newText;
    }
}
export class itemButton3lvl 
{
    constructor(scene, x, y, background, border,button,number, itemID, price)
    {
        let container = scene.add.container(x,y);
        let bg = scene.add.image(0,0,background);
        bg.scale=2;
        container.add(bg)
        console.log(itemID)

        if(itemID!=="Armor")
        {
            if(itemID==="Sword")
            {
                this.expositor = scene.add.image(0,4,itemAtlas[itemID+"1"].Images.Sprite);
                this.expositor.angle=90;
            }
            else 
                this.expositor = scene.add.image(0,4,scene.inventory[itemID].Images.Sprite);
        container.add(this.expositor);
        }

        let style = {fontFamily:"m5x7", fontSize:"32px", color:"#00"};

        this.text = scene.add.text(bg.width/2+4, - bg.height/2+4, "x"+price, style);
        container.add(this.text);
        this.itemID = itemID;

        
        bg.setInteractive();
        //bg.on("pointerover", ()=>bg.setTintFill("0xc67aed"));
        bg.on("pointerout", ()=>bg.clearTint());
        bg.on("pointerdown", () =>
        {
            let toBuyItemLvl=scene.buy(this.itemID, this, true);
            if(toBuyItemLvl<4)
            {
                let name=itemID+toBuyItemLvl;
                if(itemID!=="Armor")
                {
                    this.expositor.destroy();
                    this.expositor = scene.add.image(0,4,itemAtlas[name].Images.Sprite);
                    if(itemID==="Sword")this.expositor.angle=90;
                    container.add(this.expositor);
                }
            }else this.expositor.destroy();
        })
    }
    changeText(newText)
    {
        this.text.text="x"+newText;
    }
}
