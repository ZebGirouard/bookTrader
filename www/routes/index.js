'use strict';

var path = process.cwd();
var BookHandler = require(path + '/www/controllers/bookHandler.js');

module.exports = function (router) {
    var bookHandler = new BookHandler();
    router.route('/')
        .get(function(req, res) {
            res.sendFile(path + 'index.html');
        });
        
    router.route('/api/newBook/:bookName')
        .post(bookHandler.addBook);
};