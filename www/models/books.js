'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var Book = new Schema({
    volumeInfo: {
        title: String,
        authors: Array,
        imageLinks: {
            smallThumbnail: String,
            thumbnail: String
        }
    },
    addedBy: String,
    description: String,
    requester: String
});

module.exports = mongoose.model('Book', Book);