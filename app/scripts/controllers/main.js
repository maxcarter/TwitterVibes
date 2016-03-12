'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('MainCtrl', function($scope, $alert, Query) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.queryFactory = Query;
    });