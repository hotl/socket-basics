const express = require('express');
const moment = require('moment');
const PORT = process.env.PORT || 3000;
const app = express();
// Tells Node to start a new server and to use this express app
// as the boilerplate, so anything the express app listens to, the
// Server will listen to
const http = require('http').Server(app);
const io = require('socket.io')(http);

// allows us to serve static files
app.use(express.static(__dirname + '/public'));

// Event listener
io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('message', function(message) {
		console.log('Message received:', JSON.stringify(message));
		message.timestamp = moment().valueOf();
		io.emit('message', message); // sends it to all connections
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application',
		timestamp: moment().valueOf(),
	}); //1st arg is name of event, 2nd is data
});

http.listen(PORT, function() {
	console.log("Server listening on port " + PORT);
});


