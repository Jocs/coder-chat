'use strict'

var router = require('express').Router();
var auth = require('../../auth/auth.service');
var controller = require('./user.controller');

router.get('/',auth.hasRole('admin'),controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destory);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
