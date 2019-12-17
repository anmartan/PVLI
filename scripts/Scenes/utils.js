export class rec extends Phaser.GameObjects.Zone
{
    constructor(scene)
    {
        let yPosInPixels =  scene.game.tileSize*5;
        super(scene,0, yPosInPixels, scene.game.tileSize, scene.game.tileSize)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.debugBodyColor="0x00ff00";
        this.setOrigin(0,0);
        this.tileSize=scene.game.tileSize;
        this.scene=scene;
    }
    setRecPos(size, exit)
    {
        let positionInTiles=(9-size)/2;
        if(exit)positionInTiles=10-positionInTiles;
        this.x = (positionInTiles)*this.tileSize;
    }

}

export class Life 
{
    constructor(scene, player)
    {
        this.scene = scene;
        this.player = player;
        this.player.health = player.health;
        this.hearts = new Array();
        this.lastHeartAlive= this.player.health-1;

        for(let i=0; i< this.player.health; i++)
        {
            let heart;
            heart = this.scene.add.sprite(32 + 32*i, 32, "full_Heart");
            let id= this.hearts.push(heart);
        }
        for(let i=0; i< this.player.health; i++)
        this.scene.time.delayedCall(1000 *i, ()=>{console.log("Se va a destruir un corazón."); this.loseHeart();})
    }
    loseHeart()
    {
        this.hearts[this.lastHeartAlive].setVisible(false);
        this.lastHeartAlive --;
    }
}