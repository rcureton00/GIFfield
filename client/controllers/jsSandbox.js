SC.initialize({
               client_id: '8af4a50e36c50437ca44cd59756301ae'
           });

           $scope.newSongCounter = 1;

           $scope.playlist = [
               { artist: 'Michael Jackson', songName: 'Wanna Be Startin Somethin', trackID: '/tracks/172001532' },
               { artist: 'Michael Jackson', songName: 'Baby Be Mine', trackID: '/tracks/33018061'},
               { artist: 'Michael Jackson', songName: 'The Girl is Mine', trackID: '/tracks/50851680'},
               { artist: 'Michael Jackson', songName: 'Thriller', trackID: '/tracks/205736706'},
               { artist: 'Michael Jackson', songName: 'Beat It', trackID:  '/tracks/100623452'},
               { artist: 'Michael Jackson', songName: 'Billie Jean', trackID: '/tracks/145377501'},
               { artist: 'Michael Jackson', songName: 'Human Nature', trackID: '/tracks/164797447'},
               { artist: 'Michael Jackson', songName: 'P.Y.T. (Pretty Young Thing)', trackID:  '/tracks/117673524'},
               { artist: 'Michael Jackson', songName: 'The Lady in My Life', trackID: '/tracks/146210294'}
           ];

           $scope.track = $scope.playlist[0].trackID;

           $scope.addToPlaylist = function(song){
             var newSongPlaylist = song.match(/\/playlists\/\d*/g);
             var newSongTracks = song.match(/\/tracks\/\d*/g);
             var newSong = newSongPlaylist || newSongTracks;
             var obj = { artist: 'unknown artist', songName: 'unknown song'+$scope.newSongCounter, trackID: newSong };
             $scope.newSongCounter++;
             socket.emit('songAdded', obj);
             $scope.playlist.unshift(obj);

             $scope.newSong = "";
           };

           socket.on('songAdded', function (obj){
             $scope.playlist.unshift(obj);
             $scope.newSongCounter++;
           });



           $scope.playThisSong = function (index){

               if($scope.isPlaying) $scope.pause();
               $scope.track = $scope.playlist[index].trackID;
               socket.emit('playThisSong', index);
               SC.stream($scope.track, function(player){
                   console.log('player', player);
                   playerFactory.player = player;
               });
               $scope.play();
           };

           socket.on('playThisSong', function(index){
               if($scope.isPlaying) $scope.pause();
               $scope.track = $scope.playlist[index].trackID;
               SC.stream($scope.track, function(player){
                   console.log('player', player);
                   playerFactory.player = player;
               });
               $scope.play();
           });

           SC.stream($scope.track, function(player) {
               console.log('player', player);
               playerFactory.player = player;
           });