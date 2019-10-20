import {dungeon, room, trap} from './dungeon.js';
const  scene =
{
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        let rooms = [ new room(5,5,0,0),new room(7,7,0,0), new room(9,9,0,0) ];
        this.dungeon = new dungeon(rooms);
        
    },
    create : function()
    {
        
        
        let tiles5x5 = this.add.tilemap("tiles");
        console.log(tiles5x5);
        let DungeonTiles = tiles5x5.addTilesetImage("DungeonTiles");
        let Background = tiles5x5.createDynamicLayer("Background", [DungeonTiles],0,0);
        let Ground = tiles5x5.createDynamicLayer("Ground", [DungeonTiles],0,0);
        let Walls = tiles5x5.createDynamicLayer("Walls", [DungeonTiles],0,0);
        
        
        //si quitas este comentario se hace de 7x7
        /*Walls.putTileAt(1,1,1);
        Walls.putTileAt(3,9,1);
        Walls.putTileAt(15,9,9);
        Walls.putTileAt(13,1,9);
        for(let i=0;i<7;i++)
        {
            Walls.putTileAt(2, i+2,   1);
            Walls.putTileAt(7,   1, i+2);
            for(let j = 0; j<7;j++)
            {
                Walls.removeTileAt(i+2, j+2);
                Ground.putTileAt(8, i+2, j+2);
            }
            Walls.putTileAt(14, i+2, 9);
            Walls.putTileAt(9,   9, i+2);
        }
        Walls.removeTileAt( 1, 5 );
        Walls.removeTileAt( 9, 5);
        Ground.putTileAt(8,1,5);
        Ground.putTileAt(8,9,5);*/


    },

    update : function(delta)
    {
        
    }
    
}
export default scene;

