'use strict';

var jwt = require('express-jwt');
var path = process.cwd();
var BookHandler = require(path + '/www/controllers/bookHandler.js');
var UserHandler = require(path + '/www/controllers/userHandler.js')

console.log(process.env.MY_SECRET);

var auth = jwt({
  secret: process.env.MY_SECRET,
  userProperty: 'payload'
});

module.exports = function (router) {
    var bookHandler = new BookHandler();
    var userHandler = new UserHandler();
    router.route('/:var(signup|login|myBooks|profile)?')
        .get(function(req, res) {
            res.sendFile(path + '/www/index.html');
        });
        
    router.route('/api/newBook/:bookName/:userName')
        .post(bookHandler.addBook);
        
    router.route('/api/requestBook/:bookId/:userEmail')
        .post(bookHandler.requestBook);

    router.route('/api/acceptTrade/:bookId')
        .post(bookHandler.acceptTrade);

    router.route('/api/books')
        .get(bookHandler.getBooks);    

    router.route('/api/profile/:email')
        .get(userHandler.profileRead) 
        .post(userHandler.profileSave);
    
    router.route('/api/signup')
        .post(userHandler.signUp); 
    
    router.route('/api/login')
        .post(userHandler.logIn);         
};