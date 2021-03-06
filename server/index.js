const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const Role = require('./models/role.js');
const Subject = require('./models/subject.js');
const router = require('./routes/index.js');
const errorMiddleware = require('./middleware/errorMiddleware.js');

require('dotenv').config();

const {app, io, server} = require('./socket.js');
io.on("connection", (client) => {
    client.on("join", (data) => {
        console.log(data, client.id);
        client.join(data.user);
        //client.emit("message", "connection");
        client.user = data.user;
    })

    client.on("disconnect", () =>{
        console.log("ds", client.user, client.id);
        client.leave(client.user);
    })
})

//app.use(bodyParser.urlencoded({ extended: false }));

//app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));

app.use('/api', router);
app.use(errorMiddleware);

const dbAdress = process.env.DB_ADDRESS;

const subjects = [
    
]

start = async() => {
    try{
        await mongoose.connect(dbAdress, {
            useNewUrlParser: true,
        });
        var port = process.env.PORT || 8000;
        subjects.forEach((subject) => {
            const subj = new Subject({value: subject});
            subj.save();
        })
        server.listen(port);
        console.log(`Server works on the port ${port}...`);
    } catch(e){
        console.log(chalk.red(e));
    }
}

start();
