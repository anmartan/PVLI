export const itemAtlas = 
{
    Sword_1 :
    {
        Consumible: false,
        Level: 1,
        Price: 15,
        //Units: 1,
        //+1 pto ataque
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity:1,
                Cooldown:0
            }
        }    
    },
    
    Sword_2 :
    {
        Consumible: false,
        Level: 2,
        Price: 30,
        //Units: 1,
        //+2 pto ataque
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity:2,
                Cooldown:0
            }
        }  
    
    },
    //Cómo indicamos el daño de área aquí????
    Sword_3 :
    {
        Consumible: false,
        Level: 3,
        Price: 60,
        //Units: 1
        //daño de área
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                //Quantity:1,
                Cooldown:0
            }
        }  
    
    },
    
    Armor_1 :
    {
        Consumible: false,
        Level: 1,
        Price: 20,
        //Units: 1,
        // +2 pto vida
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "health",
                Quantity: 2,
                Cooldown: 0
            }
        }
    
    },
    Armor_2 :
    {
        Consumible: false,
        Level: 2,
        Price: 40,
        //Units: 1,
        // +4 pto vida
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "health",
                Quantity: 4,
                Cooldown: 0
            }
        }
    
    },
    Armor_3 :
    {
        Consumible: false,
        Level: 3,
        Price: 80,
        //Units: 1,
        // +6 pto vida
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "health",
                Quantity: 6,
                Cooldown: 0
            }
        }
    
    },
    Bow_1 :
    {
        Consumible: false,
        Level: 1,
        Price: 15,
        //Units: 1,
        // vel carga :2 s, alcance : 4 jugadores.
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                //Quantity: 4,
                Cooldown: 2
            }
        }
    
    },
    Bow_2 :
    {
        Consumible: false,
        Level: 2,
        Price: 30,
        //Units: 1,
        // vel carga :1.5 s, alcance : 6 jugadores.
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                //Quantity: 6,
                Cooldown: 1.5
            }
        }
    
    },
    Bow_3 :
    {
        Consumible: false,
        Level: 3,
        Price: 60,
        //Units: 1,
        // vel carga :1 s, alcance : 8 jugadores.
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                //Quantity: 8,
                Cooldown: 1
            }
        }
    
    },
    Shield_1 :
    {
        Consumible: true,
        Level: 1,
        Price: 20,
        //Units: 1
        //blocks 2 pto ataque
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: -1,
                Quantity: 2,
                Cooldown: 0
            }
        }
    
    },
    Shield_2 :
    {
        Consumible: true,
        Level: 2,
        Price: 40,
        //Units: 1
        //blocks 4 pto ataque
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: -1,
                Quantity: 4,
                Cooldown: 0
            }
        }
    },
    Shield_3 :
    {
        Consumible: true,
        Level: 3,
        Price: 80,
        //Units: 1
        //blocks 6 pto ataque
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: -1,
                Quantity: 6,
                Cooldown: 0
            }
        }
    
    },
    Boots :
    {
        Consumible: false,
        //Level: 1
        Price: 50,
        //Units: 1
        // +50% velocidad movimiento
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "speed",
                Quantity: 0.5,
                Cooldown: 0
            }
        }
    
    },
    

   Health_Potion :
    {
        Consumible: true,
        //Level: 1,
        Price:  15,
        //Units: 1
        Effect: 
        {
        Target:   "self",  
        Data:  3 
        }
    
    },
    Trap_Radar :
    {
        Consumible: true,
        //Level: 1,
        Price: 30,
        //Units: 1,
        // Detecta y desactiva las trampas en un área de una casilla alrededor del héroe
        Effect: 
        {
        Target:   "self",  
        Data:  -1 
        }
    },
    Grenade :
    {
        Consumible: true,
        //Level: 1, 
        Price: 20,
        //Units: 1,
        //+3 pto daño a los enemigos en un área de una casilla
        Effect: 
        {
            Target:   "other",  
            Data:
            {
                maxDistance : 1,
                speed       : 0,
                damage      : 3,
                time        : 1
            }
        }
    
    },
    Arrow_normal:
    {
        Consumible: true,
        //Level: 1, 
        Price: 1,
        //Units: 10,
        // +1 pto daño por flecha
        Effect:
        {
            Target: "other",
            Data:
            {
            //maxDistance: 0,
            //speed: 0
            damage: 1,
            //time: 0
            }
        }
    },
    Arrow_fire:
    {
        Consumible: true,
        //Level: 1,
        Price: 3,
        //Units: 10,
        //+2 pto daño / flecha
        Effect:
        {
            Target: "other",
            Data:
            {
            //maxDistance: 0,
            //speed: 0
            damage: 2,
            //time: 0
            }
        }
    },
    getItem: 
    function(itemName)
    {
        return this[itemName]; //no se si se puede usar this o hay que usar itemAtlas, porque el this hace cosas raras a veces
    }
}