'use strict';
var passport = require('passport'),
	User = require('../models/users.js');

function UserHandler() {
	this.signUp = function (req, res) {
		User.findOne({email: req.body.email})
		.exec(function (err, result) {
			if (err) { throw err; }
			if (result) {
				res.json("User already in DB.");						
			}	
			else {
				var user = new User();
				
				user.email = req.body.email;
				
				user.setPassword(req.body.password);
				
				user.save(function(err) {
				  if (err) { throw err; }
				  var token;
				  token = user.generateJwt();
				  res.status(200);
				  res.json({
				    "token" : token,
				    "message" : "User successfully registered."
				  });
				});						
			}
		});
	};

	this.logIn = function (req, res) {
	  passport.authenticate('local', function(err, user, info){
	    var token;
	
	    // If Passport throws/catches an error
	    if (err) {
	      res.status(404).json(err);
	      return;
	    }
	
	    // If a user is found
	    if(user){
	      token = user.generateJwt();
	      res.status(200);
	      res.json({
	        "token" : token,
	        "message" : "User successfully authenticated."
	      });
	    } else {
	      // If user is not found
	      res.status(401).json(info);
	    }
	  })(req, res);
	};	
}

module.exports = UserHandler;
