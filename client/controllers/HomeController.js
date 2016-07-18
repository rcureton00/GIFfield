appPlayer.controller('HomeController', ['$scope', 'socket', 'playerFactory', 'soundService', '$cookies', 'userName', '$animate',
  function($scope, socket, playerFactory, soundService, $cookies, userName, $animate) {


   $scope.pageClass = 'mainPage';
  
    socket.on('connect', function(){
      console.log("i connected");
    });
    // Dynamic placeholder generator - Displays in search bar: search for songs, artists, albums
    //continues to run throughout
   $scope.$on('$routeChangeSuccess', function() {
     var option = ['Artists', 'Songs', 'Albums', 'Playlists'];
     $scope.options = option[0];
     return setInterval(function() {
       var popped = option.pop();
       $scope.options = popped;
       $scope.$apply();
       option.unshift(popped);
     }, 3000);
   });

    //A container to store audio's information for DOM manipulation 
    $scope.playListFinal = [];


    $scope.rmvPlayListItem = function(event) {
      socket.emit('removeSong' , {id: event.id});
      // console.log(event);
      
    };

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
          //use id to pass to server for people who join song midtrack
          id: $scope.playListFinal[0].id,
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

    
    //*********VOLUME CONTROL***********
    $scope.fHigh = true, $scope.fMid = false, $scope.fMute = false;
    $scope.volume = function() {
      if ($scope.fHigh && !$scope.fMid && !$scope.fMute) {
        $scope.fHigh = false;
        $scope.fMid = true;
        if(playerFactory.curSong) {
          playerFactory.curSong.setVolume(30);  
        }
      } else if ($scope.fMid && !$scope.fMute && !$scope.fHigh) {
        $scope.fMid = false;
        $scope.fMute = true;
        if(playerFactory.curSong) {
          playerFactory.curSong.setVolume(0);  
        }
      } else {
        $scope.fMute = false;
        $scope.fMid = false;
        $scope.fHigh = true;
        if(playerFactory.curSong) {
          playerFactory.curSong.setVolume(80);  
        }
      }
    }

    //on clicking next, we emit id and status to change song on all devices
    $scope.next = function() {
      socket.emit("playNpause", {
       // id:  $scope.playListFinal[0].id,
        status: 'next'
      });
    }

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

    $scope.chatMessages = [];
    $scope.checkTyping = false;
    $scope.user = userName.name;
    $scope.typing = false;
    // this is how quick the "[other user] is typing" message will go away
    $scope.TYPING_TIMER_LENGTH = 4000; 

    $scope.chatSend = function() {
      var msg = JSON.stringify($scope.chatMsg);
      msg = $.parseJSON(msg);
      socket.emit('chat message', {username: $cookies.get('username'), msg: msg});
      $scope.chatMsg = "";
      $scope.overflowCtrl();
      return false;
    };

    $scope.overflowCtrl = function(){
      window.setTimeout(function() {
        var elem = document.getElementById('messages');
        elem.scrollTop = elem.scrollHeight;
      }, 0);
    };

  
    // ****************** LISTENS to emitted events *******************
    socket.on('removeSong' , function(event) {
      console.log("did we hit back client side?", event.id);
      console.log("scope playlist", $scope.playListFinal);

      for(var i = 0; i < $scope.playListFinal.length; i++) {
        if(event.id === $scope.playListFinal[i].id) {
          $scope.playListFinal.splice(i, 1);
        }
      }
    });


    socket.on('findArtist', function(obj) {
      soundService.getArtist(obj.query).then(function success(response, err){
       if(err) throw err;
      //Container to show audio information on the DOM
       $scope.playListFinal.push({
        id: '/tracks/' + response.data.id, 
        title: response.data.title, 
        artwork: response.data.artwork_url || 
                 response.data.user.avatar_url || 
                 'http://24.media.tumblr.com/3d736df5da284e889c9499756530efc8/tumblr_mno89p9spT1sped3xo1_400.gif',
        releaseYear: response.data.release_year,
        name: response.data.user.username
        });
      });
    });

    socket.on("playNpause", function(obj){
      if(obj.status === "play"){
        if(!playerFactory.curSong) {
          obj.id = $scope.playListFinal[0].id;
        
        //REGEX to filter out only the '/tracks/track_number'
          obj.id = obj.id.match(/\/tracks\/\d*/g);
        //fetches audio object for the provided track ID
          SC.stream(obj.id, function(audioObj) {
            playerFactory.curSong = audioObj;
            console.log('audioobj inside play func', audioObj);
            
    // ********* _onfinish needs to be defined AFTER curSong is defined but BEFORE play is called
            playerFactory.curSong._onfinish = function() {
              if ($scope.playListFinal.length === 1) {
                alert('Looks like there is nothing to play. Add some more songs and try again!')
              } else {
                $scope.next();
              }
            };
          });
        };
        playerFactory.isPlaying = true;
        playerFactory.curSong.play();
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
        // $scope.play();

        obj.id = $scope.playListFinal[0].id;
      //REGEX to filter out only the '/tracks/track_number'
        obj.id = obj.id.match(/\/tracks\/\d*/g);
      //fetches audio object for the provided track ID
        SC.stream(obj.id, function(audioObj) {
          playerFactory.curSong = audioObj;
          console.log('audioobj inside next func', audioObj);
          playerFactory.isPlaying = true;
          playerFactory.curSong._onfinish = function() {
            if ($scope.playListFinal.length === 1) {
              alert('Looks like there is nothing to play. Add some more songs and try again!')
            } else {
              $scope.next();
            }
          };
          playerFactory.curSong.play();
        });
      }
    });

    socket.on('chat message', function(msg) {
      console.log('socket on', msg);
      $scope.chatMessages.push(msg);
      $scope.overflowCtrl();
    });

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function(data) {
      data.typing = true;
      console.log($scope.user);
      $scope.typingMessage = data.name + " is typing";
      $scope.checkTyping = true;
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', function(data) {
      data.typing = false;
      $scope.checkTyping = false;
      $scope.typingMessage = '';
    });
  }
])

// *************************** Landing page Controller ********************************

.controller('LandingPage', ['$scope', '$location', 'socket', '$cookies', 'userName',
  function($scope, $location, socket, $cookies, userName) {
    // var name = '';

    $scope.submit = function(){
    if($scope.text){
      $cookies.put('username', $scope.text);
      userName.user($scope.text);
    }
     socket.emit('username', $cookies.get('username'));
     $location.path('/home', false);
     }
  }

]);
