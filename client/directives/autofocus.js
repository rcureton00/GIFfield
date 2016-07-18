 // autofocus directive, html5 autofocus with doesn't do well with Angular's templates.
appPlayer.directive('autofocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element) {
            $timeout(function() {
                $element[0].focus();
            });
        }
    }

}]);