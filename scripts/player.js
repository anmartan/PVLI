export class livingEntity extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,_speed,sprite)
    {
        super(scene,x,y, sprite)
        this.speed = _speed;
    }
    move(dir)
    {
        //dir = 0 -> derecha :: dir = 1 -> arriba :: dir = 2 -> izquierda :: dir ==  abajo 
        switch (dir) 
        {   case 0:
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
    constructor(scene, x, y, speed,sprite)
    {
        super(scene,x,y, speed,sprite)
        this.key_D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }
    handleLogic()
        {
            if(this.key_D.isDown)
            {
                this.move(0);
                this.setFlipX(false);
     
             }
             if(this.key_A.isDown)
             {
                this.move(2);
                this.setFlipX(true);
            }
            if(this.key_W.isDown)
            {
                this.move(1);
            }
            if (this.key_S.isDown)
            {
                this.move(3);
            }
        }
} 
 