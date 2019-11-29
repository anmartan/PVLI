export const itemAtlas = 
{
    Sword_0 :
    {
        Consumible: false,
        Level: 0,
        Price: 0,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity:1,
                Cooldown:0
            }
        },
        Sprite:
        {
            ID : "Sword_0",
            Scale: 0.5,
        }    
    },
    Sword_1 :
    {
        Consumible: false,
        Level: 1,
        Price: 15,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity:2,              //+2 pto ataque
                Cooldown:0
            }
        },
        Sprite:
        {
            ID : "Sword_1",
            Scale: 0.5,
        }    
    },
    
    Sword_2 :
    {
        Consumible: false,
        Level: 2,
        Price: 30,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity:3,             //+2 pto ataque
                Cooldown:0
            }
        },
        Sprite:
        {
            ID : "Sword_2",
            Scale: 0.5,
        }  
    
    },
    //Cómo indicamos el daño de área aquí????
    Sword_3 :
    {
        Consumible: false,
        Level: 3,
        Price: 60,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity:3,
                Cooldown:0
                //daño de área
            }
        },
        Sprite:
        {
            ID : "Sword_3",
            Scale: 0.5,
        }  
    
    },
    
    Armor_1 :
    {
        Consumible: false,
        Level: 1,
        Price: 20,
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "health",
                Quantity: 2,        // +2 pto vida máxima
                Cooldown: 0
            }
        }
    
    },
    Armor_2 :
    {
        Consumible: false,
        Level: 2,
        Price: 40,
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "health",
                Quantity: 4,        // +4 pto vida máxima
                Cooldown: 0
            }
        }
    
    },
    Armor_3 :
    {
        Consumible: false,
        Level: 3,
        Price: 80,
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "health",
                Quantity: 6,        // +6 pto vida máxima
                Cooldown: 0
            }
        }
    
    },
    Bow_1 :
    {
        Consumible: false,
        Level: 1,
        Price: 15,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity: 4, // Alcance: 4 jugadores.
                Cooldown: 2  // Velocidad de carga: 2 s
            }
        },
        Sprite:
        {
            ID : "Sword_3",
            Scale:0.5
        }
    
    },
    Bow_2 :
    {
        Consumible: false,
        Level: 2,
        Price: 30,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity: 6,        //Alcance: 6 jugadores
                Cooldown: 1.5       //Velocidad de carga: 1.5 s
            }
        }
    
    },
    Bow_3 :
    {
        Consumible: false,
        Level: 3,
        Price: 60,
        Effect:
        {
            Target: "other",
            Data:
            {
                Attribute: "damage",
                Quantity: 8,        //Alcance: 8 jugadores
                Cooldown: 1         //Velocidad de carga: 1.5 s
            }
        }
    
    },
    Shield_1 :
    {
        Consumible: true,
        Level: 1,
        Price: 20,
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: -1,
                Quantity: 2,        //Bloquea 2 puntos de ataques
                Cooldown: 0
            }
        },
        Sprite:
        {
            ID : ""
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
                Quantity: 4,        //Bloquea 4 puntos de ataques
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
                Quantity: 6,    //Bloquea 6 puntos de ataques
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
        Effect:
        {
            Target: "self",
            Data:
            {
                Attribute: "speed",
                Quantity: 0.5,      // +50% velocidad movimiento
                Cooldown: 0
            }
        }
    
    },
    

    Potion :
    {
        Consumible: true,
        Price:  15,
        Effect: 
        {
        Target:   "self",  
        Data:  3 
        }
    
    },
    Radar :
    {
        Consumible: true,
        Price: 30,
        Effect: 
        {
        Target:   "self",  
        Data:  -1 
        }
    },
    Grenade :
    {
        Consumible: true,
        Price: 20,
        Effect: 
        {
            Target:   "other",  
            Data:
            {
                maxDistance : 1,
                speed       : 0,
                damage      : 3,        //+3 pto daño a los enemigos en un área de una casilla
                time        : 1
            }
        }
    
    },
    Arrow_1:
    {
        Consumible: true,
        Price: 1,
        Effect:
        {
            Target: "other",
            Data:
            {
            speed: 1,
            damage: 1,              // +1 pto daño por flecha
            time: -1
            }
        }
    },
    Arrow_2:
    {
        Consumible: true,
        Level: 2,
        Price: 3,
        Effect:
        {
            Target: "other",
            Data:
            {
            speed: 1,
            damage: 2,      //2 puntos de daño por flecha
            time: -1
            }
        }
    }
}