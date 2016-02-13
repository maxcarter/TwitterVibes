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
        return function(text, target) {
            if (!text) {
                return text;
            }

            var replacedText = $filter('linky')(text, target);
            var targetAttr = "";
            if (angular.isDefined(target)) {
                targetAttr = ' target="' + target + '"';
            }

            // replace #hashtags
            var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
            replacedText = replacedText.replace(replacePattern1, '$1<a href="https://twitter.com/search?q=%23$2"' + targetAttr + '>#$2</a>');

            // replace @mentions
            var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="https://twitter.com/$2"' + targetAttr + '>@$2</a>');

            $sce.trustAsHtml(replacedText);
            return replacedText;
        };
    });