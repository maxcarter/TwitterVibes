var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cfenv = require("cfenv");

var cf = cfenv.getAppEnv();
var app = express();
var host = (cf.bind) ? cf.bind : 'localhost';
var port = (cf.port) ? cf.port : 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('./dist'));
app.use('/dev', express.static('./app'));

require('./database')();
require('./api')(app);

app.listen(port, host);
console.log("Started Twitter Vibes Server on " + host + ":" + port);