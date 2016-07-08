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

  
 






       socket.on("playNpause", function(obj){
                  console.log('we heard you', obj);
                 });

        soundManager.setup({
            onready: function() {
                var mySound,
                    showHidePlay;

                mySound = soundManager.createSound({
                    url: 'http://users.skynet.be/fa046054/home/P22/track22.mp3'
                });

                $('.showPlay').on('click', function() {
                    console.log('CLIENT: play');
                    mySound.play();
                    socket.emit("playNpause", function(){mySound.play();}); 
                    $('.showPlay').hide();
                    $('.showPause').click(function() {
                        $('.showPlay').show();
                        mySound.pause();
                        socket.emit("playNpause", function()
                          { console.log(' CLIENT: pause'); 
                          mySound.pause();});   
                    });
                 //Broadcast play function
                 
                 // socket.on("playNpause", function(cb){
                 //  console.log('we heard you', cb);
                 // });



                });

                $('.volume').on('click', function() {

                });
            }
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
