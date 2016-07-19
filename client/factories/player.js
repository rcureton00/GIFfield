// ********************************** Player Factory ***********************************
appPlayer.factory('playerFactory', function() {
    var singleton = {};
    singleton.curSong = null;
    singleton.isPlaying = false;
    SC.initialize({
        client_id: '8af4a50e36c50437ca44cd59756301ae'
    });
    return singleton;
});


// Work on it later
// appPlayer.factory('duration', function($interval) {
//     var tracker = function() { // Initiate for each time the song starts.
//         window.setInterval(function() {
//             methods.trackPosition += methods.oneBit; // Track the position of the song.
//             console.log(methods.trackPosition);
//         }, methods.oneBit);
//     };
//     var interval = function() {
//         tracker();
//         $interval(function() {
//             methods.val += 1;
//             if (methods.val > 100) {
//                 methods.pause();
//                 methods.val = 0;
//             }
//         }, methods.fullDuration);
//     };
//     var methods = {
//         trackPosition: 0, // Shows the current position on the track
//         val: 0, // Initial value of the progress bar.
//         fullDuration: 0, // Shows the duration of our current track
//         oneBit: 0, // Store a 1/100th of the duration
//         pause: function() {
//             console.log('pausing the progress bar', methods.trackPosition);
//             window.clearInterval(interval);
//             window.clearInterval(tracker);
//         },
//         play: function() {
//             console.log('interval initialized')
//             return interval();
//         },
//         retrieveDuration: function(duration) { // Assign the track duration to our local value.
//             // always the first one to run;
//             methods.fullDuration = duration;
//             // console.log(methods.fullDuration);
//             methods.oneBit = methods.fullDuration / 100; // Store a 1/100th of the duration
//         }
//     }

//     return methods;
// });
