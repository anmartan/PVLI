export class tilemap
{
    constructor(scene,json,side,scale, tileImages)
    {
        this.scene = scene;
        this.tileMap = this.scene.add.tilemap(json);
        let pos = ((11*side)-((side*scale)*11))/2;
        let DungeonTiles = this.tileMap.addTilesetImage(tileImages);
        this.Background = this.tileMap.createDynamicLayer("Background", DungeonTiles,0,0);
        this.Ground = this.tileMap.createDynamicLayer("Ground", DungeonTiles,pos,pos);
        this.Walls = this.tileMap.createDynamicLayer("Walls", DungeonTiles,pos,pos);
        this.Ground.scale=scale;
        this.Walls.scale=scale;
        this.Walls.setCollisionByProperty({collides: "true"});
    }
    
    changeRoom(size)
    {
        let leftOffset,rightOffset,offset;

        leftOffset=(10-(size+1))/2;                          //     Desde donde empieza a pintar tiles (izquierda)       -> Sirve para esquinas y paredes
        rightOffset=10-leftOffset;                           //     Hasta donde pinta tiles (derecha)                    -> Sirve para esquinas y paredes
        offset=1+leftOffset;                                 //     Desde donde empieza la pate jugable de la habitación -> Sirve para tiles de suelo

        this.putCorners(leftOffset,rightOffset);             //     Coloca esquinas
        for(let i=offset;i<size+offset;i++)
        {
            this.putWall(2, i,   leftOffset);                //     || Pinta la pared superior  ||
            this.putWall(7,   leftOffset, i);                //     || Pinta la pared izquierda ||
            this.putWall(14, i, rightOffset);                //     || Pinta la pared inferior  ||
            this.putWall(9,   rightOffset, i);               //     || Pinta la pared derecha   ||
            
            for(let j =offset; j<size+offset;j++)
            {
                this.Walls.removeTileAt(i, j);               //     Elimina las paredes que queden en la parte jugable de la habitación (offset -> size+offset)
                this.Ground.putTileAt(8, i, j);              //     Coloca suelo en las mismas casillas
            }
        }
        this.removeLoops(leftOffset-1);                      //     Elimina un loop desde el centro hasta la coordenada dada -> sirve para pasar de una habitación grande a una pequeña
        this.putEntrance(leftOffset,rightOffset);            //     Coloca las entradas en las paredes
        this.Walls.setCollisionByProperty({collides: "true"});

    }
    putWall(tileIndex, x, y)
    {
        this.Walls.putTileAt(tileIndex,x,y);
        this.tileMap.getTileAt(x,y,this.Walls).properties.collides = "true";
    }
    removeLoops(offset)
    {
        let y= 0, x= 0;
        for(x = offset; x<11-offset;x++)                     //     Quita horizontales -> fijar la Y al máximo superior e inferior y quitar los tiles
        {
            y = offset;
            this.removeTile(x,y);
            y = 10-offset;
            this.removeTile(x,y);  
        }
        x= 0;
        for(let y = offset; y<11-offset;y++)                 //     Quita verticales -> fijar la X a los máxmimos izquierdo y derecho y quitar los tiles
        {
            x = offset;
            this.removeTile(x,y);
            x = 10-offset;
            this.removeTile(x,y);  
        }
        if(offset == 1)                                      //     Para que limpie el loop mediano y el grande en el caso de llamar al pequeño desde el grande
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