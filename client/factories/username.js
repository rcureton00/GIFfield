// ***************************** User Name Factory *********************************
appPlayer.factory('userName', function() {
    var userSet = {};
    userSet.name = '';
    userSet.user = function(userVal) {
        userSet.name = userVal;
    };

    return userSet;
})
