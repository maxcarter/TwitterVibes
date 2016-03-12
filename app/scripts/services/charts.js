'use strict';

/**
 * @ngdoc service
 * @name twitterSearchApp.Charts
 * @description
 * # Charts
 * Factory in the twitterSearchApp.
 */
angular.module('twitterSearchApp')
    .factory('Charts', function() {
        // Service logic
        // ...

        // Public API here
        return {
            pie: {
                tweetType: {
                    labels: ["Normal", "Retweets", "Replies"],
                    data: [0, 0],
                    colors: [{
                        fillColor: '#55ACEE',
                        strokeColor: '#55ACEE',
                        highlightFill: '#55ACEE',
                        highlightStroke: '#55ACEE'
                    }, {
                        fillColor: '#428bca',
                        strokeColor: '#428bca',
                        highlightFill: '#428bca',
                        highlightStroke: '#428bca'
                    }, {
                        fillColor: '#5cb85c',
                        strokeColor: '#5cb85c',
                        highlightFill: '#5cb85c',
                        highlightStroke: '#5cb85c'
                    }]
                }
            },
            graph: {
                bar: {
                    sentiment: {
                        labels: ['Sentiment Analysis'],
                        data: [
                            [0],
                            [0],
                            [0]
                        ],
                        series: ['Positive', 'Neutral', 'Negative'],
                        colors: [{
                            fillColor: '#5cb85c',
                            strokeColor: '#5cb85c',
                            highlightFill: '#5cb85c',
                            highlightStroke: '#5cb85c'
                        }, {
                            fillColor: '#55ACEE',
                            strokeColor: '#55ACEE',
                            highlightFill: '#55ACEE',
                            highlightStroke: '#55ACEE'
                        }, {
                            fillColor: '#d9534f',
                            strokeColor: '#d9534f',
                            highlightFill: '#d9534f',
                            highlightStroke: '#d9534f'
                        }]
                    }
                }
            }
        };
    });