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