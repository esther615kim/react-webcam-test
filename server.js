const express = require('express');
const cors = require('cors');

const io = require('socket.io')({
    path:'/webrtc'
})

const app = express();
const port =8080;

app.use(cors());

app.get('/', (req,res)=> res.send("Hi"))

const server = app.listen(port,()=>{
    console.log("WebRTC App is listening");
})

io.listen(server);

const webRTCnamespace = io.of('/webRTCPeers'); //?

webRTCnamespace.on('connection',socket=>{
    console.log(socket.id);

    socket.emit('connection-success',{
        status:'connection-success',
        socketId:socket.id,
    })

    socket.on('disconnected',()=>{
        console.log(`${socket.id} has been disconnected`);
    })
})