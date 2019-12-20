import {itemAtlas} from "./itemAtlas.js"; 
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
        let Arrow = itemAtlas["Arrow1"];          
        let ArrowFire = itemAtlas["Arrow2"];          
        let Grenade = itemAtlas["Grenade"];             

        let Armor  = itemAtlas["Armor1" ];              
        let Sword  = itemAtlas["Sword0" ];             
        let Shield = itemAtlas["Shield1"];       
        let Bow    = itemAtlas["Bow1"];  
        let Boots  = itemAtlas["Boots"];      

        /*  --Consumibles-- */
        this.Potion    = new item (Potion);
        this.Radar      = new item(Radar);
        this.Arrow1     = new item(Arrow);
        this.Arrow2     = new item(ArrowFire);
        this.Grenade   = new item(Grenade);

        /*  --Estaticos--   */
        this.Armor  = new item(Armor);
        this.Sword  = new item(Sword, 1);
        this.Shield = new item(Shield);
        this.Bow    = new item(Bow);
        this.Boots  = new item(Boots);
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
        if(this[type].Level < 3)    //Si no has llegaod al nivel máximo
        {
            let newLevel = this[type].Level+1;
            let newItem = itemAtlas[type+newLevel];
            newItem.Units = 1;
            return this[type] = new item(newItem, this);
        }
        else
            throw("No se puede upgradear");
    }
}
class item
{
    constructor(itemParams, Units=0)
    {
        this.Units = Units;
       Object.assign(this, itemParams);
    }
    use()
    {
        this.Units--;
        if(this.Units<0)this.Units=0;
    }
    addUnits(units){this.Units+=units;}
}