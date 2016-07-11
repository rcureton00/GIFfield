appPlayer.controller('PlayerController', ['$scope', 'player',
  function($scope, player) {
    // Sound manager is a audio player library with hundreds of methods available,
    // The setup we have should be enough for a MVP.
    soundManager.setup({
      onready: function() {
        var mySound,
          showHidePlay;

        mySound = soundManager.createSound({
          url: 'http://users.skynet.be/fa046054/home/P22/track22.mp3'
        });

        $('.showPlay').on('click', function() {
          mySound.play();
          $('.showPlay').hide();
          $('.showPause').click(function() {
            $('.showPlay').show();
            mySound.pause();
          });

        });

        $('.volume').on('click', function() {
        });
      }
    });


  }
])
// .factory('player', function($rootScope, audio) {
//   var player;
//   var playlist = [];
//   var paused = false;
//   var current = {
//     album: 0,
//     track: 0
//   };

//   player = {
//     playlist: playlist,
//     current: current,
//     playing: false,
//     play: function(track, album) {
//       if(!playlist.length) {return;}
//       if(angular.isDefined(track)) {current.track = track;}
//       if(angular.isDefined(album)) {current.album = album;}

//       if(!paused) {
//         audio.src = playlist[current.album].tracks[current.track].url;
//         audio.play();
//         player.playing = true;
//         paused = false;
//       }
//     },
//     pause: function() {
//       if(player.playing) {
//         audio.pause();
//         player.playing = false;
//         paused = true;
//       }
//     },
//     reset: function() {
//       player.pause();
//       current.album = 0;
//       current.track = 0;
//     },
//     next: function() {
//       if(!playlist.length) {return;}
//       paused = false;
//       if(playlist[current.album].tracks.length > (current.track + 1)) {
//         current.track++;
//       } else {
//         current.track = 0;
//         current.album = (current.album + 1) % playlist.length;
//       }
//       if (player.playing) {player.play();}
//     },
//     previous: function() {
//       if(!playlist.length) {return;}
//       paused = false;
//       if(current.track > 0) {
//         current.track--;
//       } else {
//         current.album = (current.album - 1 + playlist.length) % playlist.length;
//         current.track = playlist[current.album].tracks.length - 1;
//       }
//       if(player.playing) {player.play();}
//     }
//   };

//   playlist.add = function(track) {
//     playlist.push(track);
//   };
//   playlist.remove = function(track) {
//     var index = playlist.indexOf(track);
//     playlist.splice(index, 1);
//   };

//   audio.addEventListener('ended', function() {
//     $rootScope.$apply(player.next);
//   }, false);

//   return player;
// })
// .factory('audio', function($document) {
//   var audio = $document[0].createElement('audio');
//   return audio;
// });
