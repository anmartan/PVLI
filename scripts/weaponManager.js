class weaponManager
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
        SwordObject.body.setEnable(false);
        SwordObject.body.setSize(0,0);

        let BowObject = scene.add.sprite(0,0,Bow.Sprite.ID);
        BowObject.scale = Bow.Sprite.Scale;
        scene.add.existing(BowObject);
        scene.physics.add.existing(BowObject);
        BowObject.body.setEnable(true);
        BowObject.body.setSize(0,0);

        let ShieldObject = scene.add.sprite(0,0,Shield.Sprite.ID);
        ShieldObject.scale = Shield.Sprite.Scale;
        scene.add.existing(ShieldObject);
        scene.physics.add.existing(ShieldObject);
        ShieldObject.body.setEnable(true);
        ShieldObject.body.setSize(0,0);


        this.SwordObject  = SwordObject;
        this.BowObject    = BowObject;
        this.ShieldObject = ShieldObject;
        this.weapon = this.SwordObject;
    }
    selectWeapon(itemName)
    {
        this.weapon = this[itemName+"Object"];
    }
    useWeapon(dir)
    {
        if(!this.attacking)
        {
            this.attacking = true;
            let angle;
            let size = 
            {
                x: 14, 
                y: 32, 
                swap: () => 
                {
                    let aux = this.x;
                    this.x = this.y;
                    this.y = aux;
                    this.vertical = !this.vertical;
                },
                vertical: true
            }

            switch (dir) {
                case "up":
                    this.weapon.offsetX=-2;
                    this.weapon.offsetY=-12;

                    if(!size.vertical)size.swap();
                    angle=0;
                    break;
                case "down":
                    this.weapon.offsetX=-2;
                    this.weapon.offsetY= 12;

                    if(!size.vertical)size.swap();
                    angle = 180;
                    break;
                case "right":
                    this.weapon.offsetX=12;
                    this.weapon.offsetY=2;
                    this.weapon.setFlipX(false);

                    if(size.vertical)size.swap();
                    angle=90; 
                    break;
                case "left":
                    this.weapon.offsetX=-14;
                    this.weapon.offsetY=2;
                    this.weapon.setFlipX(true);

                    if(size.vertical)size.swap();
                    angle=-90; 
                    break;
            }
            this.weapon.body.setSize(size.x,size.y);
            this.weapon.setAngle(angle); 

            this.weapon.setVisible(true);
            this.scene.time.delayedCall(1000,this.haveAttacked,[],this)
            this.scene.time.delayedCall(1000,this.canAttack,[],this)
        }
    }
    enableWeapon(bool)
    {
        this.weapon.body.setEnable(bool);
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