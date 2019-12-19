let express = require('express')
const app = express(); // servidor de aplicaciones
const http = require('http').createServer(app); // servidor HTTP
const io = require('socket.io')(http); // Importamos `socket.io`
const port = 420; // El puerto
var clients = [];

let timer;
let heroQueue=[];
let antiHeroQueue=[];
let games=[];

let checkGame = function checkGame() 
{
    //Si ambas colas tienen al menos un jugador en ellas
    if(heroQueue[0]!==undefined && antiHeroQueue[0]!==undefined)
    {
        //Creamos una nueva partida con ambos y los quitamos de sus colas
        let game=new partida(heroQueue[0],antiHeroQueue[0]);
        games.push(game);
        game.start();
        heroQueue.shift();
        antiHeroQueue.shift();
    }
}

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


class partida
{
    constructor(hero,antiHero)
    {
        this.hero=hero;
        this.antiHero=antiHero;

        makeSockets(this.hero,this.antiHero,this);
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
    toBoth(event, param)
    {
        this.hero.emit (event, param);
        this.antiHero.emit(event, param);
    }
    start()
    {
        this.hero.emit('startMatch', {});;
        this.antiHero.emit('startMatch', {});;
        this.timer = new Timer (120, "second", "continuar", this)
    }
    checkDungeonRun()
    {
        if(this.inventory!==undefined && this.dungeon!=undefined)
        {
            clearInterval(this.timer.interval);
            this.toBoth("startDung",{dungeon:this.dungeon,inventory:this.inventory});
        }
    }

    
    
}

let makeSockets=function (hero, antiHero,partida)
{
    hero.on("playerMove", data=>
    {
        antiHero.emit("playerMove", data);
    });
    hero.on("enemyMove", data=>
    {
        antiHero.emit("enemyMove", data);
    });
    hero.on("playerAttack", data =>
    {
        antiHero.emit("playerAttack", data);
    });
    hero.on("playerHaveAttacked", () =>
    {
        antiHero.emit("playerHaveAttacked");
    });
    hero.on("enemyDead", id =>
    {
        antiHero.emit("enemyDead", id);
    });
    hero.on("changeRoom", data =>
    {
        antiHero.emit("changeRoom", data);
    });
    hero.on("trapDeactivated", id=> {
        antiHero.emit("trapDeactivated", id);
    });

    hero.on("enemySpawned", enemy =>
    {
        antiHero.emit("enemySpawned", enemy);
    });

    hero.on("deadHero",()=>{antiHero.emit("deadHero")});
    /*let timeUp=(socketA,socketB,partida)=>
    {
        socketA.on("timeUp", ()=>
        {
            socketA.timeUp=true;
            if(socketB.timeUp)
            {
                clearInterval(partida.timer.interval)
                partida.toBoth("continuar");
            }
        })
    }
    timeUp(hero,antiHero,partida);
    timeUp(antiHero,hero,partida);*/

    antiHero.on("enemyPossesed",id=>{hero.emit("enemyPossesed",id);});
    antiHero.on("possesedMoved",dir=>{hero.emit("possesedMoved",dir);console.log("moved")});

    hero.on("finished",    (inventory)   =>{
        hero.finished=true;
        partida.setInventory(inventory);
    });
    antiHero.on("finished",(dungeon)=>{
        antiHero.finished=true;
        partida.setDungeon(dungeon);
    });

}


app.get('/', function(req, res){
    res.sendFile(__dirname + '/docs/index.html');
});
app.use('/docs/', express.static('docs'))
app.use('/scripts/', express.static('scripts'))
app.use('/assets/', express.static('assets'))


io.on('connection', socket => {
    console.log('a user connected');
    clients.push(socket); // metemos el socket en el array

    socket.on('disconnect', () => {
    console.log('a user disconnected');
    clients.splice(clients.indexOf(socket), 1); // lo sacamos del array
    });

    socket.on("start", player =>{
        if(player==="Hero")
        {
             heroQueue.push(socket);
             socket.emit("Role", {role: "Heroe"})
        }
        else 
         {
             antiHeroQueue.push(socket);
             socket.emit("Role", {role: "AntiHeroe"})
         }
         checkGame();
    });
});



http.listen(port,() => {
    console.log('Servidor escuchando en el puerto', port);
});

