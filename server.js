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

  let speciesDirectory = [];

  function parse(html) {
    let commonName, scientificName, conservationStatus;

    const $ = cheerio.load(html);

    $('table tbody tr').each(function (i, elem) {
      // store data into a variable so we can easily see what's going on
      let dataList = $(this).children();

      if (dataList != null) {
        speciesDirectory.push({
          commonName: (dataList[0].children[0].firstChild) ? dataList[0].children[0].firstChild.nodeValue : "",
          scientificName: (dataList[1].children[0].firstChild) ? dataList[1].children[0].firstChild.nodeValue : "",
          conservationStatus: (dataList[2].children[0]) ? dataList[2].children[0].nodeValue : ""
        });
      }

    });

    return speciesDirectory;
  }

  let append = file => speciesDirectory => fse.outputFile(file, JSON.stringify(speciesDirectory, null, 4));

  let promises = [];
  function extractSpecies(url) {
    promises.push(
      rp(url)
        .then(parse)
        .then(append('output.json'))
        .then(() => console.log('Success'))
        .catch(err => console.log('Error: ', err))
    );
  }

  urls.forEach(url => {
    console.log("calling extractSpecies");
    extractSpecies(url);
  });

  Promise.all(promises).then(speciesDirectorys => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(speciesDirectory, null, 4));
  });

})

app.listen('8081');

console.log('on port 8081');

exports = module.exports = app;
