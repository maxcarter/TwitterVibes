var sentiment = require('sentiment');
var Tweet = require('./models/tweet');
var analyze = function(data) {
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
        var s = (data.statuses[i].sentiment) ? data.statuses[i].sentiment : sentiment(data.statuses[i].text);

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
    }
    summary.tweets.normal = data.statuses.length - summary.tweets.retweets - summary.tweets.replies;
    data.summary = summary;
    return data;
};
var saveTweets = function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
        data.statuses[i].created_at = new Date(data.statuses[i].created_at);
        var tweet = new Tweet(data.statuses[i]);
        tweet.save();
    }
}
module.exports = function(app, config, https, qs) {
    app.get('/twitter/search/tweets', function(req, res) {
        var returnResponse = function(data) {
            res.json(data);
        };
        var http_success = function(data) {
            var d = analyze(data);
            saveTweets(d);
            var orData = [{
                'name': {
                    "$regex": req.query.q,
                    "$options": 'i'
                }
            }, {
                'screen_name': {
                    "$regex": req.query.q,
                    "$options": 'i'
                }
            }];

            var tweetsArray = {
                positive: [],
                negative: [],
                neutral: []
            };

            if (req.query.sentiment === 'positive' || req.query.sentiment === 'negative' || req.query.sentiment === 'neutral') {
                // Hacky way of kind of avoiding event inconsistency
                // Idea is to not search the database for the data we already have from the HTTPS response
                for (var i = 0; i < d.statuses.length; i++) {
                    if (d.statuses[i].sentiment.score > 0) {
                        tweetsArray.positive.push(d.statuses[i]);
                    }
                    if (d.statuses[i].sentiment.score < 0) {
                        tweetsArray.negative.push(d.statuses[i]);
                    }
                    if (d.statuses[i].sentiment.score === 0) {
                        tweetsArray.neutral.push(d.statuses[i]);
                    }
                }
            }

            if (req.query.sentiment === 'positive') {
                Tweet.find({
                    $text: {
                        $search: req.query.q,
                    },
                    'sentiment.score': {
                        '$gt': 0
                    },
                    'id': {
                        '$lt': d.search_metadata.max_id - 1
                    }
                }, {
                    score: {
                        $meta: "textScore"
                    }
                }).sort({
                    'created_at': -1,
                    score: {
                        $meta: 'textScore'
                    }
                }).limit(data.summary.tweets.total - tweetsArray.positive.length).exec(function(err, posts) {
                    if (err) {
                        console.log(err);
                    }
                    var statuses = {
                        search_metadata: {
                            count: tweetsArray.positive.length + posts.length
                        },
                        statuses: tweetsArray.positive.concat(posts)
                    };
                    returnResponse(analyze(statuses));
                });
            } else if (req.query.sentiment === 'negative') {
                Tweet.find({
                    $text: {
                        $search: req.query.q,
                    },
                    'sentiment.score': {
                        '$lt': 0
                    },
                    'id': {
                        '$lt': d.search_metadata.max_id - 1
                    }
                }, {
                    score: {
                        $meta: "textScore"
                    }
                }).sort({
                    'created_at': -1,
                    score: {
                        $meta: 'textScore'
                    }
                }).limit(data.summary.tweets.total - tweetsArray.negative.length).exec(function(err, posts) {
                    if (err) {
                        console.log(err);
                    }
                    var statuses = {
                        search_metadata: {
                            count: tweetsArray.negative.length + posts.length
                        },
                        statuses: tweetsArray.negative.concat(posts)
                    };
                    returnResponse(analyze(statuses));
                });

            } else if (req.query.sentiment === 'neutral') {
                Tweet.find({
                    $text: {
                        $search: req.query.q,
                    },
                    'sentiment.score': 0,
                    'id': {
                        '$lt': d.search_metadata.max_id - 1
                    }
                }, {
                    score: {
                        $meta: "textScore"
                    }
                }).sort({
                    'created_at': -1,
                    score: {
                        $meta: 'textScore'
                    }
                }).limit(data.summary.tweets.total - tweetsArray.neutral.length).exec(function(err, posts) {
                    if (err) {
                        console.log(err);
                    }
                    var statuses = {
                        search_metadata: {
                            count: tweetsArray.neutral.length + posts.length
                        },
                        statuses: tweetsArray.neutral.concat(posts)
                    };
                    returnResponse(analyze(statuses));
                });

            } else {
                res.json(d);
            }

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