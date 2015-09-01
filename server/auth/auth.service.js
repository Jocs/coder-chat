'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated(){
	return compose()
		.use(function(req, res, next){
			if(req.query && req.query.hasOwnProperty('access_token')){
				req.headers.authorization = 'Bearer ' + req.query.access_token;
			};
			validateJwt(req, res, next);
		})
		.use(function(req, res, next){
			console.log(req.user);
			User.findById(req.user._id, function(err, user){
				if(err) return next(err);
				if(!user) return res.status(401).send('Unauthorized');
				req.user = user;
				next();
			})
		});
}
function hasRole(roleRequired){
	if(!roleRequired) throw new Error('A requiered role must be set!');
	return compose()
	.use(isAuthenticated())
	.use(function(req, res, next){
		if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)){
			next();
	    } else {
	    	res.status(401).send('Forbidden!');
	    }
	});
}
/*
* make a token by config.secrets.session
*/
function signToken(id, role){
	return jwt.sign({_id:id,role:role}, config.secrets.session, {expiresInMinites: 60*5})
}
function setTokenCookie(req, res){
	if(!req.user) res.status(404).json({ message: 'Something went wrong, please try again.'});
	var token = signToken(req.user._id, req.user.role);
	res.cookie({'token': JSON.stringify(token)});
	res.redirect('/');
}

module.exports = {
	isAuthenticated: isAuthenticated,
	hasRole        : hasRole,
	signToken      : signToken,
	setTokenCookie : setTokenCookie
};
