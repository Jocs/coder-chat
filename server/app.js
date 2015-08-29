/*
* 1.Connect to Mongdb 
* 2.create a server listen on process.env.PORT or 3000
* 
*/

"use strict"

//set default process.env "development"
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express    = require('express');
var mongoose   = require('mongoose');
var config     = require('./config/environment');
var app        = express();
var server     = require('http').createServer(app);

//connect to Mongdb
mongoose.connect(config.mongo.uri, config.mongo.options);
//监听数据库连接错误
mongoose.connection.on('error', function(err){
	console.log('Mongdb connection error: ' + err);
	process.exit(-1);
});

require('./config/express')(app);
require('./routes')(app);

//start a server 
server.listen(config.port, function(){
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

//exprot app
module.exports = exports = app;


