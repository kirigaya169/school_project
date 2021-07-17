const {Schema, model} = require('mongoose');

const Request = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String},
    description: {type: String},
    subject: {type: String, ref: 'Subject'},
    date: {type: Date}
})

module.exports = model('Request', Request);