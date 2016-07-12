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
<<<<<<< 4c8f5b4f33e29e0f65addfb4bdee8394e39d3988
        .otherwise({
            redirectTo: '/'
        });
});
=======

>>>>>>> style config
    .otherwise({
        redirectTo: '/'
    });
})
>>>>>>> feat init included landinng page logic
