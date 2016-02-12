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

        // Public API here
        return {
            request: function(method, url, params, data, headers) {
                var deferred = $q.defer();
                params = (params) ? params : {};
                headers = (headers) ? headers : {
                    'Content-Type': 'application/json'
                };
                var request = {
                    method: method,
                    url: url,
                    params: params,
                    data: data,
                    headers: headers
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
            get: function(url, params, headers) {
                return this.request("GET", url, params, headers);
            },
            put: function(url, data, params, headers) {
                return this.request("PUT", url, params, data, headers);
            },
            post: function(url, data, params, headers) {
                return this.request("POST", url, params, data, headers);
            },
            delete: function(url, params, headers) {
                return this.request("DELETE", url, params, headers);
            }
        };
    });