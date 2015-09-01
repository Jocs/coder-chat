angular.module('cc')
	.config(function( $stateProvider) {
		$stateProvider
		  .state('home',{
		  	url:'/',
		  	templateUrl:'app/main/main.html',
		  	controller:'MainController'
		  });
	});