let express = require('express');
let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let app = express();

app.get('/scrape', function (req, res) {
  // the URL we will scrape from
  url = 'https://www.worldwildlife.org/species/directory?direction=desc&sort=extinction_status';

  // request call
  request(url, function (error, response, html) {
    // check to make sure no errors
    if (!error) {
      // utilize the cheerio library to give us jQuery functionality
      const $ = cheerio.load(html);
      // variables to capture
      let commonName, scientificName, conservationStatus;
      var species = [];

      $('table tbody tr').each(function (i, elem) {
        // store data into a variable so we can easily see what's going on
        let dataList = $(this).children();

        if (dataList != null) {
          species[i] = {
            commonName: (dataList[0].children[0].firstChild) ? dataList[0].children[0].firstChild.nodeValue : "",
            scientificName: (dataList[1].children[0].firstChild) ? dataList[1].children[0].firstChild.nodeValue : "",
            conservationStatus: (dataList[2].children[0]) ? dataList[2].children[0].nodeValue : ""
          }
        }

      });

    }

    // built in 'fs' library
    fs.writeFile('output.json', JSON.stringify(species, null, 4), function (err) {
      console.log('File succcessfully written! - Check your project directory');
    });

    // just send out a message to the browser
    res.send(species);
  });

});

app.listen('8081');

console.log('on port 8081');

exports = module.exports = app;
