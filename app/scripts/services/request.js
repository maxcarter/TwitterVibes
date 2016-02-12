'use strict';

/**
 * @ngdoc service
 * @name twitterSearchApp.Request
 * @description
 * # Request
 * Factory in the twitterSearchApp.
 */
angular.module('twitterSearchApp')
    .factory('Request', function($http, $q) {
        // Service logic
        // ...

        var meaningOfLife = 42;

        // Public API here
        return {
            request: function(method, url, params, data) {
                var deferred = $q.defer();
                params = (params) ? params : {};
                var request = {
                    method: method,
                    url: url,
                    params: params,
                    data: data
                };
                $http(request).then(function success(response) {
                    console.log({
                        url: url,
                        success: true,
                        method: method,
                        request: request,
                        response: response
                    });
                    deferred.resolve(response);
                }, function error(response) {
                    console.log({
                        url: url,
                        success: false,
                        method: method,
                        request: request,
                        response: response
                    });
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            get: function(url, params) {
                return this.request("GET", url, params);
            },
            put: function(url, data, params) {
                return this.request("PUT", url, params, data);
            },
            post: function(url, data, params) {
                return this.request("POST", url, params, data);
            },
            delete: function(url, params) {
                return this.request("DELETE", url, params);
            }
        };
    });