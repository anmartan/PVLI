export class button extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style)
        this.roomSize = size;
        this.buttonPos = pos;
        scene.add.existing(this);
    }
    size()
    {
        return this.size;
    }
}