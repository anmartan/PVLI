
    import {livingEntity, player} from "./player.js";
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
            this.physics.world.setBounds(0,0,960,640)
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
        let hero = new player(this,50,50,2,"caballero_idle0");
        this.add.existing(hero);
        this.hero = hero; //por qué?

        //traer un delfin

        console.log(this.hero);
        this.hero.play("idle");
        this.hero.setScale(1.5,1.5); //no se si hace falta pero yo lo veo mejor creo
   },
    update: function(delta)
   {
        this.hero.handleLogic();
   }
   
};

export default scene;