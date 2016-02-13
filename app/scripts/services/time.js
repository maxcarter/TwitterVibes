'use strict';

/**
 * @ngdoc service
 * @name twitterSearchApp.Time
 * @description
 * # Time
 * Factory in the twitterSearchApp.
 */
angular.module('twitterSearchApp')
    .factory('Time', function() {
        // Service logic
        // ...

        // Public API here
        return {
            now: function() {
                return new Date();
            },
            parse: function(date, format) {
                format = (format) ? format : "YYYY-MM-DD";
                return moment(date).format(format);
            },
            fromNow:function(date){
                var d = moment.utc(parseInt(new Date(date).getTime()));
                return moment(d).fromNow();
            }
        };
    });