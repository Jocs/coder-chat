angular.module('cc',[
	'ui.bootstrap',
	'ngCookies',
	'ngResourse',
	'ui.router',
	'ui.bootstrap'
	])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
		$urlRouterProvider
			.otherwise('/');
		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');
	})
	.factory('authInterceptor', function($location, $cookies, $q){
		return {
			request: function(config){
				config.headers = config.headers || {};
				if($cookies.get('token')){
					config.headers = 'Bearer ' + $cookies.get('token');
				}
				return config;
			},
			responseError: function(response){
				if(response.status === 401){
					$location.path('/login');
					$cookies.remove('token');
					return $q.reject(response);
				} else {
					return $q.reject(response);
				}
			}
		};
	})
	.run(function($rootScope, $location, Auth){
		$rootScope.$on('stateChangeStart', function(event, next){
			
		})
	});











