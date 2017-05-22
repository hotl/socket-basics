const socket = io();
const name = getQueryVariable('name');
const room = getQueryVariable('room');
const $roomDiv = $('#room-div');

$roomDiv.html(room);
socket.on('connect', function() {
	console.log('Connected to socket.io server');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(data) {
	/*
	data contains text, timestamp, & name attributes
	*/
	console.log('Received data from server: ' + JSON.stringify(data));
	$msgDiv = $('#messages');

	let formatTime = moment.utc(parseInt(data.timestamp)).local().format('h:mm A');

	let msg = data.timestamp ? 
		$('<p>').html('<p><strong>' + data.name
			+ '   ' + formatTime + '</strong></p>' + data.text) :
		$('<p>').html(data.text);

	$msgDiv.append(msg);
});

// Handles submitting of new message
var $form = $('#message-form');

$form.on('submit', function(event) {
	event.preventDefault(); // prevents page refresh
	var $input = $form.find('input[type=text]');
	var message = $input.val();
	$input.val("");
	if (!message) return;
	socket.emit('message', {
		text: message,
		name: name || 'Anonymous'
	});
});

