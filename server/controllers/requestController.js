const Request = require('../models/request.js');
const User = require('../models/user.js');
const Lesson = require('../models/lesson.js');
const Notification = require('../models/notification.js');
const ApiError = require('../error.js');
const {io} = require('../socket.js');
const request = require('../models/request.js');
const user = require('../models/user.js');

class RequestController{
    constructor(){
        this.dateString = function(m){
            var dateString =
            m.getUTCFullYear() + "." +
            ("0" + (m.getUTCMonth()+1)).slice(-2) + "." +
            ("0" + m.getUTCDate()).slice(-2);
            
            return dateString;
        }
        this.dateString = this.dateString.bind(this);
    
        this.timeString = function(m) {
            var timeString = 
            ("0" + m.getUTCHours()).slice(-2) + ":" +
            ("0" + m.getUTCMinutes()).slice(-2) + ":" +
            ("0" + m.getUTCSeconds()).slice(-2);
            return timeString;
        }
        this.timeString = this.timeString.bind(this);
    }

    async create(req, res){
        var {title, description, subject, date} = req.body;
        var email = req.user.email;
        var author = req.user.name;
        var request = new Request({
            author,
            title, description, author_email: email, subject, date: new Date(date)
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
        var requests = [];
        await Request.find({}, function(err, reqs){
            reqs.forEach(function(req){
                requests.push(req);
            });
            return res.json({requests});
        })
    }

    async accept(req, res, next){
        const id = req.query.id;
        console.log(req.query);
        const {email} = req.body;
        console.log(id);
        var request = await Request.findById(id);
        if (!request){
            return next(ApiError.badRequest("Неправильная заявка"));
        }
        const teacher = await User.findOne({email});
        if (!teacher){
            return next(ApiError.badRequest("Учитель с таким именем не зарегистрирован на сайте!"));
        }
        const requestAuthor = await User.findOne({email: request.author_email});
        const lesson = new Lesson({
            teacher: teacher.email,
            teacher_name: teacher.name,
            pupil: requestAuthor.email,
            pupil_name: requestAuthor.name,
            title: request.title,
            description: request.description,
            subject: request.subject,
            date: new Date(request.date),
        });
        await lesson.save();
        const timeOptions = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
          };
        console.log(this);
        console.log(lesson.date, this.dateString(lesson.date));
        const teacherNotification = new Notification({
            user: teacher._id,
            text: `У вас состоится занятие по предмету ${lesson.subject} ${this.dateString(lesson.date)} в ${this.timeString(lesson.date)}`,
            readed: false,
            date: new Date()
        })
        const userNotification = new Notification({
            user: requestAuthor._id,
            text: `Ваша заявка одобрена! Занятие пройдет ${this.dateString(lesson.date)} в ${this.timeString(lesson.date)}.\n По всем вопросам пишите на третью безполезную почту Маши`,
            readed: false,
            date: new Date(),
        })
        teacherNotification.save();
        userNotification.save();
        //console.log(userNotification);
        io.to(teacher.email).emit("notification", teacherNotification);
        io.to(requestAuthor.email).emit("notification", userNotification);
        await Request.findOneAndDelete({_id: id}, (err) =>{
            if (err){
                console.log(err);
            }
        });
        return res.json({data: "Запись успешно создана!"});
    }

    async reject(req, res, next){
        const id = req.query.id;
        const request =  await Request.findById(id);
        const user = await User.findOne({email: request.author_email});
        await Request.findOneAndDelete({_id: id}, (err) => {
            if (err){
                console.log(err);
                return next(ApiError.badRequest("Не удалось удалить запись"));
            }
        });
        const notification = new Notification({
            user: user._id,
            text: `Ваша заявка по теме "${request.title}" была отклонена`,
            readed: false,
            date: new Date(),
        });
        notification.save();
        io.to(user.email).emit("notification", notification);
        return res.json({data: "Запись успешно удалена"});
    }
}

module.exports = new RequestController();