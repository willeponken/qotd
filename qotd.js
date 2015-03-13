"use strict";

const PORT      = process.argv[3] || 17;
const UPDATE_INTERVAL  = 8.64 * Math.pow(10, 7); // One day

var net         = require('net'),
    fs          = require('fs'),
    quotesFile  = process.argv[2];

function loadQuotes(file, callback) {
  fs.readFile(file, function (err, data) {
    if (err) {
      throw new Error(err);
    }

    return callback(JSON.parse(data));
  });
}

function getQuote(quotes) {
  let index = Math.floor(Math.random() * quotes.length);
  let quote = quotes[index];

  return quote.quote + (quote.author ? '\r\n\t - ' + quote.author : '');
}

loadQuotes(quotesFile, function(quotes) {

  function updateQuotes(file, interval) {
    setInterval(function updateLoop() {
      console.info('Updating quotes');

      loadQuotes(file, function(q) {
        quotes = q;

        console.info('Successfully updated quotes');
      });
    }, interval);
  }
  updateQuotes(quotesFile, UPDATE_INTERVAL);


  var qotd = net.createServer(function(client) {
    console.info('Client connected');

    client.on('end', function() {
      console.info('Client disconnected');
    });

    client.write(getQuote(quotes) + '\r\n');
    client.end();
  });

  qotd.listen(PORT, function() {
    console.info('Server bound');
  });
});
