const {Schema, model} = require('mongoose');

const Lesson = new Schema({
    teacher_name: {type: String},
    teacher: {type: String},
    pupil_name: {type: String},
    pupil: {type: String},
    title: {type: String},
    description: {type: String},
    subject: {type: String, ref: 'Subject'},
    date: {type: Date}
});

module.exports = model('Lesson', Lesson);