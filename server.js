var express = require('express');
var PORT = process.env.PORT || 3000;
var app = express();
// Tells Node to start a new server and to use this express app
// as the boilerplate, so anything the express app listens to, the
// Server will listen to
var http = require('http').Server(app);
var io = require('socket.io')(http);

// allows us to serve static files
app.use(express.static(__dirname + '/public'));

// Event listener
io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('message', function(message) {
		console.log('Message received:', message.text);
		socket.broadcast.emit('message', message); // sends it to all connections, omitting the sending connection
	});

	socket.emit('message', {
		text: 'Welcome to the chat application'
	}); //1st arg is name of event, 2nd is data
});

http.listen(PORT, function() {
	console.log("Server listening on port " + PORT);
});