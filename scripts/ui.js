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