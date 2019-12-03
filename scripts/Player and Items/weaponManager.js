class Arrow extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,dir)
    {
        super(scene,x,y,"pink2")
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true,()=> {this.kill()});
        scene.physics.add.collider(this, scene.enemies, (enemy)=>{enemy.damage(1); this.kill();});                                                               //       que se encargará de crear todas las colisiones correspondientes y quedará mucho más limpio
        dir-=90;
        switch(dir)
        {
            case(0):
            this.body.velocity.x=10;
            this.body.velocity.y=0;
            break;

            case(90):
            this.body.velocity.x=0;
            this.body.velocity.y=10;
            break;

            case(-90):
            this.body.velocity.x=0;
            this.body.velocity.y=-10;
            break;
            case(180):
            this.body.velocity.x=-10;
            this.body.velocity.y=0;
            break;

        }
    }
    kill()
    {
        console.log("Me destruyo :D");
    }
}



export default class weaponManager
{
    constructor(player)
    {
        let scene        = player.scene;
        let Sword        = player.inventory.Sword;
        let Bow          = player.inventory.Bow;
        let Shield       = player.inventory.Shield;
        this.NormalArrows = player.inventory.Arrow.Units;    //number of normal arrows
        this.FireArrows   = player.inventory.ArrowFire.Units;//number of fire arrows

        let SwordObject = scene.add.sprite(0,0,Sword.Sprite.ID);
        SwordObject.scale = Sword.Sprite.Scale;
        scene.add.existing(SwordObject);
        scene.physics.add.existing(SwordObject);
        SwordObject.body.setEnable(true);
        SwordObject.body.setSize(1,1);
        SwordObject.setVisible(false);
        SwordObject.Damage=Sword.Damage;

        let BowObject = scene.add.sprite(0,0,Bow.Sprite.ID);
        BowObject.scale = Bow.Sprite.Scale;
        scene.add.existing(BowObject);
        scene.physics.add.existing(BowObject);
        BowObject.body.setEnable(true);
        BowObject.body.setSize(1,1);
        BowObject.setVisible(false);
        BowObject.Damage=Bow.Damage;


        let ShieldObject = scene.add.sprite(0,0,Shield.Sprite.ID);
        ShieldObject.scale = Shield.Sprite.Scale;
        scene.add.existing(ShieldObject);
        scene.physics.add.existing(ShieldObject);
        ShieldObject.body.setEnable(true);
        ShieldObject.body.setSize(1,1);
        ShieldObject.setVisible(false);
        ShieldObject.Damage=Shield.Damage;


        
        //meto aquí las flechas???
        //La idea es que cuando se compren, se metan en este grupo y se saquen cuando se destruyan
        let weaponGroup = scene.add.group();
       
        this.NormalArrowsDamage = player.inventory.Arrow.Damage;
        this.FireArrowsDamage = player.inventory.ArrowFire.Damage;
        this.SwordObject  = SwordObject;
        this.BowObject    = BowObject;
        this.ShieldObject = ShieldObject;
        this.weapon       = this.SwordObject;
        //this.weapon.damage = Sword.Effect.Data.Quantity;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scene   = scene;
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
            if(this.weapon === this.BowObject) this.shootArrow(this.offsetX, this.offsetY, angle);
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


    shootArrow(offsetX, offsetY, angle)
    {
        if(this.NormalArrows>0)
        {
            let arrow = new Arrow(this.scene,this.player.x, this.player.y, angle);
            arrow.Damage=this.NormalArrowsDamage;
            this.weaponGroup.add(arrow);     //Esto hace que no se dispare dos veces la misma flecha
            this.NormalArrows--;
        }
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