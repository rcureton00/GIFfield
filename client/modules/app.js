<<<<<<< HEAD
var appPlayer = angular.module('MusicPlayer', ['ngRoute', 'MusicPlayer.Home']);
appPlayer.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: '../views/home.html'
        })
        
        .otherwise({
            redirectTo: '/'
        });
})
=======
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
>>>>>>> 446052cea051676b9c563a42a4b26ea5ed19c819
