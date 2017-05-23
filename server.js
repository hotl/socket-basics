const express = require('express');
const moment = require('moment');
const PORT = process.env.PORT || 3000;
const app = express();
// Tells Node to start a new server and to use this express app
// as the boilerplate, so anything the express app listens to, the
// Server will listen to
const http = require('http').Server(app);
const io = require('socket.io')(http);
const clientInfo = {};

// allows us to serve static files
app.use(express.static(__dirname + '/public'));

// Sends current users to provided socket
function sendCurrentUsers(socket) {
	let info = clientInfo[socket.id];
	let users = [];

	if (typeof info === undefined) return;
	Object.keys(clientInfo).forEach((socketId) => {
		if (clientInfo[socketId].room === info.room) {
			users.push(clientInfo[socketId].name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current Users: ' + users.join(', '),
		timestamp: moment().valueOf()
	})
}

// Sends private message to user
function sendPrivateMessage(socket, user) { 
	Object.keys(clientInfo).forEach((socketId) => {
		if (clientInfo[socketId].name === user.name) {
			user.userId = socketId;
		}
	});
	socket.join(user.userId);
	socket.broadcast.to(user.userId).emit('message', {
		text: 'Private message',
		timestamp: moment().valueOf(),
		name: clientInfo[socket.id].name
	});
}

// Event listener
io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log('Message received:', JSON.stringify(message, null, 2));

		if (message.text === '@currentUsers') return sendCurrentUsers(socket);
		else if (message.text.substr(0, 8) === '@private') {
			let user = {
				name: message.text.substr(8).trim()
			};
			return sendPrivateMessage(socket, user);
		}
		message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.on('disconnect', function() {
		let userData = clientInfo[socket.id];
		if (typeof userData !== undefined) {
			socket.leave(userData.room);
			delete clientInfo[socket.id];
			io.to(userData.room).emit('message', {
				text: userData.name + ' has disconnected',
				timestamp: moment().valueOf(),
				name: 'System'
			})
		}
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


