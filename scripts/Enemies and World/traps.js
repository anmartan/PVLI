import { dummieTrap } from "./dummieEntitties.js";
import { zombie } from "./enemy.js";

//Se encarga de transformar la información en el editor de mazmorras en trampas dentro de la habitación
export class trapManager
{
    constructor(traps = undefined)
    {
        if(traps===undefined)this.traps = new Array();
        else this.traps=traps;
        this.created = false;
    }

    //Para añadir una nueva trampa
    AddTrap(trap)
    {
        let id= this.traps.push(trap) -1;
        trap.id=id;
    }

    //Para quitar una trampa
    RemoveTrap(trap)
    {
        this.traps.splice(this.traps.indexOf(trap), 1);
    }

    //Crea todas las trampas de una habitación
    CreateTraps(scene, hero, walls)
    {
        //Si no se han creado, se crean todas
        if(!this.created)
        {
            this.created = true;
            for (let i=0; i< this.traps.length; i++)
            {
                this.traps[i] = this.Create(this.traps[i], scene, hero, walls);
            }
        }
        //Si no, se muestran las que quedan activas
        else{
            for (let i=0; i < this.traps.length; i++)
            {
                this.traps[i].show();
            }
        }
    }

    getPrice(subtypeOfTrap)
    {
        switch(subtypeOfTrap)
        {
            case "spikes":
                return 15;
            case "poison":
                return 15;
            case "stun": 
                return 20;
            case "spawn":
                return 22;
            case "teleportation":
                return 25;
        }
    }

    //Crea una sola trampa
    Create(trap, scene, hero, walls)
    {
        switch(trap.type)
        {
            case "spikes":
                let spiky= new spikes(scene, trap.pos.x, trap.pos.y, this, trap.id);
                scene.physics.add.overlap(hero, spiky.zone, ()=>spiky.Activate(), null, scene);
                spiky.setVisible(false);
                return spiky;

            case "poison":
                let poisony = new poison(scene, trap.pos.x, trap.pos.y, this, trap.id);
                scene.physics.add.overlap(hero, poisony.zone, ()=>poisony.Activate(), null, scene);
                poisony.setVisible(false);
                return poisony;
            case "stun":
                let stuny = new stun (scene, trap.pos.x, trap.pos.y, this, trap.id);
                scene.physics.add.overlap(hero, stuny.zone, ()=>stuny.Activate(), null, scene);
                stuny.setVisible(false);
                return stuny;
            case "spawn":
                let spawny = new spawn (scene, trap.pos.x, trap.pos.y, this, trap.id);
                scene.physics.add.overlap(hero, spawny.zone, ()=>spawny.Activate(), null, scene);
                spawny.setVisible(false);
                return spawny;
            default:
                console.log ("No existe esa trampita: "+ trap.subtype);
                break;

        }
    }

    //Esconde todas las trampas de una habitación que no se hayan destruido
    HideAllActive()
    {
        for(let i=0; i< this.traps.length; i++)
            this.traps[i].Hide();
    }

    //Muestra todas las trampas de una habitación que no se hayan destruido
    ShowAllActive()
    {
        for(let i=0; i<this.traps.length; i++)
            this.traps[i].Show();    
    }

    createDummyTraps(scene)
    {
        this.created = true;
            for(let i = 0; i<this.traps.length;i++)
            {
                this.traps[i] = this.createDummy(this.traps[i],scene)
            }        
    }
    createDummy(trap,scene)
    {
        
        if (trap.type == "spikes" || trap.type == "poison" || trap.type == "stun" || trap.type == "spawn")// || cell.subtype == "teleportation")
            {
                let trappy;
                trappy = new dummieTrap(scene, trap.pos.x, trap.pos.y, trap.type, this, trap.id);
            }
            else console.log("No se puede poner una trampa de tipo " + trap.type);
    }
    
}

export class Traps extends Phaser.GameObjects.Sprite
{
    //Una trampa es un sprite con una zona (para activarse) y un efecto
    constructor(scene, x, y, spriteID, trapManager, id, anim="trapAnim",enemyType="")//, hero)
    {
        super(scene, (x+1.5)*scene.game.tileSize,(y+1.5)*scene.game.tileSize, "trap")
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVisible(false);
        this.trapManager = trapManager;
        this.zone=this.createZone(scene)
        this.id=id;
        this.scene = scene;
        this.anim=anim;
    }
    
    createZone(scene)
    {
        let zone = scene.add.zone(this.x,this.y, 16,16);
        scene.physics.add.existing(zone);
        zone.body.debugBodyColor = "0016FF";
        return zone;
    }

    //Muestra el sprite y su zona. Crea una nueva dependencia con el nuevo héroe
    Show(hero)
    {
        this.setVisible(true);
        this.body.setEnable(true);
        this.zone= this.createZone(this.scene);
        this.hero=hero;
    }
    
    //Oculta la trampa
    Hide()
    {
        this.setVisible(false);
        this.body.setEnable(false);
        this.hero=undefined;            //    Para que no active trampas desde otra habitación  //
        this.zone.destroy();            //                                                      //
    }

    //Cuando una trampa se activa: hace lo que tiene que hacer y se desactiva para que no vuelva a activarse
    Activate()
    {
        this.effect(this.scene.hero);
        this.zone.destroy();
        this.setVisible(true);
        this.play(this.anim);
        this.once("animationcomplete-trapAnim",()=>this.Deactivate());
    }

    //Desactiva la trampa: tanto si se ha activado ya su efecto como si se ha detectado con un radar
    Deactivate()
    {
        socket.emit("trapDeactivated", this.id);

        this.hero=undefined;
        this.trapManager.RemoveTrap(this);
        this.body.destroy();
        this.setVisible(false);
    }
}

export class spikes extends Traps
{
    constructor(scene, x, y, trapsManager, id, enemy)
    {
        let anim = "spikesAnim";
        let sprite = "spikes";
        super(scene, x, y, sprite, trapsManager, id);
    }
    
    effect(hero) 
    {
        hero.damage(2);
    }
}

export class poison extends Traps
{
    constructor(scene, x, y, trapsManager, id)
    {
        let anim = "poisonAnim";
        let sprite = "poison";
        super(scene, x, y, sprite, trapsManager, id);
    }
    effect(hero) 
    {      
        for(let i=0; i<3; i++)
        this.scene.time.delayedCall(1000*i, ()=>
        {
            console.log("Vida héroe antes: " + hero.health);
            hero.damage(1);
            console.log("Vida héroe después: " + hero.health);
        });
    }
}

export class stun extends Traps
{
    constructor(scene, x, y, trapsManager, id)
    {
        let anim = "stunAnim";
        let sprite = "stun";
        super(scene, x, y, sprite, trapsManager, id);
    }
    effect(hero) 
    {
        hero.stunned=true;
        hero.body.velocity.x=0;
        hero.body.velocity.y=0;
        this.scene.time.delayedCall(3000, ()=> {hero.stunned=false;}, [], this);
    }
}
export class teleportation extends Traps
{
    constructor(scene, x, y, trapsManager, id)
    {
        let anim = "teleportationAnim";
        let sprite = "teleportation";
        super(scene, x, y, sprite, trapsManager, id);
    }
    effect(hero){}
}
export class spawn extends Traps
{
    constructor(scene, x, y, trapsManager, id)
    {
        let anim = "spawnAnim";
        let sprite = "spawn";
        super(scene, x, y, sprite, trapsManager, id);
        this.enemy = 
        {
            type : "spider",
            pos:{
                x: x,
                y: y
            }
        }
    }
    effect(hero)
    {
        let idEnemy= this.scene.enemies.getLastID()+1;
        this.scene.enemies.addEnemy(this.scene.enemies.summon(this.enemy, this.scene, idEnemy));
        socket.emit("enemySpawned", {enemy: this.enemy, id: idEnemy});
    }
}