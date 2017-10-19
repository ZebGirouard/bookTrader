'use strict';
var jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    name: String,
    city: String,
    state: String
});

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

User.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

User.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.MY_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('User', User);