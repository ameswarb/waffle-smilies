(function () {
  'use strict';

  console.log('-- init --');

  var app = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',
  ])
    .factory('lodash', function () {
      return window._;
    })
    .controller('homeController', ['$scope', '$http', 'lodash',
      function ($scope, $http, _) {
        console.log('--- homeController init ---');
        $http.get('/smilies.json')
         .then(function (res) {
            $scope.smilies = _.values(res.data);
          });

        $scope.selectSmiley = function (smiley) {
          console.log('--- selectSmiley ---');
          console.log(smiley);
        };
      },
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
    console.log('-- run --');
    FastClick.attach(document.body);
  }

})();
