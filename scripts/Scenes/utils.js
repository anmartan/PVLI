export class rec extends Phaser.GameObjects.Zone {
    constructor(scene) {
        let yPosInPixels = scene.game.tileSize * 5;
        super(scene, 0, yPosInPixels, scene.game.tileSize, scene.game.tileSize)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true)
        this.setOrigin(0, 0);
        this.tileSize = scene.game.tileSize;
        this.scene = scene;
    }
    setRecPos(size, exit) {
        let positionInTiles = (9 - size) / 2;
        if (exit) {
            positionInTiles = 10 - positionInTiles;
            this.body.debugBodyColor = "0x00ff00";
        }
        this.x = (positionInTiles) * this.tileSize;
    }
}

export class Life extends Phaser.GameObjects.Container {
    constructor(scene, x, y, player) {
        super(scene, x, y)
        scene.add.existing(this);
        this.scene = scene;
        this.player = player;
        for (let i = 0; i < this.player.health; i++) {

            this.add(new heart(scene, 16 * i, 0));
        }

    }
    loseHearts(points) {
        let health = (this.player.health < 0) ? 0 : this.player.health
        for (let i = 0; i < points; i++) {
            this.getAt(health + i).empty();
        }
    }
    gainHearts(points) {
        for (let i = 0; i < points; i++) {
            this.getAt(this.player.health - 1 - i).fill();
        }
    }
}
class heart extends Phaser.GameObjects.Image {
    constructor(scene, x, y, sprite = "full_Heart") {
        super(scene, x, y, sprite)
        {
            scene.add.existing(this);
            this.setOrigin(0, 0)
        }
    }
    fill() {
        this.setTexture('full_Heart');
    }
    empty() {
        this.setTexture('empty_Heart');
    }
}

export class healthBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, healthWidth, healthHeight = 2, baseColor = 0x4d1f34, fillColor = 0xd12e7d) {
        super(scene, x, y);
        scene.add.existing(this);
        this.baseHealthBar = new bar(scene,healthWidth, healthHeight, baseColor);
        this.actualHealthBar = new bar(scene,healthWidth, healthHeight, fillColor);
        this.add([this.baseHealthBar,this.actualHealthBar]);
    }
    modifyHealth(actualHealth, maxHealth) {
        let factor = actualHealth / maxHealth;
        this.actualHealthBar.fill(factor);
    }
}
class bar extends Phaser.GameObjects.Graphics
{
    constructor(scene,width,height,fillColor=0xFFF000)
    {
        super(scene);
        scene.add.existing(this);
        this.width=width;
        this.height=height;
        this.defaultFillColor = fillColor;
        this.fillStyle(fillColor,1);
        this.fillRect(0,0,this.width,this.height,false)
    }
    fill(factor)
    {
        if(true)this.clear();
        //this.fillStyle(0xfff000,1);
        this.fillRect(0, 0, this.width*factor, this.height); 
    }
}

export class Time {
    constructor(scene, x, y) {
        this.scene = scene;
        this.timeText = this.scene.add.text(x, y, "--:-- ", { font: "32px m5x7", fill: "#FFFFFF" });
        socket.on("second", (time) => this.tick(time));
    }


    tick(time) {
        if (time < 0) this.destroy();
        else if (time >= 0) {
            this.mins = Math.floor(time / 60);
            this.secs = time - (this.mins * 60);
        }
        this.timeText.text = this.zero(this.mins) + " : " + this.zero(this.secs);


    }

    //para que los segundos no se muevan de sitio y se carguen el texto cuando quedan menos de diez segundos de cada minuto
    //también se hace con los minutos aunque no haga falta
    zero(time) {
        if (time === 0) time = "00";
        else if (time < 10)
            time = "0" + time;
        return time;
    }
    setTimeToZero() {
        this.mins = 0;
        this.secs = 0;
        this.timeText.text = "00 : 00";
        socket.off("second")
    }

}

export class loadingBar {
    constructor(scene) {
        let progressBar = scene.add.graphics();
        let progressBox = scene.add.graphics();
        let width = scene.cameras.main.width;
        let height = scene.cameras.main.height;
        progressBox.fillStyle(0xff22ff, 0.1);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);


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
            y: height / 2,
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
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
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
