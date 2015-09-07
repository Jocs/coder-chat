angular.module('cc')
  .controller('PostController', function($rootScope,$interval, $scope, Auth){
  	$scope.$on('$showPost', function(e,data){
  		$scope.isShowPost = data;
  	});
  	$scope.closePost = function(){
  		var count = 5;
  		angular.element('body').css('overflow','auto');
  		//$rootScope.maskShow = false;
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
    $scope.currentUser = Auth.getCurrentUser().nickname;
    //$scope.tem是用来存放临时tag的。当添加一个后，会被设为空。
    $scope.tem = {
      tag: ''
    };
    $scope.post = {
      title :'',
      author: $scope.currentUser,
      content:'',
      tags:[]
    };
    function check(){
      var isTrue = true;
      if($scope.post.tags.length == 0) return isTrue;
      for(var i = 0; i < $scope.post.tags.length; i ++){
        if($scope.tem.tag.trim() == $scope.post.tags[i]){
          isTrue = false;
        }
      }
      if($scope.post.tags.length >= 5){
        isTrue = false;
      } 
      return isTrue;
    }
    $scope.addTag = function(){
      if($scope.tem.tag && check()){
        $scope.post.tags.push($scope.tem.tag);
        $scope.tem.tag = '';
      }
    };
    $scope.removeTag = function(index){
      $scope.post.tags.splice(index,1);
    };
    $scope.isPosted = false;
    $scope.postForm = function(form){
      if(form.$valid && $scope.post.content){
        console.log('posted');
      } else {
        console.log('error');
        $scope.isPosted = true;
      }
    };



  });