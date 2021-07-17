const Request = require('../models/request.js');
const ApiError = require('../middleware/errorMiddleware.js');

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
}

module.exports = new RequestController();