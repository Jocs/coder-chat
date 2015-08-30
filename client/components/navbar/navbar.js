angular.module('cc',['ui.bootstrap'])
	.controller('NavController', function($scope, $location){
		$scope.isCollapsed = true;
		$scope.brand = {
			'icon':'glyphicon glyphicon-globe'
		};
		$scope.serach = {
			'icon':'glyphicon glyphicon-search'
		};
		$scope.menu = [
			{
				'title':'主页',
				'link' : '/',
				'icon' : 'glyphicon glyphicon-home'
			},
			{
				'title':'通知',
				'link' :'reminder',
				'icon' : 'glyphicon glyphicon-bell'
			},
			{
				'title':'消息',
				'link' :'message',
				'icon' : 'glyphicon glyphicon-envelope'
			}
		];
		$scope.isLoggedIn = true;
		$scope.currentUser = {
			'name':'ransixi',
			'src': 'assets/images/profile.jpg'
		};
		$scope.isActive = function(link){
			return $location.path() === link;
		};
	});