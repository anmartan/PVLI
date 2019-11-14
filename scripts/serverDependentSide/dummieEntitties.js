export class dummiePlayer extends Phaser.GameObjects.Sprite
{

    constructor(scene,x,y,sprite, spriteSword, scale)
    {
        super(scene,x,y,sprite);
        this.sword = scene.add.sprite(x,y,spriteSword).setScale(scale);
        scene.add.existing(this);
        scene.add.existing(this.sword);
        this.sword.setVisible(false);
        this.scene=scene;
        this.sword.x = 0;
        this.sword.y = 0;
        socket.on("playerMove", (data)=>this.move(data.pos, data.flip));
        socket.on("playerAttack", (data)=>this.attack(data.angle, data.offsetX,data.offsetY));
        socket.on("playerHaveAttacked", () =>this.sword.setVisible(false)); 
    }
    move(pos, flip)
    {
        this.x = pos.x;
        this.y = pos.y;
        this.sword.x = this.x+this.offsetX;
        this.sword.y = this.y+this.offsetY;
        this.setFlipX(flip);

    }
    attack(angle, offsetX,offsetY)
    {
        this.sword.setVisible(true);
        this.sword.setAngle(angle);
        this.offsetX=offsetX;
        this.offsetY=offsetY;
    }

}

export class dummieEnemy extends Phaser.GameObjects.Sprite
{

    constructor(scene,x,y,sprite,anim, enemyManager, id)
    {
        super(scene,x*16+24,y*16+24,sprite);
        scene.add.existing(this);
        this.enemyManager=enemyManager;
        this.play(anim);
        this.id = id;
    }
    move(pos, flip)
    {
        this.x = pos.x;
        this.y = pos.y;
        this.setFlipX(flip);
    }
    killDumie()
    {
        this.destroy();
        this.setVisible(false);
    }
}