var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var qs = require('qs');
var https = require('https');
var mongoose = require('mongoose');
var cfenv = require("cfenv");

var config = require('./config');
var database = config.database.mongodb;
var cf = cfenv.getAppEnv();
var app = express();
var host = (cf.bind) ? cf.bind : 'localhost';
var port = (cf.port) ? cf.port : 3000;

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    if (env['user-provided']) {
        var mongo = env['user-provided'][0].credentials;
        database = "mongodb://" + mongo.user + ":" + mongo.password + "@" + mongo.uri + ":" + mongo.port + "/twittersearch"
    }
}

if (config.database.enabled) {
    mongoose.connect(database);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Connected to Mongo DB");
    });
} else {
    console.log("Databse disabled");
}

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('./dist'));
app.use('/dev', express.static('./app'));


var enc_secret = new Buffer(config.consumer_key + ':' + config.consumer_secret).toString('base64');
var post_data = qs.stringify({
    'grant_type': 'client_credentials'
});
var oauthOptions = {
    host: 'api.twitter.com',
    path: '/oauth2/token',
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + enc_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Length': Buffer.byteLength(post_data)
    }
};

var setBearer = function(token) {
    console.log("The server is now ready to accept requests.");
    console.log("Bearer Token: " + token.access_token);
    config.bearer = token.access_token;
};

var bearerReq = https.request(oauthOptions, function(response) {
    var data = '';
    var error = '';
    response.on("data", function(d) {
        data += d;
    });
    response.on("error", function(e) {
        error = e;
    });
    response.on('end', function() {
        if (error) {
            throw error;
        } else {
            setBearer(JSON.parse(data));
        }

    });
});
bearerReq.on("error", function(e) {
    console.log("Error retrieving the Twitter API Bearer token!");
    console.log(JSON.stringify(e));
});
bearerReq.write(post_data);
bearerReq.end();


require('./api')(app, config, https, qs);

app.listen(port, host);
console.log("Started Node.js server " + host + ":" + port);