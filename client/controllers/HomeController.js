appPlayer.controller('HomeController', ['$scope', 'socket', 'playerFactory', 'userName',
        function($scope, socket, playerFactory, userName) {
            // Sound manager is a audio player library with hundreds of methods available,
            // The setup we have should be enough for a MVP.
            SC.initialize({
                client_id: '8af4a50e36c50437ca44cd59756301ae'
            });
            let track = '/tracks/293';
            $scope.isPlaying = false;

            SC.stream(track, function(player) {
                console.log('player', player);
                playerFactory.player = player;
            });

            $scope.play = function() {
                console.log("player from fac", playerFactory.player);
                if (playerFactory.player && !playerFactory.isPlaying) {
                    playerFactory.isPlaying = true;
                    $scope.isPlaying = true;
                    playerFactory.player.play();
                    console.log('after play', playerFactory.player.id);
                    socket.emit("playNpause", {
                        id: playerFactory.player.id,
                        status: 'play'
                    });
                }
            }

            $scope.pause = function() {
                if ( /*playerFactory.player &&*/ playerFactory.isPlaying) {
                    console.log('player from fac', playerFactory.player);
                    playerFactory.isPlaying = false;
                    $scope.isPlaying = false;
                    playerFactory.player.pause();
                    socket.emit("playNpause", {
                        id: playerFactory.player.id,
                        status: 'pause'
                    });
                }
            }


            // SC.stream(track, function(player){
            //   $('#playBack').click(function(e) {
            //     e.preventDefault();
            //     player.start();
            //     socket.emit("playNpause", track);
            //   });
            //   $('#stop').click(function(e) {
            //     e.preventDefault();
            //     player.pause();
            //     socket.emit("playNpause", "pausing");
            //   });
            // });

            /// chat controller stuff

            $scope.user = false;
            $scope.typing = false;
            $scope.TYPING_TIMER_LENGTH = 4000; // this is how quick the "[other user] is typing" message will go away
            $scope.chatSend = function() {
                var msg = JSON.stringify($scope.chatMsg);
                msg = $.parseJSON(msg);
                socket.emit('chat message', msg);
                $scope.chatMsg = "";
                return false;
            }

            $scope.chatMessages = [];

            socket.on('chat message', function(msg) {
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



            //LISTENING --

            //PLAY WHEN HEARD from SOCKETS
            socket.on("playNpause", function(obj) {
                console.log('we heard you', obj);

                if (!playerFactory.isPlaying && obj.status === "play") {
                    SC.stream('/tracks/293', function(player) {
                        console.log('player', player);
                        playerFactory.player = player;
                        playerFactory.isPlaying = true;
                        playerFactory.player.play();
                    });
                }

                if (obj.status === "pause") {
                    playerFactory.player.pause();
                }

                // SC.stream(obj, function(player){
                //   player.start();
                // });
                // if(obj === 'playing'){
                //  // musicInstance.playSound('http://users.skynet.be/fa046054/home/P22/track22.mp3', true);

                // }
                // if(obj === 'pausing'){

                //   musicInstance.playSound.pause();
                // }

            });
        }
    ])
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
    .factory('playerFactory', function() {
        var singleton = {};
        singleton.player = null;
        singleton.isPlaying = false;
        return singleton;
    })
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
    .factory('userName', function() {
        var userSet = {};
        userSet.name = '';
        userSet.user = function(userVal) {
            userSet.name = userVal;
        };

        return userSet;
    }) // autofocus directive, html5 autofocus with doesn't do well with Angular's templates.
    .directive('autofocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                });
            }
        }
    }]);
