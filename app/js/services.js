crudApp.service("mainService" ,['$http', '$location', '$window','$route', function ($http,$location,$window,$route) {
	var self = this;
	
	self.toggleText = false;
	
	var check = JSON.parse(localStorage.getItem("userData"));
	if (check) {
		self.login = check.login;
	}
	
	self.reject = function() {
		self.login = false;
		$location.path("/login");
		localStorage.clear();
		
	}
	
	self.loginFun = function() {
		var check = JSON.parse(localStorage.getItem("userData"));
		if (check) {
			self.login = check.login;
		}
		return self.login;
	}
	
}]);
