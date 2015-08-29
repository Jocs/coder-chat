'use strict'

var router = require('express').Router();
var User = require('../api/user/user.model');
var config = require('../config/environment');

require('./local/passport').setUp(User, config);

router.use('./local', require('./local'));

module.exports = router;