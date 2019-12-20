import { livingEntity } from "../Player and Items/player.js";
import { dummieEnemy } from "./dummieEntitties.js";

export class enemy extends livingEntity {
    constructor(scene, x, y, speed, sprite, anim, enemyManager, health, id) {
        console.log("enemigo invocado");
        super(scene, (x + 1.5) * scene.game.tileSize, (y + 1.5) * scene.game.tileSize, sprite, speed, health);
        this.enemyManager = enemyManager;
        this.zone = this.createZone(scene);
        this.enemyManager.zone.add(this.zone);
        this.play(anim);
        this.findDir();                     //Encuentra una dirección aleatoria mientras no haya referencia a player
        this.scene = scene;
        this.id = id;
        this.attacking = false;             //Para que haya un cooldown y no puedan atacar constantemente
        socket.on("enemyPossesed", id => { if (id === this.id) this.possesion(); });
        this.possesed = false;
    }
    possesion() {
        this.possesed = true;
        this.enemyManager.havePossesed = true;
        this.dir.x = 0;
        this.dir.y = 0;
        this.player = undefined;
        this.setTint("0x" + "b0fdd2");
        if (this.zone !== undefined) this.zone.destroy();
        socket.on("possesedMoved", (dir) => {
            if (this.possesed && this.body !== undefined) {
                console.log("move");
                this.dir = dir;
                this.moveEnemy();
            }
        });
    }
    createZone(scene) {
        let zone = scene.add.zone(this.x, this.y, scene.game.tileSize * 3, scene.game.tileSize * 3);
        scene.physics.add.existing(zone);
        zone.body.debugBodyColor = "0xFFFF00"
        zone.parent = this;
        return zone;
    }
    spotPlayer(player) {
        this.zone.destroy();
        this.player = player;
        this.findDir();
    }
    findDir() {
        if (!this.possesed)
        {
            if (this.player !== undefined) {
                let dir = { x: this.player.x - this.x, y: this.player.y - this.y };
                let mod = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2))
                this.dir = { x: dir.x / mod, y: dir.y / mod };
            }
            else {
                let r = (Math.random() > 0.5);
                let sign;
                if (r)
                    sign = 1;
                else
                    sign = -1;
                let x = Math.random() * sign;
                let y = Math.random() * sign;
                this.dir = { x: x, y: y };
                this.zone.x = this.x;
                this.zone.y = this.y;
            }
            if (this.body !== undefined) //Si no he muerto
            {
                if (!this.knockbacked) {
                    this.moveEnemy();
                }
                this.scene.time.delayedCall(1000, this.findDir, [], this)
            }
        }
    }
    kill() {
        if (this.zone !== undefined) this.zone.destroy();
        if (this.player !== undefined) this.player = undefined;
        this.enemyManager.removeEnemy(this);
        console.log("zombie muerto")
        socket.emit("enemyDead", this.id);
        this.destroy();
    }
    hide()  //cuando cambias de habitación los enemigos que queden vivos se deben ocultar
    {

        this.setVisible(false);
        this.body.setEnable(false);
        if (this.player !== undefined) this.player = undefined;
        if (this.zone !== undefined) this.zone.destroy();

    }
    show() //cuando entras a una habitación antigua los enemigos que quedaron vivos se deberían de mostrar
    {
        this.setVisible(true);
        this.body.setEnable(true);
        this.zone = this.createZone(this.scene);
    }
    knockback() {
        this.dir.x *= -1;
        this.dir.y *= -1;
        this.speed *= 2;
        this.moveEnemy();
        this.knockbacked = true;
        this.scene.time.delayedCall(500, () => { this.knockbacked = false; this.speed /= 2 });
    }
    moveEnemy() {
        //El mago se empezará a mover de forma diferente cuando encuentre al héroe
        if(this.specialMove !== undefined && this.player !== undefined) this.specialMove();
        this.move();
    }
    update() {
        socket.emit("enemyMove", { pos: { x: this.x, y: this.y }, flip: this.flipX, id: this.id });
    }
    attack(hero) {
        if (!this.attacking) {
            this.attacking = true;
            hero.damage(this.ATTKPoints);
            if (this.specialAttack !== undefined) this.specialAttack(hero);
            if(this.scene!==undefined)this.scene.time.delayedCall(this.coolDown, () => { this.attacking = false; });
        }
    }

    getPos() { return { x: this.x, y: this.y } }
}


export class zombie extends enemy {
    constructor(scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleZombie"
        let speed = 10;
        let sprite = "zombie";
        super(scene, x, y, speed, sprite, anim, enemyManager, { maxHealth: 3 }, id);
        this.price = 3;
        this.ATTKPoints = 1;
        this.coolDown = 2500;                                                                                                                   //coolDown para el ataque: orientativo de momento, se puede fijar para que todos tengan el mismo
    }
}

export class bee extends enemy {
    constructor(scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleBee";
        let speed = 50;
        let sprite = "bee";
        super(scene, x, y, speed, sprite, anim, enemyManager, { maxHealth: 2 }, id);
        this.price = 6;
        this.ATTKPoints = 1;
        this.coolDown = 1250;
    }

    //Al atacar, la abeja muere
    specialAttack() { this.scene.time.delayedCall(this.coolDown, () => { this.kill(); }); }
}

export class spider extends enemy {
    constructor(scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleSpider";
        let speed = 15;
        let sprite = "spider";
        super(scene, x, y, speed, sprite, anim, enemyManager, { maxHealth: 2 }, id);
        this.price = 20;
        this.ATTKPoints = 2;
        this.coolDown = 1500;
    }

    //Al morir, la araña spawnea otras arañana más pequeñas
    kill() {
        //redefinición para añadir el spawneo de arañas
        for (let i = 0; i < 5; i++)                                   //i < número de arañas que queramos spawnear. Se puede cambiar más adelante
        {
            let pos = this.getPos();
            this.scene.game.fromPixelToTile(pos);
            let x = pos.x; let y = pos.y;
            let spidy = new enemyInfo(x + Phaser.Math.RND.between(-0.25, +0.25), y + Phaser.Math.RND.between(-0.25, +0.25), "littleSpider")
            let idEnemy = this.scene.enemies.getLastID() + 1;
            this.scene.enemies.addEnemy(this.scene.enemies.summon(spidy, this.scene, idEnemy));
            socket.emit("enemySpawned", { enemy: spidy, id: idEnemy });
        }

        //kill de todos los enemigos
        if (this.zone !== undefined) this.zone.destroy();
        if (this.player !== undefined) this.player = undefined;
        this.enemyManager.removeEnemy(this);
        this.body.destroy();
        this.destroy();
        socket.emit("enemyDead", this.id);
        console.log("zombie muerto")
    }
}

export class littleSpider extends enemy {
    constructor(scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleSpider";                        //será otro sprite? O solo le vamos a cambiar la escala?
        let speed = 25;
        let sprite = "spider";
        super(scene, x, y, speed, sprite, anim, enemyManager, { maxHealth: 1 }, id);
        this.price = 0;                                 // las arañitas no se pueden crear desde el editor de mazmorras. Solo aparecen cuando muere una araña
        this.ATTKPoints = 1;
        this.coolDown = 1500;
        this.setScale(0.5);
        this.vulnerable = false;
        this.scene.time.delayedCall(1000, this.makeVulnerable());
    }
}

export class wizard extends enemy {
    constructor(scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let speed = 15;
        let anim = "idleWizard";
        let sprite = "wizard";
        super(scene, x, y, speed, sprite, anim, enemyManager, { maxHealth: 4 }, id);             //en el GDD pone 3 ptos de salud, pero me parece que todos tienen la misma salud...
        this.speed = speed;
        this.projectileSpeed = 25;
        this.scene= scene;
        this.price = 15;
        this.ATTKPoints = 1;
        this.coolDown = 2750;
    }

    // el mago ataca de otra manera
    /*specialAttack(player) {
        if (!this.attacking) {
            this.attacking = true;
            player.damage(this.ATTKPoints);
            this.scene.time.delayedCall(this.coolDown, () => { this.attacking = false; });
        }
    }*/
    
    spotPlayer(player) {
        this.zone.destroy();
        this.player = player;
        this.findDir();
        this.attack();
    }

    specialMove()
    {
        console.log(this.dir);
        this.dir.x *= -1;
        this.dir.y *= -1;
        console.log(this.dir);
    }
    attack()
    {
        if(!this.attacking)
        {
            this.attacking= true;
            
            this.ball = new wizardProjectiles(this.scene, this.x, this.y, this.dir, this.projectileSpeed, "button2", this.ATTKPoints);
            this.scene.time.delayedCall(this.coolDown, ()=> {
                this.attacking = false;
                this.attack();
            });
        }
    }
}

export class beetle extends enemy {
    constructor(scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleBeetle";
        let speed = 30;
        let sprite = "beetle";
        super(scene, x, y, speed, sprite, anim, enemyManager, { maxHealth: 6 }, id);
        console.log(this.ally);
        this.price = 10;
        this.ATTKPoints = 2;
        this.coolDown = 1750;

    }    
    findDir() 
    {
        if (!this.possesed)
        {
            console.log(this.ally);
            if(this.ally===undefined)this.ally = this.enemyManager.getRandomEnemy();
            if (this.ally !== 0 && this.ally!==undefined) 
            {
                if(this.ally.player!==undefined)
                {
                    
                    let midPoint = { x: this.ally.player.x + this.ally.x, y: this.ally.player.y + this.ally.y };
                    midPoint.x /=2;
                    midPoint.y /=2;
                    console.log(midPoint);
                    let dir = { x: midPoint.x - this.x, y: midPoint.y - this.y };
                    let mod = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2))
                    this.dir = { x: dir.x / mod, y: dir.y / mod };
                }
                else
                {
                    let dir = {x:this.ally.x-this.x, y:this.ally.y-this.y} ;
                    let mod = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2))
                    this.dir = { x: dir.x / mod, y: dir.y / mod };
                }
                if (this.body !== undefined) //Si no he muerto
                {
                    if (!this.knockbacked) {
                        this.moveEnemy();
                    }
                    this.scene.time.delayedCall(1000, this.findDir, [], this)
                }
            } 
            else
                super.findDir();
        }
    }
}
/*

Enemigo         Puntos de vida          Puntos de ataque            Velocidad           Precio

Zombie              3                           1                       Baja             3 
Abeja               1-2                         1                       Alta            5-6   
Araña               2                           2                       Baja             20
Arañita             1                           1                       Media            x
Mago                4                           3-4                     Baja            15
Escarabajo          3+3                         1-2                     Media           10
*/

export class enemyInfo {
    constructor(x, y, type) {
        this.pos = { x: x, y: y };
        this.type = type;
    }
}


export class enemyManager {
    constructor(scene, enemies = undefined) {

        /* Si nos han pasado un Array con enemyInfo entonces estamos en el dungeonRun */
        if (Array.isArray(enemies)) {
            this.scene = scene;
            this.enemies = this.scene.add.group();
            this.enemies.runChildUpdate=true;
            this.zone = this.scene.add.group();
            this.summoned = false;
            this.enemiesInfo = enemies;
        }
        else {
            this.enemiesInfo = new Array();
        }
        this.havePossesed = false;
    }
    clearEnemyGroup()
    {
        this.enemies.clear();
    }
    addEnemyInfo(enemyInfo) {
        enemyInfo.id = this.enemiesInfo.push(enemyInfo);
    }
    //Este método devuelve un enemigo que no sea de tipo beetle. Si no existe, o solo hay 1 enemigo devuelve undefined
    getRandomEnemy()
    {
        let enemies= this.enemies.getChildren().filter(e=>!(e instanceof beetle));
        if(enemies.length<1)return undefined;
        else
        {
            enemies.filter(e => e.active)
            let randomEnemy = enemies[Phaser.Math.RND.integerInRange(0, enemies.length - 1)]
            return randomEnemy;
        }
    }
    addEnemy(enemy) {
        this.enemies.add(enemy);
    }
    getLastID() { return this.enemies.getChildren().length - 1; }
    hideAllAlive() {
        this.enemies.getChildren().forEach(function (enemy) { enemy.hide(); });
    }
    showAllAlive() {
        this.enemies.getChildren().foreach(enemy, () => enemy.show());
    }
    removeEnemy(enemy) {
        this.enemies.remove(enemy);
    }
    getNth(index) {
        return this.enemies[index];
    }
    changeType(index, newType) {
        this.enemies[index].type = newType;
    }
    changePosition(index, newPos) {
        this.enemies[index].pos = newPos;
    }

    summonEnemies(scene, hero, weaponGroup, walls) {
        if (!this.summoned) {
            scene.physics.add.overlap(weaponGroup, this.enemies, (weapon, enemy) => { hero.attack(enemy, weapon.Damage);if(weapon.destroyOnCol)weapon.destroy();console.log(weapon) });                                                  //
            scene.physics.add.overlap(this.zone, hero, (zone) => zone.parent.spotPlayer(hero));                                                                           //
            scene.physics.add.collider(this.enemies, walls);                                                                                                               // TODO: En un mundo ideal se le pasará un objeto config a la constructora de zombie con todo esto
            scene.physics.add.collider(this.enemies, hero, (enemy,hero) => { enemy.attack(hero, enemy.ATTKPoints) });                                                               //       que se encargará de crear todas las colisiones correspondientes y quedará mucho más limpio

            this.summoned = true;
            for (let i = 0; i < this.enemiesInfo.length; i++) {
                this.addEnemy(this.summon(this.enemiesInfo[i], scene, i));
            }
        }
        else {
            this.showAllAlive();
        }

    }

    summon(enemyInfo, scene, id) {

        //El default es el beetle: no se puede crear un enemigo que no existe así que TIENE QUE HABER un default para dejar esto en una sola línea
     return (new (enemyInfo.type === 'zombie' ? zombie :enemyInfo.type === 'spider' ? spider : enemyInfo.type === 'littleSpider' ? littleSpider : enemyInfo.type === 'bee' ? bee : enemyInfo.type === 'wizard' ? wizard :  beetle)(scene, enemyInfo.pos.x, enemyInfo.pos.y, this, id))
    }
    
    summonDummyEnemies(scene) 
    {
        this.summoned = true;
        //this.enemiesInfo.forEach(function(enemy){this.summonDummy(enemy, scene, enemy.id);});
        for (let i = 0; i < this.enemiesInfo.length; i++) {
            let enemy = this.summonDummy(this.enemiesInfo[i], scene, i);
            this.addEnemy(enemy);

        }
    }
    summonDummy(enemy, scene, i) 
    {

        if (enemy.type === "zombie" || enemy.type === "bee" || enemy.type === "beetle" || enemy.type === "spider" || enemy.type === "littleSpider" || enemy.type === "wizard") {
            console.log(enemy.type + " " + enemy.pos.x + " " + enemy.pos.y)
            let dummie;
            let name = enemy.type;
            name = name[0].toUpperCase() + name.slice(1);
            dummie = new dummieEnemy(scene, enemy.pos.x, enemy.pos.y, enemy.type, "idle" + name, this, i);
            return dummie;
        }
        console.error("No se puede crear un enemigo de tipo " + enemy.subtype);
        return 0;
    }
    static prices() 
    {
        return{zombie:3,bee:5,spider:20,wizard:15,beetle:10}
    }
}

/* Clase nueva para los proyectiles del mago */

export class wizardProjectiles extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y, dir, speed, sprite, damage)
    {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.damage = damage;
        scene.physics.add.collider(this, scene.tileMap.Walls, ()=> this.die());
        scene.physics.add.collider(this, scene.hero, () =>
        {
            this.scene.hero.damage(this.damage);
            this.die();
        })

        //El mago siempre dispara en dirección contraria a la que se mueve, es decir, hacia el héroe
        this.body.setVelocity((-dir.x) * speed, (-dir.y)* speed);
        this.scene.time.delayedCall(1500, () => this.die());
    }

    die()
    {
        this.setVisible(false);
        console.log("Soy invisible");
        this.destroy();
        console.log("Me he destruido");
    }
}