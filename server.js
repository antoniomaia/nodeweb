const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
const fse = require('fs-extra');
const app = express();

app.get('/species', function (req, res) {
  // the URLs we will extract data from
  urls = [
    'https://www.worldwildlife.org/species/directory?direction=desc&sort=extinction_status',
    'https://www.worldwildlife.org/species/directory?direction=desc&page=2&sort=extinction_status'
  ];

  let result = {
    species: []
  };
  function parse(html) {
    let commonName, scientificName, conservationStatus;

    const $ = cheerio.load(html);

    $('table tbody tr').each(function (i, elem) {
      // store data into a variable so we can easily see what's going on
      let dataList = $(this).children();

      if (dataList != null) {
        result.species.push({
          commonName: (dataList[0].children[0].firstChild) ? dataList[0].children[0].firstChild.nodeValue : "",
          scientificName: (dataList[1].children[0].firstChild) ? dataList[1].children[0].firstChild.nodeValue : "",
          conservationStatus: (dataList[2].children[0]) ? dataList[2].children[0].nodeValue : ""
        });
      }

    });

    return result;
  }

  let append = file => result => fse.outputFile(file, JSON.stringify(result, null, 4))

  urls.forEach(url => {
    rp(url)
      .then(parse)
      .then(append('output.json'))
      .then(() => console.log('Success'))
      .catch(err => console.log('Error: ', err));
  })

  res.send('Check your console!')

})

app.listen('8081');

console.log('on port 8081');

exports = module.exports = app;
