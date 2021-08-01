const {Schema, model} = require('mongoose');

const User = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    class: {type: Number},
    email: {type: String},
    roles: [{type: String, ref: 'Role'}],
    subjects: [{type: String, ref: 'Subject'}],
})

module.exports = model('User', User);