const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');
router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.get('/me', userController.me);
router.post('/logout', userController.logout);
module.exports = router;