var mongoose = require('mongoose');
//Users database scheme
module.exports = mongoose.model('Movie', {
	name: String,
	director: String,
	year: String,
	review: String,
	user: String,
	genre: String,
});