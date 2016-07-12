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