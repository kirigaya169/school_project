const {Schema, model} = require('mongoose');

const User = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    class: {type: Number},
    vk_ref: {type: String},
    email: {type: String},
    roles: [{type: String, ref: 'Role'}],
    subjects: [{type: String, ref: 'Subject'}],
})

module.exports = model('User', User);