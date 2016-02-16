'use strict';

/**
 * @ngdoc filter
 * @name twitterSearchApp.filter:TweetLinky
 * @function
 * @description
 * # TweetLinky
 * Filter in the twitterSearchApp.
 */
angular.module('twitterSearchApp')
    .filter('TweetLinky', function($filter, $sce) {
        return function(text) {
            if (!text) {
                return text;
            }

            var replacedText = text;

            //URLs starting with http://, https://, or ftp://
            var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            replacedText = replacedText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links.
            var replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            // replace #hashtags
            var replacePattern4 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
            replacedText = replacedText.replace(replacePattern4, '$1<a target="_blank" href="https://twitter.com/search?q=%23$2">#$2</a>');

            // replace @mentions
            var replacePattern5 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
            replacedText = replacedText.replace(replacePattern5, '$1<a target="_blank" href="https://twitter.com/$2">@$2</a>');

            return $sce.trustAsHtml(replacedText);
        };
    });