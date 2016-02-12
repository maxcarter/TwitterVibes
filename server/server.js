var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var twit = require('twitter');

var twitter = new twit({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var app = express();
var port = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('../dist'));
app.use('/dev', express.static('../app'));

app.get('/twitter/search/tweets', function(req, res) {
    twitter.get('search/tweets', {
        q: req.query.q
    }, function(error, tweets, response) {
        if (error) {
        	res.status(500).json(error);
        }
        res.setHeader('Content-Type', 'application/json');
    	res.json(tweets);
    });
});

app.listen(port);
console.log("Started Node.js server on port " + port);