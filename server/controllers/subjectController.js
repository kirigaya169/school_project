const Subject = require('../models/subject.js');

class SubjectController{
    async getSubjects(req, res, next){
        Subject.find({}, function(err, subjects){
            var subjectMap = [];
            //console.log(subjects);
            subjects.forEach(function(subject){
                subjectMap.push(subject);
            });
            return res.json({subjects: subjectMap});
        })
    }
}

module.exports = new SubjectController();