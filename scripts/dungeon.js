export  class dungeon
{
    constructor(rooms)
    {
        this.rooms = rooms;
    }
}
export class room 
{
    constructor(width, height, traps, enemies)
    {
        this.widht = width;
        this.height = height;
        this.traps = traps;
        this.enemies = enemies;
    }
    show(scene)
    {
        let tileMap = scene.add.tilemap("tiles");
        this.DungeonTiles = tileMap.addTilesetImage("DungeonTiles");
        this.Background = tileMap.createDynamicLayer("Background", [this.DungeonTiles],0,0);
        this.Ground = tileMap.createDynamicLayer("Ground", [this.DungeonTiles],0,0);
        this.Walls = tileMap.createDynamicLayer("Walls", [this.DungeonTiles],0,0);
    }
    resize(size)
    {
        let leftOffset,rightOffset,offset;
        leftOffset=(10-(size+1))/2;
        rightOffset=10-leftOffset;
        offset=1+leftOffset;
        this.putCorners(leftOffset,rightOffset);
        for(let i=offset;i<size+offset;i++)
        {
            this.Walls.putTileAt(2, i,   leftOffset);
            this.Walls.putTileAt(7,   leftOffset, i);
            for(let j =offset; j<size+offset;j++)
            {
                this.Walls.removeTileAt(i, j);
                this.Ground.putTileAt(8, i, j);
            }
            this.Walls.putTileAt(14, i, rightOffset);
            this.Walls.putTileAt(9,   rightOffset, i);
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
        this.Walls.removeTileAt(x,y);
        this.Ground.removeTileAt(x,y);
        this.Background.putTileAt(6,x,y);
    }
    putCorners(x,y)
    {
        this.Walls.putTileAt(1,x,x);
        this.Walls.putTileAt(3,y,x);
        this.Walls.putTileAt(15,y,y);
        this.Walls.putTileAt(13,x,y);
    }
    putEntrance(x,y)
    {
        this.Walls.removeTileAt( x, 5 );
        this.Walls.removeTileAt( y, 5);
        this.Ground.putTileAt(8,x,5);
        this.Ground.putTileAt(8,y,5);
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