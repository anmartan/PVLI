import { livingEntity } from "../Player and Items/player.js";
import { dummieEnemy } from "./dummieEntitties.js";

export class enemy extends livingEntity
{
    constructor(scene, x, y, speed, sprite,anim, enemyManager, health, id)
    {
        super(scene, x, y, sprite, speed, health);
        this.enemyManager = enemyManager;
        this.zone = this.createZone(scene);
        this.enemyManager.zone.add(this.zone);
        this.play(anim);
        this.findDir();                     //Encuentra una dirección aleatoria mientras no haya referencia a player
        this.scene = scene;
        this.id = id;
        this.attacking = false;             //Para que haya un cooldown y no puedan atacar constantemente
    }
    createZone(scene)
    {
        let zone = scene.add.zone(this.x,this.y,16*3,16*3);
        scene.physics.add.existing(zone);
        zone.body.debugBodyColor = "0xFFFF00"
        zone.parent=this;
        return zone;
    }
    spotPlayer(player)
    {
        this.zone.destroy();
        this.player = player;
        this.findDir();
    }
    findDir()
    {
        if(this.player !== undefined)
        {
            let dir  =  { x:this.player.x-this.x, y:this.player.y-this.y };
            let mod  =  Math.sqrt(Math.pow(dir.x,2)+Math.pow(dir.y,2))
            this.dir =  {x:dir.x/mod, y:dir.y/mod};
        }
        else 
        {
            let r = (Math.random() > 0.5);
            let sign;
            if(r)
                sign = 1;
            else 
                sign = -1;
            let x = Math.random()*sign;
            let y = Math.random()*sign;
            this.dir = {x:x, y:y};
            this.zone.x = this.x;
            this.zone.y = this.y;
        }
        if(this.body!==undefined) //Si no he muerto
        {
            if(!this.knockbacked)
            {
                this.moveEnemy();
            }
            this.scene.time.delayedCall(1000,this.findDir,[],this)
        }
    }
    kill()
    {
        this.whenDie();                                             //Efecto que tienen algunos enemigos al morir. Si no tienen ninguno, el método no hará nada
        if(this.zone!==undefined)this.zone.destroy();
        if(this.player !==undefined)this.player=undefined;
        this.enemyManager.removeEnemy(this);
        this.body.destroy();
        this.destroy();
        socket.emit("enemyDead", this.id);
        console.log("zombie muerto")
    }
    hide()  //cuando cambias de habitación los enemigos que queden vivos se deben ocultar
    {
        
        this.setVisible(false);
        this.body.setEnable(false);
        if(this.player !==undefined)this.player=undefined;
        if(this.zone!==undefined)this.zone.destroy();

    }
    show() //cuando entras a una habitación antigua los enemigos que quedaron vivos se deberían de mostrar
    {
        this.setVisible(true);
        this.body.setEnable(true);
        this.zone = this.createZone(this.scene);
    }
    knockback()
    {
        this.dir.x*=-1;
        this.dir.y*=-1;
        this.speed*=2;
        this.moveEnemy();
        this.knockbacked = true;
        this.scene.time.delayedCall(500,()=> {this.knockbacked = false;this.speed/=2});
    }
    moveEnemy()
    {
        this.move();
    }
    update()
    {
        socket.emit("enemyMove", {pos:{x:this.x,y:this.y},flip:this.flipX,id:this.id});
    }
    attack()                               //Para que cada enemigo tenga un cooldown diferente, si no te gusta se puede quitar y ponerle siempre el mismo
    {
        if(!this.attacking)
        {
            this.attacking = true;
            this.attackEffect(this.player);
            this.scene.time.delayedCall(this.coolDown, ()=>{this.attacking = false;});
        }
    }
} 


export class zombie extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleZ";
        let speed = 10;
        let sprite = "zombie_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 3 }, id);
        this.price = 3; 
        this.coolDown = 2500;                                                                                                                   //coolDown para el ataque: orientativo de momento, se puede fijar para que todos tengan el mismo
   }

   attackEffect(player)
   {
       console.log ("Salud del héroe: " + player.health());
       player.damage(1);
       console.log("Estoy atacando al héroe: " + player.health);
   }
   whenDie(){}  //no hace nada
}

export class bee extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleBee";
        let speed = 50;
        let sprite = "bee_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 2 }, id);
        this.price = 6; 
        this.coolDown = 1250;
   }

   attackEffect(player)
   {
       console.log ("Salud del héroe: " + player.health());
       player.damage(1);
       console.log("Estoy atacando al héroe: " + player.health);
   }
   whenDie(){}  //no hace nada
}

export class spider extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleSpider";
        let speed = 15;
        let sprite = "spider_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 2 }, id);
        this.price = 20; 
        this.coolDown = 1500;
   }

   attackEffect(player)
   {
       console.log ("Salud del héroe: " + player.health());
       player.damage(2);
       console.log("Estoy atacando al héroe: " + player.health);
   }
   whenDie()            //multiplicación de las arañas
   {
       for(let i=0; i<5; i++)                                   //i < número de arañas que queramos spawnear. Se puede cambiar más adelante
       {
        let spidy = 
        {
            type : "littleSpider",
            pos:
            {
                x: x + Phaser.Math.RND.between(-4, +4),             //para que no todas aparezcan en el mismo sitio, y se vea que hay varias arañitas
                y: y + Phaser.Math.RND.between(-4, +4)
            }
        }
         let idEnemy= this.scene.enemies.getLastID()+1;
         this.scene.enemies.addEnemy(this.scene.enemies.summon(spidy, this.scene, hero, hero.weapon, this.scene.walls, idEnemy));
         socket.emit("enemySpawned", {enemy: spidy, id: idEnemy});
       }
   } 
}

export class littleSpider extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleSpider";                        //será otro sprite? O solo le vamos a cambiar la escala?
        let speed = 25;
        let sprite = "spider_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 1 }, id);
        this.price = 0;                                 // las arañitas no se pueden crear desde el editor de mazmorras. Solo aparecen cuando muere una araña
        this.coolDown = 1500;
   }

   attackEffect(player)
   {
       console.log ("Salud del héroe: " + player.health());
       player.damage(1);
       console.log("Estoy atacando al héroe: " + player.health);
   } 
   whenDie(){};     //no hace nada
}

export class wizard extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleSpider";
        let speed = 15;
        let sprite = "spider_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 4 }, id);             //en el GDD pone 3 ptos de salud, pero me parece que todos tienen la misma salud...
        this.price = 15; 
        this.coolDown = 2750;
   }

   attackEffect(player)
   {
       console.log ("Salud del héroe: " + player.health());
       player.damage(3);
       console.log("Estoy atacando al héroe: " + player.health);
   }
   whenDie(){}      //no hace nada
}

export class beetle extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleSpider";
        let speed = 30;
        let sprite = "spider_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 6 }, id);
        this.price = 10; 
        this.coolDown = 1750;
   }

   attackEffect(player)
   {
       console.log ("Salud del héroe: " + player.health());
       player.damage(2);
       console.log("Estoy atacando al héroe: " + player.health);
   }
   whenDie(){}      //no hace nada
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

export class enemyInfo
{
    constructor(x,y,type)
    {
        this.pos  = {x:x,y:y};
        this.type = type;
    }
}


export class enemyManager
{
    constructor(scene,enemies=undefined)
    {
        //if(enemies===undefined){this.enemies = new Array();} //Este array de enemigos contendrá lo necesario para invocar a cada enemigo en cada habitación antes de que se invoquen. Y al invocarlos a los mismos enemigos
        //else this.enemies=enemies;

        /* Si nos han pasado un Array con enemyInfo entonces estamos en el dungeonRun */
        if(Array.isArray(enemies))
        {
            this.scene=scene;
            this.enemies = this.scene.add.group();       
            this.zone = this.scene.add.group();       
            this.summoned = false;
            this.enemiesInfo= enemies;
            console.log("aaaaaaaaaaaaaaaaaaaa");
        }
        else 
        {
            this.enemiesInfo = new Array();
        }
    }
    addEnemyInfo(enemyInfo)
    {
        //let id = this.enemies.push(enemy) - 1; //La posición en el array
        //this.enemies[id].id = id;
        enemyInfo.id=this.enemiesInfo.push(enemyInfo);
    }
    addEnemy(enemy)
    {
        this.enemies.add(enemy);
    }
    getLastID(){return this.enemies.getChildren().length-1;}
    hideAllAlive()
    {
       let enemies= this.enemies.getChildren();
    }
    showAllAlive()
    {
        this.enemies.getChildren().foreach(enemy, ()=>enemy.show());

    }
    removeEnemy(enemy)
    {
        this.enemies.remove(enemy);
    }
    getNth(index)
    {
        return this.enemies[index];
    }
    changeType(index, newType)
    {
        this.enemies[index].type = newType;
    }
    changePosition(index, newPos)
    {
        this.enemies[index].pos = newPos;
    }

    summonEnemies(scene, hero, weaponGroup, walls)
    {
        if(!this.summoned)
        {
            scene.physics.add.overlap(weaponGroup, this.enemies, (weapon, enemy) => {hero.attack(enemy, weapon.Damage)});         //
            scene.physics.add.overlap(this.zone, hero , (zone) => zone.parent.spotPlayer(hero));                  //
            scene.physics.add.collider(this.enemies, walls);                                                              // TODO: En un mundo ideal se le pasará un objeto config a la constructora de zombie con todo esto
            scene.physics.add.collider(this.enemies, hero);                                                               //       que se encargará de crear todas las colisiones correspondientes y quedará mucho más limpio
    
            this.summoned = true;
            for(let i = 0; i<this.enemiesInfo.length;i++)
            {
                this.addEnemy(this.summon(this.enemiesInfo[i], scene, hero, weaponGroup, walls, i));
            }
        }
        else 
        {
            this.showAllAlive();
        }

    }

    summon(enemyInfo, scene, hero, weapon, walls, id)
    {
        switch (enemyInfo.type)
        {
            case "zombie":
            let z;
            z = new zombie(scene, enemyInfo.pos.x, enemyInfo.pos.y, this, id);                              //paserle una referencia del manager al zombie para que cuando se destruya este se entere
            return z;

        default:
            console.log("No se puede crear un enemigo de tipo " + enemyInfo.type);
            break;
        }
    }
    summonDummyEnemies(scene)
    {
        this.summoned = true;
        //this.enemiesInfo.forEach(function(enemy){this.summonDummy(enemy, scene, enemy.id);});
        for(let i = 0; i<this.enemiesInfo.length;i++)
        {
            this.enemies[i] = this.summonDummy(this.enemiesInfo[i],scene,i)
        }
        socket.on("enemyMove", data =>
        {
            this.enemies[data.id].move(data.pos, data.flip);
        })
        socket.on("enemyDead", id =>
        {
            this.enemies[id].killDumie();
        }) 
    }
    summonDummy(enemy,scene,i)
    {
        switch (enemy.type)
        {
            case "zombie":
            {
                let zombie;
                zombie = new dummieEnemy(scene,enemy.pos.x,enemy.pos.y,"zombie_idle0","idleZ",this,i);
                return zombie;
            }

            default:
                console.log("No se puede crear un enemigo de tipo " + enemy.subtype);
                break;
                
        }
    }
}