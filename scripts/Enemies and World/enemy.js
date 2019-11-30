import { livingEntity } from "../Player and Items/player.js";
import { dummieEnemy } from "./dummieEntitties.js";

export class enemy extends livingEntity
{
    constructor(scene, x, y, speed, sprite,anim, enemyManager, health, id)
    {
        super(scene, x, y, sprite, speed, health);
        this.enemyManager = enemyManager;
        this.zone = this.createZone(scene);
        this.play(anim);
        this.findDir();                     //Encuentra una dirección aleatoria mientras no haya referencia a player
        this.scene = scene;
        this.id = id;
    }
    createZone(scene)
    {
        let zone = scene.add.zone(this.x,this.y,16*3,16*3);
        scene.physics.add.existing(zone);
        zone.body.debugBodyColor = "0xFFFF00"
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
} 


export class zombie extends enemy
{
    constructor (scene, x, y, enemyManager, id) //las coordenadas x e y deben venir en rango [0-8]. Señalando las celdas correspondientes
    {
        let anim = "idleZ";
        let speed = 10;
        let sprite = "zombie_idle0";
        super(scene, 24 + x*16, 24 + y*16, speed,sprite,anim, enemyManager, { maxHealth : 4 }, id);
   }


}

export class enemyManager
{
    constructor(enemies=undefined)
    {
        if(enemies===undefined){this.enemies = new Array();} //Este array de enemigos contendrá lo necesario para invocar a cada enemigo en cada habitación antes de que se invoquen. Y al invocarlos a los mismos enemigos
        else this.enemies=enemies;
        this.summoned =false;
    }
    addEnemy(enemy)
    {
        let id = this.enemies.push(enemy) - 1; //La posición en el array
        this.enemies[id].id = id;
    }
    hideAllAlive()
    {
        for(let i=0; i<this.enemies.length;i++) 
        {
            this.enemies[i].hide();
        }
    }
    showAllAlive()
    {
        for(let i = 0; i < this.enemies.length;i++) 
        {
            this.enemies[i].show();
        }
    }
    removeEnemy(enemy)
    {
        this.enemies.splice(this.enemies.indexOf(enemy),1);
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

    summonEnemies(scene, hero, weapon, walls)
    {
        if(!this.summoned)
        {
            this.summoned = true;
            for(let i = 0; i<this.enemies.length;i++)
            {
                this.enemies[i] = this.summon(this.enemies[i], scene, hero, weapon, walls, i)
            }
        }
        else 
        {
            for(let i = 0; i<this.enemies.length;i++)
            {
                this.enemies[i].show();
            }
        }

    }

    summon(enemy, scene, hero, weapon, walls, id)
    {
        switch (enemy.type)
        {
            case "zombie":
            let z;
            z = new zombie(scene, enemy.pos.x, enemy.pos.y, this, id);                              //paserle una referencia del manager al zombie para que cuando se destruya este se entere
            scene.physics.add.overlap(weapon, z, () => hero.attack(z,weapon.damage));                               //
            scene.physics.add.overlap(hero, z.zone, () => z.spotPlayer(hero),null,scene);       //
            scene.physics.add.collider(z, walls);                                               // TODO: En un mundo ideal se le pasará un objeto config a la constructora de zombie con todo esto
            scene.physics.add.collider(z, hero);                                                //       que se encargará de crear todas las colisiones correspondientes y quedará mucho más limpio
            z.body.setCollideWorldBounds(true);                                                 //       aquí.
            return z;

        default:
            console.log("No se puede crear un enemigo de tipo " + enemy.subtype);
            break;
        }
    }
    summonDummyEnemies(scene)
    {
        this.summoned = true;
            for(let i = 0; i<this.enemies.length;i++)
            {
                this.enemies[i] = this.summonDummy(this.enemies[i],scene,i)
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