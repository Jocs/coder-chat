angular.module('cc')
  .config(function($stateProvider){
  	$stateProvider
  	  .state('reminder',{
  	  	url:'/reminder',
  	  	templateUrl:'app/reminder/reminder.html',
  	  	controller:'ReminderController'
  	  });
  });