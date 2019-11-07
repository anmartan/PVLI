export class button extends Phaser.GameObjects.Text{
    constructor(config, x, y, text)
    {

        let style = config.style;
        super(config.scene,x,y,text,style)

        this.scene = config.scene;
        this.basicColor = config.basicColor;
        this.clickedColor = config.clickedColor;
        this.cursorOverColor = config.cursorOverColor;
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
export class indexButton extends button //este botón servirá en la parte de edición de mazmorras para seleccionar la habitación actual que se está editando
{
    constructor(config, x, y, text,pos)
    {
        super(config, x, y, text,pos)
        this.buttonPos = pos; //posición relativa del botón de izquierda a derecha (si están en horizontal) o de arriba a bajo (si están en vertical) empezando desde 0
    }
    click(indexButtonChildren,sizeButtonChildren)
    {
    this.on("pointerdown",()=>
    {
        this.scene.actual = this.buttonPos; 
        this.setFill(this.clickedColor);
        this.scene.rooms[this.scene.actual].resize(this.scene.rooms[this.scene.actual].size); //cambia la habitación actual a la que guarda el botón
        for(let i  = 0; i<3;i++) //itera por todos los botones de la escena 
        {
            if(this.scene.actual!==i)indexButtonChildren[i].setFill(indexButtonChildren[i].basicColor); //pone en basic color los botones de índice no presionados
            if(this.scene.rooms[this.scene.actual].size===sizeButtonChildren[i].roomSize)sizeButtonChildren[i].setFill(sizeButtonChildren[i].clickedColor); //pone en fill color el boton de tamaño que toca para la nueva habitación
            else sizeButtonChildren[i].setFill(sizeButtonChildren[i].basicColor); //pone de basic color los demás
        }
    }   
    );
    }
}
export class sizeButton extends button
{
    constructor(config, x, y, text, size)
    {
        super(config, x, y, text)
        this.roomSize = size; //guarda el tamaño de la mazmorra (5x5, 7x7, 9x9)
    }

    click(sizeButtonChildren)
    {
    this.on("pointerdown",()=>
    {
        this.scene.rooms[this.scene.actual].resize(this.roomSize);
        this.setFill(this.clickedColor); //cambia el botón seleccionado a fill color
        for(let i  = 0; i<3;i++)
        {
            if(this.scene.rooms[this.scene.actual].size!==sizeButtonChildren[i].roomSize)sizeButtonChildren[i].setFill(sizeButtonChildren[i].basicColor);//cambia el resto de botones a basic color
        }
    });
    }
}




export class editorMenu  //Manager que se encarga de decidir qué botones se muestran y qué botones no
{
    constructor(scene, Hoffset, Voffset)
    {
        this.actualState = "Size";
        this.grid = new dungeonGrid(scene, Hoffset, Voffset);

        this.states = new Array(3);
        this.states[0]= new StateButton(this,"Size",scene,10,60,"yellow", this.grid);
        this.states[1]= new StateButton(this,"Monsters",scene,10,76,"pink", this.grid);
        this.states[2]= new StateButton(this,"Traps",scene,10,92,"white", this.grid);

        this.states[1].add(new enemyButton(scene,26,76,"pink2", this.grid,"zombie"));
        this.states[1].add(new enemyButton(scene,26,84,"pink2", this.grid));
        this.states[1].add(new enemyButton(scene,26,92,"pink2", this.grid));
        this.roomNumber = 0;
    }
    changeState(st)
    {
        this.actualState = st.ID;
        console.clear();
        console.log("state changed to "+ st.ID)
        this.states.forEach( state => {
            if(state.ID !== this.actualState)
            {
                state.hide();
            }
            else
            {
                state.show();
            }
        });

    }
    save(dungeon)
    {
        console.log("guardando..")
        this.grid.saveEnemies(dungeon);
    }
}

class StateButton extends Phaser.GameObjects.Sprite //Botones de cada estado (Botón de edición de dimensión de la habitación, botón de monstruos y botón de trampas)
{
    constructor(EditorMenu, ID, scene, x,y,sprite, grid)
    {
        super(scene,x,y,sprite);
        this.setInteractive();
        this.ID = ID;                           //Identificador para saber qué estado soy (Size, Traps, Enemies)
        this.editorMenu = EditorMenu;           //Referencia al manager para poder comunicarnos con él 
        this.StateOptions = new Array(3);       //Un array con las opciones para la edición (Tipos de trampas, enemigos, tamaño de mazmorra..)

        
        this.click();
        scene.add.existing(this);
    }
    show(){ console.log("show " + this.ID + " options"); this.StateOptions.forEach(option => {
        option.setVisible(true);
    });};
    hide(){ console.log("hide " + this.ID + " options"); this.StateOptions.forEach(option => {
        option.setVisible(false);
        option.hideGrid();
    });};
    click(){ this.on("pointerdown", ()=>
    {
        console.log("Clicked " + this.ID);
        this.editorMenu.changeState(this);
    });
    }
    add(button)
    {
        this.StateOptions.push(button);
        console.log(button + " has been added");
    }
}

export class enemyButton extends Phaser.GameObjects.Sprite //Botón de tipo de enemigo
{
    constructor(scene, x, y, sprite, grid, enemyType)
    {
        super(scene, x,y,sprite);
        this.setInteractive();
        this.grid = grid;
        this.enemyType = enemyType;
        this.click();
        scene.add.existing(this);
        this.setVisible(false);
    }
    click()
    {
        this.on("pointerdown",() => 
        {
            console.log("show")
            this.grid.hide();
            this.grid.show(this.scene.rooms[this.scene.actual].size);
            this.grid.setCurrentType("enemy", this.enemyType);
        });
    }
    hideGrid(){this.grid.hide();}
}

class dungeonGrid
{
    constructor( scene, Hoffset, Voffset)
    {
        this.cells = new Array(9);                  // cells es un array de 9 elementos
        for (let i = 0; i < this.cells.length; i++) 
        {
            this.cells[i] = new Array(9);           // Por cada elemento en cells creamos otro array de 9
        }                                           // this.cells = array de 9x9
        this.Hoffset = Hoffset;
        this.Voffset = Voffset;
        this.scene = scene;

        let offset = this.getOffsetBySize(this.scene.rooms[this.scene.actual].size)
        for(let i  = 0; i<9;i++)
        {
            for(let j =0 ; j<9; j++)
            {
                this.cells[i][j] =new cell(this.scene, offset+ this.Hoffset + i*8, offset + this.Voffset + j*8, "default",this);  //ese 8*7 ahí hard coded es una mierda, lo sé
            }
        }

        this.currentType = "enemy";
        this.currentSubtype = "zombie";

        this.Hoffset = Hoffset;
        this.Voffset = Voffset;
        this.hide();

    }
    setPosition()
    {
        let offset = this.getOffsetBySize(this.scene.rooms[this.scene.actual].size)
        for(let i  = 0; i<9;i++)
        {
            for(let j =0 ; j<9; j++)
            {
                this.cells[i][j].x = offset+ this.Hoffset + i*8;
                this.cells[i][j].y = offset+ this.Voffset + j*8;
            }
        }
    }
    getOffsetBySize(size)
    {
        console.log(size);
        if(size===5)
        {
            return 8*9;
        }
        else if(size==7)
        {
            return 8*8;
        }
        else if(size==9)
        {
            return 8*7;
        }
    }
    show(length)
    {
        this.setPosition();
        for(let i = 0; i<length; i++)
        {
            for(let j = 0; j<length;j++)
            {
                this.cells[i][j].setVisible(true);
            }
        }
    }
    hide()
    {
        for(let i = 0; i<9; i++)
        {
            for(let j = 0; j<9;j++)
            {
                this.cells[i][j].setVisible(false);
            }
        }
    }

    setCurrentType(type, subtype)
    {
        this.currentType = type;
        this.currentSubtype = subtype;
    }
    setCell(x,y)
    {
        this.cells[x][y].setType(this.currentType);
        this.cells[x][y].setSubtype(this.currentSubtype);
    }
    getPos(x,y)
    {
        let pos = {x : (x - 8*7 + this.Hoffset)/8-8, y : (y - 8*7 + this.Voffset)/8};
        return pos;
    }
    cellClicked(cell)
    {
        let pos = this.getPos(cell.x, cell.y);
        console.log(pos.x + " " + pos.y);
        this.setCell(pos.x,pos.y);
    }

    saveEnemies(dungeon)
    {
        for(let i  = 0 ; i< 9 ;i++)
        {
            for(let j = 0; j<9;j++)
            {
                let cell = this.cells[i][j];
                if(cell.type==="enemy")
                {
                switch (cell.subtype)
                {
                    case "zombie":
                        let z;
                        let pos = this.getPos(cell.x,cell.y)
                        z =
                        {
                            type: "zombie",
                            pos: {
                                x : pos.x,
                                y : pos.y
                            }
                        }
                        console.log(dungeon);
                        dungeon.rooms[0].enemies.addEnemy(z);
                        break;
                    default:
                        console.log("No se puede crear un enemigo de tipo "+ cell.type);
                        break;
    
                }
                }
            }
        }
    }
}

class cell extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,sprite, grid)
    {
        super(scene,x,y,sprite);
        this.setInteractive();
        this.on("pointerdown", this.click)
        scene.add.existing(this);
        this.grid = grid;
    }
    setType(type)
    {
        if(this.type!=="bloqued")
        {
            this.type=type;
            console.log("type: " + this.type);
        }
    }
    setSubtype(subtype)
    {
        if(this.subtype!=="bloqued")
        {
            this.subtype=subtype;
            console.log("subtype: "+this.subtype);
        }
    }
    click()
    {
        this.grid.cellClicked(this);
    }
}