const express = require('express');
const  bcrypt = require('bcryptjs');
const {User} = require('../models/models.js');
const jwt = require('jsonwebtoken');

const ApiError = require('../error.js');

function generateJWT(id, name, login, email, role, vk_ref){
    return jwt.sign({id, email, name, login, role, vk_ref}, 
        process.env.TOKEN_KEY, {
            expiresIn: '24h'
        })
}

class UserController{
    async registration(req, res, next){
        var {name, login, email, password, vk_ref} = req.body;
        if (!password){
            return next(ApiError.badRequest("Неправильный пароль"));
        }
        var hashPassword = await bcrypt.hash(password, 5);
        var candidate_name = await User.findOne({where: {login: login}});
        var candidate_email = await User.findOne({where: {email: email}});
        if (candidate_name){
            return next(ApiError.badRequest("Пользователь с таким именем уже существует!"));
        }
        if (candidate_email){
            return next(ApiError.badRequest("Пользователь с таким email уже существует!"));
        }
        var user = await User.create({login: login, name: name, password: hashPassword, vk_ref: vk_ref, email: email});
        var token = generateJWT(user.id, user.name, user.login, user.email, user.role, user.vk_ref);
        console.log(token);
        res.json({token: token});
    }

    async login(req, res, next){

    }
}

module.exports = new UserController();