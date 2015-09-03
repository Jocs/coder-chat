'use strict'
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setUp = function(User, config){
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},function(email, password, done){
		User.findOne({
			    email: email.toLowerCase()
		    }, 
			function(err, user){
				if(err) return done(err);
				if(!user) return done(null, false, {field:'email', message:'邮箱输入不正确'});
				if(!user.authenticate(password)){	
					return done(null, false, {field:'password', message: '密码输入不正确'});
			}
			return done(null,user);
		})
	}));
};