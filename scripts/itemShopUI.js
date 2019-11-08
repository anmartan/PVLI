import {Button} from './ui.js';

export class itemButton extends Button
{
    constructor(scene, x, y, sprite, itemID, price)
    {
        super(scene,x,y,sprite);
        let style = {fontFamily:"arial", fontSize:"15px"};
        let text = scene.add.text(x+this.width/2+4,y-this.height/2+4,"x"+price, style);
        text.setOrigin(0,0);
        this.itemID = itemID;
    }
    click()
    {
        this.on("pointerdown",()=>console.log(this.itemID));
    }
}
