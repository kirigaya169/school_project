const express = require('express');
const userRouter = require('./userRouter.js');
const subjectRouter = require('./subjectRouter.js');
const requestRouter = require('./requestRouter.js');
const lessonRouter = require('./lessonRouter.js');

var router = new express();


router.use('/user', userRouter);
router.use('/subjects', subjectRouter);
router.use('/requests', requestRouter);
router.use('/lessons', lessonRouter);

module.exports = router;