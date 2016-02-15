'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('MainCtrl', function($scope, $alert, Twitter, Query, Time) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.queryFactory = Query;
        $scope.timeFactory = Time;
        $scope.query = Query.param.get("q");
        $scope.lang = (Query.param.get("lang")) ? Query.param.get("q") : 'en';

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
                lang: $scope.lang
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


                    if($scope.summary.tweets.total <=50 && $scope.summary.tweets.neutral >= $scope.summary.tweets.total / 2) {
                        $scope.emoji = "Unknown";
                    } else if ($scope.summary.sentiment > $scope.summary.tweets.total / 2) {
                        $scope.emoji = "Very-Positive";
                    } else if ($scope.summary.sentiment <= $scope.summary.tweets.total / 2 && $scope.summary.sentiment > 0) {
                        $scope.emoji = "Positive";
                    } else if ($scope.summary.sentiment === 0) {
                        $scope.emoji = "Neutral";
                    } else if ($scope.summary.sentiment < 0 && $scope.summary.sentiment >= $scope.summary.tweets.total / 2 * -1) {
                        $scope.emoji = "Negative";
                    } else if ($scope.summary.sentiment < $scope.summary.tweets.total / 2 * -1) {
                        $scope.emoji = "Very-Negative";
                    } else {
                        $scope.emoji = "Unknown";
                    }

                },
                function error(response) {
                    $scope.loading = false;
                    $alert({
                        title: response.status + " " + response.statusText,
                        content: response.data,
                        placement: 'top',
                        type: 'danger',
                        show: true,
                        container: '#alert-container'
                    });
                });
        } else {
            $scope.welcome = true;
        }
    });