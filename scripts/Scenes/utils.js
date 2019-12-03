export class rec extends Phaser.GameObjects.Zone
{
    constructor(scene)
    {
        let yPosInTiles =  scene.game.tileSize*5;
        super(scene,0, yPosInTiles, scene.game.tileSize, scene.game.tileSize)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.debugBodyColor="0x00ff00";
        this.setOrigin(0,0);
        this.tileSize=scene.game.tileSize;
        this.scene=scene;
    }
    setRecPos(size, exit)
    {
        let positionInTiles=(9-size);
        if(exit)positionInTiles=10-positionInTiles;
        this.x = positionInTiles/2*this.tileSize;
    }

}