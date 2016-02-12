'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('MainCtrl', function($scope, Twitter, Query) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];


        $scope.queryFactory = Query;
        $scope.query = Query.param.get("q");

        if ($scope.query !== null && $scope.query !== undefined && $scope.query !== '') {
            Twitter.search({
                q: $scope.query
            }).then(
                function success(response) {
                    $scope.tweets = response.data.statuses;
                });
        }
    });