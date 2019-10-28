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

        let weapon = scene.add.sprite(x,y,sword.name);
        this.add(weapon);
        this.weapon = weapon;
        this.weapon.scale = 0.5;
        scene.add.existing(this.weapon);
        scene.physics.add.existing(this.weapon);
        this.weapon.setVisible(false);
        this.weapon.body.setEnable(true);
        this.weapon.body.setSize(1,1);
        
        this.weapon.offsetX=0;
        this.weapon.offsetY=0;



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


        if(this.key_DOWN.isDown)
        {
            this.attack("down")
        }
        
        if(this.key_UP.isDown)
        { 
            this.attack("up")
        }
        if(this.key_RIGHT.isDown)
        {
            this.attack("right")
        }
        if(this.key_LEFT.isDown)
        {
            this.attack("left")
        }

        this.weapon.x = this.sprite.x + 2  + this.weapon.offsetX;
        this.weapon.y = this.sprite.y + 5  + this.weapon.offsetY;
        
    }
    canAttack()
    {
        this.attacking = false;
    }
    haveAttacked()
    {
        this.weapon.offsetX=0;        
        this.weapon.offsetY=5;  
        this.weapon.body.setSize(1,1);
        this.weapon.setVisible(false);
    }

    attack(dir)
    {
        if(!this.attacking)
        {
            this.attacking = true;
            let x,y; //16,16

            switch (dir) {
                case "up":
                    this.weapon.offsetX=-2;
                    this.weapon.offsetY=-12;
                    this.weapon.body.setSize(14,32);
                    this.weapon.setAngle(0); 
                    this.weapon.setAngle(0); 
                    break;
                case "down":
                    this.weapon.offsetX=-2;
                    this.weapon.offsetY= 12;
                    this.weapon.body.setSize(14,32);
                    this.weapon.setAngle(180); 
                    break;
                case "right":
                    this.weapon.offsetX=12;
                    this.weapon.offsetY=0;
                    this.weapon.body.setSize(32,14);
                    this.weapon.setAngle(90); 
                    this.weapon.setFlipX(false);
                    break;
                case "left":
                    this.weapon.offsetX=-12;
                    this.weapon.offsetY=0;
                    this.weapon.body.setSize(32,14);
                    this.weapon.setAngle(-90); 
                    this.weapon.setFlipX(true);

                    break;
            
                default:
                    break;
            }
            this.weapon.setVisible(true);

            this.scene.time.delayedCall(1000,this.haveAttacked,[],this)
            this.scene.time.delayedCall(1000,this.canAttack,[],this)
        }

    }
    
}
export class enemy extends livingEntity
{
    constructor(scene, x, y, speed,sprite,anim)
    {
        super(scene,x,y, sprite,speed);
        this.zone = scene.add.zone(x,y,16*2,16*2);
        scene.physics.add.existing(this.zone);
        this.zone.body.debugBodyColor = "0xFFFF00"
        console.log(this.zone);
        this.sprite.play(anim);
        this.dir = {x:0,y:0};
    }
    move()
    {
        this.sprite.body.setVelocity(this.dir.x*this.speed, this.dir.y*this.speed);
    }
    spotPlayer(player)
    {
        this.zone.destroy();
        this.player = player;
        this.getDir();
    }
    getDir()
    {
        try
        {
            if(this.player !== undefined)
            {
                let dir = { x:this.player.x-this.sprite.x, y:this.player.y-this.sprite.y };
                let mod = Math.sqrt(Math.pow(dir.x,2)+Math.pow(dir.y,2))
                this.dir =  {x:dir.x/mod, y:dir.y/mod};
                console.log(this.dir.x + " " + this.dir.y);
            }
            else 
            {
                /*let x = Math.floor(Math.random() * (1 - 1 + 1)) + 1;
                let y = Math.floor(Math.random() * (1 - 1 + 1)) + 1;
                this.dir = {x:this.sprite.x-x, y:this.sprite.y-y};*/
                console.log("noplayer");
            }
            this.move();
            this.scene.time.delayedCall(1000,this.getDir,[],this)
        }
        catch
        {
            console.log("I was dead, I think");
        }

    }
    kill()
    {
        this.destroy();
    }

} 