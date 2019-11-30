import { dummieTrap } from "./dummieEntitties.js";

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
            
        socket.on("trapDeactivated", id =>
        {
            console.log(id);
            this.traps[id].destroyTrap();
        })

        
    }
    createDummy(trap,scene)
    {
        switch (trap.type)
        {
            case "spikes":
            {
                let spikes;
                spikes = new dummieTrap(scene,trap.pos.x,trap.pos.y, "spikes", this, trap.id);
                return spikes;
            }
            case "poison":
                {
                    let spikes;
                    spikes = new dummieTrap(scene,trap.pos.x,trap.pos.y, "poison", this, trap.id);
                    return spikes;
                }

            default:
                console.log("No se puede crear una trampa de tipo " + trap.subtype);
                break;
                
        }
    }
    
}

export class Traps extends Phaser.GameObjects.Sprite
{
    //Una trampa es un sprite con una zona (para activarse) y un efecto
    constructor(scene, x, y, spriteID, trapManager, id, enemyType="")//, hero)
    {
        super(scene, x*16 +24, y*16 +24, spriteID)
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.trapManager = trapManager;
        this.zone=this.createZone(scene)
        this.id=id;
    }
    
    //Es (8,8) o (16, 16) el sprite
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
        this.Deactivate();
    }

    //Desactiva la trampa: tanto si se ha activado ya su efecto como si se ha detectado con un radar
    Deactivate()
    {
        socket.emit("trapDeactivated", this.id);
        this.zone.destroy();
        this.hero=undefined;
        this.trapManager.RemoveTrap(this);
        this.body.destroy();
        this.destroy();
    }
}

export class spikes extends Traps
{
    constructor(scene, x, y, trapsManager, id,enemyType)
    {
        let anim = "spikesAnim";
        let sprite = "spikes";
        super(scene, x, y, sprite, trapsManager, id);
        this.enemyType = "zombie";
        this.scene = scene;
    }
    
    effect(hero) 
    {
        console.log("Soy una spiky. Hago daño al héroe");
        this.scene.enemies.addEnemy(this.enemyType);
        this.scene.enemies.summon(this.enemyType, this.scene, hero, hero.weapon, this.scene.walls, this.enemyType.id);
        this.scene.enemies.enemies[this.enemyType.id].show();
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
        for(let i=0; i<6; i++)
        this.scene.time.delayedCall(500*i, ()=>{ console.log("Hago daño al héroe");});
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
    effect() 
    {
        this.scene.hero.stunned=true;
        this.scene.hero.body.velocity.x=0;
        this.scene.hero.body.velocity.y=0;
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
    effect(){}
}
export class spawn extends Traps
{
    constructor(scene, x, y, trapsManager, id)
    {
        let anim = "spawnAnim";
        let sprite = "spawn";
        super(scene, x, y, sprite, trapsManager, id);
    }
}