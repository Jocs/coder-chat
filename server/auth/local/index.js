'use strict'
/*
* 处理登陆的路由。通过passport来处理登陆。
*
*/
var passport = require('passport');
var auth = require('../auth.service');
var router = require('express').Router();

router.post('/', function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		var error = err || info;
		if(error) return res.status(401).json(error);
		if(!user) return res.status(404).json({message:'Something went wrong, pls try again!'});
		var token = auth.signToken(user._id, user.role);
		res.json({token: token});
	})(req, res, next);
});

module.exports = router;