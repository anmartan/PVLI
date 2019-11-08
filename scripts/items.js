import {itemAtlas} from "somewhere"; 
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
        Target    :   "self" || "other"           -> Si es una poción o el radar usar "self", de lo contrario es un proyectil y se debe usar "other"
        Data      :   number || Object            -> Si es una poción numer es la vida a aumentar, si es un radar number es -1, si es un proyectil Data es un objeto como el siguiente 
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


function getItemFromAtlas(ItemName)
{
    return itemAtlas[ItemName];
}
//  Todo inventario guardará referencia a todos los tipos de objeto (de nivel 1) aunque en algunos casos guarde 0 unidades de este
class inventory
{
    constructor(gold = 100)
    {
        /*    --Moneda--    */
        this.gold = gold;

        /* Carga de objetos del Atlas */
        let potions = getItemFromAtlas("Potions").Units=0;      //  Cambiar las unidades a 0 porque 
        let radar = getItemFromAtlas("Radar").Units=0;          //  por defecto un inventario empieza 
        let arrows = getItemFromAtlas("Arrows").Units=0;        //  con 0 consumibles.
        let grenades = getItemFromAtlas("Grenades").Units=0;    //

        let armor  = getItemFromAtlas("Armor_1" ).Units=0;      //  Todos son item1 porque al crearun inventario 
        let sword  = getItemFromAtlas("Sword_0" );              //  se empieza con armadura y espada lvls 1 por defecto. 
        let shield = getItemFromAtlas("Shield_1").Units=0;       
        let bow    = getItemFromAtlas("Bow1").Units=0;          

        /*  --Consumibles-- */
        this.potions    = new item (potions,    this);
        this.radar      = new item(radar,       this);
        this.arrows     = new item(arrows,      this);
        this.grenades   = new item(grenades,     this);

        /*  --Estaticos--   */
        this.armor  = new item(armor,    this);
        this.sword  = new item(sword,    this);
        this.shield = new item(shield,   this);
        this.bow    = new item(bow,      this);
    }
    addConsumible(type, cuantity)
    {
        let item = getConsumibleByType(type)
        if(item!=-1)
            item.Units+cuantity;
        return item;
    }

    substractConsumible(type, cuantity=1)
    {
        let item = getConsumibleByType(type)
        if(item!=-1)
            item.Units-cuantity;
        return item;

    }
    getConsumibleByType(type)
    {
        switch(type)
        {
            case "potions":
                item = this.potions;
                return item;
            case "radar":
                item = this.radar;
                return item;
            case "arrows":
                item = this.arrows;
                return item;
            case "grenades":
                item = this.grenades;
                return item;
            case "default":
                Console.log("invalid item");
                return -1
        }
    }
    addGold(gold)
    {
        this.gold+=gold;
    }
    substractGold(gold)
    {
        if(this.gold-gold>=0)
        {
            this.gold -= gold;
            return this.gold
        }
        else return -1;         //-1 porque la resta no se ha podido realizar -> Para la implementación de la tienda que sea más sencillo comprobar si puedes o no comprar algo
    }


}
class item
{
    constructor(itemFromAtlas, Inventory)
    {
        this.consumible = itemFromAtlas.Consumible;
        this.level      = itemFromAtlas.Level;
        this.price      = itemFromAtlas.Price;
        this.units      = itemFromAtlas.Units;
        this.effect     = itemFromAtlas.Effect;
    }
    use()
    {
        if(this.consumible && this.units > 0)
        {
            if(this.effect.target = "self")
            {
                let health;
                health+= this.effect.Data;
            }
            if(this.effect.target = "other")
            {
                if(this.Data.time === -1){
                    //player.dispararFlecha(this.effect.Data)
                }
                else {
                    //player.lanzarGranada(this.effect.Data)
                }
            }
            this.unit--;
        }
        else if(!this.consumible)
        {
            if(this.effect.target);
        }
    }
    /*
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
}