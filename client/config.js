angular.module('giffieldapp', [])

  .controller('mainController', function($scope, socket){
    
    $scope.chatSend = function(){
      socket.emit('chat message', $scope.chatMsg);
      $scope.chatMsg = "";
      return false;
    }
    
    $scope.chatMessages = [];

    socket.on('chat message', function(msg){
      console.log('on is listening');
      $scope.chatMessages.push(msg);
    });

  })
  .factory('socket', function($rootScope){
    var socket = io.connect();
    
  return{
    on: function(eventName, callback){
      socket.on(eventName, function(){
        var args = arguments;
        $rootScope.$apply(function(){
        callback.apply(socket, args);
        });
      });
    },
      emit: function(eventName, data, callback){
        socket.emit(eventName, data, function(){
          var args = arguments;
          $rootScope.$apply(function(){
            if(callback){
              callback.apply(socket, args);
            }
          })
        })
      }
    }
  });
