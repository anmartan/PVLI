let express = require('express')
const app = express(); // servidor de aplicaciones
const http = require('http').createServer(app); // servidor HTTP
const io = require('socket.io')(http); // Importamos `socket.io`
const port = 420; // El puerto
//var clients = [];

let heroQueue=[];
let antiHeroQueue=[];
let matches=[];

class Timer
{
    constructor(duration,updateEvent,finishEvent, partida, freq = 1000)
    {
        this.freq = freq;
        this.time = duration;
        this.updateEvent = updateEvent;
        this.finishEvent = finishEvent;
        this.partida = partida;
        this.interval = setInterval(()=>this.tick(),this.freq)
    }
    tick()
    {
        this.partida.toBoth(this.updateEvent, this.time)//un metodo que mande el mismo mensaje para ambos
        this.time--;//resta un segundo al contador
        if(this.time<0)
        {
            clearInterval(this.interval);
            this.partida.toBoth(this.finishEvent, this.time);
        }
    }
    clearTimer(){this.time=0;};
}

let checkForMatch = function checkGame() 
{
    //Si ambas colas tienen al menos un jugador en ellas
    if(heroQueue[0]!==undefined && antiHeroQueue[0]!==undefined)
    {
        //Creamos una nueva partida con ambos y los quitamos de sus colas
        let game =new match(heroQueue[0],antiHeroQueue[0]);
        let id = matches.push(game);
        id--;
        console.log("Empezando partida con ID: "+id);
        game.setId(id);
        game.start();
        heroQueue.shift();
        antiHeroQueue.shift();
    }
}

class match
{
    constructor(hero,antiHero)
    {
        this.hero=hero;
        this.hero.queue=undefined;
        this.antiHero=antiHero;
        this.antiHero.queue=undefined;
        this.makeSockets(this.hero,this.antiHero,this);
    }
    setId(id)
    {
        this.matchID=id;
        this.hero.matchID=id;
        this.antiHero.matchID=id;
    }
    toBoth(event, param)
    {
        this.hero.emit (event, param);
        this.antiHero.emit(event, param);
    }
    start()
    {
        this.toBoth("startMatch");
        this.timer = new Timer (120, "second", "continuar", this)
    }
    checkDisconect(socket)
    {
        if(socket===this.antiHero)
        {
            this.hero.emit("enemyDisconected");
        }
        else if (socket===this.hero)
        {
            this.antiHero.emit("enemyDisconected");
        }
    }
    setDungeon(dungeon)
    {
        this.dungeon=dungeon;
        this.checkDungeonRun();
    }
    setInventory(inventory)
    {
        this.inventory=inventory;
        this.checkDungeonRun();
    }
    checkDungeonRun()
    {
        if(this.inventory!==undefined && this.dungeon!=undefined)
        {
            clearInterval(this.timer.interval);
            this.toBoth("startDung",{dungeon:this.dungeon,inventory:this.inventory});
        }
    }
    makeSockets(hero, antiHero,partida)
    {
        let heroToAntihero=(event)=>{hero.on(event,data =>{antiHero.emit(event,data)})}
        heroToAntihero("playerMove");
        heroToAntihero("enemyMove");
        heroToAntihero("playerAttack");
        heroToAntihero("playerHaveAttacked");
        heroToAntihero("enemyDead");
        heroToAntihero("changeRoom");
        heroToAntihero("trapDeactivated");
        heroToAntihero("enemySpawned");
        heroToAntihero("deadHero");
        heroToAntihero("entityChangeHealth");
        hero.on("newProyectile",data=>
        {
            antiHero.emit("newProyectile",data);
        });
        hero.on("proyectileDead",data=>
        {
            antiHero.emit("proyectileDead",data);
            console.log("PROYECTILE DEAD")
        });
        heroToAntihero("proyectileMove");
        antiHero.on("enemyPossesed",id=>{hero.emit("enemyPossesed",id);});
        antiHero.on("possesedMoved",dir=>{hero.emit("possesedMoved",dir)});

        hero.on("finished",    (inventory)   =>{
            hero.finished=true;
            partida.setInventory(inventory);
        });
        antiHero.on("finished",(dungeon)=>{
            antiHero.finished=true;
            partida.setDungeon(dungeon);
        });
    }
    
}




app.get('/', function(req, res){
    res.sendFile(__dirname + '/docs/index.html');
});
app.use('/docs/', express.static('docs'))
app.use('/scripts/', express.static('scripts'))
app.use('/assets/', express.static('assets'))


io.on('connection', socket => {
    console.log('Un usuario se ha conectado');
    //clients.push(socket); // metemos el socket en el array

    socket.on('disconnect', () => 
    {
        console.log('Un usuario se ha desconectado');
        //clients.splice(clients.indexOf(socket), 1);
        if(socket.queue !== undefined)
        {
            socket.queue.splice(socket.queueId);
        }
        if (socket.matchID !== undefined)
        {
            matches[socket.matchID].checkDisconect(socket);
            console.log("Eliminando de partida["+socket.matchID+ "]");
        }
    });

    socket.on("start", player =>{
        if(player==="Hero")
        {
             let queueId = heroQueue.push(socket)-1;
             console.log("Añadiendo socket en cola["+queueId+"]");
             socket.queueId=queueId;
             socket.queue=heroQueue;
             socket.emit("Role", {role: "Heroe"})
        }
        else 
         {
            let queueId = antiHeroQueue.push(socket)-1;
            console.log("Añadiendo socket en cola["+queueId+"]");
             socket.queueId=queueId;
             socket.queue=antiHeroQueue;
             socket.emit("Role", {role: "AntiHeroe"})
         }
         checkForMatch();
    });
});



http.listen(port,() => {
    console.log('Servidor escuchando en el puerto', port);
});

