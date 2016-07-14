appPlayer.controller('HomeController', ['$scope', 'socket', 'playerFactory', 'userName', 'soundService',
  function($scope, socket, playerFactory, userName, soundService) {
    //A container to store audio's information for DOM manipulation 
    $scope.playListFinal = [];

    
    //fetches the audio object from SoundCloud
    $scope.findArtist = function() {
       if ($scope.searchArtist.indexOf(' ') !== -1) {
           $scope.searchArtist = $scope.searchArtist.replace(' ', '-');
       }
      soundService.getArtist($scope.searchArtist).then(function success(response, err){
        if(err) throw err;
        //Container to show audio information on the DOM
         $scope.playListFinal.push({
            id: '/tracks/'+response.data.id, 
            title: response.data.title, 
            artwork: response.data.artwork_url
          });
      });
      //clear the input field on DOM
      $scope.searchArtist = '';
    };



    //set the flag to false initially
    playerFactory.isPlaying = false;


    //on clicking play we emit the ID and the status for clients to listen to and act upon
    $scope.play = function() {
      if( $scope.playListFinal[0] && !playerFactory.isPlaying) {
        socket.emit("playNpause", {
          id:  $scope.playListFinal[0].id,
          status: 'play'
        });
      }
    }



  //on clicking next, we emit id and status to change song on all devices
    $scope.next = function() {
      socket.emit("playNpause", {
        id:  $scope.playListFinal[0].id,
        status: 'next'
      });
    }



  //pause emits id and status to pause on all devices
    $scope.pause = function() {
      if(playerFactory.isPlaying) { 
        socket.emit("playNpause", {
          id:  $scope.playListFinal[0].id,
          status: 'pause'
        });
      }
    }



  //LISTENS to emitted events
    socket.on("playNpause", function(obj){
      //REGEX to filter out only the '/tracks/track_number'
      obj.id = obj.id.match(/\/tracks\/\d*/g);

      if(obj.status === "play"){
        //fetches audio object for the provided track ID
        SC.stream(obj.id, function(audioObj) {
              playerFactory.curSong = audioObj;
              playerFactory.isPlaying = true;
              playerFactory.curSong.play();
        })  
        playerFactory.curSong._onfinish = function() {
          if ( $scope.playListFinal.length === 1) {
            alert('Looks like there are nothing to play, add some more songs and try again!')
          } else {
            $scope.next();
          }
        };
      } 
      if(obj.status === "pause"){
        playerFactory.isPlaying = false;
        playerFactory.curSong.pause();
      }
      if (obj.status === 'next') {
        playerFactory.isPlaying = false;
        playerFactory.curSong.stop();

        //removes the curent audio Object
         $scope.playListFinal.shift();
        //calls the play function on the new audio Object
        $scope.play();
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
//playlist factory
  //Initializes SoundCloud and creates storage variable for CURRENT TRACK - curSong - the on to be played 
  //and a flag to make sure it's not played twice 
.factory('playerFactory', function() {
  var singleton = {};
  singleton.curSong = null;
  singleton.isPlaying = false;

  //testing code to populate the playlist
  SC.initialize({
    client_id: '8af4a50e36c50437ca44cd59756301ae'
  });
  return singleton;
})


//factory to request audio Object from SoundCloud and push them to playList array
.factory('soundService', function($http) {
  var getArtist = function(tracknumber) {
    //sends a GET request to SoundCloud API with the inputed 'tracknumber'
    return $http({
      method: 'GET',
      url: 'https://api.soundcloud.com/tracks/' + tracknumber + '.json?consumer_key=8af4a50e36c50437ca44cd59756301ae'
    });
   };

  //returns getArtist method and playList array -- to populate it when audio Objects (audioObj);
  return  {
    getArtist: getArtist
  };
})


.factory('userName', function() {
  var userSet = {};
  userSet.name = '';
  userSet.user = function(userVal) {
      userSet.name = userVal;
  };
  return userSet;
});


