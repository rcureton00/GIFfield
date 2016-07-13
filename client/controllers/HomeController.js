appPlayer.controller('HomeController', ['$scope', 'socket', 'playerFactory', 'userName', 'soundService',
  function($scope, socket, playerFactory, userName, soundService) {

    //initializing with the first 
    playerFactory.player = playerFactory.playlist[0];
    $scope.playSong = playerFactory;
    $scope.pList = playerFactory.pList;
/*
*
*
*
*
*/
  //PLAY, NEXT AND PAUSE FUNCTIONS
    //takes an arugment which is equivalent to playerFactory
    //'playerFact' refers to "playerFactory"
    $scope.play = function() {
      if(playerFactory.player && !playerFactory.isPlaying) {
        socket.emit("playNpause", {
          id: playerFactory.player.id,
          status: 'play'
        });
      }
    }
/*
*
*
*
*
*/
    $scope.next = function() {
      socket.emit("playNpause", {
        id: playerFactory.player.id,
        status: 'next'
      });
    }



    $scope.findArtist = function() {
         console.log($scope.searchArtist);
         if ($scope.searchArtist.indexOf(' ') !== -1) {
             $scope.searchArtist = $scope.searchArtist.replace(' ', '-');
         }
        soundService.getArtist($scope.searchArtist);
        $scope.searchArtist = '';
     }
/*
*
*
*
*
*/
    $scope.pause = function() {
      if(playerFactory.isPlaying) { 
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
*/
    //LISTENING --

    //PLAY WHEN HEARD from SOCKETS
    socket.on("playNpause", function(obj){
      obj.id = obj.id.match(/\/tracks\/\d*/g);
      if(obj.status === "play"){
       console.log(playerFactory.player.id, 'ON PLAY~~~~~~~~~~~~ON PLAY~~~~~~~~~~~~ON PLAY')
        playerFactory.isPlaying = true;
        playerFactory.player.play();
        playerFactory.player._onfinish = function() {
          if (playerFactory.playlist.length === 1) {
            console.log('PlayList');
          } else {
            $scope.next();
          }
        };
      } 
      if(obj.status === "pause"){
        console.log(playerFactory.player.id, "ON PAUSE~~~~~~~~~~~~ON PAUSE~~~~~~~~~~~~ON PAUSE");
        playerFactory.isPlaying = false;
        playerFactory.player.pause();
      }
      if (obj.status === 'next') {
        console.log(playerFactory.player.id, "ON NEXT~~~~~~~~~~~~ON NEXT~~~~~~~~~~~~ON NEXT");
        playerFactory.player.stop();
        playerFactory.isPlaying = false;
        playerFactory.playlist.shift();
        playerFactory.player = playerFactory.playlist[0];
        playerFactory.isPlaying = true;
        playerFactory.player.play();
      }
    });
/*
*
*
*
*
*/
//chat controller socket module
  //handles emit and listening events
    $scope.user = false;
    $scope.typing = false;
    $scope.TYPING_TIMER_LENGTH = 4000; // this is how quick the "[other user] is typing" message will go away
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
*/
//playlist factory
.factory('playerFactory', function() {
  var singleton = {};
  singleton.player = null;
  singleton.playlist = [];  
  singleton.pList = [];    
  singleton.isPlaying = false;

  //testing code to populate the playlist
   SC.initialize({
      client_id: '8af4a50e36c50437ca44cd59756301ae'
    });
    //populates playlist array with 4 player/track objects
    // singleton.pList = ["/tracks/293", "/tracks/291", "/tracks/299", "/tracks/290", "/tracks/297"]
    singleton.pList = [{track: '/tracks/293', title: 'Crazy woman', artwork: 'https://i1.sndcdn.com/artworks-000067273316-smsiqx-large.jpg'} , {track: '/tracks/291', title: 'Crazy woman', artwork: 'https://i1.sndcdn.com/artworks-000067273316-smsiqx-large.jpg'}];
    for (var i = 0; i < singleton.pList.length; i++) {
      SC.stream(singleton.pList[i].track, function(audioObj) {
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
*/
.factory('userName', function() {
  var userSet = {};
  userSet.name = '';
  userSet.user = function(userVal) {
      userSet.name = userVal;
  };
  return userSet;
})

.factory('soundService', function($http) {
       

       getArtist = function(tracknumber) {
           $http({
               method: 'GET',
               url: 'https://api.soundcloud.com/tracks/' + tracknumber + '.json?consumer_key=8af4a50e36c50437ca44cd59756301ae'
           })
           .then(function success(response){
               console.log(response);
               console.log(response.data.title);
               console.log(response.data.artwork_url);
               console.log(response.data.id);
               return response;

           },
               function error(response){
                   console.log('failure', response);
           });

       };
       return  {
           getArtist: getArtist
       };
   })
.factory('soundService', function($http) {
       

       getArtist = function(tracknumber) {
           $http({
               method: 'GET',
               url: 'https://api.soundcloud.com/tracks/' + tracknumber + '.json?consumer_key=8af4a50e36c50437ca44cd59756301ae'
           })
           .then(function success(response){
               console.log(response);
               console.log(response.data.title);
               console.log(response.data.artwork_url);
               console.log(response.data.id);
               playerFactory.plist.push({track: '/tracks/'+response.data.id, title: response.data.title, artwork: response.data.artwork_url});
               return response;

           },
               function error(response){
                   console.log('failure', response);
           });

       };
       return  {
           getArtist: getArtist
       };
   });

