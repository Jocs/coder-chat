angular.module('cc')
  .controller('PostController', function($rootScope,$interval, $scope){
  	$scope.$on('$showPost', function(e,data){
  		$scope.isShowPost = data;
  	});
  	$scope.closePost = function(){
  		var count = 5;
  		angular.element('body').css('overflow','auto');
  		$rootScope.maskShow = false;
  		$scope.isShowPost = false;
  		var timer = $interval(function(){
  			count --;
  			if(count >= 0){
  				angular.element('#blur').css('webkitFilter', 'blur(' + count + 'px)');
  			} else {
  				$interval.cancel(timer);
  			}
  		},100);
  	};
  });