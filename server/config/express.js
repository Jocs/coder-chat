/*
* express configration
*/

"use strict"

var express       = require('express');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var errorHandler  = require('errorhandler');
var morgan        = require('morgan');
var session       = require('express-session');
var mongoStore    = require('connect-mongo')(session);
var mongoose      = require('mongoose');
var passport      = require('passport');
var config        = require('./environment');
var path          = require('path');

//暴露一个函数，函数参数就是app
module.exports    = function(app){
	var env = app.get('env');

	app.set('views', path.join(config.root + '/server/views'));
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(passport.initialize());
	//morgan能够在termenal上面打印http请求信息
	app.use(morgan('dev'));

	app.use(session({
	    secret: config.secrets.session,
	    resave: true,
	    saveUninitialized: true,
	    store: new mongoStore({
	      mongooseConnection: mongoose.connection,
	      db: 'passport'
	    })
	}));

	if('development' === env){
		app.use(express.static(path.join(config.root + '/client')));
		app.set('appPath', path.join(config.root + '/client'));
		app.use(errorHandler());
	}

};









