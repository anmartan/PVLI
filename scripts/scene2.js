import {dungeon, room, trap} from './dungeon.js';
const  scene =
{
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        this.rooms = [ new room(5,5,0,0),new room(7,7,0,0), new room(9,9,0,0) ];
        this.dungeon = new dungeon(this.rooms);
        
    },
    create : function()
    {
        
        this.rooms[0].show(this);
        //this.rooms[0].make7x7();
        //this.rooms[0].make9x9();

        let text = this.add.text(25, 10, 'Small');
        text.setFont('Arial Black');
        text.setFontSize(12);
        let text1 = this.add.text(70, 10, 'Medium');
        text1.setFont('Arial Black');
        text1.setFontSize(12);
        let text2 = this.add.text(125, 10, 'Large');
        text2.setFont('Arial Black');
        text2.setFontSize(12);

        
        text.setInteractive();
        text1.setInteractive();
        text2.setInteractive();
        text.on("pointerdown",()=>this.rooms[0].resize(5));
        text1.on("pointerdown",()=>this.rooms[0].resize(7));
        text2.on("pointerdown",()=>this.rooms[0].resize(9));
    },
    update : function(delta)
    {
        
    }
    
}
export default scene;

