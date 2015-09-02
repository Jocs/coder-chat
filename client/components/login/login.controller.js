angular.module('cc').controller('LoginController', 
  function ($rootScope,$scope, $modal, $log) {

  $scope.animationsEnabled = true;

  $rootScope.showLogin = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size
    });

  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('cc').controller('ModalInstanceCtrl', 
  function ($rootScope, $scope, $location, $modalInstance, Auth) {
  $scope.isShowSignup = false;
  
  $scope.change = function(){
    $scope.isShowSignup = !$scope.isShowSignup;
  };

  $scope.signup = {};
  $scope.login = {};

  $scope.submitted = false;

  $scope.signupForm = function (form) {
    
    if(form.$valid){
      Auth.createUser($scope.signup)
        .then(function(){
          $location.path('/');
          $rootScope.isLoggedIn = true;
          $modalInstance.close();
        },
        function(err){
          console.log(err);
        }); 
    } else {
      $scope.submitted = true;
    }
  };

  $scope.loginForm = function () {
    Auth.login($scope.login)
      .then(function(){
        $location.path('/');
        $rootScope.isLoggedIn = true;
      },
      function(err){
        console.log(err);
      });
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});