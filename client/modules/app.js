var appPlayer = angular.module('MusicPlayer', ['ngRoute', 'giffieldapp']);
appPlayer.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: '../views/home.html'
        })
        .when('/player', {
            controller: 'PlayerController',
            templateUrl: '../views/player.html'
        })
        .when('/chat', {
            controller: 'ChatController',
            templateUrl: '../views/chat.partial.html'
        })
        .otherwise({
            redirectTo: '/'
        });
})
