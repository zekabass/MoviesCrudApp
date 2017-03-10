var jwt = require('jsonwebtoken');
var User = require('../datasets/users');

// Users Sign-in logic
module.exports.signin = function(req, res) {
	var response = {}
	if (req){
		User.find({email : req.body.email}, function (err, docs) {
			if (docs.length){
				if (req.body.password === docs[0].password ) {
					var myToken = jwt.sign({ email:req.body.email}, '123abcd')
					response.token = myToken;
					response.message = 'success';
					response.email = req.body.email;
					response.user = docs[0].username;
					res.status(200).json(response);
					return;
				} else {
					res.status(401).send('Wrong password');
				}
			}else{
				res.status(401).send('No user with that email');
			}
		});
	}
};

// Users Sign-up logic
module.exports.signup = function(req, res) {
	var response = {};
	User.find({email : req.body.email}, function (err, docs) {
		if (docs.length){
			res.status(401).send('User already exists');
		}else{
			var user = new User(req.body);
			user.save();
			response.message = 'success';
			res.status(200).json(response);
			return;
		}
	});
};


// Authentication. Validating user token.
module.exports.authentication = function(req, res) {
	var token = req.headers.authorization
	try {
		var decoded = jwt.verify(token, '123abcd');
		res.status(200).send('Access granted');
		
	} catch(err) {
		res.status(401).send('You dont have authorization');
	}
};