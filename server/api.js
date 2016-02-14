var sentiment = require('sentiment');
module.exports = function(app, config, https, qs) {
    app.get('/twitter/search/tweets', function(req, res) {
        var http_success = function(data) {
            for(var i=0; i<data.statuses.length; i++) {
                var s = sentiment(data.statuses[i].text);
                data.statuses[i].sentiment = s;
            }
            res.json(data);
        };

        var http_error = function(data) {
            res.status(500).json(data);
        };

        if (config.bearer) {
            var options = {
                host: 'api.twitter.com',
                path: '/1.1/search/tweets.json?' + qs.stringify(req.query),
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.bearer
                }
            };
            https.request(options).on('response', function(response) {
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
                        http_error(JSON.parse(error));
                    } else {
                        http_success(JSON.parse(data));
                    }

                });
            }).end();
        } else {
            http_error(JSON.parse("The server is not ready to accept requests. Please wait for the bearer token."));
        }
    });
}