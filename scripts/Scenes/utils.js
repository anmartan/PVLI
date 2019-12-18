export class rec extends Phaser.GameObjects.Rectangle
{
    constructor(scene)
    {
        let yPosInPixels =  scene.game.tileSize*5;
        super(scene,0, yPosInPixels, scene.game.tileSize, scene.game.tileSize)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.debugBodyColor="0x00ff00";
        this.body.setImmovable(true)
        this.setOrigin(0,0);
        this.tileSize=scene.game.tileSize;
        this.scene=scene;
    }
    setRecPos(size, exit)
    {
        let positionInTiles=(9-size)/2;
        if(exit)positionInTiles=10-positionInTiles;
        this.x = (positionInTiles)*this.tileSize;
    }

}

export class Life 
{
    constructor(scene, player)
    {
        this.scene = scene;
        this.player = player;
        this.player.health = player.health;
        this.hearts = new Array();
        this.lastHeartAlive= this.player.health-1;

        for(let i=0; i< this.player.health; i++)
        {
            this.scene.add.sprite(16 + 16*i, 32, "empty_Heart")
            let heart;
            heart = this.scene.add.sprite(16 + 16*i, 32, "full_Heart");
            let id= this.hearts.push(heart);
        }
    }
    loseHearts(points)
    {
        for (let i = 0; i< points; i++)
        {
            this.hearts[this.lastHeartAlive].setVisible(false);
            this.lastHeartAlive --;
        }
    }
    gainHearts(points)
    {
        for(let i= 0; i< points; i++)
        {
            this.hearts[this.lastHeartAlive +1].setVisible(true);
            this.lastHeartAlive ++;
        }
    }
}
export class Time
{
    constructor(scene, x, y, timeInSec)
    {
        this.scene = scene;
        this.timeInSeconds = timeInSec;
        this.timeText = this.scene.add.text(x, y, this.zero(this.timeInSeconds/60) + " : " + this.zero(this.timeInSeconds%60) , {font:"32px m5x7", fill:"#FFFFFF"});

    }


    tick()
    {
        this.timeInSeconds--;
        console.log(this.timeInSeconds);
        let minutes = Math.floor (this.timeInSeconds/ 60);
        let seconds  =this.timeInSeconds % 60;
        this.timeText.text = this.zero(minutes) + " : " + this.zero(seconds);

        if(this.timeInSeconds === 0) destroy();

    }

    //para que los segundos no se muevan de sitio y se carguen el texto cuando quedan menos de diez segundos de cada minuto
    //también se hace con los minutos aunque no haga falta
    zero(sec)
    {
        if(sec<10)
            sec = "0" +sec;
        return sec;
    }

    destroy()
    {
        this.timeText.text = "00 : 00";
        socket.emit("timeUp");
    }
}
