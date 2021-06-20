require('dotenv').config();

const express = require('express')
const sequelize = require('./db.js');
const chalk = require('chalk');

var app = express();

start = async() => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(8000);
    } catch(e){
        console.log(chalk.red(e));
    }
}

start();
