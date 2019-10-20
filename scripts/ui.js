export class button extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,style,size)
    {
        super(scene,x,y,text,style)
        this.size =size;
        scene.add.existing(this);
    }
    size()
    {
        return this.size;
    }
}