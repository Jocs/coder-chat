'use strict'

angular.module('cc')
	.factory('Auth', function($http, $cookies, $q, User){
		var currentUser = {};
		if($cookies.get('token')){
			currentUser = User.getMe();
		};
		return {
			/* login method
			*  authenticate user and save token
			*  param: object 
			*  param: callback function(optional)
			*  return: promise object
			*/
			login: function(user,cb){

				var cb = cb || angular.noop;
				var data = {
					email: user.email,
					password: user.password
				};
				var deffered = $q.defer();
				$http.post('/auth/local',data)
					.success(function(data){
						$cookies.put('token',data.token);
						currentUser = User.getMe();
						deffered.resolve(data);
						return cb();
					})
					.error(function(err){
						this.logout();
						deffered.reject(err);
						return cb();
					}.bind(this));
				return deffered.promise;
			},
			/*
			* logout method
			*/
			logout: function(){
				$cookies.remove('token');
				currentUser = {};
			},
			/*
			* createUser
			* @param user object
			* @param cb   funciton optional
			* return promise
			*/
			createUser : function(user, cb){
				var cb = cb || angular.noop;
				return User.save(user,
					function(data){
						$cookies.put('token', data.token);
						currentUser = User.getMe();
						return cb(data);
					},
					function(err){
						this.logout();
						return cb(err);
					}.bind(this)).$promise;
			},
			isLoggedIn: function() {
		        return currentUser.hasOwnProperty('role'); 
		    },
		    isLoggedInAsync: function(cb){
		    	if(currentUser.hasOwnProperty('$promise')){
		    		
		    		currentUser.$promise.then(function(){
		    			cb(true);
		    		},
		    		function(){
		    			cb(false);
		    		});
		    	} else if (currentUser.hasOwnProperty('role')){
		    		cb(true);
		    	} else {
		    		cb(false);
		    	}
		    },
		    //get current user
		    getCurrentUser: function(){
		    	return currentUser;
		    }


		}; 


	});





