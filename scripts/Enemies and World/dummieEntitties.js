import { Life } from '../Scenes/utils.js';

export class dummiePlayer extends Phaser.GameObjects.Sprite
{

    constructor(scene,x,y,sprite, spriteSword, scale)
    {
        super(scene,x,y,sprite);
        this.sword = scene.add.sprite(x,y,spriteSword).setScale(scale);
        scene.add.existing(this);
        scene.add.existing(this.sword);
        this.sword.setVisible(false);
        this.scene=scene;
        this.sword.x = 0;
        this.sword.y = 0;
        socket.on("playerMove", (data)=>this.move(data.pos, data.flip));
        socket.on("playerAttack", (data)=>this.attack(data.angle, data.offsetX,data.offsetY));
        socket.on("playerHaveAttacked", () =>this.sword.setVisible(false)); 
    }
    move(pos, flip)
    {
        this.x = pos.x;
        this.y = pos.y;
        this.sword.x = this.x+this.offsetX;
        this.sword.y = this.y+this.offsetY;
        this.setFlipX(flip);

    }
    attack(angle, offsetX,offsetY)
    {
        this.sword.setVisible(true);
        this.sword.setAngle(angle);
        this.offsetX=offsetX;
        this.offsetY=offsetY;
    }

}

export class dummieEnemy extends Phaser.GameObjects.Sprite
{

    constructor(scene,x,y,sprite,anim, enemyManager, id)
    {
        super(scene,(x+1.5)*scene.game.tileSize,(y+1.5)*scene.game.tileSize,sprite);
        scene.add.existing(this);
        this.enemyManager=enemyManager;
        this.play(anim);
        this.id = id;
        this.setInteractive();
        socket.on("enemyMove", data =>
        {
            if(data.id===this.id)this.move(data.pos, data.flip);
        })
        socket.on("enemyDead", id =>
        {
            if(id===this.id) this.killDumie();
        })
        this.on("pointerdown", ()=>
        {
            if(!this.enemyManager.havePossesed)this.possesion();
        })
    }
    possesion()
    {
        socket.emit("enemyPossesed",this.id);
        this.enemyManager.havePossesed=true;
        this.setTint("0x"+"b0fdd2");

        this.key_D     = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A     = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S     = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_W     = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.dir={x:0,y:0};
        //Teclas de movimiento, cambiar la dirección y moverse en esa direción
        this.key_A.on("down",()=>
        {
            this.dir = {x:this.dir.x-1, y:this.dir.y}            
            socket.emit("possesedMoved", this.dir);
        });
        this.key_W.on("down",()=>
        {
            this.dir = {x:this.dir.x, y:this.dir.y-1}
            socket.emit("possesedMoved", this.dir);
        });
        this.key_S.on("down", () =>
        {
            this.dir = {x:this.dir.x, y:this.dir.y+1}
            socket.emit("possesedMoved", this.dir);
        })
        this.key_D.on("down",()=>
        {
            this.dir = {x:this.dir.x+1,  y:this.dir.y}
            socket.emit("possesedMoved", this.dir);

        });
        this.key_A.on("up",()=>
        {
            this.dir = {x:this.dir.x+1, y:this.dir.y}            
            socket.emit("possesedMoved", this.dir);
        });
        this.key_W.on("up",()=>
        {
            this.dir = {x:this.dir.x, y:this.dir.y+1}
            socket.emit("possesedMoved", this.dir);
        });
        this.key_S.on("up", () =>
        {
            this.dir = {x:this.dir.x, y:this.dir.y-1}
            socket.emit("possesedMoved", this.dir);
        })
        this.key_D.on("up",()=>
        {
            this.dir = {x:this.dir.x-1,  y:this.dir.y}
            socket.emit("possesedMoved", this.dir);

        });
    }
    move(pos, flip)
    {
        this.x = pos.x;
        this.y = pos.y;
        this.setFlipX(flip);
    }
    killDumie()
    {
        this.destroy();
        this.setVisible(false);
    }
}
export class dummieTrap extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, sprite, trapManager, id)
    {
        super(scene, (x+1.5)*scene.game.tileSize, (y+1.5)*scene.game.tileSize, "trap");
        scene.add.existing(this);
        this.trapManager=trapManager;
        this.id=id;
        this.alpha=0.5;
        socket.on("trapDeactivated", id =>
        {
            if(id===this.id)
            {
                this.play("trapAnim");
                this.once("animationcomplete-trapAnim",()=>this.destroyTrap());
            }
        })
    }

    destroyTrap()
    {
        this.destroy();
        this.setVisible(false);
    }
}