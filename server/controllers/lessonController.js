const Lesson = require('../models/lesson.js');

class LessonController{
    async getAll(req, res, next){
        var lessons = [];
        await Lesson.find({}, function(err, lssns){
            lssns.forEach(function(lesson){
                lessons.push(lesson);
            });
            return res.json({lessons});
        })
    }
}

module.exports = new LessonController();