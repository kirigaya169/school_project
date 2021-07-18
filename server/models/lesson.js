const {Schema, model} = require('mongoose');

const Lesson = new Schema({
    teacher: {type: Schema.Types.ObjectId, ref: 'User'},
    pupil: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String},
    description: {type: String},
    subject: {type: String, ref: 'Subject'},
    date: {type: Date}
});

module.exports = model('Lesson', Lesson);