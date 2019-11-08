import {itemAtlas} from "somewhere"; 
/*
    En este atlas se guardará toda la información referente a los objetos para poder instanciarlos en el inventario
    El formato a seguir será el siguiente:
    ID del Objeto = 
        Consumible: True or False dependiendo del caso
        Level: Si es un objeto con varios niveles se definirá cada uno con su nivel correspondiente, si no tiene no hace falta poner Level: 1
        Price: Precio del objeto o pack si se venden varias unidades juntas
        Units: Si el objeto se vende por unidad única (todo menos las flechas) no hace falta específicar. De lo contrario dar un número
        Effect: -> En el futuro esto será un objeto con que sea fácil de parsear para trabajar con el objeto
        pero por ahora no sé cómo definirlo.

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
        Target    :   "self" || "other"  -> Si es una poción o el radar usar "self", de lo contrario es un proyectil y se debe usar "other"
        Cuantity  :   positive number    -> Si es una poción la vida a curar, si es una flecha el daño, si es el radar poner el radio
    }

    (Others)
    Effect:
    {
        Target    :   "self" || "other" -> Si es un arma "other" de lo contrario "self"
        Cuantity  :    positive number  -> Cantidad de vida si es armadura, de daño si es un arma, número de golpes que aguanta el escudo...
        Cooldown  :    positive number  -> Cantidad de tiempo para poder volver a utilizar el arma/escudo O tiempo de inmunidad con la armadura

    }
    Disclaimer -> Hazlo primero en un .js y Le pedimos ayuda a Carlos para hacer un JSON y ser chachis

*/
Sword_1 =
{
    Consumible: false,
    Level: 1,
    Price: 15,
    //Units: 1,
    Effect: {} //+1 pto ataque

}

Sword_2 =
{
    Consumible: false,
    Level: 2,
    Price: 30,
    //Units: 1,
    Effect:{} //+2 pto ataque

}

Sword_3 =
{
    Consumible: false,
    Level: 3,
    Price: 60,
    //Units: 1
    Effect:{} //daño de área

}

Armor_1 =
{
    Consumible: false,
    Level: 1,
    Price: 20,
    //Units: 1,
    Effect:{}// +2 pto vida

}
Armor_2 =
{
    Consumible: false,
    Level: 2,
    Price: 40,
    //Units: 1,
    Effect:{}// +4 pto vida

}
Armor_3 =
{
    Consumible: false,
    Level: 3,
    Price: 80,
    //Units: 1,
    Effect:{}// +6 pto vida

}
Bow_1 =
{
    Consumible: false,
    Level: 1,
    Price: 15,
    //Units: 1,
    Effect:{}// vel carga =2 s, alcance = 4 jugadores.

}
Bow_2 =
{
    Consumible: false,
    Level: 2,
    Price: 30,
    //Units: 1,
    Effect:{}// vel carga =1.5 s, alcance = 6 jugadores.

}
Bow_3 =
{
    Consumible: false,
    Level: 3,
    Price: 60,
    //Units: 1,
    Effect:{}// vel carga =1 s, alcance = 8 jugadores.

}
Shield_1 =
{
    Consumible: true,
    Level: 1,
    Price: 20,
    //Units: 1
    Effect:{} //blocks 2 pto ataque

}
Shield_2 =
{
    Consumible: true,
    Level: 2,
    Price: 40,
    //Units: 1
    Effect:{} //blocks 4 pto ataque

}
Shield_3 =
{
    Consumible: true,
    Level: 3,
    Price: 80,
    //Units: 1
    Effect:{} //blocks 6 pto ataque

}
Boots =
{
    Consumible: false,
    //Level: 1
    Price: 50,
    //Units: 1
    Effect:{} // +50% velocidad movimiento

}
Health_Potion =
{
    Consumible: true,
    //Level: 1,
    Price:  15,
    //Units: 1
    Effect:{} //+3 pto salud

}
Trap_Radar =
{
    Consumible: true,
    //Level: 1,
    Price: 30,
    //Units: 1,
    Effect:{}// Detecta y desactiva las trampas en un área de una casilla alrededor del héroe

}
Grenade =
{
    Consumible: true,
    //Level: 1, 
    Price: 20,
    //Units: 1,
    Effect:{} //+3 pto daño a los enemigos en un área de una casilla

}
Arrow_normal=
{
    Consumible: true,
    //Level: 1, 
    Price: 1,
    //Units: 10,
    Effect:{} // +1 pto daño por flecha
}
Arrow_fire=
{
    Consumible: true,
    //Level: 1,
    Price: 3,
    //Units: 10,
    Effect:{} //+2 pto daño / flecha
}

function getItemFromAtlas(ItemName)
{
    return itemAtlas.getItem(ItemName);
}
//  Todo inventario guardará referencia a todos los tipos de objeto (de nivel 1) aunque en algunos casos guarde 0 unidades de este
class inventory
{
    constructor(gold = 0)
    {
        /*    --Moneda--    */
        this.gold = gold;

        /* Carga de objetos del Atlas */
        let potions = getItemFromAtlas("potions").Units=0;      //  Cambiar las unidades a 0 porque 
        let radar = getItemFromAtlas("radar").Units=0;          //  por defecto un inventario empieza 
        let arrows = getItemFromAtlas("arrows").Units=0;        //  con 0 consumibles.
        let grenades = getItemFromAtlas("grenades").Units=0;    //

        let armor  = getItemFromAtlas("armor1" );               //  Todos son item1 porque al crearun inventario 
        let sword  = getItemFromAtlas("sword1" );               //  se empieza con armadura y espada lvls 1 por defecto. 
        let shield = getItemFromAtlas("shield1").Units=0;       
        let bow    = getItemFromAtlas("bow1").Units=0;          

        /*  --Consumibles-- */
        this.potions    = new item (potions);
        this.radar      = new item(radar);
        this.arrows     = new item(arrows);
        this.grenades   = new item(grenades);

        /*  --Estaticos--   */
        this.armor  = new item(armor);
        this.sword  = new item(sword);
        this.shield = new item(shield);
        this.bow    = new item(bow);
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
            case "portions":
                item = this.potions;
                return item;
            case "radar":
                item = this.radar;
                return item;
            case "arrows":
                item = this.arrows;
                return item;
            case "grenades":
                item = this.pogrenadestions;
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
            if(this.target = "self")
            {

            }
            if(this.target = "other")
            {
                
            }

            this.unit--;
        }
    }
    /*(Consumible)
    Effect: 
    {
        Target    :   "self" || "other"  -> Si es una poción o el radar usar "self", de lo contrario es un proyectil y se debe usar "other"
        Cuantity  :   positive number    -> Si es una poción la vida a curar, si es una flecha el daño, si es el radar poner el radio
    }*/
}