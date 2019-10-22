export class button extends Phaser.GameObjects.Text{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style)
        this.roomSize = size; //guarda el tamaño de la mazmorra (5x5, 7x7, 9x9)
        this.buttonPos = pos; //posición relativa del botón de izquierda a derecha (si están en horizontal) o de arriba a bajo (si están en vertical) empezando desde 0
        this.setInteractive(); //permite que se pueda clickar el texto
        scene.add.existing(this);
    }
    size()
    {
        return this.size;
    }
    over(clickedColor, colorToPlace)//al pasar el cursor coloca el color pasado como segundo argumento si el primero no esta colocado
    {
        this.on("pointerover",()=>{if(this.style.color!==clickedColor)this.setFill(colorToPlace)}); 
    }
    out(clickedColor, colorToPlace){//al retirar el cursor coloca el color pasado como segundo argumento si el primero no esta colocado
        this.on("pointerout", ()=>{if(this.style.color!==clickedColor)this.setFill(colorToPlace)}); 
    }
}
export class indexButton extends button //este botón servirá en la parte de edición de mazmorras para seleccionar la habitación actual que se está editando
{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style,size, pos)
    }
    click(sizeButtonChildren, indexButtonChildren, fillColor, basicColor)
    {
    this.on("pointerdown",()=>
    {
        this.scene.actual = this.buttonPos; 
        this.setFill(fillColor);
        this.scene.rooms[this.scene.actual].resize(this.scene.rooms[this.scene.actual].size); //cambia la habitación actual a la que guarda el botón
        for(let i  = 0; i<3;i++) //itera por todos los botones de la escena 
        {
            if(this.scene.actual!==i)indexButtonChildren[i].setFill(basicColor); //pone en basic color los botones de índice no presionados
            if(this.scene.rooms[this.scene.actual].size===sizeButtonChildren[i].roomSize)sizeButtonChildren[i].setFill(fillColor); //pone en fill color el boton de tamaño que toca para la nueva habitación
            else sizeButtonChildren[i].setFill(basicColor); //pone de basic color los demás
        }
    }   
    );
    }
}
export class sizeButton extends button
{
    constructor(scene,x,y,text,style,size, pos)
    {
        super(scene,x,y,text,style,size, pos)
    }

    click(sizeButtonChildren,  fillColor, basicColor)
    {
    this.on("pointerdown",()=>
    {
        this.scene.rooms[this.scene.actual].resize(this.roomSize);
        this.setFill(fillColor); //cambia el botón seleccionado a fill color
        for(let i  = 0; i<3;i++)
        {
            if(this.scene.rooms[this.scene.actual].size!==sizeButtonChildren[i].roomSize)sizeButtonChildren[i].setFill(basicColor);//cambia el resto de botones a basic color
        }
    });
    }
}