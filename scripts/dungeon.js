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
    make5x5()
    {
        this.Walls.putTileAt(1,2,2);
        this.Walls.putTileAt(3,8,2);
        this.Walls.putTileAt(15,8,8);
        this.Walls.putTileAt(13,2,8);
        for(let i=0;i<5;i++)
        {
            this.Walls.putTileAt(2, i+3,   2);
            this.Walls.putTileAt(7,   2, i+3);
            for(let j = 0; j<5;j++)
            {
                this.Walls.removeTileAt(i+3, j+3);
                this.Ground.putTileAt(8, i+3, j+3);
            }
            this.Walls.putTileAt(14, i+3, 8);
            this.Walls.putTileAt(9,   8, i+3);
        }
        this.Walls.removeTileAt( 2, 5 );
        this.Walls.removeTileAt( 8, 5);
        this.Ground.putTileAt(8,2,5);
        this.Ground.putTileAt(8,7,5);
        this.removeRounds5();
    }
    make7x7()
    {
        this.Walls.putTileAt(1,1,1);
        this.Walls.putTileAt(3,9,1);
        this.Walls.putTileAt(15,9,9);
        this.Walls.putTileAt(13,1,9);
        for(let i=0;i<7;i++)
        {
            this.Walls.putTileAt(2, i+2,   1);
            this.Walls.putTileAt(7,   1, i+2);
            for(let j = 0; j<7;j++)
            {
                this.Walls.removeTileAt(i+2, j+2);
                this.Ground.putTileAt(8, i+2, j+2);
            }
            this.Walls.putTileAt(14, i+2, 9);
            this.Walls.putTileAt(9,   9, i+2);
        }
        this.Walls.removeTileAt( 1, 5 );
        this.Walls.removeTileAt( 9, 5);
        this.Ground.putTileAt(8,1,5);
        this.Ground.putTileAt(8,9,5);
        this.removeRounds7();
    }
    make9x9()
    {
        this.Walls.putTileAt(1,0,0);
        this.Walls.putTileAt(3,10,0);
        this.Walls.putTileAt(15,10,10);
        this.Walls.putTileAt(13,0,10);
        for(let i=0;i<9;i++)
        {
            this.Walls.putTileAt(2, i+1,   0);
            this.Walls.putTileAt(7,   0, i+1);
            for(let j = 0; j<9;j++)
            {
                this.Walls.removeTileAt(i+1, j+1);
                this.Ground.putTileAt(8, i+1, j+1);
            }
            this.Walls.putTileAt(14, i+1, 10);
            this.Walls.putTileAt(9,   10, i+1);
        }
        this.Walls.removeTileAt( 1, 6 );
        this.Walls.removeTileAt( 9, 6);
        this.Ground.putTileAt(8,1,6);
        this.Ground.putTileAt(8,10,6);
    }
    removeRounds7()
    {
        let x = 0, y=0;
        for(y = 0; y<11; y++)
        {
            x = 0;
            this.removeTile(x,y);
            x = 10;
            this.removeTile(x,y);            
        }
        y = 0;
        for(x = 0; x<11;x++)
        {
            y = 0;
            this.removeTile(x,y);            
            y=10;
            this.removeTile(x,y);            
        }
    }
    removeRounds5()
    {
        this.removeRounds7();
        let x = 1, y=1;
        for(y = 1; y<10; y++)
        {
            x = 1;
            this.removeTile(x,y);
            x = 9;
            this.removeTile(x,y);            
        }
        y = 1;
        for(x = 1; x<10; x++)
        {
            y = 1;
            this.removeTile(x,y);            
            y = 9;
            this.removeTile(x,y);            
        }

    }
    removeTile(x,y)
    {
        this.Walls.removeTileAt(x,y);
        this.Ground.removeTileAt(x,y);
        this.Background.putTileAt(6,x,y);
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