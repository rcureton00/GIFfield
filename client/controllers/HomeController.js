appPlayer.controller('HomeController', ['$scope', 'socket', 'playerFactory', 'soundService', '$cookies',
  function($scope, socket, playerFactory, soundService, $cookies) {

    //A container to store audio's information for DOM manipulation 
    $scope.playListFinal = [];

    // Dynamic placeholder generator
    $scope.$on('$routeChangeSuccess', function() {
      var option = ['Artists', 'Songs', 'Albums', 'Playlists'];
      $scope.options = option[0];
      return setInterval(function() {
        var popped = option.pop();
        $scope.options = popped;
        // console.log($scope.options);
        $scope.$apply();
        option.unshift(popped);
      }, 3000);
    });

    //fetches the audio object from SoundCloud
    $scope.findArtist = function() {
      if ($scope.searchArtist.indexOf(' ') !== -1) {
        $scope.searchArtist = $scope.searchArtist.replace(' ', '-');
      }
      socket.emit('findArtist', {query: $scope.searchArtist});
      
      //clear the input field on DOM
      $scope.searchArtist = '';
    };


    //set the flag to false initially
    playerFactory.isPlaying = false;

    

    //on clicking play we emit the ID and the status for clients to listen to and act upon
    $scope.play = function() {
      if( $scope.playListFinal[0] && !playerFactory.isPlaying) {
        socket.emit("playNpause", {
          // id:  $scope.playListFinal[0].id,
          status: 'play'
        });
      }
    }

    //pause emits id and status to pause on all devices
    $scope.pause = function() {
      if(playerFactory.isPlaying) { 
        socket.emit("playNpause", {
          // id:  $scope.playListFinal[0].id,
          status: 'pause'
        });
      }
    }

    //on clicking next, we emit id and status to change song on all devices
    $scope.next = function() {
      socket.emit("playNpause", {
        // id:  $scope.playListFinal[0].id,
        status: 'next'
      });
    }

    // ******** LISTENS to emitted events ********
    socket.on('findArtist', function(obj) {
      soundService.getArtist(obj.query).then(function success(response, err){
        if(err) throw err;
        //Container to show audio information on the DOM
        $scope.playListFinal.push({
          id: '/tracks/'+response.data.id, 
          title: response.data.title, 
          artwork: response.data.artwork_url
        });
      });
    });


    socket.on("playNpause", function(obj){

      if(obj.status === "play"){
        obj.id = $scope.playListFinal[0].id;
        //REGEX to filter out only the '/tracks/track_number'
        obj.id = obj.id.match(/\/tracks\/\d*/g);
        //fetches audio object for the provided track ID
        SC.stream(obj.id, function(audioObj) {
          playerFactory.curSong = audioObj;
          playerFactory.isPlaying = true;
          playerFactory.curSong.play();
        })  
        playerFactory.curSong._onfinish = function() {
          if ($scope.playListFinal.length === 1) {
            alert('Looks like there is nothing to play. Add some more songs and try again!')
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


    //chat controller socket module
    //handles emit and listening events

    $scope.user = false;
    $scope.typing = false;
    $scope.TYPING_TIMER_LENGTH = 4000; // this is how quick the "[other user] is typing" message will go away
    $scope.chatSend = function() {
      socket.emit('chat message', {username: $cookies.get('username'), msg: $scope.chatMsg});
      $scope.chatMsg = '';
      return false;
    }

    $scope.chatMessages = [];

    socket.on('chat message', function(msg) {
      $scope.chatMessages.push(msg);
    });

    $scope.updateTyping = function() {
      $scope.typing = true;
      socket.emit('typing', $cookies.get('username'));
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
  }
])

// *************************** Landing page Controller ********************************
.controller('LandingPage', ['$scope', '$location', 'socket', '$cookies',
  function($scope, $location, socket, $cookies) {
    // var name = '';
    $scope.submit = function() {
      if ($scope.text) {
        $cookies.put('username', $scope.text);
      }
      socket.emit('username', $cookies.get('username'));
      $location.path('/home', false)
    }
  }
])

// ****************************** Socket Factory ***************************************
.factory('socket', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },

    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        })
      })
    }
  };
})

// ********************************** Player Factory ***********************************
.factory('playerFactory', function() {
  var singleton = {};
  singleton.curSong = null;
  singleton.isPlaying = false;
  SC.initialize({
    client_id: '8af4a50e36c50437ca44cd59756301ae'
  });
  return singleton;
})

// ***************************** Soundservice Factory *********************************
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




