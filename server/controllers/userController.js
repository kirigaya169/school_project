const express = require('express');
const  bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const Role = require('../models/role.js');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const ApiError = require('../error.js');
const Subject = require('../models/subject.js');

function generateJWT(user){
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        vk_ref: user.vk_ref,
        class: user.class,
    }
    return jwt.sign(payload, 
        process.env.TOKEN_KEY, {
            expiresIn: '24h'
        })
}

class UserController{
    async registration(req, res, next){
        var errors = validationResult(req);
        console.log(req.files);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors.errors[0].msg));
        }
        var {name, email, password, _class, vk_ref, roles, subjects} = req.body;
        const candidateByEmail = await User.findOne({email: email});
        if (candidateByEmail){
            return next(ApiError.badRequest("Пользователь с таким email существует"));
        }
        subjects = subjects.split(',');
        console.log(subjects);
        var subjectsBD = [];
        for (var i = 0; i < subjects.length; i++){
            var subject = await Subject.findOne({value: subjects[i]});
            if (subjects[i] == ''){
                continue;
            }
            if (!subject){
                console.log(subjects[i]);
                return next(ApiError.badRequest("Неправильный предмет"));
            }
            subjectsBD.push(subject.value);
        }
        var hashPassword = bcrypt.hashSync(password, 7);
        const user = new User({
            password: hashPassword,
            name, class: _class, vk_ref, roles: [roles], subjects: subjectsBD, email,
        });
        await user.save();
        var token = generateJWT(user);
        res.json({token});
    }

    async login(req, res, next){
        const {email, password} = req.body;
        console.log(req.body);
        const user = await User.findOne({email: email});
        if (!user){
            return next(ApiError.badRequest("Пользователя с таким email не существует!"));
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword){
            return next(ApiError.badRequest("Неправильный пароль!"));
        }
        const token = generateJWT(user);
        return res.json({token: token});
    }

    getUserData(req, res, next){
        var userMap = [];
        User.find({}, function(err, users){
            users.forEach(function(user){
                if (req.user.email != user.email)
                    userMap.push(user);
            });
            return res.json(userMap);
        })
    }
}

module.exports = new UserController();