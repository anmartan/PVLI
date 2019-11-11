export  class dungeon
{
    constructor(rooms)
    {
        this.rooms = rooms;
    }
}
export class room 
{
    constructor(size, traps, enemies, scene)
    {
        this.size=size;
        this.traps = traps;
        this.enemies = enemies;
        this.scene = scene;
    }
    resize(size)
    {
        this.size = size;
        this.scene.tileMap.changeRoom(size);    
    }

}/*
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
}*/