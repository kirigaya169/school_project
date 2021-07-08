const express = require('express');
const controller = require('../controllers/subjectController.js');
const {check} = require('express-validator');

const router = new express.Router();

router.get('/', controller.getSubjects);

module.exports = router;