
var appPlayer = angular.module('MusicPlayer', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngAnimate']); // ngMaterial is for the Progress Bar
appPlayer.config(function($routeProvider, $mdThemingProvider) { // $mdThemingProvider, for the Progress Bar
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
<<<<<<< HEAD

    // Progress Bar theme set.
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('orange')
});
=======
});
>>>>>>> ba15339a6161be0206afeb6eafa3ad9c148c0106
