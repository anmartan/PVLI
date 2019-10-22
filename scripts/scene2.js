import {dungeon, room, trap} from './dungeon.js';
import {indexButton, sizeButton} from './ui.js';
const  scene =
{
    key: "scene2",
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
        let side = 16;
        let scale = 0.5;
        let pos = ((11*side)-((side*scale)*11))/2;
        this.DungeonTiles = tileMap.addTilesetImage("DungeonTiles");
        this.Background = tileMap.createDynamicLayer("Background", [this.DungeonTiles],0,0);
        this.Ground = tileMap.createDynamicLayer("Ground", [this.DungeonTiles],pos,pos);
        this.Walls = tileMap.createDynamicLayer("Walls", [this.DungeonTiles],pos,pos);
        this.Ground.scale=scale;
        this.Walls.scale=scale;
        

        //estos botones representan el tamaño de la habitación actual (this.rooms[this.actual].size)

        this.buttonSmall = new sizeButton(this,10, 10, 'Small',{fontFamily:"arial", fontSize:"15px", color:"#ff00ff"}, 5,0); //el primer valor de derecha a izquierda
        this.buttonMedium = new sizeButton(this,60, 10, 'Medium',{fontFamily:"arial", fontSize:"15px"}, 7,1);// es el índice, el segundo el tamaño de la habitación
        this.buttonLarge = new sizeButton(this,125, 10, 'Large',{fontFamily:"arial", fontSize:"15px"}, 9,2);

        //estos botones representan el índice de la habitación actual (this.actual)

        this.button1 = new indexButton(this,55, 150, '1',{fontFamily:"arial", fontSize:"15px", color:"#ff00ff"}, -1,0); //estos botones no necesitan guardar el tamaño
        this.button2 = new indexButton(this,85, 150, '2',{fontFamily:"arial", fontSize:"15px"}, -1,1); //y como no sé hacer constructoras distintas por ahora guardan -1
        this.button3 = new indexButton(this,110, 150, '3',{fontFamily:"arial", fontSize:"15px"}, -1,2);


        this.sizeButtons = this.add.group();
        this.sizeButtons.addMultiple([this.buttonSmall,this.buttonMedium,this.buttonLarge]);
        this.indexButtons = this.add.group();
        this.indexButtons.addMultiple([this.button1,this.button2,this.button3]);
        let sizeButtonChildren = this.sizeButtons.getChildren()
        let indexButtonChildren = this.indexButtons.getChildren()

        this.sizeButtons.children.iterate(sizeButton =>
        {
            sizeButton.click(sizeButtonChildren, "#ff00ff", "#ffffff" );
            sizeButton.over("#ff00ff","#ff0000");
            sizeButton.out("#ff00ff","#ffffff");
            console.log(sizeButton);
        })

        this.indexButtons.children.iterate(indexButton =>
        {
           indexButton.click(sizeButtonChildren,indexButtonChildren, "#ff00ff", "#ffffff" );
           indexButton.over("#ff00ff","#ff0000");
           indexButton.out("#ff00ff","#ffffff");
        })
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    },
    update : function(delta)
    {
    if(this.key_D.isDown)
    {
        this.game.scene.start("scene1");
        this.game.scene.stop("scene2");
        this.game.dungeon = new dungeon(this.rooms);
    }
    },
    checkColors: function(children)
    {

    }
    
}
export default scene;

