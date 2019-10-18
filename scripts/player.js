export class livingEntity extends Phaser.sprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y, "player")
        this.speed = 0;
    }
    constructor(scene,x,y,_speed)
    {
        super(scene,x,y, "player")
        this.speed = _speed;
    }
    move(dir)
    {
        switch (dir) //dir = 0 -> derecha :: dir = 1 -> arriba :: dir = 2 -> izquierda :: dir ==  abajo 
        {
            case 0:
                this.x+= this.speed;
                break;
            case 1:
                this.y-=this.speed;
                break;
            case 2: 
                this.x-=this.speed;
                break;
            case 3:
                this.y+=this.speed;
        }
    }
    attack(dir){};
}


export class player extends livingEntity
{
    constructor(scene, x, y)
    {
        super(scene,x,y, "player")
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        update()
        {
            if(this.key_D.isDown)
            {
                this.move(0);
                this.player.setFlipX(false);
     
             }
             if(this.key_A.isDown)
             {
                 this.move(2);
                 this.player.setFlipX(true);
            }
            if(this.key_W.isDown)
            {
                this.pmove(1);
            }
            if (this.key_S.isDown)
            {
                this.move(3);
            }
        }
    }
} 
 