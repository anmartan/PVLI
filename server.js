let express = require('express')
const app = express(); // servidor de aplicaciones
const http = require('http').createServer(app); // servidor HTTP
const io = require('socket.io')(http); // Importamos `socket.io`
const port = 3000; // El puerto
var clients = [];
let players = [false,false]
let serverDungeon;
let serverInventory;

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
            players[0] = true;
            socket.emit("Role", {role: "Heroe"})

        }
         else 
         {
             players[1] = true;
             socket.emit("Role", {role: "AntiHeroe"})

         }

         if(players[0]===true && players[1]===true)
         {
            players[0] =false;
            players[1] =false;

            clients.forEach( (client) => 
            {
                client.emit('startMatch', {});
            })
        }
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
    socket.on("playerMove", data=>
    {
        clients.forEach( client => {client.emit("playerMove", data)});
    });
    socket.on("enemyMove", data=>
    {
        clients.forEach( client => {client.emit("enemyMove", data)});
    });
    socket.on("playerAttack", data =>
    {
        clients.forEach( client => {client.emit("playerAttack", data)});
    });
    socket.on("playerHaveAttacked", () =>
    {
        clients.forEach( client => {client.emit("playerHaveAttacked")});
    });
    socket.on("enemyDead", id =>
    {
        clients.forEach(client => {console.log("enemydead");client.emit("enemyDead",id)});
    });
    socket.on("changeRoom", data =>
    {
        clients.forEach(client => {client.emit("changeRoom",data)});
    });
    socket.on("trapDeactivated", id=> {console.log("trampamuerta");
    clients.forEach(client =>{client.emit("trapDeactivated",id)})});

    socket.on("enemySpawned", enemy =>
    {
        clients.forEach(client => {console.log ("Enemy Spawned : "+ enemy); client.emit("enemySpawned", enemy);});
    });
    
});



http.listen(port,() => {
    console.log('Servidor escuchando en el puerto', port);
});
let initHSocket = function (socket, serverDungeon) 
{

}

let initAHSocket = function (socket,serverDungeon) {

}
