export  class dungeon
{
    constructor(rooms)
    {
        this.rooms = rooms;
    }
}
export class room 
{
    constructor(size, traps, enemies, scene)
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

        leftOffset=(10-(size+1))/2;                          //     Desde donde empieza a pintar tiles (izquierda)       -> Sirve para esquinas y paredes
        rightOffset=10-leftOffset;                           //     Hasta donde pinta tiles (derecha)                    -> Sirve para esquinas y paredes
        offset=1+leftOffset;                                 //     Desde donde empieza la pate jugable de la habitación -> Sirve para tiles de suelo

        this.putCorners(leftOffset,rightOffset);             //     Coloca esquinas
        for(let i=offset;i<size+offset;i++)
        {
            this.scene.Walls.putTileAt(2, i,   leftOffset);  //     || Pinta la pared superior  ||
            this.scene.Walls.putTileAt(7,   leftOffset, i);  //     || Pinta la pared izquierda ||
            this.scene.Walls.putTileAt(14, i, rightOffset);  //     || Pinta la pared inferior  ||
            this.scene.Walls.putTileAt(9,   rightOffset, i); //     || Pinta la pared derecha   ||
            
            for(let j =offset; j<size+offset;j++)
            {
                this.scene.Walls.removeTileAt(i, j);         //     Elimina las paredes que queden en la parte jugable de la habitación (offset -> size+offset)
                this.scene.Ground.putTileAt(8, i, j);        //     Coloca suelo en las mismas casillas
            }
        }
        this.removeLoops(leftOffset-1);                      //     Elimina un loop desde el centro hasta la coordenada dada -> sirve para pasar de una habitación grande a una pequeña
        this.putEntrance(leftOffset,rightOffset);            //     Coloca las entradas en las paredes
        
    }
    //2,8,3     1,9,2,     0,10,1 
    removeLoops(offset)
    {
        let y= 0, x= 0;
        for(x = offset; x<11-offset;x++)                     //Quita horizontales -> fijar la Y al máximo superior e inferior y quitar los tiles
        {
            y = offset;
            this.removeTile(x,y);
            y = 10-offset;
            this.removeTile(x,y);  
        }
        x= 0;
        for(let y = offset; y<11-offset;y++)                 //Quita verticales -> fijar la X a los máxmimos izquierdo y derecho y quitar los tiles
        {
            x = offset;
            this.removeTile(x,y);
            x = 10-offset;
            this.removeTile(x,y);  
        }
        if(offset == 1)                                      //Para que limpie el loop mediano y el grande en el caso de llamar al pequeño desde el grande
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