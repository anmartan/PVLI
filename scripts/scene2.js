import {dungeon, room, trap} from './dungeon.js';
import {button} from './ui.js';
const  scene =
{
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        this.rooms = [ new room(5,5,0,0),new room(7,7,0,0), new room(9,9,0,0) ];
        this.dungeon = new dungeon(this.rooms);
        this.actual = 0;
        
    },
    create : function()
    {
        
        this.rooms[this.actual].show(this);

        this.textArray;

        let text = new button(this,25, 10, 'Small',{font:"arial", style:"12px"},5);
        let text1 =new button(this,70, 10, 'Medium',{font:"arial", style:"12px"},7);
        let text2 = new button(this,125, 10, 'Large',{font:"arial", style:"12px"},9);

        this.textArray = [text,text1,text2];

        for(let i = 0; i<this.textArray.length;i++)
        {
            this.textArray[i].setInteractive();
            this.textArray[i].on("pointerdown",()=>this.rooms[this.actual].resize(this.textArray[i].size));
            console.log(this.textArray[i]);
        }

    },
    update : function(delta)
    {
        
    },
    
}
export default scene;

