// ***************************** Soundservice Factory *********************************
appPlayer.factory('soundService', function($http) {
    var getArtist = function(tracknumber) {
        //sends a GET request to SoundCloud API with the inputed 'tracknumber'
        return $http({
            method: 'GET',
            url: 'https://api.soundcloud.com/tracks/' + tracknumber + '.json?consumer_key=8af4a50e36c50437ca44cd59756301ae'
        });
    };

    //returns getArtist method and playList array -- to populate it when audio Objects (audioObj);
    return {
        getArtist: getArtist
    };
})
