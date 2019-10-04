
const scene = {

    preload: function()
   {
       this.load.image("caballero", "../assets/player/knight_m_idle_anim_f0.png")
   },
    create: function()
   {
       this.player = this.add.image(50,50,"caballero");
       this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
       this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
       this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
       this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
   
       this.player.velocidad = 2; 
   },
    update: function(delta)
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
   
   }
   
};

export default scene;