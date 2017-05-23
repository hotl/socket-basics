const socket = io();
const name = getQueryVariable('name');
const room = getQueryVariable('room');
const $roomDiv = $('#room-div');
const $messages = $('#messages');

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

	let formatTime = moment.utc(parseInt(data.timestamp)).local().format('h:mm A');

	let $msg = data.timestamp ? 
		$('<li>').html('<li><strong>' + data.name
			+ '   ' + formatTime + '</strong></li>' + data.text) :
		$('<li>').html(data.text);

	$messages.append($msg);
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

