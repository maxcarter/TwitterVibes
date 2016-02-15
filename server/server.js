var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var qs = require('qs');
var https = require('https');

var config = require('./config');
var app = express();
var port = 3000;

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
        error += e;
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

app.listen(port);
console.log("Started Node.js server on port " + port);