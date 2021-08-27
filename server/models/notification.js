const {Schema, model} = require('mongoose');

const Notification = new Schema({
    user: {type: Schema.Types.ObjectId},
    text: {type: String},
    readed: {type: Boolean},
    data: {type: Date},
});

module.exports = model('notification', Notification);