const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const path = require('path');

const { Server } = require('socket.io')

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(path.resolve("./public")))

io.on('connection',(socket)=> {
    console.log("connected", socket.id);
    socket.on('send-location',function(data){
        io.emit('recived-location',{id: socket.id,...data});
    })

    socket.on('disconnect', function(){
        io.emit('user-disconnected', socket.id);
    });
})



app.get('/',(req,res) => res.sendFile('./public/index.html'))



server.listen(port,() => {
    console.log(`listening on port ${port} `);
})
