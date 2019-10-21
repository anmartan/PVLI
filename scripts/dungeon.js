export  class dungeon
{
    constructor(rooms)
    {
        this.rooms = rooms;
    }
}
export class room 
{
    constructor(size, traps, enemies,scene)
    {
        this.size=size;
        this.traps = traps;
        this.enemies = enemies;
        this.scene = scene;
    }
    resize(size)
    {
        this.size = size;
        let leftOffset,rightOffset,offset;
        leftOffset=(10-(size+1))/2;
        rightOffset=10-leftOffset;
        offset=1+leftOffset;
        this.putCorners(leftOffset,rightOffset);
        for(let i=offset;i<size+offset;i++)
        {
            this.scene.Walls.putTileAt(2, i,   leftOffset);
            this.scene.Walls.putTileAt(7,   leftOffset, i);
            for(let j =offset; j<size+offset;j++)
            {
                this.scene.Walls.removeTileAt(i, j);
                this.scene.Ground.putTileAt(8, i, j);
            }
            this.scene.Walls.putTileAt(14, i, rightOffset);
            this.scene.Walls.putTileAt(9,   rightOffset, i);
        }
        this.removeLoops(leftOffset-1);
        this.putEntrance(leftOffset,rightOffset);
        
    }
    //2,8,3     1,9,2,     0,10,1 
    removeLoops(offset)
    {
        let y= 0, x= 0;
        for(x = offset; x<11-offset;x++) //quitar horizontales
        {
            y = offset;
            this.removeTile(x,y);
            y = 10-offset;
            this.removeTile(x,y);  
        }
        x= 0;
        for(let y = offset; y<11-offset;y++) //quitar verticales
        {
            x = offset;
            this.removeTile(x,y);
            x = 10-offset;
            this.removeTile(x,y);  
        }
        if(offset == 1) //para que limpie el loop mediano y el grande en el caso de llamar al pequeño
        {
            offset--;
            this.removeLoops(offset);
        } 
    }               
    removeTile(x,y)
    {
        this.scene.Walls.removeTileAt(x,y);
        this.scene.Ground.removeTileAt(x,y);
        this.scene.Background.putTileAt(6,x,y);
    }
    putCorners(x,y)
    {
        this.scene.Walls.putTileAt(1,x,x);
        this.scene.Walls.putTileAt(3,y,x);
        this.scene.Walls.putTileAt(15,y,y);
        this.scene.Walls.putTileAt(13,x,y);
    }
    putEntrance(x,y)
    {
        this.scene.Walls.removeTileAt( x, 5 );
        this.scene.Walls.removeTileAt( y, 5);
        this.scene.Ground.putTileAt(8,x,5);
        this.scene.Ground.putTileAt(8,y,5);
    }
}
export class trap extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,sprite)
    {
        super(scene,x,y,sprite);
        this.scene = scene;
        scene.add.existing(this);
    }
    activate(){};
    deactivate(){};
}