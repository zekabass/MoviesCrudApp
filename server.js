(function(){
	// Var definitions
	var express = require('express');
	var app = express();
	var http = require('http').Server(app)
	var io = require('socket.io')(http);

	var mongoose = require('mongoose');

	var bodyParser = require('body-parser');
	
	var jwt = require('jsonwebtoken');
	var expressJWT = require('express-jwt');
	var fs = require('fs');
	
	var exec = require('child_process').exec;
	var request = require('request');

	
	//Starting server
	http.listen(3333, function () {
		console.log('Server listening on port 3333')
	});
	
	//SOCKET.IO stuff
	var clients = [];
	io = io.sockets.on('connection',function(socket){  
		console.log("A user is connected");
		var address = socket.handshake.address;
		console.info('New client connected (id=' + socket.id + ').');
		console.info(address);
		clients.push(socket);

		// When socket disconnects, remove it from the list:
		socket.on('disconnect', function() {
			var index = clients.indexOf(socket);
			if (index != -1) {
				clients.splice(index, 1);
				console.info('Client gone (id=' + socket.id + ').');
			};
		});
	});

	//Database connection
	mongoose.connect('mongodb://localhost:27017/maindb');


	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(express.static(__dirname + '/app'));

	var authController = require('./server/controllers/authController');
	var movieController = require('./server/controllers/movieController');

	//Authentication http requests handle
	app.post('/api/signin', authController.signin);
	app.post('/api/signup', authController.signup);
	app.post('/api/authentication', authController.authentication);
	
	//Movies data http requests handle
	app.post('/api/saveMovie', movieController.saveMovie);
	app.post('/api/getMoviesList', movieController.getMoviesList);
	app.post('/api/deleteMovie', movieController.deleteMovie(io));
	app.post('/api/editMovie', movieController.editMovie(io));
	
	

})();


