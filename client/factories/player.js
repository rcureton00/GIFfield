// ********************************** Player Factory ***********************************
appPlayer.factory('playerFactory', function() {
    var singleton = {};
    singleton.curSong = null;
    singleton.isPlaying = false;
    SC.initialize({
        client_id: '8af4a50e36c50437ca44cd59756301ae'
    });
    return singleton;
})
