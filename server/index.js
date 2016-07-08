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
  console.log('i connected', socket);
  
 // var addedUser = false;

  socket.on('username', function(name){
    console.log(name);
    // if(addedUser){return; };
    socket['name'] = name;
    // addedUser = true;

    // socket.broadcast.emit('user joined', {
    //   username: socket.name
    // })
  });

  socket.on('chat message', function(msg){
    var obj = {};
    obj['message'] = msg;
    

    io.emit('chat message', socket['name'] + ": " + msg);
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


//Initializing http on io makes it so its listening on this port
http.listen(8080, function(){
  console.log('App listening on port 8080');
});