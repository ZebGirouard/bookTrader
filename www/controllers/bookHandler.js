'use strict';

var Books = require('../models/books.js');
var Users = require('../models/users.js');
var https = require('https');

function BookHandler() {
    this.addBook = function(req, res) {
        console.log(req.params.bookName);
    };

	this.addBook = function (req, res) {
		var bookName = req.params.bookName.toLowerCase();
		console.log(bookName);
		//Check if stock already in chart list
		Books.findOne({book_name: bookName})
		.exec(function (err, result) {
			if (err) { throw err; }
			if (result) {
				res.json("Book already in DB.");						
			}
			else {
			    /*
		        https.get('https://www.highcharts.com/samples/data/jsonp.php?filename=' + symbol.toLowerCase() + '-c.json&callback=?',    function (response) {
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
				        if(fullResponse === "?();") {
				        	res.json("Failed to find stock with name: "+symbol);
				        }
				        // If everything checks out, add stock to list and chart
				        else {
				        */
							var book = new Books({name: bookName});
							book.save(function (err, data) {
							    console.log("Saving book...");
								if (err) throw(err);
								else res.json('Saved : ' + data );
							});			        	
				       /* }
				    });
				}).on('error', function(e) {
				    // Call callback function with the error object which comes from the request
				    res.json(e);
				});	*/		
			}
		});
	};    
}

module.exports = BookHandler;
