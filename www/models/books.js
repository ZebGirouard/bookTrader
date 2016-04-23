'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var Book = new Schema({
    name: String,
    img_src: String,
    requester: String,
    provider: String
});

module.exports = mongoose.model('Book', Book);