var express = require('express');
var fs = require ('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){
  // the URL we will scrape from
  url = 'http://www.imdb.com/title/tt0133093/';

// request call
request(url, function(error, response, html){
  // check to make sure no errors
  if(!error){
    // utilize the cheerio library to give us jQuery functionality
    var $ = cheerio.load(html);

    // variables to capture
    var title, release, rating;
    var json = { title : "", release : "", rating : ""};
  }
});

});

app.listen('8081');

console.log('on port 8081');

exports = module.exports = app;
