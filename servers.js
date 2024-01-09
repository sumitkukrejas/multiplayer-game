const express =  require('express');
const app = express();
app.use(express.static(__dirname+'/public'));
const expressServer = app.listen(5500);
const socketio = require('socket.io');
const io = socketio(expressServer);

//creates servers
module.exports = {app, io};
