
var Movie = require('../datasets/movies');

// Add movi to db
module.exports.saveMovie = function(req,res) {
	var response = {};
	if (req){
		
		var movie = new Movie(req.body);
		movie.save();
		
		response.message = 'Movie succesfully added';
		res.status(200).json(response.message);
		
		
		return;
	
	};
};

// Send movie to client
module.exports.getMoviesList = function(req, res) {
	var response = {};
	Movie.find({}, function (err, docs) {
		
		if (docs) {
			res.status(200).json(docs);
			return;
		}
	});
};

// Delete movies from database
module.exports.deleteMovie = function(io) {
	return function(req, res) {
		var response = {};
		Movie.findOne({name : req.body.movieName}, function (err, docs) {
			io.emit('movieDeleted');
			docs.remove();
			docs.save();
			response.message=req.body.movieName + " - Movie deleted"
			res.status(200).json(response.message);
			return;
		});
	};
};

// Edit and save movies data
module.exports.editMovie = function(io) {
	return function(req, res) {
		var response = {};

		Movie.findOne({_id : req.body._id}, function (err, docs) {
			docs.name = req.body.name;
			docs.review = req.body.review;
			docs.director = req.body.director;
			docs.genre = req.body.genre;
			docs.year = req.body.year;
			docs.user = req.body.user;
			docs.save();
			response.message="Succefully edited"
			res.status(200).json(response.message);
			return;
		});
	};
};


