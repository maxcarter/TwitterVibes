'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('SearchCtrl', function($scope, $alert, Twitter, Query, Time, Charts) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.queryFactory = Query;
        $scope.timeFactory = Time;
        $scope.charts = Charts;
        $scope.query = Query.param.get("q");
        $scope.lang = (Query.param.get("lang")) ? Query.param.get("lang") : 'en';
        $scope.count = (Query.param.get("count")) ? Query.param.get("count") : 50;
        $scope.sentiment = Query.param.get("sentiment");

        if ($scope.query !== null && $scope.query !== undefined && $scope.query !== '') {
            $scope.loading = true;

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
                    $scope.emoji = response.data.summary.sentiment_str;
                    $scope.loading = false;
                    $scope.charts.graph.bar.sentiment.data[0][0] = response.data.summary.tweets.positive;
                    $scope.charts.graph.bar.sentiment.data[1][0] = response.data.summary.tweets.neutral;
                    $scope.charts.graph.bar.sentiment.data[2][0] = response.data.summary.tweets.negative;
                    $scope.charts.pie.tweetType.data[0] = response.data.summary.tweets.normal;
                    $scope.charts.pie.tweetType.data[1] = response.data.summary.tweets.retweets;
                    $scope.charts.pie.tweetType.data[2] = response.data.summary.tweets.replies;
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