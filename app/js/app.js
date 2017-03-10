'use strict';

var crudApp = angular.module('crudApp', ['ngRoute','ngDialog','ui-notification',
'ngAnimate','ngAria','ngMaterial','ui.bootstrap','ui.select','ngSanitize']);

crudApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
});



crudApp.config(['$routeProvider','NotificationProvider', '$httpProvider',
  function($routeProvider, NotificationProvider,$httpProvider) {
	var check = JSON.parse(localStorage.getItem("userData"));
	if(check) {
		$httpProvider.defaults.headers.post['Authorization'] = check.token;
	}

   $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl',
		resolve:{
            load: function($q, mainService, $location,$http){
				auth($q, mainService,$http);
            }
        }
      })
	  .when('/addMovie', {
        templateUrl: 'partials/addMovie.html',
        controller: 'addMovieCtrl',
		resolve:{
            load: function($q, mainService, $location,$http){
				auth($q, mainService,$http);
            }
        }
      })
	  .when('/editMovie', {
        templateUrl: 'partials/edit-page.html',
        controller: 'editMovieCtrl',
		resolve:{
            load: function($q, mainService, $location,$http){
				auth($q, mainService,$http);
            }
        }
      })
	  .when('/login', {
        templateUrl: 'partials/log-in.html',
        controller: 'login',
		
      })
	   .when('/signup', {
        templateUrl: 'partials/sign-up.html',
        controller: 'signup',
		
      })
	 
	 .otherwise({ redirectTo: '/', controller: 'homeCtrl', });
       NotificationProvider.setOptions({
        delay: 3000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'center',
        positionY: 'top',
        maxCount: 1,
    });
	var auth = function($q, mainService,$http) {
        var defer = $q.defer();
		$http.post('/api/authentication').success(function(response){
			return defer.promise;
		}).error(function(error){
			defer.reject("Not aunthaticated");
			//console.log('rejected')
			mainService.reject();
			console.clear();
		})
    }
  },
]);


crudApp.factory('socketio', ['$rootScope', 
	function($rootScope) {
		var socket = io.connect();
		return {
		on: function (eventName, callback) {
		  socket.on(eventName, function () {  
			var args = arguments;
			$rootScope.$apply(function () {
			  callback.apply(socket, args);
			});
		  });
		},
		emit: function (eventName, data, callback) {
		  socket.emit(eventName, data, function () {
			var args = arguments;
			$rootScope.$apply(function () {
			  if (callback) {
				callback.apply(socket, args);
			  }
			});
		  })
		}
  };
  },
]);
  