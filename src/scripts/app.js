(function () {
  'use strict';

  var app = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false,
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  app.factory('lodash', function () {
    return window._;
  });

  app.controller('homeController', ['$scope', '$http', 'lodash',
    function ($scope, $http, _) {
      $http.get('/smilies.json')
       .then(function (res) {
          $scope.smilies = _.values(res.data);
        });

      $scope.selectSmiley = function (smiley) {
        console.log('--- selectSmiley ---');
        console.log(smiley);
      };
    },
  ]);

})();
