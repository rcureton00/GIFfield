var express = require('express');
var app = express();
var http = require('http').Server(app);
var request = require('request');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);


app.use(express.static('../client'));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile('index.html');

});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});






// SC.initialize({
//   client_id: '8af4a50e36c50437ca44cd59756301ae',
//   redirect_uri: 'localhost.com/callback.html'
// });

//Initializing http on io makes it so its listening on this port
http.listen(8080, function(){
  console.log('App listening on port 8080');
});