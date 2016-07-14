var express = require('express');
var app = express();
var http = require('http').Server(app);
var request = require('request');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);


app.use(express.static(__dirname +'/../client'));
app.use(bodyParser.json());

app.get('/', function(req, res){
 res.sendFile(__dirname +'/../client/index.html');
});


io.on('connection', function(socket){

  socket.on('playNpause', function(cb){
    console.log('SERVER CAUGHT', cb);
    socket.broadcast.emit('playNpause', cb);
  });

  socket.on('playNpause', function(cb){
    console.log('SERVER CAUGHT', cb);
    io.emit('playNpause', cb);
  });

  socket.on('username', function(name){
    socket['name'] = name;
    
  });

  socket.on('chat message', function(msg){
    var obj = {};
    obj['message'] = msg;
    io.emit('chat message', socket['name'] + ": " + msg);
    
    console.log('message: ' + msg);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      name: socket.name
    });
  });
  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.name
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // when the client emits 'startPlay', we broadcast it to others
  socket.on('startPlay', function(){
    console.log("index.js socket.on startPlay invoked");
    socket.broadcast.emit('startPlay', {
      name: socket.name
    });
  });

  // when the client emits 'stopPlay', we broadcast it to others
  socket.on('stopPlay', function(){
    console.log("index.js socket.on stopPlay invoked");
    socket.broadcast.emit('stopPlay', {
      name: socket.name
    });
  });

});

//Initializing http on io makes it so its listening on this port
http.listen(process.env.PORT || 8000, function(){
  console.log('App listening on port 8000');
});


