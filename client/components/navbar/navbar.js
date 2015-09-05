angular.module('cc')
	.controller('NavController', function($rootScope, $scope, $location,$interval, Auth){
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
				'state' : 'home',
				'icon' : 'glyphicon glyphicon-home',
				'link':'/'
			},
			{
				'title':'通知',
				'state' :'reminder',
				'icon' : 'glyphicon glyphicon-bell',
				'link':'/reminder'
			},
			{
				'title':'消息',
				'state' :'message',
				'icon' : 'glyphicon glyphicon-envelope',
				'link':'/message'
			}
		];
		console.log($location.path());
		$rootScope.isLoggedIn = Auth.isLoggedIn();
		$scope.currentUser = {
			'name':'ransixi',
			'src': 'assets/images/profile.jpg'
		};
		$scope.isActive = function(link){
			return $location.path() === link;
		};
		//dropdown menu profile info
		$scope.profileInfo = [
			{'link':'/profile','content':'个人主页', 'icon': 'glyphicon glyphicon-user'},
			{'link':'/setting','content':'个人设置', 'icon': 'glyphicon glyphicon-cog'},
			{'link':'/friendslist','content':'好友列表', 'icon': 'glyphicon glyphicon-list'}
		];
		$scope.status = {
			isopen: false
		};
		//logout
		$scope.logout = function(){
			Auth.logout();
			$location.path('/');
			$rootScope.isLoggedIn = false;
		};
		$scope.showPost = function(){
			var count = 0;
			angular.element('body').css('overflow','hidden');
			$rootScope.$broadcast('$showPost', true);
			//timer是用来使背景虚化－》高斯模糊效果
			var timer = $interval(function(){
				count ++;
				if(count <= 5){
					angular.element('#blur').css('webkitFilter' , 'blur(' + count + 'px)');
				} else {
					$interval.cancel(timer);
				}
			},100);
		};












	});