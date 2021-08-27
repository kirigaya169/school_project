const express = require('express');
var app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});
//console.log(io);
module.exports = {io, app, server};