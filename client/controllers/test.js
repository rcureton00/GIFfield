angular.module('MyApp',['ngMaterial'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('orange')
  })
  .controller('AppCtrl', ['$scope', '$interval', function($scope, $interval) {
    var self = this, j= 0, counter = 0;
    $scope.determinateValue = 0;

    /**
     * Turn off or on the 5 themed loaders
     */
     
     console.log()

    $interval(function() {
      $scope.determinateValue += 1;
      if ($scope.determinateValue > 100) $scope.determinateValue = 0;
      if ( counter++ % 4 == 0 ) j++;
    }, Math.round(213890 / 1000), 0, true);
    // 300 -> 30 seconds.
  }]);


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/