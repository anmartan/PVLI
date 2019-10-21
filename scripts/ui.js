export class button extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style)
        this.roomSize = size;
        this.buttonPos = pos;
        this.setInteractive();
        scene.add.existing(this);
    }
    size()
    {
        return this.size;
    }
    over(basicColor, colorToPlace)
    {
        this.on("pointerover",()=>{if(this.style.color!==basicColor)this.setFill(colorToPlace)});
    }
    out(basicColor, colorToPlace){
        this.on("pointerout", ()=>{if(this.style.color!==basicColor)this.setFill(colorToPlace)});
    }
}
export class indexButton extends button
{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style,size, pos)
    }
    click(children, childrenBot, fillColor, basicColor)
    {
    this.on("pointerdown",()=>
    {
        this.scene.actual = this.buttonPos; 
        this.setFill(fillColor);
        this.scene.rooms[this.scene.actual].resize(this.scene.rooms[this.scene.actual].size);
        for(let i  = 0; i<3;i++)
        {
            if(this.scene.actual!==i)childrenBot[i].setFill(basicColor);
            if(this.scene.rooms[this.scene.actual].size===children[i].roomSize)children[i].setFill(fillColor);
            else children[i].setFill(basicColor);
        }
    }   
    );
    }
}
export class sizeButton extends button
{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style,size, pos)
    }

    click(children,  fillColor, basicColor)
    {
    this.on("pointerdown",()=>
    {
        this.scene.rooms[this.scene.actual].resize(this.roomSize);
        this.setFill(fillColor);
        for(let i  = 0; i<3;i++)
        {
            if(this.scene.rooms[this.scene.actual].size!==children[i].roomSize)children[i].setFill(basicColor);
        }
    });
    }
}