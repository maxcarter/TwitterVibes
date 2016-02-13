'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('MainCtrl', function($scope, $alert, Twitter, Query) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.queryFactory = Query;
        $scope.query = Query.param.get("q");
        $scope.lang = (Query.param.get("lang")) ? Query.param.get("q") : 'en';

        if ($scope.query !== null && $scope.query !== undefined && $scope.query !== '') {
            $scope.loading = true;
            $scope.welcome = false;

            Twitter.search({
                q: $scope.query,
                result_type: "recent",
                lang: $scope.lang
            }).then(
                function success(response) {
                    $scope.tweets = response.data.statuses;

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