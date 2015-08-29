"use strict"
var path = require('path');
var _    = require('lodash');

var all  = {
  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 3000,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'jocs'
  },

  seedDB: false,

  // List of user roles
  userRoles: ['user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

/*lodash 的使用example*/
/*var users = {
  'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
};

var ages = {
  'data': [{ 'age': 36 }, { 'age': 40 }]
};

_.merge(users, ages);
// → { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }

// using a customizer callback
var object = {
  'fruits': ['apple'],
  'vegetables': ['beet']
};

var other = {
  'fruits': ['banana'],
  'vegetables': ['carrot']
};

_.merge(object, other, function(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
});
// → { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }*/

module.exports = _.merge(
		all,
		require('./' + process.env.NODE_ENV + '.js' || {})
	);





