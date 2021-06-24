const express = require('express');
const controller = require('../controllers/userController.js');

const router = new express();

router.post('/registration', controller.registration);

module.exports = router;