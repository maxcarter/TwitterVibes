var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('../dist'));
app.use('/dev', express.static('../app')); 

app.listen(port);
console.log("Started Node.js server on port " + port);