const {Schema, model} = require('mongoose');

const Notification = new Schema({
    user: {type: Schema.Types.ObjectId},
    text: {type: String},
});

module.exports = model('notification', Notification);