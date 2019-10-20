export class dungeon
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