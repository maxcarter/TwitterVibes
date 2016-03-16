var Tweet = require('../models/tweet');
module.exports = {
    tweets: {
        save: function(tweets) {
            for (var i = 0; i < tweets.length; i++) {
                tweets[i].created_at = new Date(tweets[i].created_at);
                var tweet = new Tweet(tweets[i]);
                tweet.save();
            }
        },
        find: function(criteria, sortData, limit, success, error) {
            Tweet.find(criteria, {
                score: {
                    $meta: "textScore"
                }
            }).sort(sortData).limit(limit).exec(function(err, posts) {
                if (err) {
                    if (error) {
                        error(err);
                    }
                    console.log(err);
                }
                success(posts);
            });
        }
    }
};