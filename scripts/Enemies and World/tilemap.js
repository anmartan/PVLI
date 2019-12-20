export class tilemap {
    constructor(scene, json, side, scale, tileImages, hoffset = 0, voffset = 0) {
        this.scene = scene;
        this.tileMap = this.scene.add.tilemap(json);
        let pos = ((11 * side) - ((side * scale) * 11)) / 2;
        let DungeonTiles = this.tileMap.addTilesetImage(tileImages);
        this.Background = this.tileMap.createDynamicLayer("Background", DungeonTiles, pos + hoffset, pos + voffset);
        this.Ground = this.tileMap.createDynamicLayer("Ground", DungeonTiles, pos + hoffset, pos + voffset);
        this.Walls = this.tileMap.createDynamicLayer("Walls", DungeonTiles, pos + hoffset, pos + voffset);
        this.Background.scale = scale;
        this.Ground.scale = scale;
        this.Walls.scale = scale;
        this.Walls.setCollisionByProperty({ collides: "true" });


        this.tileIDs = {
            TopWall: 2,
            RightWall: 11,
            LeftWall: 9,
            BottomWall: 18,

            TopLeftCorner: 1,
            TopRightCorner: 3,
            BottomRightCorner: 19,
            BottomLeftCorner: 17,

            Ground: 42,
            Background: 46
        }


    }

    changeRoom(size) {
        let leftOffset, rightOffset, offset;

        leftOffset = (9 - size) / 2;                               //     Desde donde empieza a pintar tiles (izquierda)       -> Sirve para esquinas y paredes
        rightOffset = 10 - leftOffset;                           //     Hasta donde pinta tiles (derecha)                    -> Sirve para esquinas y paredes
        offset = 1 + leftOffset;                                 //     Desde donde empieza la pate jugable de la habitación -> Sirve para tiles de suelo

        this.putCorners(leftOffset, rightOffset);             //     Coloca esquinas
        for (let i = offset; i < size + offset; i++) {
            this.putWall(this.tileIDs.TopWall, i, leftOffset);                //     || Pinta la pared superior  ||
            this.putWall(this.tileIDs.LeftWall, leftOffset, i);                //     || Pinta la pared izquierda ||
            this.putWall(this.tileIDs.BottomWall, i, rightOffset);                //     || Pinta la pared inferior  ||
            this.putWall(this.tileIDs.RightWall, rightOffset, i);               //     || Pinta la pared derecha   ||

            for (let j = offset; j < size + offset; j++) {
                this.Walls.removeTileAt(i, j);                      //     Elimina las paredes que queden en la parte jugable de la habitación (offset -> size+offset)
                this.Ground.putTileAt(this.tileIDs.Ground, i, j);   //     Coloca suelo en las mismas casillas
            }
        }
        this.removeLoops(leftOffset - 1);                      //     Elimina un loop desde el centro hasta la coordenada dada -> sirve para pasar de una habitación grande a una pequeña
        this.putEntrance(leftOffset, rightOffset);            //     Coloca las entradas en las paredes
        this.Walls.setCollisionByProperty({ collides: "true" });

    }
    putWall(tileIndex, x, y) {
        this.Walls.putTileAt(tileIndex, x, y);
        this.Ground.removeTileAt(x, y);
        this.tileMap.getTileAt(x, y, this.Walls).properties.collides = "true"; //Importante, porque si no lo haces no va
    }
    removeLoops(offset) {
        let y = 0, x = 0;
        for (x = offset; x < 11 - offset; x++)                     //     Quita horizontales -> fijar la Y al máximo superior e inferior y quitar los tiles
        {
            y = offset;
            this.removeTile(x, y);
            y = 10 - offset;
            this.removeTile(x, y);
        }
        x = 0;
        for (let y = offset; y < 11 - offset; y++)                 //     Quita verticales -> fijar la X a los máxmimos izquierdo y derecho y quitar los tiles
        {
            x = offset;
            this.removeTile(x, y);
            this.removeTile(x - 1, y);
            x = 10 - offset;
            this.removeTile(x + 1, y);
            this.removeTile(x, y);
        }
        if (offset == 1)                                      //     Para que limpie el loop mediano y el grande en el caso de llamar al pequeño desde el grande
        {
            offset--;
            this.removeLoops(offset);
        }
    }
    removeTile(x, y) {
        this.Walls.removeTileAt(x, y);
        this.Ground.removeTileAt(x, y);
        this.Background.putTileAt(this.tileIDs.Background, x, y);
    }
    putCorners(l, r) {
        this.Walls.putTileAt(this.tileIDs.TopLeftCorner, l, l);
        this.Ground.removeTileAt(l, l);

        this.Walls.putTileAt(this.tileIDs.TopRightCorner, r, l);
        this.Ground.removeTileAt(r, l);

        this.Walls.putTileAt(this.tileIDs.BottomRightCorner, r, r);
        this.Ground.removeTileAt(r, r);

        this.Walls.putTileAt(this.tileIDs.BottomLeftCorner, l, r);
        this.Ground.removeTileAt(l, r);
    }
    putEntrance(x, y) {
        this.Walls.removeTileAt(x, 5);
        this.Walls.removeTileAt(y, 5);
        //this.Ground.putTileAt(this.tileIDs.Ground,x,5);
        //this.Ground.putTileAt(this.tileIDs.Ground,y,5);
    }
}