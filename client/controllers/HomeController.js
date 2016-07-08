appPlayer.controller('HomeController', ['$scope', 'socket',
    function($scope, socket) {
        // Sound manager is a audio player library with hundreds of methods available,
        // The setup we have should be enough for a MVP.
        

        /// chat controller stuff

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
    $scope.setName = function(){
      //console.log($scope.screenName);
      socket.emit('username', $scope.screenName);
    };

  var Music = function() {
      this.playSound = function(urls) {
        return soundManager.setup({
          onready: function() {
          soundManager.createSound({ url: urls}).play();

        }
      });
    }
  };
 
//CLICK AND THEN EMIT

var musicInstance = new Music();
$('.showPlay').on('click', function() {
  // var playMusic = musicInstance.playSound('http://users.skynet.be/fa046054/home/P22/track22.mp3');
  // playMusic.play();
  socket.emit("playNpause", "playing"); 
  musicInstance.playSound('http://users.skynet.be/fa046054/home/P22/track22.mp3');

});


//LISTENING --

  socket.on("playNpause", function(obj){
        console.log('we heard you', obj);



//PLAY WHEN HEARD
    var musicInstance = new Music();
    
    // var playMusic = musicInstance.playSound('http://users.skynet.be/fa046054/home/P22/track22.mp3');
    // playMusic.play();
    musicInstance.playSound('http://users.skynet.be/fa046054/home/P22/track22.mp3');



});


  // 'http://users.skynet.be/fa046054/home/P22/track22.mp3';

      // $('.showPlay').on('click', function() {
      //     console.log('CLIENT: play');
      //     playMusic.play();
      //     socket.emit("playNpause", "playing"); 
      //     $('.showPlay').hide();
      //     $('.showPause').click(function() {
      //         $('.showPlay').show();
      //         playMusic.pause();
      //         socket.emit("playNpause", function() { 
      //           console.log(' CLIENT: pause'); 
      //           playMusic.pause();
      //         });   
      //     });
       //Broadcast play function
       
       // socket.on("playNpause", function(){
       //  console.log('we heard you');
       //  mySound.play();
       // });



      // });
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
