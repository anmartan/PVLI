import weaponManager from './weaponManager.js';
export class livingEntity extends Phaser.GameObjects.Sprite
{
    
    constructor(scene,x,y,spriteID,speed, health)
    {
        super(scene, x, y, spriteID)
        this.speed = speed;
        this.dir = {x:0,y:0}                        //Movement direction (0,0) initial value
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        /* Sistema de vida */
        this.vulnerable =  true;
        this.health    = health.maxHealth;
        this.maxHealth = health.maxHealth;
        this.scene     = scene;


    }
    damage(points)
    {
        if(this.vulnerable && this.body !== undefined)
        {
            this.vulnerable = false;
            this.alpha = 0.75;
            this.scene.time.delayedCall(1000, this.makeVulnerable, [], this)
            this.knockback();
            this.health -= points;
            if(this.health<=0){ this.kill()};
        }
        else return "No se puede dañar al enemigo, es invulnerable"

    }
    makeVulnerable(){this.vulnerable = true, this.alpha=1;};
    heal(points)
    {
        if(this.health+=points > this.maxHealth)
            this.health=this.maxHealth;
        return this.health;
    }
    augmentMaxHealth(points)
    {
        this.health+= points;
        return this.maxHealth+=points;
    }

    move()
    {
        this.body.setVelocity(this.dir.x*this.speed,this.dir.y*this.speed)
        if(this.dir.x <0)
        {
            this.setFlipX(true);
        }
        else{
            this.setFlipX(false);

        }
    }
    attack(other, points)
    {
       other.damage(points);
    };
}



export class player extends livingEntity
{
    constructor(scene, x, y, speed,sprite, anim, sword)
    {
        super(scene,x -8 ,y, sprite,speed, {maxHealth: 6})
   
        /*----        corrigiendo collider y activando worldbounds      -----*/
        this.body.setSize(14,14);
        this.body.offset.y=14;
        this.body.setCollideWorldBounds(true);
        this.stunned = false;

        let keys = scene.add.group();

        // Lectura de input y ejecución de la animación ----> TODO: Clase teclado o input que se encargue de hacer esto más bonito
        this.key_D     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D    );
        this.key_A     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A    );
        this.key_S     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S    );
        this.key_W     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W    );
        this.key_UP    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP   );
        this.key_RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.key_DOWN  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN );
        this.key_LEFT  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT );
        this.key_TAB   = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB  );    

        this.play(anim);
        
        //Intento de meter el inventario
        this.inventory = this.scene.game.inventory;
        this.weaponManager = new weaponManager(this);
    }
    handleLogic()
    {
        if(!this.stunned)
        {
            this.weaponManager.weapon.x = this.x + 2  + this.weaponManager.offsetX;
            this.weaponManager.weapon.y = this.y + 5  + this.weaponManager.offsetY;
        
            //Teclas de movimiento, cambiar la dirección y moverse en esa direción
            if(this.key_D.isDown)
            {
                this.dir = {x:1,  y:this.dir.y}
                this.move();
            }
            if(this.key_A.isDown)
            {
                this.dir = {x:-1, y:this.dir.y}            
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
            let flip = (this.dir.x < 0);
            socket.emit("playerMove",{pos:{x:this.x,y:this.y},flip:flip});
            //Teclas de attaque, atacar en la dirección
            if(this.key_DOWN.isDown)
            {
                this.weaponManager.useWeapon("down")
            }
            if(this.key_UP.isDown)
            { 
                this.weaponManager.useWeapon("up")
            }
            if(this.key_RIGHT.isDown)
            {
                this.weaponManager.useWeapon("right")
            }
            if(this.key_LEFT.isDown)
            {
                this.weaponManager.useWeapon("left")
            }
            //Teclas para cambiar de arma
            if(Phaser.Input.Keyboard.JustDown(this.key_TAB))
            {
                this.weaponManager.changeWeapon();
            }
        }

    }
}