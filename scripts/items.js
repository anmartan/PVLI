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

    Plantilla:

    Arco_Mega_Chachi =
    {
        Consumible: false,
        Level: 1000,
        Price: 420,
        //Units: 1,
        Effect: {}
    }

    Disclaimer -> Hazlo primero en un .js y Le pedimos ayuda a Carlos para hacer un JSON y ser chachis

*/

function getTpye(type)
{

}

class inventory
{
    constructor()
}
class item
{
    constructor(Consumible, Level =1, Price, Units=1,Effect )
    {
        getTpye(type);
    }
}
class 
{

}