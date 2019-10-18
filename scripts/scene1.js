
const scene = {

    preload: function()
   {
       this.load.image("caballero_idle0", "../assets/player/knight_m_idle_anim_f0.png")
       this.load.image("caballero_idle1", "../assets/player/knight_m_idle_anim_f1.png")
       this.load.image("caballero_idle2", "../assets/player/knight_m_idle_anim_f2.png")
       this.load.image("caballero_idle3", "../assets/player/knight_m_idle_anim_f3.png")
   },
    create: function()
    {
        
        this.anims.create({
         key: 'idle',
         frames:
         [
             {key: "caballero_idle0"},
             {key: "caballero_idle1"},
             {key: "caballero_idle2"},
             {key: "caballero_idle3"},
         ],
         frameRate: 10,
         repeat: -1,
         });
       this.player = this.add.sprite(50,50,"caballero").play("idle");
       this.player.setScale(1.5,1.5); //no se si hace falta pero yo lo veo mejor creo
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
           this.player.setFlipX(false);

        }
        if(this.key_A.isDown)
        {
            this.player.x-= this.player.velocidad;
            this.player.setFlipX(true);
           
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