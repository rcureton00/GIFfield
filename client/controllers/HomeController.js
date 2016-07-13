appPlayer.controller('HomeController', ['$scope', 'socket', 'playerFactory', 'userName',
  function($scope, socket, playerFactory, userName) {

    //initializing with the first 
    playerFactory.player = playerFactory.playlist[0];
    $scope.playSong = playerFactory;
/*
*
*
*
*
*
*
*
*
*
*
*
*/
  //PLAY, NEXT AND PAUSE FUNCTIONS
    //takes an arugment which is equivalent to playerFactory
    //'playerFact' refers to "playerFactory"
    $scope.play = function(playerFact) {
      if(playerFact.player && !playerFact.isPlaying) {
        playerFact.isPlaying = true;
        // $scope.isPlaying = true;
        socket.emit("playNpause", {
          id: playerFact.player.id,
          status: 'play'
        });
        playerFact.player.play();
        playerFactory.player._onfinish = function() {
          $scope.next($scope.play);
        };
      }
    }
/*
*
*
*
*
*
*
*
*
*
*
*
*/
    $scope.next = function(playCallback) {
      playerFactory.player.stop();
      playerFactory.isPlaying = false;
      //gets the index of the current song from "playlist" array
      var currentIndex = playerFactory.playlist.indexOf(playerFactory.player);
      var nextIndex= currentIndex + 1;
      //point to the next track in the 'playlist' array
      var nextTrack = playerFactory.playlist[nextIndex];
      //assign new track to the player property
      playerFactory.player = nextTrack;
      //calls the $scope.play function, to play the next song
      playCallback(playerFactory)

    }
    /*
*
*
*
*
*
*
*
*
*
*
*
*/

    $scope.pause = function() {
      if(playerFactory.isPlaying) { 
        console.log('player from fac', playerFactory.player);
        playerFactory.isPlaying = false;
        playerFactory.player.pause();
        socket.emit("playNpause", {
          id: playerFactory.player.id,
          status: 'pause'
        });
      }
    }
/*
*
*
*
*
*
*
*
*
*
*
*
*/
    //LISTENING --

    //PLAY WHEN HEARD from SOCKETS
    socket.on("playNpause", function(obj){
      obj.id = obj.id.match(/\/tracks\/\d*/g);
      if(/*!playerFactory.isPlaying &&*/ obj.status === "play"){
        SC.stream(obj.id, function(audioObj){
          audioObj.play(); 
        });
      } else if(obj.status === "pause"){
        SC.stream(obj.id, function(audioObj){
          audioObj.pause(); 
        });
      }
    });
/*
*
*
*
*
*
*
*
*
*
*
*
*
*/
//chat controller socket module
  //handles emit and listening events
    $scope.user = false;
    $scope.typing = false;
    $scope.TYPING_TIMER_LENGTH = 2000; // this is how quick the "[other user] is typing" message will go away
    $scope.chatSend = function() {
      socket.emit('chat message', $scope.chatMsg);
      $scope.chatMsg = "";
      return false;
    }
    $scope.chatMessages = [];
    socket.on('chat message', function(msg){
      $scope.chatMessages.push(msg);
    }); 
/*
*
*
*
*
*
*
*
*
*
*
*
*/
    $scope.updateTyping = function() {
      $scope.typing = true;
      socket.emit('typing', userName.name);
      var lastTypingTime = (new Date()).getTime();

      setTimeout(function() {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= $scope.TYPING_TIMER_LENGTH && $scope.typing) {
          socket.emit('stop typing');
          $scope.typing = false;
        }
      }, $scope.TYPING_TIMER_LENGTH);
    };
/*
*
*
*
*
*
*
*
*
*
*
*
*/
    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function(data) {

      data.typing = true;
      $scope.typingMessage = data.name + " is typing";

      if (!$scope.chatMessages.includes($scope.typingMessage)) {
          $scope.chatMessages.push($scope.typingMessage);
      }
    });
    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', function(data) {
      data.typing = false;

      var i = $scope.chatMessages.indexOf($scope.typingMessage);
      $scope.chatMessages.splice(i, 1);
    });
}])
/*
*
*
*
*
*
*
*
*
*
*
*
*/
//Landing page Controller
.controller('LandingPage', ['$scope', '$location', 'userName', 'socket', function($scope, $location, userName, socket) {
  var name = '';
  $scope.submit = function() {
    if ($scope.text) {
        name = userName.user(this.text);
    }
    socket.emit('username', userName.name);
    $location.path('/home', false)
  }
}])
/*
*
*
*
*
*
*
*
*
*
*
*
*/
//playlist factory
.factory('playerFactory', function() {
  var singleton = {};
  singleton.player = null;
  singleton.playlist = [];      
  singleton.isPlaying = false;

  //testing code to populate the playlist
   SC.initialize({
      client_id: '8af4a50e36c50437ca44cd59756301ae'
    });
    //populates playlist array with 4 player/track objects
    console.log('Hello worldm, how you been?')
    var pList = ['/tracks/190746854', '/tracks/77639629', '/tracks/100300197', '/tracks/89580176'];
    for (var i = 0; i < pList.length; i++) {
      SC.stream(pList[i], function(audioObj) {
        // audioObj.creatId = pList[i];
        singleton.playlist.push(audioObj);
      })
    }
  return singleton;
})
/*
*
*
*
*
*
*
*
*
*
*
*
*/
//Socket factory
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
})
/*
*
*
*
*
*
*
*
*
*
*
*
*/
.factory('userName', function() {
  var userSet = {};
  userSet.name = '';
  userSet.user = function(userVal) {
      userSet.name = userVal;
  };
  return userSet;
});


