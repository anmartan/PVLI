let express = require('express')
const app = express(); // servidor de aplicaciones
const http = require('http').createServer(app); // servidor HTTP
const io = require('socket.io')(http); // Importamos `socket.io`
const port = 420; // El puerto
var clients = [];
let players = [false,false]

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

let serverDungeon;
let serverInventory;

class partida
{
    constructor(hero,antiHero)
    {
        this.hero=hero;
        this.antiHero=antiHero;
        makeSockets(this.hero,this.antiHero);
    }
    setDungeon(dungeon)
    {
        this.dungeon=dungeon;
    }
    setInventory(inventory)
    {
        this.inventory=inventory;
    }
    start()
    {
        this.hero.emit('startMatch', {});;
        this.antiHero.emit('startMatch', {});;
        timer =  setInterval(() => this.sendTime(), 1000);
    }

    sendTime()
    {
        this.hero.emit ("second");
        this.antiHero.emit("second");
    }
    
}

let makeSockets=function (hero, antiHero)
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

    
    hero.on("timeUp", ()=>
    {
        clearInterval(timer);
        timer = 0;
        antiHero.emit("changeScene");
        hero.emit("changeScene");
    })
    
    antiHero.on("enemyPossesed",id=>{hero.emit("enemyPossesed",id);});
    antiHero.on("possesedMoved",dir=>{hero.emit("possesedMoved",dir);console.log("moved")});
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

    socket.on("finished", data =>
    {
        if(data.rooms === undefined)
        {
            players[1] = true;
            serverInventory = data;
        }
        else 
        {
            serverDungeon = data;
            players[0]=true;
        }
        if(players[0]==true && players[1]==true)
        {
            players[0] =false;
            players[1] =false;

            clients.forEach( (client) => 
            {
                client.emit('startDung', serverDungeon, serverInventory);
            })
        }

    });

    socket.on ("second", ()=>
    {
        clients.forEach((client) =>
        {
            client.emit("secondPassed");
        })
    })


    socket.on("deadHero", ()=> console.log("Héroe muerto"));
});



http.listen(port,() => {
    console.log('Servidor escuchando en el puerto', port);
});

