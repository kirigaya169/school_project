const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const requestController = require('../controllers/requestController.js');

const router = new express();

router.post('/', authMiddleware,requestController.create);

module.exports = router;