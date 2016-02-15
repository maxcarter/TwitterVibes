var sentiment = require('sentiment');
var Tweet = require('./models/tweet');
module.exports = function(app, config, https, qs) {
    app.get('/twitter/search/tweets', function(req, res) {
        var http_success = function(data) {
            var summary = {
                sentiment: 0,
                tweets: {
                    total: data.search_metadata.count,
                    normal: 0,
                    retweets: 0,
                    replies: 0,
                    positive: 0,
                    negative: 0,
                    neutral: 0
                }
            }
            for (var i = 0; i < data.statuses.length; i++) {
                var s = sentiment(data.statuses[i].text);
                if (s.score > 0) {
                    summary.tweets.positive++;
                    summary.sentiment++;
                } else if (s.score < 0) {
                    summary.tweets.negative++;
                    summary.sentiment--;
                } else if (s.score === 0) {
                    summary.tweets.neutral++;
                }

                if (data.statuses[i].retweet_count > 0) {
                    summary.tweets.retweets++;
                }

                if (data.statuses[i].in_reply_to_user_id_str !== null) {
                    summary.tweets.replies++;
                }

                data.statuses[i].sentiment = s;
                var tweet = new Tweet(data.statuses[i]);
                tweet.save(function(err, fluffy) {
                    if (err) {
                        console.error(err)
                    }
                });
            }

            summary.tweets.normal = summary.tweets.total - summary.tweets.retweets - summary.tweets.replies;
            data.summary = summary;
            res.json(data);
        };

        var http_error = function(data, status) {
            res.status((status) ? status : 500).json(data);
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
            var request = https.request(options).on('response', function(response) {
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
                        http_error(JSON.parse(JSON.stringify(e)));
                    } else {
                        http_success(JSON.parse(data));
                    }

                });
            });
            request.on("error", function(e) {
                var error = JSON.parse(JSON.stringify(e));
                error.text = "HTTPS request error for api.twitter.com/1.1/search/tweets.json, see console for details!";
                http_error(error);
            });
            request.end();
        } else {
            http_error({
                text: "No Twitter API Bearer token!"
            });
        }
    });
}