// restaurant reviewer with express

var express = require('express');
var bp = require('body-parser');
var promise = require('bluebird');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// server listen
app.listen(8000, function() {
  console.log('listening on port 8000');
});
