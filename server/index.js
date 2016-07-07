var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');


app.use(express.static('../client'));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile('index.html');

});


app.listen(8080, function(){
  console.log('App listening on port 8080')
});