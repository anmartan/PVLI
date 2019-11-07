import {dungeon, room, trap} from './dungeon.js';
import {indexButton, sizeButton, button, editorMenu} from './ui.js';
import {tilemap} from './tilemap.js';
import {enemyInfo} from './enemy.js';

const  scene =
{
    key: "scene2",
    preload: function()
    {
        
        this.load.image("DungeonTiles","../assets/ground/DungeonStarter.png");
        this.load.image("default","../assets/debug/default.png");
        this.load.image("white","../assets/debug/white.png");
        this.load.image("yellow","../assets/debug/yellow.png");
        this.load.image("pink","../assets/debug/pink.png");
        this.load.image("pink2","../assets/debug/pink2.png");
        this.load.tilemapTiledJSON("tiles","../assets/ground/tiles.json");
        
        this.rooms = [ new room(5,0,new enemyInfo(),this),new room(7,0,new enemyInfo(),this), new room(9,0,new enemyInfo(),this) ];
        this.dungeon = new dungeon(this.rooms);
        this.actual = 0;
        
    },
    create : function()
    {
        this.tileMap = new tilemap(this, "tiles",16, 0.5, "DungeonTiles",16*2,0);

        let config =
        {
            scene : this,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#FFFFFF",
            style : {fontFamily:"arial", fontSize:"15px"},
        }

        this.editorMenu = new editorMenu(this,16*2,0);
        
        this.buttonSmall  = new sizeButton (config,  10,  10,   'Small',  5).setFill(config.clickedColor); //empezamos en una habitación pequeña
        this.buttonMedium = new sizeButton (config,  60,  10,   'Medium', 7);
        this.buttonLarge  = new sizeButton (config,  125, 10,   'Large',  9);
        this.button1      = new indexButton(config,  55,  140,  '1',      0).setFill(config.clickedColor); //y es la primera de la dungeon
        this.button2      = new indexButton(config,  85,  140,  '2',      1); 
        this.button3      = new indexButton(config,  110, 140,  '3',      2);
        
        this.sizeButtons = this.add.group();
        this.sizeButtons.addMultiple([this.buttonSmall,this.buttonMedium,this.buttonLarge]);
        this.indexButtons = this.add.group();
        this.indexButtons.addMultiple([this.button1,this.button2,this.button3]);
        let sizeButtonChildren = this.sizeButtons.getChildren()
        let indexButtonChildren = this.indexButtons.getChildren()

        this.sizeButtons.children.iterate(sizeButton   =>   {sizeButton.click(sizeButtonChildren)})

        this.indexButtons.children.iterate(indexButton =>   {indexButton.click(indexButtonChildren,sizeButtonChildren)})
        
        
        let continuar = new button(config,110,160,"Continuar");
        continuar.on("pointerdown", () =>
        {
            this.game.scene.start("scene1");
            this.game.scene.stop("scene2");
            this.game.dungeon = new dungeon(this.rooms);
            console.log(this.game.dungeon);
            this.editorMenu.save(this.game.dungeon);
        })


        
        
        
    
    },
    update : function(delta)
    {

    }
    
}
export default scene;

