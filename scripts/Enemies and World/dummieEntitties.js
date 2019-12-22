import { Life } from '../Scenes/utils.js';
import {healthBar} from "../Scenes/utils.js";

class dummieEntity extends Phaser.GameObjects.Container {
    constructor(scene, x, y, sprite, id) {
        super(scene, 100, 100);
        scene.add.existing(this);
        let image = scene.add.sprite(0, 0, sprite);
        scene.add.existing(image);
        this.id = id;
        this.healthBar=new healthBar(scene,-image.width/2,-image.height/2 ,image.width);
        this.add(image);
        this.add(this.healthBar);
        this.image=image;
        socket.on("entityChangeHealth", data=>
        {
            if(data.id===this.id)this.modifyHealth(data.actualHealth,data.maxHealth);
        })
    }
    modifyHealth(actualHealth, maxHealth) {
        this.healthBar.modifyHealth(actualHealth,maxHealth);
    }
    play(anim)
    {
        this.image.play(anim)
    }
}



export class dummiePlayer extends dummieEntity {

    constructor(scene, x, y, sprite, spriteSword) {
        super(scene, x, y, sprite, "player");
        this.play("idle")
        this.weapon = scene.add.sprite(x, y, spriteSword);
        //scene.add.existing(this);
        scene.add.existing(this.weapon);
        this.weapon.setVisible(false);
        this.scene = scene;
        this.weapon.x = 0;
        this.weapon.y = 0;
        socket.on("playerMove", (data) => this.move(data.pos, data.flip));
        socket.on("playerAttack", (data) => this.attack(data.angle, data.offsetX, data.offsetY, data.weaponSprite));
        socket.on("playerHaveAttacked", () => this.weapon.setVisible(false));
    }
    move(pos, flip) {
        this.x = pos.x;
        this.y = pos.y;
        this.weapon.x = this.x + this.offsetX + 2;
        this.weapon.y = this.y + this.offsetY + 5;
        this.image.setFlipX(flip);

    }
    attack(angle, offsetX, offsetY, sprite) {
        this.weapon.setVisible(true);
        this.weapon.setTexture(sprite);
        this.weapon.setAngle(angle);
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

}

export class dummieEnemy extends dummieEntity{//Phaser.GameObjects.Sprite {

    constructor(scene, x, y, sprite, anim, enemyManager, id) {
        //super(scene, (x + 1.5) * scene.game.tileSize, (y + 1.5) * scene.game.tileSize, sprite);
        super(scene, (x + 1.5), (y + 1.5), sprite, id);
        scene.add.existing(this);
        this.enemyManager = enemyManager;
        if (anim === "idleLittleSpider") {
            anim = "idleSpider";
            this.setScale(0.5);
        }
        this.play(anim);
        this.id = id;
        this.setInteractive();
        socket.on("enemyMove", data => {
            if (data.id === this.id) this.move(data.pos, data.flip);
        })
        socket.on("enemyDead", id => {
            if (id === this.id) this.killDumie();
        })
        this.on("pointerdown", () => {
            if (!this.enemyManager.havePossesed) this.possesion();
        })
    }
    possesion() {
        socket.emit("enemyPossesed", this.id);
        this.enemyManager.havePossesed = true;
        this.setTint("0x" + "b0fdd2");

        this.key_D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.dir = { x: 0, y: 0 };
        //Teclas de movimiento, cambiar la dirección y moverse en esa direción
        this.key_A.on("down", () => {
            this.dir = { x: this.dir.x - 1, y: this.dir.y }
            socket.emit("possesedMoved", this.dir);
        });
        this.key_W.on("down", () => {
            this.dir = { x: this.dir.x, y: this.dir.y - 1 }
            socket.emit("possesedMoved", this.dir);
        });
        this.key_S.on("down", () => {
            this.dir = { x: this.dir.x, y: this.dir.y + 1 }
            socket.emit("possesedMoved", this.dir);
        })
        this.key_D.on("down", () => {
            this.dir = { x: this.dir.x + 1, y: this.dir.y }
            socket.emit("possesedMoved", this.dir);

        });
        this.key_A.on("up", () => {
            (this.dir.x < 0) ? this.dir.x += 1 : 0;
            socket.emit("possesedMoved", this.dir);
        });
        this.key_W.on("up", () => {
            (this.dir.y < 0) ? this.dir.y += 1 : 0;
            socket.emit("possesedMoved", this.dir);
        });
        this.key_S.on("up", () => {
            (this.dir.y > 0) ? this.dir.y -= 1 : 0;
            socket.emit("possesedMoved", this.dir);
        })
        this.key_D.on("up", () => {
            (this.dir.x > 0) ? this.dir.x -= 1 : 0;
            socket.emit("possesedMoved", this.dir);
        });
    }
    move(pos, flip) {
        this.x = pos.x;
        this.y = pos.y;
        this.image.setFlipX(flip);
    }
    killDumie() {
        this.destroy();
        this.setVisible(false);
    }
}
export class dummieProyectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite, angle, id, eventNamePrefix, anim) {
        super(scene, x, y, sprite);
        this.setAngle(angle);
        scene.add.existing(this);
        this.id = id;
        this.eventNamePrefix = eventNamePrefix;

        //solo tiene animación el radar y queremos que se vea transparente
        if (anim !== undefined) {
            this.setAlpha(0.5);
            this.play(anim);
        }
        socket.on("proyectileMove", (data) => { if (id === data.id && data.eventNamePrefix === this.eventNamePrefix) { this.x = data.x; this.y = data.y } })
        socket.on("proyectileDead", (data) => { if (data.id === this.id && this.eventNamePrefix === data.eventNamePrefix) this.destroy(false); })
    }
}
export class dummieTrap extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite, trapManager, id) {
        super(scene, (x + 1.5) * scene.game.tileSize, (y + 1.5) * scene.game.tileSize, "trap");
        scene.add.existing(this);
        this.trapManager = trapManager;
        this.id = id;
        this.alpha = 0.5;
        socket.on("trapDeactivated", id => {
            if (id === this.id) {
                this.play("trapAnim");
                this.once("animationcomplete-trapAnim", () => this.destroyTrap());
            }
        })
    }

    destroyTrap() {
        this.destroy();
        this.setVisible(false);
    }
}