


export default class weaponManager
{
    constructor(player)
    {
        let scene         = player.scene;
        let Sword         = player.inventory.Sword;
        let Bow           = player.inventory.Bow;
        let Shield        = player.inventory.Shield;
        this.NormalArrows = player.inventory.Arrow1.Units;       //number of normal arrows
        this.FireArrows   = player.inventory.Arrow2.Units;   //number of fire arrows
        this.Grenades     = player.inventory.Grenade.Units;     //amount of grenades
        this.Radars       = player.inventory.Radar.Units;       //amount of radars
        
        let SwordObject = scene.add.sprite(0,0,Sword.Images.Sprite);
        scene.add.existing(SwordObject);
        scene.physics.add.existing(SwordObject);
        SwordObject.body.setEnable(true);
        SwordObject.body.setSize(1,1);
        SwordObject.setVisible(false);
        Object.assign(SwordObject,Sword);

        let BowObject = scene.add.sprite(0,0,Bow.Images.Sprite);
        scene.add.existing(BowObject);
        scene.physics.add.existing(BowObject);
        BowObject.body.setEnable(true);
        BowObject.body.setSize(1,1);
        BowObject.setVisible(false);
        BowObject.Quantity=Bow.Quantity;
        Object.assign(BowObject,Bow);


        //Si solo hay flechas de fuego, se seleccionan esas
        //Si hay flechas normales, o no hay de ningunas, son las seleccionadas por defecto.
        if(this.NormalArrows === 0 && this.FireArrows > 0) this.arrowSelected= this.FireArrows;
        else this.arrowSelected = this.NormalArrows;
        
        
        let ShieldObject = scene.add.sprite(0,0,Shield.Images.Sprite);
        scene.add.existing(ShieldObject);
        scene.physics.add.existing(ShieldObject);
        ShieldObject.body.setEnable(false);
        ShieldObject.body.setSize(player.body.width + 5, player.body.height + 5);
        ShieldObject.setVisible(false);
        Object.assign(ShieldObject,Shield);

        
        
        let weaponGroup = scene.add.group();

        
        this.NormalArrowsDamage = player.inventory.Arrow1.Damage;
        this.FireArrowsDamage   = player.inventory.Arrow2.Damage;
        this.GrenadeDamage      = player.inventory.Grenade.Damage;
        this.SwordObject        = SwordObject;
        this.BowObject          = BowObject;
        this.ShieldObject       = ShieldObject;
        this.weapon             = this.SwordObject;                 //el arma por defecto es la espada
        this.offsetX            = 0;
        this.offsetY            = 0;
        this.scene              = scene;
        this.weaponGroup = weaponGroup;
        this.weaponGroup.add(this.SwordObject);
        this.weaponGroup.add(this.BowObject);
        this.player = player;
        this.showWeapon(false);
    }
    selectWeapon(itemName)
    {
        this.weapon = this[itemName+"Object"];
    }
    haveAttacked()
    {
        this.offsetX=0;        
        this.offsetY=5;  
        socket.emit("playerHaveAttacked");
        this.showWeapon(false);
    }
    useWeapon(dir)
    {
        if(!this.attacking)
        {
            this.attacking = true;
            let angle;
            let size;
            let vsize;
            let hsize; 
            let delay;
            switch(this.weapon)
            {
                case this.SwordObject:
                    vsize=
                    {
                        x: 14, 
                        y: 32, 
                    }
                    hsize = 
                    {
                    x: 32, 
                    y: 14, 
                    }
                    delay = 1000;
                    break;

                case this.BowObject:
                    vsize = hsize={x:10,y:10};       //Hay que calcularlo dependiendo del sprite que metamos
                    delay=250;
                    break;
            }
            
            switch (dir) 
            {
                case "up":
                    this.offsetX=-2;
                    this.offsetY=-12;
                    size = vsize;
                    angle=0;
                    break;
                    case "down":
                        this.offsetX=-2;
                    this.offsetY= 12;
                    
                    size = vsize;
                    angle = 180;
                    break;
                case "right":
                    this.offsetX=12;
                    this.offsetY=2;
                    this.weapon.setFlipX(false);
                    
                    size = hsize;
                    angle=90; 
                    break;
                    case "left":
                        this.offsetX=-14;
                        this.offsetY=2;
                        this.weapon.setFlipX(true);
                    
                        size = hsize;
                        angle=270; 
                        break;
            }
            this.weapon.body.setSize(size.x,size.y);
            this.weapon.setAngle(angle); 
            
            this.showWeapon(true);
            if(this.weapon === this.BowObject)
            {
                this.shootArrow(this.offsetX, this.offsetY, angle);
            } 
            socket.emit("playerAttack", {angle: angle, offsetX: this.offsetX, offsetY:this.offsetY});
            this.scene.time.delayedCall(delay,   this.haveAttacked,[],this)
            this.scene.time.delayedCall(delay,   ()=> this.attacking=false);
        }
    }
    showWeapon(bool)
    {
        this.weapon.body.setEnable(bool);
        this.weapon.body.debugShowBody=bool;
        this.weapon.setVisible(bool);
    }
    changeWeapon(){
        
        if(!this.attacking)
        {
            if(this.weapon==this.SwordObject) this.weapon=this.BowObject;
            else this.weapon=this.SwordObject;
        }
    }
    changeArrows()
    {
        if(this.arrowSelected === this.FireArrows) this.arrowSelected = this.NormalArrows;
        else this.arrowSelected = this.FireArrows;
    }
    shootArrow(offsetX, offsetY, angle)
    {
        if(this.NormalArrows>0)
        {
            let arrow;
            
            if (this.arrowSelected === this.FireArrows && this.FireArrows > 0)
            {
                arrow = new Arrow (this.scene, this.player.x, this.player.y, angle, "fire");
                arrow.Damage = this.FireArrowsDamage;
                this.FireArrows--; 
                this.arrowSelected--;  
                this.weaponGroup.add(arrow);     //Esto hace que no se dispare dos veces la misma flecha
            }

            else if(this.arrowSelected == this.NormalArrows && this.NormalArrows > 0)
            { 
                arrow = new Arrow (this.scene, this.player.x, this.player.y, angle, "normal");
                arrow.Damage = this.NormalArrowsDamage;
                this.NormalArrows--;
                this.arrowSelected--;
                this.weaponGroup.add(arrow);     //Esto hace que no se dispare dos veces la misma flecha
            }
        }
    }

    useShield()
    {
        if(!this.attacking && this.player.shield > 0)
        {
            this.attacking = true;
            let weaponBeingUsed = this.weapon;
            this.weapon = this.ShieldObject;
            this.showWeapon(true);
            this.scene.physics.add.collider(this.scene.enemies.enemies, this.ShieldObject, ()=> {this.player.shield --;});
            this.scene.time.delayedCall (500, ()=>
            {
                this.attacking = false;
                this.showWeapon(false);
                this.weapon = weaponBeingUsed;
            });
        }
    }

    throwProjectiles(typeOfProjectile)
    {
        if(typeOfProjectile == "radar" && this.Radars > 0) 
        {
            let rad;
            rad = new Radar(this.scene, this.player.x, this.player.y);
        }
        else if(typeOfProjectile == "grenade" && this.Grenades > 0) 
        {
            let bomb;
            bomb = new Grenade (this.scene, this.player.x, this.player.y);
        }

        else console.log ("No existe ese proyectil");
    }
}

/*
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
        
        
    } 
    */
   
   class Projectile extends Phaser.GameObjects.Sprite
   {
    constructor(scene, x, y, sprite, dir, speed)
    {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.overlap(this, scene.enemies.enemies ,()=> {if(this.effect!==undefined)this.die()});
        scene.physics.add.collider(this, scene.tileMap.Walls,()=> {if(this.effect!==undefined)this.die()});
        dir-=90;
        this.scene=scene;
        switch(dir)
        {
            case(0):
            this.body.velocity.x=speed;
            this.body.velocity.y=0;
            break;
            
            case(90):
            this.body.velocity.x=0;
            this.body.velocity.y=speed;
            break;
            
            case(-90):
            this.body.velocity.x=0;
            this.body.velocity.y=-speed;
            break;
            case(180):
            this.body.velocity.x=-speed;
            this.body.velocity.y=0;
            break;
            
        }
    }
    //Las flechas se destruyen después de un tiempo o cuando colisionan con un enemigo o las paredes
    die()
    {
        if(this.effect!== undefined){ this.effect(this.scene);this.setVisible(false)}
        else this.destroy();
    }
}
class Arrow extends Projectile
{
    constructor(scene,x,y,dir, typeOfArrow)
    {
        let speed = 100;
        let sprite;
        if(typeOfArrow === "normal")
            sprite = "Arrow";
        else 
            sprite = "Arrow";
        
        super(scene, x, y, sprite, dir, speed);

        //Hay que acceder al inventario, buscar el nivel del arco, su effect, y multiplicar el tiempo por el data.quantity
        scene.time.delayedCall(250 * scene.hero.weaponManager.BowObject.Quantity,()=> this.die());
    }
    
}
class Radar extends Projectile
{
    constructor ( scene, x, y, dir=0)
    {
        let speed = 0;
        let sprite = "";
        super(scene,x, y, sprite, dir, speed); 
        
        scene.time.delayedCall(1000, () => this.die());
        
    }
    effect(scene)
    {
        this.zone = scene.add.zone (this.x, this.y, scene.game.tileSize * 2, scene.game.tileSize*2);
        scene.physics.add.existing(this.zone);
        this.zone.parent = this;
        scene.physics.add.overlap(scene.traps.traps, this.zone, (trap)=> {trap.Deactivate();});
        scene.time.delayedCall(1000, ()=>{this.zone.destroy();this.destroy()});
    }
}
class Grenade extends Projectile
{
    constructor (scene, x, y, dir=0)
    {
        let speed = 0;
        let sprite = "Bomb";
        super(scene, x, y, sprite, dir, speed);

        scene.time.delayedCall(1000, ()=> this.die());
    }
    effect(scene)
    {
        this.zone = scene.add.zone (this.x, this.y, scene.game.tileSize * 2, scene.game.tileSize*2);
        scene.physics.add.existing(this.zone);
        scene.physics.add.overlap(scene.enemies.enemies, this.zone, (enemy)=> {enemy.damage(scene.hero.weaponManager.GrenadeDamage);});
        scene.time.delayedCall(1000, ()=>{this.zone.destroy();this.destroy();});
    }
}
