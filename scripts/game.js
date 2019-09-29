var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scale: {   //Esto sirve para centrar el canvas
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALY
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }

}

var game = new Phaser.Game(config);

function preload()
{
    this.load.image("caballero", "../assets/player/knight_m_idle_anim_f0.png")
};
function create()
{
    this.player = this.add.image(50,50,"caballero");
    this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.player.velocidad = 2; 
};
function update(delta)
{
    if(this.key_D.isDown)
    {
        this.player.x+= this.player.velocidad;
    }
    if(this.key_A.isDown)
    {
        this.player.x-= this.player.velocidad;
    }
    if(this.key_W.isDown)
    {
        this.player.y-= this.player.velocidad;
    }
    if (this.key_S.isDown)
    {
        this.player.y+= this.player.velocidad;
    }

};

