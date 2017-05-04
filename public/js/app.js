var socket = io();

socket.on('connect', function() {
	console.log('Connected to socket.io server');
});

socket.on('message', function(data) {
	console.log('Received data from server: ' + data.text);
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
		text: message
	});
});