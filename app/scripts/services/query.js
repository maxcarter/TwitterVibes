'use strict';

/**
 * @ngdoc service
 * @name twitterSearchApp.Query
 * @description
 * # Query
 * Factory in the twitterSearchApp.
 */
angular.module('twitterSearchApp')
    .factory('Query', function($location, $route) {
        // Service logic
        // ...

        return {
            param: {
                set: function(key, value) {
                    if (value !== "") {
                        $location.path('/search').search(key, value);
                    } else {
                        $location.path('/search').search(key, null);
                    }
                },
                get: function(key, type, defaultValue) {
                    var params = $location.search();
                    var value;
                    if (params[key]) {
                        switch (type) {
                            case "Number":
                                value = parseInt(params[key]);
                                break;
                            default:

                                value = params[key];
                                break;
                        }
                    }
                    if (defaultValue !== undefined && value === undefined) {
                        value = defaultValue;
                    }
                    return value;
                },
                clear: function() {
                    $location.url($location.path());
                }
            },
            reload: function() {
                $route.reload();
            },
            path: function(path) {
                $location.path(path);
            }
        };
    });