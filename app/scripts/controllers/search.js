'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('SearchCtrl', function($scope, $alert, Twitter, Query, Time) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.queryFactory = Query;
        $scope.timeFactory = Time;
        $scope.query = Query.param.get("q");
        $scope.lang = (Query.param.get("lang")) ? Query.param.get("lang") : 'en';
        $scope.count = (Query.param.get("count")) ? Query.param.get("count") : 50;
        $scope.sentiment = Query.param.get("sentiment");

        $scope.tweetPie = {
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
        };

        $scope.sentimentGraph = {
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
        };
        if ($scope.query !== null && $scope.query !== undefined && $scope.query !== '') {
            $scope.loading = true;
            $scope.welcome = false;

            Twitter.search({
                q: $scope.query,
                result_type: "recent",
                lang: $scope.lang,
                count: $scope.count,
                sentiment: $scope.sentiment
            }).then(
                function success(response) {
                    $scope.summary = response.data.summary;
                    $scope.tweets = response.data.statuses;
                    $scope.loading = false;
                    $scope.sentimentGraph.data[0][0] = response.data.summary.tweets.positive;
                    $scope.sentimentGraph.data[1][0] = response.data.summary.tweets.neutral;
                    $scope.sentimentGraph.data[2][0] = response.data.summary.tweets.negative;
                    $scope.tweetPie.data[0] = response.data.summary.tweets.normal;
                    $scope.tweetPie.data[1] = response.data.summary.tweets.retweets;
                    $scope.tweetPie.data[2] = response.data.summary.tweets.replies;


                    if ($scope.tweets.length <= 50 && $scope.summary.tweets.neutral >= $scope.tweets.length / 2) {
                        $scope.emoji = "Unknown";
                    } else if ($scope.summary.sentiment > $scope.tweets.length / 2) {
                        $scope.emoji = "Very-Positive";
                    } else if ($scope.summary.sentiment <= $scope.tweets.length / 2 && $scope.summary.sentiment > 0) {
                        $scope.emoji = "Positive";
                    } else if ($scope.summary.sentiment === 0) {
                        $scope.emoji = "Neutral";
                    } else if ($scope.summary.sentiment < 0 && $scope.summary.sentiment >= $scope.tweets.length / 2 * -1) {
                        $scope.emoji = "Negative";
                    } else if ($scope.summary.sentiment < $scope.tweets.length / 2 * -1) {
                        $scope.emoji = "Very-Negative";
                    } else {
                        $scope.emoji = "Unknown";
                    }

                },
                function error(response) {
                    $scope.loading = false;
                    $alert({
                        title: response.status + " " + response.statusText,
                        content: (typeof response.data === "object") ? response.data.text : response.data,
                        placement: 'top',
                        type: 'danger',
                        show: true,
                        container: '#alert-container'
                    });
                });
        } else {
            $scope.tweets = [];
        }
    });