var sentiment = require('sentiment');
var qs = require('qs');
var https = require('https');
var Tweet = require('./models/tweet');
var config = require('./config');
var twitter = require('./controllers/twitter');
var mongo = require('./controllers/mongodb');

twitter.get.bearer();

var analyze = function(data) {
    var summary = {
        sentiment: 0,
        sentiment_str: 'Unknown',
        tweets: {
            total: data.search_metadata.count,
            normal: 0,
            retweets: 0,
            replies: 0,
            positive: 0,
            negative: 0,
            neutral: 0
        }
    };
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
    if (data.statuses.length <= 50 && summary.tweets.neutral >= data.statuses.length / 2) {
        summary.sentiment_str = "Unknown";
    } else if (summary.sentiment > data.statuses.length / 2) {
        summary.sentiment_str = "Very-Positive";
    } else if (summary.sentiment <= data.statuses.length / 2 && summary.sentiment > 0) {
        summary.sentiment_str = "Positive";
    } else if (summary.sentiment === 0) {
        summary.sentiment_str = "Neutral";
    } else if (summary.sentiment < 0 && summary.sentiment >= data.statuses.length / 2 * -1) {
        summary.sentiment_str = "Negative";
    } else if (summary.sentiment < data.statuses.length / 2 * -1) {
        summary.sentiment_str = "Very-Negative";
    } else {
        summary.sentiment_str = "Unknown";
    }
    data.summary = summary;
    return data;
};
module.exports = function(app) {
    app.get('/twitter/search/tweets', function(req, res) {
        var returnResponse = function(data) {
            res.json(data);
        };
        var http_success = function(data) {
            var d = analyze(data);
            if (config.database.enabled) {
                mongo.tweets.save(d.statuses);
            }

            var tweetsArray = {
                positive: [],
                negative: [],
                neutral: []
            };
            var oldest = new Date(); 

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

                    if(new Date(d.statuses[i].created_at) < oldest){
                        oldest = new Date(d.statuses[i].created_at);
                    }
                }
            }

            var criteria = {
                $text: {
                    $search: req.query.q,
                },
                'created_at': {
                    '$lt': oldest
                }

            };

            var sortData = {
                'created_at': -1,
                score: {
                    $meta: 'textScore'
                }
            };

            if (req.query.sentiment === 'positive') {
                if (config.database.enabled) {
                    criteria['sentiment.score'] = {
                        '$gt': 0
                    };
                    var limit = data.summary.tweets.total - tweetsArray.positive.length;
                    var calculate = function(posts) {
                        var statuses = {
                            search_metadata: {
                                count: tweetsArray.positive.length + posts.length
                            },
                            statuses: tweetsArray.positive.concat(posts)
                        };
                        returnResponse(analyze(statuses));
                    };
                    mongo.tweets.find(criteria, sortData, limit, calculate);
                } else {
                    var statuses = {
                        search_metadata: {
                            count: tweetsArray.positive.length
                        },
                        statuses: tweetsArray.positive
                    };
                    returnResponse(analyze(statuses));
                }
            } else if (req.query.sentiment === 'negative') {
                if (config.database.enabled) {
                    criteria['sentiment.score'] = {
                        '$lt': 0
                    };
                    var limit = data.summary.tweets.total - tweetsArray.negative.length;
                    var calculate = function(posts) {
                        var statuses = {
                            search_metadata: {
                                count: tweetsArray.negative.length + posts.length
                            },
                            statuses: tweetsArray.negative.concat(posts)
                        };
                        returnResponse(analyze(statuses));
                    };
                    mongo.tweets.find(criteria, sortData, limit, calculate);
                } else {
                    var statuses = {
                        search_metadata: {
                            count: tweetsArray.negative.length
                        },
                        statuses: tweetsArray.negative
                    };
                    returnResponse(analyze(statuses));
                }

            } else if (req.query.sentiment === 'neutral') {
                if (config.database.enabled) {
                    criteria['sentiment.score'] = 0;
                    var limit = data.summary.tweets.total - tweetsArray.neutral.length;
                    var calculate = function(posts) {
                        var statuses = {
                            search_metadata: {
                                count: tweetsArray.neutral.length + posts.length
                            },
                            statuses: tweetsArray.neutral.concat(posts)
                        };
                        returnResponse(analyze(statuses));
                    };
                    mongo.tweets.find(criteria, sortData, limit, calculate);
                } else {
                    var statuses = {
                        search_metadata: {
                            count: tweetsArray.neutral.length
                        },
                        statuses: tweetsArray.neutral
                    };
                    returnResponse(analyze(statuses));
                }

            } else {
                returnResponse(analyze(d));
            }
        };

        var http_error = function(data, status) {
            console.log('In http_error');
            res.status((status) ? status : 500).json(data);
        };

        twitter.search(req.query, http_success, http_error);

    });
}