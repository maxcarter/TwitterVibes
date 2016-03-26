var config = require('./config');
var twitter = require('./controllers/twitter');
var mongo = require('./controllers/mongodb');
var sentiment = require('./controllers/sentiment');

twitter.get.bearer();

module.exports = function(app) {
    app.get('/twitter/search/tweets', function(req, res) {
        var returnResponse = function(data) {
            res.json(data);
        };
        var http_success = function(data) {
            var d = sentiment.analyze(data);
            var filter = sentiment.valid(req.query.sentiment); 
            if (config.database.enabled) {
                mongo.tweets.save(d.statuses);
            }

            if (filter) {
                sentiment.filter(d, req.query, returnResponse);
            } else {
                returnResponse(d);
            }
        };

        var http_error = function(data, status) {
            res.status((status) ? status : 500).json(data);
        };

        twitter.search(req.query, http_success, http_error);

    });
}