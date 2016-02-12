'use strict';

/**
 * @ngdoc service
 * @name twitterSearchApp.Twitter
 * @description
 * # Twitter
 * Factory in the twitterSearchApp.
 */
angular.module('twitterSearchApp')
    .factory('Twitter', function($q, Request) {
        // Service logic
        // ...

        var api = {
            domain: "http://localhost",
            port: 3000,
            host: "twitter"
        };

        var url = api.domain + ":" + api.port + "/" + api.host;

        // Public API here
        return {
            search: function(params) {
                var deferred = $q.defer();
                var endpoint = url + "/search/tweets";
                params = (params) ? params : {};
                Request.get(endpoint, params).then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
        };
    });