const {Schema, model} = require('mongoose');

const Subject = new Schema({
    value: {type: String, unique: true},
    
})

module.exports = model('Subject', Subject);