var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/',express.static(__dirname + '/dist'));

// app.get('/', function (req, res) {
//     res.sendFile('./dist/index.html', { root: __dirname });
// });

app.get('/', function(req, res){
  res.sendFile(__dirname + './dist/index.html');
});

//sockeio area
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('submit', function(msg){
    console.log('submit: '+ msg);
    io.emit('messageAdd', msg);
  });

});


//--socketio area

http.listen(3000, function(){
  console.log('listening on *:3000');
});
