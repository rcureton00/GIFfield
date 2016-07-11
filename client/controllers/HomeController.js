appPlayer.controller('HomeController', ['$scope', 'socket',
    function($scope, socket) {
        // Sound manager is a audio player library with hundreds of methods available,
        // The setup we have should be enough for a MVP.
      SC.initialize({
       client_id: '8af4a50e36c50437ca44cd59756301ae'
      });
      let track = '/tracks/291';
       SC.stream(track, function(player){
           $('#playBack').click(function(e) {
               e.preventDefault();
               player.start();
               socket.emit("playNpause", track);
           });
           $('#stop').click(function(e) {
               e.preventDefault();
               player.pause();
               socket.emit("playNpause", "pausing");
           });
       });

        /// chat controller stuff

      $scope.chatSend = function(){
      socket.emit('chat message', $scope.chatMsg);
      $scope.chatMsg = "";
      return false;
    }
    
    $scope.chatMessages = [];

    socket.on('chat message', function(msg){
      $scope.chatMessages.push(msg);
    });
    $scope.setName = function(){
      //console.log($scope.screenName);
      socket.emit('username', $scope.screenName);
    };



//LISTENING --

//PLAY WHEN HEARD from SOCKETS
socket.on("playNpause", function(obj){
  console.log('we heard you', obj);

  SC.stream(obj, function(player){
    player.start();
  });
  // if(obj === 'playing'){
  //  // musicInstance.playSound('http://users.skynet.be/fa046054/home/P22/track22.mp3', true);

  // }
  // if(obj === 'pausing'){
  //   musicInstance.playSound.pause();
  // }

});


}
    
])  
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
    };
  });
