var appPlayer = angular.module('MusicPlayer', ['ngRoute']);
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
