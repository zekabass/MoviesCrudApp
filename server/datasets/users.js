var mongoose = require('mongoose');
//Users database scheme
module.exports = mongoose.model('User', {
	email: String,
	username: String,
	password: String,
});