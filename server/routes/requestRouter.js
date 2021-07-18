const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const requestController = require('../controllers/requestController.js');
const roleMiddleware = require('../middleware/roleMiddlewware.js');
const { request } = require('express');

const router = new express();

router.post('/', authMiddleware,requestController.create);

router.post('/accept', roleMiddleware(['ADMIN']), requestController.accept);

module.exports = router;