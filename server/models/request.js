const {Schema, model} = require('mongoose');

const Request = new Schema({
    author: {type: String},
    author_email: {type: String, ref: 'User'},
    title: {type: String},
    description: {type: String},
    subject: {type: String, ref: 'Subject'},
    date: {type: Date}
})

module.exports = model('Request', Request);