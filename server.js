//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http'),
  path = require('path'),
  mongoose = require("mongoose"),
  socketio = require('socket.io'),
  express = require('express'),
  routes = require('./www/routes/index.js');

require('dotenv').load();

var mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(mongoURI);

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();

router.use(express.static(path.resolve(__dirname, 'www')));
routes(router);

var server = http.createServer(router);
var io = socketio.listen(server);


io.on('connection', function (socket) {
    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      io.sockets.emit('message', {message: "Message received: " + text});
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
