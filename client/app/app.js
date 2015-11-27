angular.module('cc',[
	'ui.bootstrap',
	 'ngCookies',
	'ngResource',
	'ui.router',
	'ngMessages',
	'ngAnimate'
	])
	.config(function( $urlRouterProvider, $locationProvider, $httpProvider){
		$urlRouterProvider
			.otherwise('/');
		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');
	})
	.factory('authInterceptor', function($rootScope, $location, $cookies, $q){
		return {
			request: function(config){
				config.headers = config.headers || {};
				if($cookies.get('token')){
					config.headers.authorization = 'Bearer ' + $cookies.get('token');
				}
				return config;
			},
			responseError: function(response){
				if(response.status === 401){
					//下面三行代码是需要主动营销加的
					if(typeof window.postMessage !== undefined){
						window.postMessage(JSON.stringify(response), 'http://127.0.0.1:3000');
					}
					
					$location.path('/');
					$cookies.remove('token');
					return $q.reject(response);
				} else {
					return $q.reject(response);
				}
			}
		};
	})
	.run(function($rootScope, $location, Auth){
		$rootScope.$on('$stateChangeStart', function(event,toState){
			Auth.isLoggedInAsync(function(isLoggedIn){
				if(!isLoggedIn &&  toState.name !== 'home'){
					event.preventDefault();
					$rootScope.showLogin('sm');
				}
			});
		});
	});











