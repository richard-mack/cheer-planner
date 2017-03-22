angular.module('Cheerleaders').factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {
	var user = null;

	var isLoggedIn = function () {
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	var getUserStatus = function () {
		return $http.get('/api/status')
      // handle success
      .success(function (data) {
      	if(data.status){
      		user = true;
      	} else {
      		user = false;
      	}
      })
      // handle error
      .error(function (data) {
      	user = false;
      });
	}

	var login = function (username, password) {
		var deferred = $q.defer();

		$http.post('api/login', {username : username, password : password})
		.success(function (data, status) {
			if (status == 200 && data.status) {
				user = true;
				deferred.resolve();
			} else {
				user = false;
				deferred.reject();
			}
		})
		.error(function (data) {
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	}

	var logout = function () {
		var deferred = $q.defer();

		$http.get('api/logout')
		.success(function (data) {
			user = false;
			deferred.resolve();
		})
		.error(function (data) {
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	}

	var register = function (username, password) {
		var deferred = $q.defer();

		$http.post('api/register', {username: username, password: password})

    	.success(function (data, status) {
	    	if(status === 200 && data.status){
	    		deferred.resolve();
	    	} else {
	    		deferred.reject();
	    	}
    	})
    	.error(function (data) {
    		deferred.reject();
    	});

  		return deferred.promise;
	}

	return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });
}])