var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('chat entered', { text:'User joined', users:io.sockets.sockets.length, time: new Date() });

  socket.on('chat message', function(msg){
    io.emit('chat message', { text: msg, time: new Date() });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('chat left', { text:'User left', users:io.sockets.sockets.length, time: new Date() });
  });
});


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
http.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});
