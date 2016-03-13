var mongoose = require('mongoose');
var config = require('./config');
module.exports = function() {
    var database = config.database.mongodb;
    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        if (env['user-provided']) {
            var mongo = env['user-provided'][0].credentials;
            database = "mongodb://" + mongo.user + ":" + mongo.password + "@" + mongo.uri + ":" + mongo.port + "/twittersearch"
        }
    }
    if (config.database.enabled) {
        mongoose.connect(database);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log("Connected to Mongo DB");
        });
    } else {
        console.log("Database disabled");
    }
}