export default class weaponManager {
    constructor(player) {
        let scene = player.scene;
        let Sword = player.inventory.Sword;
        let Bow = player.inventory.Bow;
        let Shield = player.inventory.Shield;

        this.Grenade = player.inventory.Grenade;
        this.Radar = player.inventory.Radar;
        this.NormalArrow = player.inventory.Arrow1;
        this.FireArrow = player.inventory.Arrow2;


        this.weaponGroup = scene.add.group();
        const createWeaponObject = function (name, weaponGroup) {
            let nameObject = scene.add.sprite(0, 0, name.Images.Sprite);
            scene.add.existing(nameObject);
            scene.physics.add.existing(nameObject);
            nameObject.body.setEnable(true);
            nameObject.body.setSize(1, 1); nameObject.body.debugShowBody = false;
            nameObject.setVisible(false);
            Object.assign(nameObject, name);
            weaponGroup.add(nameObject);
            return nameObject;
        }
        this.SwordObject = createWeaponObject(Sword, this.weaponGroup);
        this.BowObject = createWeaponObject(Bow, this.weaponGroup);
        this.ShieldObject = createWeaponObject(Shield, this.weaponGroup);
        scene.physics.add.collider(scene.enemies.enemies, this.ShieldObject, (enemy,shield) => { shield.MaxHits--;if(shield.MaxHits<0) shield.destroy();});


        //Si solo hay flechas de fuego, se seleccionan esas
        //Si hay flechas normales, o no hay de ningunas, son las seleccionadas por defecto.
        this.arrowSelected = (this.NormalArrow.Units === 0 && this.FireArrow.Units > 0) ? this.FireArrow : this.NormalArrow;

        //el arma por defecto es la espada
        this.weapon = this.SwordObject;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scene = scene;
        this.player = player;
        this.showWeapon(false);
    }
    selectWeapon(itemObject) {
        this.showWeapon(false);
        this.weapon = itemObject;
    }
    haveAttacked() {
        this.offsetX = 0;
        this.offsetY = 5;
        socket.emit("playerHaveAttacked");
        this.showWeapon(false);
    }
    useWeapon(angle) {
        if (!this.attacking) {
            const originalY = -12;
            this.attacking = true;
            let size;
            let vsize;
            let hsize;
            (this.weapon===this.SwordObject)?vsize={x:14,y:32}:(this.weapon===this.BowObject)?vsize={x:10,y:10}:vsize={x:32,y:32};
            (this.weapon===this.SwordObject)?hsize={x:32,y:14}:(this.weapon===this.BowObject)?hsize={x:10,y:10}:hsize={x:32,y:32};
            let horizontal = (angle === 90 || angle === 270);
            let upleft = (angle === 0 || angle === 270);
            horizontal ? size = hsize : size = vsize;
            horizontal ? this.offsetY = -2 : this.offsetX = 2;
            horizontal ? this.offsetX = upleft ? originalY : -originalY : this.offsetY = upleft ? originalY : -originalY
            this.weapon.setFlipX(horizontal);



            this.weapon.body.setSize(size.x, size.y);
            this.weapon.setAngle(angle);

            this.showWeapon(true);
            if (this.weapon === this.BowObject && this.arrowSelected.Units > 0) {
                this.shootArrow(angle, this.arrowSelected.Damage,this.arrowSelected.Units);
            }
            socket.emit("playerAttack", { angle: angle, offsetX: this.offsetX, offsetY: this.offsetY, weaponSprite: this.weapon.Images.Sprite });
            this.scene.time.delayedCall(this.weapon.Cooldown, this.haveAttacked, [], this)
            this.scene.time.delayedCall(this.weapon.Cooldown, () => this.attacking = false);
        }
    }
    showWeapon(bool) {
        this.weapon.body.setEnable(bool);
        this.weapon.body.debugShowBody = bool;
        this.weapon.setVisible(bool);
    }
    changeWeapon() {

        if (!this.attacking) {
            if (this.weapon === this.SwordObject && this.BowObject.Units > 0) this.selectWeapon(this.BowObject);
            else this.selectWeapon(this.SwordObject);
        }
    }
    changeArrows() {
        if (this.arrowSelected === this.FireArrow) this.arrowSelected = this.NormalArrow;
        else this.arrowSelected = this.FireArrow;
    }
    shootArrow(angle, damage,id) {
        let type = (this.arrowSelected === this.NormalArrow) ? "normal" : "fire";
        let arrow = new Arrow(this.scene, this.player.x, this.player.y, angle, type,id);
        this.arrowSelected.Units--;
        arrow.Damage = damage;
        this.weaponGroup.add(arrow);
    }

    useShield() {
        if (!this.attacking) {
            this.attacking = true;
            let weaponBeingUsed = this.weapon;
            this.weapon = this.ShieldObject;
            this.showWeapon(true);
            this.ShieldObject.body.setSize(32,32);

            this.scene.time.delayedCall(500, () => {
                this.attacking = false;
                //si nos e ha roto el escudo
                if(this.weapon.body!==undefined)this.showWeapon(false);
                this.weapon = weaponBeingUsed;
            });
        }
    }

    throwProjectiles(typeOfProjectile) {

        if (this[typeOfProjectile].Units > 0) {
            new (typeOfProjectile === "Grenade" ? Grenade : Radar) (this.scene, this.player.x, this.player.y,this[typeOfProjectile].Units);
            this[typeOfProjectile].Units--;
        }
    }
}

class Projectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite, dir, speed, prefix,id,anim) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //scene.physics.add.overlap(this, scene.enemies.enemies ,()=> {if(this.effect===undefined)this.die()});
        scene.physics.add.collider(this, scene.tileMap.Walls, () => { if (this.effect === undefined) this.die() });
        this.scene = scene;
        let _x = 0;
        let _y = 0;
        (dir === 90) ? _x = speed : (dir === 270) ? _x = -speed : (dir === 0) ? _y = -speed : _y = speed;
        this.body.setVelocity(_x, _y);
        let data = 
        {
            x:this.x,
            y:this.y,
            sprite:sprite,
            angle:0,
            id:id,
            prefix:prefix,
            anim:anim
        }
        socket.emit("newProyectile", data);
        this.id=id;
        this.prefix=prefix;
    }
    //Las flechas se destruyen después de un tiempo o cuando colisionan con un enemigo o las paredes
    die() {
        socket.emit("proyectileDead",{id:this.id,eventNamePrefix:this.prefix});
        if (this.effect !== undefined) { this.effect(this.scene); this.setVisible(false) }
        else this.destroy();
    }
    preUpdate(time, delta)
    {
        socket.emit("proyectileMove",{x:this.x,y:this.y,id:this.id,eventNamePrefix:this.prefix});
        super.preUpdate(time, delta);
    }
}
class Arrow extends Projectile {
    constructor(scene, x, y, dir, typeOfArrow,id,anim) {
        let sprite;
        if (typeOfArrow === "normal")
            sprite = "Arrow";
        else
            sprite = "Arrow";
        super(scene, x, y, sprite, dir, 100, "arrow",id,anim);
        this.setAngle(dir);
        this.destroyOnCol = true;

        //Hay que acceder al inventario, buscar el nivel del arco, su effect, y multiplicar el tiempo por el data.quantity
        scene.time.delayedCall(250 * scene.hero.weaponManager.BowObject.Distance, () => this.die());
        return this;
    }

}
class Radar extends Projectile {
    constructor(scene, x, y, dir = 0, id) {
        let speed = 0;
        let sprite = "radarEye";
        super(scene, x, y, sprite, dir, speed,"radar",id,"radarAnim");
        this.play("radarAnim");
        this.setAlpha(0.5)
        //scene.time.delayedCall(1000, () => this.die());
        this.on("animationcomplete-radarAnim", ()=>this.die());

    }
    effect(scene) {
        this.zone = scene.add.zone(this.x, this.y, scene.game.tileSize * 2, scene.game.tileSize * 2);
        scene.physics.add.existing(this.zone);
        this.zone.parent = this;
        scene.physics.add.overlap(scene.traps.traps, this.zone, (trap) => { trap.Deactivate(); });
        scene.time.delayedCall(1000, () => { this.zone.destroy(); this.destroy() });
    }
}
class Grenade extends Projectile {
    constructor(scene, x, y, dir = 0,id) {
        let speed = 0;
        let sprite = "Bomb";
        super(scene, x, y, sprite, dir, speed,"bomb",id);

        scene.time.delayedCall(1000, () => this.die());
    }
    effect(scene) {
        this.zone = scene.add.zone(this.x, this.y, scene.game.tileSize * 2, scene.game.tileSize * 2);
        scene.physics.add.existing(this.zone);
        scene.physics.add.overlap(scene.enemies.enemies, this.zone, (enemy) => { enemy.damage(this.Grenade.Damage); });
        scene.time.delayedCall(1000, () => { this.zone.destroy(); this.destroy(); });
    }
}
