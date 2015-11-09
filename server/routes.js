/*
* main routes setting
*/

var path = require('path');
var error = require('./components/errors');

module.exports = function(app){
	//登陆认证
	app.use('/auth', require('./auth'));
	//在主文件中注册去的user的路由
	app.use('/api/user', require('./api/user'));
	app.route('/:url(api|components|bower|auth)/*')
	.get(error[404]);
	app.route('/*')
	.get(function(req,res){
		res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
	});
	
};


