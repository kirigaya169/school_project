const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const requestController = require('../controllers/requestController.js');
const roleMiddleware = require('../middleware/roleMiddlewware.js');
const { request } = require('express');

const router = new express();

router.post('/', authMiddleware, requestController.create);

router.get('/', roleMiddleware(['ADMIN']), requestController.getAll);

router.post('/accept', roleMiddleware(['ADMIN']), requestController.accept.bind(requestController));

router.post('/reject', roleMiddleware(['ADMIN']), requestController.reject);

module.exports = router;