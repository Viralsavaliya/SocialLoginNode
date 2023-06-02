require('dotenv').config();
require('./config/db');

const express = require('express');
const app = express();
const port = 3000;
const user = require('./routers/user');
const admin = require('./routers/admin/adminrouter');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use('/', express.static(path.join(__dirname, '/uploads')));

app.use('/api', cors(), user);
app.use('/admin', cors(), admin);

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3001",
        methods:["GET","POST"],
    }
});

// const socketHandler = require('./controller/chatController');


io.on('connection', (socket) => {
  console.log(socket.id, 'connection');
    socket.on('send_message',(data)=>{
    console.log(data);
    socket.broadcast.emit('recive_message', data)
    })
  
  socket.on('disconnect', () => {
    console.log('Disconnect');
  });
});

server.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
  });
  


// io.use(function (socket, next) {
//     sessionMiddleware(socket.request, {}, next);
// })
// io.use(function (socket, next) {
//     if (typeof socket.req.user === "undefined" || !socket.req.user) {
//         const error = new Error("You are not authorized")
//         return next(error)
//     }
//     next()
// })   



