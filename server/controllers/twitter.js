var https = require('https');
var qs = require('qs');
var config = require('../config');

var callback = {
    set: {
        bearer: function(token) {
            console.log("The server is now ready to accept requests.");
            console.log("Bearer Token: " + token);
            config.bearer = token;
        }
    }
};
module.exports = {
    get: {
        bearer: function() {
            var enc_secret = new Buffer(config.consumer_key + ':' + config.consumer_secret).toString('base64');
            var post_data = qs.stringify({
                'grant_type': 'client_credentials'
            });
            var request = https.request({
                host: 'api.twitter.com',
                path: '/oauth2/token',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + enc_secret,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            }, function(response) {
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
                        throw error;
                    } else {
                        var token = JSON.parse(data);
                        callback.set.bearer(token.access_token);
                    }
                });
            });
            request.on("error", function(e) {
                console.log("Error retrieving the Twitter API Bearer token!");
                console.log(JSON.stringify(e));
            });
            request.write(post_data);
            request.end();
        }
    },
    search: function(query, successCallback, errorCallback) {
        if (config.bearer) {
            var request = https.request({
                host: 'api.twitter.com',
                path: '/1.1/search/tweets.json?' + qs.stringify(query),
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.bearer
                }
            }, function(response) {
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
                        errorCallback(JSON.parse(JSON.stringify(e)));
                    } else {
                        successCallback(JSON.parse(data));
                    }
                });
            });
            request.on("error", function(e) {
                var er = JSON.parse(JSON.stringify(e));
                er.text = "HTTPS request error for api.twitter.com/1.1/search/tweets.json, see console for details!";
                errorCallback(er);
            });
            request.end();
        } else {
            errorCallback({
                text: "No Twitter API Bearer token!"
            });
        }
    }
};