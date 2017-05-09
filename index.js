var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//把所有人儲存在users
var users = {};
var user_count = 0;
app.use('/',express.static(__dirname + '/dist'));
app.use('/favicon.png', express.static('src/favicon.png'));

// app.get('/', function (req, res) {
//     res.sendFile('./dist/index.html', { root: __dirname });
// });

app.get('/', function(req, res){
  res.sendFile(__dirname + './dist/index.html');
});

//sockeio area
io.on('connection', function(socket){
  console.log('a user connected');
  var user = {};
  //使用者按下登陸之後 產生id time 等等細節
  // {
  //   id:'',
  //   time:'',
  //   socke:(socket)
  // }
  socket.on('login', function(callback){
    user.id = Math.floor(Math.random() * (9999 - 1 + 1) + 1);
    user.time = (new Date()).getTime();
    //把這個socket也存進去
    user.socket = socket;
    user.to = false;
    users[user.id] = user;
    //users裡面也存了
    callback(user.id);
    //console.log('login: '+ msg);
    for (var _id in users) {
      console.log(_id);
      if (!users[_id].to && _id != user.id) {
          //從最前面的找起
          users[_id].to = user.id;

          //並且傳 start給遠端 並帶入 對方id  這邊很重要
          user.socket.emit("start", _id, user.id);
          //user聊天對象也定義玩
          user.to = _id;

          //對方等待者也要接受start 對象
          users[_id].socket.emit("start", user.id, _id);
      }
    }
    console.log(user.id + " to "+user.to);
  });


    socket.on('disconnect', function(){
      if (user.to && users[user.to] && users[user.to].socket) {
          //傳給對象 跟他說我離開了
          users[user.to].socket.emit('userexit');
      }
      //刪除離開的那個人
      delete(users[user.id]);
    });


  socket.on('_userexit', function(){
    exchange('userexit');
  });

  socket.on('submit', function(msg,whoid){
    console.log('submit: '+ msg.text +'from '+ whoid);
    msg.whoid = whoid;
    exchange("messageAdd",msg)
    //io.emit('messageAdd', msg);
  });

  function exchange(evt, data) {
      if (user.to && users[user.to] && users[user.to].socket) {
          users[user.to].socket.emit(evt, data);
          users[user.id].socket.emit(evt, data);
      }
  }


});


//--socketio area

http.listen(3000, function(){
  console.log('listening on *:3000');
});
