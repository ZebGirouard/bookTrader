//
// A simple book trading app
//
var http = require('http'),
  path = require('path'),
  mongoose = require("mongoose"),
  express = require('express'),
  bodyParser = require('body-parser'),
  passport = require('passport');
  
require('dotenv').load();
var routes = require('./www/routes/index.js');
require('./www/config/passport');
var mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(mongoURI);

var router = express();

router.use(express.static(path.resolve(__dirname, 'www')));
router.use(bodyParser());
router.use(passport.initialize());
// Catch unauthorized errors
router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
routes(router);

var server = http.createServer(router);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
