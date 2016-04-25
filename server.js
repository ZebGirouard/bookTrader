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
  bodyParser = require('body-parser'),
  passport = require('passport');
  
require('dotenv').load();
var routes = require('./www/routes/index.js');
require('./www/config/passport');
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
router.use(bodyParser());
router.use(passport.initialize());
// Catch unauthorised errors
router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
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
