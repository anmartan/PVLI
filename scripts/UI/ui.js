export class textButton extends Phaser.GameObjects.Text{
    constructor(config, x, y, text)
    {

        let style = config.style;
        super(config.scene,x,y,text,style)

        this.scene = config.scene;
        this.basicColor = config.basicColor;
        this.clickedColor = config.clickedColor;
        this.cursorOverColor = config.cursorOverColor;
        this.setFill(this.basicColor);
        this.setInteractive();        
        this.over();
        this.out();
        this.scene.add.existing(this);
    }
    size()
    {
        return this.size;
    }
    over()//al pasar el cursor coloca el color "over" si el botón no está clicado
    {
        this.on("pointerover",()=>{if(this.style.color!==this.clickedColor)this.setFill(this.cursorOverColor)}); 
    }
    out(){//al retirar el cursor coloca el color básico, si no está clicado
        this.on("pointerout", ()=>{if(this.style.color!==this.clickedColor)this.setFill(this.basicColor)}); 
    }
    click(){};
}
class indexButtons
{
    constructor(scene, config)
    {
        this.button1      = new indexButton(config,  55,  140,  '1',      0).setFill(config.clickedColor); //y es la primera de la dungeon
        this.button2      = new indexButton(config,  85,  140,  '2',      1); 
        this.button3      = new indexButton(config,  110, 140,  '3',      2);

        this.indexButtons = scene.add.group();
        this.indexButtons.addMultiple([this.button1,this.button2,this.button3]);
        let indexButtonChildren = this.indexButtons.getChildren()
        this.indexButtons.children.iterate(indexButton =>   {indexButton.click(indexButtonChildren)})
    }
}

class indexButton extends textButton //este botón servirá en la parte de edición de mazmorras para seleccionar la habitación actual que se está editando
{
    constructor(config, x, y, text,pos)
    {
        super(config, x, y, text,pos)
        this.buttonPos = pos; //posición relativa del botón de izquierda a derecha (si están en horizontal) o de arriba a bajo (si están en vertical) empezando desde 0
    }
    click(indexButtonChildren)
    {
    this.on("pointerdown",()=>
    {
        this.scene.actual = this.buttonPos; 
        this.setFill(this.clickedColor);
        this.scene.rooms[this.scene.actual].resize(this.scene.rooms[this.scene.actual].size); //cambia la habitación actual a la que guarda el botón
        for(let i  = 0; i<3;i++) //itera por todos los botones de la escena 
        {
            if(this.scene.actual!==i)indexButtonChildren[i].setFill(indexButtonChildren[i].basicColor); //pone en basic color los botones de índice no presionados
        }
    }   
    );
    }
}




export class editorMenu  //Manager que se encarga de decidir qué botones se muestran y qué botones no
{
    constructor(scene, Hoffset, Voffset)
    {
        this.actualState = "";
        this.grid = new dungeonGrid(scene, Hoffset, Voffset);
        this.scene = scene;

        let statesX = 10 ;  //Posición horizontal de los botones de estado
        let statesY = 60 ;  //Posición vertical inicial de los botones de estado
        let optionsX = 26;  //Posición horizontal de los botones de opciones
        let optionsY = 68;  //Posición vertical inicial de los botones de opciones


        //Por ahora tendremos tres botones de estados:
        //Edición del tamaño de la habitación, colocación de enemigos y colocación de trampas
        this.states   = new Array(3);
        this.states[0]= new StateButton(scene, statesX, statesY,    ["yellow", "green"], this, "Size"    );
        this.states[1]= new StateButton(scene, statesX, statesY+16, ["pink",   "green"], this, "Monsters");
        this.states[2]= new StateButton(scene, statesX, statesY+32, ["white",  "green"],   this, "Traps"   );
        
        //Opciones de states[0] tamaño de habitación:
        //--Pequeña (5x5), Mediana (7x7) y Grande (9x9)--
        this.states[0].add(new sizeOptionButton(scene,optionsX,optionsY,    ["yellow2","green2"], 5))
        this.states[0].add(new sizeOptionButton(scene,optionsX,optionsY+8,  ["yellow2","green2"], 7))
        this.states[0].add(new sizeOptionButton(scene,optionsX,optionsY+16, ["yellow2","green2"], 9))

        //Opciones de states[1] monstruos:
        //--Por ahora zombie--
        this.states[1].add(new gridOptionButton(scene,optionsX,optionsY,    ["pink2","green2"], this.grid,"enemy","zombie")); //
        this.states[1].add(new gridOptionButton(scene,optionsX,optionsY+8,  ["pink2","green2"], this.grid,"enemy","araña" )); // En un mundo ideal habría varios tipos más
        this.states[1].add(new gridOptionButton(scene,optionsX,optionsY+16, ["pink2","green2"], this.grid,"enemy","abeja" )); //
        
        //Opciones de states[2] trampas:
        //--Por ahora no hay trampas implementadas--
        this.states[2].add(new gridOptionButton(scene,optionsX,optionsY,    ["white2","green2"], this.grid,"trap", "spikes"));  // 
        this.states[2].add(new gridOptionButton(scene,optionsX,optionsY+8,  ["white2","green2"], this.grid,"trap",""));  // En un mundo ideal habría varios tipos más
        this.states[2].add(new gridOptionButton(scene,optionsX,optionsY+16, ["white2","green2"], this.grid,"trap",""));  //
        
        this.states[0].emit("pointerdown")                                                                            //Empezamos por defecto con el estado "Size"
        this.states[0].stateOptions[0].emit("pointerdown")                                                                 //Empezamos por defecto con el Size pequeño
        //Esto es un traslado de la anterior implementación. Funciona por ahora, pero hay que arreglarlo.
        let config =
        {
            scene : scene,
            clickedColor : "#FF00FF",
            cursorOverColor : "#00FF00",
            basicColor : "#FFFFFF",
            style : {fontFamily:"arial", fontSize:"15px"},
        }
        new indexButtons(scene,config);
    }
    changeState(st)
    {   
        //Si el estado es distinto al actual, actualiza el estado y los demás botones de estado
        if (this.actualState !== st)
        {
            this.actualState = st;
            this.states.forEach( state => {
                if(state.ID !== this.actualState)
                {
                    state.hide();                   //Esconde las opciones de los que no están pulsados
                    state.setDefaultSprite();
                }
                else
                {
                    state.show();                   //Y muestra las opciones del que está pulsado
                }
            });
        } 
        else //Si haz clicado el mismo estado, deseleciona el estado seleccionado
        {
            this.states.forEach( state => {
                if(state.ID === this.actualState)
                {
                    state.hide();                   //Esconde las opciones del que acabas de despulsar
                    //state.setDefaultSprite();
                }
            });
            this.actualState= '';                   //Resetea el estado
        }

    }
    save(dungeon)
    {
        this.grid.saveEnemies(dungeon);
        //this.grid.saveTraps(dungeon);
    }
}

export class Button extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, sprite)
    {
        if(Array.isArray(sprite))
        {
            super(scene, x, y, sprite[0]);
            if(sprite.length > 1)
            {
                for(let i = 1; i<sprite.length;i++)
                {
                    scene.add.sprite(-x, -y, sprite[i]);
                }
            }
            this.sprite = sprite;
        }
        else super(scene, x, y, sprite);
        this.setInteractive();
        scene.add.existing(this);
        this.click();                           // -->Todos los Button deben implementar su método Click<--

        this.clickDefault();                    // |  Método default para al clicar en el botón           |
        this.overDefault();                     // |  Método default para al pasar  el ratón en el botón  |
        this.outDefault();                      // |  Método default para al quitar el ratón en el botón  |

        this.scene = scene;
    }
    clickDefault()
    {
        this.on("pointerdown",() => 
        {
            if(Array.isArray(this.sprite))
            {
                let defaultSprite = this.scene.textures.get(this.sprite[0]);
                if(this.texture === defaultSprite) this.setClickedSprite()
                else this.setDefaultSprite();
            }
        })
    }
    overDefault()
    {
        this.on("pointerover",() => this.setAlpha(1,0,1,0))
    }
    outDefault()
    {
        this.on("pointerout",() => this.setAlpha(1) )
    }
    setDefaultSprite()
    {
        this.setTexture(this.sprite[0]);
    }
    setClickedSprite()
    {
        this.setTexture(this.sprite[1]);        
    }
} 


class StateButton extends Button //Botones de cada estado (Botón de edición de dimensión de la habitación, botón de monstruos y botón de trampas)
{
    constructor(scene, x, y, sprite, EditorMenu, ID)
    {
        super(scene,x,y,sprite);
        this.ID = ID;                           //Identificador para saber qué estado soy (Size, Traps, Enemies)
        this.editorMenu = EditorMenu;           //Referencia al manager para poder comunicarnos con él 
        this.stateOptions = new Array();       //Un array con las opciones para la edición (Tipos de trampas, enemigos, tamaño de mazmorra..)
    }
    
    show()                                      //Este método es llamado desde el "EditorMenu" cuando se clica en este estado
    { 
        this.stateOptions.forEach(option => {   // ||                                            ||
            option.setVisible(true);            // || Muestra los botones de opciones del estado ||
        });                                     // ||                                            ||
    }
    
    hide(){this.stateOptions.forEach(option => 
    {                                       // ||                                            ||
        option.setVisible(false);           // || Oculta  los botones de opciones del estado ||
        option.setDefaultSprite();          // ||                                            ||
        if(option.hideGrid)                 
            option.hideGrid();                                      
    });}
    
    click(){ this.on("pointerdown", ()=>
    {
        this.editorMenu.changeState(this.ID);
    });}

    add(button)
    {
        button.stateButton = this;
        this.stateOptions.push(button);
    }
    optionClicked(option)
    {
        if(this.actualOption !== option)
        {
            this.actualOption = option;
            this.stateOptions.forEach(button => {
                if(button!==option) button.setDefaultSprite();
            })
        }
    }
}
class sizeOptionButton extends Button //Botón de tipo de size (Modificará el tamaño de la habitación actual)
{
    constructor(scene, x, y, sprite, size)
    {
        super(scene, x,y,sprite);
        this.size = size;
        this.setVisible(false);     //Los botones de opciones se inicializan invisibles
    }
    click()
    {
        this.on("pointerdown",() =>
        {
            this.scene.rooms[this.scene.actual].resize(this.size, this.scene); //Cambia el tamaño de la habitación  (Salto de fe de que la escena tiene tanto "rooms" como "actual". 
            this.stateButton.optionClicked(this);                               //Como la escena siempre será la de edición, siempre los tendrá) 
        });                                                                    
    }
    setDefaultSprite()
    {
        if(this.scene.rooms[this.scene.actual].size !== this.size )
        {
            super.setDefaultSprite();
        }
    }
}

class gridOptionButton extends Button //Botón que modifica el grid (botones de Trampas o Enemigos)
{
    constructor(scene, x, y, sprite, grid, Type, optionType)
    {
        super(scene, x,y,sprite);
        this.grid = grid;
        this.optionType = optionType;
        this.type = Type;
        this.setVisible(false);     //Los botones de opciones se inicializan invisibles
    }
    click()
    {
        this.on("pointerdown",() => 
        {
            //console.clear();
            this.hideGrid()                                             //Ocultamos el grid para mostrar solo las celdas que toque mostrar
            this.grid.show(this.scene.rooms[this.scene.actual].size);   //Se muestran las celdas en función del tamaño de la mazmorra
            this.grid.setCurrentType(this.type, this.optionType);       
            this.stateButton.optionClicked(this);                                     
            console.log(this.type+" type: "+this.optionType);
        });
    }
    hideGrid(){this.grid.hide();}
}

class dungeonGrid
{
    constructor( scene, Hoffset, Voffset)
    {
        this.cells = new Array(9);                  // || Salagadoola mechicka boola; Bibbidi-bobbidi-boo!       || //
        for (let i = 0; i < this.cells.length; i++) // || A bidimensional array in Javascript you want to do?    || //
        {                                           // ||                Bibbidi-bobbidi-boo!                    || //
            this.cells[i] = new Array(9);           // || Salagadoola mechicka boola; Bibbidi-bobbidi-boo!       || //
        }                                           // || You wanted to [9,9] but now you love this language too || //

        let screenCenter = 7*8;                     // Calcula el centro de la pantalla, pues la posición del tilemap toma este como 0,0
        this.Hoffset = Hoffset + screenCenter;      // Sumamos los offsets dados en el constructor con el centro previamente calculado
        this.Voffset = Voffset + screenCenter;      // para guardar los offsets con referencia  al  0,0 de la escena (Que es como los utiliza Sprite)
        this.scene = scene;                        
        
          
        //Creamos nueve celdas, pues la mayor habitación posible es de 9x9    
        for(let i= 0;i<9;i++)
           for(let j=0;j<9;j++) 
               this.cells[i][j] = new cell(this.scene, 0, 0 , "default", this, i, j);

        this.currentType = "enemy";
        this.currentSubtype = "zombie";
        this.hide();
    }

    getOffsetBySize(size)   //Conseguimos el número celdas que hay que desplazar en diagonal ( ⭸ ), dependiendo del tamaño de la habitación actual,                                   ( ⭸ ⇲ ↘ ⬂ ⬊ ⭨ )
    {                       //para conseguir que la primera se centre en la que corresponde con el tilemap
        return (9-size)/2   //Mathematical Bibbidi-bobbidi-boo!
    }
    setPosition()
    {
        let offset = this.getOffsetBySize(this.scene.rooms[this.scene.actual].size)
        for(let i  = 0; i<9;i++)
        {
            for(let j =0 ; j<9; j++)                                // || La "i" y la "j" son números enteros que representan la posición en el grid.                      ||
            {                                                       // || Offset es la unidad que le sumamos al iterador (i o j)  para conseguir la posición               ||
                this.cells[i][j].x = (offset+i)* 8 + this.Hoffset ; // || desplazada. Multiplicamos por el tamaño del tile y sumamos el offset en píxeles correspondiente  ||
                this.cells[i][j].y = (offset+j)* 8 + this.Voffset ; 
            }                                                       
        }
    }

    show(length)
    {
        this.setPosition();                                         //Recalcula la posición primero, por si el tamaño de la habitación ha cambiado
        for(let i = 0; i<length; i++)
        {
            for(let j = 0; j<length;j++)
            {
                this.cells[i][j].setVisible(true);                  //Solo hace visibles las celdas que se encuentren en el tilemap de la habitación actual (lengthxlenght)
            }
        }
    }
    hide()                                                          
    {
        for(let i = 0; i<9; i++)
        {
            for(let j = 0; j<9;j++)
            {
                this.cells[i][j].setVisible(false);                 //Oculta todas las celdas
            }
        }
    }

    //Al pulsar un botón de opcíón se llamará a este método
    setCurrentType(type, subtype)                                   //Las celdas guardan un typo (Enemigo o trampa) y un subtipo (zombies, trampa de fuego...) dependiendo del botón
    {                                                               //de opciones que esté pulsado. 
        this.currentType = type;
        this.currentSubtype = subtype;
    }
    setCell(x,y)                                                    //Este método para guarda los tipos actuales en la celda [x] [y].
    {
        this.cells[x][y].setType(this.currentType);
        this.cells[x][y].setSubtype(this.currentSubtype);
    }
    
    //Al pulsar una celda se llamará este método
    cellClicked(cell)
    {
        //console.clear();
        cell.actual = this.scene.actual;        //Necesitamos guardar "actual" que hace referencia al número de la habitación de la celda
        this.setCell(cell.i, cell.j);
    }

    //Este método guarda en la dungeon dada la información de las celdas
    saveEnemies(dungeon)
    {
        for(let i  = 0 ; i< 9 ;i++)
        {
            for(let j = 0; j<9;j++)
            {
                saveCell(i,j, this); //Para cada celda llama a la función SaveCell
            }
        }


        function saveCell(i,j, grid)
        {
        let cell = grid.cells[i][j];
        if(cell.type==="enemy")
        {
            let actualRoom = dungeon.rooms[cell.actual];
            let enemyConfig;                                                        //En esta variable se guardará la información necesaria para crear el enemigo
            let offset = (grid.getOffsetBySize(actualRoom.size))             
            switch (cell.subtype)
            {
                case "zombie":
                    enemyConfig =
                    {
                        type: "zombie",
                        pos: {
                            x : cell.i+offset,
                            y : cell.j+offset
                        }
                    }
                    break;
                default:
                    console.log("No se puede crear un enemigo de tipo "+ cell.subtype);
                    break;
            }
            if(enemyConfig!==undefined) actualRoom.enemies.addEnemy(enemyConfig); //Si se ha encontrado un enemigo posible en el switch se añade la configuración a la lista cprres`pmoemte

        }
        //Ahora también guardamos trampas
        else if(cell.type === "trap")
        {
            let actualRoom = dungeon.rooms[cell.actual];
            let trapConfig;                                                        
            let offset = (grid.getOffsetBySize(actualRoom.size));           
            switch (cell.subtype)
            {
                case "spikes":
                    trapConfig=
                    {
                        type: "spikes",
                        pos : 
                        {
                            x: (cell.i +offset),    //Ajustar el valor
                            y: (cell.j + offset)   //Ajustar el valor
                        }
                    }
                    console.log(trapConfig.pos.x + "y en y: " + trapConfig.pos.y);
                    break;
                
                default:
                    console.log("No se puede poner una trampa de tipo " + cell.subtype);
                    break;
            }

            if(trapConfig!==undefined) actualRoom.traps.AddTrap(trapConfig);
        }
        }
    }
}

class cell extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,sprite, grid,i,j)
    {
        super(scene,x,y,sprite);
        this.setInteractive();
        this.on("pointerdown", this.click)
        scene.add.existing(this);
        this.grid = grid;
        this.actual = -1;
        this.type = "";
        this.subtype = "";
        this.i=i;
        this.j=j;
    }
    setType(type)
    {
        if(this.type==="")
        {
            this.type=type;
            console.log("type: " + this.type);
        }
        else
        {
            console.log("cant place -> " + type + " because there is -> " + this.type)
        }
    }
    setSubtype(subtype)
    {
        if(this.subtype==="")
        {
            this.subtype=subtype;
            console.log("subtype: "+this.subtype);
        }
        else
        {
            console.log("cant place -> " + subtype + " because there is -> " + this.subtype)
        }
    }
    click()
    {
        this.grid.cellClicked(this);
    }
}