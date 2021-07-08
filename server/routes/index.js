const express = require('express');
const userRouter = require('./userRouter.js');
const subjectRouter = require('./subjectRouter.js');

var router = new express();


router.use('/user', userRouter);
router.use('/subjects', subjectRouter);

module.exports = router;