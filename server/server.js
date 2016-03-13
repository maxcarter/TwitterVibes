var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cfenv = require("cfenv");

var config = require('./config');
var cf = cfenv.getAppEnv();
var app = express();
var host = (cf.bind) ? cf.bind : 'localhost';
var port = (cf.port) ? cf.port : 3000;

require('./database')(config);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('./dist'));
app.use('/dev', express.static('./app'));


require('./api')(app);

app.listen(port, host);
console.log("Started Node.js server " + host + ":" + port);