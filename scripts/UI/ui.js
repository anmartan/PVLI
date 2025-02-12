import { enemyInfo } from "../Enemies and World/enemy.js";
import { enemyManager } from "../Enemies and World/enemy.js";
import { Time } from '../Scenes/utils.js';
import { trapManager } from "../Enemies and World/traps.js";

export class textButton extends Phaser.GameObjects.Text {
    constructor(config, x, y, text) {

        let style = config.style;
        super(config.scene, x, y, text, style)

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
    size() {
        return this.size;
    }
    over()//al pasar el cursor coloca el color "over" si el botón no está clicado
    {
        this.on("pointerover", () => { if (this.style.color !== this.clickedColor) this.setFill(this.cursorOverColor) });
    }
    out() {//al retirar el cursor coloca el color básico, si no está clicado
        this.on("pointerout", () => { if (this.style.color !== this.clickedColor) this.setFill(this.basicColor) });
    }
    click() { };
}
class indexButtons {
    constructor(scene, config, menu) {
        this.button1 = new indexButton(config, 55, 240, '1', 0, menu).setFill(config.clickedColor); //y es la primera de la dungeon
        this.button2 = new indexButton(config, 85, 240, '2', 1, menu);
        this.button3 = new indexButton(config, 110, 240, '3', 2, menu);

        this.indexButtons = scene.add.group();
        this.indexButtons.addMultiple([this.button1, this.button2, this.button3]);
        let indexButtonChildren = this.indexButtons.getChildren()
        this.indexButtons.children.iterate(indexButton => { indexButton.click(indexButtonChildren) })
    }
}

class indexButton extends textButton //este botón servirá en la parte de edición de mazmorras para seleccionar la habitación actual que se está editando
{
    constructor(config, x, y, text, pos, menu) {
        super(config, x, y, text, pos)
        this.buttonPos = pos; //posición relativa del botón de izquierda a derecha (si están en horizontal) o de arriba a bajo (si están en vertical) empezando desde 0
        this.menu = menu;
    }
    click(indexButtonChildren) {
        this.on("pointerdown", () => {
            this.scene.actual = this.buttonPos;
            this.setFill(this.clickedColor);
            this.scene.rooms[this.scene.actual].resize(this.scene.rooms[this.scene.actual].size, this.scene); //cambia la habitación actual a la que guarda el botón
            for (let i = 0; i < 3; i++) //itera por todos los botones de la escena 
            {
                if (this.scene.actual !== i) indexButtonChildren[i].setFill(indexButtonChildren[i].basicColor); //pone en basic color los botones de índice no presionados
            }
            this.menu.actualRoom = this.buttonPos;
            this.menu.grid.hide();
            if (this.menu.actualState !== "Size") this.menu.states[0].emit("pointerdown");
            this.menu.states[0].emit("pointerdown");
            this.menu.grid = this.menu.grids[this.menu.actualRoom];
            console.error(this.menu.actualRoom);
        }
        );
    }
}


export class editorMenu  //Manager que se encarga de decidir qué botones se muestran y qué botones no
{
    constructor(scene, Hoffset, Voffset, tileSize) {
        this.scene = scene;
        this.actualState = "";
        this.actualRoom = 0;
        this.grids = new Array();
        for (let i = 0; i < 3; i++)this.grids[i] = new dungeonGrid(scene, Hoffset, Voffset, tileSize, i);
        this.grid = this.grids[0];
        console.log(this);

        let statesX = 10;  //Posición horizontal de los botones de estado
        let statesY = 60;  //Posición vertical inicial de los botones de estado
        let optionsX = 26;  //Posición horizontal de los botones de opciones
        let optionsY = 68;  //Posición vertical inicial de los botones de opciones


        this.scene.moneyText = this.scene.add.text(240, 32, this.scene.money, { font: "32px m5x7", fill: "#FFFFFF" });
        this.scene.add.sprite(210, 48, "coins");
        this.scene.timer = new Time(scene, 32, 4, 2, 0);
        socket.on("second", (time) => this.scene.timer.tick(time));




        //Por ahora tendremos tres botones de estados:
        //Edición del tamaño de la habitación, colocación de enemigos y colocación de trampas
        this.states = new Array(3);
        this.states[0] = new StateButton(scene, statesX + 16, statesY, ["sizeSymbol", "sizeSymbol2", "clicked"], this, "Size");
        this.states[1] = new StateButton(scene, statesX + 16, statesY + 32, ["enemiesSymbol", "enemiesSymbol2", "clicked"], this, "Monsters");
        this.states[2] = new StateButton(scene, statesX + 16, statesY + 64, ["trapSymbol", "trapSymbol2", "clicked"], this, "Traps");

        //Opciones de states[0] tamaño de habitación:
        //--Pequeña (5x5), Mediana (7x7) y Grande (9x9)--
        this.states[0].add(new sizeOptionButton(scene, optionsX + 50, optionsY, ["smallRoomButton", "smallRoom2Button", "clicked"], 5))
        this.states[0].add(new sizeOptionButton(scene, optionsX + 50, optionsY + 32, ["mediumRoomButton", "mediumRoom2Button", "clicked"], 7))
        this.states[0].add(new sizeOptionButton(scene, optionsX + 50, optionsY + 64, ["bigRoomButton", "bigRoom2Button", "clicked"], 9))

        //Opciones de states[1] monstruos:
        //--Zombie, araña, abeja, mago y escarabajo--
        this.states[1].add(new gridOptionButton(scene, optionsX + 50, optionsY, ["zombieButton", "zombie2Button", "clicked"], this, "enemy", "zombie")); //
        this.states[1].add(new gridOptionButton(scene, optionsX + 50, optionsY + 32, ["spiderButton", "spider2Button", "clicked"], this, "enemy", "spider")); // En un mundo ideal habría varios tipos más
        this.states[1].add(new gridOptionButton(scene, optionsX + 50, optionsY + 64, ["beeButton", "bee2Button", "clicked"], this, "enemy", "bee")); //
        this.states[1].add(new gridOptionButton(scene, optionsX + 50, optionsY + 96, ["beetleButton", "beetle2Button", "clicked"], this, "enemy", "beetle")); //
        this.states[1].add(new gridOptionButton(scene, optionsX + 50, optionsY + 128, ["wizardButton", "wizard2Button", "clicked"], this, "enemy", "wizard")); //

        //Opciones de states[2] trampas:
        //--Daño, veneno, stuneo y spawn--
        this.states[2].add(new gridOptionButton(scene, optionsX + 50, optionsY, ["spikesButton", "spikes2Button", "clicked"], this, "trap", "spikes"));  // 
        this.states[2].add(new gridOptionButton(scene, optionsX + 50, optionsY + 32, ["poisonButton", "poison2Button", "clicked"], this, "trap", "poison"));  // En un mundo ideal habría varios tipos más
        this.states[2].add(new gridOptionButton(scene, optionsX + 50, optionsY + 64, ["stunButton", "stun2Button", "clicked"], this, "trap", "stun"));    //
        this.states[2].add(new gridOptionButton(scene, optionsX + 50, optionsY + 96, ["spawnButton", "spawn2Button", "clicked"], this, "trap", "spawn"));   //
        //this.states[2].add(new gridOptionButton(scene,optionsX,optionsY + 128, ["white2","green2"], this.grid,"trap", "teleportation"));   // esta no funciona todavía

        this.states[0].emit("pointerdown")                                                                                 //Empezamos por defecto con el estado "Size"
        this.states[0].stateOptions[0].emit("pointerdown")                                                                 //Empezamos por defecto con el Size pequeño

        let config =
        {
            scene: scene,
            clickedColor: "#FF00FF",
            cursorOverColor: "#00FF00",
            basicColor: "#FFFFFF",
            style: { fontFamily: 'm5x7', fontSize: "16px" },
        }
        new indexButtons(scene, config, this);
    }
    changeState(st) {
        //Si el estado es distinto al actual, actualiza el estado y los demás botones de estado
        if (this.actualState !== st) {
            this.actualState = st;
            this.states.forEach(state => {
                if (state.ID !== this.actualState) {
                    state.hide();                   //Esconde las opciones de los que no están pulsados
                    state.setDefaultSprite();
                }
                else {
                    state.show();                   //Y muestra las opciones del que está pulsado
                }
            });
        }
        else //Si haz clicado el mismo estado, deseleciona el estado seleccionado
        {
            this.states.forEach(state => {
                if (state.ID === this.actualState) {
                    state.hide();                   //Esconde las opciones del que acabas de despulsar
                    //state.setDefaultSprite();
                }
            });
            this.actualState = '';                   //Resetea el estado
        }

    }
    hideGrid() {
        this.states[2].forEach(hideGrid);
    }
    save(dungeon) {

        for (let i = 0; i < 3; i++)this.grids[i].saveEnemies(dungeon);
        //this.grid.saveTraps(dungeon);
    }
}

export class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite) {
        if (Array.isArray(sprite)) {
            super(scene, x, y, sprite[0]);
            scene.add.existing(this);                                                   //dentro del if para que se pinte antes que el sprite over si existe
            if (sprite.length > 2) {
                this.overSprite = scene.add.sprite(-x, -y, sprite[2]).setVisible(false);//creando el sprite over fuera de la pantalla e invisible
            }
            this.sprite = sprite;
        }
        else {
            super(scene, x, y, sprite);
            scene.add.existing(this);
        }
        this.setInteractive();
        this.click();                           // -->Todos los Button deben implementar su método Click<--

        if (Array.isArray(this.sprite)) {
            this.on("pointerdown", () => {
                this.clickDefault();                    // |  Método default para al clicar en el botón           |
            })
        }



        this.overDefault();                     // |  Método default para al pasar  el ratón en el botón  |
        this.outDefault();                      // |  Método default para al quitar el ratón en el botón  |

        this.scene = scene;
    }
    clickDefault() {
        let clicikedSprite = this.scene.textures.get(this.sprite[1]);
        if (this.texture !== clicikedSprite) this.setClickedSprite()
        else {
            this.setDefaultSprite();
        }
    }
    overDefault() {
        if (Array.isArray(this.sprite) && this.sprite.length > 2)        //si tinee imagen de over
        {
            this.on("pointerover", () => {
                this.overSprite.x = this.x;
                this.overSprite.y = this.y;
                this.overSprite.setVisible(true);
            }
            );
        }
        else {
            this.on("pointerover", () => this.setAlpha(1, 0, 1, 0));
        }
    }
    outDefault() {
        if (Array.isArray(this.sprite) && this.sprite.length > 2) {
            this.on("pointerout", () => {
                /*let overSprite = this.scene.textures.get(this.sprite[2]);
                if(this.texture === overSprite) this.setDefaultSprite();
                console.log("no he salido bro");*/
                this.overSprite.setVisible(false);
            });
        }
        else {
            this.on("pointerout", () => { this.setAlpha(1); });
        }
    }
    setDefaultSprite() {
        this.setTexture(this.sprite[0]);
    }
    setClickedSprite() {
        this.setTexture(this.sprite[1]);
    }
    setOverSprite() {
        this.setTexture(this.sprite[2]);
    }
}


class StateButton extends Button //Botones de cada estado (Botón de edición de dimensión de la habitación, botón de monstruos y botón de trampas)
{
    constructor(scene, x, y, sprite, EditorMenu, ID) {
        super(scene, x, y, sprite);
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

    hide() {
        this.stateOptions.forEach(option => {                                       // ||                                            ||
            option.setVisible(false);           // || Oculta  los botones de opciones del estado ||
            option.setDefaultSprite();          // ||                                            ||
            if (option.hideGrid)
                option.hideGrid();
        });
    }

    click() {
        this.on("pointerdown", () => {
            this.editorMenu.changeState(this.ID);
        });
    }

    add(button) {
        button.stateButton = this;
        this.stateOptions.push(button);
    }
    optionClicked(option) {
        if (this.actualOption !== option) {
            this.actualOption = option;
            this.stateOptions.forEach(button => {
                if (button !== option) button.setDefaultSprite();
            })
        }
    }
}
class sizeOptionButton extends Button //Botón de tipo de size (Modificará el tamaño de la habitación actual)
{
    constructor(scene, x, y, sprite, size) {
        super(scene, x, y, sprite);
        this.size = size;
        this.setVisible(false);     //Los botones de opciones se inicializan invisibles
    }
    click() {
        this.on("pointerdown", () => {
            this.scene.rooms[this.scene.actual].resize(this.size, this.scene); //Cambia el tamaño de la habitación  (Salto de fe de que la escena tiene tanto "rooms" como "actual". 
            this.stateButton.optionClicked(this);                               //Como la escena siempre será la de edición, siempre los tendrá) 
        });
    }
    setDefaultSprite() {
        if (this.scene.rooms[this.scene.actual].size !== this.size) {
            super.setDefaultSprite();
        }
    }
}

class gridOptionButton extends Button //Botón que modifica el grid (botones de Trampas o Enemigos)
{
    constructor(scene, x, y, sprite, menu, Type, optionType) {
        super(scene, x, y, sprite);
        this.menu = menu;
        this.optionType = optionType;
        this.type = Type;
        this.setVisible(false);     //Los botones de opciones se inicializan invisibles
    }
    click() {
        this.on("pointerdown", () => {
            //console.clear();
            this.hideGrid()                                             //Ocultamos el grid para mostrar solo las celdas que toque mostrar
            this.menu.grid.show(this.scene.rooms[this.scene.actual].size);   //Se muestran las celdas en función del tamaño de la mazmorra
            this.menu.grid.setCurrentType(this.type, this.optionType);
            this.stateButton.optionClicked(this);
            console.log(this.type + " type: " + this.optionType);
        });
    }
    hideGrid() { this.menu.grid.hide(); }
}

class dungeonGrid {
    constructor(scene, Hoffset, Voffset, tileSize, actualRoom, roomSize = 5) {
        this.cells = new Array(9);                  // || Salagadoola mechicka boola; Bibbidi-bobbidi-boo!       || //
        for (let i = 0; i < this.cells.length; i++) // || A bidimensional array in Javascript you want to do?    || //
        {                                           // ||                Bibbidi-bobbidi-boo!                    || //
            this.cells[i] = new Array(9);           // || Salagadoola mechicka boola; Bibbidi-bobbidi-boo!       || //
        }                                           // || You wanted to [9,9] but now you love this language too || //

        let screenCenter = 7 * tileSize / 2;                     // Calcula el centro de la pantalla, pues la posición del tilemap toma este como 0,0
        this.Hoffset = Hoffset + screenCenter;      // Sumamos los offsets dados en el constructor con el centro previamente calculado
        this.Voffset = Voffset + screenCenter;      // para guardar los offsets con referencia  al  0,0 de la escena (Que es como los utiliza Sprite)
        this.scene = scene;
        this.roomSize = roomSize;
        this.actual = actualRoom;
        //Creamos nueve celdas, pues la mayor habitación posible es de 9x9    
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                this.cells[i][j] = new cell(this.scene, 0, 0, ["default", "green", "default2"], this, i, j);

        this.currentType = "enemy";
        this.currentSubtype = "zombie";
        this.hide();
        this.tileSize = tileSize;
    }

    getOffsetBySize(size)   //Conseguimos el número celdas que hay que desplazar en diagonal ( ⭸ ), dependiendo del tamaño de la habitación actual,                                   ( ⭸ ⇲ ↘ ⬂ ⬊ ⭨ )
    {                       //para conseguir que la primera se centre en la que corresponde con el tilemap
        return (9 - size) / 2   //Mathematical Bibbidi-bobbidi-boo!
    }
    setPosition() {
        let offset = this.getOffsetBySize(this.scene.rooms[this.scene.actual].size)
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++)                                // || La "i" y la "j" son números enteros que representan la posición en el grid.                      ||
            {                                                       // || Offset es la unidad que le sumamos al iterador (i o j)  para conseguir la posición               ||
                this.cells[i][j].x = (offset + i) * this.tileSize / 2 + this.Hoffset; // || desplazada. Multiplicamos por el tamaño del tile y sumamos el offset en píxeles correspondiente  ||
                this.cells[i][j].y = (offset + j) * this.tileSize / 2 + this.Voffset;
            }
        }
    }

    show(length) {
        let size = this.scene.rooms[this.scene.actual].size;
        let loff = (9 - size) / 2;
        let roff = 10 - loff;
        console.log(loff)
        console.log(roff)
        this.setPosition();                                         //Recalcula la posición primero, por si el tamaño de la habitación ha cambiado
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (j + 1 !== Math.round(size / 2) || (i !== 0 && i !== size - 1))
                    this.cells[i][j].setVisible(true);                  //Solo hace visibles las celdas que se encuentren en el tilemap de la habitación actual (lengthxlenght)
            }
        }
    }
    hide() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
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
    setCell(x, y, type = this.currentType, subtype = this.currentSubtype)                                                    //Este método para guarda los tipos actuales en la celda [x] [y].
    {
        this.cells[x][y].setType(type);
        this.cells[x][y].setSubtype(subtype);
        this.blockCells(x, y);
    }
    blockCells(x, y) {
        if (x - 1 > 0) this.cells[x - 1][y].block();
        if (x + 1 < 9) this.cells[x + 1][y].block();
        if (y + 1 < 9) this.cells[x][y + 1].block();
        if (y - 1 > 0) this.cells[x][y - 1].block();
    }
    unblockCells(x, y) {
        if (x - 1 >= 0) this.cells[x - 1][y].unblock();
        if (x + 1 < 9 - this.roomSize) this.cells[x + 1][y].unblock();
        if (y + 1 < 9 - this.roomSize) this.cells[x][y + 1].unblock();
        if (y - 1 >= 0) this.cells[x][y - 1].unblock();
    }
    //Al pulsar una celda se llamará este método
    cellClicked(cell) {
        //cell.actual = this.scene.actual;        //Necesitamos guardar "actual" que hace referencia al número de la habitación de la celda
        if (cell.type === "") {
            let manager = (this.currentType==="enemy")?enemyManager:trapManager;
            if (this.scene.money - manager.prices()[this.currentSubtype] >= 0)
                this.setCell(cell.i, cell.j);
        }
        else if (cell.type !== "bloqued") {
            this.cells[cell.i][cell.j].refound();
            this.setCell(cell.i, cell.j, "", "");
        }
    }

    //Este método guarda en la dungeon dada la información de las celdas
    saveEnemies(dungeon) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                saveCell(i, j, this); //Para cada celda llama a la función SaveCell
            }
        }
        function saveCell(i, j, grid) {
            let cell = grid.cells[i][j];
            if (cell.type === "enemy") {
                let actualRoom = dungeon.rooms[grid.actual];
                let enemyConfig;                                                        //En esta variable se guardará la información necesaria para crear el enemigo
                let offset = (grid.getOffsetBySize(actualRoom.size))
                let x = cell.i + offset;
                let y = cell.j + offset;
                if (cell.subtype == "zombie" || cell.subtype == "spider" || cell.subtype == "wizard" || cell.subtype == "bee" || cell.subtype == "beetle") {
                    enemyConfig = new enemyInfo(x, y, cell.subtype);
                }
                else console.error("No se puede crear un enemigo de tipo " + cell.subtype);
                if (enemyConfig !== undefined) actualRoom.enemies.addEnemyInfo(enemyConfig); //Si se ha encontrado un enemigo posible en el switch se añade la configuración a la lista cprres`pmoemte
            }


            else if (cell.type === "trap") {
                let actualRoom = dungeon.rooms[grid.actual];
                let trapConfig;
                let offset = (grid.getOffsetBySize(actualRoom.size));
                if (cell.subtype == "spikes" || cell.subtype == "poison" || cell.subtype == "stun" || cell.subtype == "spawn")// || cell.subtype == "teleportation")
                {
                    trapConfig =
                    {
                        type: cell.subtype,
                        pos:
                        {
                            x: (cell.i + offset),
                            y: (cell.j + offset)
                        }
                    }
                }
                else console.log("No se puede poner una trampa de tipo " + cell.subtype);

                if (trapConfig !== undefined) actualRoom.traps.AddTrap(trapConfig);
            }
        }
    }
}

class cell extends Button {
    constructor(scene, x, y, sprite, grid, i, j) {
        super(scene, x, y, sprite);
        this.grid = grid;
        this.unblock();
        this.i = i;
        this.j = j;
    }
    clickDefault() {
        if (this.type !== "bloqued") super.clickDefault();
    }
    setType(type) {
        if (this.type === "" || type === "") {
            this.type = type;
            console.log("type: " + this.type);
        }
        else {
            console.log("cant place -> " + type + " because there is -> " + this.type)
        }
    }
    setSubtype(subtype) {
        let price;

        if (this.subtype === "" || subtype === "") {
            if (this.type === "enemy") {
                price = enemyManager.prices()[subtype];
                this.scene.money -= price;
            }
            else if (this.type === "trap") {
                price = trapManager.prices()[subtype];;
                this.scene.money -= price;
            }
            this.scene.moneyText.text = this.scene.money;
            this.subtype = subtype;
            console.log("subtype: " + this.subtype);
            console.error(price);
            console.error(this.scene.money);
        }
        else {
            this.subtype = "";
        }
    }
    refound() {
        let price = 0;
        //buscamos el precio de la trampa o enemigo en concreto para restarlo del dinero total
        if (this.type === "enemy") {
            price = enemyManager.prices()[this.subtype];
        }
        else if (this.type === "trap") {
            price = trapManager.prices()[this.subtype];
        }
        console.log(this.scene);
        this.scene.money += price;
        this.scene.moneyText.text = this.scene.money;

    }
    block() {
        this.type = "bloqued";
        this.subtype = "bloqued";
    }
    unblock() {
        this.type = "";
        this.subtype = "";
    }
    click() {
        this.on("pointerdown", () => {
            this.grid.cellClicked(this);
        })
    }
}