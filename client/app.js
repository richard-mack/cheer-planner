var Cheerleaders = angular.module('Cheerleaders', [ 'ngRoute', 'ngDragDrop']);

Cheerleaders.config(function ($routeProvider) {
	$routeProvider.when('/', {
      templateUrl: 'partials/index.html',
      controller: 'routineIndexController',
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    }).when('/routine/:id', {
    	templateUrl: 'partials/routineViewer.html',
    	controller: 'routineController',
    	access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/'
    });
});

Cheerleaders.run(function ($rootScope, $location, $route, AuthService) {
	console.log($rootScope);
	console.log($location);
	console.log($route);
	console.log(AuthService);
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});