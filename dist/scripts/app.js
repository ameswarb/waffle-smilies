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
    .factory('lodash', function () {
      return window._;
    })
    .factory('base64', function () {
      return window.Base64;
    })
    .controller('homeController', ['$scope', '$http', 'lodash', 'base64',
      function ($scope, $http, _, b64) {
        $scope.smilies = [];

        $http.get('smilies.json')
         .then(function (res) {
           _.forEach(res.data, function (smiley) {
             smiley.name = b64.decode(smiley.name);
             smiley.caption = b64.decode(smiley.caption);
             $scope.smilies.push(smiley);
           });
          });

        $scope.selectSmiley = function (smiley) {
          console.log('--- selectSmiley ---');
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
