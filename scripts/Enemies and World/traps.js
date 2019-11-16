
//Se encarga de transformar la información en el editor de mazmorras en trampas dentro de la habitación
export class trapManager
{
    constructor()
    {
        this.traps = new Array();
        this.created = false;
    }

    //Para añadir una nueva trampa
    AddTrap(trap)
    {
        this.traps.push(trap);
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
                let spiky= new spikes(scene, trap.pos.x, trap.pos.y, this);
                scene.physics.add.overlap(hero, spiky.zone, ()=>spiky.Activate(), null, scene);
                scene.physics.add.collider(spiky, walls);               //Hace falta? Yo creo que no pero por si acaso XD
                return spiky;
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
    
}

export class Traps extends Phaser.GameObjects.Sprite
{
    //Una trampa es un sprite con una zona (para activarse) y un efecto
    //Hace falta decirle quién es el héroe?
    constructor(scene, x, y, spriteID, trapManager)//, hero)
    {
        super(scene, x*16 +24, y*16 +24, spriteID)
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.trapManager = trapManager;
        this.zone=this.createZone(scene)
        //this.hero=hero;
    }
    
    //Es (8,8) o (16, 16) el sprite
    createZone(scene)
    {
        let zone = scene.add.zone(this.x,this.y, 8,8);
        scene.physics.add.existing(zone);
        zone.body.debugBodyColor = "0016FF";
        return zone;
    }

    //Muestra el sprite y su zona. Crea una nueva dependencia con el nuevo héroe
    //Hace falta decirle de nuevo quién es el nuevo héroe?
    Show(hero)
    {
        this.setVisivle(true);
        this.body.setEnable(true);
        this.zone= this.createZone(this.scene);
        this.hero=hero;
    }
    
    //Oculta la trampa
    Hide()
    {
        this.setVisivle(false);
        this.body.setEnable(false);
        this.hero=undefined;            //    Para que no active trampas desde otra habitación  //
        this.zone.destroy();            //                                                      //
    }

    //Cuando una trampa se activa: hace lo que tiene que hacer y se desactiva para que no vuelva a activarse
    Activate()
    {
        this.effect();
        this.Deactivate();
    }

    //Desactiva la trampa: tanto si se ha activado ya su efecto como si se ha detectado con un radar
    Deactivate()
    {
        this.zone.destroy();
        this.hero=undefined;
        this.trapManager.RemoveTrap(this);
        this.body.destroy();
        this.destroy();
        console.log ("Trampa desactivada :D");
    }
}

export class spikes extends Traps
{
    constructor(scene, x, y, trapsManager)
    {
        let anim = "spikesAnim";
        let sprite = "spikes";
        super(scene, x, y, sprite, trapsManager);
    }
    effect()
    {console.log("Has activado spkies trap")}
}