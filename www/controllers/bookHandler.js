'use strict';

var Books = require('../models/books.js');
var https = require('https');

function BookHandler() {

	this.addBook = function (req, res) {
		var bookName = req.params.bookName;
		var userName = req.params.userName;
		console.log(req.params);
		//Check if book already in given user's list
		Books.findOne({title: bookName, addedBy: userName})
		.exec(function (err, result) {
			if (err) { throw err; }
			if (result) {
				res.json("Book already in DB.");						
			}
			else {
		        https.get('https://www.googleapis.com/books/v1/volumes?q=' + encodeURI(bookName) + '+intitle&maxResults=5',    function (response) {
				    var bodyChunks = [];
				
				    response.on('data', function(chunk)
				    {
				        // Store data chunks in an array
				        bodyChunks.push(chunk);
				    }).on('error', function(e)
				    {
				        // Call callback function with the error object which comes from the response
				        res.json(e);
				    }).on('end', function()
				    {
				        // Check for real data in the concatenated chunks parsed as a string
				        var fullResponse = Buffer.concat(bodyChunks).toString('utf8');
				        /*
				        if(fullResponse === "?();") {
				        	res.json("Failed to find stock with name: "+symbol);
				        }*/
				        // If everything checks out, add stock to list and chart
				        //else {
				        	if (JSON.parse(fullResponse).items) {
				        		var response = JSON.parse(fullResponse).items[0];
        	        	response.addedBy = userName;
        	        	console.log(response);
		        				var book = new Books(response);
		        				console.log(book);
		        				book.save(function (err, data) {
		        				  console.log("Saving book...");
		        					if (err) res.json(err);
		        					else res.json( data );
		        				});		
				        	}	else {
				        		res.json ({message: 'No book found'});
				        	}      	
				       // }
				    });
				}).on('error', function(e) {
				    // Call callback function with the error object which comes from the request
				    res.json(e);
				});		
			}
		});
	};    
	
	this.requestBook = function(req, res) {
		var requesterEmail = req.params.userEmail;
		var bookId = req.params.bookId;
		Books.findOneAndUpdate({_id: bookId}, {$set: {"requester": requesterEmail}}, {new: true})
		.exec(function (err, result) {
			if (err) { throw err; }
			res.json(result);						
		});	
	};

	this.acceptTrade = function(req, res) {
		var bookId = req.params.bookId;
		Books.findOneAndUpdate({_id: bookId}, {$set: {"accepted": true}}, {new: true})
		.exec(function (err, result) {
			if (err) { throw err; }
			console.log(result);
			res.json(result);						
		});	
	};
	
	this.getBooks = function(req,res) {
		Books.find()
		.exec(function (err, result) {
			if (err) { throw err; }
			res.json(result);						
		});
	};
}

module.exports = BookHandler;
