require('dotenv').config();

const express = require('express')
const chalk = require('chalk');
//const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const Role = require('./models/role.js');
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
        await mongoose.connect('mongodb+srv://kirigaya169:mXzuNyx9369LpeP@cluster0.zfvzb.mongodb.net/school_project?retryWrites=true&w=majority', {
            useNewUrlParser: true,
        });
        var port = process.env.SERVER_PORT || 8000;
        app.listen(port);
        console.log(`Server works on the port ${port}...`);
    } catch(e){
        console.log(chalk.red(e));
    }
}

start();
