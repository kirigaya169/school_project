const express = require('express');
const controller = require('../controllers/userController.js');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddlewware.js');

const router = new express();

router.post('/registration',[
    check('username', "Логин не должен быть пустым").notEmpty(),
    check('email', "Email введен неверно").isEmail(),
    check('password', "Пароль должен быть от 4 до 10 символов").isLength({min: 4, max:10}),
], controller.registration);

router.post('/login', controller.login);

router.get('/', roleMiddleware(["USER"]), controller.getUserData);

module.exports = router;