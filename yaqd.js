"use strict";

const PORT            = process.argv[3] || 17,
      QUOTES_FILE     = process.argv[2] || 'quotes.json',
      UPDATE_INTERVAL = 8.64 * Math.pow(10, 7); // One day

var net = require('net'),
    fs  = require('fs');

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

loadQuotes(QUOTES_FILE, function(quotes) {

  function updateQuotes(file, interval) {
    setInterval(function updateLoop() {
      console.info('Updating quotes');

      loadQuotes(file, function(q) {
        quotes = q;

        console.info('Successfully updated quotes');
      });
    }, interval);
  }
  updateQuotes(QUOTES_FILE, UPDATE_INTERVAL);


  var yaqd = net.createServer(function(client) {
    console.info('Client connected');

    client.on('end', function() {
      console.info('Client disconnected');
    });

    client.write(getQuote(quotes) + '\r\n');
    client.end();
  });

  yaqd.listen(PORT, function() {
    console.info('Server bound');
  });
});
