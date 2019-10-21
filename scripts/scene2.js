import {dungeon, room, trap} from './dungeon.js';
import {button} from './ui.js';
const  scene =
{
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        this.rooms = [ new room(5,0,0,this),new room(5,0,0,this), new room(5,0,0,this) ];
        this.dungeon = new dungeon(this.rooms);
        this.actual = 0;
        
    },
    create : function()
    {
        let tileMap = this.add.tilemap("tiles");
        this.DungeonTiles = tileMap.addTilesetImage("DungeonTiles");
        this.Background = tileMap.createDynamicLayer("Background", [this.DungeonTiles],0,0);
        this.Ground = tileMap.createDynamicLayer("Ground", [this.DungeonTiles],0,0);
        this.Walls = tileMap.createDynamicLayer("Walls", [this.DungeonTiles],0,0);
        
        this.rooms[this.actual].show(this);

        //estos botones representan el tamaño de la habitación actual (this.rooms[this.actual].size)

        this.buttonSmall = new button(this,10, 10, 'Small',{fontFamily:"arial", fontSize:"15px", color:"#ff00ff"}, 5,0); //el primer valor de derecha a izquierda
        this.buttonMedium = new button(this,60, 10, 'Medium',{fontFamily:"arial", fontSize:"15px"}, 7,1);// es el índice, el segundo el tamaño de la habitación
        this.buttonLarge = new button(this,125, 10, 'Large',{fontFamily:"arial", fontSize:"15px"}, 9,2);

        //estos botones representan el índice de la habitación actual (this.actual)

        this.button1 = new button(this,55, 150, '1',{fontFamily:"arial", fontSize:"15px", color:"#ff00ff"}, -1,0); //estos botones no necesitan guardar el tamaño
        this.button2 = new button(this,85, 150, '2',{fontFamily:"arial", fontSize:"15px"}, -1,1); //y como no sé hacer constructoras distintas por ahora guardan -1
        this.button3 = new button(this,110, 150, '3',{fontFamily:"arial", fontSize:"15px"}, -1,2);


        this.sizeButtons = this.add.group();
        this.sizeButtons.addMultiple([this.buttonSmall,this.buttonMedium,this.buttonLarge]);
        this.indexButtons = this.add.group();
        this.indexButtons.addMultiple([this.button1,this.button2,this.button3]);
        let children = this.sizeButtons.getChildren()
        let childrenBot = this.indexButtons.getChildren()

        this.sizeButtons.children.iterate(sizeButton =>
        {
            sizeButton.setInteractive();
            sizeButton.on("pointerdown",()=>
            {
                this.rooms[this.actual].resize(sizeButton.roomSize);
                sizeButton.setFill("#ff00ff");
                for(let i  = 0; i<3;i++)
                {
                    if(this.rooms[this.actual].size!==children[i].roomSize)children[i].setFill("#ffffff");
                }
            });
            sizeButton.on("pointerover",()=>{if(sizeButton.style.color!=="#ff00ff")sizeButton.setFill("#ff0000")});
            sizeButton.on("pointerout", ()=>{if(sizeButton.style.color!=="#ff00ff")sizeButton.setFill("#ffffff")});
            console.log(sizeButton);
        })

        this.indexButtons.children.iterate(indexButton =>
        {
           indexButton.setInteractive();
           indexButton.on("pointerdown",()=>
           {
               this.actual = indexButton.buttonPos; 
               indexButton.setFill("#ff00ff");
               this.rooms[this.actual].resize(this.rooms[this.actual].size);
               for(let i  = 0; i<3;i++)
               {
                   if(this.actual!==i)childrenBot[i].setFill("#ffffff");
                   if(this.rooms[this.actual].size===children[i].roomSize)children[i].setFill("#ff00ff");
                   else children[i].setFill("#ffffff");
               }
           }   
            );
           indexButton.on("pointerover",()=>{if(indexButton.style.color!=="#ff00ff")indexButton.setFill("#ff0000")});
           indexButton.on("pointerout", ()=>{if(indexButton.style.color!=="#ff00ff")indexButton.setFill("#ffffff")});
        })

    },
    update : function(delta)
    {

    },
    checkColors: function(children)
    {

    }
    
}
export default scene;

