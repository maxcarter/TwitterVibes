'use strict';

/**
 * @ngdoc overview
 * @name twitterSearchApp
 * @description
 * # twitterSearchApp
 *
 * Main module of the application.
 */
angular
  .module('twitterSearchApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'mgcrea.ngStrap',
    'base64'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
