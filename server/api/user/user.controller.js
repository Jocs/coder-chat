'use strict'
var User = require('./user.model');
var auth = require('../../auth/auth.service');

/*
* get all user list
* restriction admin
*/
module.exports.index = function(req, res){
	User.find({},'-salt, -hashedPassword', function(err, users){
		if(err) return res.status(500).send(err);
		if(users) res.status(200).json(users);
	});
};

/*
* create a user
*/
module.exports.create = function(req, res){
	User.create(req.body, function(err, user){
		user.provider = 'local';
		user.role = 'user';
		user.save(function(err, user1){
			if(err) return res.status(422).json(err);
			var token = auth.signToken(user1._id, user1.role);
			res.status(200).json({token: token});
		});
	});
};


/*
* get a single user and return user profile(different form #module.me)
*/
module.exports.show = function(req, res, next){
	var id = req.params.id;
	User.findById(id, function(err,user){
		if(err) return next(err);
		if(!user){
			res.status(403).send('unAuthenrized');
		} else {
			res.status(200).json(user.profile);
		}
	});
}


/*
* get current user info,(single user) "-salt -hashedPassword"
* 在client端通过get(“api/user/me”)来获取个人信息
* 在server端，‘api/user/index.js’中get('/me')
* router.get('/me', auth.isAuthenticated(), controller.me);
* 在isAuthenticated()中express－jwt会吧从token中解析出来的信息user赋予给req.user
* 这样在controller.me中就可以调用req.user._id了
*/
module.exports.me = function(req, res, next){
	var id = req.user._id;
	User.findById(id, '-salt -hashedPassword', function(err, user){ //user中不包含salt 和 hashedpassword
		if(err) return next(err);
		if(!user) return res.status(401).send('Unauthorized');
		res.status(200).json(user);
	});
}


/*
* destory a user
* restriction admin
*/
module.exports.destory = function(req, res){
	var id = req.params.id;
	User.findByIdAndRemove(id, function(err,user){
		if(err) return res.status(500).send(err);
		res.status(204).send('No Content');
	});
};


/*
* changePassword
*/
module.exports.changePassword = function(req,res,err){
	var id = req.user._id;
	var oldPassword = String(req.body.oldPassword);
	var newPassword = String(req.body.newPassword);
	User.findById(id, function(err,user){
		if(err) return res.status(422).json(err);
		if(user.authenticate(oldPassword)){
			user.password = newPassword;
			user.save(function(err){
				if(err) return res.status(422).json(err);
				res.status(200).send('change password success!');
			});
		}
	});
};
/*
* Authentication callback
*/
module.exports.authCallback = function(req,res,next){
	res.redirect('/');
};










