var app = angular.module('MusicPlayer', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: '../views/home.html'
        })
        .when('/player', {
            controller: 'PlayerController',
            templateUrl: '../views/player.html'
        })
        .otherwise({
            redirectTo: '/'
        });
})
