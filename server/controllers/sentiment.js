var sentiment = require('sentiment');
var config = require('../config');
var mongo = require('./mongodb');

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
var metafy = function(tweets) {
    var meta = {
        tweets: {
            positive: [],
            negative: [],
            neutral: [],
            oldest: new Date()
        }
    };
    // Idea is to not search the database for the data we already have from the HTTPS response
    for (var i = 0; i < tweets.statuses.length; i++) {
        if (tweets.statuses[i].sentiment.score > 0) {
            meta.tweets.positive.push(tweets.statuses[i]);
        }
        if (tweets.statuses[i].sentiment.score < 0) {
            meta.tweets.negative.push(tweets.statuses[i]);
        }
        if (tweets.statuses[i].sentiment.score === 0) {
            meta.tweets.neutral.push(tweets.statuses[i]);
        }

        if (new Date(tweets.statuses[i].created_at) < meta.tweets.oldest) {
            meta.tweets.oldest = new Date(tweets.statuses[i].created_at);
        }
    }
    return meta;
};

var valid = function(senti) {
    return (senti === 'positive' || senti === 'negative' || senti === 'neutral');
};

var filter = function(data, query, callback) {
    var meta = metafy(data);
    var criteria = {
        $text: {
            $search: query.q,
        },
        'created_at': {
            '$lt': meta.tweets.oldest
        }
    };

    var sortData = {
        'created_at': -1,
        score: {
            $meta: 'textScore'
        }
    };

    var merge = function(posts) {
        var posts = (posts) ? posts : [];
        var t = {
            search_metadata: {}
        };
        switch (query.sentiment) {
            case "positive":
                t.search_metadata.count = (posts.length > 0) ? meta.tweets.positive.length + posts.length : meta.tweets.positive.length;
                t.statuses = (posts.length > 0) ? meta.tweets.positive.concat(posts) : meta.tweets.positive;
                break;
            case "negative":
                t.search_metadata.count = (posts.length > 0) ? meta.tweets.negative.length + posts.length : meta.tweets.negative.length;
                t.statuses = (posts.length > 0) ? meta.tweets.negative.concat(posts) : meta.tweets.negative;
                break;
            case "neutral":
                t.search_metadata.count = (posts.length > 0) ? meta.tweets.neutral.length + posts.length : meta.tweets.neutral.length;
                t.statuses = (posts.length > 0) ? meta.tweets.neutral.concat(posts) : meta.tweets.neutral;
                break;
        }
        callback(analyze(t));
    };

    if (config.database.enabled) {
        switch (query.sentiment) {
            case "positive":
                criteria['sentiment.score'] = {
                    '$gt': 0
                };
                var limit = data.summary.tweets.total - meta.tweets.positive.length;
                mongo.tweets.find(criteria, sortData, limit, merge);
                break;
            case "negative":
                criteria['sentiment.score'] = {
                    '$lt': 0
                };
                var limit = data.summary.tweets.total - meta.tweets.negative.length;
                mongo.tweets.find(criteria, sortData, limit, merge);
                break;
            case "neutral":
                criteria['sentiment.score'] = 0;
                var limit = data.summary.tweets.total - meta.tweets.neutral.length;
                mongo.tweets.find(criteria, sortData, limit, merge);
                break;
        }
    } else {
        merge();
    }
};

module.exports = {
    analyze: analyze,
    metafy: metafy,
    valid: valid,
    filter: filter
};