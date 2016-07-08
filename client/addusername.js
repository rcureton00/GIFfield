angular.module('giffieldapp')

.controller('AddUserName', function($scope, socket){

  $scope.setName = function(){
      //console.log($scope.screenName);
      socket.emit('username', $scope.screenName);
  };
});