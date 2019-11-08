import {Button} from './ui.js';

export class itemButton extends Button
{
    constructor(scene, x, y, sprite, itemID)
    {
        super(scene,x,y,sprite);
        this.itemID = itemID;
    }
    click()
    {
        this.on("pointerdown",()=>console.log(this.itemID));
    }
}
