const express = require('express');
const lessonController = require('../controllers/lessonController.js');

const router = new express();

router.get('/', lessonController.getAll);

module.exports = router;