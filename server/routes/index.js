const express = require('express');
const userRouter = require('./userRouter.js');

var router = new express();

router.use('/user', userRouter);

module.exports = router;