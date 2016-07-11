var appPlayer = angular.module('MusicPlayer', ['ngRoute']);
appPlayer.config(function($routeProvider) {
  $routeProvider
    .when('/home', {
      controller: 'HomeController',
      templateUrl: '../views/home.html'
    })
    .when('/', {
      controller: 'LandingPage',
      templateUrl: '../views/landingPage.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});
