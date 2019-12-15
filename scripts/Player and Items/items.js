import {itemAtlas} from "./itemAtlas.js"; 
/*
    En este atlas se guardará toda la información referente a los objetos para poder instanciarlos en el inventario
    El formato a seguir será el siguiente:
    ID del Objeto = 
        Consumible: True or False dependiendo del caso
        Level: Si es un objeto con varios niveles se definirá cada uno con su nivel correspondiente, si no tiene no hace falta poner Level: 1
        Price: Precio del objeto o pack si se venden varias unidades juntas
        Units: Si el objeto se vende por unidad única (todo menos las flechas) no hace falta específicar. De lo contrario dar un número
        Effect: Es un objeto que contiene lo necesario para utilizar cada objeto. En las plantillas vienen ejemplos de cómo crearlo

    Plantillas:

    Arco_Mega_Chachi =
    {
        Consumible: false,
        Level: 1000,
        Price: 420,
        //Units: 1,
        Effect: {}
    }

    (Consumible)
    Effect: 
    {
        Target    :   "self" || "other"           -> Si es una poción o el Radar usar "self", de lo contrario es un proyectil y se debe usar "other"
        Data      :   number || Object            -> Si es una poción numer es la vida a aumentar, si es un Radar number es -1, si es un proyectil Data es un objeto como el siguiente 
            {
                maxDistance : number        -> Distancia en casillas máxima que puede viajar
                speed       : number
                damage      : number
                time        : number || -1  -> Si es una bomba el número sera el tiempo que tarda en explotar, si es una flecha -1
            }
    }

    (!Consumible)
    Effect:
    {
        Target    :   "self" || "other" -> Si es un arma "other" de lo contrario "self"
        Data      :    
            {
                Attribute   :    "health" || "damage" || "speed" || -1   -> en orden son para Armaduras || Armas || Botas || Escudos
                Cuantity    :    positive number                         -> cantidad de vida/daño/velocidad del atributo (golpes que aguanta en el caso del escudo)
                Cooldown    :    positive number                         -> Cantidad de tiempo para poder volver a utilizar el arma/escudo || Tiempo de inmunidad con la armadura || Opcional para las botas
            }
    }
    Disclaimer -> Hazlo primero en un .js y Le pedimos ayuda a Carlos para hacer un JSON y ser chachis

*/


//  Todo inventario guardará referencia a todos los tipos de objeto (de nivel 1) aunque en algunos casos guarde 0 unidades de este
export class inventory
{
    constructor(gold = 0)
    {
        /*    --Moneda--    */
        this.gold = gold;

        /* Carga de objetos del Atlas */
        let Potion = itemAtlas["Potion"];               
        let Radar = itemAtlas["Radar"];                 
        let Arrow = itemAtlas["Arrow_1"];          
        let ArrowFire = itemAtlas["Arrow_2"];          
        let Grenade = itemAtlas["Grenade"];             

        let Armor  = itemAtlas["Armor_1" ];              
        let Sword  = itemAtlas["Sword_0" ];             
        let Shield = itemAtlas["Shield_1"];       
        let Bow    = itemAtlas["Bow_1"];          

        Sword.Units=1; //  se empieza con espada lvl 0 por defecto.
        /*  --Consumibles-- */
        this.Potion    = new item (Potion,    this);
        this.Radar      = new item(Radar,       this);
        this.Arrow     = new item(Arrow,      this);
        this.ArrowFire     = new item(ArrowFire,      this);
        this.Grenade   = new item(Grenade,     this);

        /*  --Estaticos--   */
        this.Armor  = new item(Armor,    this);
        this.Sword  = new item(Sword,    this);
        this.Shield = new item(Shield,   this);
        this.Bow    = new item(Bow,      this);
    }
    addConsumible(type, cuantity)
    {
        let item = this[type];
        if(item!==undefined)
            item.Units+=cuantity;
        return item;
    }

    substractConsumible(type, cuantity=1)
    {
        let item = this[type];
        if(item!==undefined && item.Units > 0)
        {
            item.Units-=cuantity;
        }
        return item;
    }
    addGold(gold)
    {
        this.gold+=gold;
    }
    substractGold(gold)
    {
        if(this.gold-gold >= 0)
        {
            this.gold -= gold;
            return this.gold
        }
        else return -1;         //-1 porque la resta no se ha podido realizar -> Para la implementación de la tienda que sea más sencillo comprobar si puedes o no comprar algo
    }
    upgradeItem(type)
    {
        if(this[type].Level < 3)
        {
            let newLevel = this[type].Level+1;
            let newItem = itemAtlas[type+"_"+newLevel];
            newItem.Units = 1;
            return this[type] = new item(newItem, this);
        }
        else
            throw("No se puede upgradear");
    }
}
class item
{
    constructor(itemParams, Inventory)
    {
        this.Consumible = itemParams.Consumible;
        this.Price      = itemParams.Price;
        this.Effect     = itemParams.Effect;
        if(itemParams.Sprite===undefined)
        {
            this.Sprite={ID:""};
        }
        else this.Sprite =  itemParams.Sprite;
        if(itemParams.Level===undefined)
        {
            this.Level = 1;
        }
        else this.Level = itemParams.Level;

        if(itemParams.Units===undefined)
        {
            this.Units = 0;
        }
        else this.Units = itemParams.Units;


        if(!this.Consumible&&this.Effect.Target === "other" && this.Effect.Data.Attribute==="damage")
        {
            console.log("Daño"+this.Damage)
            this.Damage = itemParams.Effect.Data.Quantity;
            //player.attack(data);
            //esto va a doler programarlo y mucho, tengo la sensación xD
        }
        else if(!this.Consumible && this.Effect.Target === "other" && this.Effect.Data.Attribute === "distance")
        {
            console.log("soy un arco");
            console.log(this.Effect.Data.Quantity)
            this.Quantity = this.Effect.Data.Quantity;
        }
        else if(this.Consumible&&itemParams.Effect.Target === "other")
        {
            this.Damage=this.Effect.Data.damage;
            console.log("Daño"+this.Damage)
        }
        else if(this.Consumible && itemParams.Effect.Target === "self")
        {
            this.Quantity = this.Effect.Data;
        }

    }
    use()
    {
        if(this.Consumible && this.Units > 0)
        {
            let data=this.Effect.Data;
            if(this.Effect.target === "self")
            {
                let health;
                health+= this.Effect.Data;
            }
            if(this.Effect.target === "other")
            {
                if(data.time === -1){
                    //player.dispararFlecha(data)
                }
                else {
                    //player.lanzarGranada(data)
                }
            }
            return this.Units--;
        }
        
    }
    //método muy tonto que se utiliza para el escudo únicamente
    breakItem()
    {
        this;
    }
}