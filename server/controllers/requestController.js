const Request = require('../models/request.js');
const User = require('../models/user.js');
const Lesson = require('../models/lesson.js');
const ApiError = require('../error.js');

class RequestController{
    async create(req, res){
        var {title, description, subject, date} = req.body;
        var id = req.user.id;
        var request = new Request({
            title, description, id, subject, date
        });
        await request.save();
        return res.json({data: "Запись успешно создана!"});
    }

    async getOne(req, res, next){
        const id = req.params.id;
        try{
            var request = await Request.findById(id);
        }
        catch(e){
            console.log(e);
            return next(ApiError.badRequest("Неправильный ID"));
        }
    }

    async getAll(req, res, next){
        var requests = {};
        await Request.find({}, function(err, reqs){
            reqs.forEach(function(req){
                requests[user._id] = req;
            });
            return res.json(requests);
        })
    }

    async accept(req, res, next){
        const id = req.query.id;
        console.log(req.query);
        const {name} = req.body;
        console.log(id);
        var request = await Request.findById(id);
        if (!request){
            return next(ApiError.badRequest("Неправильная заявка"));
        }
        const teacher = await User.findOne({name});
        if (!teacher){
            return next(ApiError.badRequest("Учитель с таким именем не зарегистрирован на сайте!"));
        }
        const lesson = new Lesson({
            teacher: teacher._id,
            pupil: request.author,
            title: request.title,
            description: request.description,
            subject: request.subject,
            date: request.date,
        });
        await lesson.save();
        await Request.findOneAndDelete({_id: id}, (err) =>{
            if (err){
                console.log(err);
            }
        });
        return res.json({data: "Запись успешно создана!"});
    }

    async reject(req, res, next){
        const id = req.params.id;
        await Request.findOneAndDelete({_id: id}, (err) => {
            if (err){
                console.log(err);
                return next(ApiError.badRequest("Не удалось удалить запись"));
            }
        });
        return res.json({data: "Запись успешно удалена!"});
    }
}

module.exports = new RequestController();