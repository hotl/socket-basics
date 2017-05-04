var express = require('express');
var PORT = process.env.PORT || 3000;
var app = express();
// Tells Node to start a new server and to use this express app
// as the boilerplate, so anything the express app listens to, the
// Server will listen to
var http = require('http').Server(app);

// allows us to serve static files
app.use(express.static(__dirname + '/public'));

http.listen(PORT, function() {
	console.log("Server listening on port " + PORT);
});