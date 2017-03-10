
crudApp.controller("login" ,['$scope', '$http', '$location', 'Notification', 'mainService', '$window', function ($scope, $http, $location, Notification, mainService,$window) {
	//mainService.checkLogin();
	
	$scope.loginData = {};
	var userLocalData = {};
	
	$scope.submit = function() {
		$scope.newUser = {
			email: $scope.loginData.email,
			password: $scope.loginData.password,
		}; 
		if ($scope.loginData.email && $scope.loginData.password) {
			$http.post('/api/signin', $scope.newUser).success(function(response){
				if(response.message) {
					$window.location.reload();
					userLocalData.login = true;
					userLocalData.email =  response.email;
					userLocalData.user = response.user
					userLocalData.token = response.token;
					localStorage.setItem("userData", JSON.stringify(userLocalData));
					mainService.loginFun();
				}
			}).error(function(error){
				console.log(error)
				Notification.error({message: error, replaceMessage: true});
			})
		}
	}
	
}]);


crudApp.controller("signup" ,['$scope', '$http', '$location', 'Notification', 'mainService', function ($scope, $http, $location, Notification, mainService) {
		//mainService.checkLogin();
		$scope.service = mainService;
		
		$scope.singupData = {};
	
		$scope.submit = function() {
			if ($scope.singupData.email && $scope.singupData.fullName && $scope.singupData.password) {
				if ($scope.singupData.email === $scope.singupData.emailConfirm) {
					$scope.newUser = {
						email: $scope.singupData.email,
						username: $scope.singupData.fullName,
						trelloName: $scope.singupData.trelloName,
						password: $scope.singupData.password,
					};
					$http.post('/api/signup', $scope.newUser).success(function(response){
						$location.path("/login");
					}).error(function(error){
						console.log(error);
						Notification.error({message: error, replaceMessage: true});
					})
				} else {
					Notification.error({message: 'Emails are not the same', replaceMessage: true});
				}
			} else {
				Notification.error({message: 'Enter data', replaceMessage: true});
			}
			
		}
}]);


crudApp.controller("homeCtrl" ,['$scope', '$http', '$location', 'Notification', 'mainService','$route','$window', 'socketio','$timeout', function ($scope, $http, $location, Notification, mainService,$route, $window, socketio, $timeout) {
		
	$scope.service = mainService;
	
	$http.post('/api/getMoviesList').success(function(response){
		if(response){
			$scope.fullMovieList = response;		
		}
		
	}).error(function(error){
		console.log(error)
		Notification.error({message: error, replaceMessage: true});
	})
	
	$scope.deleteMovie = function(movieName) {
		var request = {};
		request.movieName = movieName;
		$http.post('/api/deleteMovie',request).success(function(response){
			if(response){
				Notification.success({message: response, replaceMessage: true});
			}
		}).error(function(error){
			console.log(error)
			Notification.error({message: error, replaceMessage: true});
		})	
	}
	
	//io Sockets
	socketio.on('movieDeleted', function(res) {
		$timeout(function() {
			$route.reload()
		});
	});
		
}]);


crudApp.controller("rootController" ,['$scope', '$http', '$location', 'Notification', 'mainService', '$route', 'socketio', '$timeout', '$window', function ($scope, $http, $location, Notification, mainService, $route,socketio, $timeout,$window) {
	$location.path("/");
	$scope.service = mainService;
	
	var lsData = JSON.parse(localStorage.getItem("userData"));
	
	if (lsData) {
		data = {};
		data.user = lsData.user;
		$scope.user = lsData.user;
		$scope.service.user = lsData.user;
	};
	
	$scope.singout = function() {
		localStorage.clear();
		$window.location.reload();
	};	
}]);


crudApp.controller("addMovieCtrl" ,['$scope', '$http', '$location', 'Notification', 'mainService', '$route', 'socketio', '$timeout', '$window', function ($scope, $http, $location, Notification, mainService, $route,socketio, $timeout,$window) {

	$scope.service = mainService;
	
	$scope.saveMovie = function (){
		if($scope.movieData) {
			if($scope.movieData.name) {
				if(isNaN($scope.movieData.year)){
					Notification.error({message: 'Year must be a number', replaceMessage: true});
				} else {
					$scope.movieData.user = $scope.service.user;
					$http.post('/api/saveMovie', $scope.movieData).success(function(response){
						Notification.success({message: response, replaceMessage: true});
						$route.reload();
						
					}).error(function(error){
						console.log(error)
						Notification.error({message: error, replaceMessage: true});
					})
				}
			} else {
				Notification.error({message: 'You must enter movie name', replaceMessage: true});
			}
		} else {
			Notification.error({message: 'Enter data', replaceMessage: true});
		}
	}
}]);


crudApp.controller("editMovieCtrl" ,['$scope', '$http', '$location', 'Notification', 'mainService', '$route', 'socketio', '$timeout', '$window', function ($scope, $http, $location, Notification, mainService, $route,socketio, $timeout,$window) {

	$scope.service = mainService;
	
	$scope.movie = $scope.service.selMovie;
	
	$scope.edit = function (movieData){
		
		if(movieData.name) {
			if(isNaN(movieData.year)){
				Notification.error({message: 'Year must be a number', replaceMessage: true});
			} else {
				movieData.user = $scope.service.user;
				$http.post('/api/editMovie', movieData)
				.success(function(response){
					Notification.success({message: response, replaceMessage: true});
					$location.path('/');
				}).error(function(error){
					console.log(error)
					Notification.error({message: error, replaceMessage: true});
				})
			}
		} else {
			Notification.error({message: 'You must enter movie name', replaceMessage: true});
		}
	}

}]);