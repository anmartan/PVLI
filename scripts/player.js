export class livingEntity extends Phaser.GameObjects.Container
{
    
    constructor(scene,x,y,spriteID,speed)
    {
        super(scene, 0, 0)
        this.speed = speed;
        this.dir = {x:0,y:0}                        //Movement direction (0,0) initial value
        let sprite = scene.add.sprite(x,y,spriteID);
        this.add(sprite);
        scene.add.existing(sprite);
        scene.physics.add.existing(sprite);
        this.body = sprite.body;
        this.sprite = sprite;
    }
    move()
    {
        this.body.setVelocity(this.dir.x*this.speed,this.dir.y*this.speed)
    }
    attack(dir){};
}



export class player extends livingEntity
{
    constructor(scene, x, y, speed,sprite, anim, sword)
    {
        super(scene,x,y, sprite,speed)
        // Lectura de input y ejecución de la animación ----> TODO: Clase teclado o input que se encargue de hacer esto más bonito
        this.key_D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_UP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.key_RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.key_DOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.key_LEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.sprite.play(anim);

        // Crea la espada ----> TODO: Sistema de inventario
        let weapon = scene.add.sprite(x,y,sword.name);
        this.add(weapon);
        this.weapon = weapon;
        this.weapon.scale = 0.5;
        scene.add.existing(this.weapon);
        scene.physics.add.existing(this.weapon);
        this.weapon.setVisible(false);
        this.weapon.body.setEnable(true);
        this.weapon.body.setSize(1,1);

        // Recolocan la espada donde debe estar dependiendo de la dirección ataque
        this.weapon.offsetX=0; 
        this.weapon.offsetY=0;



    }
    handleLogic()
    {
        //Teclas de movimiento, cambiar la dirección y moverse en esa direción
        if(this.key_D.isDown)
        {
            this.dir = {x:1,  y:this.dir.y}
            this.sprite.setFlipX(false);
            this.move();
        }
        if(this.key_A.isDown)
        {
            this.dir = {x:-1, y:this.dir.y}            
            this.sprite.setFlipX(true);
            this.move();
        }
        if(this.key_W.isDown)
        {
            this.dir = {x:this.dir.x, y:-1}
            this.move();
        }
        if(this.key_S.isDown)
        {
            this.dir = {x:this.dir.x, y:1}
            this.move();
        }
        if (this.key_A.isUp && this.key_D.isUp)    //Resetear a 0 la x si ninguna de las horizontales se presiona
        {
            this.dir = {x:0,y:this.dir.y}
            this.move();
        }
        if (this.key_W.isUp && this.key_S.isUp)   //Resetear a 0 la y si ninguna de las verticales se presiona
        {
            this.dir ={x:this.dir.x,y:0}
            this.move();
        }


        //Teclas de attaque, atacar en la dirección
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

    canAttack() //Este método se llama desde attack con un delay. Es para tener un cooldown en el ataque
    {
        this.attacking = false;  
    }

    haveAttacked() //Durante el tiempo de recarga del ataque, mientras el jugador no puede atacar y ya a atacado se esconde la espada y se reduce su collision box.
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
            switch (dir) {
                case "up":
                    this.weapon.offsetX=-2;
                    this.weapon.offsetY=-12;
                    this.weapon.body.setSize(14,32);
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
                    this.weapon.offsetY=2;
                    this.weapon.body.setSize(32,14);
                    this.weapon.setAngle(90); 
                    this.weapon.setFlipX(false);
                    break;
                case "left":
                    this.weapon.offsetX=-14;
                    this.weapon.offsetY=2;
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