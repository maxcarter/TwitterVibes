var mongoose = require('mongoose');

var sentiment = new mongoose.Schema({
    score: {
        type: Number,
        required: true,
        default: 0
    },
    comparative: {
        type: Number,
        required: true
    },
    negative: {
        type: [String],
        required: false,
        default: []
    },
    positive: {
        type: [String],
        required: false,
        default: []
    },
    tokens: {
        type: [String],
        required: false,
        default: []
    },
    words: {
        type: [String],
        required: false,
        default: []
    }
});

var user = new mongoose.Schema({
    screen_name: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    id_str: {
        type: String,
        required: true
    },
    favourites_count: {
        type: Number,
        required: false
    },
    followers_count: {
        type: Number,
        required: false
    },
    friends_count: {
        type: Number,
        required: false
    },

    listed_count: {
        type: Number,
        required: false
    },
    url: {
        type: String,
        required: false
    },
});

var schema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    id_str: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true,
        default: "en"
    },
    source: {
        type: String,
        required: false
    },
    sentiment: {
        type: sentiment,
        required: true
    },
    user: {
        type: user,
        required: true
    },
    retweet_count: {
        type: Number,
        required: false
    },
    in_reply_to_screen_name: {
        type: String,
        required: false
    },
    in_reply_to_status_id: {
        type: Number,
        required: false
    },
    in_reply_to_status_id_str: {
        type: String,
        required: false
    },
    in_reply_to_user_id: {
        type: Number,
        required: false
    },
    in_reply_to_user_id_str: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Tweet', schema);;