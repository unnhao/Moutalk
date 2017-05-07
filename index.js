var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use('/',express.static(__dirname + '/dist'));

// app.get('/', function (req, res) {
//     res.sendFile('./dist/index.html', { root: __dirname });
// });

app.get('/', function(req, res){
  res.sendFile(__dirname + './dist/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
