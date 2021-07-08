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
        username: user.username, 
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
        console.log(errors.errors);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors.errors[0].msg));
        }
        var {name, email, username, password, _class, vk_ref, roles, subjects} = req.body;
        console.log(req.body);
        console.log(roles);
        const candidateByName = await User.findOne({username: username});
        const candidateByEmail = await User.findOne({email: email});
        if (candidateByName){
            return next(ApiError.badRequest("Пользователь с таким именем существует"));
        }
        if (candidateByEmail){
            return next(ApiError.badRequest("Пользователь с таким email существует"));
        }
        var subjectsBD = [];
        for (var i = 0; i < subjects.length; i++){
            var subject = await Subject.findOne({value: subjects[i]});
            if (!subject){
                return next(ApiError.badRequest("Неправильный предмет"));
            }
            subjectsBD.push(subject.value);
        }
        var hashPassword = bcrypt.hashSync(password, 7);
        const user = new User({
            password: hashPassword,
            name, username, class: _class, vk_ref, roles: [roles], subjects: subjectsBD,
        });
        await user.save();
        var token = generateJWT(user);
        res.json({token});
    }

    async login(req, res, next){
        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        if (!user){
            return next(ApiError.badRequest("Пользователя с таким именем не существует!"));
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword){
            return next(ApiError.badRequest("Неправильный пароль!"));
        }
        const token = generateJWT(user);
        res.json({token: token});
    }

    getUserData(req, res, next){
        var userMap = {};
        User.find({}, function(err, users){
            users.forEach(function(user){
                userMap[user._id] = user;
            });
            return res.json(userMap);
        })
        
        
    }
}

module.exports = new UserController();