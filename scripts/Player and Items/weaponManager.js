export default class weaponManager
{
    constructor(player)
    {
        let scene = player.scene;
        let Sword  = player.inventory.Sword;
        let Bow    = player.inventory.Bow;
        let Shield = player.inventory.Shield;

        let SwordObject = scene.add.sprite(0,0,Sword.Sprite.ID);
        SwordObject.scale = Sword.Sprite.Scale;
        scene.add.existing(SwordObject);
        scene.physics.add.existing(SwordObject);
        SwordObject.body.setEnable(true);
        SwordObject.body.setSize(1,1);

        let BowObject = scene.add.sprite(0,0,Bow.Sprite.ID);
        BowObject.scale = Bow.Sprite.Scale;
        scene.add.existing(BowObject);
        scene.physics.add.existing(BowObject);
        BowObject.body.setEnable(true);
        BowObject.body.setSize(1,1);

        let ShieldObject = scene.add.sprite(0,0,Shield.Sprite.ID);
        ShieldObject.scale = Shield.Sprite.Scale;
        scene.add.existing(ShieldObject);
        scene.physics.add.existing(ShieldObject);
        ShieldObject.body.setEnable(true);
        ShieldObject.body.setSize(1,1);


        this.SwordObject  = SwordObject;
        this.BowObject    = BowObject;
        this.ShieldObject = ShieldObject;
        this.weapon       = this.SwordObject;
        this.weapon.damage = Sword.Effect.Data.Quantity;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scene   = scene;
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
            let vertical;
            let size
            let vsize = 
            {
                x: 14, 
                y: 32, 
            }
            let hsize = 
            {
                x: 32, 
                y: 14, 
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
                    angle=-90; 
                    break;
            }
            this.weapon.body.setSize(size.x,size.y);
            this.weapon.setAngle(angle); 

            this.showWeapon(true);
            socket.emit("playerAttack", {angle: angle, offsetX: this.offsetX, offsetY:this.offsetY});
            this.scene.time.delayedCall(1000,   this.haveAttacked,[],this)
            this.scene.time.delayedCall(1000,   ()=> this.attacking=false);
        }
    }
    showWeapon(bool)
    {
        this.weapon.body.setEnable(bool);
        this.weapon.body.debugShowBody=bool;
        this.weapon.setVisible(bool);
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