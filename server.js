var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
  // the URL we will scrape from
  url = 'http://www.imdb.com/title/tt0133093/';

  // request call
  request(url, function(error, response, html) {
    // check to make sure no errors
    if (!error) {
      // utilize the cheerio library to give us jQuery functionality
      var $ = cheerio.load(html);
      console.log("r");
      // variables to capture
      var title, release, rating;
      var json = {
        title: "",
        release: "",
        rating: ""
      };

      $('.title_wrapper').filter(function() {
        // store data into a variable so we can easily see what's going on
        var data = $(this);
        title = data.children().first().text();
        var regExp = /\(([^)]+)\)/;
        release = regExp.exec(title);
        json.title = title.split('(')[0].trim();
        json.release = release[1].trim();
      });

      $('.ratingValue').filter(function() {
        var data = $(this);
        rating = data.text();
        json.rating = rating.split(/\n/)[1].trim();
      });
    }

// built in 'fs' library
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File succcessfully written! - Check your project directory');
    });

    // just send out a message to the browser
    res.send(json);
  });
});

app.listen('8081');

console.log('on port 8081');

exports = module.exports = app;
