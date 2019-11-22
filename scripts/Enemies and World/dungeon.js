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
        this.traps = traps; //trap manager
        this.enemies = enemies; //enemy manager
        //this.scene = scene;
    }
    resize(size, scene)
    {
        this.size = size;
        scene.tileMap.changeRoom(size);    
    }

}