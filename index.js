var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on( 'connection', function( socket ){
  // Associate a username with the created socket.
  var cookies = socket.handshake.headers.cookie.split( ' ' );
  for ( var c = 0; cookies[c]; c++ ) {
    if ( cookies[c].search( '__acun__' ) >= 0 ) {
      socket.__un = cookies[c].split( '=' )[ 1 ]; 
    }
  }

  console.log( 'User connected:', socket.__un );

  io.emit('chat entered', { text: socket.__un + ' joined', users:io.sockets.sockets.length, time: new Date() });

  socket.on('chat message', function(msg){
    socket.__un = msg.u;
    console.log( 'msg: ', msg );
    io.emit('chat message', { text: msg.t, time: new Date(), u: socket.__un });
  });

  socket.on('disconnect', function(){
    console.log( 'user disconnected', socket.__un );
    io.emit('chat left', { text: socket.__un + ' left', users:io.sockets.sockets.length, time: new Date() });
  });
});


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
http.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});
