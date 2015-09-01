"use strict"

/*
* 定义user的模型。schema上面的方法。以及验证
*/

var mongoose = require('mongoose');
var crypto   = require('crypto');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
	nickname      : String,
	name          : String,
	email         : { type: String, lowercase: true},
	hashedPassword: String,
	salt          : String,
	provider      : String,
	role          : { type: String, default : 'user'}    
});

/*
* virtual
*/

UserSchema
  .virtual('password')
  .set(function(password){
  	this._password = password;
  	this.salt = this.makeSalt();
  	this.hashedPassword = this.encryptPassword(password);
  })
  .get(function(){
  	return this._password;
  });
 UserSchema
 	.virtual('profile')
 	.get(function(){
 		return {
 			'name'     : this.name,
 			'role'     : this.role,
 			'nickname' : this.nickname
 		};
 	});
 UserSchema
 	.virtual('token')
 	.get(function(){
 		return {
 			'_id' : this._id,
 			'role': this.role
 		}
 	});
 /*
 * validations
 */

 /*validate email*/

 UserSchema
 	.path('email')
 	.validate(function(email){
 		return email.length;
 	},'email can not be blank!');

/*validate empty password*/
UserSchema
	.path('hashedPassword')
	.validate(function(hashedPassword){
		return hashedPassword.length;
	}, 'Password can not be blank');

/*validate email has not been token*/

UserSchema
	.path('email')
	.validate(function(value, respond){
		//var self = this;
		this.constructor.findOne({email:value}, function(err,user){
			if(err) throw err;
			if(user){
				if(this.id === user.id) return respond(true);
				return respond(false);
			};
			return respond(true);
		}.bind(this));
	},'Email has been used, please use another one!');

/*pre save hook*/
/*
*
*
*/
UserSchema.pre('save', function(next){
	if(!this.isNew) return next();
	if(!(this.hashedPassword && this.hashedPassword.length)) 
		return next(new Error('invalided password'));
	return next();
});

UserSchema.methods = {
	authenticate: function(text){
		return this.encryptPassword(text) === this.hashedPassword;
	},
	makeSalt: function(){
		return crypto.randomBytes(16).toString('base64');
	},
	encryptPassword: function(password) {
	    if (!password || !this.salt) return '';
	    var salt = new Buffer(this.salt, 'base64');
	    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}
};
module.exports = mongoose.model('User', UserSchema);













