export class livingEntity extends Phaser.GameObjects.Container
{
    
    constructor(scene,x,y,spriteID,speed)
    {
        super(scene, 0, 0)
        this.speed = speed;
        let sprite = scene.add.sprite(x,y,spriteID);
        this.add(sprite);
        scene.add.existing(sprite);
        scene.physics.add.existing(sprite);
        this.body = sprite.body;
        this.sprite = sprite;
    }
    moveLeft()
    {
        this.body.setVelocity(-this.speed,this.body.velocity.y)
    }
    moveRight()
    {
        this.body.setVelocity(this.speed,this.body.velocity.y)

    }
    moveDown()
    {
        this.body.setVelocity(this.body.velocity.x,this.speed)

    }
    moveUp()
    {
        this.body.setVelocity(this.body.velocity.x,-this.speed)
    }
    attack(dir){};
}



export class player extends livingEntity
{
    constructor(scene, x, y, speed,sprite, anim, sword)
    {
        super(scene,x,y, sprite,speed)
        this.key_D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_UP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.key_RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.key_DOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.key_LEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.sprite.play(anim);

        this.weapon = scene.add.sprite(x+16,y+8,sword.name);
        this.add(this.weapon);
        this.weapon.scale = 0.5;
        scene.add.existing(this.weapon);
        scene.physics.add.existing(this.weapon);
        this.weapon.body.setSize(32,16);    
        this.weapon.setAngle(90);    
    }
    handleLogic()
    {
        if(this.key_D.isDown)
        {
            this.moveRight();
            this.sprite.setFlipX(false);
        }
        if(this.key_A.isDown)
        {
            this.moveLeft();
            this.sprite.setFlipX(true);
        }
        if(this.key_W.isDown)
        {
            this.moveUp();
        }
        if(this.key_S.isDown)
        {
            this.moveDown();
        }
        if (this.key_A.isUp && this.key_D.isUp){this.body.setVelocity(0,this.body.velocity.y)}
        if (this.key_W.isUp && this.key_S.isUp){this.body.setVelocity(this.body.velocity.x,0)}

        let offsetx = 16;
        let offsety= 8;

        if(this.key_DOWN.isDown)
        {
            offsety=22;
            offsetx=0;
            this.weapon.body.setSize(16,32);    
            this.weapon.setAngle(180); 
        }
        if(this.key_UP.isDown)
        {
            offsety=-10;
            offsetx=0;
            this.weapon.body.setSize(16,32);    
            this.weapon.setAngle(0); 

        }
        if(this.key_RIGHT.isDown)
        {
            this.weapon.body.setSize(32,16);    
            if(offsetx<0)offsetx*=-1;
            this.weapon.setAngle(90); 
        }
        if(this.key_LEFT.isDown)
        {
            this.weapon.body.setSize(32,16);    
            if(offsetx>0)offsetx*=-1;
            this.weapon.setAngle(270); 
        }







        //this.weapon.body.velocity = this.body.velocity;
        this.weapon.x = this.sprite.x+offsetx;
        this.weapon.y = this.sprite.y+offsety;
    }
    
}
export class enemy extends livingEntity
{
    constructor(scene, x, y, speed,sprite,anim)
    {
        super(scene,x,y, sprite,speed)
        this.sprite.play(anim);
    }
    move()
    {
        this.moveRight();
    }
} 