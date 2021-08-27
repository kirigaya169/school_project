const express = require('express');
const  bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const Role = require('../models/role.js');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const { io } = require("../socket.js");

const Notification = require('../models/notification.js');
const ApiError = require('../error.js');
const Subject = require('../models/subject.js');

function generateJWT(user){
    var key = process.env.TOKEN_KEY || "1a2b-3c4d-5e6f-7g8h";
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        class: user.class,
    }
    //console.log(payload);
    return jwt.sign(payload, 
        key, {
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
        //console.log(subjects);
        var subjectsBD = [];
        for (var i = 0; i < subjects.length; i++){
            var subject = await Subject.findOne({value: subjects[i]});
            if (subjects[i] == ''){
                continue;
            }
            if (!subject){
                //console.log(subjects[i]);
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
        //console.log(req.body);
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

    async check(req, res, next){
        const {email} = req.user.email;
        //console.log(req.user);

        const user = await User.findOne({email: req.user.email});
        if (!user) {
            return next(ApiError.badRequest("Неправильные данные!"));
        }
        return res.json({"token": generateJWT(user)});
    }

    async getNotifications(req, res, next){
        const { id } = req.user;
        //sconsole.log("not", req.user);
        const notifications = await Notification.find({user: id});
        return res.json({"notifications" : notifications});
    }

    async readAll(req, res, next){
        const id = req.user.id;
        const notifications = await Notification.find({user: id, readed: false});
        console.log(notifications);
        notifications.forEach(notification => {
            notification.readed = true;
            notification.save();
        });
        return res.json({data: "successfull readed"});
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
        //console.log(user.roles);
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
        //console.log("saved");
        return res.json({data: result});
    }

    async getUsersBySubject(req, res, next){
        const subject = req.query.subject;
        User.find({}, (err, result) => {
            if (err){
                //console.log(err);
                return next(ApiError.internal("Что то пошло не так"));
            }
            const users = [];
            for (let user_id = 0; user_id < result.length; user_id++){
                var user = result[user_id];
                //console.log(user, subject);
                if (user.subjects.includes(subject)){
                    users.push(user);
                }
            }
            //console.log(users);
            return res.json(users);
        });
    }
}

module.exports = new UserController();