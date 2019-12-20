import { player } from "../Player and Items/player.js";
import { zombie, enemyManager } from "../Enemies and World/enemy.js";
import { tilemap } from '../Enemies and World/tilemap.js';
import { spikes, trapManager } from "../Enemies and World/traps.js";
import { rec } from "./utils.js";

const scene = {
    key: "DungeonRun",
    createRec: function () {

    },
    preload: function () { },
    create: function () {
        //Cargar tile map
        this.tileMap = new tilemap(this, "tiles2", this.game.tileSize, 1, "tilesImage");
        this.actual = 0;
        this.tileMap.changeRoom(this.game.dungeon.rooms[this.actual].size);
        //--------------------------------------------------------//


        let actualRoom = this.game.dungeon.rooms[this.actual];
        let size = actualRoom.size;

        let entranceRec = new rec(this);
        this.exitRec = new rec(this);
        entranceRec.setRecPos(size, false);
        this.exitRec.setRecPos(size, true);

        this.enemies = new enemyManager(this, actualRoom.enemies.enemiesInfo);
        this.hero = new player(this, ((11.5 - (size)) / 2) * this.game.tileSize, (this.game.tileSize * 5) + 2); //x debería ser 48 e y debería ser 80
        this.enemies.summonEnemies(this, this.hero, this.hero.weaponManager.weaponGroup, this.tileMap.Walls); //invoca a los enemigos, y activa las físicas y colisiones
        this.enemyGroup = this.enemies.enemies.getChildren();

        this.traps = new trapManager(actualRoom.traps.traps);
        this.traps.CreateTraps(this, this.hero, this.tileMap.Walls);

        this.physics.add.collider(this.hero, this.tileMap.Walls);
        this.physics.add.collider(this.hero, entranceRec);
        this.exitRec.setInteractive();
        this.exitRec.on("pointerdown", () => this.colExit())
        this.col = this.physics.add.collider(this.hero, this.exitRec, () => {
            this.colExit();
        })
        this.finish = (bool) => {
            socket.emit("DungeonFinished");
            this.toloco = true;
            console.log(this.physics.world.removeCollider(this.col))
            this.game.scene.stop("DungeonRun");
            bool ? this.game.endMessage = "Has ganado" : this.game.endMessage = "Has perdido";
            this.game.player = "Ffo";
            this.game.scene.start("EndGame");
        }
        this.colExit = function () {
            console.error(this.actual);
            if (this.enemyGroup.length === 0) {
                this.actual += 1;
                if (this.actual >= 3) {

                    if (!this.toloco) {
                        this.hero.x = ((11.5 - (size)) / 2) * this.game.tileSize;
                        this.time.delayedCall(100, () => this.finish(true));
                        socket.emit("changeRoom");
                    }
                }
                else {
                    //Informar al servidor de que ha habido un cambio de habitación
                    socket.emit("changeRoom");

                    //En caso de que quede algún enemigo vivo, lo ocultamos de la pantalla
                    this.enemies.hideAllAlive();

                    //Actualizamos la habitación a la siguiente
                    let actualRoom = this.game.dungeon.rooms[this.actual];
                    this.enemies = new enemyManager(this, actualRoom.enemies.enemiesInfo);
                    this.traps = new trapManager(actualRoom.traps.traps);
                    let size = actualRoom.size;
                    this.tileMap.changeRoom(size);

                    //cambiamos la posición del héroe y de los colliders de salida y entrada
                    this.hero.x = ((11.5 - (size)) / 2) * this.game.tileSize;
                    this.hero.y = (this.game.tileSize * 5) + 2;
                    entranceRec.setRecPos(size, false);
                    this.exitRec.setRecPos(size, true);

                    //Creamos las nuevas trampas y enemigos
                    this.enemies.summonEnemies(this, this.hero, this.hero.weaponManager.weaponGroup, this.tileMap.Walls); //invoca a los enemigos, y activa las físicas y colisiones
                    this.traps.CreateTraps(this, this.hero, this.tileMap.Walls);
                }
            }
        }
    },
    update: function (delta) {
        if (this.hero !== undefined) this.hero.handleLogic();
    }

};

export default scene;