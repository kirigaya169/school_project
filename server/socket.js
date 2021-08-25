const express = require('express');
const Server = require("socket.io").Server;
var app = express();
const server = require("http").createServer(app);
const io = new Server(server);
console.log(io);
module.exports = {io, app};