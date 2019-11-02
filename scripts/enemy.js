import {livingEntity} from "./player.js";
export class enemy extends livingEntity
{
    constructor(scene, x, y, speed,sprite,anim)
    {
        super(scene,x,y, sprite,speed);
        this.zone = scene.add.zone(x,y,16*3,16*3);
        scene.physics.add.existing(this.zone);
        this.zone.body.debugBodyColor = "0xFFFF00"
        this.sprite.play(anim);
        this.findDir();                     //Encuentra una dirección aleatoria mientras no haya referencia a player
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
            let dir = { x:this.player.x-this.sprite.x, y:this.player.y-this.sprite.y };
            let mod = Math.sqrt(Math.pow(dir.x,2)+Math.pow(dir.y,2))
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
            this.zone.x = this.sprite.x;
            this.zone.y = this.sprite.y;
        }
        if(this.sprite.body!==undefined)
        {
            this.move();
            this.scene.time.delayedCall(1000,this.findDir,[],this)
        }

    }
    kill()
    {
        if(this.zone!==undefined)this.zone.destroy();
        this.sprite.body.destroy();
        this.destroy();
    }

} 


export class zombie extends enemy
{
    constructor (scene, x, y)
    {
        let anim = "idleZ";
        let speed = 10;
        let sprite = "zombie_idle0";
        super(scene, x, y, speed,sprite,anim);
   }

}

export class enemyInfo
{
    constructor()
    {
        this.enemies = [];
    }
    addEnemy(enemy)
    {
        this.enemies.push(enemy);
    }
    removeEnemy(enemy)
    {
        let i = 0;
        while( i<this.enemies.length)
        {
            if(enemy === this.enemies[i])
            {
                this.enemies.slice(i);
            }
            else i++;
        }
        return i;
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
        function summon(enemy)
        {
            switch (enemy.type)
            {
                case "zombie":
                    let z;
                    z = new zombie(scene, enemy.pos.x, enemy.pos.y);
                    scene.physics.add.overlap(weapon, z, ()=> z.kill());
                    scene.physics.add.overlap(hero, z.zone, ()=> z.spotPlayer(hero.sprite),null,scene);
                    scene.physics.add.collider(z, walls);
                    scene.physics.add.collider(z, hero);
                    z.body.setCollideWorldBounds(true);
                    break;
                default:
                    console.log("No se puede crear un enemigo de tipo "+enemy.type);
                    break;

            }


        }
        this.enemies.forEach(summon);
    }

}