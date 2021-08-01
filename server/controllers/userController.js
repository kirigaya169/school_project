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
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors.errors[0].msg));
        }
        var {name, email, password, _class, roles, subjects} = req.body;
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
            name, class: _class, roles: [roles], subjects: subjectsBD, email,
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

    async getUserData(req, res, next){
        var userMap = [];
        User.find({}, function(err, users){
            users.forEach(function(user){
                if (req.user.email != user.email)
                    userMap.push(user);
            });
            return res.json({users: userMap});
        })
    }

    async ChangeAdminRole(req, res, next){
        const {email} = req.body;
        if (!email){
            return next(ApiError.badRequest("Укажите пользователя!"));
        }
        const user = await User.findOne({email});
        if (!user){
            return next(ApiError.badRequest("Неправильный email"));
        }
        console.log(user.roles);
        var result = false;
        const roles = user.roles;
        const index = roles.indexOf("ADMIN");
        if (index > -1){
            roles.splice(index, 1);
        }
        else{
            result = true;
            roles.push("ADMIN");
        }
        user.roles = roles;
        user.save();
        console.log("saved");
        return res.json({data: result});
    }

    async getUsersBySubject(req, res, next){
        const subject = req.query.subject;
        User.find({}, (err, result) => {
            if (err){
                console.log(err);
                return next(ApiError.internal("Что то пошло не так"));
            }
            const users = [];
            for (let user_id = 0; user_id < result.length; user_id++){
                var user = result[user_id];
                console.log(user, subject);
                if (user.subjects.includes(subject)){
                    users.push(user);
                }
            }
            console.log(users);
            return res.json(users);
        });
    }
}

module.exports = new UserController();