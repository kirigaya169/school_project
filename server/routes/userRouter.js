const express = require('express');
const controller = require('../controllers/userController.js');
const path = require('path');
const {v4: uuid4} = require('uuid');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddlewware.js');

//var upload = require('../middleware/uploadImageMiddleware.js');

const router = new express();

const server = require("http").createServer(router);

router.post('/registration', [
    check('email', "Email введен неверно").isEmail(),
    check('password', "Пароль должен быть от 4 до 10 символов").isLength({min: 4, max:10}),
], controller.registration);

router.post('/login', controller.login);

router.get('/', roleMiddleware(["ADMIN"]), controller.getUserData);

router.post('/change_role', roleMiddleware(["ADMIN"]), controller.ChangeAdminRole);

router.get('/subject', controller.getUsersBySubject);

router.get('/check', authMiddleware, controller.check);

router.get('/notifications', authMiddleware, controller.getNotifications);

router.post('/read', authMiddleware, controller.readAll);

module.exports = router;