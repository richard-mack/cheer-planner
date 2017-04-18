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
		return $http({
			url : '/api/status',
			method : 'GET'
		})
      // handle success
      .then(function (data) {
      	if(data.status){
      		user = true;
      	} else {
      		user = false;
      	}
      })
      // handle error
      .catch(function (data) {
      	user = false;
      });
	}

	var login = function (username, password) {
		var deferred = $q.defer();

		$http.post('api/login', {username : username, password : password})
		.then(function (data) {
			if (data.status && data.status == 200) {
				user = true;
				deferred.resolve();
			} else {
				user = false;
				deferred.reject();
			}
		})
		.catch(function (data) {
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	}

	var logout = function () {
		var deferred = $q.defer();

		$http.get('api/logout')
		.then(function (data) {
			user = false;
			deferred.resolve();
		})
		.catch(function (data) {
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	}

	var register = function (username, password) {
		var deferred = $q.defer();

		$http.post('api/register', {username: username, password: password})

    	.then(function (data, status) {
	    	if(status === 200 && data.status){
	    		deferred.resolve();
	    	} else {
	    		deferred.reject();
	    	}
    	})
    	.catch(function (data) {
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