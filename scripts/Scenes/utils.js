export class rec extends Phaser.GameObjects.Rectangle
{
    constructor(scene)
    {
        let yPosInPixels =  scene.game.tileSize*5;
        super(scene,0, yPosInPixels, scene.game.tileSize, scene.game.tileSize)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true)
        this.setOrigin(0,0);
        this.tileSize=scene.game.tileSize;
        this.scene=scene;
    }
    setRecPos(size, exit)
    {
        let positionInTiles=(9-size)/2;
        if(exit){positionInTiles=10-positionInTiles;
        this.body.debugBodyColor="0x00ff00";}

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
            if(this.lastHeartAlive >= 0)
                this.hearts[this.lastHeartAlive].setVisible(false);
            this.lastHeartAlive --;
        }
    }
    gainHearts(points)
    {
        for(let i= 0; i< points; i++)
        {
            if(this.lastHeartAlive +1 < this.player.maxHealth)
            {
                console.log("Aumento mi salud porque puedo")
            this.hearts[this.lastHeartAlive+1].setVisible(true);
            this.lastHeartAlive ++;
            }
            console.log(this.lastHeartAlive)
        }
    }
}
export class Time
{
    constructor(scene, x, y, minutes, seconds)
    {
        this.scene = scene;
        //this.mins = Math.floor(seconds/60);
        //this.secs = Math.ceil(seconds% 60);

        //this.mins = minutes;
        //this.secs = seconds;
        this.timeText = this.scene.add.text(x, y, "--:-- " , {font:"32px m5x7", fill:"#FFFFFF"});

    }


    tick(time)
    {
        //this.secs --;
        console.log(time);
        if(time <= 0) this.destroy();
        else if (time > 0)
        {
            this.mins = Math.floor(time/60);
            this.secs = time-(this.mins*60);
        }
        this.timeText.text = this.zero(this.mins) + " : " + this.zero(this.secs);


    }

    //para que los segundos no se muevan de sitio y se carguen el texto cuando quedan menos de diez segundos de cada minuto
    //también se hace con los minutos aunque no haga falta
    zero(time)
    {
        if(time === 0) time = "00";
        else if(time<10)
            time = "0" + time;
        return time;
    }
    setTimeToZero()
    {
        this.mins = 0;
        this.secs = 0;
        this.timeText.text = "00 : 00";
    }
    destroy()
    {
        this.setTimeToZero();
        socket.emit("timeUp");
    }
}

export class loadingBar
{
    constructor(scene)
    {
        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        let width = scene.cameras.main.width;
        let height = scene.cameras.main.height;
        progressBox.fillStyle(0xff22ff, 0.1);
        progressBox.fillRect(width/2-160, height/2-25, 320, 50);
        

        let loadingText = scene.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ff00ff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        let percentText = scene.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#880088'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        let assetText = scene.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#880088'
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        scene.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xff00ff, 1);
            progressBar.fillRect(width/2-150, height/2-15, 300 * value, 30);
        });
        
        scene.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        scene.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }
}
