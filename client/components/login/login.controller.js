'use strict'

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
  $scope.errors = {};
  /*处理注册的函数*/
  $scope.signupForm = function (form) {    
    if(form.$valid){
      Auth.createUser($scope.signup)
        .then(function(){
          $location.path('/');
          $rootScope.isLoggedIn = true;
          $modalInstance.close();
        },
        function(err){
          var errors = err.data.errors;
          angular.forEach(errors, function(error){
            form[error.path].$setValidity('mongoose', false);
            $scope.errors[error.path] = error.message;
          });
        }); 
    } else {
      $scope.submitted = true;
    }
  };
/*处理登陆的函数*/
  $scope.isLogged = false;
  $scope.siginError = {};
  $scope.loginForm = function (form) {
    if(form.$valid){
      Auth.login($scope.login)
      .then(function(){
         $location.path('/');
         $rootScope.isLoggedIn = true;
         $modalInstance.close();
      },
      function(err){
        $scope.isLogged = true;
        form[err.field].$setValidity('mongoose', false);
        $scope.siginError[err.field] = err.message;
      });
    } else {
      $scope.isLogged = true;
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});