const express = require('express');
const app = express();
app.use(express.static('public'));

const {Server} = require('socket.io');
const http = require('http');
const server = http.createServer(app);

const io = new Server(server);
const port = process.env.PORT;

let name_list = new Set();
function generate4DigitUUID() {
    return Math.floor(1000 + Math.random() * 9000);
}
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.on('connection',(socket)=>{
    socket.on('name',(user)=>{
        if(name_list.has(user)){
            user = user + generate4DigitUUID();
        }
        io.emit('name', (user));
        console.log(user+" has joined the session");
        name_list.add(user)
    });

    socket.on('message',(chat)=>{
        io.emit('message',(chat));
    });
});

server.listen(port,()=>{
    console.log(`Server is listening at ${port}`);
});