'use strict';

/**
 * @ngdoc function
 * @name twitterSearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the twitterSearchApp
 */
angular.module('twitterSearchApp')
    .controller('MainCtrl', function($scope, Twitter) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];


        Twitter.search({
            q: 'trump'
        }).then(
            function success(response) {
                $scope.tweets = response;
            });
    });