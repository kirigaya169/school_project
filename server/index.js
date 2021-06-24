require('dotenv').config();

const express = require('express')
const sequelize = require('./db.js');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const models = require('./models/models.js');
const router = require('./routes/index.js');
const errorMiddleware = require('./middleware/errorMiddleware.js');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));

app.use('/api', router);
app.use(errorMiddleware);

start = async() => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(process.env.SERVER_PORT || 8000);
    } catch(e){
        console.log(chalk.red(e));
    }
}

start();
