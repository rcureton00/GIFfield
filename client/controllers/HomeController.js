angular.module('MusicPlayer.Home', [])
.controller('HomeController', ['$scope', 'socket', 'playerFactory',
    function($scope, socket, playerFactory) {
      console.log("controlled loaded homecontroller");
        // Sound manager is a audio player library with hundreds of methods available,
        // The setup we have should be enough for a MVP.
      SC.initialize({
       client_id: '8af4a50e36c50437ca44cd59756301ae'
      });
      
      
      var track = '/tracks/123428319';

      SC.stream(track, function(player){
        console.log('player', player);
        playerFactory.player = player;
      
      });

      $scope.play = function() {
        console.log("player from fac", playerFactory.player);
        if(playerFactory.player && !playerFactory.isPlaying) {
          playerFactory.isPlaying = true;
          playerFactory.player.play();
          console.log('after play', playerFactory.player.id);
          socket.emit("playNpause", {id: playerFactory.player.id,
                                     status: 'play'});
        }
      }

      $scope.pause = function() {
        if(/*playerFactory.player &&*/ playerFactory.isPlaying) {
        console.log('player from fac', playerFactory.player);
          playerFactory.isPlaying = false;
          playerFactory.player.pause();
          socket.emit("playNpause", {id: playerFactory.player.id,
                                     status: 'pause'});
        }
      }



        /// chat controller stuff

      $scope.chatSend = function() {
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
//
//      CHECK TO SEE IF PLAYERFACTORY IS PLAYING AND 
//      IS IT PLAYING SAME SONG/ SAME TIME

//      OR PASS ID FOR THIS COMPUTER AND SAY IF IT WAS EMITTED
//      BY THIS ID, DON'T RECEIVE IT      
//
        if(!playerFactory.isPlaying && obj.status === "play"){
          SC.stream('/tracks/123428319', function(player){
            console.log('player', player);
            playerFactory.player = player;
            playerFactory.isPlaying = true;
            playerFactory.player.play();
          });
        }

          if(obj.status === "pause"){
            playerFactory.player.pause();
          
          }
    });

   



  }
   
])
.factory('playerFactory', function() {
  var singleton = {};
  singleton.player = null;
  singleton.isPlaying = false;
  return singleton;
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
    };
  });
